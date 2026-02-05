"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  connectSocket,
  disconnectSocket,
  type OrderCreatedEvent,
  type OrderStatusUpdatedEvent,
  type OrderCancelledEvent,
} from "@/lib/socket";
import { toast } from "sonner";

export function useAdminSocket() {
  const queryClient = useQueryClient();
  const hasJoined = useRef(false);

  useEffect(() => {
    const socket = connectSocket();

    // Join admin room once connected
    const handleConnect = () => {
      if (!hasJoined.current) {
        socket.emit("join:admin");
        hasJoined.current = true;
        console.log("Admin socket connected and joined admin room");
      }
    };

    // Handle order events
    const handleOrderCreated = (data: OrderCreatedEvent) => {
      console.log("New order received:", data.orderId);
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.info("New order received!", {
        description: `Order #${data.orderId.slice(0, 8)}...`,
      });
    };

    const handleOrderStatusUpdated = (data: OrderStatusUpdatedEvent) => {
      console.log("Order status updated:", data.orderId, data.status);
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    };

    const handleOrderCancelled = (data: OrderCancelledEvent) => {
      console.log("Order cancelled:", data.orderId);
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.warning("Order cancelled", {
        description: `Order #${data.orderId.slice(0, 8)}...`,
      });
    };

    // Register listeners
    socket.on("connect", handleConnect);
    socket.on("order:created", handleOrderCreated);
    socket.on("order:status-updated", handleOrderStatusUpdated);
    socket.on("order:cancelled", handleOrderCancelled);

    // If already connected, join immediately
    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("order:created", handleOrderCreated);
      socket.off("order:status-updated", handleOrderStatusUpdated);
      socket.off("order:cancelled", handleOrderCancelled);
      hasJoined.current = false;
      disconnectSocket();
    };
  }, [queryClient]);
}
