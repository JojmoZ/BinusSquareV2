import { redirectIfNotAdmin } from "../../../lib/server/guard";
import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import { ne } from "drizzle-orm";
import fs from "fs/promises";
export const load: PageServerLoad = async (event) => {
  redirectIfNotAdmin(event);
  const users = await db
    .select({ id: table.user.id, username: table.user.username })
    .from(table.user)
    .where(ne(table.user.username, "admin"));
  const creationDetail = await db
    .select({
      id: table.borderdetail.id,
      date: table.borderdetail.date,
      category: table.borderdetail.category,
      file: table.borderdetail.file,
      title: table.borderdetail.title,
    })
    .from(table.borderdetail);
  return { users, creationDetail };
};

export const actions = {
  insertCreation: async ({ request }) => {
    const form = await request.formData();
    const userId = form.get("userId");
    const title = form.get("title");
    const category = form.get("category");
    const file = form.get("file") as File;
    const date = form.get("date");
    if (
      typeof userId !== "string" ||
      typeof title !== "string" ||
      typeof category !== "string" ||
      !(file instanceof File) ||
      typeof date !== "string"
    ) {
      return { error: "Invalid form data" };
    }
    if (file.size === 0) {
      return { error: "File is required." };
    }
    const dateValue = new Date(date);
    if (isNaN(dateValue.getTime())) {
      return { error: "Invalid date format" };
    }
    const uploadDir = "static/uploads";
    const filename = `${Date.now()}-${file.name}`;
    const filepath = `${uploadDir}/${filename}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filepath, buffer);
    const [borderRow] = await db
      .insert(table.bordercreation)
      .values({ userId })
      .returning({ id: table.bordercreation.id });
    await db.insert(table.borderdetail).values({
      borderId: borderRow.id,
      title,
      category,
      file: filepath,
      date: dateValue,
    });
    return { message: "Border creation inserted successfully!" };
  },
};
