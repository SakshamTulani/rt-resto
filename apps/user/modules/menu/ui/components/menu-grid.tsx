"use client";

import type { MenuItem } from "@workspace/types";
import { MenuCard } from "./menu-card";

interface MenuGridProps {
  items: MenuItem[];
  isLoading?: boolean;
}

export function MenuGrid({ items, isLoading }: MenuGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl border bg-card overflow-hidden animate-pulse">
            <div className="aspect-4/3 bg-muted" />
            <div className="p-4 space-y-3">
              <div className="h-5 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-6 bg-muted rounded w-16" />
                <div className="h-10 bg-muted rounded w-10" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No items found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <MenuCard key={item.id} item={item} />
      ))}
    </div>
  );
}
