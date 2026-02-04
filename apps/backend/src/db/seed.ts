/**
 * Seed script to populate the database with sample data
 * Run with: pnpm db:seed
 */

import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { categories, menuItems } from "./schema";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString: DATABASE_URL });
const db = drizzle(pool);

const seedCategories = [
  { name: "Appetizers", slug: "appetizers", sortOrder: 1 },
  { name: "Main Course", slug: "main-course", sortOrder: 2 },
  { name: "Pizzas", slug: "pizzas", sortOrder: 3 },
  { name: "Burgers", slug: "burgers", sortOrder: 4 },
  { name: "Sides", slug: "sides", sortOrder: 5 },
  { name: "Desserts", slug: "desserts", sortOrder: 6 },
  { name: "Beverages", slug: "beverages", sortOrder: 7 },
];

async function seed() {
  console.log("🌱 Starting seed...\n");

  // Clear existing data
  console.log("🗑️  Clearing existing data...");
  await db.delete(menuItems);
  await db.delete(categories);

  // Insert categories
  console.log("📁 Inserting categories...");
  const insertedCategories = await db
    .insert(categories)
    .values(seedCategories)
    .returning();

  const categoryMap = new Map(insertedCategories.map((c) => [c.slug, c.id]));

  // Insert menu items
  console.log("🍽️  Inserting menu items...");

  const seedMenuItems = [
    // Appetizers
    {
      categoryId: categoryMap.get("appetizers")!,
      name: "Garlic Bread",
      description: "Crispy bread with garlic butter and herbs",
      basePrice: "5.99",
      prepTimeMinutes: 10,
      isVegetarian: true,
    },
    {
      categoryId: categoryMap.get("appetizers")!,
      name: "Chicken Wings",
      description: "Crispy fried wings with your choice of sauce",
      basePrice: "12.99",
      prepTimeMinutes: 15,
    },
    {
      categoryId: categoryMap.get("appetizers")!,
      name: "Mozzarella Sticks",
      description: "Breaded mozzarella with marinara sauce",
      basePrice: "8.99",
      prepTimeMinutes: 10,
      isVegetarian: true,
    },

    // Main Course
    {
      categoryId: categoryMap.get("main-course")!,
      name: "Grilled Salmon",
      description: "Fresh Atlantic salmon with lemon butter sauce",
      basePrice: "24.99",
      prepTimeMinutes: 25,
      isGlutenFree: true,
    },
    {
      categoryId: categoryMap.get("main-course")!,
      name: "Chicken Parmesan",
      description: "Breaded chicken with marinara and melted cheese",
      basePrice: "18.99",
      prepTimeMinutes: 20,
    },
    {
      categoryId: categoryMap.get("main-course")!,
      name: "Vegetable Stir Fry",
      description: "Fresh vegetables in a savory sauce with rice",
      basePrice: "14.99",
      prepTimeMinutes: 15,
      isVegetarian: true,
      isVegan: true,
    },

    // Pizzas
    {
      categoryId: categoryMap.get("pizzas")!,
      name: "Margherita Pizza",
      description: "Fresh tomatoes, mozzarella, and basil",
      basePrice: "16.99",
      prepTimeMinutes: 20,
      isVegetarian: true,
    },
    {
      categoryId: categoryMap.get("pizzas")!,
      name: "Pepperoni Pizza",
      description: "Classic pepperoni with mozzarella cheese",
      basePrice: "18.99",
      prepTimeMinutes: 20,
    },
    {
      categoryId: categoryMap.get("pizzas")!,
      name: "BBQ Chicken Pizza",
      description: "Grilled chicken, BBQ sauce, red onions",
      basePrice: "19.99",
      prepTimeMinutes: 20,
    },

    // Burgers
    {
      categoryId: categoryMap.get("burgers")!,
      name: "Classic Cheeseburger",
      description: "Angus beef patty with cheddar, lettuce, tomato",
      basePrice: "14.99",
      prepTimeMinutes: 15,
    },
    {
      categoryId: categoryMap.get("burgers")!,
      name: "Bacon Burger",
      description: "Beef patty with crispy bacon and special sauce",
      basePrice: "16.99",
      prepTimeMinutes: 15,
    },
    {
      categoryId: categoryMap.get("burgers")!,
      name: "Veggie Burger",
      description: "Plant-based patty with all the fixings",
      basePrice: "13.99",
      prepTimeMinutes: 15,
      isVegetarian: true,
      isVegan: true,
    },

    // Sides
    {
      categoryId: categoryMap.get("sides")!,
      name: "French Fries",
      description: "Crispy golden fries with sea salt",
      basePrice: "4.99",
      prepTimeMinutes: 8,
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true,
    },
    {
      categoryId: categoryMap.get("sides")!,
      name: "Onion Rings",
      description: "Beer-battered onion rings",
      basePrice: "5.99",
      prepTimeMinutes: 10,
      isVegetarian: true,
    },
    {
      categoryId: categoryMap.get("sides")!,
      name: "Caesar Salad",
      description: "Romaine lettuce with Caesar dressing and croutons",
      basePrice: "7.99",
      prepTimeMinutes: 5,
      isVegetarian: true,
    },

    // Desserts
    {
      categoryId: categoryMap.get("desserts")!,
      name: "Chocolate Lava Cake",
      description: "Warm chocolate cake with molten center",
      basePrice: "8.99",
      prepTimeMinutes: 12,
      isVegetarian: true,
    },
    {
      categoryId: categoryMap.get("desserts")!,
      name: "Cheesecake",
      description: "New York style cheesecake with berry compote",
      basePrice: "7.99",
      prepTimeMinutes: 5,
      isVegetarian: true,
    },
    {
      categoryId: categoryMap.get("desserts")!,
      name: "Ice Cream Sundae",
      description: "Vanilla ice cream with chocolate sauce and nuts",
      basePrice: "6.99",
      prepTimeMinutes: 5,
      isVegetarian: true,
      isGlutenFree: true,
    },

    // Beverages
    {
      categoryId: categoryMap.get("beverages")!,
      name: "Soft Drinks",
      description: "Coke, Sprite, Fanta, or Diet Coke",
      basePrice: "2.99",
      prepTimeMinutes: 1,
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true,
    },
    {
      categoryId: categoryMap.get("beverages")!,
      name: "Fresh Lemonade",
      description: "Freshly squeezed lemonade with mint",
      basePrice: "4.99",
      prepTimeMinutes: 3,
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true,
    },
    {
      categoryId: categoryMap.get("beverages")!,
      name: "Milkshake",
      description: "Chocolate, vanilla, or strawberry",
      basePrice: "5.99",
      prepTimeMinutes: 5,
      isVegetarian: true,
      isGlutenFree: true,
    },
  ];

  await db.insert(menuItems).values(seedMenuItems);

  console.log("\n✅ Seed completed!");
  console.log(`   - ${insertedCategories.length} categories`);
  console.log(`   - ${seedMenuItems.length} menu items`);

  await pool.end();
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seed failed:", error);
  process.exit(1);
});
