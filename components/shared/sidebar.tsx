"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  Plane,
  Users,
  LayoutDashboard,
  BookTemplate,
  Settings,
  LogOut,
  Hotel,
  FerrisWheel,
  Car,
  ChevronRight,
  Plus,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/trips", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/trips", icon: Plane, label: "Mis Viajes" },
  { href: "/passengers", icon: Users, label: "Pasajeros" },
  { href: "/templates", icon: BookTemplate, label: "Templates" },
  { href: "/settings", icon: Settings, label: "Configuración" },
]

const MODULE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  FLIGHT: Plane,
  HOTEL: Hotel,
  THEME_PARK: FerrisWheel,
  CAR_RENTAL: Car,
}

const MODULE_COLORS: Record<string, string> = {
  FLIGHT: "text-blue-500",
  HOTEL: "text-emerald-500",
  THEME_PARK: "text-orange-500",
  CAR_RENTAL: "text-slate-500",
}

interface TripService {
  id: string
  name: string
  moduleTypeCode: string
}

interface SidebarProps {
  agencyName?: string
  userName?: string
  activeTrip?: {
    id: string
    name: string
    startDate?: string | null
    endDate?: string | null
    services?: TripService[]
  } | null
}

export function Sidebar({ agencyName, userName, activeTrip }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="w-60 min-h-screen bg-white border-r border-slate-100 flex flex-col">
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-xs">TV</span>
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-slate-900 truncate">TravelVYP</p>
            {agencyName && (
              <p className="text-xs text-slate-400 truncate">{agencyName}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto builder-scroll">
        {/* Viaje activo */}
        {activeTrip && (
          <div className="p-3 border-b border-slate-100">
            <div className="bg-blue-50 rounded-lg p-3 space-y-3">
              {/* Trip header */}
              <div>
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">
                  Viaje activo
                </p>
                <p className="text-sm font-semibold text-slate-900 leading-tight">
                  {activeTrip.name}
                </p>
                {activeTrip.startDate && activeTrip.endDate && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    {new Date(activeTrip.startDate).toLocaleDateString("es", {
                      day: "numeric",
                      month: "short",
                    })}{" "}
                    —{" "}
                    {new Date(activeTrip.endDate).toLocaleDateString("es", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                )}
              </div>

              {/* Servicios del viaje */}
              {activeTrip.services && activeTrip.services.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Servicios
                  </p>
                  {activeTrip.services.map((service) => {
                    const Icon = MODULE_ICONS[service.moduleTypeCode] || Plane
                    const colorClass = MODULE_COLORS[service.moduleTypeCode] || "text-slate-500"
                    const href = `/trips/${activeTrip.id}/services/${service.id}`
                    return (
                      <Link
                        key={service.id}
                        href={href}
                        className={cn(
                          "flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium transition-colors",
                          pathname === href
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-600 hover:bg-white/70"
                        )}
                      >
                        <Icon className={cn("h-3.5 w-3.5 flex-shrink-0", colorClass)} />
                        <span className="truncate">{service.name}</span>
                      </Link>
                    )
                  })}
                </div>
              )}

              {/* Add service */}
              <Link
                href={`/trips/${activeTrip.id}/services/new`}
                className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                Agregar servicio
              </Link>
            </div>
          </div>
        )}

        {/* Navegación principal */}
        <nav className="p-2 space-y-0.5">
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive =
              href === "/trips"
                ? pathname === "/trips"
                : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {label}
                {isActive && (
                  <ChevronRight className="h-3.5 w-3.5 ml-auto text-slate-400" />
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Footer — user + logout */}
      <div className="p-3 border-t border-slate-100">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-slate-50 transition-colors group">
          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <span className="text-blue-600 font-semibold text-xs">
              {userName
                ? userName.split(" ").map((n) => n[0]).slice(0, 2).join("")
                : "?"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">{userName}</p>
            <p className="text-xs text-slate-400 truncate">{agencyName}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            title="Cerrar sesión"
          >
            <LogOut className="h-4 w-4 text-slate-400 hover:text-slate-600" />
          </button>
        </div>
      </div>
    </aside>
  )
}
