import type {
  Category,
  MenuItem,
  MenuFilterParams,
  ApiResponse,
  OrderWithItems,
} from "@workspace/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: FetchOptions = {},
  ): Promise<T> {
    const { params, ...init } = options;

    let url = `${this.baseUrl}${endpoint}`;

    // Add query parameters
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    const response = await fetch(url, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init.headers,
      },
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Categories
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return this.request("/api/categories");
  }

  async getCategoryBySlug(slug: string): Promise<ApiResponse<Category>> {
    return this.request(`/api/categories/slug/${slug}`);
  }

  // Menu
  async getMenuItems(
    filters?: MenuFilterParams,
  ): Promise<ApiResponse<MenuItem[]>> {
    return this.request("/api/menu", {
      params: filters as Record<string, string | number | boolean | undefined>,
    });
  }

  async getMenuItem(id: string): Promise<ApiResponse<MenuItem>> {
    return this.request(`/api/menu/${id}`);
  }

  // Orders
  async validateCart(
    items: { menuItemId: string; quantity: number; notes?: string }[],
  ): Promise<
    ApiResponse<{
      subtotal: number;
      tax: number;
      total: number;
      itemCount: number;
    }>
  > {
    return this.request("/api/orders/validate", {
      method: "POST",
      body: JSON.stringify({ sessionId: this.getSessionId(), items }),
    });
  }

  async createOrder(
    items: { menuItemId: string; quantity: number; notes?: string }[],
    notes?: string,
  ): Promise<ApiResponse<OrderWithItems>> {
    return this.request("/api/orders", {
      method: "POST",
      body: JSON.stringify({
        sessionId: this.getSessionId(),
        items,
        notes,
      }),
    });
  }

  // Get current user's orders (requires auth)
  async getMyOrders(): Promise<ApiResponse<OrderWithItems[]>> {
    return this.request("/api/orders/my");
  }

  async getSessionOrders(): Promise<ApiResponse<OrderWithItems[]>> {
    return this.request(`/api/orders/session/${this.getSessionId()}`);
  }

  async getOrder(id: string): Promise<ApiResponse<OrderWithItems>> {
    return this.request(`/api/orders/${id}`);
  }

  async cancelOrder(id: string): Promise<{ message: string }> {
    return this.request(`/api/orders/${id}/cancel`, { method: "POST" });
  }

  // --- Admin / Kitchen Methods ---

  async getAllOrders(status?: string): Promise<ApiResponse<OrderWithItems[]>> {
    return this.request("/api/orders", {
      params: status ? { status } : undefined,
    });
  }

  async updateOrderStatus(
    id: string,
    status: string,
  ): Promise<ApiResponse<OrderWithItems>> {
    return this.request(`/api/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  }

  async createMenuItem(
    data: Partial<MenuItem>,
  ): Promise<ApiResponse<MenuItem>> {
    return this.request("/api/menu", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateMenuItem(
    id: string,
    data: Partial<MenuItem>,
  ): Promise<ApiResponse<MenuItem>> {
    return this.request(`/api/menu/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteMenuItem(id: string): Promise<void> {
    return this.request(`/api/menu/${id}`, {
      method: "DELETE",
    });
  }

  // Session management
  private getSessionId(): string {
    if (typeof window === "undefined") return "";

    let sessionId = localStorage.getItem("session_id");
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem("session_id", sessionId);
    }
    return sessionId;
  }
}

export const api = new ApiClient(API_BASE_URL);
