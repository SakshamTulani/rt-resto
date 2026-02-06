import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { OrderCard } from "../order-card";
import { OrderWithItems } from "@workspace/types";

// Mock Mock Order
const mockOrder: OrderWithItems = {
  id: "order-12345678-uuid",
  userId: "user-1",
  sessionId: "session-1",
  status: "pending",
  subtotal: 4000,
  tax: 500,
  total: 4500, // $45.00
  createdAt: new Date("2024-01-01T12:00:00"),
  updatedAt: new Date(),
  items: [
    {
      id: "item-1",
      orderId: "order-12345678-uuid",
      menuItemId: "menu-1",
      quantity: 1,
      unitPrice: 1500,
      totalPrice: 1500,
      notes: null,
      menuItem: {
        name: "Burger",
        imageUrl: null,
      },
    },
    {
      id: "item-2",
      orderId: "order-12345678-uuid",
      menuItemId: "menu-2", // Fixed to be string, was implied string before
      quantity: 2,
      unitPrice: 1500,
      totalPrice: 3000,
      notes: "Extra cheese",
      menuItem: {
        name: "Fries",
        imageUrl: null,
      },
    },
  ],
  user: {
    name: "Alice Client",
    email: "alice@example.com",
  },
  notes: "",
};

describe("OrderCard", () => {
  it("should render order details correctly", () => {
    render(<OrderCard order={mockOrder} />);

    // Check ID (slice 0-8)
    expect(screen.getByText("order-12...")).toBeInTheDocument();

    // Check User
    expect(screen.getByText("Alice Client")).toBeInTheDocument();
    expect(screen.getByText("alice@example.com")).toBeInTheDocument();

    // Check Item Count (1 + 2 = 3 items)
    expect(screen.getByText("3 items")).toBeInTheDocument();

    // Check Total ($45.00)
    expect(screen.getByText("$45.00")).toBeInTheDocument();

    // Check Date
    // Note: toLocaleDateString might vary by locale, but we can check if it renders something
    // or mock the date. For now, trusting the environment.
  });

  it("should render correct link", () => {
    render(<OrderCard order={mockOrder} />);

    // Link from next/link usually renders an 'a' tag
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/orders/order-12345678-uuid");
  });
});
