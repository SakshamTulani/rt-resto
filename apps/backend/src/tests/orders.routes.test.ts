import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../app";
import { ordersService } from "../services";

// Mock dependencies
vi.mock("../services", () => ({
  ordersService: {
    getAll: vi.fn(),
    create: vi.fn(),
    getById: vi.fn(),
    getByUserId: vi.fn(),
  },
}));

vi.mock("../middleware", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../middleware")>();
  return {
    ...actual,
    requireAuth: vi.fn((req, res, next) => {
      req.user = {
        id: "test-user",
        role: "customer",
        email: "test@example.com",
        name: "Test User",
      };
      next();
    }),
    requireKitchen: vi.fn((req, res, next) => {
      req.user = {
        id: "kitchen-user",
        role: "kitchen",
        email: "kitchen@example.com",
        name: "Kitchen Staff",
      };
      next();
    }),
  };
});

describe("Orders Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/orders", () => {
    it("should return a list of orders for kitchen staff", async () => {
      const mockOrders = [{ id: "1", status: "pending", total: 100 }];
      (ordersService.getAll as any).mockResolvedValue(mockOrders);

      const response = await request(app).get("/api/orders");

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockOrders);
      expect(ordersService.getAll).toHaveBeenCalled();
    });
  });

  describe("POST /api/orders", () => {
    it("should create a new order", async () => {
      // Use a valid UUID for menuItemId since the schema validates it
      const validUuid = "123e4567-e89b-12d3-a456-426614174000";
      const newOrder = {
        sessionId: "session-123",
        items: [
          {
            menuItemId: validUuid,
            quantity: 2,
            notes: "Test item",
          },
        ],
        notes: "Extra spicy",
      };

      const mockCreatedOrder = {
        id: "order-1",
        ...newOrder,
        status: "pending",
      };

      (ordersService.create as any).mockResolvedValue({
        success: true,
        order: mockCreatedOrder,
      });

      const response = await request(app).post("/api/orders").send(newOrder);

      // If validation fails, status will be 400. We expect 201.
      if (response.status === 400) {
        console.error(
          "Validation Error Details:",
          JSON.stringify(response.body, null, 2),
        );
      }

      expect(response.status).toBe(201);
      expect(response.body.data).toEqual(mockCreatedOrder);
      expect(ordersService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: "test-user",
          sessionId: "session-123",
          notes: "Extra spicy",
        }),
      );
    });

    it("should return 400 if validation fails (empty items)", async () => {
      const invalidOrder = {
        sessionId: "session-123",
        items: [],
        notes: "Test",
      };

      const response = await request(app)
        .post("/api/orders")
        .send(invalidOrder);

      expect(response.status).toBe(400);
    });
  });
});
