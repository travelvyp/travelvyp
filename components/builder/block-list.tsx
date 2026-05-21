"use client"

import { useState, useCallback } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { BlockItem } from "./block-item"
import { apiPath } from "@/lib/api"

type Block = {
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

type BlockListProps = {
  initialBlocks: Block[]
  moduleColor: string
  tripId: string
  serviceId: string
}

export function BlockList({ initialBlocks, moduleColor, tripId, serviceId }: BlockListProps) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleUpdate(blockId: string, data: Partial<Block>) {
    setBlocks(prev =>
      prev.map(b => (b.id === blockId ? { ...b, ...data } : b))
    )
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = blocks.findIndex(b => b.id === active.id)
    const newIndex = blocks.findIndex(b => b.id === over.id)
    const reordered = arrayMove(blocks, oldIndex, newIndex)

    // Optimistic update
    setBlocks(reordered)

    // Persist new sortOrders in batch
    await Promise.all(
      reordered.map((block, index) =>
        fetch(apiPath(`/api/trips/${tripId}/services/${serviceId}/blocks/${block.id}`), {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sortOrder: index }),
        })
      )
    )
  }

  const activeBlocks = blocks.filter(b => b.isActive)
  const inactiveBlocks = blocks.filter(b => !b.isActive)

  return (
    <div className="space-y-6">
      {/* Active blocks */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700">
            Bloques activos
            <span className="text-slate-400 font-normal ml-1.5">({activeBlocks.length})</span>
          </h3>
          <p className="text-xs text-slate-400">Arrastrá para reordenar</p>
        </div>

        {activeBlocks.length === 0 ? (
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center">
            <p className="text-sm text-slate-400">Todos los bloques están ocultos</p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={activeBlocks.map(b => b.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {activeBlocks.map(block => (
                  <BlockItem
                    key={block.id}
                    block={block}
                    moduleColor={moduleColor}
                    tripId={tripId}
                    serviceId={serviceId}
                    onUpdate={handleUpdate}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Inactive blocks */}
      {inactiveBlocks.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-400">
            Ocultos del itinerario
            <span className="font-normal ml-1.5">({inactiveBlocks.length})</span>
          </h3>
          <div className="space-y-2">
            {inactiveBlocks.map(block => (
              <BlockItem
                key={block.id}
                block={block}
                moduleColor={moduleColor}
                tripId={tripId}
                serviceId={serviceId}
                onUpdate={handleUpdate}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
