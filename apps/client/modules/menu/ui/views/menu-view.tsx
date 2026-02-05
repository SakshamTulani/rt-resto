"use client";

import { useCategories, useMenuItems } from "@/lib/hooks";
import { useState } from "react";
import { CategoryNav, MenuGrid } from "../components";
import type { Category } from "@workspace/types";

export function MenuView() {
  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >();
  const { data: categoriesData, isLoading: categoriesLoading } =
    useCategories();
  const { data: menuData, isLoading: menuLoading } = useMenuItems({
    categoryId: selectedCategory,
  });

  const categories = categoriesData?.data ?? [];
  const menuItems = menuData?.data ?? [];

  return (
    <>
      {/* Category Navigation */}
      <CategoryNav
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
        isLoading={categoriesLoading}
      />

      {/* Menu Grid */}
      <main className="container px-4 py-6">
        <h2 className="text-2xl font-bold mb-6">
          {selectedCategory
            ? (categories.find((c: Category) => c.id === selectedCategory)
                ?.name ?? "Menu")
            : "All Items"}
        </h2>
        <MenuGrid items={menuItems} isLoading={menuLoading} />
      </main>
    </>
  );
}
