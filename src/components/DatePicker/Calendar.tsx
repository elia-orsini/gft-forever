import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

import { CalendarMeta } from "@/lib/movies";
import DayLogo from "./DayLogo";
import { DatesWithFilmsContext } from "./DatesWithFilmsContext";

const Calendar = ({ selectedDate, setSelectedDate }) => {
  const [calendarMeta, setCalendarMeta] = useState<CalendarMeta | null>(null);

  useEffect(() => {
    fetch("/api/calendar")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch calendar");
        return response.json();
      })
      .then((data: CalendarMeta) => setCalendarMeta(data))
      .catch(() => setCalendarMeta(null));
  }, []);

  const datesWithFilms = useMemo(
    () => new Set(calendarMeta?.datesWithFilms ?? []),
    [calendarMeta]
  );

  if (!calendarMeta) return null;

  return (
    <DatesWithFilmsContext.Provider value={datesWithFilms}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          value={selectedDate}
          onChange={(newValue) => setSelectedDate(newValue)}
          views={["day"]}
          minDate={dayjs(calendarMeta.minDate)}
          maxDate={dayjs(calendarMeta.maxDate)}
          slots={{
            day: DayLogo,
          }}
          sx={{
            "& .MuiPickersDay-root": {
              width: 40,
              height: 40,
              margin: 0,
              transition: "none",
            },
            "& .MuiPickersDay-root:not(.Mui-selected):not(.has-films):hover": {
              backgroundColor: "#d4d4d4",
            },
            "& .MuiPickersDay-root.has-films:not(.Mui-selected):hover, & .MuiPickersDay-root.has-films:not(.Mui-selected):focus":
              {
                backgroundColor: "transparent",
              },
            "& .MuiPickersDay-root.Mui-selected": {
              backgroundColor: "black !important",
              color: "white",
              transition: "none",
              "&:hover, &:focus": {
                backgroundColor: "black !important",
              },
            },
          }}
        />
      </LocalizationProvider>
    </DatesWithFilmsContext.Provider>
  );
};

export default Calendar;
