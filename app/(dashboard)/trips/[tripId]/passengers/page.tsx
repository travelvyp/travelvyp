"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Plus, Search, Users, Loader2, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

type Passenger = {
  id: string
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  passengerType: "ADULT" | "CHILD" | "INFANT"
  nationality: string | null
  _count: { tripPassengers: number }
}

type TripPassenger = {
  id: string
  passengerId: string
  role: "LEAD" | "COMPANION" | "CHILD"
  passenger: Passenger
}

const TYPE_LABELS = { ADULT: "Adulto", CHILD: "Niño", INFANT: "Infante" }
const ROLE_LABELS = { LEAD: "Titular", COMPANION: "Acompañante", CHILD: "Niño" }

export default function TripPassengersPage({
  params,
}: {
  params: Promise<{ tripId: string }>
}) {
  const { tripId } = use(params)
  const router = useRouter()

  const [tripPassengers, setTripPassengers] = useState<TripPassenger[]>([])
  const [allPassengers, setAllPassengers] = useState<Passenger[]>([])
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [adding, setAdding] = useState<string | null>(null)
  const [removing, setRemoving] = useState<string | null>(null)

  const addedIds = new Set(tripPassengers.map((tp) => tp.passengerId))

  async function loadData(q?: string) {
    setIsLoading(true)
    const [tpRes, pRes] = await Promise.all([
      fetch(`/api/trips/${tripId}/passengers`),
      fetch(q ? `/api/passengers?q=${encodeURIComponent(q)}` : "/api/passengers"),
    ])
    if (tpRes.ok) setTripPassengers(await tpRes.json())
    if (pRes.ok) setAllPassengers(await pRes.json())
    setIsLoading(false)
  }

  useEffect(() => { loadData() }, [])

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => loadData(search), 300)
      return () => clearTimeout(timer)
    }
  }, [search])

  async function handleAdd(passengerId: string) {
    setAdding(passengerId)
    const isFirst = tripPassengers.length === 0
    const res = await fetch(`/api/trips/${tripId}/passengers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passengerId, role: isFirst ? "LEAD" : "COMPANION" }),
    })
    if (res.ok) {
      const tp = await res.json()
      setTripPassengers((prev) => [...prev, tp])
    }
    setAdding(null)
  }

  async function handleRemove(passengerId: string) {
    setRemoving(passengerId)
    const res = await fetch(
      `/api/trips/${tripId}/passengers?passengerId=${passengerId}`,
      { method: "DELETE" }
    )
    if (res.ok) {
      setTripPassengers((prev) => prev.filter((tp) => tp.passengerId !== passengerId))
    }
    setRemoving(null)
  }

  const filteredPassengers = allPassengers.filter((p) => !addedIds.has(p.id))

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link
        href={`/trips/${tripId}`}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al viaje
      </Link>

      <h1 className="text-2xl font-bold text-slate-900 mb-8">Pasajeros del viaje</h1>

      {/* Current passengers */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          En este viaje ({tripPassengers.length})
        </h2>

        {tripPassengers.length === 0 ? (
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-6 text-center">
            <Users className="h-8 w-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-400">Aún no hay pasajeros en este viaje</p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
            {tripPassengers.map(({ passengerId, role, passenger }) => (
              <div key={passengerId} className="flex items-center gap-3 p-4">
                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-semibold text-xs">
                    {passenger.firstName[0]}{passenger.lastName[0]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">
                    {passenger.firstName} {passenger.lastName}
                  </p>
                  <p className="text-xs text-slate-400">{ROLE_LABELS[role]}</p>
                </div>
                <button
                  onClick={() => handleRemove(passengerId)}
                  disabled={removing === passengerId}
                  className="p-1.5 rounded-md text-slate-300 hover:text-red-400 hover:bg-red-50 transition-colors disabled:opacity-50"
                  title="Quitar del viaje"
                >
                  {removing === passengerId
                    ? <Loader2 className="h-4 w-4 animate-spin" />
                    : <X className="h-4 w-4" />
                  }
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Search & add */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          Agregar pasajeros
        </h2>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar pasajero..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white"
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        ) : filteredPassengers.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl">
            <p className="text-sm text-slate-400 mb-3">
              {search
                ? `Sin resultados para "${search}"`
                : allPassengers.length === 0
                ? "No hay pasajeros registrados todavía"
                : "Todos los pasajeros ya están en el viaje"}
            </p>
            <Button asChild size="sm" variant="outline">
              <Link href="/passengers">
                <Plus className="h-4 w-4" />
                Crear nuevo pasajero
              </Link>
            </Button>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
            {filteredPassengers.map((passenger) => (
              <div key={passenger.id} className="flex items-center gap-3 p-4">
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-slate-500 font-semibold text-xs">
                    {passenger.firstName[0]}{passenger.lastName[0]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">
                    {passenger.firstName} {passenger.lastName}
                  </p>
                  <p className="text-xs text-slate-400">
                    {TYPE_LABELS[passenger.passengerType]}
                    {passenger.email && ` · ${passenger.email}`}
                  </p>
                </div>
                <button
                  onClick={() => handleAdd(passenger.id)}
                  disabled={adding === passenger.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-50"
                >
                  {adding === passenger.id
                    ? <Loader2 className="h-4 w-4 animate-spin" />
                    : <Plus className="h-4 w-4" />
                  }
                  Agregar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
