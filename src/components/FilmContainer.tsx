import { IFilm } from "@/types/IFilm";

import Film from "./Film";
import parseFilmName from "@/utils/parseFilmName";

const FilmContainer: React.FC<{
  films: IFilm[];
}> = ({ films }) => {
  return (
    <div className="grid w-11/12 mx-auto grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-8">
      {films.map((film, i) => {
        return (
          <Film
            key={`${film.name}_${film.posterImage}_${i}`}
            title={parseFilmName(film.name)}
            director={film.directedBy}
            release={film.releaseDate}
            trailerYoutubeId={film.trailerYoutubeId}
            img={
              film.posterImage.includes("http")
                ? film.posterImage
                : `https://indy-systems.imgix.net/${film.posterImage}`
            }
          />
        );
      })}
    </div>
  );
};

export default FilmContainer;
