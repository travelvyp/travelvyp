import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Rutas públicas (portal del pasajero y auth)
  const isPublicRoute =
    pathname.startsWith("/v/") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register");

  if (!req.auth && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (req.auth && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
