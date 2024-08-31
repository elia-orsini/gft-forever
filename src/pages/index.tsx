import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";

import { IFilm } from "@/types/IFilm";
import MetaHead from "@/components/header/MetaHead";
import FilmContainer from "@/components/FilmContainer";
import Header from "@/components/header/Header";

import moviesData from "../data/movies.json";
import Footer from "@/components/footer/Footer";
import Calendar from "@/components/DatePicker/Calendar";

const Add: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs(new Date()));
  const [films, setFilms] = useState<IFilm[]>([]);

  useEffect(() => {
    if (!selectedDate) return;

    const formattedDate = selectedDate.format("YYYY-MM-DD");

    const newFilms = moviesData[formattedDate] || [];

    const noDuplicates = newFilms.filter(
      (film: IFilm, index: number, self: IFilm[]) =>
        index ===
        self.findIndex(
          (m: IFilm) =>
            m.name === film.name || m.posterImage === film.posterImage
        )
    );

    setFilms(noDuplicates);
  }, [selectedDate]);

  return (
    <div className="flex min-h-screen w-screen flex-col">
      <MetaHead />

      <div className="flex flex-col w-full mx-auto">
        <Header />

        <div className="flex flex-col sm:flex-row mx-4 lg:mx-10 lg:space-x-10">
          <div className="w-max mx-auto">
            <Calendar
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          </div>

          {films.length ? (
            <FilmContainer films={films} />
          ) : (
            <p className="my-4 text-sm min-h-screen">no films found</p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Add;
