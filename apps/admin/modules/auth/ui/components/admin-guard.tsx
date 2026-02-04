"use client";

import { useSession, signOut } from "../../lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Allow public access to login page
  if (pathname === "/login") {
    return <>{children}</>;
  }

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  // Check if user has admin or kitchen role
  const role = (session?.user as any)?.role;
  const isAuthorized = role === "admin" || role === "kitchen";

  if (!session?.user || !isAuthorized) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 p-4 text-center">
        <ShieldAlert className="h-16 w-16 text-destructive" />
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground max-w-sm">
          You do not have permission to access the admin dashboard. Current
          role: <span className="font-mono font-bold">{role || "guest"}</span>
        </p>
        <div className="flex gap-2">
          <Button
            variant="default"
            onClick={async () => {
              await signOut();
              router.push("/login");
            }}>
            Sign Out & Login
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
