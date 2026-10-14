import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const ADMIN_COOKIE_NAME = "vj_admin_token";
const JWT_SECRET_STRING =
  process.env.JWT_SECRET || "valchandson-heirloom-secret-key-2026-luxury-atelier-protection";
const JWT_KEY = new TextEncoder().encode(JWT_SECRET_STRING);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Guard /admin routes
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    let isAuthenticated = false;

    if (token) {
      try {
        await jwtVerify(token, JWT_KEY);
        isAuthenticated = true;
      } catch {
        isAuthenticated = false;
      }
    }

    // If accessing login page while already authenticated, redirect to /admin dashboard
    if (pathname === "/admin/login") {
      if (isAuthenticated) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    // All other /admin routes require authentication
    if (!isAuthenticated) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // 2. Guard /api/admin routes (except login)
  if (pathname.startsWith("/api/admin")) {
    if (pathname === "/api/admin/auth/login") {
      return NextResponse.next();
    }

    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized admin access" }, { status: 401 });
    }

    try {
      await jwtVerify(token, JWT_KEY);
      return NextResponse.next();
    } catch {
      return NextResponse.json({ error: "Invalid or expired admin session" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
