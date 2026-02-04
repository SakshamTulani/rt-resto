"use client";

import { useCartStore } from "@/lib/store";
import { ShoppingCart } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

interface CartButtonProps {
  onClick: () => void;
}

export function CartButton({ onClick }: CartButtonProps) {
  const itemCount = useCartStore((state) => state.getItemCount());

  return (
    <Button
      variant="outline"
      size="icon"
      className="relative cursor-pointer"
      onClick={onClick}>
      <ShoppingCart className="h-5 w-5" />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-orange-500 text-xs text-white flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </Button>
  );
}
