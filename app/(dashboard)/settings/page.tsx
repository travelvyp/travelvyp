"use client"

import { useState, useEffect } from "react"
import { Save, User, Building2, Shield, CheckCircle2 } from "lucide-react"
import { apiPath } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type SettingsData = {
  id: string
  fullName: string
  email: string
  role: string
  agency: {
    id: string
    name: string
    slug: string
    plan: string
  }
}

const PLAN_LABELS: Record<string, string> = {
  FREE: "Free",
  STARTER: "Starter",
  PRO: "Pro",
  ENTERPRISE: "Enterprise",
}

export default function SettingsPage() {
  const [data, setData] = useState<SettingsData | null>(null)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [agencyName, setAgencyName] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(apiPath("/api/settings"))
      .then((r) => r.json())
      .then((d) => {
        setData(d)
        setFullName(d.fullName)
        setEmail(d.email)
        setAgencyName(d.agency.name)
        setLoading(false)
      })
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSaved(false)

    const res = await fetch(apiPath("/api/settings"), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, agencyName }),
    })

    const json = await res.json()

    if (!res.ok) {
      setError(json.error || "Error al guardar")
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }

    setSaving(false)
  }

  if (loading) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 rounded w-32"></div>
          <div className="h-4 bg-slate-100 rounded w-64"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Configuración</h1>
        <p className="text-sm text-slate-500 mt-1">
          Esta información aparece en los PDFs que generás para tus clientes.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Agencia */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="h-4 w-4 text-slate-400" />
            <h2 className="font-semibold text-slate-900">Agencia</h2>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="agencyName">Nombre de la agencia</Label>
            <Input
              id="agencyName"
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
              placeholder="Ej: TravelVYP"
            />
            <p className="text-xs text-slate-400">
              Aparece en el encabezado y pie de página del PDF.
            </p>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div>
              <p className="text-xs text-slate-400">Plan actual</p>
              <p className="text-sm font-semibold text-slate-700">
                {PLAN_LABELS[data?.agency.plan || "FREE"]}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Slug</p>
              <p className="text-sm font-mono text-slate-500">{data?.agency.slug}</p>
            </div>
          </div>
        </div>

        {/* Agente */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <User className="h-4 w-4 text-slate-400" />
            <h2 className="font-semibold text-slate-900">Tu perfil</h2>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="fullName">Nombre completo</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ej: Pablo Tocci"
            />
            <p className="text-xs text-slate-400">
              Aparece como "Preparado por" en la portada y en el contacto del PDF.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email de contacto</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ej: pablo@travelvyp.com"
            />
            <p className="text-xs text-slate-400">
              Se muestra en la sección de contacto del agente en el PDF.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Shield className="h-3.5 w-3.5 text-slate-300" />
            <p className="text-xs text-slate-400">
              Rol: <span className="font-medium text-slate-600">{data?.role === "ADMIN" ? "Administrador" : data?.role === "AGENT" ? "Agente" : data?.role}</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          {saved && (
            <div className="flex items-center gap-1.5 text-green-600 text-sm">
              <CheckCircle2 className="h-4 w-4" />
              Guardado correctamente
            </div>
          )}
          {!error && !saved && <div />}

          <Button type="submit" disabled={saving}>
            <Save className="h-4 w-4" />
            {saving ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </form>
    </div>
  )
}
