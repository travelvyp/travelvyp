import { View, Text, Page } from "@react-pdf/renderer"
import {
  globalStyles as s,
  COLORS,
  getModuleColor,
  getModuleTint,
  getModuleLabel,
} from "./styles"

type ServiceBlock = {
  id: string
  title: string
  content: string
  contentShort: string | null
  isActive: boolean
  isHighlighted: boolean
  displayMode: "FULL" | "SUMMARY" | "HIDDEN"
  sortOrder: number
  blockDefinition: {
    code: string
    name: string
  }
}

type ServiceData = {
  // FLIGHT
  airline?: string
  flightNumber?: string
  origin?: string
  destination?: string
  departureDate?: string
  departureTime?: string
  arrivalDate?: string
  arrivalTime?: string
  terminal?: string
  cabinClass?: string
  // HOTEL
  hotelName?: string
  checkIn?: string
  checkOut?: string
  roomType?: string
  adults?: number
  children?: number
  mealPlan?: string
  // THEME_PARK
  parkName?: string
  visitDate?: string
  ticketType?: string
  openingHours?: string
  // CAR_RENTAL
  company?: string
  category?: string
  pickupDate?: string
  pickupTime?: string
  dropoffDate?: string
  dropoffTime?: string
  pickupLocation?: string
}

type ServiceSectionProps = {
  agencyName: string
  tripName: string
  serviceName: string
  moduleTypeCode: string
  confirmationNumber: string | null
  status: string
  serviceData: ServiceData
  blocks: ServiceBlock[]
}

function DataChip({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.dataChip}>
      <Text style={s.dataChipLabel}>{label}</Text>
      <Text style={s.dataChipValue}>{value}</Text>
    </View>
  )
}

function renderDataChips(moduleTypeCode: string, data: ServiceData) {
  const chips: Array<{ label: string; value: string }> = []

  if (moduleTypeCode === "FLIGHT") {
    if (data.airline) chips.push({ label: "Aerolínea", value: data.airline })
    if (data.flightNumber) chips.push({ label: "Vuelo", value: data.flightNumber })
    if (data.origin) chips.push({ label: "Origen", value: data.origin })
    if (data.destination) chips.push({ label: "Destino", value: data.destination })
    if (data.departureDate) chips.push({ label: "Salida", value: `${data.departureDate}${data.departureTime ? " " + data.departureTime : ""}` })
    if (data.arrivalDate) chips.push({ label: "Llegada", value: `${data.arrivalDate}${data.arrivalTime ? " " + data.arrivalTime : ""}` })
    if (data.terminal) chips.push({ label: "Terminal", value: data.terminal })
    if (data.cabinClass) chips.push({ label: "Clase", value: data.cabinClass })
  } else if (moduleTypeCode === "HOTEL") {
    if (data.checkIn) chips.push({ label: "Check-in", value: data.checkIn })
    if (data.checkOut) chips.push({ label: "Check-out", value: data.checkOut })
    if (data.roomType) chips.push({ label: "Habitación", value: data.roomType })
    if (data.adults !== undefined) chips.push({ label: "Adultos", value: String(data.adults) })
    if (data.children !== undefined && data.children > 0) chips.push({ label: "Niños", value: String(data.children) })
    if (data.mealPlan) chips.push({ label: "Plan", value: data.mealPlan })
  } else if (moduleTypeCode === "THEME_PARK") {
    if (data.visitDate) chips.push({ label: "Fecha de visita", value: data.visitDate })
    if (data.ticketType) chips.push({ label: "Ticket", value: data.ticketType })
    if (data.openingHours) chips.push({ label: "Horario", value: data.openingHours })
  } else if (moduleTypeCode === "CAR_RENTAL") {
    if (data.company) chips.push({ label: "Empresa", value: data.company })
    if (data.category) chips.push({ label: "Categoría", value: data.category })
    if (data.pickupDate) chips.push({ label: "Retiro", value: `${data.pickupDate}${data.pickupTime ? " " + data.pickupTime : ""}` })
    if (data.dropoffDate) chips.push({ label: "Devolución", value: `${data.dropoffDate}${data.dropoffTime ? " " + data.dropoffTime : ""}` })
    if (data.pickupLocation) chips.push({ label: "Lugar", value: data.pickupLocation })
  }

  return chips
}

