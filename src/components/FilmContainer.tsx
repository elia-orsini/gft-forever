import { IFilm } from "@/types/IFilm";

import Film from "./Film";

const FilmContainer: React.FC<{
  films: IFilm[];
}> = ({ films }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-8">
      {films.map((film, i) => {
        return (
          <Film
            key={`${film.name}_${film.posterImage}_${i}`}
            title={film.name}
            img={`https://indy-systems.imgix.net/${film.posterImage}`}
          />
        );
      })}
    </div>
  );
};

export default FilmContainer;
