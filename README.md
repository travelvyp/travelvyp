# TravelVYP — Experience Builder

Sistema operativo para agencias de viajes. Constructor modular de itinerarios y experiencias de viaje premium.

## Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **UI:** Tailwind CSS + shadcn/ui + Radix UI
- **Base de datos:** PostgreSQL + Prisma ORM
- **Auth:** NextAuth v5 (Auth.js) con Credentials Provider
- **Drag & Drop:** @dnd-kit
- **Validación:** Zod

## Setup inicial

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env.local
# Editar .env.local con tu DATABASE_URL y AUTH_SECRET
```

### 3. Generar cliente Prisma
```bash
npm run db:generate
```

### 4. Crear tablas en la base de datos
```bash
npm run db:push
# o para entorno de producción:
npm run db:migrate
```

### 5. Cargar datos iniciales (módulos, templates, usuario demo)
```bash
npm run db:seed
```

### 6. Iniciar el servidor de desarrollo
```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

**Usuario demo:** pablo@travelvyp.com / travelvyp2024

## Comandos útiles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run db:studio` | Abrir Prisma Studio (UI de la DB) |
| `npm run db:seed` | Cargar datos iniciales |
| `npm run db:reset` | Resetear base de datos |
| `npm run lint` | Linter |

## Estructura del proyecto

```
travelvyp/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Rutas de autenticación
│   ├── (dashboard)/        # Rutas del panel del agente
│   │   ├── trips/          # Gestión de viajes
│   │   ├── passengers/     # Gestión de pasajeros
│   │   ├── templates/      # Biblioteca de templates
│   │   └── settings/       # Configuración de la agencia
│   ├── api/                # API Routes
│   └── v/[token]/          # Portal del pasajero (público)
├── components/
│   ├── ui/                 # Componentes base (shadcn)
│   ├── builder/            # Constructor de itinerarios
│   ├── blocks/             # Sistema de bloques
│   ├── preview/            # Preview del itinerario
│   └── shared/             # Componentes compartidos
├── lib/
│   ├── prisma.ts           # Cliente Prisma singleton
│   ├── auth.ts             # Configuración NextAuth
│   └── utils.ts            # Utilidades generales
├── prisma/
│   ├── schema.prisma       # Schema de la base de datos
│   └── seed.ts             # Datos iniciales del sistema
└── types/
    └── index.ts            # Tipos TypeScript globales
```

## Base de datos — Modelo de datos

### Capa 1 — Plataforma SaaS
- `agencies` — Organizaciones / agencias de viajes
- `users` — Agentes con roles (owner, admin, agent, viewer)

### Capa 2 — Biblioteca de conocimiento
- `module_types` — Catálogo de módulos (FLIGHT, HOTEL, THEME_PARK, CAR_RENTAL)
- `service_templates` — Templates por proveedor (Grand Floridian, Magic Kingdom, etc.)
- `block_definitions` — Tipos de bloques disponibles por módulo
- `template_blocks` — Contenido pre-configurado por template

### Capa 3 — Trabajo operativo
- `trips` — Viajes activos
- `passengers` — Perfiles de pasajeros
- `trip_passengers` — Relación viaje ↔ pasajero
- `trip_services` — Servicios contratados por viaje
- `service_blocks` — Bloques editables por servicio
- `itineraries` — Documentos exportados (PDF + portal)

## Opciones de base de datos

El proyecto es compatible con cualquier PostgreSQL:

- **Supabase** (recomendado para empezar) — Free tier generoso
- **Railway** — Deploy simple con PostgreSQL incluido
- **Neon** — PostgreSQL serverless
- **Local** — PostgreSQL en tu máquina

## Roadmap MVP

- [ ] **Fase 0** — Setup y base de datos ✅
- [ ] **Fase 1** — Auth + Dashboard + CRUD de viajes y pasajeros
- [ ] **Fase 2** — Builder system + módulos vuelo y hotel
- [ ] **Fase 3** — Módulos parques y autos + templates Disney/Universal
- [ ] **Fase 4** — PDF Export Engine
- [ ] **Fase 5** — Portal del pasajero + QR

---

Desarrollado para TravelVYP — Sistema operativo para agencias de viajes.
