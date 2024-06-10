import { IFilm } from "@/types/IFilm";

import Film from "./Film";

const FilmContainer: React.FC<{
  films: IFilm[];
}> = ({ films }) => {
  return (
    <div className="grid w-11/12 mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 sm:gap-8">
      {films.map((film, i) => {
        return (
          <Film
            key={`${film.name}_${film.posterImage}_${i}`}
            title={film.name}
            director={film.directedBy}
            release={film.releaseDate}
            trailerYoutubeId={film.trailerYoutubeId}
            img={`https://indy-systems.imgix.net/${film.posterImage}`}
          />
        );
      })}
    </div>
  );
};

export default FilmContainer;
