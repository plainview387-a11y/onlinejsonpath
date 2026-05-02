import { pgTable, serial, timestamp, varchar, text, index } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// 用户表
export const users = pgTable(
  "users",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: text("password").notNull(),
    nickname: varchar("nickname", { length: 100 }).notNull(),
    avatar: text("avatar"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("users_email_idx").on(table.email),
  ]
);

export const comments = pgTable(
  "comments",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    pageKey: varchar("page_key", { length: 100 }).notNull(),
    content: text("content").notNull(),
    parentId: varchar("parent_id", { length: 36 }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("comments_page_key_idx").on(table.pageKey),
    index("comments_user_id_idx").on(table.userId),
    index("comments_parent_id_idx").on(table.parentId),
    index("comments_created_at_idx").on(table.createdAt),
  ]
);
