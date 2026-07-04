import type { NextApiRequest, NextApiResponse } from "next";

import { CalendarMeta, getCalendarMeta } from "@/lib/movies";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<CalendarMeta | { error: string }>
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  return res.status(200).json(getCalendarMeta());
}
