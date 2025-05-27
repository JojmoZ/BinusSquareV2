import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { redirectIfNotAuthenticated } from "$lib/server/guard";
import { db } from "$lib/server/db";
import { sql } from "drizzle-orm";

export const load: PageServerLoad = async (event) => {
  redirectIfNotAuthenticated(event);
  if (!event.locals.user) {
    throw redirect(302, "/login");
  }
  const yearRows = await db.execute<{
    year: string;
    month: string;
    total: string;
  }>(sql`
    SELECT
      EXTRACT(YEAR FROM ld.date) AS year,
      EXTRACT(MONTH FROM ld.date) AS month,
      SUM(ld.weight) AS total
    FROM laundry_detail ld
    INNER JOIN laundry l ON ld.laundry_id = l.id
    WHERE l.user_id = ${event.locals.user.id}
    GROUP BY year, month
    ORDER BY year DESC, month ASC
  `);

  const monthRows = await db.execute<{
    month: string;
    day: string;
    total: string;
  }>(sql`
    SELECT
      TO_CHAR(ld.date, 'YYYY-MM') AS month,
      TO_CHAR(ld.date, 'DD') AS day,
      SUM(ld.weight) AS total
      FROM laundry_detail ld
      INNER JOIN laundry l ON ld.laundry_id = l.id
      WHERE l.user_id = ${event.locals.user.id}
      GROUP BY month, day
      ORDER BY month DESC, day ASC
  `);

  const byYear: {
    year: number;
    totalKg: number;
    months: { label: string; kg: number }[];
  }[] = [];

  for (const row of yearRows) {
    const y = parseInt(row.year);
    const m = parseInt(row.month);
    const kg = parseFloat(row.total);

    let yearEntry = byYear.find((entry) => entry.year === y);
    if (!yearEntry) {
      yearEntry = { year: y, totalKg: 0, months: [] };
      byYear.push(yearEntry);
    }
    yearEntry.totalKg += kg;

    let monthEntry = yearEntry.months.find(
      (entry) => entry.label === m.toString()
    );
    if (!monthEntry) {
      monthEntry = { label: m.toString(), kg: 0 };
      yearEntry.months.push(monthEntry);
    }
    monthEntry.kg += kg;
  }

  const byMonth: {
    label: string;
    totalKg: number;
    days: { label: string; kg: number }[];
  }[] = [];

  for (const row of monthRows) {
    const [year, month] = row.month.split("-");
    const day = row.day;
    const weight = parseFloat(row.total);
    const label = `${new Date(`${row.month}-01`).toLocaleString("default", {
      month: "long",
    })} ${year}`;

    let monthEntry = byMonth.find((entry) => entry.label === label);
    if (!monthEntry) {
      monthEntry = { label, totalKg: 0, days: [] };
      byMonth.push(monthEntry);
    }
    monthEntry.days.push({ label: day, kg: weight / 10 });
    monthEntry.totalKg += weight;
  }
  return {
    username: event.locals.user.username,
    byYear,
    byMonth,
  };
};
