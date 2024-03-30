import { type InferSelectModel, relations } from "drizzle-orm";
import {
  varchar,
  bigint,
  pgTableCreator,
  bigserial,
  text,
  timestamp,
  integer,
  index,
  primaryKey,
  pgTable,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const projectTable = pgTableCreator((name) => `shopping-list_${name}`);

export const shortLinks = pgTable("short-link_shortLink", {
  id: text("id").primaryKey(),
  url: text("url").notNull(),
  slug: text("slug").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  userId: text("userId").references(() => users.id),
});

export const shoppingLists = projectTable(
  "shoppingList",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    description: varchar("description", { length: 255 }),
    createdById: varchar("createdById", { length: 255 }).notNull(),
    createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
      .notNull()
      .defaultNow(),
  },
  (shoppingList) => ({
    slugIdx: uniqueIndex("shopping-list_shoppingList_slug_idx").on(
      shoppingList.slug,
    ),
    createdByIdIdx: index("shopping-list_shoppingList_createdById_idx").on(
      shoppingList.createdById,
    ),
  }),
);

export const shoppingListCollaborators = projectTable(
  "shoppingListCollaborator",
  {
    shoppingListId: bigint("shoppingListId", { mode: "number" }).notNull(),
    userId: varchar("userId", { length: 255 }).notNull(),
  },
  (collaborator) => ({
    primaryKey: primaryKey(collaborator.userId, collaborator.shoppingListId),
  }),
);

export const shoppingListCollaboratorsRelations = relations(
  shoppingListCollaborators,
  ({ one }) => ({
    shoppingList: one(shoppingLists, {
      fields: [shoppingListCollaborators.shoppingListId],
      references: [shoppingLists.id],
    }),
    user: one(users, {
      fields: [shoppingListCollaborators.userId],
      references: [users.id],
    }),
  }),
);

export const shoppingListsRelations = relations(
  shoppingLists,
  ({ one, many }) => ({
    createdBy: one(users, {
      fields: [shoppingLists.createdById],
      references: [users.id],
    }),
    items: many(shoppingListItems),
    collaborators: many(shoppingListCollaborators),
  }),
);

export const unitValues = ["kg", "g", "L", "ml", "pcs"] as const;

export const shoppingListItems = projectTable("shoppingListItem", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  shoppingListId: bigint("shoppingListId", { mode: "number" }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  quantity: integer("quantity"),
  unit: varchar("unit", { length: 255, enum: unitValues }),
  createdById: varchar("createdById", { length: 255 }).notNull(),
  completedById: varchar("completedById", { length: 255 }),
  completedAt: timestamp("completedAt", { mode: "date", precision: 3 }),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .notNull()
    .defaultNow(),
});

export const shoppingListItemsRelations = relations(
  shoppingListItems,
  ({ one }) => ({
    shoppingList: one(shoppingLists, {
      fields: [shoppingListItems.shoppingListId],
      references: [shoppingLists.id],
    }),
    createdBy: one(users, {
      fields: [shoppingListItems.createdById],
      references: [users.id],
    }),
    completedBy: one(users, {
      fields: [shoppingListItems.completedById],
      references: [users.id],
    }),
  }),
);

export const users = projectTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  shoppingLists: many(shoppingLists),
}));

export const accounts = projectTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = projectTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = projectTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

export type SelectShoppingList = InferSelectModel<typeof shoppingLists>;
export type SelectShoppingListItem = InferSelectModel<typeof shoppingListItems>;
export type SelectUser = InferSelectModel<typeof users>;
export type SelectAccount = InferSelectModel<typeof accounts>;
export type SelectSession = InferSelectModel<typeof sessions>;
export type SelectVerificationToken = InferSelectModel<
  typeof verificationTokens
>;

export type SelectShoppingListWithRelations = SelectShoppingList & {
  createdBy: SelectUser;
  collaborators: SelectUser[];
};

export type SelectShoppingListItemWithRelations = SelectShoppingListItem & {
  createdBy: SelectUser;
  completedBy: SelectUser | null;
};
