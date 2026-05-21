"use server"

import { signIn } from "@/lib/auth"
import { AuthError } from "next-auth"

export async function loginAction(email: string, password: string): Promise<{ error: string } | void> {
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/trips",
    })
  } catch (error) {
    // NextAuth lanza un error especial para redireccion exitosa — hay que relanzarlo
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error
    }
    if (error instanceof AuthError) {
      return { error: "Email o contraseña incorrectos." }
    }
    return { error: "Error al iniciar sesión. Intentá de nuevo." }
  }
}
