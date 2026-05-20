import type { NextAuthConfig } from "next-auth"

// Edge-safe auth config — NO imports de Prisma, bcrypt ni módulos Node.js
// Este archivo es importado por middleware.ts (que corre en Edge runtime)
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user

      const isPublicRoute =
        nextUrl.pathname.startsWith("/v/") ||
        nextUrl.pathname.startsWith("/login") ||
        nextUrl.pathname.startsWith("/register")

      if (!isLoggedIn && !isPublicRoute) {
        return false // NextAuth redirige a pages.signIn automáticamente
      }

      if (isLoggedIn && (nextUrl.pathname === "/login" || nextUrl.pathname === "/register")) {
        return Response.redirect(new URL("/dashboard", nextUrl))
      }

      return true
    },
  },
} satisfies NextAuthConfig
