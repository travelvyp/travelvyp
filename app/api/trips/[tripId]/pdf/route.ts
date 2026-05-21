import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { renderToBuffer } from "@react-pdf/renderer"
import { ItineraryDocument } from "@/components/pdf/itinerary-document"
import React from "react"

// Forzar runtime Node.js — @react-pdf/renderer no es compatible con Edge
export const runtime = "nodejs"

export async function GET(
  request: NextRequest,
  { params }: { params: { tripId: string } }
) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const user = session.user as { agencyId: string; name?: string | null; email?: string | null }

  try {
    const trip = await prisma.trip.findFirst({
      where: {
        id: params.tripId,
        agencyId: user.agencyId,
        deletedAt: null,
      },
      include: {
        agency: true,
        createdBy: true,
        tripPassengers: {
          include: {
            passenger: true,
          },
        },
        tripServices: {
          where: { deletedAt: null },
          orderBy: { sortOrder: "asc" },
          include: {
            moduleType: true,
            serviceBlocks: {
              where: { isActive: true },
              orderBy: { sortOrder: "asc" },
              include: {
                blockDefinition: true,
              },
            },
          },
        },
      },
    })

    if (!trip) {
      return NextResponse.json({ error: "Viaje no encontrado" }, { status: 404 })
    }

    // Mapear datos para el documento PDF
    const passengers = trip.tripPassengers.map((tp) => ({
      firstName: tp.passenger.firstName,
      lastName: tp.passenger.lastName,
      passengerType: tp.passenger.passengerType,
    }))

    const services = trip.tripServices.map((service) => ({
      id: service.id,
      name: service.name,
      moduleTypeCode: service.moduleType.code,
      confirmationNumber: service.confirmationNumber,
      status: service.status,
      sortOrder: service.sortOrder,
      serviceData: (service.serviceData as Record<string, unknown>) || {},
      blocks: service.serviceBlocks.map((block) => ({
        id: block.id,
        title: block.title,
        content: block.content,
        contentShort: block.contentShort,
        isActive: block.isActive,
        isHighlighted: block.isHighlighted,
        displayMode: block.displayMode,
        sortOrder: block.sortOrder,
        blockDefinition: {
          code: block.blockDefinition.code,
          name: block.blockDefinition.name,
        },
      })),
    }))

    const doc = React.createElement(ItineraryDocument, {
      tripName: trip.name,
      destination: trip.destination,
      startDate: trip.startDate,
      endDate: trip.endDate,
      dateNotes: trip.dateFlexibility === "TBD" ? "Fechas por confirmar" : null,
      agencyName: trip.agency.name,
      agentName: trip.createdBy.fullName,
      agentEmail: trip.createdBy.email,
      agentPhone: null,
      passengers,
      services,
      generatedAt: new Date(),
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const buffer = await renderToBuffer(doc as any)

    const fileName = `${trip.name
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase()}_itinerario.pdf`

    return new NextResponse(buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Length": buffer.length.toString(),
      },
    })
  } catch (error) {
    console.error("PDF generation error:", error)
    return NextResponse.json({ error: "Error al generar el PDF" }, { status: 500 })
  }
}
