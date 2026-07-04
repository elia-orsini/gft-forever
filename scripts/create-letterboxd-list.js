#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const {
  isResolved,
  filmKey,
  parseFilmName,
  LETTERBOXD_BASE,
} = require("../src/lib/letterboxd-lookup");

const MOVIES_PATH = path.join(__dirname, "../src/data/movies.json");
const CACHE_PATH = path.join(__dirname, "../src/data/letterboxd-cache.json");
const EXPORT_PATH = path.join(
  __dirname,
  "../src/data/letterboxd-list-export.txt"
);
const EXPORT_CSV_PATH = path.join(
  __dirname,
  "../src/data/gft-screenings-letterboxd-list.csv"
);

function parseArgs(argv) {
  return {
    help: argv.includes("--help") || argv.includes("-h"),
    dryRun: argv.includes("--dry-run"),
  };
}

function loadCache() {
  if (!fs.existsSync(CACHE_PATH)) {
    return { films: {} };
  }

  return JSON.parse(fs.readFileSync(CACHE_PATH, "utf8"));
}

function getFilmsForExport() {
  const moviesByDate = JSON.parse(fs.readFileSync(MOVIES_PATH, "utf8"));
  const cache = loadCache();
  const films = [];

  for (const date of Object.keys(moviesByDate).sort()) {
    for (const film of moviesByDate[date]) {
      const existing = films.find(
        (entry) =>
          entry.name === film.name || entry.posterImage === film.posterImage
      );

      if (existing) {
        existing.lastScreeningDate = date;
        continue;
      }

      const cached = cache.films[filmKey(film)] || {};
      const merged = {
        name: film.name,
        directedBy: film.directedBy,
        releaseDate: film.releaseDate,
        posterImage: film.posterImage,
        firstScreeningDate: date,
        lastScreeningDate: date,
        tmdbId: film.tmdbId || cached.tmdbId || null,
        letterboxdSlug: film.letterboxdSlug || cached.letterboxdSlug || null,
        letterboxdId: film.letterboxdId || cached.letterboxdId || null,
        letterboxdLid: film.letterboxdLid || cached.letterboxdLid || null,
        letterboxdUrl:
          film.letterboxdUrl ||
          cached.letterboxdUrl ||
          (film.tmdbId ? `${LETTERBOXD_BASE}/tmdb/${film.tmdbId}/` : null),
      };

      films.push(merged);
    }
  }

  films.sort((a, b) =>
    a.firstScreeningDate.localeCompare(b.firstScreeningDate)
  );

  const resolved = films.filter((film) => isResolved(film));
  const unresolved = films.filter((film) => !isResolved(film));

  return { films, resolved, unresolved };
}

function csvEscape(value) {
  if (value == null || value === "") return "";

  const str = String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '\\"')}"`;
  }

  return str;
}

function toLetterboxdUri(film) {
  if (
    film.letterboxdUrl &&
    film.letterboxdUrl.includes("/film/") &&
    !film.letterboxdUrl.includes("/tmdb/")
  ) {
    return film.letterboxdUrl;
  }

  if (film.letterboxdSlug) {
    return `${LETTERBOXD_BASE}/film/${film.letterboxdSlug}/`;
  }

  return "";
}

function dedupeFilmsForExport(films) {
  const seen = new Set();
  const deduped = [];

  for (const film of films) {
    const dedupeKey =
      film.tmdbId ||
      film.letterboxdSlug ||
      `${parseFilmName(film.name)}|${film.releaseDate}|${film.directedBy}`;

    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);
    deduped.push(film);
  }

  return deduped;
}

function exportCsv(films) {
  const headers = [
    "LetterboxdURI",
    "tmdbID",
    "Title",
    "Year",
    "Directors",
    "Review",
  ];

  const rows = [];

  for (const film of films) {
    const title = parseFilmName(film.name);
    const year = film.releaseDate
      ? new Date(film.releaseDate).getFullYear()
      : "";
    const uri = toLetterboxdUri(film);
    const note =
      film.firstScreeningDate === film.lastScreeningDate
        ? `GFT screening: ${film.firstScreeningDate}`
        : `GFT screenings: ${film.firstScreeningDate} – ${film.lastScreeningDate}`;

    rows.push({
      firstScreeningDate: film.firstScreeningDate,
      line: [
        csvEscape(uri),
        csvEscape(film.tmdbId || ""),
        csvEscape(title),
        csvEscape(year),
        csvEscape(film.directedBy || ""),
        csvEscape(note),
      ].join(","),
    });
  }

  rows.sort((a, b) => a.firstScreeningDate.localeCompare(b.firstScreeningDate));

  const csv = `\ufeff${headers.join(",")}\n${rows
    .map((row) => row.line)
    .join("\n")}\n`;
  fs.writeFileSync(EXPORT_CSV_PATH, csv, "utf8");
  console.log(`Exported ${rows.length} films to ${EXPORT_CSV_PATH}`);
}

function exportList(films) {
  const lines = films.map((film, index) => {
    const title = parseFilmName(film.name);
    const year = film.releaseDate
      ? new Date(film.releaseDate).getFullYear()
      : "?";
    const url =
      film.letterboxdUrl ||
      (film.letterboxdSlug
        ? `${LETTERBOXD_BASE}/film/${film.letterboxdSlug}/`
        : `${LETTERBOXD_BASE}/tmdb/${film.tmdbId}/`);

    return `${index + 1}. [${film.firstScreeningDate}] ${title} (${year}) - ${
      url || "unresolved"
    }`;
  });

  fs.writeFileSync(EXPORT_PATH, `${lines.join("\n")}\n`);
  console.log(`Exported ${films.length} films to ${EXPORT_PATH}`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    console.log(`Usage: yarn create-letterboxd-list [options]

Exports a Letterboxd-importable CSV of every unique GFT film, ordered by
first screening date.

Options:
  --dry-run    Show counts without writing files

Output:
  src/data/gft-screenings-letterboxd-list.csv
  src/data/letterboxd-list-export.txt

Import on Letterboxd:
  1. Run: yarn create-letterboxd-list
  2. Lists → New list → Import
  3. Upload src/data/gft-screenings-letterboxd-list.csv

Before running (optional, improves matching):
  yarn enrich-letterboxd --apply
`);
    return;
  }

  const { films, resolved, unresolved } = getFilmsForExport();
  const dedupedFilms = dedupeFilmsForExport(films);

  console.log(`Resolved films: ${resolved.length}`);
  console.log(`Unresolved films: ${unresolved.length}`);
  console.log(`Unique films for export: ${dedupedFilms.length}`);

  if (args.dryRun) {
    return;
  }

  exportCsv(dedupedFilms);
  exportList(dedupedFilms);

  if (unresolved.length) {
    console.log(
      `${unresolved.length} films included with title/year/director only — review these on Letterboxd's import preview screen.`
    );
  }
}

main();
