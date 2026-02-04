"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useSession } from "@/modules/auth";
import { OrderCard } from "../components";
import { Loader2, Package, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";

export function OrderHistoryView() {
  const { data: session, isPending: isSessionPending } = useSession();

  const { data, isLoading, error } = useQuery({
    queryKey: ["orders", "my"],
    queryFn: () => api.getMyOrders(),
    enabled: !!session?.user,
  });

  // Still loading session
  if (isSessionPending) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  // Not logged in
  if (!session?.user) {
    return (
      <div className="container py-8">
        <div className="text-center py-20">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Sign in to view orders</h2>
          <p className="text-muted-foreground mb-6">
            Please sign in to view your order history
          </p>
          <Link href="/login">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Loading orders
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="container py-8">
        <div className="text-center py-20">
          <p className="text-red-500">Failed to load orders</p>
        </div>
      </div>
    );
  }

  const orders = data?.data || [];

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Order History</h1>
      </div>

      {/* Orders list */}
      {orders.length === 0 ? (
        <div className="text-center py-20">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
          <p className="text-muted-foreground mb-6">
            Your order history will appear here
          </p>
          <Link href="/">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              Browse Menu
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
