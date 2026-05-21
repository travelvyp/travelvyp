import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// GET /api/trips/[tripId]/passengers — lista los pasajeros del viaje
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

  const tripPassengers = await prisma.tripPassenger.findMany({
    where: { tripId: params.tripId },
    include: { passenger: true },
    orderBy: { addedAt: "asc" },
  })

  return NextResponse.json(tripPassengers)
}

const addPassengerSchema = z.object({
  passengerId: z.string().uuid(),
  role: z.enum(["LEAD", "COMPANION", "CHILD"]).default("COMPANION"),
})

// POST /api/trips/[tripId]/passengers — agrega un pasajero al viaje
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
  const parsed = addPassengerSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  // Verificar que el pasajero pertenece a la agencia
  const passenger = await prisma.passenger.findFirst({
    where: { id: parsed.data.passengerId, agencyId: user.agencyId, deletedAt: null },
  })
  if (!passenger) return NextResponse.json({ error: "Pasajero no encontrado" }, { status: 404 })

  try {
    const tp = await prisma.tripPassenger.create({
      data: {
        tripId: params.tripId,
        passengerId: parsed.data.passengerId,
        role: parsed.data.role,
      },
      include: { passenger: true },
    })
    return NextResponse.json(tp, { status: 201 })
  } catch {
    return NextResponse.json({ error: "El pasajero ya está en este viaje" }, { status: 409 })
  }
}

// DELETE /api/trips/[tripId]/passengers?passengerId=... — quita un pasajero del viaje
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

  const passengerId = new URL(req.url).searchParams.get("passengerId")
  if (!passengerId) return NextResponse.json({ error: "passengerId requerido" }, { status: 400 })

  await prisma.tripPassenger.deleteMany({
    where: { tripId: params.tripId, passengerId },
  })

  return NextResponse.json({ ok: true })
}
