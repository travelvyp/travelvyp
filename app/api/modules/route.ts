import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const modules = await prisma.moduleType.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  })

  return NextResponse.json(modules)
}