function BlockCard({ block, moduleColor }: { block: ServiceBlock; moduleColor: string }) {
  const text = block.displayMode === "SUMMARY" && block.contentShort
    ? block.contentShort
    : block.content

  if (block.isHighlighted) {
    return (
      <View style={[s.blockContainer, { marginBottom: 8 }]}>
        <View style={[s.block, s.blockHighlighted, { borderLeftColor: COLORS.highlightBorder }]}>
          <Text style={s.blockTag}>⭐ Destacado</Text>
          <Text style={[s.blockTitle, s.blockHighlightedTitle]}>{block.title}</Text>
          {text ? <Text style={s.blockContent}>{text}</Text> : null}
        </View>
      </View>
    )
  }

  return (
    <View style={s.blockContainer}>
      <View style={s.block}>
        <Text style={s.blockTitle}>{block.title}</Text>
        {text ? <Text style={s.blockContent}>{text}</Text> : null}
      </View>
    </View>
  )
}

export function ServiceSection({
  agencyName,
  tripName,
  serviceName,
  moduleTypeCode,
  confirmationNumber,
  status,
  serviceData,
  blocks,
}: ServiceSectionProps) {
  const color = getModuleColor(moduleTypeCode)
  const tint = getModuleTint(moduleTypeCode)
  const label = getModuleLabel(moduleTypeCode)
  const chips = renderDataChips(moduleTypeCode, serviceData)

  const activeBlocks = blocks
    .filter(b => b.isActive && b.displayMode !== "HIDDEN")
    .sort((a, b) => {
      if (a.isHighlighted && !b.isHighlighted) return -1
      if (!a.isHighlighted && b.isHighlighted) return 1
      return a.sortOrder - b.sortOrder
    })

  return (
    <Page size="A4" style={s.contentPage}>
      {/* Fixed page header */}
      <View style={s.pageHeader} fixed>
        <Text style={s.pageHeaderLeft}>{agencyName} · {tripName}</Text>
        <Text style={s.pageHeaderRight}>{label}</Text>
      </View>

      {/* Service header */}
      <View style={[s.sectionHeader, { backgroundColor: tint, borderBottomWidth: 1, borderBottomColor: color + "30" }]}>
        <View style={[s.sectionHeaderDot, { backgroundColor: color }]} />
        <View style={{ flex: 1 }}>
          <Text style={[s.sectionModuleTag, { color }]}>{label}</Text>
          <Text style={s.sectionServiceName}>{serviceName}</Text>
          {confirmationNumber && (
            <Text style={s.sectionMeta}>Confirmación: #{confirmationNumber}</Text>
          )}
        </View>
        {status && (
          <View style={{
            backgroundColor: color + "20",
            borderRadius: 12,
            paddingVertical: 4,
            paddingHorizontal: 10,
          }}>
            <Text style={{ fontSize: 8, color, fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 0.8 }}>
              {status === "CONFIRMED" ? "Confirmado" : status === "PENDING" ? "Pendiente" : status}
            </Text>
          </View>
        )}
      </View>

      {/* Data chips */}
      {chips.length > 0 && (
        <View style={s.dataChipsRow}>
          {chips.map((chip, i) => (
            <DataChip key={i} label={chip.label} value={chip.value} />
          ))}
        </View>
      )}

      {/* Divider */}
      <View style={{ height: 1, backgroundColor: COLORS.slate100, marginHorizontal: 40, marginBottom: 16 }} />

      {/* Blocks */}
      {activeBlocks.map(block => (
        <BlockCard key={block.id} block={block} moduleColor={color} />
      ))}

      {activeBlocks.length === 0 && (
        <View style={[s.blockContainer]}>
          <View style={{ padding: 20, alignItems: "center" }}>
            <Text style={{ fontSize: 9, color: COLORS.slate400 }}>Sin información adicional</Text>
          </View>
        </View>
      )}

      {/* Fixed page footer */}
      <View style={s.pageFooter} fixed>
        <Text style={s.footerText}>{tripName}</Text>
        <Text style={s.footerBrand}>{agencyName}</Text>
      </View>
    </Page>
  )
}
