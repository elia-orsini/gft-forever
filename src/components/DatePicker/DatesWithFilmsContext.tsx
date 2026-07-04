import { createContext, useContext } from "react";

export const DatesWithFilmsContext = createContext<Set<string>>(new Set());

export function useDatesWithFilms() {
  return useContext(DatesWithFilmsContext);
}
