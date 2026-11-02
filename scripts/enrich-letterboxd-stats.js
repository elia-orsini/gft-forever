#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { loadEnv } = require("./load-env");

loadEnv();

const {
  filmKey,
  getUniqueFilmsFromMoviesByDate,
  fetchLetterboxdStats,
  needsLetterboxdStats,
  wait,
} = require("../src/lib/letterboxd-lookup");

const MOVIES_PATH = path.join(__dirname, "../src/data/movies.json");
const CACHE_PATH = path.join(__dirname, "../src/data/letterboxd-stats-cache.json");

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
  };
}

function loadCache() {
  if (!fs.existsSync(CACHE_PATH)) {
    return { version: 1, updatedAt: null, byUrl: {}, errors: [] };
  }

  return JSON.parse(fs.readFileSync(CACHE_PATH, "utf8"));
}

function saveCache(cache) {
  cache.updatedAt = new Date().toISOString();
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
}

function getFilmsNeedingStats(uniqueFilms) {
  return uniqueFilms.filter(needsLetterboxdStats);
}

function applyStatsToMovies(moviesByDate, cache) {
  for (const date of Object.keys(moviesByDate)) {
    moviesByDate[date] = moviesByDate[date].map((film) => {
      if (!film.letterboxdUrl) return film;

      const cached = cache.byUrl[film.letterboxdUrl];
      if (!cached) return film;

      return {
        ...film,
        releaseDate: film.releaseDate || cached.releaseDate || film.releaseDate,
        rating:
          film.rating === undefined || film.rating === null
            ? cached.rating ?? film.rating
            : film.rating,
      };
    });
  }

  return moviesByDate;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    console.log(`Usage: node scripts/enrich-letterboxd-stats.js [options]

Fetches Letterboxd ratings and release years for films that already have
letterboxdUrl but are missing rating and/or releaseDate.

Options:
  --dry-run          Fetch stats but do not write cache or movies.json
  --apply            Write fetched stats back into src/data/movies.json
  --limit=N          Process only the first N films needing enrichment
  --delay=MS         Delay between network requests (default: 500)
  --help             Show this help
`);
    return;
  }

  const moviesByDate = JSON.parse(fs.readFileSync(MOVIES_PATH, "utf8"));
  const uniqueFilms = getUniqueFilmsFromMoviesByDate(moviesByDate);
  const filmsNeedingStats = getFilmsNeedingStats(uniqueFilms);
  const cache = loadCache();

  let processed = 0;
  let enriched = 0;
  let skipped = 0;
  let failed = 0;

  for (const film of filmsNeedingStats) {
    const url = film.letterboxdUrl;
    const existing = cache.byUrl[url];

    if (
      existing &&
      !existing.error &&
      (existing.rating !== null || existing.releaseDate)
    ) {
      const hasNeededRating =
        film.rating === undefined || film.rating === null
          ? existing.rating !== null
          : true;
      const hasNeededReleaseDate = film.releaseDate ? true : Boolean(existing.releaseDate);

      if (hasNeededRating && hasNeededReleaseDate) {
        skipped += 1;
        continue;
      }
    }

    if (args.limit && processed >= args.limit) break;

    processed += 1;
    console.log(`Fetching (${processed}): ${film.name}`);
    console.log(`  -> ${url}`);

    try {
      const stats = await fetchLetterboxdStats(url);

      if (!stats) {
        failed += 1;
        cache.byUrl[url] = {
          error: "no-json-ld",
          fetchedAt: new Date().toISOString(),
        };
        console.log("  -> no stats found");
      } else {
        cache.byUrl[url] = {
          ...stats,
          fetchedAt: new Date().toISOString(),
        };
        enriched += 1;
        console.log(
          `  -> rating=${stats.rating ?? "-"}, releaseDate=${stats.releaseDate ?? "-"}`
        );
      }
    } catch (error) {
      failed += 1;
      cache.byUrl[url] = {
        error: error.message,
        fetchedAt: new Date().toISOString(),
      };
      cache.errors = [
        ...cache.errors.filter((entry) => entry.url !== url),
        {
          url,
          name: film.name,
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
    const updatedMovies = applyStatsToMovies(moviesByDate, cache);
    fs.writeFileSync(MOVIES_PATH, JSON.stringify(updatedMovies, null, 2));
    console.log(`Updated ${MOVIES_PATH}`);
  }

  console.log("");
  console.log(
    `Done. needing=${filmsNeedingStats.length}, processed=${processed}, enriched=${enriched}, skipped=${skipped}, failed=${failed}`
  );

  if (!args.apply && !args.dryRun && enriched > 0) {
    console.log("Run with --apply to merge stats into movies.json");
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
