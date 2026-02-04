"use client";

import { useCartStore, type CartItem } from "@/lib/store";
import { useCreateOrder } from "@/lib/hooks";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { useState } from "react";

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    getSubtotal,
    getTax,
    getTotal,
  } = useCartStore();
  const createOrder = useCreateOrder();
  const [notes, setNotes] = useState("");

  const handlePlaceOrder = async () => {
    try {
      await createOrder.mutateAsync(notes || undefined);
      setNotes("");
      onOpenChange(false);
      alert("Order placed successfully!");
    } catch (error) {
      alert("Failed to place order. Please try again.");
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={() => onOpenChange(false)}
      />

      {/* Sheet */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-orange-500" />
            <h2 className="text-lg font-semibold">Your Cart</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <ShoppingBag className="h-16 w-16 mb-4 opacity-20" />
              <p>Your cart is empty</p>
              <p className="text-sm">Add some delicious items!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <CartItemCard
                  key={item.menuItem.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>
          )}
        </div>

        {/* Notes & Footer */}
        {items.length > 0 && (
          <div className="border-t p-4 space-y-4">
            {/* Special instructions */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Special Instructions
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any allergies or special requests?"
                className="w-full border rounded-lg p-2 text-sm resize-none h-16 bg-background"
              />
            </div>

            {/* Totals */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${getSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (10%)</span>
                <span>${getTax().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total</span>
                <span className="text-orange-500">
                  ${getTotal().toFixed(2)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={clearCart}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
              <Button
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                onClick={handlePlaceOrder}
                disabled={createOrder.isPending}>
                {createOrder.isPending ? "Placing..." : "Place Order"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

function CartItemCard({ item, onUpdateQuantity, onRemove }: CartItemCardProps) {
  const price = parseFloat(String(item.menuItem.basePrice));
  const totalPrice = price * item.quantity;

  return (
    <div className="flex gap-3 p-3 bg-muted/50 rounded-lg">
      {/* Image */}
      <div className="w-16 h-16 rounded-lg bg-linear-to-br from-orange-100 to-orange-50 dark:from-orange-950/20 dark:to-orange-900/10 flex items-center justify-center shrink-0 overflow-hidden">
        {item.menuItem.imageUrl ? (
          <img
            src={item.menuItem.imageUrl}
            alt={item.menuItem.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-2xl">🍽️</span>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm line-clamp-1">
          {item.menuItem.name}
        </h4>
        <p className="text-sm text-orange-500 font-semibold">
          ${totalPrice.toFixed(2)}
        </p>

        {/* Quantity controls */}
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() =>
              onUpdateQuantity(item.menuItem.id, item.quantity - 1)
            }>
            <Minus className="h-3 w-3" />
          </Button>
          <span className="text-sm font-medium w-6 text-center">
            {item.quantity}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() =>
              onUpdateQuantity(item.menuItem.id, item.quantity + 1)
            }>
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Remove button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-destructive shrink-0"
        onClick={() => onRemove(item.menuItem.id)}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
