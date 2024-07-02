import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";

import { IFilm } from "@/types/IFilm";
import MetaHead from "@/components/header/MetaHead";
import FilmContainer from "@/components/FilmContainer";
import DayLogo from "@/components/DatePicker/DayLogo";
import Header from "@/components/header/Header";

import moviesData from "../data/movies.json";
import Footer from "@/components/footer/Footer";
import Calendar from "@/components/DatePicker/Calendar";

const Add: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [films, setFilms] = useState<IFilm[]>([]);

  useEffect(() => {
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

      <div className="flex flex-col mx-auto my-auto w-full">
        <div className="flex flex-col w-full mx-auto">
          <Header />

          <div className="flex flex-col sm:flex-row my-10 sm:mt-8 mx-auto sm:gap-x-4">
            <Calendar
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />

            <p className="text-xs sm:text-sm lg:text-lg my-auto">
              gft ( glasgow film theatre ) is an indipendent cinema in Glasgow,
              Scotland. <br />
              Because of its really good selection, I wanted to store every film
              screened there. <br />
              Find here all the films screened in the past year.
            </p>
          </div>
        </div>

        {films.length ? (
          <FilmContainer films={films} />
        ) : (
          <p className="m-auto">no films found</p>
        )}

        <Footer />
      </div>
    </div>
  );
};

export default Add;
