import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  decimal,
  uuid,
  index,
} from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const menuItems = pgTable(
  "menu_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description").notNull().default(""),
    imageUrl: text("image_url"),
    basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
    prepTimeMinutes: integer("prep_time_minutes").notNull().default(15),
    isAvailable: boolean("is_available").notNull().default(true),
    isVegetarian: boolean("is_vegetarian").notNull().default(false),
    isVegan: boolean("is_vegan").notNull().default(false),
    isGlutenFree: boolean("is_gluten_free").notNull().default(false),
    stockQuantity: integer("stock_quantity"), // null = unlimited
    version: integer("version").notNull().default(1), // optimistic locking
    deletedAt: timestamp("deleted_at"), // soft delete
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [index("menu_items_category_id_idx").on(table.categoryId)],
);

export const customizationGroups = pgTable(
  "customization_groups",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    menuItemId: uuid("menu_item_id")
      .notNull()
      .references(() => menuItems.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    isRequired: boolean("is_required").notNull().default(false),
    maxSelections: integer("max_selections").notNull().default(1),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("customization_groups_menu_item_id_idx").on(table.menuItemId),
  ],
);

export const customizationOptions = pgTable(
  "customization_options",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    groupId: uuid("group_id")
      .notNull()
      .references(() => customizationGroups.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    priceModifier: decimal("price_modifier", { precision: 10, scale: 2 })
      .notNull()
      .default("0"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("customization_options_group_id_idx").on(table.groupId)],
);

import { relations } from "drizzle-orm";

export const categoriesRelations = relations(categories, ({ many }) => ({
  menuItems: many(menuItems),
}));

export const menuItemsRelations = relations(menuItems, ({ one, many }) => ({
  category: one(categories, {
    fields: [menuItems.categoryId],
    references: [categories.id],
  }),
  customizationGroups: many(customizationGroups),
}));

export const customizationGroupsRelations = relations(
  customizationGroups,
  ({ one, many }) => ({
    menuItem: one(menuItems, {
      fields: [customizationGroups.menuItemId],
      references: [menuItems.id],
    }),
    options: many(customizationOptions),
  }),
);

export const customizationOptionsRelations = relations(
  customizationOptions,
  ({ one }) => ({
    group: one(customizationGroups, {
      fields: [customizationOptions.groupId],
      references: [customizationGroups.id],
    }),
  }),
);
