import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createPassengerSchema = z.object({
  firstName: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().min(1, "El apellido es requerido"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  passportNumber: z.string().optional(),
  passportExpiry: z.string().optional().nullable(),
  nationality: z.string().optional(),
  dateOfBirth: z.string().optional().nullable(),
  passengerType: z.enum(["ADULT", "CHILD", "INFANT"]).default("ADULT"),
  notes: z.string().optional(),
})

// GET /api/passengers
export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  const user = session.user as any

  const { searchParams } = new URL(req.url)
  const search = searchParams.get("q")

  const passengers = await prisma.passenger.findMany({
    where: {
      agencyId: user.agencyId,
      deletedAt: null,
      ...(search
        ? {
            OR: [
              { firstName: { contains: search, mode: "insensitive" } },
              { lastName: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: {
      _count: { select: { tripPassengers: true } },
    },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  })

  return NextResponse.json(passengers)
}

// POST /api/passengers
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  const user = session.user as any

  const body = await req.json()
  const parsed = createPassengerSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { dateOfBirth, passportExpiry, email, ...rest } = parsed.data

  const passenger = await prisma.passenger.create({
    data: {
      agencyId: user.agencyId,
      ...rest,
      email: email || null,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      passportExpiry: passportExpiry ? new Date(passportExpiry) : null,
    },
  })

  return NextResponse.json(passenger, { status: 201 })
}
