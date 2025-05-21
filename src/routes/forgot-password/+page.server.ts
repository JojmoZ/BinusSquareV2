import { fail, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { hash } from "@node-rs/argon2";
import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import type { Actions } from "./$types";
import { redirectIfAuthenticated } from "$lib/server/guard";
export const load = async (event) => {
  redirectIfAuthenticated(event);
};
export const actions: Actions = {
  default: async (event) => {
    const formData = await event.request.formData();
    const username = formData.get("username");
    const newPassword = formData.get("newPassword");
    const confirmPassword = formData.get("confirmPassword");

    if (
      typeof username !== "string" ||
      typeof newPassword !== "string" ||
      typeof confirmPassword !== "string"
    ) {
      return fail(400, { message: "Invalid form submission" });
    }

    if (newPassword.length < 6) {
      return fail(400, {
        message: "Password must be atleast 6 characters",
      });
    }

    if (newPassword !== confirmPassword) {
      return fail(400, { message: "Passwords do not match" });
    }

    const user = await db
      .select()
      .from(table.user)
      .where(eq(table.user.username, username))
      .then((res) => res.at(0));

    if (!user) {
      return fail(400, { message: "Username not found" });
    }

    const hashed = await hash(newPassword, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    await db
      .update(table.user)
      .set({ passwordHash: hashed })
      .where(eq(table.user.id, user.id));

    redirect(302, "/login");
  },
};
