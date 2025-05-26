import { redirectIfNotAuthenticated } from "$lib/server/guard";
import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
export const load: PageServerLoad = async (event) => {
  redirectIfNotAuthenticated(event);
  if (!event.locals.user) {
    throw redirect(302, "/login");
  }

  const items = await db
    .select({
      id: table.redeem.id,
      name: table.redeem.name,
      price: table.redeem.price,
      stock: table.redeem.stock,
      preview_img: table.redeem.preview_img,
    })
    .from(table.redeem);
  return {
    items,
    user: event.locals.user,
  };
};
export const actions: Actions = {
  redeemItem: async ({ request, locals }) => {
    const user = locals.user;
    if (!user) {
      return { error: "Not authenticated." };
    }

    const form = await request.formData();
    const itemId = Number(form.get("itemId"));
    if (isNaN(itemId)) {
      return { error: "Invalid item ID." };
    }

    const [item] = await db
      .select()
      .from(table.redeem)
      .where(eq(table.redeem.id, itemId));

    if (!item) {
      return { error: "Item not found." };
    }

    if (item.stock <= 0) {
      return { error: "Item is out of stock." };
    }

    if (user.point < item.price) {
      return { error: "You don't have enough points." };
    }

    try {
      await db.transaction(async (tx) => {
        await tx
          .update(table.redeem)
          .set({ stock: item.stock - 1 })
          .where(eq(table.redeem.id, itemId));

        await tx
          .update(table.user)
          .set({ point: user.point - item.price })
          .where(eq(table.user.id, user.id));

        await tx.insert(table.useritems).values({
          userId: user.id,
          redeemId: itemId,
        });
      });

      return { message: `Successfully redeemed "${item.name}"!` };
    } catch (err) {
      console.error("Redeem failed:", err);
      return { error: "Something went wrong during redeem." };
    }
  },
};
