/**
 * Category type
 */
export interface Category {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Category for display (without timestamps)
 */
export interface CategoryDisplay {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
}

/**
 * Create category input
 */
export interface CreateCategoryInput {
  name: string;
  slug: string;
  sortOrder?: number;
}

/**
 * Update category input
 */
export interface UpdateCategoryInput {
  name?: string;
  slug?: string;
  sortOrder?: number;
}
