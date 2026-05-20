import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createTripSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  destination: z.string().optional(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  dateFlexibility: z.enum(["FIXED", "FLEXIBLE", "TBD"]).default("FIXED"),
  dateNotes: z.string().optional(),
  internalNotes: z.string().optional(),
})

// GET /api/trips — Listar viajes de la agencia
export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const user = session.user as any
  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status")

  const trips = await prisma.trip.findMany({
    where: {
      agencyId: user.agencyId,
      deletedAt: null,
      ...(status ? { status: status as any } : {}),
    },
    include: {
      createdBy: { select: { fullName: true } },
      tripPassengers: {
        include: { passenger: { select: { firstName: true, lastName: true } } },
      },
      tripServices: {
        where: { deletedAt: null },
        include: { moduleType: true },
        orderBy: { sortOrder: "asc" },
      },
      _count: { select: { tripPassengers: true, tripServices: true } },
    },
    orderBy: { updatedAt: "desc" },
  })

  return NextResponse.json(trips)
}

// POST /api/trips — Crear nuevo viaje
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const user = session.user as any
  const body = await req.json()
  const parsed = createTripSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { name, destination, startDate, endDate, dateFlexibility, dateNotes, internalNotes } = parsed.data

  const trip = await prisma.trip.create({
    data: {
      agencyId: user.agencyId,
      createdById: user.id,
      name,
      destination,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      dateFlexibility,
      dateNotes,
      internalNotes,
      status: "DRAFT",
    },
  })

  return NextResponse.json(trip, { status: 201 })
}
