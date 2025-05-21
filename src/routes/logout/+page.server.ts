import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import * as auth from "$lib/server/auth";

export const load: PageServerLoad = async (event) => {
  const token = event.cookies.get(auth.sessionCookieName);
  if (token) {
    await auth.deleteSession(token);
    auth.deleteSessionTokenCookie(event);
  }
  throw redirect(302, "/login");
};
