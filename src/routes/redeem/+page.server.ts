import { redirectIfNotAuthenticated } from "$lib/server/guard";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  redirectIfNotAuthenticated(event);
  if (!event.locals.user) {
    throw redirect(302, "/login");
  }

  return {
    username: event.locals.user.username,
  };
};
