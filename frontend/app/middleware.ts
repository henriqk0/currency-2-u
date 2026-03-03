import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const isAuthRoute = request.nextUrl.pathname === "/login";

  if (!token && !isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
  ],
};