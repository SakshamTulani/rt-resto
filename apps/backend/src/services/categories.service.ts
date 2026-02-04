import { db } from "../db";
import { categories } from "../db/schema";
import { eq } from "drizzle-orm";

export const categoriesService = {
  async getAll() {
    return db.query.categories.findMany({
      orderBy: (categories, { asc }) => [asc(categories.sortOrder)],
    });
  },

  async getById(id: string) {
    return db.query.categories.findFirst({
      where: eq(categories.id, id),
    });
  },

  async getBySlug(slug: string) {
    return db.query.categories.findFirst({
      where: eq(categories.slug, slug),
    });
  },

  async create(data: { name: string; slug: string; sortOrder?: number }) {
    const [category] = await db
      .insert(categories)
      .values({
        name: data.name,
        slug: data.slug,
        sortOrder: data.sortOrder ?? 0,
      })
      .returning();
    return category;
  },

  async update(
    id: string,
    data: Partial<{ name: string; slug: string; sortOrder: number }>,
  ) {
    const [category] = await db
      .update(categories)
      .set(data)
      .where(eq(categories.id, id))
      .returning();
    return category;
  },

  async delete(id: string) {
    const [category] = await db
      .delete(categories)
      .where(eq(categories.id, id))
      .returning();
    return category;
  },
};
