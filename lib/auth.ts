import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { authConfig } from "@/auth.config"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

// Credenciales hardcodeadas — login no depende de DB
const DEMO_USER = {
  id: "c80fc8b6-ac28-466f-a910-60e47fd087ac",
  email: "pablo@travelvyp.com",
  name: "Pablo Tocci",
  agencyId: "8ea59f1c-75e7-4612-ae07-234deabf4d62",
  agencyName: "TravelVYP",
  role: "OWNER",
  // hash de "travelvyp2024"
  passwordHash: "$2a$12$RCuUtp2JADPlYO1fWRQ9UOOiXBbLxwA6UTKKra2IYIGH7qgMzbXhC",
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  trustHost: true,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const { email, password } = parsed.data

        if (email !== DEMO_USER.email) return null

        const passwordMatch = await bcrypt.compare(password, DEMO_USER.passwordHash)
        if (!passwordMatch) return null

        return {
          id: DEMO_USER.id,
          email: DEMO_USER.email,
          name: DEMO_USER.name,
          agencyId: DEMO_USER.agencyId,
          agencyName: DEMO_USER.agencyName,
          role: DEMO_USER.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.agencyId = (user as any).agencyId
        token.agencyName = (user as any).agencyName
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        ;(session.user as any).agencyId = token.agencyId
        ;(session.user as any).agencyName = token.agencyName
        ;(session.user as any).role = token.role
      }
      return session
    },
  },
})
