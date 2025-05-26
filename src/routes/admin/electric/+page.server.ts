import { fail, redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { redirectIfNotAdmin } from "$lib/server/guard";
import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
export const load: PageServerLoad = async (event) => {
  redirectIfNotAdmin(event);
  if (!event.locals.user) {
    throw redirect(302, "/login");
  }
  const users = await db
    .select({ id: table.user.id, username: table.user.username })
    .from(table.user);

  return { users };
};

export const actions: Actions = {
  default: async ({ request }) => {
    const form = await request.formData();
    const userId = form.get("userId");
    const watt = form.get("watt");
    const date = form.get("date");

    if (
      typeof userId !== "string" ||
      typeof watt !== "string" ||
      typeof date !== "string"
    ) {
      return fail(400, { error: "Invalid form data" });
    }

    const wattValue = parseInt(watt, 10);
    if (isNaN(wattValue) || wattValue < 0) {
      return fail(400, { error: "Watt must be a positive number" });
    }

    const dateValue = new Date(date);
    if (isNaN(dateValue.getTime())) {
      return fail(400, { error: "Invalid date format" });
    }

    const [electricRow] = await db
      .insert(table.electric)
      .values({ userId })
      .returning({ id: table.electric.id });

    await db.insert(table.electric_detail).values({
      electricId: electricRow.id,
      watt: wattValue,
      date: dateValue,
    });

    return { message: "Electric usage inserted successfully!" };
  },
};