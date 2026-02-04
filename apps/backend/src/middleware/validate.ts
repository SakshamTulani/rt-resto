import { type Request, type Response, type NextFunction } from "express";
import { z } from "zod";

/**
 * Validation middleware factory
 * Creates middleware that validates request body against a Zod schema
 *
 * @param schema - Zod schema to validate against
 * @returns Express middleware
 *
 * @example
 * router.post("/", validateBody(createCategorySchema), async (req, res) => {
 *   // req.body is now typed and validated
 * });
 */
export const validateBody = <T extends z.ZodTypeAny>(schema: T) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await schema.safeParseAsync(req.body);

      if (!result.success) {
        const errors = result.error.flatten();
        res.status(400).json({
          error: "Validation failed",
          details: errors.fieldErrors,
        });
        return;
      }

      // Replace body with validated/transformed data
      req.body = result.data;
      next();
    } catch (error) {
      console.error("Validation error:", error);
      res.status(400).json({ error: "Invalid request body" });
    }
  };
};

/**
 * Validation middleware for query parameters
 *
 * @param schema - Zod schema to validate query params against
 * @returns Express middleware
 */
export const validateQuery = <T extends z.ZodTypeAny>(schema: T) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await schema.safeParseAsync(req.query);

      if (!result.success) {
        const errors = result.error.flatten();
        res.status(400).json({
          error: "Validation failed",
          details: errors.fieldErrors,
        });
        return;
      }

      // Store validated data on request
      (req as unknown as Record<string, unknown>).validatedQuery = result.data;
      next();
    } catch (error) {
      console.error("Validation error:", error);
      res.status(400).json({ error: "Invalid query parameters" });
    }
  };
};

/**
 * Validation middleware for route parameters
 *
 * @param schema - Zod schema to validate route params against
 * @returns Express middleware
 */
export const validateParams = <T extends z.ZodTypeAny>(schema: T) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await schema.safeParseAsync(req.params);

      if (!result.success) {
        const errors = result.error.flatten();
        res.status(400).json({
          error: "Validation failed",
          details: errors.fieldErrors,
        });
        return;
      }

      // Store validated data on request
      (req as unknown as Record<string, unknown>).validatedParams = result.data;
      next();
    } catch (error) {
      console.error("Validation error:", error);
      res.status(400).json({ error: "Invalid route parameters" });
    }
  };
};
