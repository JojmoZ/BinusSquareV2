import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { redirectIfNotAdmin } from "$lib/server/guard";
import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import { eq, ne } from "drizzle-orm";
export const load: PageServerLoad = async (event) => {
  redirectIfNotAdmin(event);
  if (!event.locals.user) {
    throw redirect(302, "/login");
  }
  const users = await db
    .select({
      id: table.user.id,
      username: table.user.username,
    })
    .from(table.user)
    .where(ne(table.user.username, "admin"));

  return { users };
};

export const actions: Actions = {
  default: async ({ request }) => {
    const form = await request.formData();
    const userId = form.get("userId");
    const weight = form.get("weight");
    const date = form.get("date");
    if (
      typeof userId !== "string" ||
      typeof weight !== "string" ||
      typeof date !== "string"
    ) {
      return { error: "Invalid form data" };
    }
    const weightValue = parseFloat(weight);
    if (isNaN(weightValue) || weightValue < 0) {
      return { error: "Weight must be a positive number" };
    }
    const dateValue = new Date(date);
    if (isNaN(dateValue.getTime())) {
      return { error: "Invalid date format" };
    }
    const [laundryRow] = await db
      .insert(table.laundry)
      .values({ userId })
      .returning({ id: table.laundry.id });
    await db.insert(table.laundry_detail).values({
      laundryId: laundryRow.id,
      weight: weightValue,
      date: dateValue,
    });
    return { message: "Laundry usage inserted successfully!" };
  },
};
