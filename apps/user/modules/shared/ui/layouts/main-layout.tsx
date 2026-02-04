"use client";

import { useState, type ReactNode } from "react";
import { CartButton, CartSheet } from "@/modules/cart";

interface AppHeaderProps {
  title?: string;
}

export function AppHeader({ title = "RT Resto" }: AppHeaderProps) {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-xl font-bold text-orange-500">{title}</h1>
          <CartButton onClick={() => setCartOpen(true)} />
        </div>
      </header>
      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
}

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      {children}
    </div>
  );
}
