// ── middleware.ts ──
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasToken = !!req.cookies.get("privy-token");
  const onboarded = req.cookies.get("onboarded")?.value === "true";

  // 1) allow public + API + logout
  if (
    pathname === "/" ||
    pathname.startsWith("/api/") ||
    pathname === "/auth/logout"
  ) {
    return NextResponse.next();
  }

  // 2) onboarding
  if (pathname.startsWith("/onboarding")) {
    if (!hasToken) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (onboarded) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // 3) dashboard
  if (pathname.startsWith("/dashboard")) {
    if (!hasToken) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (!onboarded) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }
    return NextResponse.next();
  }

  // 4) everything else
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/api/:path*",
    "/auth/logout",
    "/onboarding/:path*",
    "/dashboard/:path*",
  ],
};
