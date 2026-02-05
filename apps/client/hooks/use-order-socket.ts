"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  connectSocket,
  disconnectSocket,
  type OrderStatusUpdatedEvent,
  type OrderCancelledEvent,
} from "@/lib/socket";
import { toast } from "sonner";

/**
 * Hook to subscribe to order updates for a specific order
 */
export function useOrderSocket(orderId: string | undefined) {
  const queryClient = useQueryClient();
  const hasJoined = useRef(false);

  useEffect(() => {
    if (!orderId) return;

    const socket = connectSocket();

    const handleConnect = () => {
      if (!hasJoined.current) {
        socket.emit("join:order", orderId);
        hasJoined.current = true;
        console.log(`Joined order room: ${orderId}`);
      }
    };

    const handleStatusUpdated = (data: OrderStatusUpdatedEvent) => {
      if (data.orderId === orderId) {
        queryClient.invalidateQueries({ queryKey: ["order", orderId] });
        toast.info(`Order status: ${data.status}`, {
          description: "Your order has been updated",
        });
      }
    };

    const handleOrderCancelled = (data: OrderCancelledEvent) => {
      if (data.orderId === orderId) {
        queryClient.invalidateQueries({ queryKey: ["order", orderId] });
        toast.error("Order cancelled");
      }
    };

    socket.on("connect", handleConnect);
    socket.on("order:status-updated", handleStatusUpdated);
    socket.on("order:cancelled", handleOrderCancelled);

    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("order:status-updated", handleStatusUpdated);
      socket.off("order:cancelled", handleOrderCancelled);
      hasJoined.current = false;
      disconnectSocket();
    };
  }, [orderId, queryClient]);
}
