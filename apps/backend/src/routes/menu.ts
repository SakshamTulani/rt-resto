import { Router, type Request, type Response } from "express";
import { menuService } from "../services";
import { requireAdmin, validateBody } from "../middleware";
import {
  createMenuItemSchema,
  updateMenuItemSchema,
} from "@workspace/validators";

const router: Router = Router();

// GET /api/menu - Get all menu items with optional filters
router.get("/", async (req: Request, res: Response) => {
  try {
    const filters = {
      categoryId: req.query.categoryId as string | undefined,
      search: req.query.search as string | undefined,
      isVegetarian: req.query.isVegetarian === "true" ? true : undefined,
      isVegan: req.query.isVegan === "true" ? true : undefined,
      isGlutenFree: req.query.isGlutenFree === "true" ? true : undefined,
      minPrice: req.query.minPrice
        ? parseFloat(req.query.minPrice as string)
        : undefined,
      maxPrice: req.query.maxPrice
        ? parseFloat(req.query.maxPrice as string)
        : undefined,
      available:
        req.query.available === "true"
          ? true
          : req.query.available === "false"
            ? false
            : undefined,
    };

    const items = await menuService.getAll(filters);
    res.json({ data: items });
  } catch (error) {
    console.error("Error fetching menu items:", error);
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
});

// GET /api/menu/:id - Get menu item by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const item = await menuService.getById(id);
    if (!item) {
      res.status(404).json({ error: "Menu item not found" });
      return;
    }
    res.json({ data: item });
  } catch (error) {
    console.error("Error fetching menu item:", error);
    res.status(500).json({ error: "Failed to fetch menu item" });
  }
});

// POST /api/menu - Create a new menu item (admin only)
router.post(
  "/",
  requireAdmin,
  validateBody(createMenuItemSchema),
  async (req: Request, res: Response) => {
    try {
      const {
        categoryId,
        name,
        description,
        imageUrl,
        basePrice,
        prepTimeMinutes,
        isVegetarian,
        isVegan,
        isGlutenFree,
        stockQuantity,
      } = req.body;

      const item = await menuService.create({
        categoryId,
        name,
        description,
        imageUrl,
        basePrice,
        prepTimeMinutes,
        isVegetarian,
        isVegan,
        isGlutenFree,
        stockQuantity,
      });
      res.status(201).json({ data: item });
    } catch (error) {
      console.error("Error creating menu item:", error);
      res.status(500).json({ error: "Failed to create menu item" });
    }
  },
);

// PUT /api/menu/:id - Update a menu item (admin only)
router.put(
  "/:id",
  requireAdmin,
  validateBody(updateMenuItemSchema),
  async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const {
        categoryId,
        name,
        description,
        imageUrl,
        basePrice,
        prepTimeMinutes,
        isAvailable,
        isVegetarian,
        isVegan,
        isGlutenFree,
        stockQuantity,
      } = req.body;

      const existing = await menuService.getById(id);
      if (!existing) {
        res.status(404).json({ error: "Menu item not found" });
        return;
      }

      const item = await menuService.update(id, {
        categoryId,
        name,
        description,
        imageUrl,
        basePrice,
        prepTimeMinutes,
        isAvailable,
        isVegetarian,
        isVegan,
        isGlutenFree,
        stockQuantity,
      });
      res.json({ data: item });
    } catch (error) {
      console.error("Error updating menu item:", error);
      res.status(500).json({ error: "Failed to update menu item" });
    }
  },
);

// DELETE /api/menu/:id - Soft delete a menu item (admin only)
router.delete("/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const existing = await menuService.getById(id);
    if (!existing) {
      res.status(404).json({ error: "Menu item not found" });
      return;
    }

    await menuService.softDelete(id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).json({ error: "Failed to delete menu item" });
  }
});

export const menuRouter: Router = router;
