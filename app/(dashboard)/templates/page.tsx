"use client"

import { useState, useEffect } from "react"
import { Search, BookTemplate, Loader2, Plane, Hotel, FerrisWheel, Car, Globe } from "lucide-react"
import { Input } from "@/components/ui/input"
import { apiPath } from "@/lib/api"
import { Badge } from "@/components/ui/badge"

type Template = {
  id: string
  name: string
  provider: string | null
  location: string | null
  description: string | null
  isSystem: boolean
  moduleType: {
    id: string
    code: string
    name: string
    color: string
  }
  _count: { templateBlocks: number }
}

type ModuleType = {
  id: string
  code: string
  name: string
  color: string
}

const MODULE_ICONS: Record<string, React.ElementType> = {
  FLIGHT: Plane,
  HOTEL: Hotel,
  THEME_PARK: FerrisWheel,
  CAR_RENTAL: Car,
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [modules, setModules] = useState<ModuleType[]>([])
  const [search, setSearch] = useState("")
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  async function loadTemplates(q?: string, moduleTypeId?: string | null) {
    setIsLoading(true)
    const params = new URLSearchParams()
    if (q) params.set("q", q)
    if (moduleTypeId) params.set("moduleTypeId", moduleTypeId)
    const res = await fetch(apiPath(`/api/templates?${params}`))
    if (res.ok) setTemplates(await res.json())
    setIsLoading(false)
  }

  async function loadModules() {
    const res = await fetch(apiPath("/api/modules"))
    if (res.ok) setModules(await res.json())
  }

  useEffect(() => {
    loadModules()
    loadTemplates()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => loadTemplates(search, selectedModule), 300)
    return () => clearTimeout(timer)
  }, [search, selectedModule])

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Templates</h1>
        <p className="text-sm text-slate-500 mt-1">
          Plantillas de servicios reutilizables para armar itinerarios
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-60">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar por nombre, proveedor o destino..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedModule(null)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              selectedModule === null
                ? "bg-slate-900 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            Todos
          </button>
          {modules.map((m) => {
            const Icon = MODULE_ICONS[m.code] ?? Globe
            return (
              <button
                key={m.id}
                onClick={() => setSelectedModule(selectedModule === m.id ? null : m.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedModule === m.id
                    ? "text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
                style={selectedModule === m.id ? { backgroundColor: m.color } : undefined}
              >
                <Icon className="h-3.5 w-3.5" />
                {m.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center py-24 border-2 border-dashed border-slate-200 rounded-xl">
          <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookTemplate className="h-7 w-7 text-slate-300" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            {search || selectedModule ? "Sin resultados" : "No hay templates"}
          </h3>
          <p className="text-sm text-slate-500 max-w-xs mx-auto">
            {search || selectedModule
              ? "Probá con otros términos o filtrá por otro módulo"
              : "Los templates aparecen aquí cuando se cargan desde la base de datos"}
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {templates.map((template) => {
            const Icon = MODULE_ICONS[template.moduleType.code] ?? Globe
            return (
              <div
                key={template.id}
                className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-4 hover:shadow-sm transition-shadow"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: template.moduleType.color + "20" }}
                >
                  <Icon
                    className="h-5 w-5"
                    style={{ color: template.moduleType.color }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-slate-900 truncate">{template.name}</p>
                    {template.isSystem && (
                      <Badge variant="secondary" className="text-xs flex-shrink-0">Sistema</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span
                      className="font-medium"
                      style={{ color: template.moduleType.color }}
                    >
                      {template.moduleType.name}
                    </span>
                    {template.provider && <span>{template.provider}</span>}
                    {template.location && <span>{template.location}</span>}
                    <span>{template._count.templateBlocks} bloque{template._count.templateBlocks !== 1 ? "s" : ""}</span>
                  </div>
                  {template.description && (
                    <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">{template.description}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
