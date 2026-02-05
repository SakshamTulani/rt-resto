"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { MenuItem } from "@workspace/types";
import { toast } from "sonner";

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
}

interface CartState {
  items: CartItem[];

  // Actions
  addItem: (menuItem: MenuItem, quantity?: number, notes?: string) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  updateNotes: (menuItemId: string, notes: string) => void;
  clearCart: () => void;

  // Computed
  getItemCount: () => number;
  getSubtotal: () => number;
  getTax: () => number;
  getTotal: () => number;
}

const TAX_RATE = 0.1; // 10%

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      // ... inside store ...

      addItem: (menuItem, quantity = 1, notes) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.menuItem.id === menuItem.id,
          );

          // Check stock limit
          const currentQty =
            existingIndex >= 0 ? state.items[existingIndex]!.quantity : 0;
          const newTotal = currentQty + quantity;

          if (
            menuItem.stockQuantity !== null &&
            menuItem.stockQuantity !== undefined &&
            newTotal > menuItem.stockQuantity
          ) {
            toast.error(
              `Only ${menuItem.stockQuantity} items available in stock`,
            );
            return state;
          }

          if (existingIndex >= 0) {
            // Update existing item
            const newItems = [...state.items];
            const existingItem = newItems[existingIndex];
            if (existingItem) {
              newItems[existingIndex] = {
                menuItem: existingItem.menuItem,
                quantity: existingItem.quantity + quantity,
                notes: existingItem.notes,
              };
            }
            return { items: newItems };
          }

          // Add new item
          return {
            items: [...state.items, { menuItem, quantity, notes }],
          };
        });
      },

      removeItem: (menuItemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.menuItem.id !== menuItemId),
        }));
      },

      updateQuantity: (menuItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(menuItemId);
          return;
        }

        set((state) => {
          const item = state.items.find((i) => i.menuItem.id === menuItemId);
          if (!item) return state;

          if (
            item.menuItem.stockQuantity !== null &&
            item.menuItem.stockQuantity !== undefined &&
            quantity > item.menuItem.stockQuantity
          ) {
            toast.error(
              `Only ${item.menuItem.stockQuantity} items available in stock`,
            );
            return state;
          }

          return {
            items: state.items.map((i) =>
              i.menuItem.id === menuItemId ? { ...i, quantity } : i,
            ),
          };
        });
      },

      updateNotes: (menuItemId, notes) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.menuItem.id === menuItemId ? { ...item, notes } : item,
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => {
          const price = item.menuItem.basePrice / 100;
          return sum + price * item.quantity;
        }, 0);
      },

      getTax: () => {
        return get().getSubtotal() * TAX_RATE;
      },

      getTotal: () => {
        return get().getSubtotal() + get().getTax();
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
