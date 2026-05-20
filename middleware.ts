import NextAuth from "next-auth"
import { authConfig } from "@/auth.config"

// Middleware usa SOLO el auth config edge-safe (sin Prisma, sin Node.js modules)
export default NextAuth(authConfig).auth

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
