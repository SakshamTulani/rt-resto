"use client";

import { Category } from "@workspace/types";
import { Button } from "@workspace/ui/components/button";
import { Loader2 } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useQuery, useMutation } from "@tanstack/react-query";

interface MenuItemFormProps {
  itemId?: string | null;
  categories: Category[];
  onSuccess: () => void;
  onCancel: () => void;
}

export function MenuItemForm({
  itemId,
  categories,
  onSuccess,
  onCancel,
}: MenuItemFormProps) {
  const isEdit = !!itemId;

  // Fetch item details if editing
  const { data: itemData, isLoading: isItemLoading } = useQuery({
    queryKey: ["menu-item", itemId],
    queryFn: () => api.getMenuItem(itemId!),
    enabled: isEdit,
  });

  const item = itemData?.data;

  const createMutation = useMutation({
    mutationFn: (payload: Parameters<typeof api.createMenuItem>[0]) =>
      api.createMenuItem(payload),
    onSuccess: () => onSuccess(),
    onError: () => toast.error("Failed to create menu item"),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Parameters<typeof api.updateMenuItem>[1];
    }) => api.updateMenuItem(id, payload),
    onSuccess: () => onSuccess(),
    onError: () => toast.error("Failed to update menu item"),
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const form = useForm({
    defaultValues: {
      name: item?.name || "",
      description: item?.description || "",
      basePrice: item?.basePrice ? String(item.basePrice) : "",
      categoryId: item?.categoryId || categories[0]?.id || "",
      imageUrl: item?.imageUrl || "",
      prepTimeMinutes: item?.prepTimeMinutes
        ? String(item.prepTimeMinutes)
        : "15",
      isVegetarian: item?.isVegetarian || false,
      isVegan: item?.isVegan || false,
      isGlutenFree: item?.isGlutenFree || false,
      stockQuantity: item?.stockQuantity ?? undefined,
    },
    onSubmit: async ({ value }) => {
      const payload = {
        ...value,
        basePrice: parseFloat(value.basePrice),
        imageUrl: value.imageUrl || null,
        prepTimeMinutes: parseInt(value.prepTimeMinutes),
        stockQuantity:
          value.stockQuantity === undefined || value.stockQuantity === null
            ? null
            : Number(value.stockQuantity),
      };

      if (isEdit && itemId) {
        updateMutation.mutate({ id: itemId, payload });
      } else {
        createMutation.mutate(payload);
      }
    },
  });

  if (isEdit && isItemLoading) {
    return (
      <div className="p-8 flex justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-4">
      <form.Field
        name="name"
        validators={{
          onChange: ({ value }) => (!value ? "Name is required" : undefined),
        }}>
        {(field) => (
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {field.state.meta.isTouched &&
              field.state.meta.errors.length > 0 && (
                <p className="text-sm text-destructive">
                  {field.state.meta.errors[0]}
                </p>
              )}
          </div>
        )}
      </form.Field>

      <form.Field name="description">
        {(field) => (
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        )}
      </form.Field>

      <div className="grid grid-cols-2 gap-4">
        <form.Field
          name="basePrice"
          validators={{
            onChange: ({ value }) => (!value ? "Price is required" : undefined),
          }}>
          {(field) => (
            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-medium">
                Price ($)
              </label>
              <input
                id="price"
                type="number"
                step="0.01"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              {field.state.meta.isTouched &&
                field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive">
                    {field.state.meta.errors[0]}
                  </p>
                )}
            </div>
          )}
        </form.Field>

        <form.Field
          name="categoryId"
          validators={{
            onChange: ({ value }) =>
              !value ? "Category is required" : undefined,
          }}>
          {(field) => (
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category
              </label>
              <select
                id="category"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <option value="" disabled>
                  Select Category
                </option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </form.Field>
      </div>

      <form.Field name="imageUrl">
        {(field) => (
          <div className="space-y-2">
            <label htmlFor="image" className="text-sm font-medium">
              Image URL
            </label>
            <input
              id="image"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="https://..."
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        )}
      </form.Field>

      <div className="flex gap-4">
        <form.Field name="prepTimeMinutes">
          {(field) => (
            <div className="space-y-2 flex-1">
              <label htmlFor="prepTime" className="text-sm font-medium">
                Prep Time (min)
              </label>
              <input
                id="prepTime"
                type="number"
                min="1"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          )}
        </form.Field>

        <form.Field name="stockQuantity">
          {(field) => (
            <div className="space-y-2 flex-1">
              <label htmlFor="stock" className="text-sm font-medium">
                Stock (Optional)
              </label>
              <input
                id="stock"
                type="number"
                min="0"
                placeholder="Unlimited"
                value={field.state.value ?? ""}
                onChange={(e) =>
                  field.handleChange(
                    e.target.value === "" ? undefined : Number(e.target.value),
                  )
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <p className="text-xs text-muted-foreground">
                Leave empty for unlimited
              </p>
            </div>
          )}
        </form.Field>
      </div>

      <div className="flex gap-4">
        <form.Field name="isVegetarian">
          {(field) => (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={field.state.value}
                onChange={(e) => field.handleChange(e.target.checked)}
                className="h-4 w-4"
              />
              Vegetarian
            </label>
          )}
        </form.Field>
        <form.Field name="isVegan">
          {(field) => (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={field.state.value}
                onChange={(e) => field.handleChange(e.target.checked)}
                className="h-4 w-4"
              />
              Vegan
            </label>
          )}
        </form.Field>
        <form.Field name="isGlutenFree">
          {(field) => (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={field.state.value}
                onChange={(e) => field.handleChange(e.target.checked)}
                className="h-4 w-4"
              />
              Gluten Free
            </label>
          )}
        </form.Field>
      </div>

      <form.Subscribe selector={(state) => [state.canSubmit]}>
        {([canSubmit]) => (
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={!canSubmit || isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? "Save Changes" : "Create Item"}
            </Button>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}
