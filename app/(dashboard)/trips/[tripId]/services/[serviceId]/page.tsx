import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft, Plane, Hotel, FerrisWheel, Car,
  CheckCircle2, Clock, AlertCircle, Edit3
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BlockList } from "@/components/builder/block-list"
import { formatDate } from "@/lib/utils"

const MODULE_ICONS: Record<string, any> = {
  FLIGHT: Plane, HOTEL: Hotel, THEME_PARK: FerrisWheel, CAR_RENTAL: Car,
}
const STATUS_ICON: Record<string, any> = {
  PENDING: Clock, CONFIRMED: CheckCircle2, CANCELLED: AlertCircle,
}
const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pendiente", CONFIRMED: "Confirmado", CANCELLED: "Cancelado",
}
const STATUS_VARIANT: Record<string, any> = {
  PENDING: "draft", CONFIRMED: "confirmed", CANCELLED: "destructive",
}

function ServiceDataSummary({ serviceData, moduleCode }: { serviceData: any; moduleCode: string }) {
  if (!serviceData || Object.keys(serviceData).length === 0) return null

  const entries: { label: string; value: string }[] = []

  if (moduleCode === "FLIGHT") {
    if (serviceData.airline) entries.push({ label: "Aerolínea", value: serviceData.airline })
    if (serviceData.flightNumber) entries.push({ label: "Vuelo", value: serviceData.flightNumber })
    if (serviceData.origin && serviceData.destination)
      entries.push({ label: "Ruta", value: `${serviceData.origin} → ${serviceData.destination}` })
    if (serviceData.departureDateTime)
      entries.push({ label: "Salida", value: new Date(serviceData.departureDateTime).toLocaleString("es", { dateStyle: "short", timeStyle: "short" }) })
    if (serviceData.terminal) entries.push({ label: "Terminal", value: serviceData.terminal })
  }
  if (moduleCode === "HOTEL") {
    if (serviceData.checkinDate) entries.push({ label: "Check-in", value: formatDate(serviceData.checkinDate) })
    if (serviceData.checkoutDate) entries.push({ label: "Check-out", value: formatDate(serviceData.checkoutDate) })
    if (serviceData.roomType) entries.push({ label: "Habitación", value: serviceData.roomType })
    if (serviceData.adults) entries.push({ label: "Adultos", value: String(serviceData.adults) })
    if (serviceData.children) entries.push({ label: "Niños", value: String(serviceData.children) })
  }
  if (moduleCode === "THEME_PARK") {
    if (serviceData.visitDate) entries.push({ label: "Fecha", value: formatDate(serviceData.visitDate) })
    if (serviceData.ticketType) entries.push({ label: "Ticket", value: serviceData.ticketType })
    if (serviceData.parkHoursOpen) entries.push({ label: "Apertura", value: serviceData.parkHoursOpen })
    if (serviceData.parkHoursClose) entries.push({ label: "Cierre", value: serviceData.parkHoursClose })
  }
  if (moduleCode === "CAR_RENTAL") {
    if (serviceData.company) entries.push({ label: "Empresa", value: serviceData.company })
    if (serviceData.category) entries.push({ label: "Categoría", value: serviceData.category })
    if (serviceData.pickupDate) entries.push({ label: "Pickup", value: formatDate(serviceData.pickupDate) })
    if (serviceData.dropoffDate) entries.push({ label: "Dropoff", value: formatDate(serviceData.dropoffDate) })
    if (serviceData.pickupLocation) entries.push({ label: "Lugar", value: serviceData.pickupLocation })
  }

  if (entries.length === 0) return null

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {entries.map(({ label, value }) => (
        <div key={label} className="bg-slate-50 rounded-lg px-3 py-2">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{label}</p>
          <p className="text-sm font-semibold text-slate-900 mt-0.5 truncate">{value}</p>
        </div>
      ))}
    </div>
  )
}

export default async function ServiceDetailPage({
  params,
}: {
  params: { tripId: string; serviceId: string }
}) {
  const session = await auth()
  const user = session!.user as any

  const service = await prisma.tripService.findFirst({
    where: {
      id: params.serviceId,
      tripId: params.tripId,
      trip: { agencyId: user.agencyId },
      deletedAt: null,
    },
    include: {
      trip: { select: { id: true, name: true } },
      moduleType: true,
      template: true,
      serviceBlocks: {
        include: { blockDefinition: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  })

  if (!service) notFound()

  const Icon = MODULE_ICONS[service.moduleType.code] || Plane
  const StatusIcon = STATUS_ICON[service.status]
  const activeBlockCount = service.serviceBlocks.filter(b => b.isActive).length
  const totalBlockCount = service.serviceBlocks.length

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Back */}
      <Link
        href={`/dashboard/trips/${service.trip.id}`}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        {service.trip.name}
      </Link>

      {/* Service header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6">
        <div className="flex items-start gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: service.moduleType.colorAccent + "20" }}
          >
            <Icon className="h-6 w-6" style={{ color: service.moduleType.colorAccent }} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-slate-900">{service.name}</h1>
              <Badge variant={STATUS_VARIANT[service.status]}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {STATUS_LABEL[service.status]}
              </Badge>
            </div>
            <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
              <span>{service.moduleType.name}</span>
              {service.template && (
                <span className="text-slate-400">· {service.template.name}</span>
              )}
              {service.confirmationNumber && (
                <span className="font-mono text-slate-600">#{service.confirmationNumber}</span>
              )}
            </div>
          </div>

          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/trips/${params.tripId}/services/${params.serviceId}/edit`}>
              <Edit3 className="h-4 w-4" />
              Editar datos
            </Link>
          </Button>
        </div>

        {/* Service data summary */}
        {Object.keys(service.serviceData as object || {}).length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <ServiceDataSummary
              serviceData={service.serviceData}
              moduleCode={service.moduleType.code}
            />
          </div>
        )}

        {service.internalNotes && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">
              Notas internas
            </p>
            <p className="text-sm text-slate-600">{service.internalNotes}</p>
          </div>
        )}
      </div>

      {/* Blocks section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">
              Bloques de contenido
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {activeBlockCount} de {totalBlockCount} bloques visibles en el itinerario
            </p>
          </div>
          {/* Color indicator */}
          <div
            className="h-2 w-20 rounded-full opacity-60"
            style={{ backgroundColor: service.moduleType.colorAccent }}
          />
        </div>

        {totalBlockCount === 0 ? (
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-10 text-center">
            <p className="text-sm text-slate-400 mb-2">Este servicio no tiene bloques</p>
            <p className="text-xs text-slate-400">
              Los bloques se cargan automáticamente al usar un template
            </p>
          </div>
        ) : (
          <BlockList
            initialBlocks={service.serviceBlocks.map(b => ({
              ...b,
              displayMode: b.displayMode as "FULL" | "SUMMARY" | "HIDDEN",
            }))}
            moduleColor={service.moduleType.colorAccent}
            tripId={params.tripId}
            serviceId={params.serviceId}
          />
        )}
      </div>
    </div>
  )
}
