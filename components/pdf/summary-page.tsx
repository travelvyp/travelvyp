import { Page, View, Text } from "@react-pdf/renderer"
import { globalStyles as s, COLORS, getModuleColor, getModuleLabel } from "./styles"

type Passenger = {
  firstName: string
  lastName: string
  passengerType: string
}

type ServiceSummary = {
  id: string
  name: string
  moduleTypeCode: string
  confirmationNumber: string | null
  status: string
}

type SummaryPageProps = {
  tripName: string
  destination: string | null
  agencyName: string
  agentName: string
  agentEmail: string | null
  passengers: Passenger[]
  services: ServiceSummary[]
}

const PASSENGER_TYPE_LABELS: Record<string, string> = {
  ADULT: "Adulto",
  CHILD: "Niño",
  INFANT: "Infante",
}

export function SummaryPage({
  tripName,
  destination,
  agencyName,
  agentName,
  agentEmail,
  passengers,
  services,
}: SummaryPageProps) {
  return (
    <Page size="A4" style={s.contentPage}>
      {/* Page header */}
      <View style={s.pageHeader} fixed>
        <Text style={s.pageHeaderLeft}>{agencyName} · {tripName}</Text>
        <Text style={s.pageHeaderRight}>Resumen del viaje</Text>
      </View>

      <View style={s.body}>
        {/* Title */}
        <Text style={s.summaryTitle}>Resumen del viaje</Text>
        {destination && (
          <Text style={s.summarySubtitle}>{destination}</Text>
        )}

        {/* Services list */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{
            fontSize: 8,
            fontFamily: "Helvetica-Bold",
            color: COLORS.slate500,
            textTransform: "uppercase",
            letterSpacing: 1.5,
            marginBottom: 10,
          }}>
            Servicios incluidos
          </Text>

          {services.map((service, index) => {
            const color = getModuleColor(service.moduleTypeCode)
            return (
              <View
                key={service.id}
                style={[
                  s.summaryRow,
                  index % 2 === 0 ? s.summaryRowEven : s.summaryRowOdd,
                ]}
              >
                {/* Color dot */}
                <View style={[s.summaryDot, { backgroundColor: color }]} />

                {/* Name */}
                <Text style={s.summaryServiceName}>{service.name}</Text>

                {/* Module type */}
                <Text style={s.summaryServiceType}>
                  {getModuleLabel(service.moduleTypeCode)}
                </Text>

                {/* Confirmation */}
                {service.confirmationNumber ? (
                  <Text style={s.summaryConfirmation}>
                    #{service.confirmationNumber}
                  </Text>
                ) : (
                  <Text style={{ ...s.summaryConfirmation, color: COLORS.slate300 }}>
                    Pendiente
                  </Text>
                )}
              </View>
            )
          })}
        </View>

        {/* Passengers */}
        {passengers.length > 0 && (
          <View>
            <Text style={{
              fontSize: 8,
              fontFamily: "Helvetica-Bold",
              color: COLORS.slate500,
              textTransform: "uppercase",
              letterSpacing: 1.5,
              marginBottom: 10,
            }}>
              Pasajeros ({passengers.length})
            </Text>
            <View style={s.passengerBox}>
              {passengers.map((p, i) => (
                <View key={i} style={s.passengerChip}>
                  <Text style={s.passengerChipText}>
                    {p.firstName} {p.lastName}
                  </Text>
                  <Text style={s.passengerChipType}>
                    · {PASSENGER_TYPE_LABELS[p.passengerType] || p.passengerType}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Agent contact */}
        <View style={{
          marginTop: 28,
          padding: 16,
          backgroundColor: COLORS.slate50,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: COLORS.slate200,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <View>
            <Text style={{
              fontSize: 8,
              color: COLORS.slate400,
              fontFamily: "Helvetica-Bold",
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 4,
            }}>
              Tu agente de viajes
            </Text>
            <Text style={{
              fontSize: 12,
              fontFamily: "Helvetica-Bold",
              color: COLORS.slate900,
              marginBottom: 2,
            }}>
              {agentName}
            </Text>
            {agentEmail && (
              <Text style={{ fontSize: 9, color: COLORS.slate500 }}>{agentEmail}</Text>
            )}
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={{
              fontSize: 9,
              color: COLORS.slate400,
              marginBottom: 2,
            }}>
              {agencyName}
            </Text>
          </View>
        </View>
      </View>

      {/* Page footer */}
      <View style={s.pageFooter} fixed>
        <Text style={s.footerText}>{tripName}</Text>
        <Text style={s.footerBrand}>{agencyName}</Text>
      </View>
    </Page>
  )
}
