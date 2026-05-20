"use client"

import { useState } from "react"
import { Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

type ExportPdfButtonProps = {
  tripId: string
}

export function ExportPdfButton({ tripId }: ExportPdfButtonProps) {
  const [loading, setLoading] = useState(false)

  async function handleExport() {
    setLoading(true)
    try {
      const res = await fetch(`/api/trips/${tripId}/pdf`)
      if (!res.ok) throw new Error("Error al generar PDF")

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)

      // Get filename from Content-Disposition header
      const disposition = res.headers.get("Content-Disposition")
      const match = disposition?.match(/filename="(.+)"/)
      const filename = match?.[1] || "itinerario.pdf"

      const link = document.createElement("a")
      link.href = url
      link.download = filename
      link.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      alert("No se pudo generar el PDF. Intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button size="sm" onClick={handleExport} disabled={loading}>
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      {loading ? "Generando..." : "Exportar PDF"}
    </Button>
  )
}
