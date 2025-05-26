import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { redirectIfNotAdmin } from "$lib/server/guard";

export const load: PageServerLoad = async (event) => {
  redirectIfNotAdmin(event);
  if (!event.locals.user) {
    throw redirect(302, "/login");
  }

  return {
    username: event.locals.user.username,
  };
};
