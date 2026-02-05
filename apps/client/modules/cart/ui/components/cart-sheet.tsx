"use client";

import { useCartStore, type CartItem } from "@/lib/store";
import { useCreateOrder } from "@/lib/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { useState } from "react";

import { useSession } from "@/modules/auth";
import { useRouter } from "next/navigation";

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@workspace/ui/components/dialog";
import { Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const queryClient = useQueryClient();
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
  const { data: session } = useSession();
  const router = useRouter();

  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentState, setPaymentState] = useState<
    "idle" | "processing" | "success"
  >("idle");

  const handlePlaceOrder = () => {
    if (!session?.user) {
      onOpenChange(false);
      router.push("/login");
      return;
    }
    setIsPaymentOpen(true);
  };

  const processPayment = async () => {
    setPaymentState("processing");
    // Mock payment delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      await createOrder.mutateAsync(notes || undefined);
      // Invalidate menu queries to update stock
      queryClient.invalidateQueries({ queryKey: ["menu"] });

      setPaymentState("success");
      // Wait for success animation
      setTimeout(() => {
        setIsPaymentOpen(false);
        onOpenChange(false);
        setNotes("");
        setPaymentState("idle");
        router.push("/orders");
        toast.success("Order placed successfully!");
      }, 1500);
    } catch (error) {
      setPaymentState("idle");
      toast.error("Failed to place order. Please try again.");
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
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background z-50 shadow-2xl flex flex-col transition-transform duration-300 transform data-[state=closed]:translate-x-full slide-in-from-right animate-in fade-in zoom-in-95">
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
                onClick={handlePlaceOrder}>
                Place Order
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Payment Dialog */}
      <Dialog
        open={isPaymentOpen}
        onOpenChange={(open) =>
          !open && paymentState !== "processing" && setIsPaymentOpen(false)
        }>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Payment</DialogTitle>
            <DialogDescription>
              Confirm your payment of{" "}
              <span className="font-bold text-foreground">
                ${getTotal().toFixed(2)}
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 flex flex-col items-center justify-center space-y-4">
            {paymentState === "idle" && (
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Mock Payment Gateway
                </p>
                <div className="p-4 border rounded-md bg-muted/20 w-full text-left">
                  <p className="font-medium">Credit Card •••• 4242</p>
                </div>
              </div>
            )}

            {paymentState === "processing" && (
              <div className="flex flex-col items-center animate-in fade-in">
                <Loader2 className="h-10 w-10 animate-spin text-orange-500 mb-2" />
                <p>Processing payment...</p>
              </div>
            )}

            {paymentState === "success" && (
              <div className="flex flex-col items-center animate-in zoom-in">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-2">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-green-600">
                  Payment Successful!
                </h3>
                <p className="text-muted-foreground">Order placed.</p>
              </div>
            )}
          </div>

          <DialogFooter className="sm:justify-between">
            {paymentState === "idle" && (
              <>
                <Button variant="ghost" onClick={() => setIsPaymentOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={processPayment}
                  className="bg-orange-500 hover:bg-orange-600">
                  Pay Now
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
