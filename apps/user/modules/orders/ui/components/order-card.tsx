"use client";

import type { OrderWithItems } from "@workspace/types";
import {
  Clock,
  Package,
  ChefHat,
  Bell,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";

interface OrderCardProps {
  order: OrderWithItems;
}

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock,
    color: "text-yellow-500",
    bg: "bg-yellow-50 dark:bg-yellow-950/20",
  },
  confirmed: {
    label: "Confirmed",
    icon: Package,
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950/20",
  },
  preparing: {
    label: "Preparing",
    icon: ChefHat,
    color: "text-orange-500",
    bg: "bg-orange-50 dark:bg-orange-950/20",
  },
  ready: {
    label: "Ready",
    icon: Bell,
    color: "text-green-500",
    bg: "bg-green-50 dark:bg-green-950/20",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle,
    color: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-950/20",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-50 dark:bg-red-950/20",
  },
};

export function OrderCard({ order }: OrderCardProps) {
  const status = statusConfig[order.status] || statusConfig.pending;
  const StatusIcon = status.icon;
  const total = parseFloat(String(order.total));
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
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${status.bg}`}>
            <StatusIcon className={`h-4 w-4 ${status.color}`} />
            <span className={`text-sm font-medium ${status.color}`}>
              {status.label}
            </span>
          </div>
        </div>

        {/* Items */}
        <div className="space-y-1 mb-3">
          {order.items?.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {item.quantity}x {item.menuItem?.name || "Item"}
              </span>
              <span>${parseFloat(String(item.totalPrice)).toFixed(2)}</span>
            </div>
          ))}
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
