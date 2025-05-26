import { redirectIfNotAuthenticated } from "$lib/server/guard";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
export const load: PageServerLoad = async (event) => {
  redirectIfNotAuthenticated(event);
  if (!event.locals.user) {
    throw redirect(302, "/login");
  }

  const items = await db
    .select({
      id: table.redeem.id,
      name: table.redeem.name,
      price: table.redeem.price,
      stock: table.redeem.stock,
      preview_img: table.redeem.preview_img,
    })
    .from(table.redeem)
    .where(eq(table.redeem.status, "active"));
  return {
    items,
    user: event.locals.user,
  };
};
