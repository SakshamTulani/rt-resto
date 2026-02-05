"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "../api";
import type { MenuFilterParams } from "@workspace/types";

export const categoryKeys = {
  all: ["categories"] as const,
  bySlug: (slug: string) => ["categories", slug] as const,
};

export const menuKeys = {
  all: ["menu"] as const,
  list: (filters?: MenuFilterParams) => ["menu", "list", filters] as const,
  detail: (id: string) => ["menu", "detail", id] as const,
};

export const orderKeys = {
  session: ["orders", "session"] as const,
  detail: (id: string) => ["orders", id] as const,
};

// Category hooks
export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: () => api.getCategories(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCategoryBySlug(slug: string) {
  return useQuery({
    queryKey: categoryKeys.bySlug(slug),
    queryFn: () => api.getCategoryBySlug(slug),
    enabled: !!slug,
  });
}

// Menu hooks
export function useMenuItems(filters?: MenuFilterParams) {
  return useQuery({
    queryKey: menuKeys.list(filters),
    queryFn: () => api.getMenuItems(filters),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Poll every 30s for stock updates
  });
}

export function useMenuItem(id: string) {
  return useQuery({
    queryKey: menuKeys.detail(id),
    queryFn: () => api.getMenuItem(id),
    enabled: !!id,
  });
}

// Order hooks
export function useSessionOrders() {
  return useQuery({
    queryKey: orderKeys.session,
    queryFn: () => api.getSessionOrders(),
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => api.getOrder(id),
    enabled: !!id,
    refetchInterval: 10 * 1000, // Refetch every 10s to get status updates
  });
}
