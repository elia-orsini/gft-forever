#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { loadEnv } = require("./load-env");

loadEnv();

const {
  filmKey,
  getUniqueFilmsFromMoviesByDate,
  resolveFilm,
  isResolved,
  ensureTmdbConnectivity,
  checkTmdbConnectivity,
  wait,
} = require("../src/lib/letterboxd-lookup");

const MOVIES_PATH = path.join(__dirname, "../src/data/movies.json");
const CACHE_PATH = path.join(__dirname, "../src/data/letterboxd-cache.json");

function parseArgs(argv) {
  return {
    dryRun: argv.includes("--dry-run"),
    apply: argv.includes("--apply"),
    limit: Number(
      argv.find((arg) => arg.startsWith("--limit="))?.split("=")[1] || 0
    ),
    delayMs: Number(
      argv.find((arg) => arg.startsWith("--delay="))?.split("=")[1] || 500
    ),
    help: argv.includes("--help") || argv.includes("-h"),
    checkTmdb: argv.includes("--check-tmdb"),
  };
}

function loadCache() {
  if (!fs.existsSync(CACHE_PATH)) {
    return { version: 1, updatedAt: null, films: {}, unmatched: [] };
  }

  return JSON.parse(fs.readFileSync(CACHE_PATH, "utf8"));
}

function saveCache(cache) {
  cache.updatedAt = new Date().toISOString();
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
}

function applyCacheToMovies(moviesByDate, cache) {
  for (const date of Object.keys(moviesByDate)) {
    moviesByDate[date] = moviesByDate[date].map((film) => {
      const cached = cache.films[filmKey(film)];
      if (!cached) return film;

      return {
        ...film,
        tmdbId: film.tmdbId || cached.tmdbId || null,
        letterboxdSlug: cached.letterboxdSlug || null,
        letterboxdId: cached.letterboxdId || null,
        letterboxdLid: cached.letterboxdLid || null,
        letterboxdUrl: cached.letterboxdUrl || null,
      };
    });
  }

  return moviesByDate;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    console.log(`Usage: node scripts/enrich-letterboxd-ids.js [options]

Options:
  --dry-run          Resolve films but do not write cache or movies.json
  --apply            Write resolved IDs back into src/data/movies.json
  --limit=N          Process only the first N unresolved unique films
  --delay=MS         Delay between network requests (default: 500)
  --check-tmdb       Test TMDB API connectivity and exit
  --help             Show this help

Environment:
  TMDB_API_KEY       Optional. Used to search TMDB for films missing tmdbId.
  TMDB_API_IP        Optional. Force api.themoviedb.org to resolve to this IP.
  TMDB_API_BASE_URL  Optional. Alternate TMDB API base URL (e.g. a proxy).
`);
    return;
  }

  if (args.checkTmdb) {
    try {
      await checkTmdbConnectivity();
      console.log("TMDB API is reachable.");
    } catch (error) {
      console.error(error.message);
      process.exit(1);
    }
    return;
  }

  const moviesByDate = JSON.parse(fs.readFileSync(MOVIES_PATH, "utf8"));
  const uniqueFilms = getUniqueFilmsFromMoviesByDate(moviesByDate);
  const cache = loadCache();
  const tmdbApiKey = process.env.TMDB_API_KEY || null;

  if (tmdbApiKey) {
    await ensureTmdbConnectivity();
  }

  let processed = 0;
  let resolvedCount = 0;
  let skipped = 0;

  for (const film of uniqueFilms) {
    const key = filmKey(film);
    const existing = cache.films[key];

    if (existing && isResolved(existing)) {
      skipped += 1;
      continue;
    }

    if (args.limit && processed >= args.limit) break;

    processed += 1;
    console.log(`Resolving (${processed}): ${film.name}`);

    try {
      const resolved = await resolveFilm(film, {
        tmdbApiKey,
        requestDelayMs: args.delayMs,
      });

      cache.films[key] = {
        ...resolved,
        matchedAt: new Date().toISOString(),
      };

      if (isResolved(resolved)) {
        resolvedCount += 1;
        console.log(
          `  -> ${resolved.letterboxdUrl || resolved.letterboxdSlug || resolved.tmdbId} (${resolved.source})`
        );
      } else {
        cache.unmatched = [
          ...cache.unmatched.filter((entry) => entry.key !== key),
          {
            key,
            name: film.name,
            directedBy: film.directedBy,
            releaseDate: film.releaseDate,
          },
        ];
        console.log("  -> no match");
      }
    } catch (error) {
      cache.unmatched = [
        ...cache.unmatched.filter((entry) => entry.key !== key),
        {
          key,
          name: film.name,
          directedBy: film.directedBy,
          releaseDate: film.releaseDate,
          error: error.message,
        },
      ];
      console.error(`  -> error: ${error.message}`);
    }

    if (!args.dryRun) {
      saveCache(cache);
    }

    await wait(args.delayMs);
  }

  if (args.apply && !args.dryRun) {
    const updatedMovies = applyCacheToMovies(moviesByDate, cache);
    fs.writeFileSync(MOVIES_PATH, JSON.stringify(updatedMovies, null, 2));
    console.log(`Updated ${MOVIES_PATH}`);
  }

  console.log("");
  console.log(
    `Done. processed=${processed}, resolved=${resolvedCount}, skipped=${skipped}, cache=${Object.keys(cache.films).length}`
  );

  if (!args.apply && !args.dryRun) {
    console.log("Run with --apply to merge resolved IDs into movies.json");
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
