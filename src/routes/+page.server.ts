import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) {
    throw redirect(302, "/home"); // already logged in
  } else {
    throw redirect(307, "/login"); // not logged in
  }
};
