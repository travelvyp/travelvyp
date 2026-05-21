"use client"

import { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  Eye, EyeOff, Star, StarOff, RotateCcw,
  GripVertical, ChevronDown, ChevronUp,
  Edit3, Check, X, AlignLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type BlockData = {
  id: string
  title: string
  content: string
  contentShort: string | null
  isActive: boolean
  isHighlighted: boolean
  isEdited: boolean
  displayMode: "FULL" | "SUMMARY" | "HIDDEN"
  sortOrder: number
  blockDefinition: {
    code: string
    name: string
    icon: string | null
  }
  templateBlockId: string | null
}

type BlockItemProps = {
  block: BlockData
  moduleColor: string
  tripId: string
  serviceId: string
  onUpdate: (blockId: string, data: Partial<BlockData>) => void
}

export function BlockItem({ block, moduleColor, tripId, serviceId, onUpdate }: BlockItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(block.title)
  const [editContent, setEditContent] = useState(block.content)
  const [isSaving, setIsSaving] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  async function patchBlock(data: Record<string, unknown>) {
    const res = await fetch(
      `/api/trips/${tripId}/services/${serviceId}/blocks/${block.id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    )
    if (res.ok) {
      const updated = await res.json()
      onUpdate(block.id, updated)
    }
  }

  async function handleSaveEdit() {
    setIsSaving(true)
    await patchBlock({ title: editTitle, content: editContent })
    setIsEditing(false)
    setIsSaving(false)
  }

  function handleCancelEdit() {
    setEditTitle(block.title)
    setEditContent(block.content)
    setIsEditing(false)
  }

  async function handleRestoreOriginal() {
    if (!block.templateBlockId) return
    setIsSaving(true)
    await patchBlock({ restoreOriginal: true })
    setIsSaving(false)
  }

  const accentColor = block.isHighlighted ? moduleColor : undefined

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        borderLeftColor: block.isHighlighted && block.isActive ? moduleColor : undefined,
        borderLeftWidth: block.isHighlighted && block.isActive ? 4 : undefined,
      }}
      className={cn(
        "group border rounded-xl transition-all",
        isDragging ? "opacity-50 shadow-lg" : "",
        !block.isActive ? "opacity-50 bg-slate-50" : "bg-white",
        block.isHighlighted && block.isActive
          ? "border-l-4 shadow-sm"
          : "border-slate-200"
      )}
    >
      {/* Block header */}
      <div className="flex items-center gap-2 px-4 py-3">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing touch-none flex-shrink-0"
        >
          <GripVertical className="h-4 w-4" />
        </button>

        {/* Title + meta */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-sm font-medium truncate",
                block.isActive ? "text-slate-900" : "text-slate-400 line-through"
              )}
            >
              {block.title}
            </span>
            {block.isEdited && (
              <span className="text-xs text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full font-medium flex-shrink-0">
                editado
              </span>
            )}
            {block.isHighlighted && block.isActive && (
              <span
                className="text-xs px-1.5 py-0.5 rounded-full font-medium flex-shrink-0"
                style={{ color: moduleColor, backgroundColor: moduleColor + "15" }}
              >
                destacado
              </span>
            )}
          </div>
        </div>

        {/* Actions — visible on hover */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Toggle active */}
          <button
            onClick={() => patchBlock({ isActive: !block.isActive })}
            title={block.isActive ? "Ocultar del itinerario" : "Mostrar en itinerario"}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            {block.isActive ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
          </button>

          {/* Toggle highlight */}
          <button
            onClick={() => patchBlock({ isHighlighted: !block.isHighlighted })}
            title={block.isHighlighted ? "Quitar destacado" : "Destacar bloque"}
            className="p-1.5 rounded-md text-slate-400 hover:text-amber-500 hover:bg-amber-50 transition-colors"
          >
            {block.isHighlighted ? <StarOff className="h-3.5 w-3.5" /> : <Star className="h-3.5 w-3.5" />}
          </button>

          {/* Toggle summary mode */}
          <button
            onClick={() => patchBlock({
              displayMode: block.displayMode === "FULL" ? "SUMMARY" : "FULL"
            })}
            title={block.displayMode === "FULL" ? "Resumir" : "Mostrar completo"}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <AlignLeft className="h-3.5 w-3.5" />
          </button>

          {/* Edit */}
          <button
            onClick={() => { setIsEditing(true); setIsExpanded(true) }}
            title="Editar contenido"
            className="p-1.5 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <Edit3 className="h-3.5 w-3.5" />
          </button>

          {/* Restore original */}
          {block.isEdited && block.templateBlockId && (
            <button
              onClick={handleRestoreOriginal}
              title="Restaurar contenido original"
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Expand/collapse */}
          <button
            onClick={() => { setIsExpanded(!isExpanded); if (isEditing) setIsEditing(false) }}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Content — expanded */}
      {isExpanded && block.isActive && (
        <div className="px-4 pb-4 border-t border-slate-100">
          {isEditing ? (
            <div className="space-y-3 pt-3">
              <Input
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                className="font-medium text-sm"
                placeholder="Título del bloque"
              />
              <Textarea
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                rows={6}
                className="text-sm leading-relaxed"
                placeholder="Contenido del bloque..."
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleSaveEdit}
                  disabled={isSaving}
                  className="h-8"
                >
                  <Check className="h-3.5 w-3.5" />
                  Guardar
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCancelEdit}
                  className="h-8"
                >
                  <X className="h-3.5 w-3.5" />
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="pt-3">
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                {block.displayMode === "SUMMARY" && block.contentShort
                  ? block.contentShort
                  : block.content}
              </p>
              {block.displayMode === "SUMMARY" && block.contentShort && (
                <p className="text-xs text-slate-400 mt-2 italic">Vista resumida</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Inactive overlay hint */}
      {!block.isActive && (
        <div className="px-4 pb-3">
          <p className="text-xs text-slate-400 italic">
            Bloque oculto — no aparece en el itinerario del pasajero
          </p>
        </div>
      )}
    </div>
  )
}
