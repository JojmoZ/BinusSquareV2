import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { redirectIfNotAuthenticated } from "$lib/server/guard";
import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {
  redirectIfNotAuthenticated(event);
  const user = event.locals.user;
  if (!user) throw redirect(302, "/login");

  // Group by year and month
  const yearRows = await db.execute<{
    year: string;
    month: string;
    total: string;
  }>(sql`
		SELECT
			EXTRACT(YEAR FROM ed.date) AS year,
			EXTRACT(MONTH FROM ed.date) AS month,
			SUM(ed.watt) AS total
		FROM electric_detail ed
		INNER JOIN electric e ON ed.electric_id = e.id
		WHERE e.user_id = ${user.id}
		GROUP BY year, month
		ORDER BY year DESC, month ASC
	`);

  // Group by month/day (assume current year for simplicity)
  const monthRows = await db.execute<{
    month: string;
    day: string;
    total: string;
  }>(sql`
		SELECT
			TO_CHAR(ed.date, 'YYYY-MM') AS month,
			TO_CHAR(ed.date, 'DD') AS day,
			SUM(ed.watt) AS total
		FROM electric_detail ed
		INNER JOIN electric e ON ed.electric_id = e.id
		WHERE e.user_id = ${user.id}
		GROUP BY month, day
		ORDER BY month DESC, day ASC
	`);

  // === Transform data ===
  const byYear: {
    year: number;
    totalKwh: number;
    months: { label: string; kwh: number }[];
  }[] = [];

  for (const row of yearRows) {
    const y = parseInt(row.year);
    const m = parseInt(row.month);
    const kwh = parseFloat(row.total);

    let yearEntry = byYear.find((entry) => entry.year === y);
    if (!yearEntry) {
      yearEntry = { year: y, totalKwh: 0, months: [] };
      byYear.push(yearEntry);
    }
    yearEntry.months.push({
      label: new Date(y, m - 1).toLocaleString("default", { month: "short" }),
      kwh: kwh / 10, // scale for height (e.g., divide max by 100 or scale it yourself)
    });
    yearEntry.totalKwh += kwh;
  }

  const byMonth: {
    label: string;
    totalKwh: number;
    days: { label: string; kwh: number }[];
  }[] = [];

  for (const row of monthRows) {
    const [year, month] = row.month.split("-");
    const day = row.day;
    const kwh = parseFloat(row.total);
    const label = `${new Date(`${row.month}-01`).toLocaleString("default", {
      month: "long",
    })} ${year}`;

    let monthEntry = byMonth.find((entry) => entry.label === label);
    if (!monthEntry) {
      monthEntry = { label, totalKwh: 0, days: [] };
      byMonth.push(monthEntry);
    }
    monthEntry.days.push({ label: day, kwh: kwh / 10 });
    monthEntry.totalKwh += kwh;
  }

  return {
    username: user.username,
    byYear,
    byMonth,
  };
};
