import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import moviesData from "../../data/movies.json";
import DayLogo from "./DayLogo";

const Calendar = ({ selectedDate, setSelectedDate }) => {
  return (
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
  );
};

export default Calendar;
