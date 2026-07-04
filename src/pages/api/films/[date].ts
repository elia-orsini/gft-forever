import type { NextApiRequest, NextApiResponse } from "next";

import { IFilm } from "@/types/IFilm";
import { getFilmsByDate } from "@/lib/movies";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<IFilm[] | { error: string }>
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { date } = req.query;

  if (typeof date !== "string" || !DATE_PATTERN.test(date)) {
    return res.status(400).json({ error: "Invalid date" });
  }

  return res.status(200).json(getFilmsByDate(date));
}
