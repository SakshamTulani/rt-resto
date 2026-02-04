"use client";

import { OrderWithItems, OrderStatus } from "@workspace/types";
import { Button } from "@workspace/ui/components/button";
import {
  Clock,
  MapPin,
  MoreVertical,
  CheckCircle,
  Play,
  ChefHat,
  Bell,
  XCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface AdminOrderCardProps {
  order: OrderWithItems;
  onUpdateStatus: (id: string, status: OrderStatus) => void;
  onCancel: (id: string) => void;
  isUpdating?: boolean;
}

export function AdminOrderCard({
  order,
  onUpdateStatus,
  onCancel,
  isUpdating,
}: AdminOrderCardProps) {
  const getNextStatus = (current: OrderStatus): OrderStatus | null => {
    switch (current) {
      case "pending":
        return "confirmed";
      case "confirmed":
        return "preparing";
      case "preparing":
        return "ready";
      case "ready":
        return "completed";
      default:
        return null;
    }
  };

  const nextStatus = getNextStatus(order.status);
  const timeAgo = formatDistanceToNow(new Date(order.createdAt), {
    addSuffix: true,
  });

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "border-l-4 border-l-blue-500";
      case "confirmed":
        return "border-l-4 border-l-orange-500";
      case "preparing":
        return "border-l-4 border-l-purple-500";
      case "ready":
        return "border-l-4 border-l-green-500";
      default:
        return "border-l-4 border-l-gray-200";
    }
  };

  const getActionButton = () => {
    if (!nextStatus) return null;

    let label = "Next";
    let icon = Play;
    let variant:
      | "default"
      | "secondary"
      | "outline"
      | "ghost"
      | "destructive"
      | "link" = "default";

    switch (order.status) {
      case "pending":
        label = "Accept";
        icon = CheckCircle;
        variant = "default"; // Blueish in theme?
        break;
      case "confirmed":
        label = "Start Prep";
        icon = ChefHat;
        variant = "secondary";
        break;
      case "preparing":
        label = "Ready";
        icon = Bell;
        variant = "default"; // Greenish ideally
        break;
      case "ready":
        label = "Complete";
        icon = CheckCircle;
        variant = "outline";
        break;
    }

    const Icon = icon;

    return (
      <Button
        size="sm"
        className="flex-1"
        variant={variant}
        disabled={isUpdating}
        onClick={() => onUpdateStatus(order.id, nextStatus)}>
        <Icon className="mr-2 h-4 w-4" />
        {label}
      </Button>
    );
  };

  return (
    <div
      className={`bg-card rounded-lg border shadow-sm p-4 ${getStatusColor(
        order.status,
      )} hover:shadow-md transition-shadow`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold">
              #{order.id.slice(0, 4)}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-muted font-medium uppercase">
              {order.status}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <Clock className="h-3 w-3" />
            <span>{timeAgo}</span>
          </div>
        </div>
        {order.status === "pending" && (
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-destructive"
            onClick={() => onCancel(order.id)}
            disabled={isUpdating}>
            <XCircle className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Items */}
      <div className="space-y-2 mb-4">
        {order.items?.map((item, idx) => (
          <div key={idx} className="flex justify-between items-start text-sm">
            <div className="flex gap-2">
              <span className="font-bold w-4">{item.quantity}x</span>
              <span className="flex-1">{item.menuItem?.name || "Item"}</span>
            </div>
            {item.totalPrice && (
              <span className="text-muted-foreground text-xs">
                ${parseFloat(String(item.totalPrice)).toFixed(2)}
              </span>
            )}
          </div>
        ))}
        {order.notes && (
          <div className="mt-2 text-xs bg-yellow-50 dark:bg-yellow-950/30 p-2 rounded text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-900">
            <span className="font-bold">Note:</span> {order.notes}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2 border-t">{getActionButton()}</div>
    </div>
  );
}
