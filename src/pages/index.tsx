import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

import { IFilm } from "@/types/IFilm";
import MetaHead from "@/components/header/MetaHead";
import FilmContainer from "@/components/FilmContainer";
import DayLogo from "@/components/DatePicker/DayLogo";

import moviesData from "../data/movies.json";
import Image from "next/image";
import RotatingSVG from "@/components/footer/RotatingSVG";

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
          <div className="flex flex-col sm:flex-row sm:w-4/5 sm:mx-auto sm:justify-between">
            <div className="flex relative w-64 h-40">
              <Image alt="gft-logo" src="/logo.png" fill objectFit="contain" />
            </div>
            <p className="mx-3 sm:ml-20 bg-pink-500 px-2 text-sm -mt-10 sm:my-auto">
              an archive of all the films shown at gft in the past year or so.
            </p>
          </div>

          <hr className="border-black mt-14 sm:mt-0" />

          <div className="mx-auto my-10 sm:mt-8">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                views={["day"]}
                minDate={dayjs(Object.keys(moviesData)[0])}
                maxDate={dayjs(
                  Object.keys(moviesData)[Object.keys(moviesData).length - 1]
                )}
                slots={{
                  day: DayLogo,
                }}
              />
            </LocalizationProvider>
          </div>
        </div>

        {films.length ? (
          <FilmContainer films={films} />
        ) : (
          <p className="m-auto">no films found</p>
        )}

        <div className="flex flex-col sm:flex-row justify-between w-full mx-auto mt-20 text-sm sm:px-20 mb-10">
          <p className="text-centre mb-10 mx-2">
            gft {`(`} glasgow film theatre {`)`} is an indipendent cinema in
            Glasgow, Scotland.
            <br />
            Because of its really good selection, I wanted to store every film
            screened there.
            <br />
            Find here all the films screened in the past year.
          </p>

          <RotatingSVG />
        </div>
      </div>
    </div>
  );
};

export default Add;
