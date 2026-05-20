// =============================================================================
// TravelVYP — Seed inicial de la base de datos
// Crea: módulos, block definitions y templates con bloques pre-configurados
// Ejecutar: npm run db:seed
// =============================================================================

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

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

  console.log("  ✓ 4 módulos creados\n");

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
    update: {},
    create: {
      agencyId: agency.id,
      email: "pablo@travelvyp.com",
      fullName: "Pablo Tocci",
      role: "OWNER",
      passwordHash,
    },
  });

  console.log("  ✓ Agencia TravelVYP creada");
  console.log("  ✓ Usuario admin creado: pablo@travelvyp.com / travelvyp2024");

  // ============================================================
  // RESUMEN
  // ============================================================
  console.log("\n✅ Seed completado exitosamente!");
  console.log("─────────────────────────────────────");
  console.log(`  Módulos:          4`);
  console.log(`  Block Definitions: ${flightBlocks.length + hotelBlocks.length + parkBlocks.length + carBlocks.length}`);
  console.log(`  Service Templates: 5`);
  console.log(`  Agencias:         1`);
  console.log(`  Usuarios:         1`);
  console.log("─────────────────────────────────────");
  console.log("\n🚀 Listo para desarrollar TravelVYP!\n");
}

main()
  .catch((e) => {
    console.error("❌ Error en el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
