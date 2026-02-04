"use client";

import type { MenuItem } from "@workspace/types";
import { useCartStore } from "@/lib/store";
import { Plus, Leaf, Wheat, Vegan } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

interface MenuCardProps {
  item: MenuItem;
}

export function MenuCard({ item }: MenuCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const price = parseFloat(String(item.basePrice));

  const handleAddToCart = () => {
    addItem(item, 1);
  };

  return (
    <div className="group rounded-xl border bg-card overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
      {/* Image */}
      <div className="aspect-4/3 bg-linear-to-br from-orange-100 to-orange-50 dark:from-orange-950/20 dark:to-orange-900/10 relative overflow-hidden">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl">🍽️</span>
          </div>
        )}

        {/* Dietary badges */}
        <div className="absolute top-2 left-2 flex gap-1">
          {item.isVegetarian && (
            <span
              className="bg-green-500 text-white p-1.5 rounded-full"
              title="Vegetarian">
              <Leaf className="h-3 w-3" />
            </span>
          )}
          {item.isVegan && (
            <span
              className="bg-emerald-500 text-white p-1.5 rounded-full"
              title="Vegan">
              <Vegan className="h-3 w-3" />
            </span>
          )}
          {item.isGlutenFree && (
            <span
              className="bg-amber-500 text-white p-1.5 rounded-full"
              title="Gluten Free">
              <Wheat className="h-3 w-3" />
            </span>
          )}
        </div>

        {/* Unavailable overlay */}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-semibold">Unavailable</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg line-clamp-1">{item.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1 min-h-10">
          {item.description || "Delicious dish prepared with care"}
        </p>

        <div className="flex items-center justify-between mt-4">
          <span className="text-lg font-bold text-orange-500">
            ${price.toFixed(2)}
          </span>
          <Button
            size="icon"
            onClick={handleAddToCart}
            disabled={!item.isAvailable}
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-full h-10 w-10">
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {/* Prep time */}
        {item.prepTimeMinutes && (
          <p className="text-xs text-muted-foreground mt-2">
            ⏱️ {item.prepTimeMinutes} min
          </p>
        )}
      </div>
    </div>
  );
}
