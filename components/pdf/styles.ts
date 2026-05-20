import { StyleSheet, Font } from "@react-pdf/renderer"

// ─────────────────────────────────────────────────────────────
// Colores del sistema
// ─────────────────────────────────────────────────────────────
export const COLORS = {
  // Base
  white: "#FFFFFF",
  black: "#0F172A",
  // Greys
  slate50: "#F8FAFC",
  slate100: "#F1F5F9",
  slate200: "#E2E8F0",
  slate300: "#CBD5E1",
  slate400: "#94A3B8",
  slate500: "#64748B",
  slate600: "#475569",
  slate700: "#334155",
  slate800: "#1E293B",
  slate900: "#0F172A",
  // Brand
  blue500: "#3B82F6",
  blue600: "#2563EB",
  blue50: "#EFF6FF",
  // Module colors
  flight: "#3B82F6",
  hotel: "#10B981",
  park: "#F97316",
  car: "#64748B",
  // Accent tints
  flightTint: "#EFF6FF",
  hotelTint: "#ECFDF5",
  parkTint: "#FFF7ED",
  carTint: "#F8FAFC",
  // Highlight
  highlightBg: "#FFFBEB",
  highlightBorder: "#F59E0B",
}

// ─────────────────────────────────────────────────────────────
// Module color helpers
// ─────────────────────────────────────────────────────────────
export function getModuleColor(code: string): string {
  const map: Record<string, string> = {
    FLIGHT: COLORS.flight,
    HOTEL: COLORS.hotel,
    THEME_PARK: COLORS.park,
    CAR_RENTAL: COLORS.car,
  }
  return map[code] || COLORS.slate500
}

export function getModuleTint(code: string): string {
  const map: Record<string, string> = {
    FLIGHT: COLORS.flightTint,
    HOTEL: COLORS.hotelTint,
    THEME_PARK: COLORS.parkTint,
    CAR_RENTAL: COLORS.carTint,
  }
  return map[code] || COLORS.slate50
}

export function getModuleLabel(code: string): string {
  const map: Record<string, string> = {
    FLIGHT: "Vuelo",
    HOTEL: "Hotel",
    THEME_PARK: "Parque Temático",
    CAR_RENTAL: "Alquiler de Auto",
  }
  return map[code] || code
}

