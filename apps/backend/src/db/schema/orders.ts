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
import { users } from "./users";
import { menuItems, customizationOptions } from "./menu";

export const orderStatusEnum = pgEnum("order_status", [
  "received",
  "preparing",
  "ready",
  "completed",
]);

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    customerId: text("customer_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    status: orderStatusEnum("status").notNull().default("received"),
    subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
    tax: decimal("tax", { precision: 10, scale: 2 }).notNull(),
    total: decimal("total", { precision: 10, scale: 2 }).notNull(),
    specialInstructions: text("special_instructions"),
    version: integer("version").notNull().default(1),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("orders_customer_id_idx").on(table.customerId),
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
    unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
    totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
    specialInstructions: text("special_instructions"),
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
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
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
    changedById: text("changed_by_id").references(() => users.id),
  },
  (table) => [index("order_status_history_order_id_idx").on(table.orderId)],
);
