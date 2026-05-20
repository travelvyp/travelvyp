import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createServiceSchema = z.object({
  moduleTypeId: z.string(),
  templateId: z.string().optional().nullable(),
  name: z.string().min(1),
  confirmationNumber: z.string().optional(),
  serviceData: z.record(z.unknown()).default({}),
  internalNotes: z.string().optional(),
})

// GET /api/trips/[tripId]/services
export async function GET(
  req: NextRequest,
  { params }: { params: { tripId: string } }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  const user = session.user as any

  const trip = await prisma.trip.findFirst({
    where: { id: params.tripId, agencyId: user.agencyId, deletedAt: null },
  })
  if (!trip) return NextResponse.json({ error: "Viaje no encontrado" }, { status: 404 })

  const services = await prisma.tripService.findMany({
    where: { tripId: params.tripId, deletedAt: null },
    include: {
      moduleType: true,
      template: true,
      serviceBlocks: {
        include: { blockDefinition: true },
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { sortOrder: "asc" },
  })

  return NextResponse.json(services)
}

// POST /api/trips/[tripId]/services
// Crea el servicio + ejecuta el Template Engine (auto-genera service_blocks)
export async function POST(
  req: NextRequest,
  { params }: { params: { tripId: string } }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  const user = session.user as any

  const trip = await prisma.trip.findFirst({
    where: { id: params.tripId, agencyId: user.agencyId, deletedAt: null },
  })
  if (!trip) return NextResponse.json({ error: "Viaje no encontrado" }, { status: 404 })

  const body = await req.json()
  const parsed = createServiceSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { moduleTypeId, templateId, name, confirmationNumber, serviceData, internalNotes } = parsed.data

  // Obtener el sortOrder más alto existente
  const lastService = await prisma.tripService.findFirst({
    where: { tripId: params.tripId, deletedAt: null },
    orderBy: { sortOrder: "desc" },
  })
  const nextSortOrder = (lastService?.sortOrder ?? -1) + 1

  // Crear servicio en una transacción
  const service = await prisma.$transaction(async (tx) => {
    // 1. Crear el trip_service
    const newService = await tx.tripService.create({
      data: {
        tripId: params.tripId,
        moduleTypeId,
        templateId: templateId || null,
        name,
        confirmationNumber: confirmationNumber || null,
        serviceData: serviceData as any,
        internalNotes: internalNotes || null,
        sortOrder: nextSortOrder,
        status: "PENDING",
      },
    })

    // 2. TEMPLATE ENGINE: Si hay template, cargar sus bloques automáticamente
    if (templateId) {
      const templateBlocks = await tx.templateBlock.findMany({
        where: { templateId },
        include: { blockDefinition: true },
        orderBy: { sortOrder: "asc" },
      })

      if (templateBlocks.length > 0) {
        await tx.serviceBlock.createMany({
          data: templateBlocks.map((tb) => ({
            tripServiceId: newService.id,
            blockDefinitionId: tb.blockDefinitionId,
            templateBlockId: tb.id,
            title: tb.title,
            content: tb.content,
            contentShort: tb.contentShort,
            isActive: tb.isActiveByDefault,
            isHighlighted: tb.isHighlightedByDefault,
            isEdited: false,
            displayMode: "FULL",
            sortOrder: tb.sortOrder,
          })),
        })
      }
    }

    // 3. Actualizar updatedAt del viaje
    await tx.trip.update({
      where: { id: params.tripId },
      data: { updatedAt: new Date() },
    })

    return newService
  })

  // Retornar servicio con bloques incluidos
  const full = await prisma.tripService.findUnique({
    where: { id: service.id },
    include: {
      moduleType: true,
      template: true,
      serviceBlocks: {
        include: { blockDefinition: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  })

  return NextResponse.json(full, { status: 201 })
}
