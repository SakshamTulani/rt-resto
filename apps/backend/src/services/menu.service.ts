import { db } from "../db";
import { menuItems } from "../db/schema";
import { eq, and, ilike, gte, lte, isNull, or, sql, SQL } from "drizzle-orm";

interface MenuFilterParams {
  categoryId?: string;
  search?: string;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
}

export const menuService = {
  async getAll(filters: MenuFilterParams = {}) {
    const conditions: SQL[] = [];

    // Only non-deleted items
    conditions.push(isNull(menuItems.deletedAt));

    if (filters.categoryId) {
      conditions.push(eq(menuItems.categoryId, filters.categoryId));
    }

    if (filters.search) {
      conditions.push(
        or(
          ilike(menuItems.name, `%${filters.search}%`),
          ilike(menuItems.description, `%${filters.search}%`),
        )!,
      );
    }

    if (filters.isVegetarian) {
      conditions.push(eq(menuItems.isVegetarian, true));
    }

    if (filters.isVegan) {
      conditions.push(eq(menuItems.isVegan, true));
    }

    if (filters.isGlutenFree) {
      conditions.push(eq(menuItems.isGlutenFree, true));
    }

    if (filters.minPrice !== undefined) {
      conditions.push(gte(menuItems.basePrice, filters.minPrice));
    }

    if (filters.maxPrice !== undefined) {
      conditions.push(lte(menuItems.basePrice, filters.maxPrice));
    }

    if (filters.available !== undefined) {
      conditions.push(eq(menuItems.isAvailable, filters.available));
    }

    return db.query.menuItems.findMany({
      where: and(...conditions),
      with: {
        category: true,
      },
      orderBy: (menuItems, { asc }) => [asc(menuItems.name)],
    });
  },

  async getById(id: string) {
    return db.query.menuItems.findFirst({
      where: and(eq(menuItems.id, id), isNull(menuItems.deletedAt)),
    });
  },

  async create(data: {
    categoryId: string;
    name: string;
    description?: string;
    imageUrl?: string | null;
    basePrice: number;
    prepTimeMinutes?: number;
    isVegetarian?: boolean;
    isVegan?: boolean;
    isGlutenFree?: boolean;
    stockQuantity?: number | null;
  }) {
    const [item] = await db
      .insert(menuItems)
      .values({
        categoryId: data.categoryId,
        name: data.name,
        description: data.description ?? "",
        imageUrl: data.imageUrl ?? null,
        basePrice: data.basePrice,
        prepTimeMinutes: data.prepTimeMinutes ?? 15,
        isVegetarian: data.isVegetarian ?? false,
        isVegan: data.isVegan ?? false,
        isGlutenFree: data.isGlutenFree ?? false,
        stockQuantity: data.stockQuantity ?? null,
      })
      .returning();
    return item;
  },

  async update(
    id: string,
    data: Partial<{
      categoryId: string;
      name: string;
      description: string;
      imageUrl: string | null;
      basePrice: number;
      prepTimeMinutes: number;
      isAvailable: boolean;
      isVegetarian: boolean;
      isVegan: boolean;
      isGlutenFree: boolean;
      stockQuantity: number | null;
    }>,
  ) {
    // Increment version for optimistic locking
    const updateData: Record<string, unknown> = {
      ...data,
      updatedAt: new Date(),
    };
    if (data.basePrice !== undefined) {
      updateData.basePrice = data.basePrice;
      updateData.version = sql`${menuItems.version} + 1`; // Increment version on price change
    }

    const [item] = await db
      .update(menuItems)
      .set(updateData)
      .where(and(eq(menuItems.id, id), isNull(menuItems.deletedAt)))
      .returning();
    return item;
  },

  async softDelete(id: string) {
    const [item] = await db
      .update(menuItems)
      .set({ deletedAt: new Date(), isAvailable: false })
      .where(eq(menuItems.id, id))
      .returning();
    return item;
  },
};
