import { Dayjs } from "dayjs";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";

import { useDatesWithFilms } from "./DatesWithFilmsContext";

function DayLogo(props: PickersDayProps<Dayjs>) {
  const { day, outsideCurrentMonth, selected, sx, className, ...other } = props;
  const datesWithFilms = useDatesWithFilms();

  const hasFilms = datesWithFilms.has(day.format("YYYY-MM-DD"));
  const isFilmDay = hasFilms && !outsideCurrentMonth;

  return (
    <PickersDay
      {...other}
      outsideCurrentMonth={outsideCurrentMonth}
      day={day}
      selected={selected}
      className={[className, isFilmDay && "has-films"].filter(Boolean).join(" ")}
      disableRipple={isFilmDay}
      sx={[
        {
          width: 40,
          height: 40,
          margin: 0,
          transition: "none",
        },
        isFilmDay && {
          overflow: "visible",
          "&:hover, &:focus": {
            backgroundColor: selected ? "black" : "transparent",
          },
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 4,
            backgroundImage: "url(/circle.png)",
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            pointerEvents: "none",
            opacity: selected ? 0 : 1,
            transition: "none",
          },
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    />
  );
}

export default DayLogo;
