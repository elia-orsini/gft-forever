import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";

import { IFilm } from "@/types/IFilm";
import MetaHead from "@/components/header/MetaHead";
import FilmContainer from "@/components/FilmContainer";
import Header from "@/components/header/Header";

import Footer from "@/components/footer/Footer";
import Calendar from "@/components/DatePicker/Calendar";

const Add: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs(new Date()));
  const [films, setFilms] = useState<IFilm[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!selectedDate) return;

    const formattedDate = selectedDate.format("YYYY-MM-DD");
    const controller = new AbortController();

    setIsLoading(true);

    fetch(`/api/films/${formattedDate}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch films");
        return response.json();
      })
      .then((data: IFilm[]) => setFilms(data))
      .catch((error) => {
        if (error.name !== "AbortError") setFilms([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [selectedDate]);

  return (
    <div className="flex min-h-screen w-screen flex-col">
      <MetaHead />

      <div className="flex flex-col w-full min-h-screen px-4 mx-auto">
        <Header />

        <div className="flex flex-col sm:flex-row lg:mx-10 lg:space-x-10">
          <div className="w-max">
            <Calendar
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          </div>

          <div className="flex w-full flex-col">
            <FilmContainer films={films} isLoading={isLoading} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Add;
