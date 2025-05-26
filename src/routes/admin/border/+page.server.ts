import { redirect } from "@sveltejs/kit";
import { redirectIfNotAdmin } from "../../../lib/server/guard";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  redirectIfNotAdmin(event);
  if (!event.locals.user) {
    throw redirect(302, "/login");
  }

  return {
    username: event.locals.user.username,
  };
};
