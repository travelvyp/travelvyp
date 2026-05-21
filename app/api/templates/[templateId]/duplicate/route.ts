import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

type Params = { params: Promise<{ templateId: string }> }

// POST /api/templates/[templateId]/duplicate
// Crea una copia del template (sistema o agencia) como template propio de la agencia
export async function POST(req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  const user = session.user as any
  const { templateId } = await params

  const source = await prisma.serviceTemplate.findFirst({
    where: {
      id: templateId,
      isActive: true,
      OR: [{ isSystem: true }, { agencyId: user.agencyId }],
    },
    include: {
      templateBlocks: {
        orderBy: { sortOrder: "asc" },
      },
    },
  })

  if (!source) return NextResponse.json({ error: "Template no encontrado" }, { status: 404 })

  const copy = await prisma.serviceTemplate.create({
    data: {
      moduleTypeId: source.moduleTypeId,
      name: `${source.name} (copia)`,
      provider: source.provider,
      category: source.category,
      location: source.location,
      description: source.description,
      metadata: source.metadata as object,
      isSystem: false,
      agencyId: user.agencyId,
      isActive: true,
      templateBlocks: {
        create: source.templateBlocks.map((tb) => ({
          blockDefinitionId: tb.blockDefinitionId,
          title: tb.title,
          content: tb.content,
          contentShort: tb.contentShort,
          isActiveByDefault: tb.isActiveByDefault,
          isHighlightedByDefault: tb.isHighlightedByDefault,
          sortOrder: tb.sortOrder,
        })),
      },
    },
    include: {
      moduleType: true,
      _count: { select: { templateBlocks: true } },
    },
  })

  return NextResponse.json(copy, { status: 201 })
}
