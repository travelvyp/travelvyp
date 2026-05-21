"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Search, Plus, Loader2, Plane, Hotel, FerrisWheel, Car, Globe,
  Anchor, Shield, Bus, Ticket, Compass, Package, Copy, Pencil, Trash2,
  ChevronDown, X, Check, AlertTriangle,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { apiPath } from "@/lib/api"

// ─── Types ───────────────────────────────────────────────────────────────────

type ModuleType = { id: string; code: string; name: string; colorAccent: string }

type Template = {
  id: string
  name: string
  provider: string | null
  category: string | null
  location: string | null
  description: string | null
  isSystem: boolean
  agencyId: string | null
  moduleType: ModuleType
  _count: { templateBlocks: number }
}

type FormData = {
  moduleTypeId: string
  name: string
  provider: string
  category: string
  location: string
  description: string
}

const EMPTY_FORM: FormData = {
  moduleTypeId: "",
  name: "",
  provider: "",
  category: "",
  location: "",
  description: "",
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const MODULE_ICONS: Record<string, React.ElementType> = {
  FLIGHT: Plane,
  HOTEL: Hotel,
  THEME_PARK: FerrisWheel,
  CAR_RENTAL: Car,
  CRUISE: Anchor,
  INSURANCE: Shield,
  TRANSFER: Bus,
  TICKET: Ticket,
  EXCURSION: Compass,
  OTHER: Package,
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function TemplateModal({
  open,
  editing,
  modules,
  onClose,
  onSaved,
}: {
  open: boolean
  editing: Template | null
  modules: ModuleType[]
  onClose: () => void
  onSaved: (t: Template) => void
}) {
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setError(null)
      setForm(
        editing
          ? {
              moduleTypeId: editing.moduleType.id,
              name: editing.name,
              provider: editing.provider ?? "",
              category: editing.category ?? "",
              location: editing.location ?? "",
              description: editing.description ?? "",
            }
          : EMPTY_FORM
      )
    }
  }, [open, editing])

  function set(field: keyof FormData, value: string) {
    setForm((p) => ({ ...p, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.moduleTypeId || !form.name.trim()) {
      setError("El modulo y el nombre son requeridos.")
      return
    }
    setSaving(true)
    setError(null)
    try {
      const url = editing
        ? apiPath(`/api/templates/${editing.id}`)
        : apiPath("/api/templates")
      const method = editing ? "PATCH" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleTypeId: form.moduleTypeId,
          name: form.name.trim(),
          provider: form.provider.trim() || null,
          category: form.category.trim() || null,
          location: form.location.trim() || null,
          description: form.description.trim() || null,
        }),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || "Error al guardar")
      }
      const saved: Template = await res.json()
      onSaved(saved)
      onClose()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-900">
            {editing ? "Editar template" : "Nuevo template"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Module select */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Tipo de servicio <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={form.moduleTypeId}
                onChange={(e) => set("moduleTypeId", e.target.value)}
                className="w-full h-9 pl-3 pr-8 rounded-lg border border-slate-200 text-sm bg-white text-slate-900 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seleccionar tipo...</option>
                {modules.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Nombre <span className="text-red-500">*</span>
            </label>
            <Input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Ej: Disney's Grand Floridian Resort"
              className="h-9 text-sm"
              required
            />
          </div>

          {/* Provider + Category — 2 cols */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Proveedor</label>
              <Input
                value={form.provider}
                onChange={(e) => set("provider", e.target.value)}
                placeholder="Ej: Disney, Hertz, LATAM"
                className="h-9 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Categoria</label>
              <Input
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                placeholder="Ej: Deluxe Resort, Car Rental"
                className="h-9 text-sm"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Ubicacion / Destino
            </label>
            <Input
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              placeholder="Ej: Walt Disney World, Orlando FL"
              className="h-9 text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Descripcion</label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Descripcion breve del servicio..."
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" size="sm" disabled={saving}>
              {saving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )}
              {saving ? "Guardando..." : editing ? "Guardar cambios" : "Crear template"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────

function DeleteConfirm({
  template,
  onConfirm,
  onCancel,
  deleting,
}: {
  template: Template
  onConfirm: () => void
  onCancel: () => void
  deleting: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 className="h-5 w-5 text-red-500" />
        </div>
        <h3 className="font-semibold text-slate-900 mb-1">Eliminar template</h3>
        <p className="text-sm text-slate-500 mb-5">
          Se eliminara <span className="font-medium text-slate-700">{template.name}</span>. Esta
          accion no se puede deshacer.
        </p>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="flex-1" onClick={onCancel} disabled={deleting}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="flex-1"
            onClick={onConfirm}
            disabled={deleting}
          >
            {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Eliminar"}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Template Card ────────────────────────────────────────────────────────────

function TemplateCard({
  template,
  onEdit,
  onDuplicate,
  onDelete,
}: {
  template: Template
  onEdit: (t: Template) => void
  onDuplicate: (t: Template) => void
  onDelete: (t: Template) => void
}) {
  const Icon = MODULE_ICONS[template.moduleType.code] ?? Globe
  const color = template.moduleType.colorAccent

  return (
    <div className="group relative bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md hover:border-slate-300 transition-all">
      {/* Color accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl" style={{ backgroundColor: color }} />

      <div className="pl-4 pr-3 py-3.5 flex items-start gap-3">
        {/* Icon */}
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ backgroundColor: color + "18" }}
        >
          <Icon className="h-4.5 w-4.5" style={{ color }} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-0.5">
            <p className="font-semibold text-sm text-slate-900 leading-tight truncate flex-1">
              {template.name}
            </p>
            {template.isSystem && (
              <Badge variant="secondary" className="text-xs px-1.5 py-0 flex-shrink-0 font-normal">
                Sistema
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-400">
            <span className="font-medium" style={{ color }}>
              {template.moduleType.name}
            </span>
            {template.category && (
              <>
                <span className="text-slate-200">·</span>
                <span>{template.category}</span>
              </>
            )}
            {template.provider && (
              <>
                <span className="text-slate-200">·</span>
                <span>{template.provider}</span>
              </>
            )}
            {template.location && (
              <>
                <span className="text-slate-200">·</span>
                <span className="truncate max-w-40">{template.location}</span>
              </>
            )}
            {template._count.templateBlocks > 0 && (
              <>
                <span className="text-slate-200">·</span>
                <span>
                  {template._count.templateBlocks} bloque
                  {template._count.templateBlocks !== 1 ? "s" : ""}
                </span>
              </>
            )}
          </div>

          {template.description && (
            <p className="text-xs text-slate-500 mt-1.5 line-clamp-1">{template.description}</p>
          )}
        </div>

        {/* Actions — visible on hover */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          {!template.isSystem && (
            <button
              onClick={() => onEdit(template)}
              title="Editar"
              className="p-1.5 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            onClick={() => onDuplicate(template)}
            title="Duplicar como mi template"
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
          {!template.isSystem && (
            <button
              onClick={() => onDelete(template)}
              title="Eliminar"
              className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [modules, setModules] = useState<ModuleType[]>([])
  const [search, setSearch] = useState("")
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Template | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }, [])

  async function loadModules() {
    try {
      const res = await fetch(apiPath("/api/modules"))
      if (res.ok) setModules(await res.json())
    } catch {}
  }

  async function loadTemplates(q?: string, moduleTypeId?: string | null) {
    setIsLoading(true)
    setLoadError(null)
    try {
      const params = new URLSearchParams()
      if (q) params.set("q", q)
      if (moduleTypeId) params.set("moduleTypeId", moduleTypeId)
      const res = await fetch(apiPath(`/api/templates?${params}`))
      if (!res.ok) throw new Error("Error al cargar templates")
      setTemplates(await res.json())
    } catch {
      setLoadError("No se pudieron cargar los templates. La base de datos puede estar iniciando.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadModules()
    loadTemplates()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => loadTemplates(search, selectedModule), 300)
    return () => clearTimeout(timer)
  }, [search, selectedModule])

  function handleSaved(saved: Template) {
    setTemplates((prev) => {
      const idx = prev.findIndex((t) => t.id === saved.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = saved
        return next
      }
      return [saved, ...prev]
    })
    showToast(editingTemplate ? "Template actualizado" : "Template creado")
  }

  async function handleDuplicate(template: Template) {
    try {
      const res = await fetch(apiPath(`/api/templates/${template.id}/duplicate`), {
        method: "POST",
      })
      if (!res.ok) throw new Error()
      const copy: Template = await res.json()
      setTemplates((prev) => [copy, ...prev])
      showToast(`"${copy.name}" duplicado como template propio`)
    } catch {
      showToast("Error al duplicar el template")
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch(apiPath(`/api/templates/${deleteTarget.id}`), { method: "DELETE" })
      if (!res.ok) throw new Error()
      setTemplates((prev) => prev.filter((t) => t.id !== deleteTarget.id))
      showToast("Template eliminado")
      setDeleteTarget(null)
    } catch {
      showToast("Error al eliminar el template")
    } finally {
      setDeleting(false)
    }
  }

  // Group templates by module
  const grouped = templates.reduce<Record<string, Template[]>>((acc, t) => {
    const key = t.moduleType.code
    if (!acc[key]) acc[key] = []
    acc[key].push(t)
    return acc
  }, {})

  const myTemplates = templates.filter((t) => !t.isSystem)
  const hasFilters = !!(search || selectedModule)

  return (
    <>
      <div className="p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Templates</h1>
            <p className="text-sm text-slate-500 mt-1">
              Biblioteca de servicios reutilizables para armar itinerarios
            </p>
          </div>
          <Button
            onClick={() => { setEditingTemplate(null); setModalOpen(true) }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Nuevo template
          </Button>
        </div>

        {/* Stats bar */}
        {!isLoading && !loadError && (
          <div className="flex items-center gap-4 mb-6 text-xs text-slate-500">
            <span>{templates.length} template{templates.length !== 1 ? "s" : ""}</span>
            {myTemplates.length > 0 && (
              <>
                <span className="text-slate-200">·</span>
                <span>{myTemplates.length} propio{myTemplates.length !== 1 ? "s" : ""}</span>
              </>
            )}
          </div>
        )}

        {/* Filters */}
        <div className="space-y-3 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar por nombre, proveedor, categoria o destino..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white h-10"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedModule(null)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                selectedModule === null
                  ? "bg-slate-900 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              )}
            >
              Todos
            </button>
            {modules.map((m) => {
              const Icon = MODULE_ICONS[m.code] ?? Globe
              const active = selectedModule === m.id
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedModule(active ? null : m.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                    active ? "text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  )}
                  style={active ? { backgroundColor: m.colorAccent } : undefined}
                >
                  <Icon className="h-3 w-3" />
                  {m.name}
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        {loadError ? (
          <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-xl">
            <p className="text-sm text-slate-500 mb-3">{loadError}</p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => loadTemplates(search, selectedModule)}
            >
              Reintentar
            </Button>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-slate-200 rounded-xl">
            <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-7 w-7 text-slate-300" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-1">
              {hasFilters ? "Sin resultados" : "No hay templates"}
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              {hasFilters
                ? "Proba con otros terminos o cambia el filtro de modulo"
                : "Crea el primer template de tu biblioteca"}
            </p>
            {!hasFilters && (
              <Button
                size="sm"
                onClick={() => { setEditingTemplate(null); setModalOpen(true) }}
              >
                <Plus className="h-3.5 w-3.5" />
                Nuevo template
              </Button>
            )}
          </div>
        ) : hasFilters ? (
          // Flat list when filtering
          <div className="space-y-2">
            {templates.map((t) => (
              <TemplateCard
                key={t.id}
                template={t}
                onEdit={(t) => { setEditingTemplate(t); setModalOpen(true) }}
                onDuplicate={handleDuplicate}
                onDelete={setDeleteTarget}
              />
            ))}
          </div>
        ) : (
          // Grouped by module type
          <div className="space-y-8">
            {Object.entries(grouped).map(([code, group]) => {
              const mod = group[0].moduleType
              const Icon = MODULE_ICONS[code] ?? Globe
              return (
                <div key={code}>
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: mod.colorAccent + "20" }}
                    >
                      <Icon className="h-3.5 w-3.5" style={{ color: mod.colorAccent }} />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-700">{mod.name}</h3>
                    <span className="text-xs text-slate-400 font-normal">({group.length})</span>
                  </div>
                  <div className="space-y-2">
                    {group.map((t) => (
                      <TemplateCard
                        key={t.id}
                        template={t}
                        onEdit={(t) => { setEditingTemplate(t); setModalOpen(true) }}
                        onDuplicate={handleDuplicate}
                        onDelete={setDeleteTarget}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      <TemplateModal
        open={modalOpen}
        editing={editingTemplate}
        modules={modules}
        onClose={() => { setModalOpen(false); setEditingTemplate(null) }}
        onSaved={handleSaved}
      />

      {/* Delete confirm */}
      {deleteTarget && (
        <DeleteConfirm
          template={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          deleting={deleting}
        />
      )}

      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-sm px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="h-3.5 w-3.5 text-green-400 flex-shrink-0" />
          {toastMsg}
        </div>
      )}
    </>
  )
}
