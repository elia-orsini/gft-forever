import { FilmListItem } from "@/lib/movies";

export type StarFilter = number | null;

export const STAR_FILTER_OPTIONS: { value: StarFilter; label: string }[] = [
  { value: null, label: "any" },
  ...Array.from({ length: 10 }, (_, index) => {
    const value = (index + 1) * 0.5;

    return {
      value,
      label: `${value}`,
    };
  }),
];

export function filterFilmsByRating(
  films: FilmListItem[],
  minStars: StarFilter,
  maxStars: StarFilter
): FilmListItem[] {
  return films.filter((film) => {
    if (!film.rating) {
      return minStars === null && maxStars === null;
    }

    if (minStars !== null && film.rating < minStars) return false;
    if (maxStars !== null && film.rating > maxStars) return false;

    return true;
  });
}
