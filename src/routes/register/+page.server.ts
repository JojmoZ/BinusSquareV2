import { fail, redirect } from "@sveltejs/kit";
import { hash } from "@node-rs/argon2";
import { encodeBase32LowerCase } from "@oslojs/encoding";
import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import * as auth from "$lib/server/auth";
import type { Actions } from "./$types";

function generateUserId() {
  const bytes = crypto.getRandomValues(new Uint8Array(15));
  return encodeBase32LowerCase(bytes);
}

export const actions: Actions = {
  default: async (event) => {
    const formData = await event.request.formData();
    const username = formData.get("username");
    const password = formData.get("password");

    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      username.length < 3 ||
      password.length < 6
    ) {
      return fail(400, { message: "Invalid username or password" });
    }

    const userId = generateUserId();
    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    try {
      await db
        .insert(table.user)
        .values({ id: userId, username, passwordHash });

      const sessionToken = auth.generateSessionToken();
      const session = await auth.createSession(sessionToken, userId);
      auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
    } catch (e) {
      return fail(500, { message: "Registration failed" });
    }

    return redirect(302, "/login");
  },
};
