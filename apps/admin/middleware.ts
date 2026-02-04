import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get("better-auth.session_token");
  const url = request.nextUrl.clone();

  const isAuthPage = url.pathname === "/login";
  const isProtectedPage =
    !isAuthPage &&
    !url.pathname.startsWith("/_next") &&
    !url.pathname.startsWith("/static");

  if (isProtectedPage && !sessionToken) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (isAuthPage && sessionToken) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
