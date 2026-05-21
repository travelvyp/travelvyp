import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Plus, Plane, MapPin, Users, Calendar, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatDate, tripDuration } from "@/lib/utils"
import { TripStatus } from "@prisma/client"

const STATUS_LABELS: Record<TripStatus, string> = {
  DRAFT: "Borrador",
  ACTIVE: "Activo",
  CONFIRMED: "Confirmado",
  COMPLETED: "Completado",
  ARCHIVED: "Archivado",
}

const STATUS_VARIANTS: Record<TripStatus, "draft" | "active" | "confirmed" | "completed" | "archived"> = {
  DRAFT: "draft",
  ACTIVE: "active",
  CONFIRMED: "confirmed",
  COMPLETED: "completed",
  ARCHIVED: "archived",
}

export default async function TripsPage() {
  const session = await auth()
  const user = session!.user as any

  const trips = await prisma.trip.findMany({
    where: { agencyId: user.agencyId, deletedAt: null },
    include: {
      createdBy: { select: { fullName: true } },
      tripPassengers: { include: { passenger: true } },
      tripServices: {
        where: { deletedAt: null },
        include: { moduleType: true },
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { updatedAt: "desc" },
  })

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mis Viajes</h1>
          <p className="text-sm text-slate-500 mt-1">
            {trips.length === 0
              ? "No hay viajes todavía"
              : `${trips.length} viaje${trips.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Button asChild>
          <Link href="/trips/new">
            <Plus className="h-4 w-4" />
            Nuevo viaje
          </Link>
        </Button>
      </div>

      {/* Empty state */}
      {trips.length === 0 && (
        <div className="text-center py-24 border-2 border-dashed border-slate-200 rounded-xl">
          <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plane className="h-7 w-7 text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Creá tu primer viaje
          </h3>
          <p className="text-sm text-slate-500 mb-6 max-w-xs mx-auto">
            Cada viaje contiene los servicios, pasajeros e itinerario de una experiencia de viaje.
          </p>
          <Button asChild>
            <Link href="/trips/new">
              <Plus className="h-4 w-4" />
              Crear primer viaje
            </Link>
          </Button>
        </div>
      )}

      {/* Trips grid */}
      {trips.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {trips.map((trip) => {
            const passengerCount = trip.tripPassengers.length
            const serviceCount = trip.tripServices.length
            const duration =
              trip.startDate && trip.endDate
                ? tripDuration(trip.startDate, trip.endDate)
                : null

            return (
              <Link
                key={trip.id}
                href={`/trips/${trip.id}`}
                className="group bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                      {trip.name}
                    </h3>
                    {trip.destination && (
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        <span className="text-xs text-slate-500">{trip.destination}</span>
                      </div>
                    )}
                  </div>
                  <Badge variant={STATUS_VARIANTS[trip.status]} className="ml-2 flex-shrink-0">
                    {STATUS_LABELS[trip.status]}
                  </Badge>
                </div>

                {/* Dates */}
                {(trip.startDate || trip.dateNotes) && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                    <Calendar className="h-3.5 w-3.5" />
                    {trip.startDate && trip.endDate ? (
                      <span>
                        {formatDate(trip.startDate, "d MMM")} — {formatDate(trip.endDate, "d MMM yyyy")}
                        {duration !== null && (
                          <span className="text-slate-400 ml-1">({duration} noches)</span>
                        )}
                      </span>
                    ) : (
                      <span className="italic">{trip.dateNotes || "Fechas por definir"}</span>
                    )}
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-slate-500 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    <span>{passengerCount} pasajero{passengerCount !== 1 ? "s" : ""}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Plane className="h-3.5 w-3.5" />
                    <span>{serviceCount} servicio{serviceCount !== 1 ? "s" : ""}</span>
                  </div>
                  <div className="ml-auto flex items-center gap-1 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="font-medium">Abrir</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>

                {/* Module icons */}
                {trip.tripServices.length > 0 && (
                  <div className="flex items-center gap-1.5 mt-3">
                    {trip.tripServices.slice(0, 5).map((service) => (
                      <div
                        key={service.id}
                        className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: service.moduleType.colorAccent }}
                        title={service.name}
                      >
                        {service.name.charAt(0)}
                      </div>
                    ))}
                    {trip.tripServices.length > 5 && (
                      <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-xs text-slate-500 font-medium">
                        +{trip.tripServices.length - 5}
                      </div>
                    )}
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
