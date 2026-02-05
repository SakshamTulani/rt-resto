import { describe, it, expect, vi, beforeEach } from "vitest";
import { ordersService } from "./orders.service";
import { db } from "../db";
import { orderEvents } from "../socket";

// Mock dependencies
vi.mock("../db", () => ({
  db: {
    query: {
      orders: {
        findMany: vi.fn(),
        findFirst: vi.fn(),
      },
      menuItems: {
        findMany: vi.fn(),
      },
    },
    transaction: vi.fn((callback) =>
      callback({
        insert: vi.fn(() => ({
          values: vi.fn(() => ({
            returning: vi.fn(),
          })),
        })),
        update: vi.fn(() => ({
          set: vi.fn(() => ({
            where: vi.fn(),
          })),
        })),
      }),
    ),
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn(() => ({
          returning: vi.fn(),
        })),
      })),
    })),
  },
}));

vi.mock("../socket", () => ({
  orderEvents: {
    created: vi.fn(),
    statusUpdated: vi.fn(),
    cancelled: vi.fn(),
  },
}));

vi.mock("../db/schema", () => ({
  orders: {
    id: "orders",
    status: "status",
    createdAt: "createdAt",
    userId: "userId",
    sessionId: "sessionId",
  },
  orderItems: {},
  menuItems: {
    id: "menuItems",
    isAvailable: "isAvailable",
    stockQuantity: "stockQuantity",
  },
}));

vi.mock("drizzle-orm", () => {
  const sqlMock = vi.fn((strings, ...values) => "sql-mock");
  (sqlMock as any).join = vi.fn(() => "sql-join-mock");
  return {
    eq: vi.fn(),
    and: vi.fn(),
    desc: vi.fn(),
    sql: sqlMock,
  };
});

// Helper to mock db responses
const mockDb = db as any;

describe("OrdersService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("validateCart", () => {
    it("should calculate totals correctly for valid items", async () => {
      // Setup
      const items = [
        { menuItemId: "item1", quantity: 2 },
        { menuItemId: "item2", quantity: 1 },
      ];

      const mockMenuItems = [
        {
          id: "item1",
          name: "Burger",
          basePrice: 100,
          stockQuantity: 10,
          isAvailable: true,
        },
        {
          id: "item2",
          name: "Fries",
          basePrice: 50,
          stockQuantity: 20,
          isAvailable: true,
        },
      ];

      mockDb.query.menuItems.findMany.mockResolvedValue(mockMenuItems);

      // Execute
      const result = await ordersService.validateCart(items);

      // Verify
      expect(result.valid).toBe(true);
      expect(result.subtotal).toBe(250); // (100 * 2) + (50 * 1)
      expect(result.tax).toBe(25); // 10% of 250
      expect(result.total).toBe(275);
      expect(result.items).toHaveLength(2);
    });

    it("should return error for invalid menu item", async () => {
      // Setup
      const items = [{ menuItemId: "invalid-id", quantity: 1 }];
      mockDb.query.menuItems.findMany.mockResolvedValue([]);

      // Execute
      const result = await ordersService.validateCart(items);

      // Verify
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        "Menu item invalid-id not found or unavailable",
      );
    });

    it("should return error for insufficient stock", async () => {
      // Setup
      const items = [{ menuItemId: "item1", quantity: 10 }];
      const mockMenuItems = [
        {
          id: "item1",
          name: "Limited Item",
          basePrice: 100,
          stockQuantity: 5,
          isAvailable: true,
        },
      ];
      mockDb.query.menuItems.findMany.mockResolvedValue(mockMenuItems);

      // Execute
      const result = await ordersService.validateCart(items);

      // Verify
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain("Insufficient stock");
    });
  });

  describe("create", () => {
    it("should create order successfully", async () => {
      // Setup
      const input = {
        sessionId: "session-123",
        items: [{ menuItemId: "item1", quantity: 1 }],
      };

      const mockMenuItems = [
        {
          id: "item1",
          name: "Burger",
          basePrice: 100,
          stockQuantity: 10,
          isAvailable: true,
        },
      ];
      mockDb.query.menuItems.findMany.mockResolvedValue(mockMenuItems);

      // Mock tx chain
      const mockTx = {
        insert: vi.fn().mockReturnValue({
          values: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([{ id: "order-123" }]),
          }),
        }),
        update: vi.fn().mockReturnValue({
          set: vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue({}),
          }),
        }),
      };

      mockDb.transaction.mockImplementation(async (cb: any) => cb(mockTx));
      mockDb.query.orders.findFirst.mockResolvedValue({
        id: "order-123",
        status: "pending",
      });

      // Execute
      const result = await ordersService.create(input);

      // Verify
      expect(result.success).toBe(true);
      expect(mockDb.transaction).toHaveBeenCalled();
      expect(orderEvents.created).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "order-123",
          sessionId: "session-123",
        }),
      );
    });

    it("should fail if validation fails", async () => {
      // Setup
      const input = {
        sessionId: "session-123",
        items: [{ menuItemId: "invalid", quantity: 1 }],
      };
      mockDb.query.menuItems.findMany.mockResolvedValue([]);

      // Execute
      const result = await ordersService.create(input);

      // Verify
      expect(result.success).toBe(false);
      expect(mockDb.transaction).not.toHaveBeenCalled();
    });
  });

  describe("updateStatus", () => {
    it("should update status and emit event", async () => {
      // Setup
      const orderId = "order-123";
      const newStatus = "preparing";

      mockDb.query.orders.findFirst.mockResolvedValue({
        id: orderId,
        status: "pending",
        sessionId: "session-123",
      });

      mockDb.update.mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi
              .fn()
              .mockResolvedValue([{ id: orderId, status: newStatus }]),
          }),
        }),
      });

      // Execute
      await ordersService.updateStatus(orderId, newStatus);

      // Verify
      expect(mockDb.update).toHaveBeenCalled();
      expect(orderEvents.statusUpdated).toHaveBeenCalledWith(
        expect.objectContaining({
          id: orderId,
          status: newStatus,
          previousStatus: "pending",
        }),
      );
    });
  });
});
