import { Page, View, Text } from "@react-pdf/renderer"
import { globalStyles as s, COLORS } from "./styles"

type BackCoverProps = {
  agencyName: string
  agentName: string
  agentEmail: string | null
  agentPhone?: string | null
  tripName: string
}

export function BackCover({
  agencyName,
  agentName,
  agentEmail,
  agentPhone,
  tripName,
}: BackCoverProps) {
  return (
    <Page size="A4" style={s.backCoverPage}>
      {/* Agency name top */}
      <Text style={{
        fontSize: 9,
        color: COLORS.slate600,
        fontFamily: "Helvetica-Bold",
        textTransform: "uppercase",
        letterSpacing: 2,
        marginBottom: 60,
        textAlign: "center",
      }}>
        {agencyName.toUpperCase()}
      </Text>

      {/* Decorative line */}
      <View style={{
        width: 40,
        height: 2,
        backgroundColor: COLORS.blue500,
        marginBottom: 32,
      }} />

      {/* Main message */}
      <Text style={s.backCoverTitle}>¡Buen viaje!</Text>
      <Text style={s.backCoverSubtitle}>
        Que {tripName} sea una experiencia{"\n"}inolvidable para vos y tu familia.
      </Text>

      {/* Agent contact card */}
      <View style={s.backCoverContact}>
        <Text style={s.backCoverContactLabel}>Tu agente de viajes</Text>
        <Text style={s.backCoverContactName}>{agentName}</Text>
        {agentEmail && (
          <Text style={s.backCoverContactDetail}>{agentEmail}</Text>
        )}
        {agentPhone && (
          <Text style={s.backCoverContactDetail}>{agentPhone}</Text>
        )}
        <View style={{
          width: 30,
          height: 1,
          backgroundColor: COLORS.slate700,
          marginTop: 16,
          marginBottom: 12,
        }} />
        <Text style={{
          fontSize: 8,
          color: COLORS.slate600,
          fontFamily: "Helvetica-Bold",
          textTransform: "uppercase",
          letterSpacing: 1,
        }}>
          {agencyName}
        </Text>
      </View>

      {/* Bottom tagline */}
      <Text style={{
        fontSize: 8,
        color: COLORS.slate700,
        marginTop: 60,
        textAlign: "center",
      }}>
        Documento generado con TravelVYP
      </Text>
    </Page>
  )
}
