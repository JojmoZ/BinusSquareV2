import { db } from "$lib/server/db";
import { redirectIfNotAuthenticated } from "$lib/server/guard";
import type { PageServerLoad } from "./add-point/$types";
import * as table from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "@sveltejs/kit";
export const load: PageServerLoad = async (event) => {
  await redirectIfNotAuthenticated(event);

  const user = event.locals.user;
  if (!user) return;
  let new_point = user.point + 100;

  try {
    const updated = await db
      .update(table.user)
      .set({ point: new_point })
      .where(eq(table.user.id, user.id));
    const referer = event.request.headers.get("referer");
    throw redirect(302, referer ?? "/");
  } catch (err) {
    console.error("❌ DB error:", err);
    const referer = event.request.headers.get("referer");
    throw redirect(302, referer ?? "/");
  }
};
