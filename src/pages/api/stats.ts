import type { NextApiRequest, NextApiResponse } from "next";

import { getTotalFilmCount } from "@/lib/movies";

type StatsResponse = {
  totalFilms: number;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<StatsResponse | { error: string }>
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  return res.status(200).json({ totalFilms: getTotalFilmCount() });
}
