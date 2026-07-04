# GFT Screenings

A Next.js app that tracks and displays films screened at [Glasgow Film Theatre](https://www.glasgowfilm.org). Browse screenings by date, explore the full archive, and export a Letterboxd list of everything GFT has shown.

## What it does

- **Calendar view** (`/`) — pick a date and see that day's screenings with posters, directors, ratings, and links to Letterboxd / YouTube trailers.
- **All films** (`/all`) — browse every unique film in the archive, sortable by first or last screening date.
- **Automated scraping** — a GitHub Action periodically fetches new listings from GFT's GraphQL API and updates the local film database.
- **Letterboxd integration** — resolve Letterboxd IDs for films and export a chronologically ordered CSV for importing as a Letterboxd list.

## Data

All screening data lives in `src/data/movies.json`, keyed by date:

```json
{
  "2026-06-13": [
    {
      "name": "Full Time",
      "directedBy": "Eric Gravel",
      "releaseDate": "2022-03-16",
      "posterImage": "https://…",
      "trailerYoutubeId": null,
      "tmdbId": "833417",
      "rating": 3.83,
      "letterboxdSlug": "full-time-2021",
      "letterboxdId": "748985",
      "letterboxdUrl": "https://letterboxd.com/film/full-time-2021/"
    }
  ]
}
```

The scrape script also enriches films with Letterboxd ratings and URLs when a `tmdbId` is available.

## Setup

```bash
yarn
cp .env.example .env   # optional — only needed for Letterboxd/TMDB scripts
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Create a `.env` file in the project root (gitignored). Scripts load it automatically.

| Variable | Required for | Description |
|---|---|---|
| `TMDB_API_KEY` | `enrich-letterboxd` | [TMDB API key](https://www.themoviedb.org/settings/api). Improves matching for films missing `tmdbId`. |
| `TMDB_API_IP` | `enrich-letterboxd` | Force `api.themoviedb.org` to a known CloudFront IP when DNS is poisoned. |
| `TMDB_API_BASE_URL` | `enrich-letterboxd` | Alternate TMDB API base URL (e.g. a reverse proxy). |

## Scripts

### App

| Command | Description |
|---|---|
| `yarn dev` | Start the development server. |
| `yarn build` | Production build. |
| `yarn start` | Serve the production build. |
| `yarn lint` | Run ESLint. |

### Data pipeline

| Command | Description |
|---|---|
| `yarn scrape-films` | Fetch screenings from GFT for a rolling ±20 day window and merge into `movies.json`. Also pulls Letterboxd ratings/URLs for films with a `tmdbId`. |

The scrape runs automatically every 5 days via GitHub Actions (`.github/workflows/scrape-films.yml`).

### Letterboxd enrichment

```bash
yarn enrich-letterboxd
```

Resolves Letterboxd metadata for each unique film and writes results to `src/data/letterboxd-cache.json`. For each film it tries, in order:

1. Extract numeric ID from the poster URL
2. Follow `letterboxd.com/tmdb/{id}` to get the slug and URL
3. Search TMDB by title, year, and director (requires `TMDB_API_KEY`) for films missing `tmdbId`

**Options:**

| Flag | Description |
|---|---|
| `--apply` | Merge resolved IDs into `src/data/movies.json` (adds `letterboxdSlug`, `letterboxdId`, `letterboxdUrl` fields). |
| `--dry-run` | Resolve films but don't write any files. |
| `--limit=N` | Process only the first N unresolved films (useful for testing). |
| `--delay=MS` | Delay between network requests in milliseconds (default: 500). |

**Examples:**

```bash
# Full enrichment, cache only
yarn enrich-letterboxd

# Test on 10 films without writing
yarn enrich-letterboxd --dry-run --limit=10

# Enrich and update movies.json
yarn enrich-letterboxd --apply
```

**TMDB connectivity:** If `enrich-letterboxd` fails with `ETIMEDOUT` or TLS certificate errors, your DNS resolver is likely returning wrong IPs for `api.themoviedb.org` (common in mainland China). The script auto-tries fallback CloudFront IPs, or you can test with:

```bash
yarn enrich-letterboxd --check-tmdb
```

Set `TMDB_API_IP` in `.env` to pin a working IP, use a VPN, or set `TMDB_API_BASE_URL` to a proxy.

### Letterboxd list export

```bash
yarn create-letterboxd-list
```

Generates a Letterboxd-importable CSV ordered by **first GFT screening date** (oldest first). Also writes a plain-text URL list for reference.

**Output files** (gitignored):

| File | Description |
|---|---|
| `src/data/gft-screenings-letterboxd-list.csv` | Import this into Letterboxd. |
| `src/data/letterboxd-list-export.txt` | Human-readable list with dates and URLs. |

**CSV columns:** `LetterboxdURI`, `tmdbID`, `Title`, `Year`, `Directors`, `Review` (screening date notes).

**Import on Letterboxd:**

1. Lists → New list → Import
2. Upload `gft-screenings-letterboxd-list.csv`
3. Review the preview screen — films matched by title/year/director only may need manual correction

**Options:**

| Flag | Description |
|---|---|
| `--dry-run` | Print counts without writing files. |

**Examples:**

```bash
yarn create-letterboxd-list
yarn create-letterboxd-list --dry-run
```

### Typical workflow

```bash
# 1. Update screening data
yarn scrape-films

# 2. Resolve Letterboxd IDs (optional but improves CSV matching)
yarn enrich-letterboxd --apply

# 3. Export chronologically ordered CSV
yarn create-letterboxd-list

# 4. Import CSV into Letterboxd
```

## Project structure

```
src/
├── components/       # React UI (calendar, film cards, header, footer)
├── data/
│   └── movies.json   # Screening database (committed)
├── lib/
│   ├── movies.ts     # Read/query film data
│   ├── gft-screenings-request.js  # GFT scraper
│   └── letterboxd-lookup.js       # Letterboxd ID resolution
├── pages/
│   ├── index.tsx     # Calendar view
│   ├── all.tsx       # Full film archive
│   └── api/          # API routes for films and calendar metadata
├── types/
│   └── IFilm.ts      # Film type definition
└── utils/            # Name parsing, sorting helpers

scripts/
├── enrich-letterboxd-ids.js   # Backfill Letterboxd metadata
├── create-letterboxd-list.js  # Export/create Letterboxd list
└── load-env.js                # .env loader for scripts
```

## Merging `movies.json`

When resolving git merge conflicts on `movies.json`, **don't pick one side wholesale** — the github-bot scrape and local changes often cover different date ranges. Merge by taking the **union of all dates** from both versions, preferring the newer scrape for overlapping dates.

```bash
# If data was lost, recover from the pre-merge commit:
git show <commit-before-merge>:src/data/movies.json > /tmp/movies-recovered.json
# Then merge dates from both files
```
