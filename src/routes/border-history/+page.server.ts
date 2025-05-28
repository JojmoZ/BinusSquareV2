import { redirectIfNotAuthenticated } from "$lib/server/guard";
import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "@sveltejs/kit";
export const load: PageServerLoad = async (event) => {
  redirectIfNotAuthenticated(event);
  if (!event.locals.user) {
    throw redirect(302, "/login");
  }
  const creations = await db
    .select({
      id: table.bordercreation.id,
      userId: table.bordercreation.userId,
      username: table.user.username,
      createdAt: table.borderdetail.date,
      title: table.borderdetail.title,
      category: table.borderdetail.category,
      file: table.borderdetail.file,
    })
    .from(table.bordercreation)
    .innerJoin(table.user, eq(table.bordercreation.userId, table.user.id))
    .innerJoin(
      table.borderdetail,
      eq(table.borderdetail.borderId, table.bordercreation.id)
    );

  return {
    creations,
    user: event.locals.user,
  };
};
