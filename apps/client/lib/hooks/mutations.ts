"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import { useCartStore } from "../store/cart";
import { orderKeys } from "./queries";

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const { items, clearCart } = useCartStore();

  return useMutation({
    mutationFn: (notes?: string) => {
      const orderItems = items.map((item) => ({
        menuItemId: item.menuItem.id,
        quantity: item.quantity,
        notes: item.notes,
      }));
      return api.createOrder(orderItems, notes);
    },
    onSuccess: () => {
      clearCart();
      queryClient.invalidateQueries({ queryKey: orderKeys.session });
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => api.cancelOrder(orderId),
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.session });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
    },
  });
}

export function useValidateCart() {
  const { items } = useCartStore();

  return useMutation({
    mutationFn: () => {
      const cartItems = items.map((item) => ({
        menuItemId: item.menuItem.id,
        quantity: item.quantity,
        notes: item.notes,
      }));
      return api.validateCart(cartItems);
    },
  });
}
