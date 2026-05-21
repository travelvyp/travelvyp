"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Plane, Hotel, FerrisWheel, Car,
  Search, ChevronRight, ChevronLeft,
  Loader2, Check, Layers, MapPin
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type ModuleType = {
  id: string
  code: string
  name: string
  icon: string
  colorAccent: string
}

type ServiceTemplate = {
  id: string
  name: string
  provider: string | null
  category: string | null
  location: string | null
  moduleType: ModuleType
  _count: { templateBlocks: number }
}

// ─────────────────────────────────────────────
// Module icons mapping
// ─────────────────────────────────────────────
const ICONS: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  FLIGHT: Plane,
  HOTEL: Hotel,
  THEME_PARK: FerrisWheel,
  CAR_RENTAL: Car,
}

// ─────────────────────────────────────────────
// Service data fields por módulo
// ─────────────────────────────────────────────
function ServiceDataFields({
  moduleCode,
  data,
  onChange,
}: {
  moduleCode: string
  data: Record<string, string>
  onChange: (key: string, value: string) => void
}) {
  if (moduleCode === "FLIGHT") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Aerolínea</Label>
            <Input placeholder="American Airlines" value={data.airline || ""} onChange={e => onChange("airline", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>N° de vuelo</Label>
            <Input placeholder="AA1234" value={data.flightNumber || ""} onChange={e => onChange("flightNumber", e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Origen</Label>
            <Input placeholder="MIA" value={data.origin || ""} onChange={e => onChange("origin", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Destino</Label>
            <Input placeholder="MCO" value={data.destination || ""} onChange={e => onChange("destination", e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Salida</Label>
            <Input type="datetime-local" value={data.departureDateTime || ""} onChange={e => onChange("departureDateTime", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Llegada</Label>
            <Input type="datetime-local" value={data.arrivalDateTime || ""} onChange={e => onChange("arrivalDateTime", e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Terminal</Label>
            <Input placeholder="Terminal D" value={data.terminal || ""} onChange={e => onChange("terminal", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Clase</Label>
            <Input placeholder="Economy" value={data.seatClass || ""} onChange={e => onChange("seatClass", e.target.value)} />
          </div>
        </div>
      </div>
    )
  }

  if (moduleCode === "HOTEL") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Check-in</Label>
            <Input type="date" value={data.checkinDate || ""} onChange={e => onChange("checkinDate", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Check-out</Label>
            <Input type="date" value={data.checkoutDate || ""} onChange={e => onChange("checkoutDate", e.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Tipo de habitación</Label>
          <Input placeholder="Garden View Room" value={data.roomType || ""} onChange={e => onChange("roomType", e.target.value)} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Adultos</Label>
            <Input type="number" min="1" placeholder="2" value={data.adults || ""} onChange={e => onChange("adults", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Niños</Label>
            <Input type="number" min="0" placeholder="0" value={data.children || ""} onChange={e => onChange("children", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Régimen</Label>
            <Input placeholder="Room only" value={data.mealPlan || ""} onChange={e => onChange("mealPlan", e.target.value)} />
          </div>
        </div>
      </div>
    )
  }

  if (moduleCode === "THEME_PARK") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Fecha de visita</Label>
            <Input type="date" value={data.visitDate || ""} onChange={e => onChange("visitDate", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Tipo de ticket</Label>
            <Input placeholder="1-Day Park Ticket" value={data.ticketType || ""} onChange={e => onChange("ticketType", e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Apertura</Label>
            <Input type="time" value={data.parkHoursOpen || ""} onChange={e => onChange("parkHoursOpen", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Cierre</Label>
            <Input type="time" value={data.parkHoursClose || ""} onChange={e => onChange("parkHoursClose", e.target.value)} />
          </div>
        </div>
      </div>
    )
  }

  if (moduleCode === "CAR_RENTAL") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Empresa</Label>
            <Input placeholder="Hertz" value={data.company || ""} onChange={e => onChange("company", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Categoría</Label>
            <Input placeholder="Economy SUV" value={data.category || ""} onChange={e => onChange("category", e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Pickup</Label>
            <Input type="date" value={data.pickupDate || ""} onChange={e => onChange("pickupDate", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Dropoff</Label>
            <Input type="date" value={data.dropoffDate || ""} onChange={e => onChange("dropoffDate", e.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Lugar de pickup</Label>
          <Input placeholder="Aeropuerto Orlando MCO" value={data.pickupLocation || ""} onChange={e => onChange("pickupLocation", e.target.value)} />
        </div>
      </div>
    )
  }

  return null
}

// ─────────────────────────────────────────────
// Main wizard component
// ─────────────────────────────────────────────
export function AddServiceWizard({ tripId }: { tripId: string }) {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Data
  const [modules, setModules] = useState<ModuleType[]>([])
  const [templates, setTemplates] = useState<ServiceTemplate[]>([])
  const [templateSearch, setTemplateSearch] = useState("")

  // Selections
  const [selectedModule, setSelectedModule] = useState<ModuleType | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<ServiceTemplate | null>(null)
  const [skipTemplate, setSkipTemplate] = useState(false)

  // Form
  const [serviceName, setServiceName] = useState("")
  const [confirmationNumber, setConfirmationNumber] = useState("")
  const [internalNotes, setInternalNotes] = useState("")
  const [serviceData, setServiceData] = useState<Record<string, string>>({})

  // Load modules
  useEffect(() => {
    fetch("/api/modules").then(r => r.json()).then(setModules)
  }, [])

  // Load templates when module selected
  useEffect(() => {
    if (!selectedModule) return
    const url = templateSearch
      ? `/api/templates?moduleTypeId=${selectedModule.id}&q=${encodeURIComponent(templateSearch)}`
      : `/api/templates?moduleTypeId=${selectedModule.id}`
    fetch(url).then(r => r.json()).then(setTemplates)
  }, [selectedModule, templateSearch])

  // Auto-fill name from template
  useEffect(() => {
    if (selectedTemplate && !serviceName) {
      setServiceName(selectedTemplate.name)
    }
  }, [selectedTemplate])

  function handleServiceDataChange(key: string, value: string) {
    setServiceData(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit() {
    if (!selectedModule || !serviceName.trim()) return
    setIsSubmitting(true)
    setError(null)

    const payload = {
      moduleTypeId: selectedModule.id,
      templateId: selectedTemplate?.id || null,
      name: serviceName,
      confirmationNumber: confirmationNumber || undefined,
      serviceData,
      internalNotes: internalNotes || undefined,
    }

    const res = await fetch(`/api/trips/${tripId}/services`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      setError("Error al crear el servicio. Intentá de nuevo.")
      setIsSubmitting(false)
      return
    }

    const service = await res.json()
    router.push(`/dashboard/trips/${tripId}/services/${service.id}`)
    router.refresh()
  }

  // ── STEP 1: Select module
  if (step === 1) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">¿Qué tipo de servicio?</h2>
          <p className="text-sm text-slate-500 mt-1">Seleccioná el módulo para este servicio</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {modules.map((mod) => {
            const Icon = ICONS[mod.code] || Plane
            return (
              <button
                key={mod.id}
                onClick={() => { setSelectedModule(mod); setStep(2) }}
                className="flex items-center gap-3 p-4 bg-white border-2 border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-sm transition-all text-left group"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: mod.colorAccent + "20" }}
                >
                  <Icon className="h-5 w-5" style={{ color: mod.colorAccent }} />
                </div>
                <div>
                  <p className="font-medium text-slate-900 text-sm">{mod.name}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300 ml-auto group-hover:text-slate-500 transition-colors" />
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // ── STEP 2: Select template
  if (step === 2 && selectedModule) {
    const Icon = ICONS[selectedModule.code] || Plane
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setStep(1)} className="text-slate-400 hover:text-slate-700 transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Seleccionar template</h2>
            <p className="text-sm text-slate-500">
              Elige un proveedor para cargar los bloques automáticamente
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar por nombre o proveedor..."
            value={templateSearch}
            onChange={e => setTemplateSearch(e.target.value)}
            className="pl-9 bg-white"
          />
        </div>

        {/* Templates list */}
        <div className="space-y-2 max-h-72 overflow-y-auto builder-scroll pr-1">
          {templates.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => { setSelectedTemplate(tmpl); setSkipTemplate(false); setStep(3) }}
              className={cn(
                "w-full flex items-center gap-3 p-3 bg-white border-2 rounded-xl text-left transition-all",
                selectedTemplate?.id === tmpl.id
                  ? "border-blue-400 bg-blue-50"
                  : "border-slate-200 hover:border-slate-300"
              )}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: selectedModule.colorAccent + "20" }}
              >
                <Icon className="h-4 w-4" style={{ color: selectedModule.colorAccent }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 text-sm truncate">{tmpl.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  {tmpl.provider && <span className="text-xs text-slate-400">{tmpl.provider}</span>}
                  {tmpl.location && (
                    <span className="flex items-center gap-0.5 text-xs text-slate-400">
                      <MapPin className="h-3 w-3" />{tmpl.location}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-400 flex-shrink-0">
                <Layers className="h-3.5 w-3.5" />
                {tmpl._count.templateBlocks}
              </div>
            </button>
          ))}
        </div>

        {/* Skip template */}
        <button
          onClick={() => { setSelectedTemplate(null); setSkipTemplate(true); setStep(3) }}
          className="w-full text-center text-sm text-slate-400 hover:text-slate-600 transition-colors py-2"
        >
          Continuar sin template →
        </button>
      </div>
    )
  }

  // ── STEP 3: Service data form
  if (step === 3 && selectedModule) {
    const Icon = ICONS[selectedModule.code] || Plane
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setStep(2)} className="text-slate-400 hover:text-slate-700 transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Datos del servicio</h2>
            {selectedTemplate ? (
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-4 h-4 rounded flex items-center justify-center" style={{ backgroundColor: selectedModule.colorAccent + "30" }}>
                  <Icon className="h-2.5 w-2.5" style={{ color: selectedModule.colorAccent }} />
                </div>
                <p className="text-sm text-slate-500">{selectedTemplate.name}</p>
                <span className="text-xs text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full font-medium">
                  {selectedTemplate._count.templateBlocks} bloques
                </span>
              </div>
            ) : (
              <p className="text-sm text-slate-500">{selectedModule.name} — sin template</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {/* Nombre */}
          <div className="space-y-2">
            <Label>Nombre del servicio <span className="text-red-500">*</span></Label>
            <Input
              placeholder={`Ej: ${selectedTemplate?.name || selectedModule.name}`}
              value={serviceName}
              onChange={e => setServiceName(e.target.value)}
              className="bg-white"
            />
          </div>

          {/* N° de confirmación */}
          <div className="space-y-2">
            <Label>N° de confirmación</Label>
            <Input
              placeholder="ABC123..."
              value={confirmationNumber}
              onChange={e => setConfirmationNumber(e.target.value)}
              className="bg-white font-mono"
            />
          </div>

          {/* Campos por módulo */}
          <ServiceDataFields
            moduleCode={selectedModule.code}
            data={serviceData}
            onChange={handleServiceDataChange}
          />

          {/* Notas internas */}
          <div className="space-y-2">
            <Label>Notas internas <span className="text-xs font-normal text-slate-400">(solo para el agente)</span></Label>
            <Textarea
              placeholder="Notas o recordatorios internos..."
              value={internalNotes}
              onChange={e => setInternalNotes(e.target.value)}
              rows={2}
            />
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !serviceName.trim()}
            className="flex-1"
          >
            {isSubmitting ? (
              <><Loader2 className="h-4 w-4 animate-spin" />Creando...</>
            ) : (
              <><Check className="h-4 w-4" />Crear servicio</>
            )}
          </Button>
          <Button variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
        </div>
      </div>
    )
  }

  return null
}
