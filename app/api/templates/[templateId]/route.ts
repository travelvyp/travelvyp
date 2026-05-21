import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

type Params = { params: Promise<{ templateId: string }> }

// GET /api/templates/[templateId]
export async function GET(req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  const user = session.user as any
  const { templateId } = await params

  const template = await prisma.serviceTemplate.findFirst({
    where: {
      id: templateId,
      isActive: true,
      OR: [{ isSystem: true }, { agencyId: user.agencyId }],
    },
    include: {
      moduleType: true,
      templateBlocks: {
        include: { blockDefinition: true },
        orderBy: { sortOrder: "asc" },
      },
      _count: { select: { templateBlocks: true } },
    },
  })

  if (!template) return NextResponse.json({ error: "Template no encontrado" }, { status: 404 })
  return NextResponse.json(template)
}

// PATCH /api/templates/[templateId] — solo templates de la agencia
export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  const user = session.user as any
  const { templateId } = await params

  const existing = await prisma.serviceTemplate.findFirst({
    where: { id: templateId, agencyId: user.agencyId, isActive: true },
  })

  if (!existing) {
    return NextResponse.json(
      { error: "No se puede editar: template no encontrado o es del sistema" },
      { status: 403 }
    )
  }

  const body = await req.json()
  const { name, provider, category, location, description, metadata, moduleTypeId } = body

  const updated = await prisma.serviceTemplate.update({
    where: { id: templateId },
    data: {
      ...(name !== undefined ? { name: name.trim() } : {}),
      ...(provider !== undefined ? { provider: provider?.trim() || null } : {}),
      ...(category !== undefined ? { category: category?.trim() || null } : {}),
      ...(location !== undefined ? { location: location?.trim() || null } : {}),
      ...(description !== undefined ? { description: description?.trim() || null } : {}),
      ...(metadata !== undefined ? { metadata } : {}),
      ...(moduleTypeId !== undefined ? { moduleTypeId } : {}),
    },
    include: {
      moduleType: true,
      _count: { select: { templateBlocks: true } },
    },
  })

  return NextResponse.json(updated)
}

// DELETE /api/templates/[templateId] — solo templates de la agencia
export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  const user = session.user as any
  const { templateId } = await params

  const existing = await prisma.serviceTemplate.findFirst({
    where: { id: templateId, agencyId: user.agencyId, isActive: true },
  })

  if (!existing) {
    return NextResponse.json(
      { error: "No se puede eliminar: template no encontrado o es del sistema" },
      { status: 403 }
    )
  }

  await prisma.serviceTemplate.update({
    where: { id: templateId },
    data: { isActive: false },
  })

  return NextResponse.json({ ok: true })
}
