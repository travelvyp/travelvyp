// =============================================================================
// TravelVYP — Seed inicial de la base de datos
// Crea: módulos, block definitions y templates con bloques pre-configurados
// Ejecutar: npm run db:seed
// =============================================================================

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Seeds use direct connection (not pooler) to avoid PgBouncer limitations.
// DIRECT_URL = Neon direct endpoint (no -pooler in hostname).
// Falls back to DATABASE_URL if DIRECT_URL is not set.
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
    },
  },
});

async function main() {
  console.log("🌱 Iniciando seed de TravelVYP...\n");

  // ============================================================
  // 1. MÓDULOS BASE
  // ============================================================
  console.log("📦 Creando módulos...");

  const flightModule = await prisma.moduleType.upsert({
    where: { code: "FLIGHT" },
    update: {},
    create: {
      code: "FLIGHT",
      name: "Vuelo",
      icon: "Plane",
      colorAccent: "#3B82F6",
      sortOrder: 1,
    },
  });

  const hotelModule = await prisma.moduleType.upsert({
    where: { code: "HOTEL" },
    update: {},
    create: {
      code: "HOTEL",
      name: "Hotel",
      icon: "Hotel",
      colorAccent: "#10B981",
      sortOrder: 2,
    },
  });

  const parkModule = await prisma.moduleType.upsert({
    where: { code: "THEME_PARK" },
    update: {},
    create: {
      code: "THEME_PARK",
      name: "Parque Temático",
      icon: "Ferris-wheel",
      colorAccent: "#F97316",
      sortOrder: 3,
    },
  });

  const carModule = await prisma.moduleType.upsert({
    where: { code: "CAR_RENTAL" },
    update: {},
    create: {
      code: "CAR_RENTAL",
      name: "Alquiler de Auto",
      icon: "Car",
      colorAccent: "#64748B",
      sortOrder: 4,
    },
  });

  await prisma.moduleType.upsert({
    where: { code: "TRANSFER" },
    update: {},
    create: { code: "TRANSFER", name: "Traslado", icon: "Bus", colorAccent: "#8B5CF6", sortOrder: 5 },
  });

  await prisma.moduleType.upsert({
    where: { code: "INSURANCE" },
    update: {},
    create: { code: "INSURANCE", name: "Seguro", icon: "Shield", colorAccent: "#EF4444", sortOrder: 6 },
  });

  await prisma.moduleType.upsert({
    where: { code: "TICKET" },
    update: {},
    create: { code: "TICKET", name: "Ticket / Actividad", icon: "Ticket", colorAccent: "#F59E0B", sortOrder: 7 },
  });

  await prisma.moduleType.upsert({
    where: { code: "EXCURSION" },
    update: {},
    create: { code: "EXCURSION", name: "Excursion", icon: "Compass", colorAccent: "#06B6D4", sortOrder: 8 },
  });

  await prisma.moduleType.upsert({
    where: { code: "OTHER" },
    update: {},
    create: { code: "OTHER", name: "Otro", icon: "Package", colorAccent: "#6B7280", sortOrder: 9 },
  });

  console.log("  ✓ 9 modulos creados\n");

  // ============================================================
  // 2. BLOCK DEFINITIONS — VUELOS
  // ============================================================
  console.log("🧱 Creando block definitions — Vuelos...");

  const flightBlocks = await Promise.all([
    prisma.blockDefinition.upsert({
      where: { code: "FLIGHT_BAGGAGE" },
      update: {},
      create: {
        moduleTypeId: flightModule.id,
        code: "FLIGHT_BAGGAGE",
        name: "Equipaje",
        description: "Información sobre allowance de equipaje",
        icon: "Luggage",
        defaultContent: "Verificar la política de equipaje de la aerolínea antes del viaje.",
        sortOrder: 1,
      },
    }),
    prisma.blockDefinition.upsert({
      where: { code: "FLIGHT_CHECKIN" },
      update: {},
      create: {
        moduleTypeId: flightModule.id,
        code: "FLIGHT_CHECKIN",
        name: "Check-in Online",
        description: "Recomendaciones de check-in",
        icon: "Smartphone",
        defaultContent: "Se recomienda realizar el check-in online con 24-48 horas de anticipación.",
        sortOrder: 2,
      },
    }),
    prisma.blockDefinition.upsert({
      where: { code: "FLIGHT_AIRPORT_TIPS" },
      update: {},
      create: {
        moduleTypeId: flightModule.id,
        code: "FLIGHT_AIRPORT_TIPS",
        name: "Tips del Aeropuerto",
        description: "Consejos de llegada al aeropuerto",
        icon: "MapPin",
        defaultContent: "Se recomienda llegar al aeropuerto con al menos 2 horas de anticipación para vuelos domésticos y 3 horas para vuelos internacionales.",
        sortOrder: 3,
      },
    }),
    prisma.blockDefinition.upsert({
      where: { code: "FLIGHT_DOCUMENTS" },
      update: {},
      create: {
        moduleTypeId: flightModule.id,
        code: "FLIGHT_DOCUMENTS",
        name: "Documentación Necesaria",
        description: "Documentos requeridos para el vuelo",
        icon: "FileText",
        defaultContent: "Tener a mano pasaporte vigente, boarding pass y documentación migratoria si corresponde.",
        sortOrder: 4,
      },
    }),
  ]);

  console.log(`  ✓ ${flightBlocks.length} blocks de vuelo creados`);

  // ============================================================
  // 3. BLOCK DEFINITIONS — HOTELES
  // ============================================================
  console.log("🧱 Creando block definitions — Hoteles...");

  const hotelBlocks = await Promise.all([
    prisma.blockDefinition.upsert({
      where: { code: "HOTEL_TRANSPORT" },
      update: {},
      create: {
        moduleTypeId: hotelModule.id,
        code: "HOTEL_TRANSPORT",
        name: "Transporte al Parque",
        description: "Opciones de transporte desde el hotel",
        icon: "Bus",
        sortOrder: 1,
      },
    }),
    prisma.blockDefinition.upsert({
      where: { code: "HOTEL_EARLY_ENTRY" },
      update: {},
      create: {
        moduleTypeId: hotelModule.id,
        code: "HOTEL_EARLY_ENTRY",
        name: "Early Theme Park Entry",
        description: "Acceso anticipado a parques temáticos",
        icon: "Sunrise",
        sortOrder: 2,
      },
    }),
    prisma.blockDefinition.upsert({
      where: { code: "HOTEL_AMENITIES" },
      update: {},
      create: {
        moduleTypeId: hotelModule.id,
        code: "HOTEL_AMENITIES",
        name: "Servicios del Resort",
        description: "Piscinas, spa, actividades del hotel",
        icon: "Waves",
        sortOrder: 3,
      },
    }),
    prisma.blockDefinition.upsert({
      where: { code: "HOTEL_DINING" },
      update: {},
      create: {
        moduleTypeId: hotelModule.id,
        code: "HOTEL_DINING",
        name: "Restaurantes y Dining",
        description: "Opciones de comida en el hotel",
        icon: "UtensilsCrossed",
        sortOrder: 4,
      },
    }),
    prisma.blockDefinition.upsert({
      where: { code: "HOTEL_PARKING" },
      update: {},
      create: {
        moduleTypeId: hotelModule.id,
        code: "HOTEL_PARKING",
        name: "Estacionamiento",
        description: "Información de parking del hotel",
        icon: "ParkingSquare",
        sortOrder: 5,
      },
    }),
    prisma.blockDefinition.upsert({
      where: { code: "HOTEL_CHECKIN_TIPS" },
      update: {},
      create: {
        moduleTypeId: hotelModule.id,
        code: "HOTEL_CHECKIN_TIPS",
        name: "Tips de Check-in",
        description: "Consejos para el proceso de check-in",
        icon: "Key",
        sortOrder: 6,
      },
    }),
    prisma.blockDefinition.upsert({
      where: { code: "HOTEL_FOOD_COURT" },
      update: {},
      create: {
        moduleTypeId: hotelModule.id,
        code: "HOTEL_FOOD_COURT",
        name: "Food Court",
        description: "Opciones de comida rápida en el resort",
        icon: "Coffee",
        sortOrder: 7,
      },
    }),
  ]);

  console.log(`  ✓ ${hotelBlocks.length} blocks de hotel creados`);

  // ============================================================
  // 4. BLOCK DEFINITIONS — PARQUES
  // ============================================================
  console.log("🧱 Creando block definitions — Parques...");

  const parkBlocks = await Promise.all([
    prisma.blockDefinition.upsert({
      where: { code: "PARK_EARLY_ENTRY" },
      update: {},
      create: {
        moduleTypeId: parkModule.id,
        code: "PARK_EARLY_ENTRY",
        name: "Early Theme Park Entry",
        description: "Información sobre acceso anticipado",
        icon: "Sunrise",
        sortOrder: 1,
      },
    }),
    prisma.blockDefinition.upsert({
      where: { code: "PARK_LIGHTNING_LANE" },
      update: {},
      create: {
        moduleTypeId: parkModule.id,
        code: "PARK_LIGHTNING_LANE",
        name: "Lightning Lane / Express Pass",
        description: "Sistema de filas rápidas",
        icon: "Zap",
        sortOrder: 2,
      },
    }),
    prisma.blockDefinition.upsert({
      where: { code: "PARK_STRATEGY" },
      update: {},
      create: {
        moduleTypeId: parkModule.id,
        code: "PARK_STRATEGY",
        name: "Estrategia del Día",
        description: "Recomendaciones de cómo organizar la visita",
        icon: "Map",
        sortOrder: 3,
      },
    }),
    prisma.blockDefinition.upsert({
      where: { code: "PARK_MUST_DO" },
      update: {},
      create: {
        moduleTypeId: parkModule.id,
        code: "PARK_MUST_DO",
        name: "Atracciones Imperdibles",
        description: "Las principales atracciones del parque",
        icon: "Star",
        sortOrder: 4,
      },
    }),
    prisma.blockDefinition.upsert({
      where: { code: "PARK_DINING" },
      update: {},
      create: {
        moduleTypeId: parkModule.id,
        code: "PARK_DINING",
        name: "Dining en el Parque",
        description: "Opciones de restaurantes dentro del parque",
        icon: "UtensilsCrossed",
        sortOrder: 5,
      },
    }),
    prisma.blockDefinition.upsert({
      where: { code: "PARK_SHOWS" },
      update: {},
      create: {
        moduleTypeId: parkModule.id,
        code: "PARK_SHOWS",
        name: "Shows y Espectáculos",
        description: "Shows recomendados del parque",
        icon: "Theater",
        sortOrder: 6,
      },
    }),
    prisma.blockDefinition.upsert({
      where: { code: "PARK_TIPS" },
      update: {},
      create: {
        moduleTypeId: parkModule.id,
        code: "PARK_TIPS",
        name: "Tips del Parque",
        description: "Consejos generales para la visita",
        icon: "Lightbulb",
        sortOrder: 7,
      },
    }),
  ]);

  console.log(`  ✓ ${parkBlocks.length} blocks de parque creados`);

  // ============================================================
  // 5. BLOCK DEFINITIONS — AUTO
  // ============================================================
  console.log("🧱 Creando block definitions — Autos...");

  const carBlocks = await Promise.all([
    prisma.blockDefinition.upsert({
      where: { code: "CAR_INSURANCE" },
      update: {},
      create: {
        moduleTypeId: carModule.id,
        code: "CAR_INSURANCE",
        name: "Cobertura y Seguros",
        description: "Información sobre seguros del alquiler",
        icon: "Shield",
        sortOrder: 1,
      },
    }),
    prisma.blockDefinition.upsert({
      where: { code: "CAR_TOLLS" },
      update: {},
      create: {
        moduleTypeId: carModule.id,
        code: "CAR_TOLLS",
        name: "Peajes y SunPass",
        description: "Información sobre peajes en Florida",
        icon: "CreditCard",
        sortOrder: 2,
      },
    }),
    prisma.blockDefinition.upsert({
      where: { code: "CAR_NAVIGATION" },
      update: {},
      create: {
        moduleTypeId: carModule.id,
        code: "CAR_NAVIGATION",
        name: "Navegación Recomendada",
        description: "Apps y tips de manejo local",
        icon: "Navigation",
        sortOrder: 3,
      },
    }),
    prisma.blockDefinition.upsert({
      where: { code: "CAR_PARKING_PARKS" },
      update: {},
      create: {
        moduleTypeId: carModule.id,
        code: "CAR_PARKING_PARKS",
        name: "Estacionamiento en Parques",
        description: "Precios y tips de parking en los parques",
        icon: "ParkingSquare",
        sortOrder: 4,
      },
    }),
    prisma.blockDefinition.upsert({
      where: { code: "CAR_FUEL" },
      update: {},
      create: {
        moduleTypeId: carModule.id,
        code: "CAR_FUEL",
        name: "Combustible",
        description: "Política de combustible y gasolineras",
        icon: "Fuel",
        sortOrder: 5,
      },
    }),
  ]);

  console.log(`  ✓ ${carBlocks.length} blocks de auto creados`);


  const cruiseModule = await prisma.moduleType.upsert({
    where: { code: "CRUISE" },
    update: {},
    create: { code: "CRUISE", name: "Crucero", icon: "Anchor", colorAccent: "#0EA5E9", sortOrder: 10 },
  });

  console.log("  + CRUISE modulo creado\n");

  // CRUISE block definitions
  const cruiseBlocks = await Promise.all([
    prisma.blockDefinition.upsert({
      where: { code: "CRUISE_EMBARK" },
      update: {},
      create: { moduleTypeId: cruiseModule.id, code: "CRUISE_EMBARK", name: "Embarque y Check-in", icon: "Anchor", sortOrder: 1 },
    }),
    prisma.blockDefinition.upsert({
      where: { code: "CRUISE_DINING" },
      update: {},
      create: { moduleTypeId: cruiseModule.id, code: "CRUISE_DINING", name: "Gastronomia a Bordo", icon: "UtensilsCrossed", sortOrder: 2 },
    }),
    prisma.blockDefinition.upsert({
      where: { code: "CRUISE_EXCURSIONS" },
      update: {},
      create: { moduleTypeId: cruiseModule.id, code: "CRUISE_EXCURSIONS", name: "Excursiones en Puertos", icon: "Map", sortOrder: 3 },
    }),
    prisma.blockDefinition.upsert({
      where: { code: "CRUISE_TIPS" },
      update: {},
      create: { moduleTypeId: cruiseModule.id, code: "CRUISE_TIPS", name: "Consejos del Crucero", icon: "Lightbulb", sortOrder: 4 },
    }),
  ]);

  // blockDefs lookup map (needed for new templates)
  const allBlockDefs = await prisma.blockDefinition.findMany({ select: { id: true, code: true } });
  const blockDefs: Record<string, string> = {};
  for (const bd of allBlockDefs) blockDefs[bd.code] = bd.id;

  console.log("  + 4 cruise blocks + blockDefs map creados\n");

  // ============================================================
  // 6. SERVICE TEMPLATES — HOTELES DISNEY
  // ============================================================
  console.log("\n🏨 Creando templates de hoteles Disney...");

  // Template: Disney's Grand Floridian Resort
  const grandFloridian = await prisma.serviceTemplate.upsert({
    where: {
      id: "template-grand-floridian",
    },
    update: {},
    create: {
      id: "template-grand-floridian",
      moduleTypeId: hotelModule.id,
      name: "Disney's Grand Floridian Resort & Spa",
      provider: "Disney",
      category: "Deluxe Resort",
      location: "Walt Disney World, Orlando FL",
      description: "El resort más icónico de Disney World, ubicado a pasos del Magic Kingdom con acceso directo por Monorail.",
      metadata: {
        resort_level: "deluxe",
        has_monorail: true,
        has_early_entry: true,
        disney_transport: true,
        early_entry_parks: ["magic_kingdom", "epcot"],
        distance_to_mk: "walking",
      },
      isSystem: true,
      templateBlocks: {
        create: [
          {
            blockDefinitionId: hotelBlocks.find(b => b.code === "HOTEL_TRANSPORT")!.id,
            title: "Transporte Gratuito al Parque",
            content: "El Grand Floridian cuenta con acceso directo al Monorail de Disney, con servicio directo a Magic Kingdom y EPCOT. También dispone de servicio de bus gratuito a todos los parques y resorts de Disney World, y del servicio de ferry al Magic Kingdom.\n\nEl Monorail funciona desde aproximadamente 1 hora antes de la apertura del parque hasta 1 hora después del cierre.",
            contentShort: "Monorail directo a Magic Kingdom y EPCOT. Bus y ferry gratuitos a todos los parques Disney.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 1,
          },
          {
            blockDefinitionId: hotelBlocks.find(b => b.code === "HOTEL_EARLY_ENTRY")!.id,
            title: "Early Theme Park Entry",
            content: "Como huésped del Grand Floridian, se tiene acceso a Early Theme Park Entry, beneficio que permite ingresar a cualquier parque de Disney World 30 minutos antes de la apertura oficial.\n\nSe recomienda aprovechar este beneficio especialmente en Magic Kingdom y Hollywood Studios para acceder a las atracciones más populares con menores tiempos de espera.",
            contentShort: "Acceso 30 minutos antes de la apertura a todos los parques Disney.",
            isActiveByDefault: true,
            isHighlightedByDefault: true,
            sortOrder: 2,
          },
          {
            blockDefinitionId: hotelBlocks.find(b => b.code === "HOTEL_AMENITIES")!.id,
            title: "Servicios del Resort",
            content: "El Grand Floridian ofrece múltiples piscinas incluyendo la piscina principal con tobogán acuático, spa completo, salón de belleza, club de fitness, actividades recreativas y servicio de concierge disponible para reservar restaurantes y experiencias Disney.\n\nEl resort también ofrece actividades nocturnas y entretenimiento en vivo en el lobby.",
            contentShort: "Piscinas con tobogán, spa, fitness center y concierge disponible.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 3,
          },
          {
            blockDefinitionId: hotelBlocks.find(b => b.code === "HOTEL_DINING")!.id,
            title: "Restaurantes del Resort",
            content: "El Grand Floridian alberga algunos de los restaurantes más reconocidos de Disney World:\n\n• Victoria & Albert's — Restaurante de lujo con degustación premium (reserva con mucha anticipación)\n• Citricos — Cocina mediterránea con vistas al Magic Kingdom\n• Narcoossee's — Mariscos frescos sobre el Seven Seas Lagoon\n• 1900 Park Fare — Character dining con personajes Disney\n• Grand Floridian Café — Opciones americanas en un ambiente elegante\n\nSe recomienda reservar con 60 días de anticipación a través de My Disney Experience.",
            contentShort: "Victoria & Albert's, Citricos, Narcoossee's y character dining. Reservas recomendadas con 60 días de anticipación.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 4,
          },
          {
            blockDefinitionId: hotelBlocks.find(b => b.code === "HOTEL_PARKING")!.id,
            title: "Estacionamiento",
            content: "El estacionamiento es gratuito para huéspedes del resort. Existe estacionamiento de valet y self-parking disponibles.\n\nComo huésped, el estacionamiento en todos los parques de Disney World también es gratuito.",
            contentShort: "Estacionamiento gratuito en el resort y en todos los parques Disney.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 5,
          },
          {
            blockDefinitionId: hotelBlocks.find(b => b.code === "HOTEL_CHECKIN_TIPS")!.id,
            title: "Tips de Check-in",
            content: "El check-in es a partir de las 15:00 hs. Si se llega antes, el equipaje puede dejarse en el resort y disfrutar de las instalaciones mientras la habitación queda lista.\n\nSe recomienda activar el MagicBand o usar la app My Disney Experience para acceder a la habitación y a los parques. El check-in online puede realizarse hasta 60 días antes por la misma app.",
            contentShort: "Check-in a las 15:00 hs. Usar My Disney Experience para check-in online y acceso digital.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 6,
          },
          {
            blockDefinitionId: hotelBlocks.find(b => b.code === "HOTEL_FOOD_COURT")!.id,
            title: "Gasparilla Island Grill",
            content: "El food court del Grand Floridian, abierto las 24 horas, ofrece opciones de desayuno, almuerzo, cena y snacks a precios más accesibles que los restaurantes del resort.\n\nIdeal para familias con niños o cuando se busca una opción rápida antes de salir al parque temprano.",
            contentShort: "Food court abierto 24hs con opciones económicas para todas las comidas.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 7,
          },
        ],
      },
    },
  });

  // Template: Disney's All-Star Movies Resort
  const allStarMovies = await prisma.serviceTemplate.upsert({
    where: { id: "template-all-star-movies" },
    update: {},
    create: {
      id: "template-all-star-movies",
      moduleTypeId: hotelModule.id,
      name: "Disney's All-Star Movies Resort",
      provider: "Disney",
      category: "Value Resort",
      location: "Walt Disney World, Orlando FL",
      description: "Resort de valor temático con iconos cinematográficos de Disney. Ideal para familias que buscan alojamiento económico dentro de Disney World.",
      metadata: {
        resort_level: "value",
        has_monorail: false,
        has_early_entry: true,
        disney_transport: true,
        early_entry_parks: ["all"],
      },
      isSystem: true,
      templateBlocks: {
        create: [
          {
            blockDefinitionId: hotelBlocks.find(b => b.code === "HOTEL_TRANSPORT")!.id,
            title: "Transporte Gratuito a los Parques",
            content: "El resort ofrece servicio de bus gratuito a todos los parques de Disney World y Disney Springs. Los tiempos de espera pueden ser de 15-30 minutos dependiendo del horario.",
            contentShort: "Bus gratuito a todos los parques Disney. Tiempo de espera 15-30 minutos.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 1,
          },
          {
            blockDefinitionId: hotelBlocks.find(b => b.code === "HOTEL_EARLY_ENTRY")!.id,
            title: "Early Theme Park Entry",
            content: "Como huésped de Disney World, se tiene acceso a Early Theme Park Entry, permitiendo ingresar 30 minutos antes de la apertura oficial a cualquier parque Disney.\n\nTeniendo en cuenta los tiempos de bus desde este resort, se recomienda salir con 45-60 minutos de anticipación para llegar al parque antes de la apertura.",
            contentShort: "Acceso 30 minutos antes de apertura. Salir con 60 min de anticipación por el tiempo de bus.",
            isActiveByDefault: true,
            isHighlightedByDefault: true,
            sortOrder: 2,
          },
          {
            blockDefinitionId: hotelBlocks.find(b => b.code === "HOTEL_FOOD_COURT")!.id,
            title: "World Premiere Food Court",
            content: "El food court del resort ofrece múltiples estaciones de comida con opciones variadas. Es una alternativa económica y práctica para el desayuno antes de salir al parque o la cena de regreso.",
            contentShort: "Food court con múltiples opciones para desayuno y cena.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 3,
          },
        ],
      },
    },
  });

  console.log("  ✓ Grand Floridian template creado");
  console.log("  ✓ All-Star Movies template creado");

  // ============================================================
  // 7. SERVICE TEMPLATES — PARQUES DISNEY
  // ============================================================
  console.log("\n🎢 Creando templates de parques Disney...");

  const magicKingdom = await prisma.serviceTemplate.upsert({
    where: { id: "template-magic-kingdom" },
    update: {},
    create: {
      id: "template-magic-kingdom",
      moduleTypeId: parkModule.id,
      name: "Magic Kingdom",
      provider: "Disney",
      category: "Theme Park",
      location: "Walt Disney World, Orlando FL",
      description: "El parque más icónico de Disney World, hogar del Castillo de la Cenicienta y las atracciones más clásicas.",
      metadata: {
        park_code: "MK",
        has_early_entry: true,
        has_lightning_lane: true,
        best_for: ["families", "kids", "first_timers"],
        busiest_days: ["saturday", "sunday", "friday"],
      },
      isSystem: true,
      templateBlocks: {
        create: [
          {
            blockDefinitionId: parkBlocks.find(b => b.code === "PARK_EARLY_ENTRY")!.id,
            title: "Early Theme Park Entry en Magic Kingdom",
            content: "Los huéspedes de resorts Disney tienen acceso al parque 30 minutos antes de la apertura oficial. Se recomienda aprovechar este tiempo para acceder directamente a Tiana's Bayou Adventure o Big Thunder Mountain Railroad, que son las atracciones con mayores tiempos de espera durante el día.",
            contentShort: "Entrada 30 min antes. Ir directo a Tiana's Bayou Adventure o Big Thunder Mountain.",
            isActiveByDefault: true,
            isHighlightedByDefault: true,
            sortOrder: 1,
          },
          {
            blockDefinitionId: parkBlocks.find(b => b.code === "PARK_LIGHTNING_LANE")!.id,
            title: "Lightning Lane en Magic Kingdom",
            content: "Magic Kingdom ofrece Lightning Lane Multi Pass (acceso a múltiples atracciones) y Lightning Lane Single Pass para las atracciones más populares.\n\nAtracciones que requieren Single Pass: Tiana's Bayou Adventure, TRON Lightcycle Run.\n\nAtracciones disponibles con Multi Pass: Space Mountain, Buzz Lightyear, Haunted Mansion, Pirates of the Caribbean, Peter Pan's Flight, entre otras.\n\nSe recomienda reservar Lightning Lane Single Pass a las 7:00 AM en My Disney Experience.",
            contentShort: "Reservar Lightning Lane Single Pass a las 7 AM para Tiana's y TRON.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 2,
          },
          {
            blockDefinitionId: parkBlocks.find(b => b.code === "PARK_STRATEGY")!.id,
            title: "Estrategia para Magic Kingdom",
            content: "Se recomienda comenzar por las atracciones de mayor popularidad al abrir el parque, cuando los tiempos de espera son mínimos. Fantasyland suele estar menos concurrida en las primeras horas.\n\nDurante las horas pico (11:00-15:00), es un buen momento para shows, desfiles, experiencias de personajes y dining.\n\nLas noches en Magic Kingdom son especiales: se recomienda quedarse para el show de fuegos artificiales Happily Ever After.",
            contentShort: "Mañana: atracciones de alta demanda. Mediodía: shows y dining. Noche: Happily Ever After.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 3,
          },
          {
            blockDefinitionId: parkBlocks.find(b => b.code === "PARK_MUST_DO")!.id,
            title: "Atracciones Imperdibles",
            content: "• Tiana's Bayou Adventure — Nueva atracción acuática basada en Princess and the Frog\n• TRON Lightcycle Run — Montaña rusa de alta velocidad en Tomorrowland\n• Space Mountain — Clásico icónico en la oscuridad\n• Big Thunder Mountain Railroad — Montaña rusa familiar\n• Haunted Mansion — Experiencia inmersiva de terror amigable\n• Pirates of the Caribbean — Clásico imperdible\n• Peter Pan's Flight — Popular entre familias con niños pequeños",
            contentShort: "Principales: Tiana's Bayou Adventure, TRON, Space Mountain, Big Thunder Mountain.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 4,
          },
          {
            blockDefinitionId: parkBlocks.find(b => b.code === "PARK_DINING")!.id,
            title: "Dining en Magic Kingdom",
            content: "• Be Our Guest Restaurant — Dining temático en el castillo de Bella y Bestia (reservas esenciales)\n• Cinderella's Royal Table — Character dining en el castillo (reservas con 60 días de anticipación)\n• The Friar's Nook — Papas fritas especiales en Fantasyland\n• Aloha Isle — Dole Whip, el icónico helado de piña de Disney\n• Columbia Harbour House — Opciones ligeras con buenas vistas",
            contentShort: "Reservar Be Our Guest o Cinderella's Royal Table. No olvidar el Dole Whip de Aloha Isle.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 5,
          },
          {
            blockDefinitionId: parkBlocks.find(b => b.code === "PARK_TIPS")!.id,
            title: "Tips para Magic Kingdom",
            content: "• Descargar My Disney Experience antes del viaje para gestionar Lightning Lane y reservas\n• Los lunes y martes suelen ser los días con menos afluencia\n• El desfile Festival of Fantasy pasa por Main Street U.S.A. a la tarde — verificar horario en la app\n• La zona de Fantasyland es la más popular entre familias con niños pequeños\n• Los baños más limpios y menos concurridos están en las áreas de Adventureland y Liberty Square",
            contentShort: "Descargar My Disney Experience. Días menos concurridos: lunes y martes.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 6,
          },
        ],
      },
    },
  });

  const epcot = await prisma.serviceTemplate.upsert({
    where: { id: "template-epcot" },
    update: {},
    create: {
      id: "template-epcot",
      moduleTypeId: parkModule.id,
      name: "EPCOT",
      provider: "Disney",
      category: "Theme Park",
      location: "Walt Disney World, Orlando FL",
      description: "Parque de exploración global y tecnología. Hogar de Guardians of the Galaxy y el icónico World Showcase.",
      metadata: {
        park_code: "EP",
        has_early_entry: true,
        has_lightning_lane: true,
        best_for: ["adults", "foodies", "culture"],
      },
      isSystem: true,
      templateBlocks: {
        create: [
          {
            blockDefinitionId: parkBlocks.find(b => b.code === "PARK_EARLY_ENTRY")!.id,
            title: "Early Entry en EPCOT",
            content: "Los huéspedes de resorts Disney tienen acceso 30 minutos antes de la apertura. Se recomienda ir directamente a Guardians of the Galaxy: Cosmic Rewind, que genera filas de 60-120 minutos durante el día.",
            contentShort: "Entrada 30 min antes. Ir directo a Guardians of the Galaxy.",
            isActiveByDefault: true,
            isHighlightedByDefault: true,
            sortOrder: 1,
          },
          {
            blockDefinitionId: parkBlocks.find(b => b.code === "PARK_MUST_DO")!.id,
            title: "Atracciones Imperdibles en EPCOT",
            content: "• Guardians of the Galaxy: Cosmic Rewind — Montaña rusa invertida única\n• Remy's Ratatouille Adventure — Excelente para familias con niños\n• Test Track — Experiencia de diseño automotriz\n• Frozen Ever After — Clásico familiar en World Showcase\n• Soarin' Around the World — Vuelo simulado panorámico\n• Mission: SPACE — Simulación espacial intensa",
            contentShort: "No perderse: Guardians of the Galaxy, Remy's Ratatouille y Soarin'.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 2,
          },
          {
            blockDefinitionId: parkBlocks.find(b => b.code === "PARK_DINING")!.id,
            title: "Dining en EPCOT",
            content: "EPCOT tiene el mejor dining de Disney World, especialmente en World Showcase:\n\n• Space 220 — Restaurante temático 'en el espacio' con vistas digitales\n• Monsieur Paul — Alta cocina francesa en el pabellón de Francia\n• Teppan Edo — Hibachi japonés clásico\n• Via Napoli — Pizza auténtica napolitana\n• Tutto Italia — Cocina italiana tradicional\n\nWorld Showcase también ofrece food booths con cocina de cada país.",
            contentShort: "Mejor dining de Disney. Destacados: Space 220, Monsieur Paul, Via Napoli.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 3,
          },
          {
            blockDefinitionId: parkBlocks.find(b => b.code === "PARK_TIPS")!.id,
            title: "Tips para EPCOT",
            content: "• EPCOT requiere más tiempo que otros parques por el tamaño de World Showcase\n• El show nocturno Luminous: The Symphony of Us es imperdible — buena ubicación frente al lago\n• World Showcase abre más tarde que Future World (normalmente 11:00 AM)\n• Excelente destino para adultos y foodie travellers\n• Los festivales de EPCOT (Food & Wine, Flower & Garden) agregan experiencias especiales según la temporada",
            contentShort: "Planificar día completo. World Showcase abre a las 11 AM. Show nocturno Luminous imperdible.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 4,
          },
        ],
      },
    },
  });

  console.log("  ✓ Magic Kingdom template creado");
  console.log("  ✓ EPCOT template creado");

  // ============================================================
  // 8. SERVICE TEMPLATE — ALQUILER DE AUTOS
  // ============================================================
  console.log("\n🚗 Creando template de alquiler de autos Orlando...");

  const hertzOrlando = await prisma.serviceTemplate.upsert({
    where: { id: "template-hertz-mco" },
    update: {},
    create: {
      id: "template-hertz-mco",
      moduleTypeId: carModule.id,
      name: "Hertz — Aeropuerto de Orlando (MCO)",
      provider: "Hertz",
      category: "Car Rental",
      location: "Orlando International Airport, FL",
      metadata: {
        airport: "MCO",
        has_gold_plus: true,
      },
      isSystem: true,
      templateBlocks: {
        create: [
          {
            blockDefinitionId: carBlocks.find(b => b.code === "CAR_INSURANCE")!.id,
            title: "Cobertura y Seguros",
            content: "Al retirar el auto, la agencia ofrecerá coberturas adicionales. Con seguro de viaje que incluya cobertura de auto de alquiler, puede declinarse el CDW/LDW de la empresa.\n\nSe recomienda verificar la cobertura del seguro de viaje contratado antes de declinar cualquier cobertura en el mostrador.",
            contentShort: "Verificar cobertura del seguro de viaje antes de declinar coberturas en el mostrador.",
            isActiveByDefault: true,
            isHighlightedByDefault: true,
            sortOrder: 1,
          },
          {
            blockDefinitionId: carBlocks.find(b => b.code === "CAR_TOLLS")!.id,
            title: "Peajes y SunPass en Florida",
            content: "Florida utiliza peajes electrónicos en la mayoría de sus autopistas. Se recomienda agregar SunPass al alquiler (costo adicional diario) para no preocuparse por peajes.\n\nSin SunPass, la empresa de alquiler cobra los peajes a posteriori con un cargo administrativo adicional. Las principales autopistas con peaje en Orlando son la Florida Turnpike, SR-528 (Beachline) y SR-417.",
            contentShort: "Agregar SunPass al alquiler para peajes automáticos. Evita cargos adicionales.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 2,
          },
          {
            blockDefinitionId: carBlocks.find(b => b.code === "CAR_NAVIGATION")!.id,
            title: "Navegación en Orlando",
            content: "Google Maps y Waze funcionan perfectamente en Orlando. Se recomienda Waze por su detección de tráfico en tiempo real, especialmente en el área de International Drive.\n\nEl GPS del auto puede solicitarse como add-on, pero con señal de celular, las apps son suficientes.",
            contentShort: "Usar Waze para navegación. Excelente para tráfico en International Drive.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 3,
          },
          {
            blockDefinitionId: carBlocks.find(b => b.code === "CAR_PARKING_PARKS")!.id,
            title: "Estacionamiento en Parques",
            content: "Estacionamiento en parques Disney (por día):\n• Estándar: USD 30/día\n• Preferencial: USD 50/día\n• Huéspedes de resorts Disney: Gratuito\n\nEstacionamiento Universal Studios:\n• General: USD 30/día\n• Preferred: USD 55/día\n• Valet: USD 80/día\n\nSe recomienda llegar temprano para obtener los mejores lugares y reducir el tiempo de caminata.",
            contentShort: "Disney parking: USD 30/día (gratis para huéspedes resort). Universal: USD 30-55/día.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 4,
          },
          {
            blockDefinitionId: carBlocks.find(b => b.code === "CAR_FUEL")!.id,
            title: "Combustible",
            content: "La mayoría de los autos de alquiler requieren combustible regular (87 octanos). Se recomienda devolver el auto con el tanque lleno para evitar los cargos de repostaje de la empresa (significativamente más caros que las gasolineras locales).\n\nLas gasolineras Costco tienen los mejores precios de combustible en el área de Orlando (requiere membresía). BJ's y Sam's Club también tienen buenos precios.",
            contentShort: "Devolver con tanque lleno. Mejor precio: Costco, BJ's o Sam's Club.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 5,
          },
        ],
      },
    },
  });

  console.log("  ✓ Hertz MCO template creado");


  // ============================================================
  // NEW TEMPLATES — Parks, Hotels, Airlines, Cars, Cruises
  // ============================================================


  console.log("\n Creando parques Disney adicionales...");
  await prisma.serviceTemplate.upsert({
    where: { id: "tpl-park-hs" },
    update: {},
    create: {
      id: "tpl-park-hs",
      moduleTypeId: parkModule.id,
      name: "Hollywood Studios",
      provider: "Disney",
      category: "Theme Park",
      location: "Walt Disney World, Orlando FL",
      description: "Parque de cine y entretenimiento con Star Wars: Galaxy's Edge, Toy Story Land y atracciones de alto impacto.",
      metadata: {"park_code": "HS", "has_early_entry": true, "has_lightning_lane": true},
      isSystem: true,
      templateBlocks: {
        create: [
          {
            blockDefinitionId: blockDefs["PARK_EARLY_ENTRY"],
            title: "Early Entry en Hollywood Studios",
            content: "Los huespedes de resorts Disney ingresan 30 minutos antes. Ir directo a Rise of the Resistance (Lightning Lane Single Pass obligatorio) o Slinky Dog Dash antes de que se llene.",
            contentShort: "30 min antes. Ir a Rise of the Resistance o Slinky Dog Dash.",
            isActiveByDefault: true,
            isHighlightedByDefault: true,
            sortOrder: 1,
          },
          {
            blockDefinitionId: blockDefs["PARK_MUST_DO"],
            title: "Atracciones Imperdibles",
            content: "- Rise of the Resistance: La atraccion mas impresionante de Disney, inmersiva y cinematografica\n- Slinky Dog Dash: Montana rusa familiar muy popular en Toy Story Land\n- Millennium Falcon Smugglers Run: Pilotear el Halcon Milenario en Galaxy's Edge\n- Tower of Terror: Clasico de caida libre en el Sunset Boulevard\n- Rock 'n' Roller Coaster: Montana rusa con Aerosmith en oscuridad total",
            contentShort: "Rise of the Resistance, Slinky Dog, Millennium Falcon, Tower of Terror.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 2,
          },
          {
            blockDefinitionId: blockDefs["PARK_STRATEGY"],
            title: "Estrategia para Hollywood Studios",
            content: "Madrugar es esencial. Al abrir: Rise of the Resistance (si no hay Lightning Lane disponible, tomar virtual queue a las 7AM). Luego Slinky Dog Dash. De dia: Galaxy's Edge para explorar, shows de Indiana Jones Stunt Spectacular. Tarde: Tower of Terror y Aerosmith.",
            contentShort: "Rise primero de manana. Shows al mediodia. Tower y Aerosmith al atardecer.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 3,
          },
          {
            blockDefinitionId: blockDefs["PARK_TIPS"],
            title: "Tips para Hollywood Studios",
            content: "- Lightning Lane Single Pass para Rise of the Resistance se agota muy rapido (reservar a las 7AM)\n- Fantasmic! es el show nocturno mas impresionante de Disney: llegar 30-45 min antes\n- Oga's Cantina en Galaxy's Edge es un bar tematico unico (reservas recomendadas)\n- Los martes y miercoles suelen tener menos afluencia",
            contentShort: "LL Single Pass para Rise a las 7AM. Fantasmic! de noche imperdible.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 4,
          }
        ],
      },
    },
  });
  await prisma.serviceTemplate.upsert({
    where: { id: "tpl-park-ak" },
    update: {},
    create: {
      id: "tpl-park-ak",
      moduleTypeId: parkModule.id,
      name: "Animal Kingdom",
      provider: "Disney",
      category: "Theme Park",
      location: "Walt Disney World, Orlando FL",
      description: "Parque de naturaleza y aventura con Pandora - The World of Avatar, safaris africanos y expediciones.",
      metadata: {"park_code": "AK", "has_early_entry": true, "has_lightning_lane": true},
      isSystem: true,
      templateBlocks: {
        create: [
          {
            blockDefinitionId: blockDefs["PARK_EARLY_ENTRY"],
            title: "Early Entry en Animal Kingdom",
            content: "Entrada 30 minutos antes de la apertura oficial. Ir directamente a Avatar Flight of Passage, la atraccion con mayor tiempo de espera del parque. En early entry los tiempos pueden ser de 15-30 minutos vs 90-120 durante el dia.",
            contentShort: "30 min antes. Ir directo a Avatar Flight of Passage.",
            isActiveByDefault: true,
            isHighlightedByDefault: true,
            sortOrder: 1,
          },
          {
            blockDefinitionId: blockDefs["PARK_MUST_DO"],
            title: "Atracciones Imperdibles",
            content: "- Avatar Flight of Passage: Simulacion de vuelo en banshee sobre Pandora, visualmente impresionante\n- Na'vi River Journey: Paseo fluvial sereno por la jungla de Pandora (ideal para ninos)\n- Kilimanjaro Safaris: Safari autentico con animales africanos reales\n- Expedition Everest: Montana rusa con el Yeti en el Himalaya\n- Kali River Rapids: Rafting con posibilidad de mojarse",
            contentShort: "Avatar FoP, Safaris, Expedition Everest son los tres esenciales.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 2,
          },
          {
            blockDefinitionId: blockDefs["PARK_STRATEGY"],
            title: "Estrategia para Animal Kingdom",
            content: "El calor de la tarde afecta mas a este parque por ser mas abierto. Llegada temprana para Avatar y Safaris (los animales estan mas activos en la manana). De dia: Festival of the Lion King y Finding Nemo musical con aire acondicionado. Tarde-noche: Rivers of Light si disponible.",
            contentShort: "Manana: Avatar + Safaris. Mediodia: shows con A/C. Tarde: Pandora de noche.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 3,
          },
          {
            blockDefinitionId: blockDefs["PARK_TIPS"],
            title: "Tips para Animal Kingdom",
            content: "- Pandora luce increible de noche con las plantas bioluminiscentes\n- Los safaris son mejores a primera hora de la manana cuando los animales estan activos\n- Llevar ropa que pueda mojarse si se planea Kali River Rapids\n- El parque suele cerrar mas temprano que los demas parques Disney",
            contentShort: "Pandora de noche es magica. Safaris de manana. Parque cierra mas temprano.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 4,
          }
        ],
      },
    },
  });
  console.log("  + Hollywood Studios y Animal Kingdom creados");
  console.log("\n Creando parques Universal...");
  await prisma.serviceTemplate.upsert({
    where: { id: "tpl-park-usf" },
    update: {},
    create: {
      id: "tpl-park-usf",
      moduleTypeId: parkModule.id,
      name: "Universal Studios Florida",
      provider: "Universal",
      category: "Theme Park",
      location: "Universal Orlando Resort, FL",
      description: "Parque cinematografico con Harry Potter Diagon Alley, Minion Land, Springfield y atracciones de alto impacto.",
      metadata: {"park_code": "USF", "has_express_pass": true},
      isSystem: true,
      templateBlocks: {
        create: [
          {
            blockDefinitionId: blockDefs["PARK_MUST_DO"],
            title: "Atracciones Imperdibles",
            content: "- Escape from Gringotts: Aventura en el banco de los magos en Diagon Alley (Harry Potter)\n- Revenge of the Mummy: Montana rusa clasica en oscuridad\n- Men in Black Alien Attack: Shooter interactivo\n- Hollywood Rip Ride Rockit: Montana rusa con musica personalizada\n- Despicable Me Minion Mayhem: Simulacion familiar\n- The Simpsons Ride: Viaje al Springfield animado",
            contentShort: "Gringotts, Mummy, Rip Ride Rockit son los imperdibles.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 1,
          },
          {
            blockDefinitionId: blockDefs["PARK_LIGHTNING_LANE"],
            title: "Universal Express Pass",
            content: "Universal Express Pass permite saltear las filas en la mayoria de las atracciones. Los huespedes de hoteles Premier (Hard Rock, Portofino Bay, Royal Pacific, Helios Grand) reciben Express Unlimited incluido sin cargo adicional.\n\nPara visitas sin hotel Premier, el Express Pass puede comprarse por dia online (precio variable segun demanda).",
            contentShort: "Hoteles Premier incluyen Express Unlimited gratis. Sin hotel: comprar online.",
            isActiveByDefault: true,
            isHighlightedByDefault: true,
            sortOrder: 2,
          },
          {
            blockDefinitionId: blockDefs["PARK_STRATEGY"],
            title: "Estrategia para Universal Studios Florida",
            content: "Llegar antes de la apertura. Ir a Gringotts primero (los tiempos de espera superan los 90 min en horas pico). Luego Rip Ride Rockit. Explorar Diagon Alley con calma. Nota: Hogwarts Express conecta USF con Islands of Adventure (requiere ticket de ambos parques).",
            contentShort: "Gringotts primero. Diagon Alley con calma. Hogwarts Express a IOA.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 3,
          },
          {
            blockDefinitionId: blockDefs["PARK_TIPS"],
            title: "Tips para Universal Studios Florida",
            content: "- Diagon Alley es accesible solo para tickets de ambos parques (Park-to-Park)\n- Cerveza de Mantequilla disponible en el Mercado de Diagon Alley\n- Springfield zona de Los Simpsons tiene muchas opciones de comida tematica\n- Mejor dia para visitar: martes o miercoles",
            contentShort: "Ticket Park-to-Park para Hogwarts Express. Cerveza de Mantequilla en Diagon Alley.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 4,
          }
        ],
      },
    },
  });
  await prisma.serviceTemplate.upsert({
    where: { id: "tpl-park-ioa" },
    update: {},
    create: {
      id: "tpl-park-ioa",
      moduleTypeId: parkModule.id,
      name: "Islands of Adventure",
      provider: "Universal",
      category: "Theme Park",
      location: "Universal Orlando Resort, FL",
      description: "El parque de atracciones mas intenso de Orlando con Hogsmeade, Velocicoaster y Marvel Super Hero Island.",
      metadata: {"park_code": "IOA", "has_express_pass": true},
      isSystem: true,
      templateBlocks: {
        create: [
          {
            blockDefinitionId: blockDefs["PARK_MUST_DO"],
            title: "Atracciones Imperdibles",
            content: "- Hagrid's Magical Creatures Motorbike Adventure: La mejor atraccion de Universal, mezcla de outdoor y efectos especiales\n- Velocicoaster: Montana rusa de alta velocidad de Jurassic World (180km/h)\n- Amazing Adventures of Spider-Man: Clasico inmersivo de Marvel\n- Jurassic World Ride: Descenso en bote con dinosaurios\n- Skull Island: Reign of Kong: Aventura con el Rey Kong",
            contentShort: "Hagrid's + Velocicoaster son los dos esenciales absolutos.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 1,
          },
          {
            blockDefinitionId: blockDefs["PARK_LIGHTNING_LANE"],
            title: "Universal Express Pass en IOA",
            content: "Express Pass disponible para casi todas las atracciones. Hagrid's Motorbike NO acepta Express Pass \u2014 los tiempos de espera pueden ser de 2-4 horas sin estrategia. Se recomienda ser de los primeros en entrar al parque y correr a Hagrid's.\n\nHoteles Premier (Hard Rock, Portofino, Royal Pacific, Helios) incluyen Express Unlimited gratis.",
            contentShort: "Hagrid's NO tiene Express Pass: ir primero al abrir. Demas atracciones si.",
            isActiveByDefault: true,
            isHighlightedByDefault: true,
            sortOrder: 2,
          },
          {
            blockDefinitionId: blockDefs["PARK_STRATEGY"],
            title: "Estrategia para Islands of Adventure",
            content: "Llegar 30 min antes de la apertura oficial y correr a Hagrid's Motorbike (no acepta Express Pass y los tiempos crecen rapidamente). Luego Velocicoaster. El resto del dia con Express Pass es muy comodo.\n\nHogsmeade es mejor visitarlo al mediod\u00eda cuando hay menos gente. Hogwarts Express lleva a Diagon Alley en USF.",
            contentShort: "Hagrid's al abrir (sin Express Pass). Velocicoaster segundo. Hogsmeade de dia.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 3,
          },
          {
            blockDefinitionId: blockDefs["PARK_TIPS"],
            title: "Tips para Islands of Adventure",
            content: "- Llevar ropa de cambio si se planea Jurassic World Ride o Popeye & Bluto\n- Butterbeer (cerveza de mantequilla) disponible fria, caliente o helada en Hogsmeade\n- Three Broomsticks en Hogsmeade tiene opciones de almuerzo tematico\n- Hay casilleros gratuitos junto a las atracciones de mayor riesgo",
            contentShort: "Ropa de cambio para atracciones de agua. Butterbeer en Hogsmeade.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 4,
          }
        ],
      },
    },
  });
  await prisma.serviceTemplate.upsert({
    where: { id: "tpl-park-eu" },
    update: {},
    create: {
      id: "tpl-park-eu",
      moduleTypeId: parkModule.id,
      name: "Epic Universe",
      provider: "Universal",
      category: "Theme Park",
      location: "Universal Orlando Resort, FL",
      description: "El parque mas nuevo de Universal (apertura 2025) con mundos de Harry Potter, Mario, Como Entrenar Tu Dragon y mas.",
      metadata: {"park_code": "EU", "has_express_pass": true, "opened": "2025"},
      isSystem: true,
      templateBlocks: {
        create: [
          {
            blockDefinitionId: blockDefs["PARK_MUST_DO"],
            title: "Mundos y Atracciones Principales",
            content: "- The Wizarding World of Harry Potter: Ministry of Magic (Paris, 1920s)\n- Super Nintendo World: Mario Kart, Donkey Kong, experiencias interactivas\n- How to Train Your Dragon - Isle of Berk\n- Universal Monsters: Horror clasico con atracciones immersivas\n- Celestial Park: Zona central con atracciones para toda la familia\n\nAbierto desde mayo 2025 \u2014 el mayor proyecto de parque tematico en decadas.",
            contentShort: "Ministry of Magic + Nintendo World son los dos mundos mas esperados.",
            isActiveByDefault: true,
            isHighlightedByDefault: true,
            sortOrder: 1,
          },
          {
            blockDefinitionId: blockDefs["PARK_LIGHTNING_LANE"],
            title: "Express Pass en Epic Universe",
            content: "Epic Universe tiene su propio sistema de Express Pass. Los huespedes del Helios Grand Hotel (ubicado dentro del resort) reciben Express Unlimited incluido gratuitamente.\n\nPor ser el parque mas nuevo, se esperan tiempos de espera muy altos en 2025-2026. Express Pass es altamente recomendable.",
            contentShort: "Helios Grand Hotel incluye Express Unlimited. Muy recomendable para 2025-2026.",
            isActiveByDefault: true,
            isHighlightedByDefault: true,
            sortOrder: 2,
          },
          {
            blockDefinitionId: blockDefs["PARK_STRATEGY"],
            title: "Estrategia para Epic Universe",
            content: "Al ser el parque mas nuevo, llegar temprano es esencial para las atracciones de Harry Potter Ministry of Magic y Mario Kart. Se recomienda comprar Express Pass para la primera temporada ya que los tiempos de espera seran altos por la novedad.",
            contentShort: "Llegar muy temprano. MoM y Mario Kart primero. Express Pass imprescindible.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 3,
          },
          {
            blockDefinitionId: blockDefs["PARK_TIPS"],
            title: "Tips para Epic Universe",
            content: "- Abierto desde mayo 2025: parque completamente nuevo, revisar novedades antes del viaje\n- El Helios Grand Hotel esta dentro del mismo complejo de Epic Universe\n- Se puede visitar en combinacion con USF e IOA con ticket multi-park\n- Revisar Universal's app para tiempos de espera y reserva de experiencias",
            contentShort: "Parque nuevo 2025. Helios Grand es el hotel on-site. Multi-park recomendable.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 4,
          }
        ],
      },
    },
  });
  await prisma.serviceTemplate.upsert({
    where: { id: "tpl-park-vb" },
    update: {},
    create: {
      id: "tpl-park-vb",
      moduleTypeId: parkModule.id,
      name: "Volcano Bay",
      provider: "Universal",
      category: "Water Park",
      location: "Universal Orlando Resort, FL",
      description: "Parque acuatico de Universal con sistema virtual queue TapuTapu y atracciones para toda la familia.",
      metadata: {"park_code": "VB", "type": "water_park"},
      isSystem: true,
      templateBlocks: {
        create: [
          {
            blockDefinitionId: blockDefs["PARK_MUST_DO"],
            title: "Atracciones Principales",
            content: "- Ko'okiri Body Plunge: Tobogan vertical de 125 pies con trampa caida libre\n- Krakatau Aqua Coaster: 'Montana rusa' acuatica en familia a traves de la laguna\n- Honu ika Moana: Tobogan en familia con curvas y olas\n- Miss Adventure Falls: Aventura en familia con rafting\n- Ohyah & Ohno Drop Slides: Caida libre a la laguna",
            contentShort: "Ko'okiri (caida libre), Krakatau y Honu para experiencias distintas.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 1,
          },
          {
            blockDefinitionId: blockDefs["PARK_STRATEGY"],
            title: "Como usar el sistema TapuTapu",
            content: "Volcano Bay usa TapuTapu, una pulsera virtual que permite reservar turno para las atracciones y llegar cuando sea el momento, sin hacer filas fisicas. Al llegar al parque, retirar la pulsera y comenzar a reservar turnos desde temprano.\n\nLas atracciones de alta demanda se reservan rapido. Llegar al abrir el parque es fundamental.",
            contentShort: "TapuTapu = fila virtual. Reservar turnos en cuanto abra el parque.",
            isActiveByDefault: true,
            isHighlightedByDefault: true,
            sortOrder: 2,
          },
          {
            blockDefinitionId: blockDefs["PARK_TIPS"],
            title: "Tips para Volcano Bay",
            content: "- Llevar protector solar resistente al agua y aplicar frecuentemente\n- Las sillas y reposeras del area premium se reservan por dia con cargo adicional\n- TapuTapu funciona tambien como pago cashless en el parque\n- Mejor visitarlo entre semana para menor afluencia\n- Los colores del agua en Krakatau son impresionantes para fotos",
            contentShort: "TapuTapu para pagos. Llegar temprano para reservar sillas. Usar protector solar.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 3,
          }
        ],
      },
    },
  });
  await prisma.serviceTemplate.upsert({
    where: { id: "tpl-park-sw" },
    update: {},
    create: {
      id: "tpl-park-sw",
      moduleTypeId: parkModule.id,
      name: "SeaWorld Orlando",
      provider: "SeaWorld",
      category: "Theme Park",
      location: "SeaWorld, Orlando FL",
      description: "Parque de atracciones y experiencias con animales marinos, roller coasters y shows en vivo.",
      metadata: {"park_code": "SW", "type": "theme_park"},
      isSystem: true,
      templateBlocks: {
        create: [
          {
            blockDefinitionId: blockDefs["PARK_MUST_DO"],
            title: "Atracciones Principales",
            content: "- Mako: Hypercoaster de 200 pies, la montana rusa mas alta de Orlando\n- Manta: Montana rusa de vuelo (flying coaster) con sensacion de volar sobre el agua\n- Kraken: Inverting coaster clasico con 7 inversiones\n- Ice Breaker: Lanzamiento hacia adelante y atras con caida de 93 grados\n- Orca Encounter: Show educativo con orcas (reemplazo de Shamu)\n- Dolphin Nursery: Experiencia de contacto con delfines",
            contentShort: "Mako es la mas alta. Manta la mas inmersiva. Kraken para amantes de inversiones.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 1,
          },
          {
            blockDefinitionId: blockDefs["PARK_STRATEGY"],
            title: "Estrategia para SeaWorld",
            content: "Las roller coasters en la manana tienen menores tiempos de espera. Quick Queue disponible para compra y muy util en dias de alta afluencia. Los shows de animales (orcas, delfines, lobos marinos) son buenos para el mediodia cuando el calor es mas intenso.",
            contentShort: "Coasters de manana. Shows al mediodia. Quick Queue si hay mucha gente.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 2,
          },
          {
            blockDefinitionId: blockDefs["PARK_TIPS"],
            title: "Tips para SeaWorld",
            content: "- Quick Queue incluye acceso ilimitado a la mayoria de las atracciones\n- Reservar Animal Encounters con anticipacion (delfines, ping\u00fcinos, manat\u00edes)\n- Cheetah Hunt se puede combinar con Busch Gardens Tampa en un combo de tickets\n- Parking de hasta USD 30 por dia \u2014 llegar temprano para lugares cercanos",
            contentShort: "Quick Queue vale la pena. Reservar animal encounters. Combo con Busch Gardens.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 3,
          }
        ],
      },
    },
  });
  await prisma.serviceTemplate.upsert({
    where: { id: "tpl-park-bg" },
    update: {},
    create: {
      id: "tpl-park-bg",
      moduleTypeId: parkModule.id,
      name: "Busch Gardens Tampa",
      provider: "SeaWorld",
      category: "Theme Park",
      location: "Tampa, FL",
      description: "Parque de aventura africana con las mejores roller coasters de Florida y experiencias con animales.",
      metadata: {"park_code": "BG", "location_city": "Tampa"},
      isSystem: true,
      templateBlocks: {
        create: [
          {
            blockDefinitionId: blockDefs["PARK_MUST_DO"],
            title: "Atracciones Principales",
            content: "- Iron Gwazi: Hibrida madera/acero, elegida mejor roller coaster de Florida. 91 mph, 206 pies de altura\n- Cheetah Hunt: Montana rusa de lanzamiento suave con 3 disparos de velocidad\n- SheiKra: Dive coaster de 90 grados en caida vertical, 200 pies\n- Falcon's Fury: Caida libre de 335 pies (la mas alta de Florida independiente)\n- Cobra's Curse: Giro en espiral con serpiente animatronica",
            contentShort: "Iron Gwazi es la estrella. SheiKra + Falcon's Fury para adrenalina pura.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 1,
          },
          {
            blockDefinitionId: blockDefs["PARK_STRATEGY"],
            title: "Planificacion del dia en Busch Gardens",
            content: "Busch Gardens esta a 90 minutos de Orlando, por lo que conviene salir temprano. Abrir con Iron Gwazi y SheiKra. El safari Serengeti es ideal para el mediodia bajo sombra. Revisar shows en vivo en el escenario Moroccan Palace.\n\nBusch Gardens se combina bien con una visita a SeaWorld con el combo ticket 2-parques.",
            contentShort: "90 min desde Orlando. Salir temprano. Iron Gwazi al abrir. Safari al mediodia.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 2,
          },
          {
            blockDefinitionId: blockDefs["PARK_TIPS"],
            title: "Tips para Busch Gardens Tampa",
            content: "- Combo Busch Gardens + SeaWorld disponible con descuento\n- Quick Queue disponible por atraccion o ilimitado\n- El parque es mas tranquilo que los de Orlando en dias de semana\n- Serengeti Safari incluido en la entrada: camion por el area de animales africanos\n- Estacionamiento: USD 25-30 por dia",
            contentShort: "Combo con SeaWorld. Quick Queue disponible. Safari incluido en la entrada.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 3,
          }
        ],
      },
    },
  });
  console.log("  + 6 parques adicionales creados");
  console.log("\n Creando hoteles Disney adicionales...");
  await prisma.serviceTemplate.upsert({
    where: { id: "tpl-hotel-asm" },
    update: {},
    create: {
      id: "tpl-hotel-asm",
      moduleTypeId: hotelModule.id,
      name: "Disney's All-Star Music Resort",
      provider: "Disney",
      category: "Value Resort",
      location: "Walt Disney World, Orlando FL",
      description: "Resort tematico musical con iconos de Broadway, jazz y rock. Ideal para familias con presupuesto ajustado.",
      metadata: {"resort_level": "value", "disney_transport": true, "has_skyliner": false},
      isSystem: true,
      templateBlocks: {
        create: [
          {
            blockDefinitionId: blockDefs["HOTEL_TRANSPORT"],
            title: "Transporte a los Parques",
            content: "Bus gratuito Disney a todos los parques y Disney Springs. Tiempos de espera tipicos de 15-30 minutos.",
            contentShort: "Bus gratuito a todos los parques.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 1,
          },
          {
            blockDefinitionId: blockDefs["HOTEL_EARLY_ENTRY"],
            title: "Early Theme Park Entry",
            content: "Como huesped de Disney World se tiene acceso 30 minutos antes de la apertura oficial. Teniendo en cuenta los tiempos de bus, salir del resort con 45-60 minutos de anticipacion.",
            contentShort: "30 min de early entry. Salir con 60 min de anticipacion por el bus.",
            isActiveByDefault: true,
            isHighlightedByDefault: true,
            sortOrder: 2,
          },
          {
            blockDefinitionId: blockDefs["HOTEL_FOOD_COURT"],
            title: "Intermission Food Court",
            content: "El food court del resort ofrece desayuno, almuerzo, cena y snacks con opciones para toda la familia. Practica para comer rapido antes de salir al parque o al regresar.",
            contentShort: "Food court con opciones para todas las comidas.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 3,
          }
        ],
      },
    },
  });
  await prisma.serviceTemplate.upsert({
    where: { id: "tpl-hotel-ass" },
    update: {},
    create: {
      id: "tpl-hotel-ass",
      moduleTypeId: hotelModule.id,
      name: "Disney's All-Star Sports Resort",
      provider: "Disney",
      category: "Value Resort",
      location: "Walt Disney World, Orlando FL",
      description: "Resort tematico deportivo con iconos gigantes de tenis, futbol americano y baseball. El mas economico de Disney.",
      metadata: {"resort_level": "value", "disney_transport": true, "has_skyliner": false},
      isSystem: true,
      templateBlocks: {
        create: [
          {
            blockDefinitionId: blockDefs["HOTEL_TRANSPORT"],
            title: "Transporte a los Parques",
            content: "Bus gratuito Disney a todos los parques y Disney Springs. Tiempos de espera tipicos de 15-30 minutos.",
            contentShort: "Bus gratuito a todos los parques.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 1,
          },
          {
            blockDefinitionId: blockDefs["HOTEL_EARLY_ENTRY"],
            title: "Early Theme Park Entry",
            content: "Como huesped de Disney World se tiene acceso 30 minutos antes de la apertura oficial. Teniendo en cuenta los tiempos de bus, salir del resort con 45-60 minutos de anticipacion.",
            contentShort: "30 min de early entry. Salir con 60 min de anticipacion por el bus.",
            isActiveByDefault: true,
            isHighlightedByDefault: true,
            sortOrder: 2,
          },
          {
            blockDefinitionId: blockDefs["HOTEL_FOOD_COURT"],
            title: "End Zone Food Court",
            content: "El food court del resort ofrece desayuno, almuerzo, cena y snacks con opciones para toda la familia. Practica para comer rapido antes de salir al parque o al regresar.",
            contentShort: "Food court con opciones para todas las comidas.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 3,
          }
        ],
      },
    },
  });
  await prisma.serviceTemplate.upsert({
    where: { id: "tpl-hotel-pop" },
    update: {},
    create: {
      id: "tpl-hotel-pop",
      moduleTypeId: hotelModule.id,
      name: "Disney's Pop Century Resort",
      provider: "Disney",
      category: "Value Resort",
      location: "Walt Disney World, Orlando FL",
      description: "Resort tematico por decadas del siglo XX con acceso al Skyliner hacia EPCOT y Hollywood Studios.",
      metadata: {"resort_level": "value", "disney_transport": true, "has_skyliner": true},
      isSystem: true,
      templateBlocks: {
        create: [
          {
            blockDefinitionId: blockDefs["HOTEL_TRANSPORT"],
            title: "Transporte a los Parques",
            content: "Bus gratuito Disney a todos los parques y Disney Springs. Tiempos de espera tipicos de 15-30 minutos. El Pop Century tiene acceso al Disney Skyliner con servicio directo a EPCOT y Hollywood Studios.",
            contentShort: "Bus gratuito a todos los parques. Pop tiene Skyliner a EPCOT y HS.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 1,
          },
          {
            blockDefinitionId: blockDefs["HOTEL_EARLY_ENTRY"],
            title: "Early Theme Park Entry",
            content: "Como huesped de Disney World se tiene acceso 30 minutos antes de la apertura oficial. Teniendo en cuenta los tiempos de bus, salir del resort con 45-60 minutos de anticipacion.",
            contentShort: "30 min de early entry. Salir con 60 min de anticipacion por el bus.",
            isActiveByDefault: true,
            isHighlightedByDefault: true,
            sortOrder: 2,
          },
          {
            blockDefinitionId: blockDefs["HOTEL_FOOD_COURT"],
            title: "Everything Pop Food Court",
            content: "El food court del resort ofrece desayuno, almuerzo, cena y snacks con opciones para toda la familia. Practica para comer rapido antes de salir al parque o al regresar.",
            contentShort: "Food court con opciones para todas las comidas.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 3,
          }
        ],
      },
    },
  });
  await prisma.serviceTemplate.upsert({
    where: { id: "tpl-hotel-aoa" },
    update: {},
    create: {
      id: "tpl-hotel-aoa",
      moduleTypeId: hotelModule.id,
      name: "Disney's Art of Animation Resort",
      provider: "Disney",
      category: "Value Resort",
      location: "Walt Disney World, Orlando FL",
      description: "Resort value con suites tematicas de Cars, Nemo, Lion King y Little Mermaid. Acceso al Skyliner.",
      metadata: {"resort_level": "value", "has_skyliner": true, "has_family_suites": true},
      isSystem: true,
      templateBlocks: {
        create: [
          {
            blockDefinitionId: blockDefs["HOTEL_TRANSPORT"],
            title: "Transporte \u2014 Skyliner + Bus",
            content: "Art of Animation tiene acceso directo al Disney Skyliner (gondolas aereas), con servicio a EPCOT y Hollywood Studios sin transbordos. Bus gratuito a Magic Kingdom, Animal Kingdom y Disney Springs.",
            contentShort: "Skyliner a EPCOT y HS. Bus a MK y AK.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 1,
          },
          {
            blockDefinitionId: blockDefs["HOTEL_EARLY_ENTRY"],
            title: "Early Theme Park Entry",
            content: "Acceso 30 minutos antes de la apertura a todos los parques Disney. El Skyliner hace muy facil aprovechar el early entry en EPCOT (ir a Guardians o Remy) o Hollywood Studios (Rise of the Resistance).",
            contentShort: "30 min antes. Skyliner hace el early entry de EPCOT muy eficiente.",
            isActiveByDefault: true,
            isHighlightedByDefault: true,
            sortOrder: 2,
          },
          {
            blockDefinitionId: blockDefs["HOTEL_AMENITIES"],
            title: "Suites Tematicas y Servicios",
            content: "Art of Animation es uno de los pocos resorts value con Family Suites, que duermen hasta 6 personas con kitchenette, dos banos y dos televisores. Las suites estan temadas en Cars, Finding Nemo y Lion King.\n\nLa piscina Big Blue Wave es la mas grande de Disney World.",
            contentShort: "Family Suites para 6 personas. Piscina Big Blue Wave, la mayor de Disney.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 3,
          },
          {
            blockDefinitionId: blockDefs["HOTEL_FOOD_COURT"],
            title: "Landscape of Flavors",
            content: "El food court mas grande de Disney World con 5 estaciones de cocina: asiatica, latinoamericana, americana, italiana y pizzeria. Mucho espacio y variedad. Ideal para grupos grandes o familias.",
            contentShort: "Food court mas grande de Disney. 5 estaciones de cocina.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 4,
          }
        ],
      },
    },
  });
  await prisma.serviceTemplate.upsert({
    where: { id: "tpl-hotel-cb" },
    update: {},
    create: {
      id: "tpl-hotel-cb",
      moduleTypeId: hotelModule.id,
      name: "Disney's Caribbean Beach Resort",
      provider: "Disney",
      category: "Moderate Resort",
      location: "Walt Disney World, Orlando FL",
      description: "Resort moderado tematico del Caribe con acceso al Skyliner, lago central y ambiente relajado.",
      metadata: {"resort_level": "moderate", "has_skyliner": true},
      isSystem: true,
      templateBlocks: {
        create: [
          {
            blockDefinitionId: blockDefs["HOTEL_TRANSPORT"],
            title: "Skyliner Directo + Bus",
            content: "Caribbean Beach es la estacion central del Disney Skyliner, con lineas directas a EPCOT, Hollywood Studios, Pop Century y Art of Animation. Bus gratuito a Magic Kingdom, Animal Kingdom y Disney Springs.",
            contentShort: "Skyliner directo a EPCOT y HS. Es la estacion hub del sistema Skyliner.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 1,
          },
          {
            blockDefinitionId: blockDefs["HOTEL_EARLY_ENTRY"],
            title: "Early Theme Park Entry",
            content: "30 minutos de early entry a todos los parques Disney. Con el Skyliner, llegar a EPCOT para early entry es muy rapido \u2014 ideal para Guardians of the Galaxy o Remy's Ratatouille.",
            contentShort: "Skyliner hace EPCOT early entry muy accesible desde Caribbean Beach.",
            isActiveByDefault: true,
            isHighlightedByDefault: true,
            sortOrder: 2,
          },
          {
            blockDefinitionId: blockDefs["HOTEL_AMENITIES"],
            title: "Lago y Piscinas",
            content: "El resort rodea un lago central navegable con canoas y kayaks para alquilar. La piscina Fuentes del Morro tiene tobogan y area infantil. Las cabanas del complejo tienen nombres de islas caribe\u00f1as.",
            contentShort: "Lago con canoas. Piscina con tobogan. Ambiente caribe\u00f1o relajado.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 3,
          },
          {
            blockDefinitionId: blockDefs["HOTEL_DINING"],
            title: "Sebastian's Bistro",
            content: "Restaurante de mesa servida con cocina caribena e influencias latinoamericanas. Buen precio para un table service de Disney. Reservas recomendadas con 60 dias de anticipacion en My Disney Experience.",
            contentShort: "Sebastian's Bistro: excelente table service a precio moderado. Reservar 60 dias antes.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 4,
          }
        ],
      },
    },
  });
  await prisma.serviceTemplate.upsert({
    where: { id: "tpl-hotel-cs" },
    update: {},
    create: {
      id: "tpl-hotel-cs",
      moduleTypeId: hotelModule.id,
      name: "Disney's Coronado Springs Resort",
      provider: "Disney",
      category: "Moderate Resort",
      location: "Walt Disney World, Orlando FL",
      description: "El mayor resort moderado de Disney, con la impresionante Gran Destino Tower, piscina Dorado y ambiente hispanico.",
      metadata: {"resort_level": "moderate", "has_gran_destino": true},
      isSystem: true,
      templateBlocks: {
        create: [
          {
            blockDefinitionId: blockDefs["HOTEL_TRANSPORT"],
            title: "Transporte a los Parques",
            content: "Bus gratuito Disney a todos los parques. Coronado Springs es el resort mas grande, por lo que las paradas de bus pueden requerir caminar dentro del resort.",
            contentShort: "Bus gratuito a todos los parques. Resort grande \u2014 caminar a la parada.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 1,
          },
          {
            blockDefinitionId: blockDefs["HOTEL_EARLY_ENTRY"],
            title: "Early Theme Park Entry",
            content: "Acceso 30 minutos antes de la apertura oficial a todos los parques Disney. Recomendado salir con anticipacion dado el tamano del resort.",
            contentShort: "30 min early entry. Salir 60 min antes del opening por el tamano del resort.",
            isActiveByDefault: true,
            isHighlightedByDefault: true,
            sortOrder: 2,
          },
          {
            blockDefinitionId: blockDefs["HOTEL_AMENITIES"],
            title: "Gran Destino Tower y Piscina Dorado",
            content: "El Gran Destino Tower es una torre de lujo dentro del resort con habitaciones superiores y vistas panoramicas. La piscina principal El Dorado tiene un gran tobogan y es de las mejores de los resorts moderados.",
            contentShort: "Gran Destino Tower con vistas superiores. Piscina Dorado de alta calidad.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 3,
          },
          {
            blockDefinitionId: blockDefs["HOTEL_DINING"],
            title: "Toledo y Dahlia Lounge",
            content: "Toledo (Gran Destino Tower) es un restaurante de mesa servida con cocina espanola e inspiracion latinoamericana, con vistas al resort desde el piso 16. Dahlia Lounge es el lobby bar de ambiente elegante.",
            contentShort: "Toledo en Gran Destino: vistas increibles. Dahlia Lounge para cocktails.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 4,
          }
        ],
      },
    },
  });
  await prisma.serviceTemplate.upsert({
    where: { id: "tpl-hotel-poly" },
    update: {},
    create: {
      id: "tpl-hotel-poly",
      moduleTypeId: hotelModule.id,
      name: "Disney's Polynesian Village Resort",
      provider: "Disney",
      category: "Deluxe Resort",
      location: "Walt Disney World, Orlando FL",
      description: "Resort de lujo con tematica polinesiana, acceso al Monorail hacia Magic Kingdom y playa sobre el Seven Seas Lagoon.",
      metadata: {"resort_level": "deluxe", "has_monorail": true, "disney_transport": true},
      isSystem: true,
      templateBlocks: {
        create: [
          {
            blockDefinitionId: blockDefs["HOTEL_TRANSPORT"],
            title: "Monorail Directo a Magic Kingdom",
            content: "El Polynesian tiene estacion de Monorail propia con acceso directo a Magic Kingdom y al TTC (Transfer Ticket Center) donde conecta con el Monorail a EPCOT. Tambien ferry al Magic Kingdom y bus a Animal Kingdom y Hollywood Studios.",
            contentShort: "Monorail directo a MK. Ferry al lago. Bus a AK y HS.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 1,
          },
          {
            blockDefinitionId: blockDefs["HOTEL_EARLY_ENTRY"],
            title: "Early Theme Park Entry",
            content: "Acceso 30 minutos antes a todos los parques Disney. El Monorail hace el early entry a Magic Kingdom muy facil \u2014 sin bus, sin esperas. Salir con 20 minutos de anticipacion es suficiente.",
            contentShort: "Monorail hace early entry en MK muy facil. Solo 20 min de anticipacion.",
            isActiveByDefault: true,
            isHighlightedByDefault: true,
            sortOrder: 2,
          },
          {
            blockDefinitionId: blockDefs["HOTEL_AMENITIES"],
            title: "Playa y Piscina Lava Pool",
            content: "El Polynesian tiene una playa privada sobre el Seven Seas Lagoon con vistas directas al castillo de Magic Kingdom y los fuegos artificiales nocturnos. La piscina Lava Pool tiene tobogan tematico volcanico. Spa y salon de belleza disponibles.",
            contentShort: "Playa con vista al castillo. Fuegos artificiales desde la orilla. Lava Pool.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 3,
          },
          {
            blockDefinitionId: blockDefs["HOTEL_DINING"],
            title: "Ohana y Trader Sam's",
            content: "'Ohana es el restaurante mas popular del Polynesian \u2014 cena familiar estilo polinesio con personajes Disney en el desayuno. Trader Sam's Grog Grotto es el bar tematico de Disney mas divertido, con efectos especiales al pedir tragos especiales. Reservas con mucha anticipacion.",
            contentShort: "Ohana: character breakfast imperdible. Trader Sam's: bar mas divertido de Disney.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 4,
          }
        ],
      },
    },
  });
  await prisma.serviceTemplate.upsert({
    where: { id: "tpl-hotel-contemp" },
    update: {},
    create: {
      id: "tpl-hotel-contemp",
      moduleTypeId: hotelModule.id,
      name: "Disney's Contemporary Resort",
      provider: "Disney",
      category: "Deluxe Resort",
      location: "Walt Disney World, Orlando FL",
      description: "El unico hotel del mundo con un Monorail que pasa por adentro. A pasos caminando de Magic Kingdom.",
      metadata: {"resort_level": "deluxe", "has_monorail": true, "walkable_to_mk": true},
      isSystem: true,
      templateBlocks: {
        create: [
          {
            blockDefinitionId: blockDefs["HOTEL_TRANSPORT"],
            title: "Monorail ATRAVIESA el Hotel",
            content: "El Contemporary es unico: el Monorail pasa literalmente por el centro del edificio (piso 4). Acceso directo a Magic Kingdom en minutos. Tambien se puede caminar a MK (10-15 min a pie). Bus a EPCOT, HS, AK y Disney Springs.",
            contentShort: "Monorail pasa por adentro del hotel. Caminando 10 min a Magic Kingdom.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 1,
          },
          {
            blockDefinitionId: blockDefs["HOTEL_EARLY_ENTRY"],
            title: "Early Theme Park Entry",
            content: "El Contemporary es el resort con mayor ventaja para early entry en Magic Kingdom. Se puede llegar caminando o en Monorail en menos de 10 minutos desde la habitacion.",
            contentShort: "Early entry en MK incomparable: caminando o monorail en menos de 10 min.",
            isActiveByDefault: true,
            isHighlightedByDefault: true,
            sortOrder: 2,
          },
          {
            blockDefinitionId: blockDefs["HOTEL_AMENITIES"],
            title: "Vista al Lago y Bay Lake Tower",
            content: "Habitaciones con vistas al lago Bay Lake y al Magic Kingdom. Bay Lake Tower es la seccion DVC del resort. Piscina principal con vista y acceso a actividades acuaticas en el lago.",
            contentShort: "Vistas al lago y al castillo desde las habitaciones. Bay Lake Tower premium.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 3,
          },
          {
            blockDefinitionId: blockDefs["HOTEL_DINING"],
            title: "California Grill y Chef Mickey's",
            content: "California Grill en el piso 15: uno de los mejores restaurantes de Disney con vistas panoramicas y fuegos artificiales del Magic Kingdom. Chef Mickey's: character dining de desayuno y cena, muy popular para familias.",
            contentShort: "California Grill: vistas a fuegos artificiales desde piso 15. Chef Mickey's character dining.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 4,
          }
        ],
      },
    },
  });
  await prisma.serviceTemplate.upsert({
    where: { id: "tpl-hotel-riv" },
    update: {},
    create: {
      id: "tpl-hotel-riv",
      moduleTypeId: hotelModule.id,
      name: "Disney's Riviera Resort",
      provider: "Disney",
      category: "Deluxe DVC Resort",
      location: "Walt Disney World, Orlando FL",
      description: "Resort de lujo con inspiracion francesa e italiana, acceso al Skyliner y el restaurante Topolino's Terrace con vistas a los fuegos artificiales.",
      metadata: {"resort_level": "deluxe", "has_skyliner": true, "dvc": true},
      isSystem: true,
      templateBlocks: {
        create: [
          {
            blockDefinitionId: blockDefs["HOTEL_TRANSPORT"],
            title: "Disney Skyliner Exclusivo",
            content: "El Riviera tiene su propia estacion de Skyliner con acceso directo a EPCOT y Hollywood Studios. El Skyliner ofrece vistas panoramicas del resort y de los parques. Bus a Magic Kingdom y Animal Kingdom.",
            contentShort: "Skyliner propio a EPCOT y HS. Vistas panoramicas desde las gondolas.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 1,
          },
          {
            blockDefinitionId: blockDefs["HOTEL_EARLY_ENTRY"],
            title: "Early Theme Park Entry",
            content: "30 minutos de early entry. Con el Skyliner, llegar a EPCOT para early entry toma menos de 15 minutos desde el resort. Ideal para ir a Guardians of the Galaxy o Remy's Ratatouille.",
            contentShort: "Skyliner hace early entry en EPCOT en menos de 15 min.",
            isActiveByDefault: true,
            isHighlightedByDefault: true,
            sortOrder: 2,
          },
          {
            blockDefinitionId: blockDefs["HOTEL_AMENITIES"],
            title: "Arquitectura Europea y Rooftop",
            content: "El Riviera combina la elegancia de la Riviera francesa e italiana. Bar en la terraza con vistas al horizonte de Disney. Piscina con fuente y area de recreacion. DVC resort con unidades de villa disponibles.",
            contentShort: "Bar en terraza con vistas. Piscina. Arquitectura elegante francesa-italiana.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 3,
          },
          {
            blockDefinitionId: blockDefs["HOTEL_DINING"],
            title: "Topolino's Terrace",
            content: "Topolino's Terrace en el piso 10 ofrece character breakfast con Mickey y amigos disfrazados de artistas franceses, y cena con vistas a los fuegos artificiales de EPCOT y Hollywood Studios. Uno de los mejores restaurantes de Disney actualmente. Reservar con 60 dias de anticipacion.",
            contentShort: "Topolino's: character breakfast + cena con fuegos. Reservar 60 dias antes.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 4,
          }
        ],
      },
    },
  });
  console.log("  + 9 hoteles Disney adicionales creados");
  console.log("\n Creando hoteles Universal...");
  await prisma.serviceTemplate.upsert({
    where: { id: "tpl-hotel-hardrock" },
    update: {},
    create: {
      id: "tpl-hotel-hardrock",
      moduleTypeId: hotelModule.id,
      name: "Hard Rock Hotel at Universal Orlando",
      provider: "Universal",
      category: "Premier Resort",
      location: "Universal Orlando Resort, FL",
      description: "Hotel Premier rock & roll a pasos de los parques. Incluye Universal Express Unlimited y acceso anticipado de 1 hora.",
      metadata: {"resort_level": "premier", "express_pass_included": true, "walk_to_parks": true},
      isSystem: true,
      templateBlocks: {
        create: [
          {
            blockDefinitionId: blockDefs["HOTEL_TRANSPORT"],
            title: "Ubicacion \u2014 A Pasos de los Parques",
            content: "El Hard Rock Hotel esta a 5-10 minutos caminando de los parques Universal Studios y Islands of Adventure. Tambien hay servicio de lancha acuatica al City Walk. No se depende de buses.",
            contentShort: "5-10 min caminando a los parques. Lancha acuatica disponible.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 1,
          },
          {
            blockDefinitionId: blockDefs["HOTEL_EARLY_ENTRY"],
            title: "Express Unlimited + Early Park Admission",
            content: "Como huesped Premier, se incluye Universal Express Unlimited para ambos parques \u2014 evita filas en casi todas las atracciones. Valor de mercado: USD 100-200 por persona por dia.\n\nAdem\u00e1s, todos los huespedes on-site reciben Early Park Admission: acceso 1 hora antes de la apertura oficial a Universal Studios y Islands of Adventure.",
            contentShort: "Express Unlimited incluido. Evita filas en todas las atracciones. Valor: USD 100-200/persona/dia.",
            isActiveByDefault: true,
            isHighlightedByDefault: true,
            sortOrder: 2,
          },
          {
            blockDefinitionId: blockDefs["HOTEL_AMENITIES"],
            title: "Rock Star Suite y Piscina",
            content: "Memorabilia de rock autentico en todo el hotel. Piscina zero-entry con area de arena, musica en vivo los fines de semana. Business center, spa y sala de fitness. Ambiente energico y divertido.",
            contentShort: "Memorabilia de rock. Piscina zero-entry con area de arena y musica en vivo.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 3,
          },
          {
            blockDefinitionId: blockDefs["HOTEL_DINING"],
            title: "The Kitchen",
            content: "The Kitchen es el restaurante principal con cocina americana, hamburguesas de autor y menu amplio. Palm Restaurant para carnes premium. Java bar para desayunos rapidos antes del parque.",
            contentShort: "The Kitchen: cocina americana. Palm Restaurant para carnes. Java bar para desayunos.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 4,
          }
        ],
      },
    },
  });
  await prisma.serviceTemplate.upsert({
    where: { id: "tpl-hotel-portofino" },
    update: {},
    create: {
      id: "tpl-hotel-portofino",
      moduleTypeId: hotelModule.id,
      name: "Loews Portofino Bay Hotel",
      provider: "Universal",
      category: "Premier Resort",
      location: "Universal Orlando Resort, FL",
      description: "El hotel mas romantico y elegante de Universal, inspirado en el pueblo costero de Portofino, Italia. Incluye Express Unlimited.",
      metadata: {"resort_level": "premier", "express_pass_included": true, "theme": "italian_riviera"},
      isSystem: true,
      templateBlocks: {
        create: [
          {
            blockDefinitionId: blockDefs["HOTEL_TRANSPORT"],
            title: "Lancha Acuatica + Caminata",
            content: "Servicio de lancha acuatica por el lago hasta City Walk y los parques \u2014 la manera mas glamorosa de llegar. Tambien acceso peatonal de 10-15 minutos.",
            contentShort: "Lancha acuatica al parque \u2014 la manera mas elegante de llegar.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 1,
          },
          {
            blockDefinitionId: blockDefs["HOTEL_EARLY_ENTRY"],
            title: "Express Unlimited + Early Admission",
            content: "Como huesped Premier, se incluye Universal Express Unlimited para ambos parques \u2014 evita filas en casi todas las atracciones. Valor de mercado: USD 100-200 por persona por dia.\n\nEarly Park Admission 1 hora antes incluido para todos los huespedes.",
            contentShort: "Express Unlimited incluido. Evita filas en todas las atracciones. Valor: USD 100-200/persona/dia.",
            isActiveByDefault: true,
            isHighlightedByDefault: true,
            sortOrder: 2,
          },
          {
            blockDefinitionId: blockDefs["HOTEL_AMENITIES"],
            title: "Tres Piscinas y Spa",
            content: "Tres piscinas tematicas incluyendo la piscina principal con vista a la bahia italiana. Mandara Spa de clase mundial, cancha de bocce, musica clasica italiana en la piazza. Ambiente de resort de lujo europeo.",
            contentShort: "Tres piscinas. Mandara Spa. Piazza con musica italiana en vivo.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 3,
          },
          {
            blockDefinitionId: blockDefs["HOTEL_DINING"],
            title: "Mama Della's y Trattoria del Porto",
            content: "Mama Della's Ristorante: cocina italiana autentica en ambiente familiar. Trattoria del Porto: desayunos y opciones todo el dia. Gelateria con helados artesanales.",
            contentShort: "Mama Della's para cena italiana. Gelateria para postre.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 4,
          }
        ],
      },
    },
  });
  await prisma.serviceTemplate.upsert({
    where: { id: "tpl-hotel-royalpac" },
    update: {},
    create: {
      id: "tpl-hotel-royalpac",
      moduleTypeId: hotelModule.id,
      name: "Loews Royal Pacific Resort",
      provider: "Universal",
      category: "Premier Resort",
      location: "Universal Orlando Resort, FL",
      description: "Resort de estilo pacifico sur con ambientes tropicales. Incluye Express Unlimited y es uno de los favoritos de familias.",
      metadata: {"resort_level": "premier", "express_pass_included": true, "theme": "south_pacific"},
      isSystem: true,
      templateBlocks: {
        create: [
          {
            blockDefinitionId: blockDefs["HOTEL_TRANSPORT"],
            title: "Lancha + Caminata al Parque",
            content: "Lancha acuatica desde el dock del hotel hasta City Walk en 5 minutos. Caminata de 10 minutos a los parques. Acceso muy comodo desde el resort.",
            contentShort: "Lancha al parque en 5 min. Caminata de 10 min.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 1,
          },
          {
            blockDefinitionId: blockDefs["HOTEL_EARLY_ENTRY"],
            title: "Express Unlimited + Early Admission",
            content: "Como huesped Premier, se incluye Universal Express Unlimited para ambos parques \u2014 evita filas en casi todas las atracciones. Valor de mercado: USD 100-200 por persona por dia.\n\nEarly Park Admission 1 hora antes incluido.",
            contentShort: "Express Unlimited incluido. Evita filas en todas las atracciones. Valor: USD 100-200/persona/dia.",
            isActiveByDefault: true,
            isHighlightedByDefault: true,
            sortOrder: 2,
          },
          {
            blockDefinitionId: blockDefs["HOTEL_AMENITIES"],
            title: "Piscina Lagoon y Luau",
            content: "Gran piscina tipo laguna con musica tropical. Wantilan Luau dinner show los sabados por la noche \u2014 cena polinesia con bailes y fuego, muy popular para familias. Sala de juegos.",
            contentShort: "Piscina laguna tropical. Wantilan Luau dinner show los sabados.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 3,
          },
          {
            blockDefinitionId: blockDefs["HOTEL_DINING"],
            title: "Emeril's Tchoup Chop",
            content: "Tchoup Chop del chef Emeril Lagasse con cocina asiatica-polinesia premium. Islands Dining Room para opciones familiares en desayuno y cena. Jake's American Bar para snacks y bebidas.",
            contentShort: "Tchoup Chop de Emeril para cena especial. Islands Dining Room familiar.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 4,
          }
        ],
      },
    },
  });
  await prisma.serviceTemplate.upsert({
    where: { id: "tpl-hotel-helios" },
    update: {},
    create: {
      id: "tpl-hotel-helios",
      moduleTypeId: hotelModule.id,
      name: "Helios Grand Hotel at Epic Universe",
      provider: "Universal",
      category: "Premier Resort",
      location: "Universal Orlando Resort, FL",
      description: "El hotel premier mas nuevo de Universal, ubicado dentro del complejo Epic Universe. Incluye Express Unlimited para Epic Universe.",
      metadata: {"resort_level": "premier", "express_pass_included": true, "epic_universe": true, "opened": "2025"},
      isSystem: true,
      templateBlocks: {
        create: [
          {
            blockDefinitionId: blockDefs["HOTEL_TRANSPORT"],
            title: "Dentro de Epic Universe",
            content: "Helios Grand esta fisicamente dentro del complejo Epic Universe, con acceso peatonal directo al parque. Bus a Universal Studios y Islands of Adventure. La ubicacion es incomparable para visitantes de Epic Universe.",
            contentShort: "Ubicado dentro de Epic Universe. Acceso peatonal directo al parque.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 1,
          },
          {
            blockDefinitionId: blockDefs["HOTEL_EARLY_ENTRY"],
            title: "Express Unlimited Epic Universe + Early Admission",
            content: "Los huespedes de Helios Grand reciben Express Unlimited para Epic Universe incluido \u2014 especialmente valioso siendo el parque mas nuevo con tiempos de espera altos. Early Park Admission 1 hora antes.\n\nPara USF e IOA tambien aplica Early Admission pero no Express.",
            contentShort: "Express Unlimited incluido para Epic Universe. Imprescindible para 2025-2026.",
            isActiveByDefault: true,
            isHighlightedByDefault: true,
            sortOrder: 2,
          },
          {
            blockDefinitionId: blockDefs["HOTEL_AMENITIES"],
            title: "Diseno Moderno y Rooftop",
            content: "Hotel de diseno contemporaneo abierto en mayo 2025. Rooftop pool bar con vistas al parque Epic Universe. Arquitectura inspirada en el universo y la exploracion espacial.",
            contentShort: "Rooftop pool con vistas a Epic Universe. Diseno moderno 2025.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 3,
          },
          {
            blockDefinitionId: blockDefs["HOTEL_DINING"],
            title: "Restaurantes del Resort",
            content: "Multiples opciones de gastronomia dentro del hotel, incluyendo restaurante principal, bar y opciones rapidas. Detalle de restaurantes a confirmar con apertura completa en 2025.",
            contentShort: "Multiples opciones de dining. Confirmar con novedades del hotel en 2025.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 4,
          }
        ],
      },
    },
  });
  await prisma.serviceTemplate.upsert({
    where: { id: "tpl-hotel-cabana" },
    update: {},
    create: {
      id: "tpl-hotel-cabana",
      moduleTypeId: hotelModule.id,
      name: "Universal's Cabana Bay Beach Resort",
      provider: "Universal",
      category: "On-Site Resort",
      location: "Universal Orlando Resort, FL",
      description: "Resort value-plus con tematica retro de los anos 50, bowling alley, y con acceso caminando a Epic Universe.",
      metadata: {"resort_level": "on_site", "express_pass_included": false, "early_admission": true},
      isSystem: true,
      templateBlocks: {
        create: [
          {
            blockDefinitionId: blockDefs["HOTEL_TRANSPORT"],
            title: "Transporte a los Parques",
            content: "Puente peatonal directo a Epic Universe (abierto 2025). Bus a Universal Studios y Islands of Adventure.",
            contentShort: "Puente peatonal directo a Epic Universe (abierto 2025).",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 1,
          },
          {
            blockDefinitionId: blockDefs["HOTEL_EARLY_ENTRY"],
            title: "Early Park Admission",
            content: "Como huesped on-site, se tiene acceso 1 hora antes de la apertura oficial a Universal Studios Florida, Islands of Adventure y Epic Universe. No incluye Express Pass \u2014 evaluar compra por separado segun afluencia esperada.",
            contentShort: "1 hora de early admission incluida. Express Pass no incluido \u2014 comprar si hay alta demanda.",
            isActiveByDefault: true,
            isHighlightedByDefault: true,
            sortOrder: 2,
          },
          {
            blockDefinitionId: blockDefs["HOTEL_AMENITIES"],
            title: "Servicios del Resort",
            content: "Bowling alley, dos piscinas, food truck court, ambiente retro muy fotografiable.",
            contentShort: "Bowling alley, dos piscinas, food truck court, ambiente retro muy fotografiable.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 3,
          }
        ],
      },
    },
  });
  await prisma.serviceTemplate.upsert({
    where: { id: "tpl-hotel-endless" },
    update: {},
    create: {
      id: "tpl-hotel-endless",
      moduleTypeId: hotelModule.id,
      name: "Universal's Endless Summer Resort - Surfside",
      provider: "Universal",
      category: "On-Site Resort",
      location: "Universal Orlando Resort, FL",
      description: "El resort mas economico de Universal con tematica de surf y playa. Ideal para presupuesto ajustado.",
      metadata: {"resort_level": "on_site", "express_pass_included": false, "early_admission": true},
      isSystem: true,
      templateBlocks: {
        create: [
          {
            blockDefinitionId: blockDefs["HOTEL_TRANSPORT"],
            title: "Transporte a los Parques",
            content: "Bus shuttle a los parques Universal. Aproximadamente 10-15 minutos.",
            contentShort: "Bus shuttle a los parques Universal.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 1,
          },
          {
            blockDefinitionId: blockDefs["HOTEL_EARLY_ENTRY"],
            title: "Early Park Admission",
            content: "Como huesped on-site, se tiene acceso 1 hora antes de la apertura oficial a Universal Studios Florida, Islands of Adventure y Epic Universe. No incluye Express Pass \u2014 evaluar compra por separado segun afluencia esperada.",
            contentShort: "1 hora de early admission incluida. Express Pass no incluido \u2014 comprar si hay alta demanda.",
            isActiveByDefault: true,
            isHighlightedByDefault: true,
            sortOrder: 2,
          },
          {
            blockDefinitionId: blockDefs["HOTEL_AMENITIES"],
            title: "Servicios del Resort",
            content: "Piscina grande con area de splash. Food truck court. Ambiente playero relajado.",
            contentShort: "Piscina grande con area de splash.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 3,
          }
        ],
      },
    },
  });
  await prisma.serviceTemplate.upsert({
    where: { id: "tpl-hotel-aventura" },
    update: {},
    create: {
      id: "tpl-hotel-aventura",
      moduleTypeId: hotelModule.id,
      name: "Universal's Aventura Hotel",
      provider: "Universal",
      category: "On-Site Resort",
      location: "Universal Orlando Resort, FL",
      description: "Hotel moderno con rooftop bar, arquitectura contemporanea y opciones para todos los presupuestos.",
      metadata: {"resort_level": "on_site", "express_pass_included": false, "early_admission": true},
      isSystem: true,
      templateBlocks: {
        create: [
          {
            blockDefinitionId: blockDefs["HOTEL_TRANSPORT"],
            title: "Transporte a los Parques",
            content: "Bus shuttle a los parques. Ubicado cerca de Endless Summer.",
            contentShort: "Bus shuttle a los parques.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 1,
          },
          {
            blockDefinitionId: blockDefs["HOTEL_EARLY_ENTRY"],
            title: "Early Park Admission",
            content: "Como huesped on-site, se tiene acceso 1 hora antes de la apertura oficial a Universal Studios Florida, Islands of Adventure y Epic Universe. No incluye Express Pass \u2014 evaluar compra por separado segun afluencia esperada.",
            contentShort: "1 hora de early admission incluida. Express Pass no incluido \u2014 comprar si hay alta demanda.",
            isActiveByDefault: true,
            isHighlightedByDefault: true,
            sortOrder: 2,
          },
          {
            blockDefinitionId: blockDefs["HOTEL_AMENITIES"],
            title: "Servicios del Resort",
            content: "Bar en la terraza con vistas panoramicas. Diseno moderno y minimalista. Kids suite disponible.",
            contentShort: "Bar en la terraza con vistas panoramicas.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 3,
          }
        ],
      },
    },
  });
  await prisma.serviceTemplate.upsert({
    where: { id: "tpl-hotel-sapphire" },
    update: {},
    create: {
      id: "tpl-hotel-sapphire",
      moduleTypeId: hotelModule.id,
      name: "Loews Sapphire Falls Resort",
      provider: "Universal",
      category: "On-Site Resort",
      location: "Universal Orlando Resort, FL",
      description: "Resort con tematica caribena, cascadas y lagunas. El mejor balance precio-calidad entre los hotels on-site.",
      metadata: {"resort_level": "on_site", "express_pass_included": false, "early_admission": true},
      isSystem: true,
      templateBlocks: {
        create: [
          {
            blockDefinitionId: blockDefs["HOTEL_TRANSPORT"],
            title: "Transporte a los Parques",
            content: "Lancha acuatica y bus a los parques. 10-15 min al City Walk.",
            contentShort: "Lancha acuatica y bus a los parques.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 1,
          },
          {
            blockDefinitionId: blockDefs["HOTEL_EARLY_ENTRY"],
            title: "Early Park Admission",
            content: "Como huesped on-site, se tiene acceso 1 hora antes de la apertura oficial a Universal Studios Florida, Islands of Adventure y Epic Universe. No incluye Express Pass \u2014 evaluar compra por separado segun afluencia esperada.",
            contentShort: "1 hora de early admission incluida. Express Pass no incluido \u2014 comprar si hay alta demanda.",
            isActiveByDefault: true,
            isHighlightedByDefault: true,
            sortOrder: 2,
          },
          {
            blockDefinitionId: blockDefs["HOTEL_AMENITIES"],
            title: "Servicios del Resort",
            content: "Piscina con cascada y area de arena. Caribbean market bar. Ambiente tropical relajado.",
            contentShort: "Piscina con cascada y area de arena.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 3,
          }
        ],
      },
    },
  });
  console.log("  + 8 hoteles Universal creados");
  console.log("\n Creando templates de alquiler de autos...");
  await prisma.serviceTemplate.upsert({
    where: { id: "tpl-car-alamo" },
    update: {},
    create: {
      id: "tpl-car-alamo",
      moduleTypeId: carModule.id,
      name: "Alamo Rent A Car \u2014 MCO",
      provider: "Alamo",
      category: "Car Rental",
      location: "Orlando International Airport (MCO), FL",
      description: "Alamo es conocido por su precio competitivo y el sistema de quioscos sin mostrador. Popular entre viajeros frecuentes.",
      metadata: {"airport": "MCO", "provider": "alamo"},
      isSystem: true,
      templateBlocks: {
        create: [
          {
            blockDefinitionId: blockDefs["CAR_INSURANCE"],
            title: "Cobertura y Seguros",
            content: "Al retirar el auto en Alamo, verificar la cobertura del seguro de viaje contratado antes de aceptar o declinar el CDW/LDW del mostrador. Con seguro de viaje que incluya cobertura de auto de alquiler, generalmente se puede declinar el seguro de la empresa.\n\nQuioscos de self-service disponibles para reservas directas \u2014 omite la fila del mostrador en temporada alta.",
            contentShort: "Verificar seguro de viaje antes de declinar coberturas. Quioscos de self-service disponibles para reservas directas \u2014 omite la fila del mostrador en temporada alta.",
            isActiveByDefault: true,
            isHighlightedByDefault: true,
            sortOrder: 1,
          },
          {
            blockDefinitionId: blockDefs["CAR_TOLLS"],
            title: "Peajes en Florida \u2014 SunPass",
            content: "Florida usa peajes electronicos en la mayoria de sus autopistas principales (Florida Turnpike, SR-528, SR-417, SR-408). Se recomienda agregar SunPass o E-ZPass al alquiler para evitar cargos administrativos adicionales por registro manual de patente.",
            contentShort: "Agregar SunPass al alquiler para peajes electronicos automaticos.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 2,
          },
          {
            blockDefinitionId: blockDefs["CAR_FUEL"],
            title: "Combustible \u2014 Politica de Devolucion",
            content: "Devolver el auto con el tanque lleno para evitar los cargos de repostaje de Alamo que son significativamente mas caros que las gasolineras locales. Las gasolineras Costco, BJ's y Sam's Club tienen los mejores precios en el area de Orlando (requiere membresia).\n\nAlamo ofrece precios muy competitivos. Comparar con reserva directa vs intermediarios como Expedia.",
            contentShort: "Devolver con tanque lleno. Mejor precio combustible: Costco o BJ's.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 3,
          }
        ],
      },
    },
  });
  await prisma.serviceTemplate.upsert({
    where: { id: "tpl-car-avis" },
    update: {},
    create: {
      id: "tpl-car-avis",
      moduleTypeId: carModule.id,
      name: "Avis Car Rental \u2014 MCO",
      provider: "Avis",
      category: "Car Rental",
      location: "Orlando International Airport (MCO), FL",
      description: "Avis es una de las marcas premium con flota variada y programa Avis Preferred para skip-counter.",
      metadata: {"airport": "MCO", "provider": "avis"},
      isSystem: true,
      templateBlocks: {
        create: [
          {
            blockDefinitionId: blockDefs["CAR_INSURANCE"],
            title: "Cobertura y Seguros",
            content: "Al retirar el auto en Avis, verificar la cobertura del seguro de viaje contratado antes de aceptar o declinar el CDW/LDW del mostrador. Con seguro de viaje que incluya cobertura de auto de alquiler, generalmente se puede declinar el seguro de la empresa.\n\nAvis Preferred members pueden omitir el mostrador y ir directo al auto en el garage.",
            contentShort: "Verificar seguro de viaje antes de declinar coberturas. Avis Preferred members pueden omitir el mostrador y ir directo al auto en el garage.",
            isActiveByDefault: true,
            isHighlightedByDefault: true,
            sortOrder: 1,
          },
          {
            blockDefinitionId: blockDefs["CAR_TOLLS"],
            title: "Peajes en Florida \u2014 SunPass",
            content: "Florida usa peajes electronicos en la mayoria de sus autopistas principales (Florida Turnpike, SR-528, SR-417, SR-408). Se recomienda agregar SunPass o E-ZPass al alquiler para evitar cargos administrativos adicionales por registro manual de patente.",
            contentShort: "Agregar SunPass al alquiler para peajes electronicos automaticos.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 2,
          },
          {
            blockDefinitionId: blockDefs["CAR_FUEL"],
            title: "Combustible \u2014 Politica de Devolucion",
            content: "Devolver el auto con el tanque lleno para evitar los cargos de repostaje de Avis que son significativamente mas caros que las gasolineras locales. Las gasolineras Costco, BJ's y Sam's Club tienen los mejores precios en el area de Orlando (requiere membresia).\n\nFlota premium incluye marcas europeas. Comparar tarifa 'Avis Preferred Plus' que incluye GPS.",
            contentShort: "Devolver con tanque lleno. Mejor precio combustible: Costco o BJ's.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 3,
          }
        ],
      },
    },
  });
  await prisma.serviceTemplate.upsert({
    where: { id: "tpl-car-budget" },
    update: {},
    create: {
      id: "tpl-car-budget",
      moduleTypeId: carModule.id,
      name: "Budget Car Rental \u2014 MCO",
      provider: "Budget",
      category: "Car Rental",
      location: "Orlando International Airport (MCO), FL",
      description: "Budget ofrece precios economicos siendo parte del grupo Avis. Fastbreak para skip-counter.",
      metadata: {"airport": "MCO", "provider": "budget"},
      isSystem: true,
      templateBlocks: {
        create: [
          {
            blockDefinitionId: blockDefs["CAR_INSURANCE"],
            title: "Cobertura y Seguros",
            content: "Al retirar el auto en Budget, verificar la cobertura del seguro de viaje contratado antes de aceptar o declinar el CDW/LDW del mostrador. Con seguro de viaje que incluya cobertura de auto de alquiler, generalmente se puede declinar el seguro de la empresa.\n\nBudget Fastbreak permite ir directo al auto sin esperar en el mostrador.",
            contentShort: "Verificar seguro de viaje antes de declinar coberturas. Budget Fastbreak permite ir directo al auto sin esperar en el mostrador.",
            isActiveByDefault: true,
            isHighlightedByDefault: true,
            sortOrder: 1,
          },
          {
            blockDefinitionId: blockDefs["CAR_TOLLS"],
            title: "Peajes en Florida \u2014 SunPass",
            content: "Florida usa peajes electronicos en la mayoria de sus autopistas principales (Florida Turnpike, SR-528, SR-417, SR-408). Se recomienda agregar SunPass o E-ZPass al alquiler para evitar cargos administrativos adicionales por registro manual de patente.",
            contentShort: "Agregar SunPass al alquiler para peajes electronicos automaticos.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 2,
          },
          {
            blockDefinitionId: blockDefs["CAR_FUEL"],
            title: "Combustible \u2014 Politica de Devolucion",
            content: "Devolver el auto con el tanque lleno para evitar los cargos de repostaje de Budget que son significativamente mas caros que las gasolineras locales. Las gasolineras Costco, BJ's y Sam's Club tienen los mejores precios en el area de Orlando (requiere membresia).\n\nTarifas economicas. Verificar si incluye conductor adicional \u2014 a veces tiene cargo extra.",
            contentShort: "Devolver con tanque lleno. Mejor precio combustible: Costco o BJ's.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 3,
          }
        ],
      },
    },
  });
  await prisma.serviceTemplate.upsert({
    where: { id: "tpl-car-enterprise" },
    update: {},
    create: {
      id: "tpl-car-enterprise",
      moduleTypeId: carModule.id,
      name: "Enterprise Rent-A-Car \u2014 MCO",
      provider: "Enterprise",
      category: "Car Rental",
      location: "Orlando International Airport (MCO), FL",
      description: "Enterprise es la flota mas grande de EE.UU., conocida por servicio al cliente y disponibilidad de autos.",
      metadata: {"airport": "MCO", "provider": "enterprise"},
      isSystem: true,
      templateBlocks: {
        create: [
          {
            blockDefinitionId: blockDefs["CAR_INSURANCE"],
            title: "Cobertura y Seguros",
            content: "Al retirar el auto en Enterprise, verificar la cobertura del seguro de viaje contratado antes de aceptar o declinar el CDW/LDW del mostrador. Con seguro de viaje que incluya cobertura de auto de alquiler, generalmente se puede declinar el seguro de la empresa.\n\nEnterprise Plus members pueden omitir el mostrador. Servicio de pickup en algunos hoteles disponible.",
            contentShort: "Verificar seguro de viaje antes de declinar coberturas. Enterprise Plus members pueden omitir el mostrador.",
            isActiveByDefault: true,
            isHighlightedByDefault: true,
            sortOrder: 1,
          },
          {
            blockDefinitionId: blockDefs["CAR_TOLLS"],
            title: "Peajes en Florida \u2014 SunPass",
            content: "Florida usa peajes electronicos en la mayoria de sus autopistas principales (Florida Turnpike, SR-528, SR-417, SR-408). Se recomienda agregar SunPass o E-ZPass al alquiler para evitar cargos administrativos adicionales por registro manual de patente.",
            contentShort: "Agregar SunPass al alquiler para peajes electronicos automaticos.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 2,
          },
          {
            blockDefinitionId: blockDefs["CAR_FUEL"],
            title: "Combustible \u2014 Politica de Devolucion",
            content: "Devolver el auto con el tanque lleno para evitar los cargos de repostaje de Enterprise que son significativamente mas caros que las gasolineras locales. Las gasolineras Costco, BJ's y Sam's Club tienen los mejores precios en el area de Orlando (requiere membresia).\n\nMuy buena reputacion de servicio al cliente. Enterprise Plus acumula puntos canjeables.",
            contentShort: "Devolver con tanque lleno. Mejor precio combustible: Costco o BJ's.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 3,
          }
        ],
      },
    },
  });
  await prisma.serviceTemplate.upsert({
    where: { id: "tpl-car-national" },
    update: {},
    create: {
      id: "tpl-car-national",
      moduleTypeId: carModule.id,
      name: "National Car Rental \u2014 MCO",
      provider: "National",
      category: "Car Rental",
      location: "Orlando International Airport (MCO), FL",
      description: "National es la preferida de viajeros de negocios frecuentes con el programa Emerald Aisle.",
      metadata: {"airport": "MCO", "provider": "national"},
      isSystem: true,
      templateBlocks: {
        create: [
          {
            blockDefinitionId: blockDefs["CAR_INSURANCE"],
            title: "Cobertura y Seguros",
            content: "Al retirar el auto en National, verificar la cobertura del seguro de viaje contratado antes de aceptar o declinar el CDW/LDW del mostrador. Con seguro de viaje que incluya cobertura de auto de alquiler, generalmente se puede declinar el seguro de la empresa.\n\nEmerald Club members eligen su propio auto directamente del garage sin pasar por el mostrador.",
            contentShort: "Verificar seguro de viaje antes de declinar coberturas. Emerald Club members eligen su propio auto directamente del garage sin pasar por el mostrador.",
            isActiveByDefault: true,
            isHighlightedByDefault: true,
            sortOrder: 1,
          },
          {
            blockDefinitionId: blockDefs["CAR_TOLLS"],
            title: "Peajes en Florida \u2014 SunPass",
            content: "Florida usa peajes electronicos en la mayoria de sus autopistas principales (Florida Turnpike, SR-528, SR-417, SR-408). Se recomienda agregar SunPass o E-ZPass al alquiler para evitar cargos administrativos adicionales por registro manual de patente.",
            contentShort: "Agregar SunPass al alquiler para peajes electronicos automaticos.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 2,
          },
          {
            blockDefinitionId: blockDefs["CAR_FUEL"],
            title: "Combustible \u2014 Politica de Devolucion",
            content: "Devolver el auto con el tanque lleno para evitar los cargos de repostaje de National que son significativamente mas caros que las gasolineras locales. Las gasolineras Costco, BJ's y Sam's Club tienen los mejores precios en el area de Orlando (requiere membresia).\n\nEmerald Aisle: elegir el auto que se quiera de la fila. Muy valorado por viajeros frecuentes.",
            contentShort: "Devolver con tanque lleno. Mejor precio combustible: Costco o BJ's.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 3,
          }
        ],
      },
    },
  });
  await prisma.serviceTemplate.upsert({
    where: { id: "tpl-car-dollar" },
    update: {},
    create: {
      id: "tpl-car-dollar",
      moduleTypeId: carModule.id,
      name: "Dollar Car Rental \u2014 MCO",
      provider: "Dollar",
      category: "Car Rental",
      location: "Orlando International Airport (MCO), FL",
      description: "Dollar es parte del grupo Hertz, con precios accesibles y programa Dollar Express para clientes frecuentes.",
      metadata: {"airport": "MCO", "provider": "dollar"},
      isSystem: true,
      templateBlocks: {
        create: [
          {
            blockDefinitionId: blockDefs["CAR_INSURANCE"],
            title: "Cobertura y Seguros",
            content: "Al retirar el auto en Dollar, verificar la cobertura del seguro de viaje contratado antes de aceptar o declinar el CDW/LDW del mostrador. Con seguro de viaje que incluya cobertura de auto de alquiler, generalmente se puede declinar el seguro de la empresa.\n\nDollar Express permite omitir el mostrador para miembros registrados.",
            contentShort: "Verificar seguro de viaje antes de declinar coberturas. Dollar Express permite omitir el mostrador para miembros registrados.",
            isActiveByDefault: true,
            isHighlightedByDefault: true,
            sortOrder: 1,
          },
          {
            blockDefinitionId: blockDefs["CAR_TOLLS"],
            title: "Peajes en Florida \u2014 SunPass",
            content: "Florida usa peajes electronicos en la mayoria de sus autopistas principales (Florida Turnpike, SR-528, SR-417, SR-408). Se recomienda agregar SunPass o E-ZPass al alquiler para evitar cargos administrativos adicionales por registro manual de patente.",
            contentShort: "Agregar SunPass al alquiler para peajes electronicos automaticos.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 2,
          },
          {
            blockDefinitionId: blockDefs["CAR_FUEL"],
            title: "Combustible \u2014 Politica de Devolucion",
            content: "Devolver el auto con el tanque lleno para evitar los cargos de repostaje de Dollar que son significativamente mas caros que las gasolineras locales. Las gasolineras Costco, BJ's y Sam's Club tienen los mejores precios en el area de Orlando (requiere membresia).\n\nPrecios similares a Thrifty. Parte del grupo Hertz \u2014 misma flota en muchos casos.",
            contentShort: "Devolver con tanque lleno. Mejor precio combustible: Costco o BJ's.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 3,
          }
        ],
      },
    },
  });
  await prisma.serviceTemplate.upsert({
    where: { id: "tpl-car-thrifty" },
    update: {},
    create: {
      id: "tpl-car-thrifty",
      moduleTypeId: carModule.id,
      name: "Thrifty Car Rental \u2014 MCO",
      provider: "Thrifty",
      category: "Car Rental",
      location: "Orlando International Airport (MCO), FL",
      description: "Thrifty es la opcion economica del grupo Hertz, con buen precio y programa Blue Chip para skip-counter.",
      metadata: {"airport": "MCO", "provider": "thrifty"},
      isSystem: true,
      templateBlocks: {
        create: [
          {
            blockDefinitionId: blockDefs["CAR_INSURANCE"],
            title: "Cobertura y Seguros",
            content: "Al retirar el auto en Thrifty, verificar la cobertura del seguro de viaje contratado antes de aceptar o declinar el CDW/LDW del mostrador. Con seguro de viaje que incluya cobertura de auto de alquiler, generalmente se puede declinar el seguro de la empresa.\n\nBlue Chip Express permite ir directo al auto para miembros registrados.",
            contentShort: "Verificar seguro de viaje antes de declinar coberturas. Blue Chip Express permite ir directo al auto para miembros registrados.",
            isActiveByDefault: true,
            isHighlightedByDefault: true,
            sortOrder: 1,
          },
          {
            blockDefinitionId: blockDefs["CAR_TOLLS"],
            title: "Peajes en Florida \u2014 SunPass",
            content: "Florida usa peajes electronicos en la mayoria de sus autopistas principales (Florida Turnpike, SR-528, SR-417, SR-408). Se recomienda agregar SunPass o E-ZPass al alquiler para evitar cargos administrativos adicionales por registro manual de patente.",
            contentShort: "Agregar SunPass al alquiler para peajes electronicos automaticos.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 2,
          },
          {
            blockDefinitionId: blockDefs["CAR_FUEL"],
            title: "Combustible \u2014 Politica de Devolucion",
            content: "Devolver el auto con el tanque lleno para evitar los cargos de repostaje de Thrifty que son significativamente mas caros que las gasolineras locales. Las gasolineras Costco, BJ's y Sam's Club tienen los mejores precios en el area de Orlando (requiere membresia).\n\nTarifa base muy competitiva. Comparar con Budget y Dollar para mejores precios.",
            contentShort: "Devolver con tanque lleno. Mejor precio combustible: Costco o BJ's.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 3,
          }
        ],
      },
    },
  });
  await prisma.serviceTemplate.upsert({
    where: { id: "tpl-car-sixt" },
    update: {},
    create: {
      id: "tpl-car-sixt",
      moduleTypeId: carModule.id,
      name: "Sixt Rent A Car \u2014 MCO",
      provider: "Sixt",
      category: "Car Rental",
      location: "Orlando International Airport (MCO), FL",
      description: "Sixt es la rentadora europea premium con flota de autos de alta gama, incluidos BMW, Mercedes y Audi.",
      metadata: {"airport": "MCO", "provider": "sixt"},
      isSystem: true,
      templateBlocks: {
        create: [
          {
            blockDefinitionId: blockDefs["CAR_INSURANCE"],
            title: "Cobertura y Seguros",
            content: "Al retirar el auto en Sixt, verificar la cobertura del seguro de viaje contratado antes de aceptar o declinar el CDW/LDW del mostrador. Con seguro de viaje que incluya cobertura de auto de alquiler, generalmente se puede declinar el seguro de la empresa.\n\nSixt Express para clientes registrados. Flota de nivel superior disponible en MCO.",
            contentShort: "Verificar seguro de viaje antes de declinar coberturas. Sixt Express para clientes registrados.",
            isActiveByDefault: true,
            isHighlightedByDefault: true,
            sortOrder: 1,
          },
          {
            blockDefinitionId: blockDefs["CAR_TOLLS"],
            title: "Peajes en Florida \u2014 SunPass",
            content: "Florida usa peajes electronicos en la mayoria de sus autopistas principales (Florida Turnpike, SR-528, SR-417, SR-408). Se recomienda agregar SunPass o E-ZPass al alquiler para evitar cargos administrativos adicionales por registro manual de patente.",
            contentShort: "Agregar SunPass al alquiler para peajes electronicos automaticos.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 2,
          },
          {
            blockDefinitionId: blockDefs["CAR_FUEL"],
            title: "Combustible \u2014 Politica de Devolucion",
            content: "Devolver el auto con el tanque lleno para evitar los cargos de repostaje de Sixt que son significativamente mas caros que las gasolineras locales. Las gasolineras Costco, BJ's y Sam's Club tienen los mejores precios en el area de Orlando (requiere membresia).\n\nFlota premium con marcas alemanas. Ideal para viajeros que prefieren autos de mayor calidad.",
            contentShort: "Devolver con tanque lleno. Mejor precio combustible: Costco o BJ's.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 3,
          }
        ],
      },
    },
  });
  console.log("  + 8 rentadoras de autos creadas");
  console.log("\n Creando templates de aerolineas...");
  await prisma.serviceTemplate.upsert({
    where: { id: "tpl-flight-aa" },
    update: {},
    create: {
      id: "tpl-flight-aa",
      moduleTypeId: flightModule.id,
      name: "American Airlines",
      provider: "American Airlines",
      category: "Aerolinea",
      location: "Buenos Aires (EZE) \u2014 Orlando (MCO)",
      description: "La aerolinea mas grande de EE.UU. con hub principal en Miami (MIA), ideal para vuelos desde Argentina a Orlando.",
      metadata: {"iata": "AA", "hub_city": "varios"},
      isSystem: true,
      templateBlocks: {
        create: [
          {
            blockDefinitionId: blockDefs["FLIGHT_BAGGAGE"],
            title: "Equipaje \u2014 American Airlines",
            content: "Economy Basic no incluye equipaje facturado. Main Cabin: primer bolso USD 35 domestico, incluido en internacionales desde Argentina segun tarifa.",
            contentShort: "Economy Basic no incluye equipaje facturado. Main Cabin: primer bolso USD 35 dom...",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 1,
          },
          {
            blockDefinitionId: blockDefs["FLIGHT_CHECKIN"],
            title: "Check-in Online",
            content: "Check-in online disponible 24 horas antes en aa.com o app American Airlines. Mostrador cierra 45 min antes del vuelo internacional.",
            contentShort: "Check-in online disponible 24 horas antes en aa.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 2,
          },
          {
            blockDefinitionId: blockDefs["FLIGHT_AIRPORT_TIPS"],
            title: "Tips para volar con American Airlines",
            content: "Conexion frecuente via Miami (MIA) desde Buenos Aires. Programa AAdvantage acumula millas. Status Platinum desde 75,000 millas/a\u00f1o.\n\nMiami es el hub natural para vuelos EZE-MIA-MCO. Verificar conexion directa vs escala.",
            contentShort: "Conexion frecuente via Miami (MIA) desde Buenos Aires.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 3,
          }
        ],
      },
    },
  });
  await prisma.serviceTemplate.upsert({
    where: { id: "tpl-flight-dl" },
    update: {},
    create: {
      id: "tpl-flight-dl",
      moduleTypeId: flightModule.id,
      name: "Delta Air Lines",
      provider: "Delta Air Lines",
      category: "Aerolinea",
      location: "Buenos Aires (EZE) \u2014 Orlando (MCO)",
      description: "Gran aerolinea estadounidense con hubs en Atlanta y Nueva York, con conexiones eficientes desde Sudamerica.",
      metadata: {"iata": "DL", "hub_city": "varios"},
      isSystem: true,
      templateBlocks: {
        create: [
          {
            blockDefinitionId: blockDefs["FLIGHT_BAGGAGE"],
            title: "Equipaje \u2014 Delta Air Lines",
            content: "Main Cabin incluye carry-on + 1 articulo personal. Primer equipaje facturado: USD 35 para vuelos domesticos.",
            contentShort: "Main Cabin incluye carry-on + 1 articulo personal. Primer equipaje facturado: US...",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 1,
          },
          {
            blockDefinitionId: blockDefs["FLIGHT_CHECKIN"],
            title: "Check-in Online",
            content: "Check-in online 24 horas antes en delta.com o app Fly Delta. Cierre de mostrador 60 min antes vuelos internacionales.",
            contentShort: "Check-in online 24 horas antes en delta.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 2,
          },
          {
            blockDefinitionId: blockDefs["FLIGHT_AIRPORT_TIPS"],
            title: "Tips para volar con Delta Air Lines",
            content: "Conexion frecuente via Atlanta (ATL) desde Buenos Aires. Programa SkyMiles Medallion.\n\nAtlanta es el hub mas grande del mundo \u2014 conexiones muy eficientes pero el aeropuerto es grande.",
            contentShort: "Conexion frecuente via Atlanta (ATL) desde Buenos Aires.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 3,
          }
        ],
      },
    },
  });
  await prisma.serviceTemplate.upsert({
    where: { id: "tpl-flight-ua" },
    update: {},
    create: {
      id: "tpl-flight-ua",
      moduleTypeId: flightModule.id,
      name: "United Airlines",
      provider: "United Airlines",
      category: "Aerolinea",
      location: "Buenos Aires (EZE) \u2014 Orlando (MCO)",
      description: "Aerolinea estadounidense con fuerte presencia en Houston y Newark, con vuelos a Orlando desde Sudamerica.",
      metadata: {"iata": "UA", "hub_city": "varios"},
      isSystem: true,
      templateBlocks: {
        create: [
          {
            blockDefinitionId: blockDefs["FLIGHT_BAGGAGE"],
            title: "Equipaje \u2014 United Airlines",
            content: "Economy Basic no incluye bolso facturado. Economy Plus incluye carry-on. Primer facturado: USD 35.",
            contentShort: "Economy Basic no incluye bolso facturado. Economy Plus incluye carry-on. Primer ...",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 1,
          },
          {
            blockDefinitionId: blockDefs["FLIGHT_CHECKIN"],
            title: "Check-in Online",
            content: "Check-in 24 horas antes en united.com o app United Airlines.",
            contentShort: "Check-in 24 horas antes en united.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 2,
          },
          {
            blockDefinitionId: blockDefs["FLIGHT_AIRPORT_TIPS"],
            title: "Tips para volar con United Airlines",
            content: "Conexion frecuente via Houston (IAH) o Newark (EWR). Programa MileagePlus.\n\nHouston IAH tiene una terminal bien organizada con buenas opciones de comida para escalas.",
            contentShort: "Conexion frecuente via Houston (IAH) o Newark (EWR).",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 3,
          }
        ],
      },
    },
  });
  await prisma.serviceTemplate.upsert({
    where: { id: "tpl-flight-la" },
    update: {},
    create: {
      id: "tpl-flight-la",
      moduleTypeId: flightModule.id,
      name: "LATAM Airlines",
      provider: "LATAM Airlines",
      category: "Aerolinea",
      location: "Buenos Aires (EZE) \u2014 Orlando (MCO)",
      description: "Principal aerolinea de America Latina con vuelos directos Buenos Aires - Miami y conexiones a Orlando.",
      metadata: {"iata": "LA", "hub_city": "varios"},
      isSystem: true,
      templateBlocks: {
        create: [
          {
            blockDefinitionId: blockDefs["FLIGHT_BAGGAGE"],
            title: "Equipaje \u2014 LATAM Airlines",
            content: "Economy incluye 1 carry-on de hasta 8kg + articulo personal. Equipaje facturado segun tarifa y ruta \u2014 verificar al reservar.",
            contentShort: "Economy incluye 1 carry-on de hasta 8kg + articulo personal. Equipaje facturado ...",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 1,
          },
          {
            blockDefinitionId: blockDefs["FLIGHT_CHECKIN"],
            title: "Check-in Online",
            content: "Check-in online disponible 48 horas antes en latamairlines.com o app LATAM. Cierre de mostrador 60 min antes.",
            contentShort: "Check-in online disponible 48 horas antes en latamairlines.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 2,
          },
          {
            blockDefinitionId: blockDefs["FLIGHT_AIRPORT_TIPS"],
            title: "Tips para volar con LATAM Airlines",
            content: "Vuelos directos EZE-MIA. Programa LATAM Pass para acumulo de puntos. Conexion en Lima o Bogota segun ruta.\n\nLATAM es una excelente opcion desde Argentina con vuelos directos a Miami y buena frecuencia.",
            contentShort: "Vuelos directos EZE-MIA.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 3,
          }
        ],
      },
    },
  });
  await prisma.serviceTemplate.upsert({
    where: { id: "tpl-flight-cm" },
    update: {},
    create: {
      id: "tpl-flight-cm",
      moduleTypeId: flightModule.id,
      name: "Copa Airlines",
      provider: "Copa Airlines",
      category: "Aerolinea",
      location: "Buenos Aires (EZE) \u2014 Orlando (MCO)",
      description: "Aerolinea panamena con el hub de las Americas en Ciudad de Panama \u2014 excelente conectividad a EE.UU.",
      metadata: {"iata": "CM", "hub_city": "varios"},
      isSystem: true,
      templateBlocks: {
        create: [
          {
            blockDefinitionId: blockDefs["FLIGHT_BAGGAGE"],
            title: "Equipaje \u2014 Copa Airlines",
            content: "Economy incluye 1 equipaje facturado de 23kg. Carry-on incluido en todas las tarifas. Verificar tarifa Light.",
            contentShort: "Economy incluye 1 equipaje facturado de 23kg. Carry-on incluido en todas las tar...",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 1,
          },
          {
            blockDefinitionId: blockDefs["FLIGHT_CHECKIN"],
            title: "Check-in Online",
            content: "Check-in online 24 horas antes en copaair.com o app Copa Airlines.",
            contentShort: "Check-in online 24 horas antes en copaair.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 2,
          },
          {
            blockDefinitionId: blockDefs["FLIGHT_AIRPORT_TIPS"],
            title: "Tips para volar con Copa Airlines",
            content: "Hub Ciudad de Panama (PTY): escalas cortas y eficientes hacia Miami/Orlando. Programa ConnectMiles.\n\nCopa tiene excelente puntualidad. PTY es un aeropuerto moderno con escalas de 1-3 horas muy comfortables.",
            contentShort: "Hub Ciudad de Panama (PTY): escalas cortas y eficientes hacia Miami/Orlando.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 3,
          }
        ],
      },
    },
  });
  await prisma.serviceTemplate.upsert({
    where: { id: "tpl-flight-av" },
    update: {},
    create: {
      id: "tpl-flight-av",
      moduleTypeId: flightModule.id,
      name: "Avianca",
      provider: "Avianca",
      category: "Aerolinea",
      location: "Buenos Aires (EZE) \u2014 Orlando (MCO)",
      description: "Aerolinea colombiana con hub en Bogota, con vuelos desde Argentina a Orlando via Miami o directo.",
      metadata: {"iata": "AV", "hub_city": "varios"},
      isSystem: true,
      templateBlocks: {
        create: [
          {
            blockDefinitionId: blockDefs["FLIGHT_BAGGAGE"],
            title: "Equipaje \u2014 Avianca",
            content: "Economy Basic no incluye equipaje. Economy incluye 1 bolso de 23kg. Verificar tarifa al reservar.",
            contentShort: "Economy Basic no incluye equipaje. Economy incluye 1 bolso de 23kg. Verificar ta...",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 1,
          },
          {
            blockDefinitionId: blockDefs["FLIGHT_CHECKIN"],
            title: "Check-in Online",
            content: "Check-in online 24 horas antes en avianca.com. App Avianca disponible.",
            contentShort: "Check-in online 24 horas antes en avianca.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 2,
          },
          {
            blockDefinitionId: blockDefs["FLIGHT_AIRPORT_TIPS"],
            title: "Tips para volar con Avianca",
            content: "Hub Bogota (BOG) con conexiones a Miami/Orlando. Programa LifeMiles para acumulo de millas.\n\nAvianca es buena opcion alternativa a LATAM para vuelos desde Argentina con escala en Bogota.",
            contentShort: "Hub Bogota (BOG) con conexiones a Miami/Orlando.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 3,
          }
        ],
      },
    },
  });
  await prisma.serviceTemplate.upsert({
    where: { id: "tpl-flight-ar" },
    update: {},
    create: {
      id: "tpl-flight-ar",
      moduleTypeId: flightModule.id,
      name: "Aerolineas Argentinas",
      provider: "Aerolineas Argentinas",
      category: "Aerolinea",
      location: "Buenos Aires (EZE) \u2014 Orlando (MCO)",
      description: "La aerolinea nacional argentina con vuelos directos Buenos Aires - Miami, la unica ruta directa EZE-MIA.",
      metadata: {"iata": "AR", "hub_city": "varios"},
      isSystem: true,
      templateBlocks: {
        create: [
          {
            blockDefinitionId: blockDefs["FLIGHT_BAGGAGE"],
            title: "Equipaje \u2014 Aerolineas Argentinas",
            content: "Economy incluye 1 equipaje facturado de 23kg + carry-on de 10kg. Buen allowance de equipaje.",
            contentShort: "Economy incluye 1 equipaje facturado de 23kg + carry-on de 10kg. Buen allowance ...",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 1,
          },
          {
            blockDefinitionId: blockDefs["FLIGHT_CHECKIN"],
            title: "Check-in Online",
            content: "Check-in online disponible 36 horas antes en aerolineas.com.ar. Mostrador cierra 1 hora antes.",
            contentShort: "Check-in online disponible 36 horas antes en aerolineas.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 2,
          },
          {
            blockDefinitionId: blockDefs["FLIGHT_AIRPORT_TIPS"],
            title: "Tips para volar con Aerolineas Argentinas",
            content: "Unica aerolinea con vuelo directo EZE-MIA sin escala. Programa Aerolineas Plus. Frecuencia diaria en temporada alta.\n\nVuelo directo sin escala Buenos Aires - Miami es la gran ventaja de Aerolineas. Muy comodo para familias.",
            contentShort: "Unica aerolinea con vuelo directo EZE-MIA sin escala.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 3,
          }
        ],
      },
    },
  });
  await prisma.serviceTemplate.upsert({
    where: { id: "tpl-flight-ib" },
    update: {},
    create: {
      id: "tpl-flight-ib",
      moduleTypeId: flightModule.id,
      name: "Iberia",
      provider: "Iberia",
      category: "Aerolinea",
      location: "Buenos Aires (EZE) \u2014 Orlando (MCO)",
      description: "Aerolinea espanola con vuelos directos desde Buenos Aires a Madrid y conexiones a Estados Unidos.",
      metadata: {"iata": "IB", "hub_city": "varios"},
      isSystem: true,
      templateBlocks: {
        create: [
          {
            blockDefinitionId: blockDefs["FLIGHT_BAGGAGE"],
            title: "Equipaje \u2014 Iberia",
            content: "Economy Light no incluye equipaje facturado. Economy Classic incluye 1 bolso de 23kg. Verificar tarifa.",
            contentShort: "Economy Light no incluye equipaje facturado. Economy Classic incluye 1 bolso de ...",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 1,
          },
          {
            blockDefinitionId: blockDefs["FLIGHT_CHECKIN"],
            title: "Check-in Online",
            content: "Check-in online 24 horas antes en iberia.com. Mostrador cierre 60 min antes vuelos internacionales.",
            contentShort: "Check-in online 24 horas antes en iberia.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 2,
          },
          {
            blockDefinitionId: blockDefs["FLIGHT_AIRPORT_TIPS"],
            title: "Tips para volar con Iberia",
            content: "Conexion via Madrid (MAD) con vuelos a Miami o Nueva York. Programa Iberia Plus (Avios).\n\nExcelente conexion en Madrid MAD \u2014 terminal T4 moderna con buenas opciones de transito.",
            contentShort: "Conexion via Madrid (MAD) con vuelos a Miami o Nueva York.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 3,
          }
        ],
      },
    },
  });
  await prisma.serviceTemplate.upsert({
    where: { id: "tpl-flight-ux" },
    update: {},
    create: {
      id: "tpl-flight-ux",
      moduleTypeId: flightModule.id,
      name: "Air Europa",
      provider: "Air Europa",
      category: "Aerolinea",
      location: "Buenos Aires (EZE) \u2014 Orlando (MCO)",
      description: "Aerolinea espanola competidora de Iberia con vuelos directos Buenos Aires - Madrid y conexiones a EE.UU.",
      metadata: {"iata": "UX", "hub_city": "varios"},
      isSystem: true,
      templateBlocks: {
        create: [
          {
            blockDefinitionId: blockDefs["FLIGHT_BAGGAGE"],
            title: "Equipaje \u2014 Air Europa",
            content: "Economy incluye equipaje facturado de 23kg en vuelos transoce\u00e1nicos. Tarifa 'basica' sin equipaje \u2014 verificar.",
            contentShort: "Economy incluye equipaje facturado de 23kg en vuelos transoce\u00e1nicos. Tarifa 'bas...",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 1,
          },
          {
            blockDefinitionId: blockDefs["FLIGHT_CHECKIN"],
            title: "Check-in Online",
            content: "Check-in online 24 horas antes en aireuropa.com.",
            contentShort: "Check-in online 24 horas antes en aireuropa.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 2,
          },
          {
            blockDefinitionId: blockDefs["FLIGHT_AIRPORT_TIPS"],
            title: "Tips para volar con Air Europa",
            content: "Conexion via Madrid (MAD) como Iberia. Programa SUMA Miles & Card. Compite en precio con Iberia.\n\nAir Europa suele tener tarifas mas competitivas que Iberia en la ruta EZE-MAD. Comparar siempre ambas.",
            contentShort: "Conexion via Madrid (MAD) como Iberia.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 3,
          }
        ],
      },
    },
  });
  console.log("  + 9 aerolineas creadas");
  console.log("\n Creando templates de cruceros...");
  await prisma.serviceTemplate.upsert({
    where: { id: "tpl-cruise-msc" },
    update: {},
    create: {
      id: "tpl-cruise-msc",
      moduleTypeId: cruiseModule.id,
      name: "MSC Cruises \u2014 PortMiami",
      provider: "MSC Cruises",
      category: "Crucero",
      location: "PortMiami / Port Canaveral, FL",
      description: "MSC es la naviera europea mas grande del mundo con salidas desde PortMiami hacia el Caribe.",
      metadata: {"provider_code": "MSC", "port": "Miami/Canaveral"},
      isSystem: true,
      templateBlocks: {
        create: [
          {
            blockDefinitionId: blockDefs["CRUISE_EMBARK"],
            title: "Embarque y Check-in",
            content: "Check-in online en app MSC Cruises. Llegar al terminal de PortMiami con 2-3 horas de anticipacion. Pasaporte vigente y formularios de salud completados digitalmente.",
            contentShort: "Check-in online en app MSC Cruises.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 1,
          },
          {
            blockDefinitionId: blockDefs["CRUISE_DINING"],
            title: "Gastronomia a Bordo",
            content: "El precio del crucero incluye restaurante principal (MDR), buffet Marketplace y entretenimiento a bordo. Especialidades como steakhouse, sushi bar y restaurante asiatico tienen cargo adicional.",
            contentShort: "El precio del crucero incluye restaurante principal (MDR), buffet Marketplace y entretenimiento a bordo.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 2,
          },
          {
            blockDefinitionId: blockDefs["CRUISE_EXCURSIONS"],
            title: "Excursiones en Puertos",
            content: "Excursiones disponibles via MSC Shore Excursions o proveedores independientes. Puertos tipicos: Nassau, Cozumel, Key West, Isla de San Andres. Reservar excursiones populares con anticipacion.",
            contentShort: "Excursiones disponibles via MSC Shore Excursions o proveedores independientes.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 3,
          },
          {
            blockDefinitionId: blockDefs["CRUISE_TIPS"],
            title: "Consejos del Crucero",
            content: "Paquete de bebidas (Drinks Package) y Wi-Fi se compran a mejor precio antes de embarcar via 'My MSC'. App MSC Cruises es esencial para gestionar actividades, reservas de restaurantes y excursiones a bordo.",
            contentShort: "Paquete de bebidas (Drinks Package) y Wi-Fi se compran a mejor precio antes de embarcar via 'My MSC'.",
            isActiveByDefault: true,
            isHighlightedByDefault: true,
            sortOrder: 4,
          }
        ],
      },
    },
  });
  await prisma.serviceTemplate.upsert({
    where: { id: "tpl-cruise-rccl" },
    update: {},
    create: {
      id: "tpl-cruise-rccl",
      moduleTypeId: cruiseModule.id,
      name: "Royal Caribbean \u2014 PortMiami",
      provider: "Royal Caribbean",
      category: "Crucero",
      location: "PortMiami / Port Canaveral, FL",
      description: "La naviera con los barcos mas grandes del mundo. Salidas desde PortMiami y Port Canaveral.",
      metadata: {"provider_code": "RCCL", "port": "Miami/Canaveral"},
      isSystem: true,
      templateBlocks: {
        create: [
          {
            blockDefinitionId: blockDefs["CRUISE_EMBARK"],
            title: "Embarque y Check-in",
            content: "Check-in online en app Royal Caribbean hasta 90 dias antes. Set Sail Pass obligatorio. Llegar al terminal 2-3 horas antes con pasaporte y documentacion completada digitalmente.",
            contentShort: "Check-in online en app Royal Caribbean hasta 90 dias antes.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 1,
          },
          {
            blockDefinitionId: blockDefs["CRUISE_DINING"],
            title: "Gastronomia a Bordo",
            content: "Incluido: Main Dining Room (cena formal con servicio), Windjammer Buffet (casual). Especialidades extra: Chops Grille (carnes), 150 Central Park, Giovanni's Table, Samba Grille. Recomendable reservar specialty dining antes del viaje via Cruise Planner.",
            contentShort: "Incluido: Main Dining Room (cena formal con servicio), Windjammer Buffet (casual).",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 2,
          },
          {
            blockDefinitionId: blockDefs["CRUISE_EXCURSIONS"],
            title: "Excursiones en Puertos",
            content: "Royal Caribbean Shore Excursions en la app. Puertos tipicos desde Miami: Bahamas, Jamaica, Haiti (Perfect Day), Cozumel. Perfect Day at CocoCay es la isla privada de Royal Caribbean.",
            contentShort: "Royal Caribbean Shore Excursions en la app.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 3,
          },
          {
            blockDefinitionId: blockDefs["CRUISE_TIPS"],
            title: "Consejos del Crucero",
            content: "Cruise Planner permite comprar paquetes de bebidas, internet, excursiones y specialty dining con descuento pre-viaje. App Royal Caribbean para actividades, times and activities, y el servicio de mensajeria gratuito.",
            contentShort: "Cruise Planner permite comprar paquetes de bebidas, internet, excursiones y specialty dining con descuento pre-viaje.",
            isActiveByDefault: true,
            isHighlightedByDefault: true,
            sortOrder: 4,
          }
        ],
      },
    },
  });
  await prisma.serviceTemplate.upsert({
    where: { id: "tpl-cruise-dcl" },
    update: {},
    create: {
      id: "tpl-cruise-dcl",
      moduleTypeId: cruiseModule.id,
      name: "Disney Cruise Line \u2014 Port Canaveral",
      provider: "Disney Cruise Line",
      category: "Crucero",
      location: "PortMiami / Port Canaveral, FL",
      description: "El crucero mas magico del mundo con personajes Disney, rotacion de restaurantes y la isla privada Castaway Cay.",
      metadata: {"provider_code": "DCL", "port": "Miami/Canaveral"},
      isSystem: true,
      templateBlocks: {
        create: [
          {
            blockDefinitionId: blockDefs["CRUISE_EMBARK"],
            title: "Embarque y Check-in",
            content: "Check-in online abre 30 dias antes del viaje (a la medianoche). Puerto: Port Canaveral (a 45 min de Orlando). Terminal decorada con personajes Disney. Grupos de abordaje por orden de check-in.",
            contentShort: "Check-in online abre 30 dias antes del viaje (a la medianoche).",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 1,
          },
          {
            blockDefinitionId: blockDefs["CRUISE_DINING"],
            title: "Gastronomia a Bordo",
            content: "Dining rotacional: tres restaurantes tematicos que rotan cada noche (los pasajeros y el equipo de servicio rotan juntos). Palo (solo adultos): restaurante italiano premium con cargo adicional \u2014 reservar a la medianoche 75 dias antes.",
            contentShort: "Dining rotacional: tres restaurantes tematicos que rotan cada noche (los pasajeros y el equipo de servicio rotan juntos).",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 2,
          },
          {
            blockDefinitionId: blockDefs["CRUISE_EXCURSIONS"],
            title: "Excursiones en Puertos",
            content: "Castaway Cay, la isla privada de Disney en Bahamas, esta incluida en rutas del Caribe. Excursiones a tierra en otros puertos disponibles via DCL Adventures. Actividades de snorkel y playa en Castaway Cay son gratuitas.",
            contentShort: "Castaway Cay, la isla privada de Disney en Bahamas, esta incluida en rutas del Caribe.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 3,
          },
          {
            blockDefinitionId: blockDefs["CRUISE_TIPS"],
            title: "Consejos del Crucero",
            content: "Reservar Palo (adultos), Remy (alta cocina) y tratamientos de spa exactamente a las 00:00 AM a los 75 dias del viaje \u2014 se agotan en minutos. Character Meet & Greets a bordo son gratuitos. La mejor experiencia de crucero para familias con ninos.",
            contentShort: "Reservar Palo (adultos), Remy (alta cocina) y tratamientos de spa exactamente a las 00:00 AM a los 75 dias del viaje \u2014 se agotan en minutos.",
            isActiveByDefault: true,
            isHighlightedByDefault: true,
            sortOrder: 4,
          }
        ],
      },
    },
  });
  await prisma.serviceTemplate.upsert({
    where: { id: "tpl-cruise-ncl" },
    update: {},
    create: {
      id: "tpl-cruise-ncl",
      moduleTypeId: cruiseModule.id,
      name: "Norwegian Cruise Line \u2014 PortMiami",
      provider: "Norwegian Cruise Line",
      category: "Crucero",
      location: "PortMiami / Port Canaveral, FL",
      description: "NCL invent\u00f3 el Freestyle Cruising \u2014 sin horarios fijos de cena ni mesa asignada. Salidas desde PortMiami.",
      metadata: {"provider_code": "NCL", "port": "Miami/Canaveral"},
      isSystem: true,
      templateBlocks: {
        create: [
          {
            blockDefinitionId: blockDefs["CRUISE_EMBARK"],
            title: "Embarque y Check-in",
            content: "Check-in online en app NCL. iConcierge app para mensajeria a bordo. Llegar al terminal con 2 horas de anticipacion.",
            contentShort: "Check-in online en app NCL.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 1,
          },
          {
            blockDefinitionId: blockDefs["CRUISE_DINING"],
            title: "Gastronomia a Bordo",
            content: "Freestyle Dining: comer cuando y donde quieran sin horario fijo. Incluido: Manhattan Room, Taste, Savor (MDR informales). Especialidades extra (20+ restaurantes a bordo en barcos grandes): Cagney's Steakhouse, La Cucina, Teppanyaki.",
            contentShort: "Freestyle Dining: comer cuando y donde quieran sin horario fijo.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 2,
          },
          {
            blockDefinitionId: blockDefs["CRUISE_EXCURSIONS"],
            title: "Excursiones en Puertos",
            content: "Shore Excursions via NCL o independientes. NCL tiene paradas en Great Stirrup Cay (isla privada en Bahamas). Puertos tipicos: Nassau, St. Thomas, Puerto Rico.",
            contentShort: "Shore Excursions via NCL o independientes.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 3,
          },
          {
            blockDefinitionId: blockDefs["CRUISE_TIPS"],
            title: "Consejos del Crucero",
            content: "Free at Sea: paquete de promociones que puede incluir bebidas, internet, specialty dining o excursiones gratis segun la promo del viaje. Verificar al momento de reservar. App NCL es esencial a bordo.",
            contentShort: "Free at Sea: paquete de promociones que puede incluir bebidas, internet, specialty dining o excursiones gratis segun la promo del viaje.",
            isActiveByDefault: true,
            isHighlightedByDefault: true,
            sortOrder: 4,
          }
        ],
      },
    },
  });
  await prisma.serviceTemplate.upsert({
    where: { id: "tpl-cruise-ccl" },
    update: {},
    create: {
      id: "tpl-cruise-ccl",
      moduleTypeId: cruiseModule.id,
      name: "Carnival Cruise Line \u2014 Port Canaveral",
      provider: "Carnival Cruise Line",
      category: "Crucero",
      location: "PortMiami / Port Canaveral, FL",
      description: "La naviera mas popular de EE.UU. con ambiente festivo, precios accesibles y salidas desde Port Canaveral.",
      metadata: {"provider_code": "CCL", "port": "Miami/Canaveral"},
      isSystem: true,
      templateBlocks: {
        create: [
          {
            blockDefinitionId: blockDefs["CRUISE_EMBARK"],
            title: "Embarque y Check-in",
            content: "Check-in online en Hub app (Carnival). Early check-in para Past Guest y fares especiales. Puerto Port Canaveral a 45 min de Orlando. Grupos de abordaje por zona y membresia.",
            contentShort: "Check-in online en Hub app (Carnival).",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 1,
          },
          {
            blockDefinitionId: blockDefs["CRUISE_DINING"],
            title: "Gastronomia a Bordo",
            content: "Incluido: MDR con menu formal (Your Time Dining disponible), Lido Deck buffet, Guy's Burger Joint (gratis), BlueIguana Cantina (gratis). Cargo extra: Bonsai Sushi, Fahrenheit 555 steakhouse, JiJi Asian Kitchen.",
            contentShort: "Incluido: MDR con menu formal (Your Time Dining disponible), Lido Deck buffet, Guy's Burger Joint (gratis), BlueIguana Cantina (gratis).",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 2,
          },
          {
            blockDefinitionId: blockDefs["CRUISE_EXCURSIONS"],
            title: "Excursiones en Puertos",
            content: "Fun Shop excursiones o independientes. Puertos tipicos desde Port Canaveral: Nassau, Freeport, Cozumel, Isla Catalina. Carnival's half-moon cay disponible en algunas rutas.",
            contentShort: "Fun Shop excursiones o independientes.",
            isActiveByDefault: true,
            isHighlightedByDefault: false,
            sortOrder: 3,
          },
          {
            blockDefinitionId: blockDefs["CRUISE_TIPS"],
            title: "Consejos del Crucero",
            content: "Hub app de Carnival es fundamental: horarios de actividades del dia, menu de restaurantes, itinerario de puertos y chat gratuito entre pasajeros. Paquetes de bebidas y Fun Play gaming a bordo disponibles.",
            contentShort: "Hub app de Carnival es fundamental: horarios de actividades del dia, menu de restaurantes, itinerario de puertos y chat gratuito entre pasajeros.",
            isActiveByDefault: true,
            isHighlightedByDefault: true,
            sortOrder: 4,
          }
        ],
      },
    },
  });
  console.log("  + 5 cruceros creados");

  // ============================================================
  // 9. AGENCIA Y USUARIO DEMO
  // ============================================================
  console.log("\n🏢 Creando agencia y usuario demo...");

  const agency = await prisma.agency.upsert({
    where: { slug: "travelvyp" },
    update: {},
    create: {
      name: "TravelVYP",
      slug: "travelvyp",
      primaryColor: "#3B82F6",
      secondaryColor: "#10B981",
      country: "Argentina",
      timezone: "America/Argentina/Buenos_Aires",
      plan: "PRO",
    },
  });

  const passwordHash = await bcrypt.hash("travelvyp2024", 12);

  const adminUser = await prisma.user.upsert({
    where: { email: "pablo@travelvyp.com" },
    update: { passwordHash, isActive: true },
    create: {
      agencyId: agency.id,
      email: "pablo@travelvyp.com",
      fullName: "Pablo Tocci",
      role: "OWNER",
      passwordHash,
      isActive: true,
    },
  });

  console.log("  ✓ Agencia TravelVYP creada");
  console.log("  Usuario admin creado: pablo@travelvyp.com / travelvyp2024");

  console.log("\n Seed completado exitosamente!");
  console.log("---")
  console.log("  Modulos:           10")
  console.log("  Templates:         ~49")
  console.log("  Agencias:          1")
  console.log("  Usuarios:          1")
  console.log("---")
}

main()
  .catch((e) => { console.error("Error en el seed:", e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
