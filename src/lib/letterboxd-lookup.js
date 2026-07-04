const axios = require("axios");
const dns = require("dns");
const https = require("https");

const LETTERBOXD_BASE = "https://letterboxd.com";
const TMDB_HOST = "api.themoviedb.org";
const TMDB_BASE = (
  process.env.TMDB_API_BASE_URL || `https://${TMDB_HOST}/3`
).replace(/\/$/, "");

const TMDB_FALLBACK_IPS = [
  "13.224.185.118",
  "13.224.185.66",
  "108.156.46.56",
  "108.156.46.80",
  "108.138.36.24",
  "99.84.215.108",
];

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36";

const REQUEST_TIMEOUT_MS = 20000;
const TMDB_PROBE_TIMEOUT_MS = 5000;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let tmdbHttpsAgent = null;
let tmdbConnectivityChecked = false;

function isTmdbNetworkError(error) {
  const message = error?.message || "";

  return (
    ["ETIMEDOUT", "ECONNREFUSED", "ECONNRESET", "ENOTFOUND", "EAI_AGAIN", "ECONNABORTED"].includes(
      error?.code
    ) ||
    message.includes("certificate") ||
    message.includes("altnames") ||
    message.includes("TLS connection was established")
  );
}

function createTmdbHttpsAgent(ip) {
  return new https.Agent({
    lookup: (hostname, options, callback) => {
      if (hostname === TMDB_HOST && ip) {
        callback(null, ip, 4);
        return;
      }

      dns.lookup(hostname, options, callback);
    },
  });
}

function getTmdbAxiosConfig() {
  return {
    timeout: REQUEST_TIMEOUT_MS,
    ...(tmdbHttpsAgent ? { httpsAgent: tmdbHttpsAgent } : {}),
  };
}

async function probeTmdbEndpoint(config) {
  await axios.get(`${TMDB_BASE}/configuration`, {
    ...config,
    params: { api_key: process.env.TMDB_API_KEY || "probe" },
    validateStatus: (status) => status === 401 || status === 200,
  });
}

async function ensureTmdbConnectivity() {
  if (tmdbConnectivityChecked) return;
  tmdbConnectivityChecked = true;

  if (process.env.TMDB_API_BASE_URL) {
    await probeTmdbEndpoint({ timeout: TMDB_PROBE_TIMEOUT_MS });
    return;
  }

  if (process.env.TMDB_API_IP) {
    tmdbHttpsAgent = createTmdbHttpsAgent(process.env.TMDB_API_IP);
    await probeTmdbEndpoint(getTmdbAxiosConfig());
    console.warn(`TMDB using TMDB_API_IP=${process.env.TMDB_API_IP}`);
    return;
  }

  try {
    await probeTmdbEndpoint({ timeout: TMDB_PROBE_TIMEOUT_MS });
    return;
  } catch (error) {
    if (!isTmdbNetworkError(error)) throw error;
    console.warn(
      `TMDB DNS lookup failed (${error.code || error.message}), trying fallback IPs...`
    );
  }

  for (const ip of TMDB_FALLBACK_IPS) {
    try {
      const config = {
        timeout: TMDB_PROBE_TIMEOUT_MS,
        httpsAgent: createTmdbHttpsAgent(ip),
      };
      await probeTmdbEndpoint(config);
      tmdbHttpsAgent = config.httpsAgent;
      console.warn(`TMDB reachable via fallback IP ${ip}`);
      return;
    } catch (error) {
      if (!isTmdbNetworkError(error)) throw error;
    }
  }

  throw new Error(
    "Cannot reach TMDB API (api.themoviedb.org). Your DNS resolver is likely returning wrong IPs. " +
      "Try a VPN, set TMDB_API_IP to a working CloudFront IP, or set TMDB_API_BASE_URL to a proxy."
  );
}

