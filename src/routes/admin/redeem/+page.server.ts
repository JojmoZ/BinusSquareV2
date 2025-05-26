import { redirectIfNotAdmin } from "$lib/server/guard";
import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import fs from "fs/promises";
import path from "path";
import { eq } from "drizzle-orm";

export const load: PageServerLoad = async (event) => {
  redirectIfNotAdmin(event);
  if (!event.locals.user) throw redirect(302, "/login");

  const items = await db
    .select({
      id: table.redeem.id,
      itemname: table.redeem.name,
      status: table.redeem.status,
      stock: table.redeem.stock,
      price: table.redeem.price,
      preview_img: table.redeem.preview_img,
    })
    .from(table.redeem);

  return { items };
};

export const actions: Actions = {
  insertItem: async ({ request }) => {
    console.log("🔧 default action hit");
    const form = await request.formData();

    const name = form.get("itemName")?.toString();
    const status = "active";
    const stock = Number(form.get("itemStock"));
    const price = Number(form.get("itemPrice"));
    const file = form.get("itemPreviewImg") as File;

    if (
      !name ||
      !status ||
      isNaN(stock) ||
      isNaN(price) ||
      !file ||
      file.size === 0
    ) {
      return { error: "All fields including the image are required." };
    }

    try {
      const uploadDir = path.resolve("static/uploads");
      await fs.mkdir(uploadDir, { recursive: true });

      const filename = `${Date.now()}-${file.name}`;
      const filepath = path.join(uploadDir, filename);
      const buffer = Buffer.from(await file.arrayBuffer());

      await fs.writeFile(filepath, buffer);

      const inserted = await db
        .insert(table.redeem)
        .values({
          name,
          status,
          stock,
          price,
          preview_img: `/uploads/${filename}`,
        })
        .returning({
          id: table.redeem.id,
          itemname: table.redeem.name,
          status: table.redeem.status,
          stock: table.redeem.stock,
          price: table.redeem.price,
          preview_img: table.redeem.preview_img,
        });
      
      return {
        message: "Item inserted successfully!",
        newItem: inserted[0],
      };
    } catch (err) {
      console.error("Upload error:", err);
      return { error: "Failed to insert item." };
    }
  },
  updateStock: async ({ request }) => {
    console.log("🔧 updateStock action hit");

    const form = await request.formData();
    const id = Number(form.get("id"));
    const newStock = Number(form.get("stock"));

    console.log("Form Data:", { id, newStock });

    if (isNaN(id) || isNaN(newStock) || newStock < 0) {
      console.warn("❌ Invalid data:", { id, newStock });
      return { error: "Invalid stock update." };
    }

    const newStatus = newStock === 0 ? "inactive" : "active";

    try {
      const updated = await db
        .update(table.redeem)
        .set({ stock: newStock, status: newStatus })
        .where(eq(table.redeem.id, id));

      console.log("✅ Updated:", updated);

      return { message: "Stock updated." };
    } catch (err) {
      console.error("❌ DB error:", err);
      return { error: "Failed to update stock." };
    }
  },
};
