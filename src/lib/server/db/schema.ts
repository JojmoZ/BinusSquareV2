import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  age: integer("age"),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const electric = pgTable("electric", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
});

export const electric_detail = pgTable("electric_detail", {
  id: serial("id").primaryKey(),
  date: timestamp("date", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  electricId: integer("electric_id")
    .notNull()
    .references(() => electric.id),
  watt: integer("watt").notNull(),
});

export const redeem = pgTable("redeem", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  status: text("status").notNull(),
  stock: integer("stock").notNull(),
  price: integer("price").notNull(),
  preview_img: text("preview_img").notNull(),
});

export const useritems = pgTable("useritems", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  redeemId: integer("redeem_id")
    .notNull()
    .references(() => redeem.id),
});
export type Session = typeof session.$inferSelect;
export type Redeem = typeof redeem.$inferSelect;
export type UserItems = typeof useritems.$inferSelect;
export type User = typeof user.$inferSelect;
export type Electric = typeof electric.$inferSelect;
export type ElectricDetail = typeof electric_detail.$inferSelect;
