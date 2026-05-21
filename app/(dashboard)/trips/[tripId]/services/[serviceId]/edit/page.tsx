"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft, Loader2, Check, AlertCircle,
  Plane, Hotel, FerrisWheel, Car, Bus, Shield, Ticket, Compass, Package
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { apiPath } from "@/lib/api"

const ICONS: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  FLIGHT: Plane, HOTEL: Hotel, THEME_PARK: FerrisWheel, CAR_RENTAL: Car,
  TRANSFER: Bus, INSURANCE: Shield, TICKET: Ticket, EXCURSION: Compass, OTHER: Package,
}

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pendiente" },
  { value: "CONFIRMED", label: "Confirmado" },
  { value: "CANCELLED", label: "Cancelado" },
]

type Service = {
  id: string
  name: string
  status: string
  confirmationNumber: string | null
  internalNotes: string | null
  serviceData: Record<string, string>
  moduleType: { code: string; name: string; colorAccent: string }
  trip: { id: string; name: string }
}

export default function EditServicePage({
  params,
}: {
  params: Promise<{ tripId: string; serviceId: string }>
}) {
  const { tripId, serviceId } = use(params)
  const router = useRouter()

  const [service, setService] = useState<Service | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState("")
  const [status, setStatus] = useState("PENDING")
  const [confirmationNumber, setConfirmationNumber] = useState("")
  const [internalNotes, setInternalNotes] = useState("")
  const [serviceData, setServiceData] = useState<Record<string, string>>({})

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(apiPath(`/api/trips/${tripId}/services/${serviceId}`))
        if (!res.ok) throw new Error("Servicio no encontrado")
        const data = await res.json()
        setService(data)
        setName(data.name)
        setStatus(data.status)
        setConfirmationNumber(data.confirmationNumber || "")
        setInternalNotes(data.internalNotes || "")
        setServiceData(data.serviceData || {})
      } catch {
        setError("No se pudo cargar el servicio")
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [tripId, serviceId])

  function handleDataChange(key: string, value: string) {
    setServiceData(prev => ({ ...prev, [key]: value }))
  }

  async function handleSave() {
    if (!name.trim()) return
    setIsSaving(true)
    setError(null)
    try {
      const res = await fetch(apiPath(`/api/trips/${tripId}/services/${serviceId}`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          status,
          confirmationNumber: confirmationNumber.trim() || null,
          internalNotes: internalNotes.trim() || null,
          serviceData,
        }),
      })
      if (!res.ok) throw new Error("Error al guardar")
      router.push(`/trips/${tripId}/services/${serviceId}`)
      router.refresh()
    } catch {
      setError("No se pudo guardar el servicio. Intenta de nuevo.")
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    )
  }

  if (error && !service) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center">
        <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-3" />
        <p className="text-slate-600">{error}</p>
        <Button className="mt-4" onClick={() => router.back()}>Volver</Button>
      </div>
    )
  }

  const Icon = service ? (ICONS[service.moduleType.code] || Package) : Package

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Link
        href={`/trips/${tripId}/services/${serviceId}`}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        {service?.name}
      </Link>

      <div className="flex items-center gap-3 mb-8">
        {service && (
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: service.moduleType.colorAccent + "20" }}
          >
            <Icon className="h-5 w-5" style={{ color: service.moduleType.colorAccent }} />
          </div>
        )}
        <div>
          <h1 className="text-xl font-bold text-slate-900">Editar servicio</h1>
          {service && <p className="text-sm text-slate-500">{service.moduleType.name}</p>}
        </div>
      </div>

      <div className="space-y-6">
        {/* Basic info */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-700">Informacion general</h2>

          <div className="space-y-2">
            <Label>Nombre <span className="text-red-500">*</span></Label>
            <Input value={name} onChange={e => setName(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Estado</Label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-1"
              >
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>N de confirmacion</Label>
              <Input
                value={confirmationNumber}
                onChange={e => setConfirmationNumber(e.target.value)}
                className="font-mono"
                placeholder="ABC123"
              />
            </div>
          </div>
        </div>

        {/* Service-specific data */}
        {service && Object.keys(serviceData).length > 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-slate-700">Datos especificos</h2>
            {Object.entries(serviceData).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                <Input
                  value={value || ""}
                  onChange={e => handleDataChange(key, e.target.value)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Internal notes */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-700">Notas internas</h2>
          <Textarea
            value={internalNotes}
            onChange={e => setInternalNotes(e.target.value)}
            placeholder="Notas solo visibles para el agente..."
            rows={3}
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <Button
            onClick={handleSave}
            disabled={isSaving || !name.trim()}
            className="flex-1"
          >
            {isSaving ? (
              <><Loader2 className="h-4 w-4 animate-spin" />Guardando...</>
            ) : (
              <><Check className="h-4 w-4" />Guardar cambios</>
            )}
          </Button>
          <Button variant="outline" onClick={() => router.push(`/trips/${tripId}/services/${serviceId}`)}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  )
}
