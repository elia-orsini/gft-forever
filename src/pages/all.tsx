import { useMemo, useState } from "react";
import { GetStaticProps } from "next";

import Dropdown from "@/components/Dropdown";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import MetaHead from "@/components/header/MetaHead";
import { FilmListItem, getAllFilms } from "@/lib/movies";
import {
  filterFilmsByRating,
  STAR_FILTER_OPTIONS,
  StarFilter,
} from "@/utils/filterFilmsByRating";
import { FILM_SORT_OPTIONS, FilmSortOrder, sortFilms } from "@/utils/sortFilms";

type AllFilmsPageProps = {
  films: FilmListItem[];
};

const AllFilmsPage: React.FC<AllFilmsPageProps> = ({ films }) => {
  const [sortOrder, setSortOrder] = useState<FilmSortOrder>("oldest");
  const [minStars, setMinStars] = useState<StarFilter>(null);
  const [maxStars, setMaxStars] = useState<StarFilter>(null);

  const visibleFilms = useMemo(() => {
    const filtered = filterFilmsByRating(films, minStars, maxStars);
    return sortFilms(filtered, sortOrder);
  }, [films, minStars, maxStars, sortOrder]);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <MetaHead />

      <div className="flex flex-1 flex-col w-full px-4 mx-auto">
        <Header />

        <div className="md:mx-10 mb-8">
          <div className="mb-4 flex flex-col gap-3">
            <p className="text-xs uppercase tracking-widest">
              all films ({visibleFilms.length}
              {visibleFilms.length !== films.length ? ` / ${films.length}` : ""})
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
              <Dropdown
                label="sort by"
                value={sortOrder}
                options={FILM_SORT_OPTIONS}
                onChange={setSortOrder}
              />

              <Dropdown
                label="minimum stars"
                value={minStars}
                options={STAR_FILTER_OPTIONS}
                onChange={setMinStars}
              />

              <Dropdown
                label="maximum stars"
                value={maxStars}
                options={STAR_FILTER_OPTIONS}
                onChange={setMaxStars}
              />
            </div>
          </div>

          <ul>
            {visibleFilms.map((film, index) => (
              <li
                key={film.id}
                className={`grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-neutral-200 py-1 px-2 text-sm ${
                  index % 2 === 0 ? "bg-white" : "bg-neutral-100"
                }`}
              >
                {film.letterboxdUrl ? (
                  <a
                    href={film.letterboxdUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="uppercase underline"
                  >
                    {film.title}
                  </a>
                ) : (
                  <span className="uppercase">{film.title}</span>
                )}
                <span className="w-10 shrink-0 text-right tabular-nums">
                  {film.rating ?? "-"}
                </span>
                <span className="w-10 shrink-0 text-right">{film.year ?? "-"}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export const getStaticProps: GetStaticProps<AllFilmsPageProps> = async () => {
  return {
    props: {
      films: getAllFilms(),
    },
  };
};

export default AllFilmsPage;
