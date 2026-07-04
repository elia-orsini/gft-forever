import dayjs from "dayjs";

import { FilmListItem } from "@/lib/movies";

export type FilmSortOrder =
  | "newest"
  | "oldest"
  | "last-screened"
  | "first-screened"
  | "a-z"
  | "z-a";

export const FILM_SORT_OPTIONS: { value: FilmSortOrder; label: string }[] = [
  { value: "newest", label: "newest" },
  { value: "oldest", label: "oldest" },
  { value: "last-screened", label: "last screened" },
  { value: "first-screened", label: "first screened" },
  { value: "a-z", label: "a–z" },
  { value: "z-a", label: "z–a" },
];

function compareByReleaseDate(
  a: FilmListItem,
  b: FilmListItem,
  direction: "asc" | "desc"
): number {
  if (!a.releaseDate && !b.releaseDate) {
    return a.title.localeCompare(b.title);
  }
  if (!a.releaseDate) return 1;
  if (!b.releaseDate) return -1;

  const dateCompare =
    dayjs(a.releaseDate).valueOf() - dayjs(b.releaseDate).valueOf();

  return direction === "desc" ? -dateCompare : dateCompare;
}

export function sortFilms(
  films: FilmListItem[],
  order: FilmSortOrder
): FilmListItem[] {
  switch (order) {
    case "newest":
      return films.toSorted(
        (a, b) =>
          compareByReleaseDate(a, b, "desc") || a.title.localeCompare(b.title)
      );
    case "oldest":
      return films.toSorted(
        (a, b) =>
          compareByReleaseDate(a, b, "asc") || a.title.localeCompare(b.title)
      );
    case "last-screened":
      return films.toSorted(
        (a, b) =>
          b.lastScreeningDate.localeCompare(a.lastScreeningDate) ||
          a.title.localeCompare(b.title)
      );
    case "first-screened":
      return films.toSorted(
        (a, b) =>
          a.firstScreeningDate.localeCompare(b.firstScreeningDate) ||
          a.title.localeCompare(b.title)
      );
    case "a-z":
      return films.toSorted((a, b) => a.title.localeCompare(b.title));
    case "z-a":
      return films.toSorted((a, b) => b.title.localeCompare(a.title));
  }
}
