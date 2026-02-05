"use client";

import type { OrderWithItems } from "@workspace/types";
import Link from "next/link";

interface OrderCardProps {
  order: OrderWithItems;
}

// Status config removed as unused
// const statusConfig = { ... }

export function OrderCard({ order }: OrderCardProps) {
  const total = order.total / 100;
  const createdAt = new Date(order.createdAt);

  return (
    <Link href={`/orders/${order.id}`}>
      <div className="rounded-xl border bg-card p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-muted-foreground">Order ID</p>
            <p className="font-mono text-sm">{order.id.slice(0, 8)}...</p>
          </div>
        </div>

        {/* Items Summary */}
        <div className="mb-3">
          <p className="text-sm text-muted-foreground">
            {order.items?.reduce((acc, item) => acc + item.quantity, 0) || 0}{" "}
            items
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t">
          <p className="text-xs text-muted-foreground">
            {createdAt.toLocaleDateString()} at{" "}
            {createdAt.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p className="text-lg font-bold text-orange-500">
            ${total.toFixed(2)}
          </p>
        </div>
      </div>
    </Link>
  );
}
