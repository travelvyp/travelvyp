// =============================================================================
// TravelVYP — Tipos globales del sistema
// =============================================================================

import type {
  Agency,
  User,
  ModuleType,
  ServiceTemplate,
  BlockDefinition,
  TemplateBlock,
  Passenger,
  Trip,
  TripPassenger,
  TripService,
  ServiceBlock,
  Itinerary,
  AgencyPlan,
  UserRole,
  PassengerType,
  TripStatus,
  DateFlexibility,
  ServiceStatus,
  DisplayMode,
  ItineraryTheme,
} from "@prisma/client";

// Re-export Prisma types
export type {
  Agency,
  User,
  ModuleType,
  ServiceTemplate,
  BlockDefinition,
  TemplateBlock,
  Passenger,
  Trip,
  TripPassenger,
  TripService,
  ServiceBlock,
  Itinerary,
  AgencyPlan,
  UserRole,
  PassengerType,
  TripStatus,
  DateFlexibility,
  ServiceStatus,
  DisplayMode,
  ItineraryTheme,
};

// =============================================================================
// Tipos extendidos para uso en la UI
// =============================================================================

export type TripWithRelations = Trip & {
  createdBy: User;
  tripPassengers: (TripPassenger & { passenger: Passenger })[];
  tripServices: (TripService & {
    moduleType: ModuleType;
    template: ServiceTemplate | null;
    serviceBlocks: ServiceBlock[];
  })[];
  itineraries: Itinerary[];
};

export type TripServiceWithBlocks = TripService & {
  moduleType: ModuleType;
  template: ServiceTemplate | null;
  serviceBlocks: (ServiceBlock & {
    blockDefinition: BlockDefinition;
  })[];
};

export type PassengerWithTrips = Passenger & {
  tripPassengers: (TripPassenger & { trip: Trip })[];
};

// =============================================================================
// Tipos del Builder System (Task 4)
// =============================================================================

export type BlockState = {
  id: string;
  title: string;
  content: string;
  contentShort: string | null;
  isActive: boolean;
  isHighlighted: boolean;
  isEdited: boolean;
  displayMode: DisplayMode;
  sortOrder: number;
  blockDefinitionCode: string;
  icon: string | null;
};

export type ServiceState = {
  id: string;
  name: string;
  moduleTypeCode: string;
  moduleTypeColor: string;
  moduleTypeIcon: string;
  status: ServiceStatus;
  confirmationNumber: string | null;
  sortOrder: number;
  serviceData: Record<string, unknown>;
  blocks: BlockState[];
};

// =============================================================================
// Tipos para serviceData por módulo (jsonb)
// =============================================================================

export type FlightServiceData = {
  airline?: string;
  flightNumber?: string;
  origin?: string;
  destination?: string;
  departureDateTime?: string;
  arrivalDateTime?: string;
  terminal?: string;
  seatClass?: "economy" | "premium_economy" | "business" | "first";
  baggageIncluded?: boolean;
  baggagePieces?: number;
  layovers?: Array<{ airport: string; duration: string }>;
};

export type HotelServiceData = {
  checkinDate?: string;
  checkoutDate?: string;
  roomType?: string;
  mealPlan?: "room_only" | "breakfast" | "half_board" | "full_board" | "all_inclusive";
  adults?: number;
  children?: number;
  bedConfiguration?: string;
};

export type ParkServiceData = {
  park?: string;
  visitDate?: string;
  ticketType?: string;
  hasLightningLane?: boolean;
  hasExpressPass?: boolean;
  parkHoursOpen?: string;
  parkHoursClose?: string;
  earlyEntryEligible?: boolean;
  earlyEntryTime?: string;
};

export type CarRentalServiceData = {
  company?: string;
  category?: string;
  pickupDate?: string;
  dropoffDate?: string;
  pickupLocation?: string;
  dropoffLocation?: string;
  driverAge?: number;
  additionalDriver?: boolean;
  gpsIncluded?: boolean;
  insuranceType?: string;
};

// =============================================================================
// Tipos para el sistema de alertas (Task 7)
// =============================================================================

export type AlertType = "warning" | "suggestion" | "info" | "error";

export type TripAlert = {
  id: string;
  type: AlertType;
  title: string;
  description: string;
  relatedServiceId?: string;
  isResolved: boolean;
  action?: {
    label: string;
    href: string;
  };
};
