import { type SupportedLanguage } from "../components/providers/LanguageProvider";

export type UseCaseSlug = "hotels" | "clinics" | "restaurants" | "real-estate" | "politics" | "telecom";

type LocalizedText = {
  en: string;
  es: string;
};

export interface UseCaseDefinition {
  slug: UseCaseSlug;
  icon: string;
  title: LocalizedText;
  description: LocalizedText;
  hero: LocalizedText;
  bullets: LocalizedText[];
  stats: Array<{ label: LocalizedText; value: string }>;
}

export const useCaseDefinitions: Record<UseCaseSlug, UseCaseDefinition> = {
  hotels: {
    slug: "hotels",
    icon: "🏨",
    title: { en: "Hotels & rentals", es: "Hoteles y alquileres" },
    description: {
      en: "Automate bookings, check-in questions, and upsell late checkout.",
      es: "Automatiza reservas, dudas de check-in y upsells de late checkout.",
    },
    hero: {
      en: "Turn every web or WhatsApp inquiry into a confirmed booking without adding headcount.",
      es: "Convierte cada consulta en web o WhatsApp en una reserva confirmada sin aumentar tu equipo.",
    },
    bullets: [
      {
        en: "Capture last-minute bookings and offer upsells like late checkout automatically.",
        es: "Captura reservas de última hora y ofrece upsells como late checkout automáticamente.",
      },
      {
        en: "Handle check-in details, directions, and room preferences 24/7.",
        es: "Gestiona detalles de check-in, indicaciones y preferencias de habitación 24/7.",
      },
    ],
    stats: [
      { label: { en: "Leads captured", es: "Leads captados" }, value: "+32%" },
      { label: { en: "Avg. response", es: "Tiempo de respuesta" }, value: "1.8s" },
    ],
  },
  clinics: {
    slug: "clinics",
    icon: "🦷",
    title: { en: "Clinics & dentists", es: "Clínicas y dentistas" },
    description: {
      en: "Answer FAQs, manage inquiries, and reduce no-shows.",
      es: "Responde FAQs, gestiona consultas y reduce ausencias.",
    },
    hero: {
      en: "Book consults and remind patients automatically so they actually show up.",
      es: "Agenda consultas y envía recordatorios automáticos para que los pacientes asistan.",
    },
    bullets: [
      {
        en: "Triage insurance, availability, and pricing questions without human handoff.",
        es: "Clasifica preguntas de seguros, disponibilidad y precios sin intervención humana.",
      },
      {
        en: "Automated reminders to cut no-shows and keep schedules full.",
        es: "Recordatorios automáticos para reducir ausencias y mantener la agenda llena.",
      },
    ],
    stats: [
      { label: { en: "No-show reduction", es: "Reducción de ausencias" }, value: "-22%" },
      { label: { en: "Response time", es: "Tiempo de respuesta" }, value: "2.1s" },
    ],
  },
  restaurants: {
    slug: "restaurants",
    icon: "🍽️",
    title: { en: "Restaurants", es: "Restaurantes" },
    description: {
      en: "Handle reservations, menus, and common questions in seconds.",
      es: "Gestiona reservas, menús y preguntas frecuentes en segundos.",
    },
    hero: {
      en: "Seat more guests with automated reservations and instant menu answers.",
      es: "Sienta más comensales con reservas automáticas y respuestas instantáneas sobre el menú.",
    },
    bullets: [
      {
        en: "Manage reservations, waitlists, and private dining inquiries automatically.",
        es: "Gestiona reservas, listas de espera e eventos privados automáticamente.",
      },
      {
        en: "Answer menu, allergen, and parking questions instantly across channels.",
        es: "Responde al instante sobre menú, alergias y estacionamiento en todos los canales.",
      },
    ],
    stats: [
      { label: { en: "Tables filled", es: "Mesas ocupadas" }, value: "+18%" },
      { label: { en: "Avg. response", es: "Tiempo de respuesta" }, value: "1.4s" },
    ],
  },
  "real-estate": {
    slug: "real-estate",
    icon: "🏠",
    title: { en: "Real estate", es: "Bienes raíces" },
    description: {
      en: "Qualify leads, schedule viewings, and follow up automatically.",
      es: "Califica leads, agenda visitas y haz seguimiento automáticamente.",
    },
    hero: {
      en: "Qualify every inquiry and book tours while your agents close deals.",
      es: "Califica cada consulta y agenda visitas mientras tus agentes cierran ventas.",
    },
    bullets: [
      {
        en: "Screen leads by budget, location, and move-in timing instantly.",
        es: "Filtra leads por presupuesto, ubicación y fecha de mudanza al instante.",
      },
      {
        en: "Auto-schedule showings and coordinate reminders across channels.",
        es: "Programa visitas y coordina recordatorios en todos los canales.",
      },
    ],
    stats: [
      { label: { en: "Qualified leads", es: "Leads calificados" }, value: "+27%" },
      { label: { en: "Response time", es: "Tiempo de respuesta" }, value: "1.6s" },
    ],
  },
  politics: {
    slug: "politics",
    icon: "📢",
    title: { en: "Politicians & public figures", es: "Políticos y figuras públicas" },
    description: {
      en: "Filter support requests and share key updates at scale.",
      es: "Filtra solicitudes y comparte actualizaciones clave a escala.",
    },
    hero: {
      en: "Keep constituents informed while routing sensitive requests to the right staff.",
      es: "Mantén informados a los ciudadanos y deriva solicitudes sensibles al equipo adecuado.",
    },
    bullets: [
      {
        en: "Auto-triage support, event info, and policy questions with guardrails.",
        es: "Clasifica soporte, eventos e información de políticas con reglas de seguridad.",
      },
      {
        en: "Summaries and alerts for urgent or sensitive conversations.",
        es: "Alertas y resúmenes para conversaciones urgentes o sensibles.",
      },
    ],
    stats: [
      { label: { en: "Constituent reach", es: "Alcance a ciudadanos" }, value: "+3x" },
      { label: { en: "Escalations caught", es: "Escalaciones detectadas" }, value: "99%" },
    ],
  },
  telecom: {
    slug: "telecom",
    icon: "📡",
    title: { en: "Telecom & ISPs", es: "Telecom e ISPs" },
    description: {
      en: "Triage support tickets before they hit your human team.",
      es: "Clasifica tickets de soporte antes de que lleguen a tu equipo humano.",
    },
    hero: {
      en: "Deflect routine outages and billing questions so agents stay focused on escalations.",
      es: "Desvía fallas rutinarias y dudas de facturación para que tu equipo atienda solo escalaciones.",
    },
    bullets: [
      {
        en: "Detect outage clusters and provide guided troubleshooting automatically.",
        es: "Detecta incidentes y ofrece guías de resolución automáticamente.",
      },
      {
        en: "Collect account details and context before handing off to humans.",
        es: "Recoge datos de cuenta y contexto antes de escalar a humanos.",
      },
    ],
    stats: [
      { label: { en: "Tickets deflected", es: "Tickets desviados" }, value: "+41%" },
      { label: { en: "Avg. response", es: "Tiempo de respuesta" }, value: "1.2s" },
    ],
  },
};

export function getUseCaseList(language: SupportedLanguage) {
  return Object.values(useCaseDefinitions).map((useCase) => ({
    slug: useCase.slug,
    icon: useCase.icon,
    title: useCase.title[language],
    description: useCase.description[language],
  }));
}

export function getUseCaseCopy(slug: UseCaseSlug, language: SupportedLanguage) {
  const definition = useCaseDefinitions[slug];
  if (!definition) return null;
  return {
    ...definition,
    title: definition.title[language],
    description: definition.description[language],
    hero: definition.hero[language],
    bullets: definition.bullets.map((b) => b[language]),
    stats: definition.stats.map((stat) => ({ label: stat.label[language], value: stat.value })),
  };
}

