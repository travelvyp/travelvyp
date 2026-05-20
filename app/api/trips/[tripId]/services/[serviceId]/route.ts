import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateServiceSchema = z.object({
  name: z.string().min(1).optional(),
  confirmationNumber: z.string().optional().nullable(),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED"]).optional(),
  serviceData: z.record(z.unknown()).optional(),
  internalNotes: z.string().optional(),
  sortOrder: z.number().optional(),
})

// GET /api/trips/[tripId]/services/[serviceId]
export async function GET(
  req: NextRequest,
  { params }: { params: { tripId: string; serviceId: string } }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  const user = session.user as any

  const service = await prisma.tripService.findFirst({
    where: {
      id: params.serviceId,
      tripId: params.tripId,
      trip: { agencyId: user.agencyId },
      deletedAt: null,
    },
    include: {
      moduleType: true,
      template: true,
      serviceBlocks: {
        include: { blockDefinition: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  })

  if (!service) return NextResponse.json({ error: "Servicio no encontrado" }, { status: 404 })
  return NextResponse.json(service)
}

// PATCH /api/trips/[tripId]/services/[serviceId]
export async function PATCH(
  req: NextRequest,
  { params }: { params: { tripId: string; serviceId: string } }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  const user = session.user as any

  const service = await prisma.tripService.findFirst({
    where: {
      id: params.serviceId,
      tripId: params.tripId,
      trip: { agencyId: user.agencyId },
      deletedAt: null,
    },
  })
  if (!service) return NextResponse.json({ error: "Servicio no encontrado" }, { status: 404 })

  const body = await req.json()
  const parsed = updateServiceSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const updated = await prisma.tripService.update({
    where: { id: params.serviceId },
    data: { ...parsed.data, serviceData: parsed.data.serviceData as any },
    include: {
      moduleType: true,
      template: true,
      serviceBlocks: {
        include: { blockDefinition: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  })

  return NextResponse.json(updated)
}

// DELETE /api/trips/[tripId]/services/[serviceId]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { tripId: string; serviceId: string } }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  const user = session.user as any

  const service = await prisma.tripService.findFirst({
    where: {
      id: params.serviceId,
      tripId: params.tripId,
      trip: { agencyId: user.agencyId },
      deletedAt: null,
    },
  })
  if (!service) return NextResponse.json({ error: "Servicio no encontrado" }, { status: 404 })

  await prisma.tripService.update({
    where: { id: params.serviceId },
    data: { deletedAt: new Date() },
  })

  return NextResponse.json({ success: true })
}
