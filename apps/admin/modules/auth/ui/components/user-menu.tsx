"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "../../lib/auth-client";
import { Button } from "@workspace/ui/components/button";
import { User, LogOut, Loader2, Package } from "lucide-react";
import Link from "next/link";

export function UserMenu() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
      setIsOpen(false);
    }
  };

  if (isPending) {
    return <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />;
  }

  if (!session?.user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/login">
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 rounded-full hover:bg-muted transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold text-sm">
          {session.user.name?.charAt(0)?.toUpperCase() || "U"}
        </div>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/5" // Slight tint to debug, or keep transparent
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border bg-background shadow-lg z-50 py-2 animate-in fade-in slide-in-from-top-2">
            <div className="px-4 py-2 border-b">
              <p className="font-medium truncate">{session.user.name}</p>
              <p className="text-sm text-muted-foreground truncate">
                {session.user.email}
              </p>
            </div>

            <div className="py-1 border-t">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-muted transition-colors cursor-pointer">
                {isLoggingOut ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
