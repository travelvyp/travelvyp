import { Page, View, Text } from "@react-pdf/renderer"
import { globalStyles as s, COLORS } from "./styles"

type CoverPageProps = {
  tripName: string
  destination: string | null
  startDate: Date | null
  endDate: Date | null
  dateNotes: string | null
  passengerCount: number
  agencyName: string
  agentName: string
  generatedAt: Date
}

function formatDateShort(date: Date): string {
  return date.toLocaleDateString("es", { day: "numeric", month: "long", year: "numeric" })
}

function formatDateRange(start: Date | null, end: Date | null, notes: string | null): string {
  if (start && end) {
    const startStr = start.toLocaleDateString("es", { day: "numeric", month: "long" })
    const endStr = end.toLocaleDateString("es", { day: "numeric", month: "long", year: "numeric" })
    return `${startStr} — ${endStr}`
  }
  return notes || "Fechas por confirmar"
}

function nightsCount(start: Date, end: Date): number {
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
}

export function CoverPage({
  tripName,
  destination,
  startDate,
  endDate,
  dateNotes,
  passengerCount,
  agencyName,
  agentName,
  generatedAt,
}: CoverPageProps) {
  const nights = startDate && endDate ? nightsCount(startDate, endDate) : null

  return (
    <Page size="A4" style={s.coverPage}>
      {/* Top bar with agency brand */}
      <View style={s.coverTopBar}>
        <Text style={s.coverLogo}>{agencyName.toUpperCase()}</Text>
        <View style={{ flex: 1 }} />
        <Text style={{ fontSize: 8, color: COLORS.blue50, opacity: 0.7 }}>
          Experiencia de viaje personalizada
        </Text>
      </View>

      {/* Body */}
      <View style={s.coverBody}>
        <Text style={s.coverEyebrow}>Itinerario de viaje</Text>
        <Text style={s.coverTitle}>{tripName}</Text>

        {destination && (
          <Text style={s.coverSubtitle}>{destination}</Text>
        )}

        <View style={s.coverDivider} />

        {/* Meta grid */}
        <View style={s.coverMetaGrid}>
          <View style={s.coverMetaItem}>
            <Text style={s.coverMetaLabel}>Fechas</Text>
            <Text style={s.coverMetaValue}>
              {formatDateRange(startDate, endDate, dateNotes)}
            </Text>
          </View>

          {nights !== null && (
            <View style={s.coverMetaItem}>
              <Text style={s.coverMetaLabel}>Duración</Text>
              <Text style={s.coverMetaValue}>{nights} noches</Text>
            </View>
          )}

          <View style={s.coverMetaItem}>
            <Text style={s.coverMetaLabel}>Pasajeros</Text>
            <Text style={s.coverMetaValue}>
              {passengerCount} {passengerCount === 1 ? "persona" : "personas"}
            </Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={s.coverFooter}>
        <View>
          <Text style={s.coverFooterText}>
            Preparado por {agentName}
          </Text>
          <Text style={{ ...s.coverFooterText, marginTop: 2 }}>
            {formatDateShort(generatedAt)}
          </Text>
        </View>
        <Text style={s.coverFooterBrand}>{agencyName}</Text>
      </View>
    </Page>
  )
}
