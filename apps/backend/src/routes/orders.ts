import { Router, type Request, type Response } from "express";
import { ordersService } from "../services";
import {
  requireAuth,
  requireAdmin,
  requireKitchen,
  validateBody,
} from "../middleware";
import {
  createOrderSchema,
  updateOrderStatusSchema,
} from "@workspace/validators";

const router: Router = Router();

// GET /api/orders - Get all orders (admin/kitchen only)
router.get("/", requireKitchen, async (req: Request, res: Response) => {
  try {
    const status = req.query.status as string | undefined;
    const validStatuses = [
      "pending",
      "confirmed",
      "preparing",
      "ready",
      "completed",
      "cancelled",
    ];

    if (status && !validStatuses.includes(status)) {
      res.status(400).json({ error: "Invalid status filter" });
      return;
    }

    const orders = await ordersService.getAll(
      status as
        | "pending"
        | "confirmed"
        | "preparing"
        | "ready"
        | "completed"
        | "cancelled"
        | undefined,
    );
    res.json({ data: orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// GET /api/orders/my - Get current user's orders
router.get("/my", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const orders = await ordersService.getByUserId(userId);
    res.json({ data: orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// GET /api/orders/session/:sessionId - Get orders by session (for guests)
router.get("/session/:sessionId", async (req: Request, res: Response) => {
  try {
    const sessionId = req.params.sessionId as string;
    const orders = await ordersService.getBySessionId(sessionId);
    res.json({ data: orders });
  } catch (error) {
    console.error("Error fetching session orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// GET /api/orders/:id - Get order by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const order = await ordersService.getById(id);

    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    res.json({ data: order });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

// POST /api/orders/validate - Validate cart and get totals
router.post(
  "/validate",
  validateBody(createOrderSchema),
  async (req: Request, res: Response) => {
    try {
      const { items } = req.body;
      const validation = await ordersService.validateCart(items);

      if (!validation.valid) {
        res.status(400).json({
          error: "Cart validation failed",
          details: validation.errors,
        });
        return;
      }

      res.json({
        data: {
          subtotal: validation.subtotal,
          tax: validation.tax,
          total: validation.total,
          itemCount: validation.items.length,
        },
      });
    } catch (error) {
      console.error("Error validating cart:", error);
      res.status(500).json({ error: "Failed to validate cart" });
    }
  },
);

// POST /api/orders - Create a new order
router.post(
  "/",
  validateBody(createOrderSchema),
  async (req: Request, res: Response) => {
    try {
      const { sessionId, items, notes } = req.body;
      const userId = req.user?.id; // Optional - may be guest

      const result = await ordersService.create({
        userId,
        sessionId,
        items,
        notes,
      });

      if (!result.success) {
        res.status(400).json({
          error: "Order creation failed",
          details: result.errors,
        });
        return;
      }

      res.status(201).json({ data: result.order });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  },
);

// PUT /api/orders/:id/status - Update order status (kitchen/admin only)
router.put(
  "/:id/status",
  requireKitchen,
  validateBody(updateOrderStatusSchema),
  async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const { status } = req.body;

      const existing = await ordersService.getById(id);
      if (!existing) {
        res.status(404).json({ error: "Order not found" });
        return;
      }

      const order = await ordersService.updateStatus(id, status);
      res.json({ data: order });
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ error: "Failed to update order status" });
    }
  },
);

// POST /api/orders/:id/cancel - Cancel an order
router.post("/:id/cancel", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const result = await ordersService.cancel(id);

    if (!result.success) {
      res.status(400).json({ error: result.error });
      return;
    }

    res.json({ message: "Order cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ error: "Failed to cancel order" });
  }
});

export const ordersRouter: Router = router;
