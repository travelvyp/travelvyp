"use server"

import { signIn } from "@/lib/auth"
import { AuthError } from "next-auth"

export async function loginAction(email: string, password: string): Promise<{ error: string } | void> {
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/itinerario/trips",
    })
  } catch (error) {
    // NextAuth lanza un error especial para redireccion exitosa — hay que relanzarlo
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error
    }
    if (error instanceof AuthError) {
      return { error: "Email o contrasena incorrectos." }
    }
    return { error: "Error al iniciar sesion. Intenta de nuevo." }
  }
}