async function checkTmdbConnectivity() {
  tmdbConnectivityChecked = false;
  tmdbHttpsAgent = null;
  await ensureTmdbConnectivity();
}

function parseFilmName(filmName) {
  let name = filmName.toLowerCase();

  name = name.replace("preview: ", "");
  name = name.replace("+ q&a", "");
  name = name.replace("+ recorded q&a", "");
  name = name.replace(" (subtitled)", "");
  name = name.replace(" (dubbed)", "");
  name = name.replace(/\(.*\)/, "");
  name = name.replace(/-.*th anniversary/, "");
  name = name.replace("youth screening: ", "");
  name = name.replace("massive presents - preview:", "");
  name = name.replace(" + introduction", "");
  name = name.replace("take 2: ", "");
  name = name.replace("visible cinema: ", "");
  name = name.replace("access film club: ", "");
  name = name.replace("movie memories: ", "");

  return name.trim();
}

function filmKey(film) {
  return [film.posterImage, film.name, film.directedBy, film.releaseDate].join(
    "|"
  );
}

function dedupeFilms(films) {
  const seen = new Set();
  const unique = [];

  for (const film of films) {
    const key = filmKey(film);
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(film);
  }

  return unique;
}

function getUniqueFilmsFromMoviesByDate(moviesByDate) {
  const allFilms = [];

  for (const films of Object.values(moviesByDate)) {
    allFilms.push(...films);
  }

  return dedupeFilms(allFilms);
}

function extractLetterboxdIdFromPoster(posterImage) {
  if (!posterImage || !posterImage.includes("ltrbxd.com")) return null;

  const match = posterImage.match(/\/(\d{5,})-[^/?]+\.(jpg|png|webp)/i);
  return match ? match[1] : null;
}

