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

const Add: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs("2023-06-01"));
  const [films, setFilms] = useState<IFilm[]>([]);

  useEffect(() => {
    const formattedDate = selectedDate.format("YYYY-MM-DD");

    console.log("REFRESH ", formattedDate);

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

      <div className="flex flex-col mx-auto my-auto mt-10 w-4/5">
        <div className="flex flex-row mx-auto justify-between">
          <div className="flex">
            <p className="my-auto text-lg">gft forever</p>
          </div>

          <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                views={["day"]}
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
