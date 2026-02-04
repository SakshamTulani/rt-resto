"use client";

import Link from "next/link";
import { UserMenu } from "@/modules/auth";

interface AppHeaderProps {
  title?: string;
}

export function AppHeader({ title = "RT Resto Admin" }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold text-orange-500 hover:opacity-80 transition-opacity">
          {title}
        </Link>
        <div className="flex items-center gap-3">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
