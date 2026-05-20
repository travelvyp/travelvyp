import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateTripSchema = z.object({
  name: z.string().min(1).optional(),
  destination: z.string().optional(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  dateFlexibility: z.enum(["FIXED", "FLEXIBLE", "TBD"]).optional(),
  dateNotes: z.string().optional(),
  status: z.enum(["DRAFT", "ACTIVE", "CONFIRMED", "COMPLETED", "ARCHIVED"]).optional(),
  internalNotes: z.string().optional(),
})

// GET /api/trips/[tripId]
export async function GET(
  req: NextRequest,
  { params }: { params: { tripId: string } }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  const user = session.user as any

  const trip = await prisma.trip.findFirst({
    where: { id: params.tripId, agencyId: user.agencyId, deletedAt: null },
    include: {
      createdBy: { select: { id: true, fullName: true, email: true } },
      tripPassengers: { include: { passenger: true }, orderBy: { addedAt: "asc" } },
      tripServices: {
        where: { deletedAt: null },
        include: {
          moduleType: true,
          template: true,
          serviceBlocks: { include: { blockDefinition: true }, orderBy: { sortOrder: "asc" } },
        },
        orderBy: { sortOrder: "asc" },
      },
      itineraries: { orderBy: { version: "desc" }, take: 5 },
    },
  })

  if (!trip) return NextResponse.json({ error: "Viaje no encontrado" }, { status: 404 })
  return NextResponse.json(trip)
}

// PATCH /api/trips/[tripId]
export async function PATCH(
  req: NextRequest,
  { params }: { params: { tripId: string } }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  const user = session.user as any

  const body = await req.json()
  const parsed = updateTripSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const trip = await prisma.trip.findFirst({
    where: { id: params.tripId, agencyId: user.agencyId, deletedAt: null },
  })
  if (!trip) return NextResponse.json({ error: "Viaje no encontrado" }, { status: 404 })

  const { startDate, endDate, ...rest } = parsed.data
  const updated = await prisma.trip.update({
    where: { id: params.tripId },
    data: {
      ...rest,
      ...(startDate !== undefined ? { startDate: startDate ? new Date(startDate) : null } : {}),
      ...(endDate !== undefined ? { endDate: endDate ? new Date(endDate) : null } : {}),
    },
  })

  return NextResponse.json(updated)
}

// DELETE /api/trips/[tripId] — soft delete
export async function DELETE(
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

  await prisma.trip.update({ where: { id: params.tripId }, data: { deletedAt: new Date() } })
  return NextResponse.json({ success: true })
}
