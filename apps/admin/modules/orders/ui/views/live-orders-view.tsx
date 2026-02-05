"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { AdminOrderCard } from "../components/admin-order-card";
import { OrderStatus, OrderWithItems } from "@workspace/types";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAdminSocket } from "@/hooks/use-admin-socket";

export function LiveOrdersView() {
  const queryClient = useQueryClient();

  // Connect to socket for real-time updates
  useAdminSocket();

  // Fetch orders (no polling needed with WebSocket)
  const { data, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => api.getAllOrders(),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      api.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Order status updated");
    },
    onError: () => {
      toast.error("Failed to update status");
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => api.cancelOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Order cancelled");
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  const orders = data?.data || [];

  // Group orders by status
  const columns: {
    title: string;
    status: OrderStatus;
    orders: OrderWithItems[];
  }[] = [
    {
      title: "Incoming",
      status: "pending",
      orders: orders.filter((o) => o.status === "pending"),
    },
    {
      title: "Prep Queue",
      status: "confirmed",
      orders: orders.filter((o) => o.status === "confirmed"),
    },
    {
      title: "Cooking",
      status: "preparing",
      orders: orders.filter((o) => o.status === "preparing"),
    },
    {
      title: "Ready",
      status: "ready",
      orders: orders.filter((o) => o.status === "ready"),
    },
    {
      title: "Completed",
      status: "completed",
      orders: orders.filter((o) => o.status === "completed"),
    },
    {
      title: "Cancelled",
      status: "cancelled",
      orders: orders.filter((o) => o.status === "cancelled"),
    },
  ];

  return (
    <div className="h-[calc(100vh-4rem)] p-4 overflow-x-auto">
      <div className="flex gap-4 min-w-max h-full">
        {columns.map((col) => (
          <div
            key={col.status}
            className="flex-1 w-80 min-w-80 flex flex-col h-full">
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="font-semibold text-lg">{col.title}</h2>
              <span className="bg-muted px-2 py-0.5 rounded-full text-xs font-medium">
                {col.orders.length}
              </span>
            </div>

            <div className="bg-muted/30 rounded-xl p-3 flex-1 overflow-y-auto space-y-3 border">
              {col.orders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm italic">
                  No orders
                </div>
              ) : (
                col.orders.map((order) => (
                  <AdminOrderCard
                    key={order.id}
                    order={order}
                    onUpdateStatus={(id, status) =>
                      updateStatusMutation.mutate({ id, status })
                    }
                    onCancel={(id) => cancelMutation.mutate(id)}
                    isUpdating={
                      updateStatusMutation.isPending || cancelMutation.isPending
                    }
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
