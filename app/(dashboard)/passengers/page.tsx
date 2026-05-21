"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Users, Loader2, Mail, Phone } from "lucide-react"
import { apiPath } from "@/lib/api"

type Passenger = {
  id: string
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  passengerType: "ADULT" | "CHILD" | "INFANT"
  nationality: string | null
  dateOfBirth: string | null
  _count: { tripPassengers: number }
}

const TYPE_LABELS = { ADULT: "Adulto", CHILD: "Niño", INFANT: "Infante" }
const TYPE_VARIANTS: Record<string, any> = {
  ADULT: "secondary",
  CHILD: "active",
  INFANT: "default",
}

export default function PassengersPage() {
  const [passengers, setPassengers] = useState<Passenger[]>([])
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    passengerType: "ADULT" as "ADULT" | "CHILD" | "INFANT",
    nationality: "",
    dateOfBirth: "",
    passportNumber: "",
    passportExpiry: "",
    notes: "",
  })

  async function loadPassengers(q?: string) {
    setIsLoading(true)
    const url = q ? apiPath(`/api/passengers?q=${encodeURIComponent(q)}`) : apiPath("/api/passengers")
    const res = await fetch(url)
    if (res.ok) setPassengers(await res.json())
    setIsLoading(false)
  }

  useEffect(() => { loadPassengers() }, [])

  useEffect(() => {
    const timer = setTimeout(() => loadPassengers(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  function resetForm() {
    setForm({
      firstName: "", lastName: "", email: "", phone: "",
      passengerType: "ADULT", nationality: "", dateOfBirth: "",
      passportNumber: "", passportExpiry: "", notes: "",
    })
    setFormError(null)
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)
    setFormError(null)

    const res = await fetch(apiPath("/api/passengers"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    if (!res.ok) {
      const data = await res.json()
      const firstError = Object.values(data.error?.fieldErrors ?? {})?.[0] as string[] | undefined
      setFormError(firstError?.[0] ?? "Error al crear el pasajero")
      setIsSaving(false)
      return
    }

    await loadPassengers(search)
    setIsDialogOpen(false)
    resetForm()
    setIsSaving(false)
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pasajeros</h1>
          <p className="text-sm text-slate-500 mt-1">
            {passengers.length > 0
              ? `${passengers.length} pasajero${passengers.length !== 1 ? "s" : ""} registrados`
              : "No hay pasajeros todavía"}
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm() }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" />
              Nuevo pasajero
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Nuevo pasajero</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre <span className="text-red-500">*</span></Label>
                  <Input
                    id="firstName"
                    value={form.firstName}
                    onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
                    required
                    placeholder="Juan"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido <span className="text-red-500">*</span></Label>
                  <Input
                    id="lastName"
                    value={form.lastName}
                    onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
                    required
                    placeholder="García"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select
                  value={form.passengerType}
                  onValueChange={(v) => setForm((p) => ({ ...p, passengerType: v as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADULT">Adulto</SelectItem>
                    <SelectItem value="CHILD">Niño (2-11 años)</SelectItem>
                    <SelectItem value="INFANT">Infante (0-2 años)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    placeholder="juan@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="+54 9 11..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nationality">Nacionalidad</Label>
                  <Input
                    id="nationality"
                    value={form.nationality}
                    onChange={(e) => setForm((p) => ({ ...p, nationality: e.target.value }))}
                    placeholder="Argentina"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Fecha de nacimiento</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={form.dateOfBirth}
                    onChange={(e) => setForm((p) => ({ ...p, dateOfBirth: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="passportNumber">N° de pasaporte</Label>
                  <Input
                    id="passportNumber"
                    value={form.passportNumber}
                    onChange={(e) => setForm((p) => ({ ...p, passportNumber: e.target.value }))}
                    placeholder="AAB123456"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passportExpiry">Vencimiento</Label>
                  <Input
                    id="passportExpiry"
                    type="date"
                    value={form.passportExpiry}
                    onChange={(e) => setForm((p) => ({ ...p, passportExpiry: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  value={form.notes}
                  onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                  placeholder="Preferencias, alergias, necesidades especiales..."
                  rows={2}
                />
              </div>

              {formError && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                  {formError}
                </div>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <><Loader2 className="h-4 w-4 animate-spin" />Guardando...</>
                  ) : (
                    "Crear pasajero"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Buscar por nombre, apellido o email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-white"
        />
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        </div>
      ) : passengers.length === 0 ? (
        <div className="text-center py-24 border-2 border-dashed border-slate-200 rounded-xl">
          <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-7 w-7 text-slate-300" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            {search ? "Sin resultados" : "No hay pasajeros"}
          </h3>
          <p className="text-sm text-slate-500 mb-6 max-w-xs mx-auto">
            {search
              ? `No se encontraron pasajeros para "${search}"`
              : "Los pasajeros son reutilizables entre múltiples viajes."}
          </p>
          {!search && (
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              Crear primer pasajero
            </Button>
          )}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
          {passengers.map((passenger) => (
            <div
              key={passenger.id}
              className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-semibold text-sm">
                  {passenger.firstName[0]}{passenger.lastName[0]}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-slate-900">
                    {passenger.firstName} {passenger.lastName}
                  </p>
                  <Badge variant={TYPE_VARIANTS[passenger.passengerType]} className="text-xs">
                    {TYPE_LABELS[passenger.passengerType]}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  {passenger.email && (
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Mail className="h-3 w-3" />
                      {passenger.email}
                    </span>
                  )}
                  {passenger.phone && (
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Phone className="h-3 w-3" />
                      {passenger.phone}
                    </span>
                  )}
                  {passenger.nationality && (
                    <span className="text-xs text-slate-400">{passenger.nationality}</span>
                  )}
                </div>
              </div>
              <div className="text-xs text-slate-400 flex-shrink-0">
                {passenger._count.tripPassengers} viaje{passenger._count.tripPassengers !== 1 ? "s" : ""}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