// ─────────────────────────────────────────────────────────────
// Global stylesheet
// ─────────────────────────────────────────────────────────────
export const globalStyles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: COLORS.slate800,
    backgroundColor: COLORS.white,
    paddingTop: 0,
    paddingBottom: 40,
    paddingHorizontal: 0,
  },

  // ── Portada
  coverPage: {
    fontFamily: "Helvetica",
    backgroundColor: COLORS.slate900,
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 0,
    minHeight: "100%",
  },
  coverTopBar: {
    backgroundColor: COLORS.blue600,
    paddingHorizontal: 50,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
  },
  coverLogo: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: COLORS.white,
    letterSpacing: 1,
  },
  coverBody: {
    flex: 1,
    paddingHorizontal: 50,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: "center",
  },
  coverEyebrow: {
    fontSize: 9,
    color: COLORS.slate400,
    fontFamily: "Helvetica",
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 16,
  },
  coverTitle: {
    fontSize: 36,
    fontFamily: "Helvetica-Bold",
    color: COLORS.white,
    lineHeight: 1.2,
    marginBottom: 12,
  },
  coverSubtitle: {
    fontSize: 14,
    color: COLORS.slate300,
    fontFamily: "Helvetica",
    marginBottom: 40,
  },
  coverDivider: {
    width: 40,
    height: 2,
    backgroundColor: COLORS.blue500,
    marginBottom: 40,
  },
  coverMetaGrid: {
    flexDirection: "row",
    gap: 40,
  },
  coverMetaItem: {
    flexDirection: "column",
  },
  coverMetaLabel: {
    fontSize: 8,
    color: COLORS.slate500,
    fontFamily: "Helvetica",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  coverMetaValue: {
    fontSize: 13,
    color: COLORS.white,
    fontFamily: "Helvetica-Bold",
  },
  coverFooter: {
    paddingHorizontal: 50,
    paddingBottom: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.slate700,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  coverFooterText: {
    fontSize: 8,
    color: COLORS.slate500,
  },
  coverFooterBrand: {
    fontSize: 8,
    color: COLORS.slate400,
    fontFamily: "Helvetica-Bold",
  },

  // ── Content pages
  contentPage: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: COLORS.slate800,
    backgroundColor: COLORS.white,
    paddingBottom: 50,
  },

  // Page header (sticky top bar on content pages)
  pageHeader: {
    backgroundColor: COLORS.slate900,
    paddingHorizontal: 40,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  pageHeaderLeft: {
    fontSize: 8,
    color: COLORS.slate400,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  pageHeaderRight: {
    fontSize: 8,
    color: COLORS.slate500,
  },

  // Content body padding
  body: {
    paddingHorizontal: 40,
  },

  // ── Summary page
  summaryTitle: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: COLORS.slate900,
    marginBottom: 6,
  },
  summarySubtitle: {
    fontSize: 11,
    color: COLORS.slate500,
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginBottom: 6,
  },
  summaryRowEven: {
    backgroundColor: COLORS.slate50,
  },
  summaryRowOdd: {
    backgroundColor: COLORS.white,
  },
  summaryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  summaryServiceName: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: COLORS.slate900,
    flex: 1,
  },
  summaryServiceType: {
    fontSize: 9,
    color: COLORS.slate500,
    width: 110,
  },
  summaryConfirmation: {
    fontSize: 9,
    color: COLORS.slate600,
    fontFamily: "Helvetica-Bold",
    width: 100,
    textAlign: "right",
  },

  // Passengers box
  passengerBox: {
    backgroundColor: COLORS.slate50,
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  passengerChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: COLORS.slate200,
  },
  passengerChipText: {
    fontSize: 9,
    color: COLORS.slate700,
    fontFamily: "Helvetica-Bold",
  },
  passengerChipType: {
    fontSize: 8,
    color: COLORS.slate400,
    marginLeft: 4,
  },

  // ── Service section header
  sectionHeader: {
    paddingHorizontal: 40,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 0,
  },
  sectionHeaderDot: {
    width: 3,
    height: 32,
    borderRadius: 2,
    marginRight: 14,
  },
  sectionModuleTag: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 3,
  },
  sectionServiceName: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: COLORS.slate900,
  },
  sectionMeta: {
    fontSize: 9,
    color: COLORS.slate500,
    marginTop: 2,
  },

  // Service data chips
  dataChipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 40,
    marginBottom: 20,
    marginTop: 8,
  },
  dataChip: {
    backgroundColor: COLORS.slate50,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: COLORS.slate200,
  },
  dataChipLabel: {
    fontSize: 7,
    color: COLORS.slate400,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  dataChipValue: {
    fontSize: 10,
    color: COLORS.slate900,
    fontFamily: "Helvetica-Bold",
  },

  // ── Block components
  blockContainer: {
    paddingHorizontal: 40,
    marginBottom: 10,
  },
  block: {
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.slate200,
    backgroundColor: COLORS.white,
  },
  blockHighlighted: {
    borderLeftWidth: 3,
    backgroundColor: COLORS.highlightBg,
    borderColor: COLORS.slate200,
  },
  blockTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: COLORS.slate900,
    marginBottom: 6,
  },
  blockHighlightedTitle: {
    color: COLORS.slate900,
  },
  blockContent: {
    fontSize: 9.5,
    color: COLORS.slate600,
    lineHeight: 1.6,
  },
  blockTag: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 5,
    color: COLORS.highlightBorder,
  },
  blockDivider: {
    height: 1,
    backgroundColor: COLORS.slate100,
    marginVertical: 8,
  },

  // ── Page footer
  pageFooter: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 7.5,
    color: COLORS.slate400,
  },
  footerBrand: {
    fontSize: 7.5,
    color: COLORS.slate400,
    fontFamily: "Helvetica-Bold",
  },

  // ── Back cover
  backCoverPage: {
    backgroundColor: COLORS.slate900,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 50,
  },
  backCoverTitle: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: COLORS.white,
    marginBottom: 8,
    textAlign: "center",
  },
  backCoverSubtitle: {
    fontSize: 11,
    color: COLORS.slate400,
    marginBottom: 32,
    textAlign: "center",
  },
  backCoverContact: {
    backgroundColor: COLORS.slate800,
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    width: "70%",
  },
  backCoverContactLabel: {
    fontSize: 8,
    color: COLORS.slate500,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  backCoverContactName: {
    fontSize: 14,
    color: COLORS.white,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  backCoverContactDetail: {
    fontSize: 10,
    color: COLORS.slate400,
    marginBottom: 2,
  },
})
