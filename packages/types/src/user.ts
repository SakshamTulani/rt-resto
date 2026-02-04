/**
 * User role enum
 */
export type UserRole = "customer" | "kitchen" | "admin";

/**
 * User type
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  emailVerified: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Session user (minimal user info for client)
 */
export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}
