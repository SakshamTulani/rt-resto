import { type Request, type Response, type NextFunction } from "express";
import { auth } from "../lib/auth";
import { fromNodeHeaders } from "better-auth/node";

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
      };
    }
  }
}

/**
 * Middleware to authenticate user session
 * Attaches user info to req.user if authenticated
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (session?.user) {
      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: (session.user as { role?: string }).role ?? "customer",
      };
    }

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    next();
  }
};

/**
 * Middleware to require authentication
 * Returns 401 if user is not authenticated
 */
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session?.user) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    req.user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: (session.user as { role?: string }).role ?? "customer",
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ error: "Authentication failed" });
  }
};

/**
 * Middleware factory to require specific roles
 * @param allowedRoles - Array of roles that can access the route
 */
export const requireRole = (...allowedRoles: string[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });

      if (!session?.user) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      const userRole = (session.user as { role?: string }).role ?? "customer";

      if (!allowedRoles.includes(userRole)) {
        res.status(403).json({
          error: "Access denied",
          requiredRoles: allowedRoles,
          currentRole: userRole,
        });
        return;
      }

      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: userRole,
      };

      next();
    } catch (error) {
      console.error("Auth middleware error:", error);
      res.status(401).json({ error: "Authentication failed" });
    }
  };
};

// Convenience middleware for common role combinations
export const requireAdmin = requireRole("admin");
export const requireKitchen = requireRole("kitchen", "admin");
export const requireCustomer = requireRole("customer", "kitchen", "admin");
