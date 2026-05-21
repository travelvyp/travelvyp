import type { NextAuthConfig } from "next-auth"

const BASE = "/itinerario"

export const authConfig = {
  pages: {
    signIn: `${BASE}/login`,
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const path = nextUrl.pathname

      const isPublicRoute =
        path.startsWith(`${BASE}/v/`) ||
        path === `${BASE}/login` ||
        path === `${BASE}/register` ||
        path === "/login" ||
        path === "/register"

      if (!isLoggedIn && !isPublicRoute) {
        return false
      }

      if (isLoggedIn && (path === `${BASE}/login` || path === `${BASE}/register` || path === "/login" || path === "/register")) {
        return Response.redirect(new URL(`${BASE}/trips`, nextUrl))
      }

      return true
    },
  },
} satisfies NextAuthConfig
