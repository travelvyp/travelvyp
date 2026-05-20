import { Document } from "@react-pdf/renderer"
import { CoverPage } from "./cover-page"
import { SummaryPage } from "./summary-page"
import { ServiceSection } from "./service-section"
import { BackCover } from "./back-cover"

type Passenger = {
  firstName: string
  lastName: string
  passengerType: string
}

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

type TripService = {
  id: string
  name: string
  moduleTypeCode: string
  confirmationNumber: string | null
  status: string
  sortOrder: number
  serviceData: Record<string, unknown>
  blocks: ServiceBlock[]
}

type ItineraryDocumentProps = {
  tripName: string
  destination: string | null
  startDate: Date | null
  endDate: Date | null
  dateNotes: string | null
  agencyName: string
  agentName: string
  agentEmail: string | null
  agentPhone?: string | null
  passengers: Passenger[]
  services: TripService[]
  generatedAt: Date
  options?: {
    includeCover?: boolean
    includeSummary?: boolean
    includeBackCover?: boolean
  }
}

export function ItineraryDocument({
  tripName,
  destination,
  startDate,
  endDate,
  dateNotes,
  agencyName,
  agentName,
  agentEmail,
  agentPhone,
  passengers,
  services,
  generatedAt,
  options = {},
}: ItineraryDocumentProps) {
  const {
    includeCover = true,
    includeSummary = true,
    includeBackCover = true,
  } = options

  const sortedServices = [...services].sort((a, b) => a.sortOrder - b.sortOrder)

  const summaryServices = sortedServices.map(s => ({
    id: s.id,
    name: s.name,
    moduleTypeCode: s.moduleTypeCode,
    confirmationNumber: s.confirmationNumber,
    status: s.status,
  }))

  return (
    <Document
      title={tripName}
      author={agentName}
      subject={`Itinerario de viaje — ${destination || tripName}`}
      creator="TravelVYP"
    >
      {includeCover && (
        <CoverPage
          tripName={tripName}
          destination={destination}
          startDate={startDate}
          endDate={endDate}
          dateNotes={dateNotes}
          passengerCount={passengers.length}
          agencyName={agencyName}
          agentName={agentName}
          generatedAt={generatedAt}
        />
      )}

      {includeSummary && (
        <SummaryPage
          tripName={tripName}
          destination={destination}
          agencyName={agencyName}
          agentName={agentName}
          agentEmail={agentEmail}
          passengers={passengers}
          services={summaryServices}
        />
      )}

      {sortedServices.map(service => (
        <ServiceSection
          key={service.id}
          agencyName={agencyName}
          tripName={tripName}
          serviceName={service.name}
          moduleTypeCode={service.moduleTypeCode}
          confirmationNumber={service.confirmationNumber}
          status={service.status}
          serviceData={service.serviceData as Record<string, string | number>}
          blocks={service.blocks}
        />
      ))}

      {includeBackCover && (
        <BackCover
          agencyName={agencyName}
          agentName={agentName}
          agentEmail={agentEmail}
          agentPhone={agentPhone}
          tripName={tripName}
        />
      )}
    </Document>
  )
}
