import { Dayjs } from "dayjs";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import Badge from "@mui/material/Badge";

import moviesData from "../../data/movies.json";

function DayLogo(props: PickersDayProps<Dayjs>) {
  const { day, outsideCurrentMonth, ...other } = props;

  const films = moviesData[props.day.format("YYYY-MM-DD")];
  const hasFilms = films && films.length > 0;
  const isSelected = !props.outsideCurrentMonth && hasFilms;

  return (
    <Badge
      key={props.day.toString()}
      overlap="circular"
      badgeContent={isSelected ? "📽️" : undefined}
    >
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
      />
    </Badge>
  );
}

export default DayLogo;
