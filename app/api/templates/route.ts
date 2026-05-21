import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  const user = session.user as any

  const { searchParams } = new URL(req.url)
  const moduleTypeId = searchParams.get("moduleTypeId")
  const q = searchParams.get("q")
  const category = searchParams.get("category")

  const ownershipFilter = {
    OR: [{ isSystem: true }, { agencyId: user.agencyId }],
  }

  const searchFilter = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" as const } },
          { provider: { contains: q, mode: "insensitive" as const } },
          { location: { contains: q, mode: "insensitive" as const } },
          { category: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : undefined

  const categoryFilter = category ? { category } : undefined

  const templates = await prisma.serviceTemplate.findMany({
    where: {
      isActive: true,
      ...(moduleTypeId ? { moduleTypeId } : {}),
      ...(categoryFilter ?? {}),
      AND: [ownershipFilter, ...(searchFilter ? [searchFilter] : [])],
    },
    include: {
      moduleType: true,
      _count: { select: { templateBlocks: true } },
    },
    orderBy: [
      { isSystem: "desc" },
      { name: "asc" },
    ],
    take: 100,
  })

  return NextResponse.json(templates)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  const user = session.user as any

  const body = await req.json()
  const { moduleTypeId, name, provider, category, location, description, metadata } = body

  if (!moduleTypeId || !name?.trim()) {
    return NextResponse.json({ error: "Modulo y nombre son requeridos" }, { status: 400 })
  }

  const module = await prisma.moduleType.findUnique({ where: { id: moduleTypeId } })
  if (!module) return NextResponse.json({ error: "Modulo no encontrado" }, { status: 404 })

  const template = await prisma.serviceTemplate.create({
    data: {
      moduleTypeId,
      name: name.trim(),
      provider: provider?.trim() || null,
      category: category?.trim() || null,
      location: location?.trim() || null,
      description: description?.trim() || null,
      metadata: metadata || {},
      isSystem: false,
      agencyId: user.agencyId,
      isActive: true,
    },
    include: {
      moduleType: true,
      _count: { select: { templateBlocks: true } },
    },
  })

  return NextResponse.json(template, { status: 201 })
}
