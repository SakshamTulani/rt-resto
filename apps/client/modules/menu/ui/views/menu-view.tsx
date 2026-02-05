"use client";

import { useCategories, useMenuItems } from "@/lib/hooks";
import { useState } from "react";
import { CategoryNav, MenuGrid } from "../components";
import type { Category } from "@workspace/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

export function MenuView() {
  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >();
  const [dietaryFilter, setDietaryFilter] = useState("all");

  const { data: categoriesData, isLoading: categoriesLoading } =
    useCategories();

  const filterParams = {
    categoryId: selectedCategory,
    isVegetarian: dietaryFilter === "vegetarian" ? true : undefined,
    isVegan: dietaryFilter === "vegan" ? true : undefined,
    isGlutenFree: dietaryFilter === "gluten-free" ? true : undefined,
  };

  const { data: menuData, isLoading: menuLoading } = useMenuItems(filterParams);

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold">
            {selectedCategory
              ? (categories.find((c: Category) => c.id === selectedCategory)
                  ?.name ?? "Menu")
              : "All Items"}
          </h2>

          <div className="w-[180px]">
            <Select value={dietaryFilter} onValueChange={setDietaryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by diet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="vegetarian">Vegetarian</SelectItem>
                <SelectItem value="vegan">Vegan</SelectItem>
                <SelectItem value="gluten-free">Gluten Free</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <MenuGrid items={menuItems} isLoading={menuLoading} />
      </main>
    </>
  );
}
