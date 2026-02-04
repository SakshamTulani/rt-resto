"use client";

import type { Category } from "@workspace/types";
import { cn } from "@workspace/ui/lib/utils";

interface CategoryNavProps {
  categories: Category[];
  selectedCategory?: string;
  onSelect: (categoryId: string | undefined) => void;
  isLoading?: boolean;
}

export function CategoryNav({
  categories,
  selectedCategory,
  onSelect,
  isLoading,
}: CategoryNavProps) {
  if (isLoading) {
    return (
      <div className="border-b bg-muted/50">
        <div className="container px-4">
          <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-10 w-24 rounded-full bg-muted animate-pulse shrink-0"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b bg-muted/50">
      <div className="container px-4">
        <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
          <button
            onClick={() => onSelect(undefined)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors shrink-0",
              !selectedCategory
                ? "bg-orange-500 text-white"
                : "bg-background hover:bg-muted border",
            )}>
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onSelect(category.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors shrink-0",
                selectedCategory === category.id
                  ? "bg-orange-500 text-white"
                  : "bg-background hover:bg-muted border",
              )}>
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
