import type { NextAuthConfig } from "next-auth"

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
        nextUrl.pathname === "/login" ||
        nextUrl.pathname === "/register"

      if (!isLoggedIn && !isPublicRoute) {
        return false
      }

      if (isLoggedIn && (nextUrl.pathname === "/login" || nextUrl.pathname === "/register")) {
        return Response.redirect(new URL("/trips", nextUrl))
      }

      return true
    },
  },
} satisfies NextAuthConfig
