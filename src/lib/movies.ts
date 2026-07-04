import dayjs from "dayjs";

import { IFilm } from "@/types/IFilm";
import parseFilmName from "@/utils/parseFilmName";

import moviesData from "../data/movies.json";

type MoviesByDate = Record<string, IFilm[]>;

const movies = moviesData as unknown as MoviesByDate;

export type FilmListItem = {
  id: string;
  title: string;
  year: string | null;
  releaseDate: string | null;
  rating: number | null;
  letterboxdUrl: string | null;
  firstScreeningDate: string;
  lastScreeningDate: string;
};

export type CalendarMeta = {
  minDate: string;
  maxDate: string;
  datesWithFilms: string[];
};

export function dedupeFilms(films: IFilm[]): IFilm[] {
  return films.filter(
    (film, index, self) =>
      index ===
      self.findIndex(
        (m) => m.name === film.name || m.posterImage === film.posterImage
      )
  );
}

export function getFilmsByDate(date: string): IFilm[] {
  return dedupeFilms(movies[date] ?? []);
}

export function getCalendarMeta(): CalendarMeta {
  const dates = Object.keys(movies).sort();

  return {
    minDate: dates[0],
    maxDate: dates[dates.length - 1],
    datesWithFilms: dates.filter((date) => movies[date].length > 0),
  };
}

export function getAllFilms(): FilmListItem[] {
  const films: FilmListItem[] = [];

  for (const date of Object.keys(movies).sort()) {
    for (const film of movies[date]) {
      const title = parseFilmName(film.name);
      const year = film.releaseDate
        ? `${dayjs(film.releaseDate).year()}`
        : null;
      const letterboxdUrl =
        film.letterboxdUrl ||
        (film.tmdbId ? `https://letterboxd.com/tmdb/${film.tmdbId}` : null);

      const existing = films.find(
        (entry) => entry.title === title && entry.year === year
      );

      if (existing) {
        existing.lastScreeningDate = date;
        existing.rating = existing.rating ?? film.rating ?? null;
        existing.letterboxdUrl = existing.letterboxdUrl ?? letterboxdUrl;
        continue;
      }

      films.push({
        id: `${title}_${year ?? "unknown"}_${date}`,
        title,
        year,
        releaseDate: film.releaseDate || null,
        rating: film.rating || null,
        letterboxdUrl,
        firstScreeningDate: date,
        lastScreeningDate: date,
      });
    }
  }

  return films;
}
