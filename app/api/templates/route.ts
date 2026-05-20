import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/templates?moduleTypeId=...&q=...
export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  const user = session.user as any

  const { searchParams } = new URL(req.url)
  const moduleTypeId = searchParams.get("moduleTypeId")
  const q = searchParams.get("q")

  // Construir el filtro base: templates del sistema O de la agencia
  const ownershipFilter = {
    OR: [
      { isSystem: true },
      { agencyId: user.agencyId },
    ],
  }

  // Filtro de búsqueda por texto (opcional)
  const searchFilter = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" as const } },
          { provider: { contains: q, mode: "insensitive" as const } },
          { location: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : undefined

  const templates = await prisma.serviceTemplate.findMany({
    where: {
      isActive: true,
      ...(moduleTypeId ? { moduleTypeId } : {}),
      // Combinar ambos filtros con AND para no sobreescribir OR
      AND: [
        ownershipFilter,
        ...(searchFilter ? [searchFilter] : []),
      ],
    },
    include: {
      moduleType: true,
      _count: { select: { templateBlocks: true } },
    },
    orderBy: [{ isSystem: "desc" }, { name: "asc" }],
    take: 20,
  })

  return NextResponse.json(templates)
}
