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
  const films: (FilmListItem & { posterImage: string; rawName: string })[] =
    [];

  for (const date of Object.keys(movies).sort()) {
    for (const film of movies[date]) {
      const existing = films.find(
        (entry) =>
          entry.rawName === film.name ||
          entry.posterImage === film.posterImage
      );

      if (existing) {
        existing.lastScreeningDate = date;
        continue;
      }

      films.push({
        rawName: film.name,
        posterImage: film.posterImage,
        id: `${film.posterImage}_${date}`,
        title: parseFilmName(film.name),
        year: film.releaseDate ? `${dayjs(film.releaseDate).year()}` : null,
        releaseDate: film.releaseDate || null,
        firstScreeningDate: date,
        lastScreeningDate: date,
      });
    }
  }

  return films.map(
    ({
      id,
      title,
      year,
      releaseDate,
      firstScreeningDate,
      lastScreeningDate,
    }) => ({
      id,
      title,
      year,
      releaseDate,
      firstScreeningDate,
      lastScreeningDate,
    })
  );
}
