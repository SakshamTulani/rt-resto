"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { OrderTimeline } from "../components/order-timeline";
import { Loader2, ArrowLeft, Calendar, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";

import { useParams, useRouter } from "next/navigation";

export function OrderDetailView() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ["order", id],
    queryFn: () => api.getOrder(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="container py-8 text-center min-h-[50vh] flex flex-col items-center justify-center">
        <h2 className="text-xl font-semibold mb-2">Order not found</h2>
        <p className="text-muted-foreground mb-6">
          Could not find the requested order.
        </p>
        <Link href="/orders">
          <Button variant="outline">Back to Orders</Button>
        </Link>
      </div>
    );
  }

  const order = data.data;

  return (
    <div className="container py-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Order Details</h1>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <span className="font-mono">#{order.id.slice(0, 8)}</span>
            <span>•</span>
            <Calendar className="h-3 w-3" />
            {new Date(order.createdAt).toLocaleDateString()} at{" "}
            {new Date(order.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="mb-10 bg-card rounded-xl border p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Order Status</h2>
        <OrderTimeline status={order.status} />
      </div>

      {/* Order Summary */}
      <div className="bg-card rounded-xl border overflow-hidden shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-orange-500" />
            Order Summary
          </h2>
        </div>

        <div className="divide-y">
          {order.items?.map((item, index) => (
            <div
              key={index}
              className="p-4 flex gap-4 hover:bg-muted/30 transition-colors">
              <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center overflow-hidden shrink-0">
                {item.menuItem?.imageUrl ? (
                  <img
                    src={item.menuItem.imageUrl}
                    alt={item.menuItem.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xl">🍽️</span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium">{item.menuItem?.name}</h3>
                  <p className="font-semibold">
                    ${parseFloat(String(item.totalPrice)).toFixed(2)}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Quantity: {item.quantity}
                </p>
                {item.notes && (
                  <p className="text-xs text-muted-foreground italic mt-1">
                    &quot;{item.notes}&quot;
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Totals */}
        <div className="p-6 bg-muted/20 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${parseFloat(String(order.subtotal)).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax</span>
            <span>${parseFloat(String(order.tax)).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold pt-4 border-t mt-4">
            <span>Total</span>
            <span className="text-orange-500">
              ${parseFloat(String(order.total)).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
