import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistance } from "date-fns";
import { es } from "date-fns/locale";

// Utility para combinar clases de Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formatear fecha legible
export function formatDate(date: Date | string, pattern = "d MMM yyyy") {
  return format(new Date(date), pattern, { locale: es });
}

// Distancia relativa: "hace 2 días"
export function fromNow(date: Date | string) {
  return formatDistance(new Date(date), new Date(), {
    addSuffix: true,
    locale: es,
  });
}

// Calcular duración de un viaje en noches
export function tripDuration(start: Date | string, end: Date | string): number {
  const s = new Date(start);
  const e = new Date(end);
  return Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
}

// Calcular edad a partir de fecha de nacimiento
export function calculateAge(dateOfBirth: Date | string): number {
  const birth = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

// Determinar tipo de pasajero por edad
export function passengerTypeByAge(dateOfBirth: Date | string): "ADULT" | "CHILD" | "INFANT" {
  const age = calculateAge(dateOfBirth);
  if (age < 2) return "INFANT";
  if (age < 12) return "CHILD";
  return "ADULT";
}

// Colores por módulo
export const MODULE_COLORS: Record<string, string> = {
  FLIGHT: "#3B82F6",
  HOTEL: "#10B981",
  THEME_PARK: "#F97316",
  CAR_RENTAL: "#64748B",
};

// Íconos por módulo (nombres de Lucide)
export const MODULE_ICONS: Record<string, string> = {
  FLIGHT: "Plane",
  HOTEL: "Hotel",
  THEME_PARK: "Ferris-wheel",
  CAR_RENTAL: "Car",
};

// Nombres legibles por módulo
export const MODULE_NAMES: Record<string, string> = {
  FLIGHT: "Vuelo",
  HOTEL: "Hotel",
  THEME_PARK: "Parque Temático",
  CAR_RENTAL: "Alquiler de Auto",
};

// Nombres legibles de estado del viaje
export const TRIP_STATUS_LABELS: Record<string, string> = {
  DRAFT: "Borrador",
  ACTIVE: "Activo",
  CONFIRMED: "Confirmado",
  COMPLETED: "Completado",
  ARCHIVED: "Archivado",
};

// Capitalizar primera letra
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Initiales para avatares
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
