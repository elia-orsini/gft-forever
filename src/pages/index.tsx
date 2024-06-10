import dayjs, { Dayjs } from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

import MetaHead from "@/components/header/MetaHead";
import Film from "@/components/Film";

import moviesData from "../data/movies.json";
import { useEffect, useState } from "react";

const Add: React.FC = () => {
  const [value, setValue] = useState<Dayjs>(dayjs("2023-05-31"));
  const [films, setFilms] = useState<any[]>([]);

  useEffect(() => {
    const formattedDate = value.format("YYYY-MM-DD");

    if (moviesData[formattedDate]) {
      setFilms(moviesData[formattedDate]);
    } else {
      setFilms([]);
    }
  }, [value]);

  return (
    <div className="flex min-h-screen w-screen flex-col pb-40">
      <MetaHead />

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          value={value}
          onChange={(newValue) => setValue(newValue)}
        />
      </LocalizationProvider>

      <div className="flex-1 mx-auto my-auto">
        {films.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-8 my-8">
            {films.map((film) => {
              return (
                <Film
                  key={`${film.name}_${film.posterImage}`}
                  title={film.name}
                  link={"#"}
                  img={`https://indy-systems.imgix.net/${film.posterImage}`}
                />
              );
            })}
          </div>
        ) : (
          <p className="m-auto">no films found</p>
        )}
      </div>
    </div>
  );
};

export default Add;
