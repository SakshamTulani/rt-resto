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
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-xl font-bold text-orange-500 hover:opacity-80 transition-opacity mr-4">
            {title}
          </Link>
          <nav className="flex items-center gap-4 text-sm font-medium">
            <NavLink href="/" exact>
              Dashboard
            </NavLink>
            <NavLink href="/menu">Menu</NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}

import { usePathname } from "next/navigation";
import { cn } from "@workspace/ui/lib/utils";

function NavLink({
  href,
  children,
  exact = false,
}: {
  href: string;
  children: React.ReactNode;
  exact?: boolean;
}) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "transition-colors hover:text-foreground/80",
        isActive ? "text-foreground font-bold" : "text-foreground/60",
      )}>
      {children}
    </Link>
  );
}
