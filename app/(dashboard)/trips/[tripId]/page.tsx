import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft, Plus, Users, FileText,
  Plane, Hotel, FerrisWheel, Car, CheckCircle2,
  Clock, AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ExportPdfButton } from "@/components/builder/export-pdf-button"
import { Badge } from "@/components/ui/badge"
import { formatDate, tripDuration } from "@/lib/utils"
import { TripStatus, ServiceStatus } from "@prisma/client"

const STATUS_LABELS: Record<TripStatus, string> = {
  DRAFT: "Borrador", ACTIVE: "Activo", CONFIRMED: "Confirmado",
  COMPLETED: "Completado", ARCHIVED: "Archivado",
}
const STATUS_VARIANTS: Record<TripStatus, any> = {
  DRAFT: "draft", ACTIVE: "active", CONFIRMED: "confirmed",
  COMPLETED: "completed", ARCHIVED: "archived",
}
const MODULE_ICONS: Record<string, any> = {
  FLIGHT: Plane, HOTEL: Hotel, THEME_PARK: FerrisWheel, CAR_RENTAL: Car,
}
const SERVICE_STATUS_ICON: Record<ServiceStatus, any> = {
  PENDING: Clock, CONFIRMED: CheckCircle2, CANCELLED: AlertCircle,
}
const SERVICE_STATUS_COLOR: Record<ServiceStatus, string> = {
  PENDING: "text-amber-500", CONFIRMED: "text-green-500", CANCELLED: "text-red-400",
}

export default async function TripDetailPage({
  params,
}: {
  params: { tripId: string }
}) {
  const session = await auth()
  const user = session!.user as any

  const trip = await prisma.trip.findFirst({
    where: { id: params.tripId, agencyId: user.agencyId, deletedAt: null },
    include: {
      createdBy: { select: { fullName: true } },
      tripPassengers: {
        include: { passenger: true },
        orderBy: { addedAt: "asc" },
      },
      tripServices: {
        where: { deletedAt: null },
        include: {
          moduleType: true,
          template: true,
          serviceBlocks: true,
        },
        orderBy: { sortOrder: "asc" },
      },
      itineraries: { orderBy: { version: "desc" }, take: 1 },
    },
  })

  if (!trip) notFound()

  const duration =
    trip.startDate && trip.endDate
      ? tripDuration(trip.startDate, trip.endDate)
      : null

  const confirmedServices = trip.tripServices.filter((s) => s.status === "CONFIRMED").length
  const totalServices = trip.tripServices.length

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Back */}
      <Link
        href="/trips"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Mis Viajes
      </Link>

      {/* Trip header */}
      <div className="flex items-start justify-between mb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">{trip.name}</h1>
            <Badge variant={STATUS_VARIANTS[trip.status]}>
              {STATUS_LABELS[trip.status]}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            {trip.destination && <span>{trip.destination}</span>}
            {trip.startDate && trip.endDate && (
              <span>
                {formatDate(trip.startDate, "d MMM")} — {formatDate(trip.endDate, "d MMM yyyy")}
                {duration !== null && <span className="text-slate-400 ml-1">· {duration} noches</span>}
              </span>
            )}
            {trip.dateNotes && !trip.startDate && (
              <span className="italic">{trip.dateNotes}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`/api/trips/${trip.id}/pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 h-9 px-3 rounded-md border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <FileText className="h-4 w-4" />
            Ver itinerario
          </a>
          <ExportPdfButton tripId={trip.id} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Column: Servicios */}
        <div className="col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">
              Servicios
              {totalServices > 0 && (
                <span className="text-slate-400 font-normal ml-2 text-sm">
                  ({confirmedServices}/{totalServices} confirmados)
                </span>
              )}
            </h2>
            <Button asChild size="sm">
              <Link href={`/trips/${trip.id}/services/new`}>
                <Plus className="h-4 w-4" />
                Agregar
              </Link>
            </Button>
          </div>

          {trip.tripServices.length === 0 ? (
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-10 text-center">
              <p className="text-sm text-slate-500 mb-4">
                No hay servicios todavía. Agregá el primer servicio al viaje.
              </p>
              <Button asChild variant="outline" size="sm">
                <Link href={`/trips/${trip.id}/services/new`}>
                  <Plus className="h-4 w-4" />
                  Agregar servicio
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {trip.tripServices.map((service) => {
                const Icon = MODULE_ICONS[service.moduleType.code] || Plane
                const StatusIcon = SERVICE_STATUS_ICON[service.status]
                const statusColor = SERVICE_STATUS_COLOR[service.status]
                const activeBlocks = service.serviceBlocks.filter((b) => b.isActive).length
                const totalBlocks = service.serviceBlocks.length

                return (
                  <Link
                    key={service.id}
                    href={`/trips/${trip.id}/services/${service.id}`}
                    className="group flex items-center gap-4 bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 hover:shadow-sm transition-all"
                  >
                    {/* Module color indicator */}
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: service.moduleType.colorAccent + "20" }}
                    >
                      <Icon
                        className="h-5 w-5"
                        style={{ color: service.moduleType.colorAccent }}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                        {service.name}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {service.moduleType.name}
                        {service.confirmationNumber && (
                          <span className="ml-2 font-mono">#{service.confirmationNumber}</span>
                        )}
                      </p>
                    </div>

                    {/* Blocks count */}
                    {totalBlocks > 0 && (
                      <div className="text-xs text-slate-400 hidden sm:block">
                        {activeBlocks}/{totalBlocks} bloques
                      </div>
                    )}

                    {/* Status */}
                    <StatusIcon className={`h-4 w-4 flex-shrink-0 ${statusColor}`} />
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Column: Pasajeros + Notas */}
        <div className="space-y-4">
          {/* Pasajeros */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-slate-900">Pasajeros</h2>
              <Button asChild size="sm" variant="ghost">
                <Link href={`/trips/${trip.id}/passengers`}>
                  <Plus className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {trip.tripPassengers.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
                <Users className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-400 mb-2">Sin pasajeros</p>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/trips/${trip.id}/passengers`}>
                    Agregar
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
                {trip.tripPassengers.map(({ passenger, role }) => (
                  <div key={passenger.id} className="flex items-center gap-3 p-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-semibold text-xs">
                        {passenger.firstName[0]}{passenger.lastName[0]}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {passenger.firstName} {passenger.lastName}
                      </p>
                      <p className="text-xs text-slate-400">
                        {role === "LEAD" ? "Titular" : passenger.passengerType === "CHILD" ? "Niño" : "Acompañante"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notas internas */}
          {trip.internalNotes && (
            <div>
              <h2 className="font-semibold text-slate-900 mb-3">Notas internas</h2>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-sm text-amber-800 leading-relaxed">{trip.internalNotes}</p>
              </div>
            </div>
          )}

          {/* Meta */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Información
            </p>
            <div className="space-y-1.5 text-xs text-slate-500">
              <div className="flex justify-between">
                <span>Creado por</span>
                <span className="text-slate-700 font-medium">{trip.createdBy.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span>Creado</span>
                <span className="text-slate-700">{formatDate(trip.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span>Actualizado</span>
                <span className="text-slate-700">{formatDate(trip.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}