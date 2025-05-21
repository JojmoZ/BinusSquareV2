import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { redirectIfNotAuthenticated } from "$lib/server/guard";

export const load: PageServerLoad = async (event) => {
  redirectIfNotAuthenticated(event);
  if (!event.locals.user) {
    throw redirect(302, "/login");
  }

  return {
    username: event.locals.user.username,
  };
};
