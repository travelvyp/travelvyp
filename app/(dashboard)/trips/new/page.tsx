"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Loader2, Plane } from "lucide-react"

export default function NewTripPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: "",
    destination: "",
    startDate: "",
    endDate: "",
    dateFlexibility: "FIXED" as "FIXED" | "FLEXIBLE" | "TBD",
    dateNotes: "",
    internalNotes: "",
  })

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const payload = {
      name: form.name,
      destination: form.destination || undefined,
      startDate: form.startDate || null,
      endDate: form.endDate || null,
      dateFlexibility: form.dateFlexibility,
      dateNotes: form.dateNotes || undefined,
      internalNotes: form.internalNotes || undefined,
    }

    const res = await fetch("/api/trips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error?.fieldErrors?.name?.[0] || "Error al crear el viaje")
      setIsLoading(false)
      return
    }

    const trip = await res.json()
    router.push(`/dashboard/trips/${trip.id}`)
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      {/* Back */}
      <Link
        href="/dashboard/trips"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a Mis Viajes
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
          <Plane className="h-5 w-5 text-blue-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Nuevo viaje</h1>
          <p className="text-sm text-slate-500">Completá los datos básicos para comenzar</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nombre */}
        <div className="space-y-2">
          <Label htmlFor="name">
            Nombre del viaje <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            placeholder="Ej: Familia García — Orlando Junio 2024"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
            className="h-10"
          />
          <p className="text-xs text-slate-400">
            Un nombre claro y descriptivo. Puede incluir el apellido del pasajero y el destino.
          </p>
        </div>

        {/* Destino */}
        <div className="space-y-2">
          <Label htmlFor="destination">Destino</Label>
          <Input
            id="destination"
            placeholder="Ej: Orlando, Florida, USA"
            value={form.destination}
            onChange={(e) => handleChange("destination", e.target.value)}
            className="h-10"
          />
        </div>

        {/* Flexibilidad de fechas */}
        <div className="space-y-2">
          <Label>Tipo de fechas</Label>
          <Select
            value={form.dateFlexibility}
            onValueChange={(v) => handleChange("dateFlexibility", v)}
          >
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FIXED">Fechas fijas</SelectItem>
              <SelectItem value="FLEXIBLE">Fechas flexibles</SelectItem>
              <SelectItem value="TBD">Por definir</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Fechas */}
        {form.dateFlexibility === "FIXED" && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Fecha de inicio</Label>
              <Input
                id="startDate"
                type="date"
                value={form.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Fecha de fin</Label>
              <Input
                id="endDate"
                type="date"
                value={form.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
                className="h-10"
              />
            </div>
          </div>
        )}

        {form.dateFlexibility !== "FIXED" && (
          <div className="space-y-2">
            <Label htmlFor="dateNotes">Nota sobre fechas</Label>
            <Input
              id="dateNotes"
              placeholder='Ej: "Semana del 10 al 18 de junio aprox."'
              value={form.dateNotes}
              onChange={(e) => handleChange("dateNotes", e.target.value)}
              className="h-10"
            />
          </div>
        )}

        {/* Notas internas */}
        <div className="space-y-2">
          <Label htmlFor="internalNotes">
            Notas internas{" "}
            <span className="font-normal text-slate-400">(solo visible para el agente)</span>
          </Label>
          <Textarea
            id="internalNotes"
            placeholder="Notas, recordatorios o información interna del viaje..."
            value={form.internalNotes}
            onChange={(e) => handleChange("internalNotes", e.target.value)}
            rows={3}
          />
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" disabled={isLoading} className="min-w-32">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creando...
              </>
            ) : (
              "Crear viaje"
            )}
          </Button>
          <Button type="button" variant="ghost" asChild>
            <Link href="/dashboard/trips">Cancelar</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
