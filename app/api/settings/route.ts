import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateSettingsSchema = z.object({
  fullName: z.string().min(2, "El nombre debe tener al menos 2 caracteres").optional(),
  email: z.string().email("Email inválido").optional(),
  agencyName: z.string().min(2, "El nombre de la agencia debe tener al menos 2 caracteres").optional(),
})

export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const user = session.user as { id: string; agencyId: string }

  const data = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      agency: {
        select: {
          id: true,
          name: true,
          slug: true,
          plan: true,
        },
      },
    },
  })

  if (!data) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
  }

  return NextResponse.json(data)
}

export async function PATCH(request: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const user = session.user as { id: string; agencyId: string }

  const body = await request.json()
  const parsed = updateSettingsSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { fullName, email, agencyName } = parsed.data

  if (fullName !== undefined || email !== undefined) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(fullName !== undefined && { fullName }),
        ...(email !== undefined && { email }),
      },
    })
  }

  if (agencyName !== undefined) {
    await prisma.agency.update({
      where: { id: user.agencyId },
      data: { name: agencyName },
    })
  }

  return NextResponse.json({ success: true })
}
