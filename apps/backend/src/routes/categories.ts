import { Router, type Request, type Response } from "express";
import { categoriesService } from "../services";
import { requireAdmin, validateBody } from "../middleware";
import {
  createCategorySchema,
  updateCategorySchema,
} from "@workspace/validators";

const router: Router = Router();

// GET /api/categories - Get all categories (public)
router.get("/", async (_req: Request, res: Response) => {
  try {
    const categories = await categoriesService.getAll();
    res.json({ data: categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// GET /api/categories/:id - Get category by ID (public)
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const category = await categoriesService.getById(id);
    if (!category) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    res.json({ data: category });
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ error: "Failed to fetch category" });
  }
});

// GET /api/categories/slug/:slug - Get category by slug (public)
router.get("/slug/:slug", async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;
    const category = await categoriesService.getBySlug(slug);
    if (!category) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    res.json({ data: category });
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ error: "Failed to fetch category" });
  }
});

// POST /api/categories - Create a new category (admin only)
router.post(
  "/",
  requireAdmin,
  validateBody(createCategorySchema),
  async (req: Request, res: Response) => {
    try {
      const { name, slug, sortOrder } = req.body;

      // Check if slug already exists
      const existing = await categoriesService.getBySlug(slug);
      if (existing) {
        res
          .status(409)
          .json({ error: "Category with this slug already exists" });
        return;
      }

      const category = await categoriesService.create({
        name,
        slug,
        sortOrder,
      });
      res.status(201).json({ data: category });
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({ error: "Failed to create category" });
    }
  },
);

// PUT /api/categories/:id - Update a category (admin only)
router.put(
  "/:id",
  requireAdmin,
  validateBody(updateCategorySchema),
  async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const { name, slug, sortOrder } = req.body;

      const existing = await categoriesService.getById(id);
      if (!existing) {
        res.status(404).json({ error: "Category not found" });
        return;
      }

      // Check if new slug conflicts with another category
      if (slug && slug !== existing.slug) {
        const slugExists = await categoriesService.getBySlug(slug);
        if (slugExists) {
          res
            .status(409)
            .json({ error: "Category with this slug already exists" });
          return;
        }
      }

      const category = await categoriesService.update(id, {
        name,
        slug,
        sortOrder,
      });
      res.json({ data: category });
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ error: "Failed to update category" });
    }
  },
);

// DELETE /api/categories/:id - Delete a category (admin only)
router.delete("/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const existing = await categoriesService.getById(id);
    if (!existing) {
      res.status(404).json({ error: "Category not found" });
      return;
    }

    await categoriesService.delete(id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Failed to delete category" });
  }
});

export const categoriesRouter: Router = router;
