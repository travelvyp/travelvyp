import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateBlockSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  contentShort: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  isHighlighted: z.boolean().optional(),
  displayMode: z.enum(["FULL", "SUMMARY", "HIDDEN"]).optional(),
  sortOrder: z.number().optional(),
  // Restaurar contenido original del template
  restoreOriginal: z.boolean().optional(),
})

// PATCH /api/trips/[tripId]/services/[serviceId]/blocks/[blockId]
export async function PATCH(
  req: NextRequest,
  { params }: { params: { tripId: string; serviceId: string; blockId: string } }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  const user = session.user as any

  // Verificar pertenencia
  const block = await prisma.serviceBlock.findFirst({
    where: {
      id: params.blockId,
      tripServiceId: params.serviceId,
      tripService: {
        tripId: params.tripId,
        trip: { agencyId: user.agencyId },
        deletedAt: null,
      },
    },
    include: { templateBlock: true },
  })
  if (!block) return NextResponse.json({ error: "Bloque no encontrado" }, { status: 404 })

  const body = await req.json()
  const parsed = updateBlockSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { restoreOriginal, content, title, ...rest } = parsed.data

  // Si se pide restaurar el original del template
  if (restoreOriginal && block.templateBlock) {
    const restored = await prisma.serviceBlock.update({
      where: { id: params.blockId },
      data: {
        title: block.templateBlock.title,
        content: block.templateBlock.content,
        contentShort: block.templateBlock.contentShort,
        isEdited: false,
      },
      include: { blockDefinition: true },
    })
    return NextResponse.json(restored)
  }

  // Detectar si el contenido fue editado (comparar con template original)
  const isEditing = content !== undefined || title !== undefined
  const isEdited = isEditing
    ? true
    : parsed.data.hasOwnProperty("isActive") || parsed.data.hasOwnProperty("isHighlighted")
    ? block.isEdited // mantener estado actual si solo se togglea
    : block.isEdited

  const updated = await prisma.serviceBlock.update({
    where: { id: params.blockId },
    data: {
      ...rest,
      ...(content !== undefined ? { content, isEdited: true } : {}),
      ...(title !== undefined ? { title, isEdited: true } : {}),
      ...(!isEditing ? { isEdited } : {}),
    },
    include: { blockDefinition: true },
  })

  return NextResponse.json(updated)
}

// DELETE /api/trips/[tripId]/services/[serviceId]/blocks/[blockId]
// Solo para bloques custom (templateBlockId === null)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { tripId: string; serviceId: string; blockId: string } }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  const user = session.user as any

  const block = await prisma.serviceBlock.findFirst({
    where: {
      id: params.blockId,
      tripServiceId: params.serviceId,
      tripService: {
        tripId: params.tripId,
        trip: { agencyId: user.agencyId },
        deletedAt: null,
      },
    },
  })
  if (!block) return NextResponse.json({ error: "Bloque no encontrado" }, { status: 404 })
  if (block.templateBlockId) {
    return NextResponse.json(
      { error: "Los bloques de template no pueden eliminarse, solo desactivarse." },
      { status: 400 }
    )
  }

  await prisma.serviceBlock.delete({ where: { id: params.blockId } })
  return NextResponse.json({ success: true })
}
