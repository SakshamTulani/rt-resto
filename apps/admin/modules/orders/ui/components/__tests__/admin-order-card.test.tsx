import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AdminOrderCard } from "../admin-order-card";
import { OrderWithItems } from "@workspace/types";

const mockOrder: OrderWithItems = {
  id: "order-123-uuid",
  userId: "user-1",
  sessionId: "session-1",
  status: "pending",
  subtotal: 2000,
  tax: 500,
  total: 2500,
  createdAt: new Date(),
  updatedAt: new Date(),
  items: [
    {
      id: "item-1",
      menuItemId: "menu-1",
      orderId: "order-123-uuid",
      quantity: 2,
      unitPrice: 1000,
      totalPrice: 2000,
      notes: null,
      menuItem: {
        name: "Burger",
        imageUrl: null,
      },
    },
  ],
  user: {
    name: "John Doe",
    email: "john@example.com",
  },
  notes: "No onions",
};

describe("AdminOrderCard", () => {
  it("should render order details correctly", () => {
    const onUpdate = vi.fn();
    const onCancel = vi.fn();

    render(
      <AdminOrderCard
        order={mockOrder}
        onUpdateStatus={onUpdate}
        onCancel={onCancel}
      />,
    );

    expect(screen.getByText("#orde")).toBeInTheDocument();

    expect(screen.getByText("pending")).toBeInTheDocument();

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();

    expect(screen.getByText("Burger")).toBeInTheDocument();
    expect(screen.getByText("2x")).toBeInTheDocument();

    expect(screen.getByText("No onions")).toBeInTheDocument();
  });

  it("should call onUpdateStatus when action button is clicked", () => {
    const onUpdate = vi.fn();
    const onCancel = vi.fn();

    render(
      <AdminOrderCard
        order={mockOrder}
        onUpdateStatus={onUpdate}
        onCancel={onCancel}
      />,
    );

    const acceptButton = screen.getByRole("button", { name: /accept/i });
    expect(acceptButton).toBeInTheDocument();

    fireEvent.click(acceptButton);
    expect(onUpdate).toHaveBeenCalledWith("order-123-uuid", "confirmed");
  });

  it("should call onCancel when cancel button is clicked (for pending orders)", () => {
    const onUpdate = vi.fn();
    const onCancel = vi.fn();

    render(
      <AdminOrderCard
        order={mockOrder}
        onUpdateStatus={onUpdate}
        onCancel={onCancel}
      />,
    );

    const buttons = screen.getAllByRole("button");
    const cancelButton = buttons[0];

    expect(cancelButton).not.toHaveTextContent(/accept/i);
    expect(cancelButton).toBeInTheDocument();

    fireEvent.click(cancelButton as HTMLElement);
    expect(onCancel).toHaveBeenCalledWith("order-123-uuid");
  });

  it("should display correct action for confirmed orders", () => {
    const confirmedOrder = { ...mockOrder, status: "confirmed" as const };
    const onUpdate = vi.fn();

    render(
      <AdminOrderCard
        order={confirmedOrder}
        onUpdateStatus={onUpdate}
        onCancel={() => {}}
      />,
    );

    const button = screen.getByRole("button", { name: /start prep/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(onUpdate).toHaveBeenCalledWith("order-123-uuid", "preparing");
  });
});