function extractNumericIdFromHtml(html, tmdbId) {
  const posterMatch = html.match(/\/(\d{5,})-[^/"'?]+\.(jpg|png|webp)/i);
  if (posterMatch) return posterMatch[1];

  const candidates = [
    ...new Set([...html.matchAll(/[^\d](\d{6})[^\d]/g)].map((m) => m[1])),
  ];

  if (tmdbId) {
    const filtered = candidates.filter((id) => id !== String(tmdbId));
    if (filtered.length === 1) return filtered[0];
  }

  return candidates[0] || null;
}

async function resolveViaTmdbRedirect(tmdbId) {
  const response = await axios.get(`${LETTERBOXD_BASE}/tmdb/${tmdbId}/`, {
    maxRedirects: 5,
    timeout: REQUEST_TIMEOUT_MS,
    headers: { "User-Agent": USER_AGENT },
  });

  const finalUrl =
    response.request?.res?.responseUrl ||
    response.request?.responseURL ||
    response.config.url;

  const slugMatch = finalUrl.match(/\/film\/([^/]+)\/?$/);
  const slug = slugMatch ? slugMatch[1] : null;

  return {
    letterboxdSlug: slug,
    letterboxdId: extractNumericIdFromHtml(response.data, tmdbId),
    letterboxdUrl: slug ? `${LETTERBOXD_BASE}/film/${slug}/` : null,
    source: "tmdb-redirect",
  };
}

async function resolveLetterboxdLidFromSlug(slug) {
  const response = await axios.head(`${LETTERBOXD_BASE}/film/${slug}/`, {
    headers: { "User-Agent": USER_AGENT },
    maxRedirects: 5,
    timeout: REQUEST_TIMEOUT_MS,
  });

  return response.headers["x-letterboxd-identifier"] || null;
}

async function searchTmdb(title, year, director, apiKey) {
  await ensureTmdbConnectivity();

  const params = {
    api_key: apiKey,
    query: title,
    include_adult: false,
  };

  if (year) params.year = year;

  const response = await axios.get(`${TMDB_BASE}/search/movie`, {
    params,
    ...getTmdbAxiosConfig(),
  });
  const results = response.data.results || [];

  if (!results.length) return null;

  const normalizedDirector = (director || "").toLowerCase();

  for (const result of results) {
    if (!normalizedDirector || normalizedDirector === "various") {
      return result;
    }

    const credits = await axios.get(`${TMDB_BASE}/movie/${result.id}/credits`, {
      params: { api_key: apiKey },
      ...getTmdbAxiosConfig(),
    });

    const directors = (credits.data.crew || [])
      .filter((person) => person.job === "Director")
      .map((person) => person.name.toLowerCase());

    if (
      directors.some(
        (name) =>
          name.includes(normalizedDirector) ||
          normalizedDirector.includes(name)
      )
    ) {
      return result;
    }

    await wait(250);
  }

  return results[0];
}

async function resolveFilm(film, options = {}) {
  const { tmdbApiKey, requestDelayMs = 500 } = options;
  const result = {
    name: film.name,
    directedBy: film.directedBy,
    releaseDate: film.releaseDate,
    tmdbId: film.tmdbId || null,
    letterboxdSlug: null,
    letterboxdId: null,
    letterboxdLid: null,
    letterboxdUrl: null,
    source: null,
  };

  const posterId = extractLetterboxdIdFromPoster(film.posterImage);
  if (posterId) {
    result.letterboxdId = posterId;
    result.source = "poster";
  }

  if (film.tmdbId) {
    await wait(requestDelayMs);
    const redirect = await resolveViaTmdbRedirect(film.tmdbId);
    result.letterboxdSlug = redirect.letterboxdSlug;
    result.letterboxdId = result.letterboxdId || redirect.letterboxdId;
    result.letterboxdUrl = redirect.letterboxdUrl;
    result.source = result.source || redirect.source;
  } else if (tmdbApiKey) {
    const parsedTitle = parseFilmName(film.name);
    const year = film.releaseDate
      ? new Date(film.releaseDate).getFullYear()
      : null;

    await wait(requestDelayMs);
    const tmdbMatch = await searchTmdb(
      parsedTitle,
      year,
      film.directedBy,
      tmdbApiKey
    );

    if (tmdbMatch) {
      result.tmdbId = String(tmdbMatch.id);
      await wait(requestDelayMs);
      const redirect = await resolveViaTmdbRedirect(result.tmdbId);
      result.letterboxdSlug = redirect.letterboxdSlug;
      result.letterboxdId = result.letterboxdId || redirect.letterboxdId;
      result.letterboxdUrl = redirect.letterboxdUrl;
      result.source = "tmdb-search";
    }
  }

  if (result.letterboxdSlug && !result.letterboxdLid) {
    await wait(requestDelayMs);
    result.letterboxdLid = await resolveLetterboxdLidFromSlug(
      result.letterboxdSlug
    );
  }

  if (!result.letterboxdUrl && result.letterboxdSlug) {
    result.letterboxdUrl = `${LETTERBOXD_BASE}/film/${result.letterboxdSlug}/`;
  }

  if (!result.letterboxdUrl && result.tmdbId) {
    result.letterboxdUrl = `${LETTERBOXD_BASE}/tmdb/${result.tmdbId}/`;
  }

  return result;
}

function isResolved(resolvedFilm) {
  return Boolean(
    resolvedFilm.letterboxdSlug ||
      resolvedFilm.letterboxdId ||
      resolvedFilm.letterboxdLid ||
      resolvedFilm.tmdbId
  );
}

module.exports = {
  parseFilmName,
  filmKey,
  dedupeFilms,
  getUniqueFilmsFromMoviesByDate,
  extractLetterboxdIdFromPoster,
  extractNumericIdFromHtml,
  resolveViaTmdbRedirect,
  resolveLetterboxdLidFromSlug,
  resolveFilm,
  isResolved,
  ensureTmdbConnectivity,
  checkTmdbConnectivity,
  wait,
  LETTERBOXD_BASE,
};
