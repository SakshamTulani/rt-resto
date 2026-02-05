/**
 * Menu item type
 */
export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  imageUrl: string | null;
  basePrice: number; // Stored as integer (cents)
  prepTimeMinutes: number;
  isAvailable: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  stockQuantity: number | null;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface MenuItemWithCategory extends MenuItem {
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

/**
 * Menu item for display (without internal fields)
 */
export interface MenuItemDisplay {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  imageUrl: string | null;
  basePrice: number; // Converted to number for display
  prepTimeMinutes: number;
  isAvailable: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  stockQuantity: number | null;
}

/**
 * Create menu item input
 */
export interface CreateMenuItemInput {
  categoryId: string;
  name: string;
  description?: string;
  imageUrl?: string | null;
  basePrice: number;
  prepTimeMinutes?: number;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  stockQuantity?: number | null;
}

/**
 * Update menu item input
 */
export interface UpdateMenuItemInput {
  categoryId?: string;
  name?: string;
  description?: string;
  imageUrl?: string | null;
  basePrice?: number;
  prepTimeMinutes?: number;
  isAvailable?: boolean;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  stockQuantity?: number | null;
}

/**
 * Menu filter params for querying
 */
export interface MenuFilterParams {
  categoryId?: string;
  search?: string;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
}
