import {
  pgTable,
  text,
  timestamp,
  integer,
  decimal,
  uuid,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import { user } from "./user";
import { menuItems, customizationOptions } from "./menu";
import { relations } from "drizzle-orm";

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "completed",
  "cancelled",
]);

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").references(() => user.id, {
      onDelete: "set null",
    }),
    sessionId: text("session_id").notNull(),
    status: orderStatusEnum("status").notNull().default("pending"),
    subtotal: integer("subtotal").notNull(),
    tax: integer("tax").notNull(),
    total: integer("total").notNull(),
    notes: text("notes"),
    version: integer("version").notNull().default(1),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("orders_user_id_idx").on(table.userId),
    index("orders_session_id_idx").on(table.sessionId),
    index("orders_status_idx").on(table.status),
  ],
);

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    menuItemId: uuid("menu_item_id")
      .notNull()
      .references(() => menuItems.id),
    quantity: integer("quantity").notNull(),
    unitPrice: integer("unit_price").notNull(),
    totalPrice: integer("total_price").notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("order_items_order_id_idx").on(table.orderId),
    index("order_items_menu_item_id_idx").on(table.menuItemId),
  ],
);

export const orderItemCustomizations = pgTable(
  "order_item_customizations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderItemId: uuid("order_item_id")
      .notNull()
      .references(() => orderItems.id, { onDelete: "cascade" }),
    customizationOptionId: uuid("customization_option_id")
      .notNull()
      .references(() => customizationOptions.id),
    price: integer("price").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("order_item_customizations_order_item_id_idx").on(table.orderItemId),
  ],
);

export const orderStatusHistory = pgTable(
  "order_status_history",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    status: orderStatusEnum("status").notNull(),
    changedAt: timestamp("changed_at").notNull().defaultNow(),
    changedById: text("changed_by_id").references(() => user.id),
  },
  (table) => [index("order_status_history_order_id_idx").on(table.orderId)],
);

// Relations
export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(user, {
    fields: [orders.userId],
    references: [user.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  menuItem: one(menuItems, {
    fields: [orderItems.menuItemId],
    references: [menuItems.id],
  }),
}));
