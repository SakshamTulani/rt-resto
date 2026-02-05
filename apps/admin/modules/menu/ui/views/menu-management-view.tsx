"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { MenuItemTable } from "../components/menu-item-table";
import { MenuItemForm } from "../components/menu-item-form";
import { Button } from "@workspace/ui/components/button";
import { Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";

export function MenuManagementView() {
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const queryClient = useQueryClient();

  // Fetch Menu Items
  const { data: menuData, isLoading: isMenuLoading } = useQuery({
    queryKey: ["menu-items"],
    queryFn: () => api.getMenuItems(),
  });

  // Fetch Categories
  const { data: categoryData, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.getCategories(),
  });

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await api.deleteMenuItem(itemToDelete);
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
      toast.success("Item deleted");
    } catch {
      toast.error("Failed to delete item");
    } finally {
      setItemToDelete(null);
    }
  };

  const handleDeleteItem = (id: string) => {
    setItemToDelete(id);
  };

  const handleEditItem = (id: string) => {
    setSelectedItemId(id);
    setIsItemDialogOpen(true);
  };

  const handleCloseItemDialog = () => {
    setIsItemDialogOpen(false);
    setSelectedItemId(null);
  };

  if (isMenuLoading || isCategoriesLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Menu Management</h1>
          <p className="text-muted-foreground">Manage your dishes</p>
        </div>
        <Button onClick={() => setIsItemDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      <MenuItemTable
        items={menuData?.data || []}
        onEdit={handleEditItem}
        onDelete={handleDeleteItem}
      />

      {/* Item Dialog */}
      <Dialog open={isItemDialogOpen} onOpenChange={handleCloseItemDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedItemId ? "Edit Menu Item" : "Add New Menu Item"}
            </DialogTitle>
          </DialogHeader>
          <MenuItemForm
            key={selectedItemId || "new"}
            itemId={selectedItemId}
            categories={categoryData?.data || []}
            onSuccess={() => {
              handleCloseItemDialog();
              queryClient.invalidateQueries({ queryKey: ["menu-items"] });
              toast.success(selectedItemId ? "Item updated" : "Item created");
            }}
            onCancel={handleCloseItemDialog}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog
        open={!!itemToDelete}
        onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              menu item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
