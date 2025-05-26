import { fail, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { verify } from "@node-rs/argon2";
import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import * as auth from "$lib/server/auth";
import type { Actions } from "./$types";
import type { PageServerLoad } from "../$types";
import { redirectIfAuthenticated } from "$lib/server/guard";
export const load: PageServerLoad = async (event) => {
	redirectIfAuthenticated(event);
}
export const actions: Actions = {
  default: async (event) => {
    const formData = await event.request.formData();
    const username = formData.get("username");
    const password = formData.get("password");

    if (
      typeof username !== "string" ||
      typeof password !== "string"
    ) {
      return fail(400, { message: "Invalid username or password" });
    }

    const user = await db
      .select()
      .from(table.user)
      .where(eq(table.user.username, username))
      .then((res) => res.at(0));

    if (!user || !(await verify(user.passwordHash, password))) {
      return fail(400, { message: "Incorrect username or password" });
    }

    const sessionToken = auth.generateSessionToken();
    const session = await auth.createSession(sessionToken, user.id);
    auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

    return redirect(302, "/home");
  },
};
