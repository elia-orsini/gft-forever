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
      className={[className, isFilmDay && "has-films"]
        .filter(Boolean)
        .join(" ")}
      disableRipple={isFilmDay || selected}
      sx={[
        {
          width: 40,
          height: 40,
          margin: 0,
          transition: "none",
        },
        selected && {
          color: "#fff !important",
          backgroundColor: "transparent !important",
          backgroundImage:
            "radial-gradient(circle 16px at center, #000 99%, transparent 100%) !important",
          "&:hover, &:focus": {
            backgroundColor: "transparent !important",
            backgroundImage:
              "radial-gradient(circle 16px at center, #000 99%, transparent 100%) !important",
          },
        },
        isFilmDay &&
          !selected && {
            overflow: "visible",
            backgroundColor: "transparent !important",
            backgroundImage: "url(/circle.png)",
            backgroundSize: "32px 32px",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            "&:hover, &:focus": {
              backgroundColor: "transparent !important",
            },
          },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      <span style={{ position: "relative", zIndex: 1, color: "inherit" }}>
        {day.date()}
      </span>
    </PickersDay>
  );
}

export default DayLogo;
