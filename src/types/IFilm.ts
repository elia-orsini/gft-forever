export interface IFilm {
  name: string;
  directedBy: string;
  releaseDate: string;
  posterImage: string;
  trailerYoutubeId: string;
  tmdbId: string;
  rating: number;
  letterboxdSlug?: string | null;
  letterboxdId?: string | null;
  letterboxdLid?: string | null;
  letterboxdUrl?: string | null;
}
