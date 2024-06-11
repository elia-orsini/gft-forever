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
    <div className="flex min-h-screen w-screen flex-col pb-40">
      <MetaHead />

      <div className="flex flex-col mx-auto my-auto mt-10 w-full">
        <div className="flex flex-col w-full mx-auto">
          <div className="flex flex-col sm:flex-row sm:w-4/5 sm:mx-auto sm:justify-between">
            <div className="flex relative w-64 h-40">
              <Image alt="gft-logo" src="/logo.png" fill objectFit="contain" />
            </div>
            <p className="my-auto mx-3 sm:ml-20 bg-pink-500 px-2 text-sm">an archive of all the films shown at gft in the past year.</p>
          </div>

          <div className="mx-auto mt-10 sm:mt-0">
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
      </div>
    </div>
  );
};

export default Add;
