export type LocalizedString = { en: string; es: string };

export type UseCaseMetric = {
  label: LocalizedString;
  value: string;
  helper?: LocalizedString;
};

export type UseCaseFeature = {
  title: LocalizedString;
  description: LocalizedString;
};

export type UseCaseMessage = {
  from: "user" | "agent";
  text: LocalizedString;
};

export type UseCaseStep = {
  title: LocalizedString;
  description: LocalizedString;
};

export type UseCaseDefinition = {
  slug: string;
  icon: string;
  label: LocalizedString;
  badge: LocalizedString;
  heroTitle: LocalizedString;
  heroSubtitle: LocalizedString;
  primaryBenefit: LocalizedString;
  challenges: LocalizedString[];
  outcomes: LocalizedString[];
  metrics: UseCaseMetric[];
  handledByOnDuty: UseCaseFeature[];
  exampleConversation: UseCaseMessage[];
  workflowSteps: UseCaseStep[];
  kpis: LocalizedString[];
  channels: LocalizedString[];
};

export const useCases: UseCaseDefinition[] = [
  {
    slug: "hotels",
    icon: "🏨",
    label: {
      en: "Hotels & vacation rentals",
      es: "Hoteles y alojamientos vacacionales",
    },
    badge: {
      en: "USE CASE · HOSPITALITY",
      es: "CASO DE USO · HOSPITALIDAD",
    },
    heroTitle: {
      en: "Turn every guest message into a booked stay.",
      es: "Convierte cada mensaje de huésped en una reserva.",
    },
    heroSubtitle: {
      en: "OnDuty handles availability questions, booking requests, and stay logistics 24/7 across web, WhatsApp, and Telegram—so your front desk can focus on guests on-site.",
      es: "OnDuty atiende dudas de disponibilidad, solicitudes de reserva y logística de la estadía 24/7 por web, WhatsApp y Telegram, para que tu recepción se enfoque en los huéspedes en el hotel.",
    },
    primaryBenefit: {
      en: "Capture more direct bookings while reducing front-desk overload.",
      es: "Captura más reservas directas reduciendo la carga en recepción.",
    },
    challenges: [
      {
        en: "Guests write at any hour asking about prices, availability, and policies.",
        es: "Los huéspedes escriben a cualquier hora preguntando por precios, disponibilidad y políticas.",
      },
      {
        en: "Front desk staff jumps between phone, WhatsApp, and OTAs without a unified view.",
        es: "El personal de recepción salta entre teléfono, WhatsApp y OTAs sin una vista unificada.",
      },
      {
        en: "Slow replies push guests back to OTAs with higher commissions.",
        es: "Las respuestas lentas empujan a los huéspedes de vuelta a las OTAs con más comisión.",
      },
    ],
    outcomes: [
      {
        en: "Consistent, instant answers about rooms, prices, and policies 24/7.",
        es: "Respuestas inmediatas y consistentes sobre habitaciones, precios y políticas las 24 horas.",
      },
      {
        en: "More direct bookings captured via smart follow-up flows.",
        es: "Más reservas directas gracias a flujos inteligentes de seguimiento.",
      },
      {
        en: "Front desk focuses on in-house guests instead of inbox chaos.",
        es: "Recepción se enfoca en los huéspedes presentes en vez del caos del buzón.",
      },
    ],
    metrics: [
      {
        label: {
          en: "Faster first response time",
          es: "Tiempo de primera respuesta más rápido",
        },
        value: "–70%",
        helper: {
          en: "From minutes to seconds on average.",
          es: "De minutos a segundos en promedio.",
        },
      },
      {
        label: {
          en: "More direct booking conversions",
          es: "Más conversiones en reservas directas",
        },
        value: "+30%",
      },
    ],
    handledByOnDuty: [
      {
        title: {
          en: "Availability & pricing FAQs",
          es: "Preguntas de disponibilidad y precios",
        },
        description: {
          en: "OnDuty answers questions about room types, dates, prices, and basic policies without involving staff.",
          es: "OnDuty responde preguntas sobre tipos de habitación, fechas, precios y políticas básicas sin involucrar al personal.",
        },
      },
      {
        title: {
          en: "Pre-stay & check-in coordination",
          es: "Coordinación de pre-estadía y check-in",
        },
        description: {
          en: "Collect arrival times, special requests, and upsell late checkout or extras before guests arrive.",
          es: "Recoge horas de llegada, solicitudes especiales y ofrece late check-out o extras antes de la llegada.",
        },
      },
      {
        title: {
          en: "Lead capture from web and messaging apps",
          es: "Captura de leads desde web y apps de mensajería",
        },
        description: {
          en: "Turn website and WhatsApp inquiries into structured leads your team can close.",
          es: "Convierte consultas de la web y WhatsApp en leads estructurados que tu equipo puede cerrar.",
        },
      },
    ],
    exampleConversation: [
      {
        from: "user",
        text: {
          en: "Hi, do you have a room for two adults this weekend?",
          es: "Hola, ¿tienen una habitación para dos adultos este fin de semana?",
        },
      },
      {
        from: "agent",
        text: {
          en: "Hi! Yes, we have availability from Friday to Sunday. Do you prefer a standard or suite? I can also share the exact price.",
          es: "¡Hola! Sí, tenemos disponibilidad de viernes a domingo. ¿Prefieres estándar o suite? También puedo compartirte el precio exacto.",
        },
      },
      {
        from: "user",
        text: {
          en: "Standard is fine. What’s the total with breakfast?",
          es: "Estándar está bien. ¿Cuál es el total con desayuno?",
        },
      },
      {
        from: "agent",
        text: {
          en: "A standard room with breakfast for two is USD 180 total. I can lock this rate and take your details now if you’d like.",
          es: "Una habitación estándar con desayuno para dos tiene un total de 180 USD. Puedo asegurar esta tarifa y tomar tus datos ahora si quieres.",
        },
      },
    ],
    workflowSteps: [
      {
        title: {
          en: "Capture guest intent",
          es: "Captura la intención del huésped",
        },
        description: {
          en: "OnDuty detects dates, number of guests, and preferences from the first message.",
          es: "OnDuty detecta fechas, número de huéspedes y preferencias desde el primer mensaje.",
        },
      },
      {
        title: {
          en: "Offer best options",
          es: "Ofrece las mejores opciones",
        },
        description: {
          en: "The agent suggests available room types and rates, following your pricing rules.",
          es: "El agente sugiere tipos de habitación y tarifas disponibles según tus reglas de precios.",
        },
      },
      {
        title: {
          en: "Collect booking details",
          es: "Recoge datos de la reserva",
        },
        description: {
          en: "It gathers guest details and preferences, ready for your PMS or team to confirm.",
          es: "Recoge datos y preferencias de los huéspedes, listo para tu PMS o tu equipo.",
        },
      },
      {
        title: {
          en: "Upsell & follow up",
          es: "Upsell y seguimiento",
        },
        description: {
          en: "OnDuty nudges guests with upgrades, late checkout and stay information.",
          es: "OnDuty impulsa upgrades, late check-out e información de la estadía.",
        },
      },
    ],
    kpis: [
      {
        en: "Direct bookings",
        es: "Reservas directas",
      },
      {
        en: "First response time",
        es: "Tiempo de primera respuesta",
      },
      {
        en: "Front desk workload",
        es: "Carga de trabajo en recepción",
      },
    ],
    channels: [
      {
        en: "Website chat",
        es: "Chat en el sitio web",
      },
      {
        en: "WhatsApp Business",
        es: "WhatsApp Business",
      },
      {
        en: "Telegram & other messengers",
        es: "Telegram y otros mensajeros",
      },
    ],
  },
  {
    slug: "restaurants",
    icon: "🍽️",
    label: {
      en: "Restaurants & cafés",
      es: "Restaurantes y cafés",
    },
    badge: {
      en: "USE CASE · F&B",
      es: "CASO DE USO · RESTAURANTES",
    },
    heroTitle: {
      en: "Turn menu questions into fully booked tables.",
      es: "Convierte las dudas de menú en mesas llenas.",
    },
    heroSubtitle: {
      en: "OnDuty handles reservations, menu questions, and basic logistics on autopilot so your team can focus on service, not inboxes.",
      es: "OnDuty gestiona reservas, preguntas de menú y logística básica en automático para que tu equipo se enfoque en el servicio, no en los chats.",
    },
    primaryBenefit: {
      en: "Fill more tables while answering guests instantly on their favorite channels.",
      es: "Llena más mesas respondiendo al instante en los canales favoritos de tus clientes.",
    },
    challenges: [
      {
        en: "Staff answers the same questions about hours, location, and menu all day long.",
        es: "El personal responde las mismas preguntas sobre horarios, ubicación y menú todo el día.",
      },
      {
        en: "Reservations arrive across WhatsApp, Instagram and phone with no structure.",
        es: "Las reservas llegan por WhatsApp, Instagram y teléfono sin estructura.",
      },
      {
        en: "During peak hours, nobody has time to answer messages quickly.",
        es: "En horas pico nadie tiene tiempo para responder mensajes rápido.",
      },
    ],
    outcomes: [
      {
        en: "Guests receive instant confirmations and clear information 24/7.",
        es: "Los clientes reciben confirmaciones e información clara 24/7.",
      },
      {
        en: "Structured reservation details arrive ready for your host or POS.",
        es: "Los detalles de reserva llegan estructurados y listos para tu host o POS.",
      },
      {
        en: "Fewer no-shows thanks to smart reminders and follow-ups.",
        es: "Menos no-shows gracias a recordatorios y seguimientos inteligentes.",
      },
    ],
    metrics: [
      {
        label: {
          en: "No-show reduction",
          es: "Reducción de no-shows",
        },
        value: "–25%",
      },
      {
        label: {
          en: "More reservations via messaging",
          es: "Más reservas por mensajería",
        },
        value: "+40%",
      },
    ],
    handledByOnDuty: [
      {
        title: {
          en: "Reservations & group bookings",
          es: "Reservas y grupos",
        },
        description: {
          en: "OnDuty collects party size, time, special requests and confirms instantly within your rules.",
          es: "OnDuty recoge número de personas, hora, solicitudes especiales y confirma al instante según tus reglas.",
        },
      },
      {
        title: {
          en: "Menu & dietary FAQs",
          es: "Preguntas de menú y dietas",
        },
        description: {
          en: "Answer questions about dishes, allergens and vegetarian options using your latest menu.",
          es: "Responde preguntas sobre platos, alérgenos y opciones vegetarianas usando tu menú actualizado.",
        },
      },
      {
        title: {
          en: "Reminders & upsells",
          es: "Recordatorios y upsells",
        },
        description: {
          en: "Send reminders, propose early or late seating, and suggest specials before guests arrive.",
          es: "Envía recordatorios, propone horarios alternos y sugiere especiales antes de que lleguen.",
        },
      },
    ],
    exampleConversation: [
      {
        from: "user",
        text: {
          en: "Hi, can I book a table for 4 tonight around 8pm?",
          es: "Hola, ¿puedo reservar una mesa para 4 hoy alrededor de las 8 pm?",
        },
      },
      {
        from: "agent",
        text: {
          en: "Of course. We have availability at 7:45 pm or 8:15 pm. Which time do you prefer?",
          es: "Claro. Tenemos disponibilidad a las 7:45 pm o 8:15 pm. ¿Cuál prefieres?",
        },
      },
      {
        from: "user",
        text: {
          en: "8:15 is perfect. We have one vegetarian.",
          es: "8:15 está perfecto. Uno de nosotros es vegetariano.",
        },
      },
      {
        from: "agent",
        text: {
          en: "Great, your table for 4 at 8:15 pm is confirmed. I’ll share vegetarian options and see you tonight!",
          es: "Perfecto, tu mesa para 4 a las 8:15 pm está confirmada. Te comparto algunas opciones vegetarianas y nos vemos esta noche.",
        },
      },
    ],
    workflowSteps: [
      {
        title: {
          en: "Capture reservation",
          es: "Captura la reserva",
        },
        description: {
          en: "OnDuty collects date, time, party size and contact details in a structured way.",
          es: "OnDuty recoge fecha, hora, número de personas y contacto de forma estructurada.",
        },
      },
      {
        title: {
          en: "Apply your rules",
          es: "Aplica tus reglas",
        },
        description: {
          en: "Capacity limits, time windows and no-show policies are enforced automatically.",
          es: "Capacidad, rangos de horario y políticas de no-show se aplican automáticamente.",
        },
      },
      {
        title: {
          en: "Confirm & notify",
          es: "Confirma y notifica",
        },
        description: {
          en: "Guests get instant confirmation and calendar-friendly details.",
          es: "Los clientes reciben confirmación inmediata y detalles listos para el calendario.",
        },
      },
      {
        title: {
          en: "Follow up",
        es: "Da seguimiento",
        },
        description: {
          en: "Send reminders and manage changes or cancellations without human effort.",
          es: "Envía recordatorios y gestiona cambios o cancelaciones sin esfuerzo humano.",
        },
      },
    ],
    kpis: [
      { en: "Reservations via chat", es: "Reservas por chat" },
      { en: "No-show rate", es: "Tasa de no-shows" },
      { en: "Response time during peak hours", es: "Tiempo de respuesta en horas pico" },
    ],
    channels: [
      { en: "Website widget", es: "Widget en el sitio" },
      { en: "WhatsApp & Instagram DMs", es: "WhatsApp y mensajes de Instagram" },
      { en: "Telegram", es: "Telegram" },
    ],
  },
  {
    slug: "clinics",
    icon: "🩺",
    label: {
      en: "Clinics, dentists & health centers",
      es: "Clínicas, dentistas y centros de salud",
    },
    badge: {
      en: "USE CASE · HEALTH",
      es: "CASO DE USO · SALUD",
    },
    heroTitle: {
      en: "Let patients book and get answers without calling reception.",
      es: "Deja que los pacientes reserven y obtengan respuestas sin llamar a recepción.",
    },
    heroSubtitle: {
      en: "OnDuty automates appointment requests, pre-visit questions, and basic triage so your staff spends more time on care—not phone calls.",
      es: "OnDuty automatiza solicitudes de cita, preguntas previas y triage básico para que tu equipo dedique más tiempo a la atención y menos a llamadas.",
    },
    primaryBenefit: {
      en: "Reduce phone congestion and make it easier for patients to show up prepared.",
      es: "Reduce la congestión telefónica y facilita que los pacientes lleguen preparados.",
    },
    challenges: [
      {
        en: "Reception spends most of the day answering the same questions about schedules and prices.",
        es: "Recepción pasa el día respondiendo las mismas preguntas sobre horarios y precios.",
      },
      {
        en: "Patients forget prep instructions or show up at the wrong time.",
        es: "Los pacientes olvidan instrucciones o llegan a la hora equivocada.",
      },
      {
        en: "No simple way to pre-qualify which cases are urgent vs. routine.",
        es: "No hay forma sencilla de diferenciar casos urgentes de consultas rutinarias.",
      },
    ],
    outcomes: [
      {
        en: "Patients request or confirm appointments 24/7 over chat.",
        es: "Los pacientes solicitan o confirman citas 24/7 por chat.",
      },
      {
        en: "Automated reminders reduce missed appointments.",
        es: "Recordatorios automáticos reducen las ausencias.",
      },
      {
        en: "Basic triage helps route complex cases faster.",
        es: "Un triage básico ayuda a canalizar casos complejos más rápido.",
      },
    ],
    metrics: [
      {
        label: {
          en: "Missed appointments",
          es: "Citas perdidas",
        },
        value: "–20%",
      },
      {
        label: {
          en: "Calls answered by staff",
          es: "Llamadas atendidas por el personal",
        },
        value: "–35%",
      },
    ],
    handledByOnDuty: [
      {
        title: {
          en: "Appointment requests",
          es: "Solicitudes de cita",
        },
        description: {
          en: "OnDuty collects preferred dates, doctor, and reason for visit, and forwards structured requests.",
          es: "OnDuty recoge fechas, médico y motivo de consulta, y envía solicitudes estructuradas.",
        },
      },
      {
        title: {
          en: "Pre-visit instructions",
          es: "Instrucciones previas a la cita",
        },
        description: {
          en: "Share fasting rules, documents to bring, and arrival times automatically.",
          es: "Comparte reglas de ayuno, documentos necesarios y horas de llegada de forma automática.",
        },
      },
      {
        title: {
          en: "Basic triage & routing",
          es: "Triage básico y canalización",
        },
        description: {
          en: "Guide patients to emergency, teleconsultation or routine visit flows based on their answers.",
          es: "Guía a los pacientes hacia urgencias, teleconsulta o visita rutinaria según sus respuestas.",
        },
      },
    ],
    exampleConversation: [
      {
        from: "user",
        text: {
          en: "Hi, I’d like to schedule a dental cleaning next week.",
          es: "Hola, quiero agendar una limpieza dental para la próxima semana.",
        },
      },
      {
        from: "agent",
        text: {
          en: "Hi! I can help with that. Do you prefer mornings or afternoons, and which day works best?",
          es: "¡Hola! Puedo ayudarte con eso. ¿Prefieres en las mañanas o en las tardes, y qué día te sirve más?",
        },
      },
      {
        from: "user",
        text: {
          en: "Afternoon, any day except Friday.",
          es: "En la tarde, cualquier día menos viernes.",
        },
      },
      {
        from: "agent",
        text: {
          en: "Perfect. I’ll send your request to our team for Tuesday or Wednesday afternoon. You’ll receive confirmation and pre-visit instructions shortly.",
          es: "Perfecto. Enviaré tu solicitud para martes o miércoles en la tarde. En breve recibirás la confirmación y las instrucciones previas.",
        },
      },
    ],
    workflowSteps: [
      {
        title: {
          en: "Collect intent & basic info",
          es: "Recoge intención e información básica",
        },
        description: {
          en: "OnDuty identifies the type of appointment and gathers essential details.",
          es: "OnDuty identifica el tipo de cita y reúne los datos esenciales.",
        },
      },
      {
        title: {
          en: "Check clinic rules",
          es: "Aplica reglas de la clínica",
        },
        description: {
          en: "Availability windows and prep requirements are applied automatically.",
          es: "Ventanas de disponibilidad y requisitos de preparación se aplican automáticamente.",
        },
      },
      {
        title: {
          en: "Send to scheduling",
          es: "Envía a agenda",
        },
        description: {
          en: "Requests arrive structured for your staff or scheduling system.",
          es: "Las solicitudes llegan estructuradas para tu equipo o sistema de agenda.",
        },
      },
      {
        title: {
          en: "Remind & follow up",
          es: "Recuerda y da seguimiento",
        },
        description: {
          en: "OnDuty sends reminders and handles reschedules or basic questions.",
          es: "OnDuty envía recordatorios y gestiona cambios o preguntas básicas.",
        },
      },
    ],
    kpis: [
      { en: "Missed appointments", es: "Citas perdidas" },
      { en: "Call volume", es: "Volumen de llamadas" },
      { en: "Patient satisfaction", es: "Satisfacción de pacientes" },
    ],
    channels: [
      { en: "Website widget", es: "Widget web" },
      { en: "WhatsApp & SMS", es: "WhatsApp y SMS" },
      { en: "Telegram", es: "Telegram" },
    ],
  },
  {
    slug: "real-estate",
    icon: "🏠",
    label: {
      en: "Real estate agencies & brokers",
      es: "Inmobiliarias y corredores",
    },
    badge: {
      en: "USE CASE · REAL ESTATE",
      es: "CASO DE USO · INMOBILIARIO",
    },
    heroTitle: {
      en: "Qualify leads while you sleep.",
      es: "Califica leads mientras duermes.",
    },
    heroSubtitle: {
      en: "OnDuty captures buyer and renter intent, answers property questions and books viewings automatically, so you only spend time on serious leads.",
      es: "OnDuty captura la intención de compradores e inquilinos, responde dudas de propiedades y agenda visitas en automático, para que solo dediques tiempo a leads serios.",
    },
    primaryBenefit: {
      en: "Never lose another property lead because nobody was available to reply.",
      es: "Nunca más pierdas un lead de propiedad por falta de respuesta.",
    },
    challenges: [
      {
        en: "Leads come from many portals and social networks, all asking similar questions.",
        es: "Los leads vienen de muchos portales y redes sociales, todos con preguntas similares.",
      },
      {
        en: "Agents waste time on low-intent leads who will never close.",
        es: "Los agentes pierden tiempo con leads de baja intención que nunca van a cerrar.",
      },
      {
        en: "Coordinating visits across agents, owners and prospects is chaotic.",
        es: "Coordinar visitas entre agentes, dueños y prospectos es caótico.",
      },
    ],
    outcomes: [
      {
        en: "Every lead gets an instant response with key property details.",
        es: "Cada lead recibe respuesta inmediata con detalles clave de la propiedad.",
      },
      {
        en: "Only qualified leads reach your team, with budget and timeframe captured.",
        es: "Solo leads calificados llegan a tu equipo, con presupuesto y plazo registrados.",
      },
      {
        en: "Viewings are proposed and penciled in without manual back-and-forth.",
        es: "Las visitas se proponen y pre-agendan sin tanto ida y vuelta manual.",
      },
    ],
    metrics: [
      {
        label: {
          en: "Lead qualification time",
          es: "Tiempo de calificación de leads",
        },
        value: "–60%",
      },
      {
        label: {
          en: "Visits booked per week",
          es: "Visitas agendadas por semana",
        },
        value: "+25%",
      },
    ],
    handledByOnDuty: [
      {
        title: {
          en: "Lead intake & scoring",
          es: "Recepción y scoring de leads",
        },
        description: {
          en: "Capture budget, location, timeframe and property type in structured fields.",
          es: "Captura presupuesto, ubicación, plazo y tipo de propiedad en campos estructurados.",
        },
      },
      {
        title: {
          en: "Property FAQ automation",
          es: "Automatización de FAQs de propiedades",
        },
        description: {
          en: "Answer questions about size, amenities, HOA fees and more from your listings.",
          es: "Responde dudas sobre área, amenidades, administración y más a partir de tus fichas.",
        },
      },
      {
        title: {
          en: "Viewing coordination",
          es: "Coordinación de visitas",
        },
        description: {
          en: "Propose time slots and send requests to agents/owners without endless back-and-forth.",
          es: "Propone horarios y envía solicitudes a agentes/dueños sin interminables idas y vueltas.",
        },
      },
    ],
    exampleConversation: [
      {
        from: "user",
        text: {
          en: "Hi, is the 2-bed apartment on 5th Avenue still available?",
          es: "Hola, ¿el apartamento de 2 habitaciones en la 5ª Avenida sigue disponible?",
        },
      },
      {
        from: "agent",
        text: {
          en: "Hi! Yes, it’s still available. What’s your approximate budget and when would you like to move?",
          es: "¡Hola! Sí, sigue disponible. ¿Cuál es tu presupuesto aproximado y cuándo te gustaría mudarte?",
        },
      },
      {
        from: "user",
        text: {
          en: "Up to USD 1,200 and I’d like to move within 2 months.",
          es: "Hasta 1.200 USD y me gustaría mudarme en máximo 2 meses.",
        },
      },
      {
        from: "agent",
        text: {
          en: "Great, you’re within range. I can schedule a viewing this week. Do you prefer weekday evenings or Saturday?",
          es: "Perfecto, estás dentro del rango. Puedo agendar una visita esta semana. ¿Prefieres entre semana en la tarde o el sábado?",
        },
      },
    ],
    workflowSteps: [
      {
        title: {
          en: "Capture lead details",
          es: "Captura los datos del lead",
        },
        description: {
          en: "OnDuty collects budget, timing and preferences from the first messages.",
          es: "OnDuty recopila presupuesto, tiempos y preferencias desde los primeros mensajes.",
        },
      },
      {
        title: {
          en: "Match with listings",
          es: "Empareja con propiedades",
        },
        description: {
          en: "It checks your inventory and suggests relevant properties automatically.",
          es: "Revisa tu inventario y sugiere propiedades relevantes automáticamente.",
        },
      },
      {
        title: {
          en: "Coordinate viewings",
          es: "Coordina visitas",
        },
        description: {
          en: "OnDuty proposes time windows and sends visits to your scheduling flow.",
          es: "OnDuty propone horarios y envía las visitas a tu flujo de agenda.",
        },
      },
      {
        title: {
          en: "Track & follow up",
          es: "Registra y da seguimiento",
        },
        description: {
          en: "Leads and visit outcomes are logged so you can follow up efficiently.",
          es: "Leads y resultados de visitas quedan registrados para un seguimiento eficiente.",
        },
      },
    ],
    kpis: [
      { en: "Qualified leads", es: "Leads calificados" },
      { en: "Time to first contact", es: "Tiempo hasta el primer contacto" },
      { en: "Viewings booked", es: "Visitas agendadas" },
    ],
    channels: [
      { en: "Website chat", es: "Chat web" },
      { en: "WhatsApp & Facebook", es: "WhatsApp y Facebook" },
      { en: "Portals & landing pages", es: "Portales y landing pages" },
    ],
  },
  {
    slug: "politics",
    icon: "🏛️",
    label: {
      en: "Politicians & public figures",
      es: "Políticos y figuras públicas",
    },
    badge: {
      en: "USE CASE · PUBLIC SECTOR",
      es: "CASO DE USO · SECTOR PÚBLICO",
    },
    heroTitle: {
      en: "Bring order to public inbox chaos.",
      es: "Pon orden al caos de mensajes ciudadanos.",
    },
    heroSubtitle: {
      en: "OnDuty categorizes citizen messages, answers common questions and routes sensitive topics so your team can respond faster and more transparently.",
      es: "OnDuty clasifica mensajes ciudadanos, responde preguntas frecuentes y canaliza temas sensibles para que tu equipo responda más rápido y con transparencia.",
    },
    primaryBenefit: {
      en: "Be reachable 24/7 without burning out your staff.",
      es: "Sé accesible 24/7 sin quemar a tu equipo.",
    },
    challenges: [
      {
        en: "Thousands of messages arrive across WhatsApp, social media and email.",
        es: "Miles de mensajes llegan por WhatsApp, redes sociales y correo.",
      },
      {
        en: "Citizens ask the same process and benefit questions over and over.",
        es: "Los ciudadanos preguntan una y otra vez por procesos y beneficios.",
      },
      {
        en: "Sensitive cases get buried under general feedback.",
        es: "Casos sensibles se pierden entre comentarios generales.",
      },
    ],
    outcomes: [
      {
        en: "Citizens receive fast, consistent answers on basic topics.",
        es: "Los ciudadanos reciben respuestas rápidas y consistentes en temas básicos.",
      },
      {
        en: "Critical cases are detected and routed to the right staff.",
        es: "Los casos críticos se detectan y canalizan al equipo correcto.",
      },
      {
        en: "Your office gains a clearer picture of recurring issues.",
        es: "Tu oficina gana una visión clara de los problemas recurrentes.",
      },
    ],
    metrics: [
      {
        label: {
          en: "Average response time",
          es: "Tiempo promedio de respuesta",
        },
        value: "–50%",
      },
      {
        label: {
          en: "Issues automatically resolved",
          es: "Casos resueltos automáticamente",
        },
        value: "+40%",
      },
    ],
    handledByOnDuty: [
      {
        title: {
          en: "FAQs about programs & benefits",
          es: "FAQs de programas y beneficios",
        },
        description: {
          en: "OnDuty explains application steps, requirements and timelines based on your official information.",
          es: "OnDuty explica pasos, requisitos y tiempos de trámite según tu información oficial.",
        },
      },
      {
        title: {
          en: "Message categorization",
          es: "Categorización de mensajes",
        },
        description: {
          en: "It tags messages as complaints, suggestions, press, emergencies or general requests.",
          es: "Etiqueta mensajes como quejas, sugerencias, prensa, emergencias o solicitudes generales.",
        },
      },
      {
        title: {
          en: "Routing & escalation",
          es: "Canalización y escalamiento",
        },
        description: {
          en: "Sensitive topics can be flagged and sent directly to specific teams or advisors.",
          es: "Los temas sensibles se marcan y se envían directo a equipos o asesores específicos.",
        },
      },
    ],
    exampleConversation: [
      {
        from: "user",
        text: {
          en: "Hi, how can I apply to the housing subsidy program?",
          es: "Hola, ¿cómo puedo aplicar al programa de subsidio de vivienda?",
        },
      },
      {
        from: "agent",
        text: {
          en: "Hi! I’ll guide you. First, I’ll confirm if you meet the basic requirements. Are you currently registered in the citizen database?",
          es: "¡Hola! Te guío con gusto. Primero confirmaré si cumples los requisitos básicos. ¿Actualmente estás registrado en la base de datos de ciudadanos?",
        },
      },
      {
        from: "user",
        text: {
          en: "Yes, I registered last year.",
          es: "Sí, me registré el año pasado.",
        },
      },
      {
        from: "agent",
        text: {
          en: "Perfect. I’ll send you the link to the online form and the list of documents you’ll need to upload.",
          es: "Perfecto. Te envío el enlace al formulario en línea y la lista de documentos que debes subir.",
        },
      },
    ],
    workflowSteps: [
      {
        title: {
          en: "Collect & classify",
          es: "Recoge y clasifica",
        },
        description: {
          en: "OnDuty captures citizen messages and tags them by topic and urgency.",
          es: "OnDuty captura los mensajes y los etiqueta por tema y urgencia.",
        },
      },
      {
        title: {
          en: "Answer or escalate",
          es: "Responde o escala",
        },
        description: {
          en: "Common questions are answered automatically; complex ones go to your team.",
          es: "Las preguntas comunes se responden automáticamente; las complejas van a tu equipo.",
        },
      },
      {
        title: {
          en: "Track issues",
          es: "Haz seguimiento",
        },
        description: {
          en: "Categorized messages feed dashboards that show recurring pain points.",
          es: "Los mensajes categorizados alimentan tableros que muestran los temas recurrentes.",
        },
      },
      {
        title: {
          en: "Improve communications",
          es: "Mejora la comunicación",
        },
        description: {
          en: "Use insights to refine programs and proactive messaging.",
          es: "Usa los insights para ajustar programas y mensajes proactivos.",
        },
      },
    ],
    kpis: [
      { en: "Response time to citizens", es: "Tiempo de respuesta al ciudadano" },
      { en: "Requests resolved automatically", es: "Solicitudes resueltas automáticamente" },
      { en: "Insight into recurring issues", es: "Visibilidad de problemas recurrentes" },
    ],
    channels: [
      { en: "Website & portals", es: "Sitio web y portales" },
      { en: "WhatsApp & SMS", es: "WhatsApp y SMS" },
      { en: "Social DMs (via integrations)", es: "Mensajes en redes (vía integraciones)" },
    ],
  },
  {
    slug: "telecom",
    icon: "📶",
    label: {
      en: "Telecom & internet providers",
      es: "Telecomunicaciones y proveedores de internet",
    },
    badge: {
      en: "USE CASE · TELCO",
      es: "CASO DE USO · TELCO",
    },
    heroTitle: {
      en: "Deflect basic tickets before they hit your call center.",
      es: "Desvía tickets básicos antes de que lleguen al call center.",
    },
    heroSubtitle: {
      en: "OnDuty answers outage FAQs, plan questions and billing basics at scale, while routing complex cases to human support.",
      es: "OnDuty responde FAQs sobre fallas, planes y facturación a gran escala, y canaliza casos complejos a soporte humano.",
    },
    primaryBenefit: {
      en: "Reduce call volume and keep customers informed during incidents.",
      es: "Reduce el volumen de llamadas y mantiene informados a los clientes durante incidentes.",
    },
    challenges: [
      {
        en: "High peaks in calls and chats during outages or billing cycles.",
        es: "Picos altos de llamadas y chats durante fallas o cierres de ciclo de facturación.",
      },
      {
        en: "Agents repeat the same troubleshooting steps all day.",
        es: "Los agentes repiten los mismos pasos de diagnóstico todo el día.",
      },
      {
        en: "Customers feel nobody is listening when wait times spike.",
        es: "Los clientes sienten que nadie los escucha cuando aumenta el tiempo de espera.",
      },
    ],
    outcomes: [
      {
        en: "Customers get clear, instant answers about known issues and basic questions.",
        es: "Los clientes reciben respuestas claras e inmediatas sobre fallas conocidas y preguntas básicas.",
      },
      {
        en: "Simple cases are solved in chat; complex ones reach your team already pre-qualified.",
        es: "Los casos simples se resuelven en el chat; los complejos llegan a tu equipo pre-calificados.",
      },
      {
        en: "Call center load drops, especially during crises.",
        es: "La carga del call center disminuye, sobre todo en momentos críticos.",
      },
    ],
    metrics: [
      {
        label: {
          en: "Deflected tickets",
          es: "Tickets desviados",
        },
        value: "30–50%",
      },
      {
        label: {
          en: "Time to inform during outages",
          es: "Tiempo para informar durante fallas",
        },
        value: "Seconds",
      },
    ],
    handledByOnDuty: [
      {
        title: {
          en: "Outage & status FAQs",
          es: "FAQs de fallas y estado del servicio",
        },
        description: {
          en: "OnDuty explains current incidents, affected areas and ETA based on your status page.",
          es: "OnDuty explica incidentes actuales, zonas afectadas y ETA según tu página de estado.",
        },
      },
      {
        title: {
          en: "Plan & upgrade guidance",
          es: "Guía de planes y upgrades",
        },
        description: {
          en: "It recommends plans or add-ons based on usage and customer profile.",
          es: "Recomienda planes o add-ons según uso y perfil del cliente.",
        },
      },
      {
        title: {
          en: "Basic troubleshooting",
          es: "Diagnóstico básico",
        },
        description: {
          en: "Runs scripted troubleshooting flows before escalating to a human agent.",
          es: "Ejecuta flujos de diagnóstico antes de escalar a un agente humano.",
        },
      },
    ],
    exampleConversation: [
      {
        from: "user",
        text: {
          en: "My internet has been slow all afternoon. Is there an issue in my area?",
          es: "Mi internet ha estado lento toda la tarde. ¿Hay algún problema en mi zona?",
        },
      },
      {
        from: "agent",
        text: {
          en: "I’ll check for you. Can you share your address or account number?",
          es: "Reviso por ti. ¿Puedes compartir tu dirección o número de cuenta?",
        },
      },
      {
        from: "user",
        text: {
          en: "Account 58493, Bogotá, Cedritos.",
          es: "Cuenta 58493, Bogotá, Cedritos.",
        },
      },
      {
        from: "agent",
        text: {
          en: "There’s a known incident in your neighborhood. Our team is working on it and the estimated time to resolution is 7:30 pm. I’ll send you an update when it’s back to normal.",
          es: "Hay un incidente conocido en tu barrio. Nuestro equipo ya está trabajando y el tiempo estimado de solución es 7:30 pm. Te avisaré cuando el servicio esté normalizado.",
        },
      },
    ],
    workflowSteps: [
      {
        title: {
          en: "Identify customer & context",
          es: "Identifica cliente y contexto",
        },
        description: {
          en: "OnDuty asks for minimal data to find the account and region.",
          es: "OnDuty pide los datos mínimos para encontrar la cuenta y la zona.",
        },
      },
      {
        title: {
          en: "Check known issues",
          es: "Verifica fallas conocidas",
        },
        description: {
          en: "It checks your status feed or knowledge base for live incidents.",
          es: "Consulta tu feed de estado o base de conocimiento para ver incidentes activos.",
        },
      },
      {
        title: {
          en: "Run basic flows",
          es: "Ejecuta flujos básicos",
        },
        description: {
          en: "Performs troubleshooting scripts when there’s no general outage.",
          es: "Aplica scripts de diagnóstico cuando no hay falla general.",
        },
      },
      {
        title: {
          en: "Escalate if needed",
          es: "Escala si es necesario",
        },
        description: {
          en: "Sends detailed context to human agents when escalation is required.",
          es: "Envía contexto detallado a agentes humanos cuando hay que escalar.",
        },
      },
    ],
    kpis: [
      { en: "Ticket deflection", es: "Desvío de tickets" },
      { en: "Average handle time", es: "Tiempo promedio de atención" },
      { en: "Customer satisfaction", es: "Satisfacción del cliente" },
    ],
    channels: [
      { en: "Website & app chat", es: "Chat en web y app" },
      { en: "WhatsApp & SMS", es: "WhatsApp y SMS" },
      { en: "IVR handoff to chat", es: "Handoff desde IVR a chat" },
    ],
  },
  {
    slug: "banks",
    icon: "🏦",
    label: {
      en: "Banks & fintech wallets",
      es: "Bancos y billeteras fintech",
    },
    badge: {
      en: "USE CASE · FINANCIAL SERVICES",
      es: "CASO DE USO · SERVICIOS FINANCIEROS",
    },
    heroTitle: {
      en: "Give clients instant answers without compromising security.",
      es: "Da respuestas instantáneas sin comprometer la seguridad.",
    },
    heroSubtitle: {
      en: "OnDuty handles card FAQs, onboarding questions and basic account information while routing sensitive operations to your secure flows.",
      es: "OnDuty gestiona FAQs de tarjetas, dudas de apertura y consultas básicas de cuenta, redirigiendo operaciones sensibles a tus flujos seguros.",
    },
    primaryBenefit: {
      en: "Reduce pressure on support while keeping customers informed and confident.",
      es: "Reduce la presión sobre soporte manteniendo a los clientes informados y confiados.",
    },
    challenges: [
      {
        en: "Clients get frustrated waiting to ask simple questions about cards or limits.",
        es: "Los clientes se frustran esperando para hacer preguntas simples sobre tarjetas o límites.",
      },
      {
        en: "Agents answer the same onboarding and KYC questions every day.",
        es: "Los agentes responden las mismas dudas de onboarding y KYC todos los días.",
      },
      {
        en: "Complex, sensitive operations need clear routing and disclaimers.",
        es: "Las operaciones complejas y sensibles requieren una canalización y disclaimers claros.",
      },
    ],
    outcomes: [
      {
        en: "Clients self-serve most basic questions 24/7.",
        es: "Los clientes se auto-atienden en la mayoría de las preguntas básicas 24/7.",
      },
      {
        en: "Onboarding flows move faster with fewer drop-offs.",
        es: "Los flujos de onboarding avanzan más rápido con menos abandonos.",
      },
      {
        en: "Support teams focus on high-value, sensitive cases.",
        es: "Los equipos de soporte se enfocan en casos sensibles y de alto valor.",
      },
    ],
    metrics: [
      {
        label: {
          en: "Self-served interactions",
          es: "Interacciones auto-atendidas",
        },
        value: "40–60%",
      },
      {
        label: {
          en: "Onboarding completion rate",
          es: "Tasa de finalización de onboarding",
        },
        value: "+15%",
      },
    ],
    handledByOnDuty: [
      {
        title: {
          en: "Card & account FAQs",
          es: "FAQs de tarjetas y cuentas",
        },
        description: {
          en: "Explain limits, fees, freezes and replacements within your policy framework.",
          es: "Explica límites, costos, bloqueos y reposiciones según tus políticas.",
        },
      },
      {
        title: {
          en: "Onboarding assistance",
          es: "Asistencia en onboarding",
        },
        description: {
          en: "Guide users through KYC, document upload and basic troubleshooting.",
          es: "Guía a los usuarios con KYC, carga de documentos y resolución básica de problemas.",
        },
      },
      {
        title: {
          en: "Smart routing for sensitive ops",
          es: "Canalización de operaciones sensibles",
        },
        description: {
          en: "Direct anything involving transactions, passwords or PINs to secure flows or humans.",
          es: "Dirige toda operación relacionada con transacciones, contraseñas o PINs a flujos seguros o agentes.",
        },
      },
    ],
    exampleConversation: [
      {
        from: "user",
        text: {
          en: "Hi, my card was declined online. Do I have a limit?",
          es: "Hola, mi tarjeta fue rechazada en línea. ¿Tengo algún límite?",
        },
      },
      {
        from: "agent",
        text: {
          en: "I can explain how limits work and share common reasons for declines. For your security, I won’t ask for full card details here.",
          es: "Puedo explicarte cómo funcionan los límites y las causas comunes de rechazo. Por seguridad, no te pediré datos completos de la tarjeta aquí.",
        },
      },
      {
        from: "user",
        text: {
          en: "Okay, what should I check?",
          es: "Ok, ¿qué debo revisar?",
        },
      },
      {
        from: "agent",
        text: {
          en: "First, confirm your available balance in the app and that online purchases are enabled. If everything looks fine, I can connect you with support to review your specific case.",
          es: "Primero, confirma tu saldo disponible en la app y que las compras en línea estén habilitadas. Si todo está bien, puedo conectarte con soporte para revisar tu caso específico.",
        },
      },
    ],
    workflowSteps: [
      {
        title: {
          en: "Clarify intent",
          es: "Aclara la intención",
        },
        description: {
          en: "OnDuty identifies whether the user has a question, a claim or a sensitive operation.",
          es: "OnDuty identifica si el usuario tiene una duda, un reclamo o una operación sensible.",
        },
      },
      {
        title: {
          en: "Self-service where safe",
          es: "Self-service donde es seguro",
        },
        description: {
          en: "Provide detailed answers when no account-level action is required.",
          es: "Entrega respuestas detalladas cuando no se requiere acción a nivel de cuenta.",
        },
      },
      {
        title: {
          en: "Route to secure flows",
          es: "Canaliza a flujos seguros",
        },
        description: {
          en: "If authentication or transactions are needed, route users to your app or a human.",
          es: "Si se requiere autenticación o transacciones, guía al usuario a tu app o a un humano.",
        },
      },
      {
        title: {
          en: "Log interactions",
          es: "Registra interacciones",
        },
        description: {
          en: "Summarize the conversation so your team has context on each case.",
          es: "Resume la conversación para que tu equipo tenga contexto en cada caso.",
        },
      },
    ],
    kpis: [
      { en: "Self-service rate", es: "Tasa de autoservicio" },
      { en: "Onboarding completion", es: "Finalización de onboarding" },
      { en: "Average wait time", es: "Tiempo promedio de espera" },
    ],
    channels: [
      { en: "Website & in-app chat", es: "Chat web y en la app" },
      { en: "WhatsApp & SMS", es: "WhatsApp y SMS" },
      { en: "Secure handoff flows", es: "Flujos de derivación segura" },
    ],
  },
  {
    slug: "ecommerce",
    icon: "🛒",
    label: {
      en: "E-commerce & retail",
      es: "E-commerce y retail",
    },
    badge: {
      en: "USE CASE · COMMERCE",
      es: "CASO DE USO · COMERCIO",
    },
    heroTitle: {
      en: "Turn product questions into checkouts, not abandoned carts.",
      es: "Convierte las dudas de producto en compras, no en carritos abandonados.",
    },
    heroSubtitle: {
      en: "OnDuty helps shoppers find products, understand policies and track orders without waiting for an agent.",
      es: "OnDuty ayuda a los compradores a encontrar productos, entender políticas y rastrear pedidos sin esperar a un agente.",
    },
    primaryBenefit: {
      en: "Boost conversion while reducing repetitive support tickets.",
      es: "Incrementa la conversión y reduce tickets repetitivos.",
    },
    challenges: [
      {
        en: "Shoppers abandon carts after small doubts about size, shipping or returns.",
        es: "Los compradores abandonan el carrito por pequeñas dudas sobre talla, envío o devoluciones.",
      },
      {
        en: "Support spends hours answering order status questions.",
        es: "Soporte gasta horas respondiendo el estado de pedidos.",
      },
      {
        en: "Hard to provide guidance at scale across web, WhatsApp and marketplaces.",
        es: "Es difícil ofrecer asesoría a escala en web, WhatsApp y marketplaces.",
      },
    ],
    outcomes: [
      {
        en: "Shoppers receive instant, contextual help during checkout.",
        es: "Los compradores reciben ayuda contextual e inmediata en el checkout.",
      },
      {
        en: "Order status questions are handled automatically.",
        es: "Las preguntas sobre estado de pedido se atienden automáticamente.",
      },
      {
        en: "Support focuses on complex cases and VIP customers.",
        es: "Soporte se enfoca en casos complejos y clientes VIP.",
      },
    ],
    metrics: [
      {
        label: {
          en: "Conversion rate uplift",
          es: "Incremento en tasa de conversión",
        },
        value: "+5–10%",
      },
      {
        label: {
          en: "Order status tickets",
          es: "Tickets de estado de pedido",
        },
        value: "–40%",
      },
    ],
    handledByOnDuty: [
      {
        title: {
          en: "Product discovery & sizing",
          es: "Descubrimiento de productos y tallas",
        },
        description: {
          en: "OnDuty recommends products and explains sizing or specs based on your catalog.",
          es: "OnDuty recomienda productos y explica tallas o especificaciones basándose en tu catálogo.",
        },
      },
      {
        title: {
          en: "Order tracking",
          es: "Rastreo de pedidos",
        },
        description: {
          en: "Connect order IDs to tracking links and shipping status to answer in seconds.",
          es: "Conecta IDs de pedido con links de rastreo y estado de envío para responder en segundos.",
        },
      },
      {
        title: {
          en: "Policy & returns FAQs",
          es: "FAQs de políticas y devoluciones",
        },
        description: {
          en: "Explain returns, exchanges and warranties using your policy language.",
          es: "Explica devoluciones, cambios y garantías usando el lenguaje de tus políticas.",
        },
      },
    ],
    exampleConversation: [
      {
        from: "user",
        text: {
          en: "Does this jacket run small or true to size?",
          es: "¿Esta chaqueta viene reducida o talla normal?",
        },
      },
      {
        from: "agent",
        text: {
          en: "Most customers say it runs slightly small. If you’re between sizes, we recommend going one size up.",
          es: "La mayoría de clientes dice que viene ligeramente reducida. Si estás entre tallas, te recomendamos ir una talla arriba.",
        },
      },
      {
        from: "user",
        text: {
          en: "Okay, and how long does shipping to Medellín take?",
          es: "Ok, ¿y cuánto tarda el envío a Medellín?",
        },
      },
      {
        from: "agent",
        text: {
          en: "Standard shipping to Medellín takes 3–5 business days. Express takes 1–2 days. I can add this to your cart now.",
          es: "El envío estándar a Medellín tarda de 3 a 5 días hábiles. El exprés tarda de 1 a 2 días. Puedo agregar esto a tu carrito ahora.",
        },
      },
    ],
    workflowSteps: [
      {
        title: {
          en: "Assist during browsing",
          es: "Asiste durante la navegación",
        },
        description: {
          en: "OnDuty helps shoppers find the right product or variation.",
          es: "OnDuty ayuda a los compradores a encontrar el producto o variación adecuada.",
        },
      },
      {
        title: {
          en: "Answer pre-purchase doubts",
          es: "Resuelve dudas de compra",
        },
        description: {
          en: "It responds to size, shipping and policy questions in real time.",
          es: "Responde dudas de talla, envío y políticas en tiempo real.",
        },
      },
      {
        title: {
          en: "Handle order status",
          es: "Gestiona el estado de pedidos",
        },
        description: {
          en: "Order lookups are handled automatically via tracking data.",
          es: "Las consultas de pedidos se resuelven automáticamente con datos de rastreo.",
        },
      },
      {
        title: {
          en: "Escalate special cases",
          es: "Escala casos especiales",
        },
        description: {
          en: "VIP issues or complex claims are routed with summarized context.",
          es: "Los casos VIP o reclamos complejos se escalan con contexto resumido.",
        },
      },
    ],
    kpis: [
      { en: "Conversion rate", es: "Tasa de conversión" },
      { en: "Cart abandonment", es: "Abandono de carrito" },
      { en: "Support ticket volume", es: "Volumen de tickets de soporte" },
    ],
    channels: [
      { en: "On-site chat & product pages", es: "Chat en sitio y fichas de producto" },
      { en: "WhatsApp & social DMs", es: "WhatsApp y mensajes en redes" },
      { en: "Post-purchase email & SMS", es: "Email y SMS post-compra" },
    ],
  },
  {
    slug: "saas",
    icon: "💻",
    label: {
      en: "SaaS & B2B products",
      es: "SaaS y productos B2B",
    },
    badge: {
      en: "USE CASE · B2B",
      es: "CASO DE USO · B2B",
    },
    heroTitle: {
      en: "Qualify inbound leads and support users without adding headcount.",
      es: "Califica leads entrantes y soporta usuarios sin aumentar headcount.",
    },
    heroSubtitle: {
      en: "OnDuty handles demo requests, pricing questions and basic product support, routing qualified leads straight to your sales team.",
      es: "OnDuty gestiona solicitudes de demo, dudas de precios y soporte básico, enviando leads calificados directo a tu equipo de ventas.",
    },
    primaryBenefit: {
      en: "Grow pipeline while keeping support lean.",
      es: "Haz crecer el pipeline manteniendo soporte ligero.",
    },
    challenges: [
      {
        en: "Founders and sales teams are stuck answering basic questions instead of closing deals.",
        es: "Fundadores y ventas se quedan respondiendo dudas básicas en vez de cerrar negocios.",
      },
      {
        en: "Users ask recurring how-to questions that docs already explain.",
        es: "Los usuarios preguntan lo mismo que ya está en la documentación.",
      },
      {
        en: "No unified way to capture lead quality from chat conversations.",
        es: "No hay una forma unificada de capturar calidad de leads desde el chat.",
      },
    ],
    outcomes: [
      {
        en: "Leads get immediate, helpful responses and are scored in the background.",
        es: "Los leads reciben respuestas útiles al instante y se califican en segundo plano.",
      },
      {
        en: "Basic support is handled 24/7 using your docs and playbooks.",
        es: "El soporte básico se atiende 24/7 usando tu documentación y playbooks.",
      },
      {
        en: "Sales only sees the most qualified, ready-to-talk accounts.",
        es: "Ventas solo ve las cuentas más calificadas y listas para hablar.",
      },
    ],
    metrics: [
      {
        label: {
          en: "Sales-qualified leads",
          es: "Leads calificados para ventas",
        },
        value: "+20–30%",
      },
      {
        label: {
          en: "Support tickets per MAU",
          es: "Tickets de soporte por MAU",
        },
        value: "–25%",
      },
    ],
    handledByOnDuty: [
      {
        title: {
          en: "Lead qualification",
          es: "Calificación de leads",
        },
        description: {
          en: "OnDuty asks about team size, use case and timeline, then scores leads.",
          es: "OnDuty pregunta por tamaño de equipo, caso de uso y plazo, y puntúa los leads.",
        },
      },
      {
        title: {
          en: "Pricing & packaging FAQs",
          es: "FAQs de precios y paquetes",
        },
        description: {
          en: "Explain plan differences, trials and upgrades using your pricing page logic.",
          es: "Explica diferencias de planes, pruebas y upgrades según tu lógica de precios.",
        },
      },
      {
        title: {
          en: "In-product assistance",
          es: "Asistencia dentro del producto",
        },
        description: {
          en: "Guide users through common workflows based on your documentation.",
          es: "Guía a los usuarios por flujos comunes según tu documentación.",
        },
      },
    ],
    exampleConversation: [
      {
        from: "user",
        text: {
          en: "We’re a 15-person team. Which plan should we start with?",
          es: "Somos un equipo de 15 personas. ¿Con qué plan deberíamos empezar?",
        },
      },
      {
        from: "agent",
        text: {
          en: "For 15 users, most customers start with the Growth plan. Can you tell me if you mainly need analytics, collaboration, or automations?",
          es: "Para 15 usuarios, la mayoría de clientes inicia con el plan Growth. ¿Me cuentas si necesitan principalmente analítica, colaboración o automatizaciones?",
        },
      },
      {
        from: "user",
        text: {
          en: "Automations and reporting are key for us.",
          es: "Automatizaciones y reportes son claves para nosotros.",
        },
      },
      {
        from: "agent",
        text: {
          en: "Perfect. I’ll recommend a configuration for you and can also connect you with sales to explore a tailored package.",
          es: "Perfecto. Te recomiendo una configuración y también puedo conectarte con ventas para revisar un paquete a medida.",
        },
      },
    ],
    workflowSteps: [
      {
        title: {
          en: "Capture use case",
          es: "Captura el caso de uso",
        },
        description: {
          en: "OnDuty identifies the problem the lead wants to solve.",
          es: "OnDuty identifica el problema que el lead quiere resolver.",
        },
      },
      {
        title: {
          en: "Score the lead",
          es: "Puntúa el lead",
        },
        description: {
          en: "It scores based on role, team size, urgency and budget where available.",
          es: "Puntúa según rol, tamaño de equipo, urgencia y presupuesto cuando aplica.",
        },
      },
      {
        title: {
          en: "Assist or escalate",
          es: "Asiste o escala",
        },
        description: {
          en: "Gives immediate help or routes high-score leads to sales.",
          es: "Brinda ayuda inmediata o envía leads de alta puntuación a ventas.",
        },
      },
      {
        title: {
          en: "Log to CRM",
          es: "Registra en el CRM",
        },
        description: {
          en: "Conversations and scores sync to your CRM or pipeline tools.",
          es: "Las conversaciones y puntajes se sincronizan con tu CRM o herramientas de pipeline.",
        },
      },
    ],
    kpis: [
      { en: "Sales-qualified leads", es: "Leads SQL" },
      { en: "Time to first response", es: "Tiempo a primera respuesta" },
      { en: "Support tickets", es: "Tickets de soporte" },
    ],
    channels: [
      { en: "Marketing site chat", es: "Chat en el sitio de marketing" },
      { en: "In-app widget", es: "Widget dentro del producto" },
      { en: "WhatsApp & email handoffs", es: "Handoffs via WhatsApp y email" },
    ],
  },
  {
    slug: "education",
    icon: "🎓",
    label: {
      en: "Education & online courses",
      es: "Educación y cursos en línea",
    },
    badge: {
      en: "USE CASE · EDUCATION",
      es: "CASO DE USO · EDUCACIÓN",
    },
    heroTitle: {
      en: "Answer admission and program questions before students drop off.",
      es: "Responde dudas de admisión y programas antes de que los estudiantes abandonen.",
    },
    heroSubtitle: {
      en: "OnDuty explains programs, dates and requirements, and helps prospects move from interest to enrollment.",
      es: "OnDuty explica programas, fechas y requisitos, y ayuda a que los interesados pasen de la curiosidad a la matrícula.",
    },
    primaryBenefit: {
      en: "Increase applications and keep current students informed.",
      es: "Incrementa las aplicaciones y mantiene informados a los estudiantes actuales.",
    },
    challenges: [
      {
        en: "Prospective students ask the same questions about programs, costs and deadlines.",
        es: "Los aspirantes preguntan lo mismo sobre programas, costos y fechas límite.",
      },
      {
        en: "Admin staff is overwhelmed during enrollment periods.",
        es: "El equipo administrativo se desborda en los periodos de inscripción.",
      },
      {
        en: "Information is scattered across PDFs and pages.",
        es: "La información está dispersa en PDFs y páginas.",
      },
    ],
    outcomes: [
      {
        en: "Prospects get clear answers 24/7 in their language.",
        es: "Los aspirantes obtienen respuestas claras 24/7 en su idioma.",
      },
      {
        en: "Applicants understand the steps and show up with correct documents.",
        es: "Los aplicantes entienden los pasos y llevan los documentos correctos.",
      },
      {
        en: "Staff can focus on complex cases and academic advising.",
        es: "El personal puede enfocarse en casos complejos y asesoría académica.",
      },
    ],
    metrics: [
      {
        label: {
          en: "Applications started",
          es: "Aplicaciones iniciadas",
        },
        value: "+10–15%",
      },
      {
        label: {
          en: "Admin inquiries",
          es: "Consultas administrativas",
        },
        value: "–30%",
      },
    ],
    handledByOnDuty: [
      {
        title: {
          en: "Program & requirements FAQs",
          es: "FAQs de programas y requisitos",
        },
        description: {
          en: "Explain differences between programs, lengths, and required documents.",
          es: "Explica diferencias entre programas, duración y documentos requeridos.",
        },
      },
      {
        title: {
          en: "Deadlines & dates",
          es: "Fechas y plazos",
        },
        description: {
          en: "Keep prospects updated on application windows and tuition deadlines.",
          es: "Mantiene a los interesados al día sobre ventanas de aplicación y plazos de pago.",
        },
      },
      {
        title: {
          en: "Student support basics",
          es: "Soporte básico a estudiantes",
        },
        description: {
          en: "Answer simple questions about schedules, campus services and online access.",
          es: "Responde preguntas sencillas sobre horarios, servicios de campus y acceso online.",
        },
      },
    ],
    exampleConversation: [
      {
        from: "user",
        text: {
          en: "What’s the difference between the Data Science diploma and the bootcamp?",
          es: "¿Cuál es la diferencia entre el diplomado de Data Science y el bootcamp?",
        },
      },
      {
        from: "agent",
        text: {
          en: "Great question. The diploma lasts 12 months part-time, while the bootcamp is 12 weeks full-time. Do you prefer to study while working or full-time?",
          es: "Buena pregunta. El diplomado dura 12 meses part-time, y el bootcamp 12 semanas full-time. ¿Prefieres estudiar mientras trabajas o de tiempo completo?",
        },
      },
      {
        from: "user",
        text: {
          en: "I need to keep working.",
          es: "Necesito seguir trabajando.",
        },
      },
      {
        from: "agent",
        text: {
          en: "Then the diploma is likely a better fit. I can send you the admission requirements and the next start date.",
          es: "Entonces el diplomado probablemente sea mejor para ti. Puedo enviarte los requisitos de admisión y la próxima fecha de inicio.",
        },
      },
    ],
    workflowSteps: [
      {
        title: {
          en: "Identify the right program",
          es: "Identifica el programa adecuado",
        },
        description: {
          en: "OnDuty captures goals, schedule and budget to recommend programs.",
          es: "OnDuty recopila objetivos, disponibilidad y presupuesto para recomendar programas.",
        },
      },
      {
        title: {
          en: "Clarify requirements",
          es: "Aclara requisitos",
        },
        description: {
          en: "Explains what documents and prior studies are needed.",
          es: "Explica qué documentos y estudios previos se requieren.",
        },
      },
      {
        title: {
          en: "Guide through application",
          es: "Guía durante la aplicación",
        },
        description: {
          en: "Walks prospects through each step and shares links to forms.",
          es: "Acompaña a los aspirantes en cada paso y comparte enlaces a formularios.",
        },
      },
      {
        title: {
          en: "Support current students",
          es: "Soporta a estudiantes actuales",
        },
        description: {
          en: "Answers basic questions about schedules, payments and platforms.",
          es: "Responde preguntas básicas sobre horarios, pagos y plataformas.",
        },
      },
    ],
    kpis: [
      { en: "Applications started", es: "Aplicaciones iniciadas" },
      { en: "Applications completed", es: "Aplicaciones completadas" },
      { en: "Admin tickets", es: "Tickets administrativos" },
    ],
    channels: [
      { en: "Program pages", es: "Páginas de programas" },
      { en: "WhatsApp & email", es: "WhatsApp y email" },
      { en: "Student portal", es: "Portal de estudiantes" },
    ],
  },
  {
    slug: "events",
    icon: "🎟️",
    label: {
      en: "Events, venues & ticketing",
      es: "Eventos, venues y ticketing",
    },
    badge: {
      en: "USE CASE · EVENTS",
      es: "CASO DE USO · EVENTOS",
    },
    heroTitle: {
      en: "Sell more tickets while answering fans automatically.",
      es: "Vende más boletas respondiendo a fans en automático.",
    },
    heroSubtitle: {
      en: "OnDuty answers questions about dates, access, and tickets, and routes group or VIP requests to your team.",
      es: "OnDuty responde dudas sobre fechas, accesos y boletas, y canaliza solicitudes de grupos o VIP a tu equipo.",
    },
    primaryBenefit: {
      en: "Keep fans informed in real time without overwhelming your staff.",
      es: "Mantén a los fans informados en tiempo real sin saturar a tu equipo.",
    },
    challenges: [
      {
        en: "Fans flood DMs and WhatsApp before every event.",
        es: "Los fans saturan los mensajes y WhatsApp antes de cada evento.",
      },
      {
        en: "People ask the same questions about access, parking and prohibited items.",
        es: "La gente pregunta lo mismo sobre accesos, parqueaderos y objetos prohibidos.",
      },
      {
        en: "VIP and group deals are buried inside basic questions.",
        es: "Las solicitudes VIP y de grupos se pierden entre preguntas básicas.",
      },
    ],
    outcomes: [
      {
        en: "Attendees get clear instructions and buy with confidence.",
        es: "Los asistentes reciben instrucciones claras y compran con confianza.",
      },
      {
        en: "VIP and group requests are surfaced quickly.",
        es: "Las solicitudes VIP y de grupos se identifican rápidamente.",
      },
      {
        en: "Your team spends less time repeating logistics.",
        es: "Tu equipo pasa menos tiempo repitiendo logística.",
      },
    ],
    metrics: [
      {
        label: {
          en: "Pre-event inquiries handled by AI",
          es: "Consultas pre-evento atendidas por IA",
        },
        value: "60–80%",
      },
      {
        label: {
          en: "Time spent on basic logistics",
          es: "Tiempo en logística básica",
        },
        value: "–50%",
      },
    ],
    handledByOnDuty: [
      {
        title: {
          en: "Event info & logistics",
          es: "Información y logística del evento",
        },
        description: {
          en: "Share schedules, entrances, parking and allowed items automatically.",
          es: "Comparte horarios, ingresos, parqueaderos y objetos permitidos de forma automática.",
        },
      },
      {
        title: {
          en: "Ticketing FAQs",
          es: "FAQs de boletas",
        },
        description: {
          en: "Explain ticket types, upgrades and how to solve common issues.",
          es: "Explica tipos de boleta, upgrades y cómo resolver problemas comunes.",
        },
      },
      {
        title: {
          en: "Group & VIP routing",
          es: "Canalización de grupos y VIP",
        },
        description: {
          en: "Detect high-value inquiries and route them to sales or production.",
          es: "Detecta consultas de alto valor y las envía a ventas o producción.",
        },
      },
    ],
    exampleConversation: [
      {
        from: "user",
        text: {
          en: "What time do doors open for Saturday’s concert?",
          es: "¿A qué hora abren puertas para el concierto del sábado?",
        },
      },
      {
        from: "agent",
        text: {
          en: "Doors open at 5:30 pm and the main act starts at 8:00 pm. I can also send you parking and access info.",
          es: "Las puertas abren a las 5:30 pm y el acto principal empieza a las 8:00 pm. También puedo enviarte información de parqueadero y accesos.",
        },
      },
      {
        from: "user",
        text: {
          en: "Is there a VIP entrance?",
          es: "¿Hay entrada VIP?",
        },
      },
      {
        from: "agent",
        text: {
          en: "Yes, VIP and box tickets enter through Gate 3 on the north side. I can share a map link if you’d like.",
          es: "Sí, las entradas VIP y palcos ingresan por la Puerta 3 en el costado norte. Puedo compartirte un mapa si quieres.",
        },
      },
    ],
    workflowSteps: [
      {
        title: {
          en: "Centralize fan questions",
          es: "Centraliza las preguntas de fans",
        },
        description: {
          en: "OnDuty receives questions from your site, WhatsApp and socials.",
          es: "OnDuty recibe preguntas desde tu web, WhatsApp y redes.",
        },
      },
      {
        title: {
          en: "Answer logistics at scale",
          es: "Responde logística a escala",
        },
        description: {
          en: "Uses your event brief to reply consistently to everyone.",
          es: "Usa tu brief del evento para responder de forma consistente.",
        },
      },
      {
        title: {
          en: "Highlight VIP + groups",
          es: "Resalta VIP y grupos",
        },
        description: {
          en: "Tags high-value opportunities and forwards them to your team.",
          es: "Etiqueta oportunidades de alto valor y las reenvía a tu equipo.",
        },
      },
      {
        title: {
          en: "Collect insights",
          es: "Recoge insights",
        },
        description: {
          en: "Summarizes common doubts to improve future communication.",
          es: "Resume las dudas frecuentes para mejorar la comunicación futura.",
        },
      },
    ],
    kpis: [
      { en: "Tickets sold via chat influence", es: "Boletas vendidas con influencia del chat" },
      { en: "Pre-event ticket volume", es: "Volumen de tickets pre-evento" },
      { en: "Fan satisfaction", es: "Satisfacción de fans" },
    ],
    channels: [
      { en: "Event site & landing pages", es: "Sitio del evento y landings" },
      { en: "WhatsApp & Telegram", es: "WhatsApp y Telegram" },
      { en: "Instagram DMs", es: "Mensajes de Instagram" },
    ],
  },
  {
    slug: "fitness",
    icon: "🏋️",
    label: {
      en: "Gyms & fitness / wellness studios",
      es: "Gimnasios y estudios de bienestar",
    },
    badge: {
      en: "USE CASE · FITNESS",
      es: "CASO DE USO · FITNESS",
    },
    heroTitle: {
      en: "Keep members informed and prospects moving toward signup.",
      es: "Mantén informados a tus miembros y lleva a los prospectos al registro.",
    },
    heroSubtitle: {
      en: "OnDuty answers questions about memberships, schedules and classes, and collects leads for your sales team.",
      es: "OnDuty responde dudas sobre membresías, horarios y clases, y captura leads para tu equipo comercial.",
    },
    primaryBenefit: {
      en: "Reduce front-desk interruptions while keeping members engaged.",
      es: "Reduce interrupciones en recepción y mantiene a los miembros comprometidos.",
    },
    challenges: [
      {
        en: "Prospects ask about prices and schedules but never fill out a form.",
        es: "Los prospectos preguntan por precios y horarios pero nunca llenan un formulario.",
      },
      {
        en: "Members constantly ask about class capacity and last-minute changes.",
        es: "Los miembros preguntan constantemente por cupos en clases y cambios de última hora.",
      },
      {
        en: "Staff gets overwhelmed managing WhatsApp groups and DMs.",
        es: "El personal se satura gestionando grupos y DMs de WhatsApp.",
      },
    ],
    outcomes: [
      {
        en: "Prospects get guided to the right membership and trial.",
        es: "Los prospectos se guían hacia la membresía y prueba correctas.",
      },
      {
        en: "Members receive real-time updates about classes and changes.",
        es: "Los miembros reciben actualizaciones en tiempo real sobre clases y cambios.",
      },
      {
        en: "Your team spends more time on in-person experience, less on chat.",
        es: "Tu equipo dedica más tiempo a la experiencia presencial y menos al chat.",
      },
    ],
    metrics: [
      {
        label: {
          en: "Trial signups",
          es: "Registros a prueba",
        },
        value: "+15%",
      },
      {
        label: {
          en: "Front-desk chat volume",
          es: "Volumen de mensajes en recepción",
        },
        value: "–30%",
      },
    ],
    handledByOnDuty: [
      {
        title: {
          en: "Membership & pricing guidance",
          es: "Guía de membresías y precios",
        },
        description: {
          en: "Explain membership tiers, add-ons and promotions.",
          es: "Explica tipos de membresía, add-ons y promociones.",
        },
      },
      {
        title: {
          en: "Class schedules & capacity",
          es: "Horarios de clases y cupos",
        },
        description: {
          en: "Share up-to-date schedules and waitlist status with members.",
          es: "Comparte horarios actualizados y estado de listas de espera.",
        },
      },
      {
        title: {
          en: "Lead capture & follow-up",
          es: "Captura y seguimiento de leads",
        },
        description: {
          en: "Collect contact info and goals, then send to your sales pipeline.",
          es: "Recoge datos de contacto y objetivos, y los envía a tu pipeline comercial.",
        },
      },
    ],
    exampleConversation: [
      {
        from: "user",
        text: {
          en: "Do you have a plan that includes classes and gym access?",
          es: "¿Tienen un plan que incluya clases y acceso al gimnasio?",
        },
      },
      {
        from: "agent",
        text: {
          en: "Yes, our Full Access plan includes unlimited classes and full gym access. How many times per week do you usually train?",
          es: "Sí, nuestro plan Full Access incluye clases ilimitadas y acceso total al gym. ¿Cuántas veces a la semana sueles entrenar?",
        },
      },
      {
        from: "user",
        text: {
          en: "Around 3 times per week.",
          es: "Aproximadamente 3 veces a la semana.",
        },
      },
      {
        from: "agent",
        text: {
          en: "Perfect. I can book you a free trial for this week and share the schedule so you can pick your first class.",
          es: "Perfecto. Puedo agendarte una prueba gratis para esta semana y compartirte el horario para que elijas tu primera clase.",
        },
      },
    ],
    workflowSteps: [
      {
        title: {
          en: "Capture goals",
          es: "Captura objetivos",
        },
        description: {
          en: "OnDuty asks prospects about frequency and goals to recommend plans.",
          es: "OnDuty pregunta a los prospectos sobre frecuencia y objetivos para recomendar planes.",
        },
      },
      {
        title: {
          en: "Recommend plan",
          es: "Recomienda un plan",
        },
        description: {
          en: "Suggests memberships based on needs and budget.",
          es: "Sugiere membresías según necesidades y presupuesto.",
        },
      },
      {
        title: {
          en: "Book trial or class",
          es: "Agenda prueba o clase",
        },
        description: {
          en: "Offers trial signups and class spots directly from chat.",
          es: "Ofrece inscripciones de prueba y cupos a clases directamente desde el chat.",
        },
      },
      {
        title: {
          en: "Notify changes",
          es: "Notifica cambios",
        },
        description: {
          en: "Sends updates if instructors, rooms or times change.",
          es: "Envía avisos si cambian instructores, salas u horarios.",
        },
      },
    ],
    kpis: [
      { en: "Trial conversions", es: "Conversiones de prueba" },
      { en: "Membership signups", es: "Registros a membresía" },
      { en: "Member satisfaction", es: "Satisfacción de miembros" },
    ],
    channels: [
      { en: "Website & landing pages", es: "Sitio web y landings" },
      { en: "WhatsApp & Telegram", es: "WhatsApp y Telegram" },
      { en: "Member app or portal", es: "App o portal de miembros" },
    ],
  },
];
