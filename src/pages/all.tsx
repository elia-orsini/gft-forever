import { useMemo, useState } from "react";
import { GetStaticProps } from "next";

import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import MetaHead from "@/components/header/MetaHead";
import { FilmListItem, getAllFilms } from "@/lib/movies";
import { FILM_SORT_OPTIONS, FilmSortOrder, sortFilms } from "@/utils/sortFilms";

type AllFilmsPageProps = {
  films: FilmListItem[];
};

const AllFilmsPage: React.FC<AllFilmsPageProps> = ({ films }) => {
  const [sortOrder, setSortOrder] = useState<FilmSortOrder>("oldest");

  const sortedFilms = useMemo(
    () => sortFilms(films, sortOrder),
    [films, sortOrder]
  );

  return (
    <div className="flex min-h-screen w-screen flex-col">
      <MetaHead />

      <div className="flex flex-col w-full min-h-screen px-4 mx-auto">
        <Header />

        <div className="md:mx-10 mb-8">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs uppercase tracking-widest">
              all films ({films.length})
            </p>

            <label className="flex items-center gap-2 text-xs uppercase tracking-widest">
              sort by
              <select
                value={sortOrder}
                onChange={(event) =>
                  setSortOrder(event.target.value as FilmSortOrder)
                }
                className="border border-neutral-300 bg-white px-2 py-1 text-xs uppercase tracking-widest"
              >
                {FILM_SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <ul>
            {sortedFilms.map((film) => (
              <li
                key={film.id}
                className="flex justify-between gap-4 border-b border-neutral-200 py-1 text-sm"
              >
                <span className="uppercase">{film.title}</span>
                <span className="shrink-0">{film.year ?? "-"}</span>
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
