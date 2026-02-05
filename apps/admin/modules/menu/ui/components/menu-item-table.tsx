"use client";

import { MenuItemWithCategory } from "@workspace/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { Button } from "@workspace/ui/components/button";
import { Edit, Trash2, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Badge } from "@workspace/ui/components/badge";

interface MenuItemTableProps {
  items: MenuItemWithCategory[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function MenuItemTable({ items, onEdit, onDelete }: MenuItemTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No items found.
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow key={item.id}>
                {/* ... existing name cell ... */}
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    {item.imageUrl && (
                      <div className="h-10 w-10 rounded-md overflow-hidden bg-muted">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <div className="font-bold">{item.name}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {item.description}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{item.category?.name || "-"}</TableCell>
                <TableCell>
                  ${parseFloat(String(item.basePrice)).toFixed(2)}
                </TableCell>
                <TableCell>
                  {item.stockQuantity === null ||
                  item.stockQuantity === undefined ? (
                    <Badge variant="outline">Unlimited</Badge>
                  ) : (
                    <Badge
                      variant={
                        item.stockQuantity === 0 ? "destructive" : "secondary"
                      }
                      className={
                        item.stockQuantity < 10 ? "text-orange-500" : ""
                      }>
                      {item.stockQuantity} Left
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={item.isAvailable ? "default" : "secondary"}>
                    {item.isAvailable ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onEdit(item.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => onDelete(item.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
