import { useLanguage } from "../components/providers/LanguageProvider";

export const copy = {
  en: {
    nav: {
      features: "Features",
      useCases: "Use cases",
      pricing: "Pricing",
      login: "Login",
      signup: "Sign up for free",
    },
    hero: {
      badge: "ALWAYS-ON AI AGENTS",
      title: "AI sales & support that never clock out.",
      subtitle:
        "OnDuty connects to your web, WhatsApp, and Telegram channels to handle leads, bookings, and customer questions 24/7—without adding headcount.",
      primaryCta: "Try our agent",
      secondaryCta: "See use cases",
    },
    features: {
      heading: "Built for modern revenue and support teams",
      subheading: "Always-on AI agents tuned for revenue, retention, and service.",
      items: [
        {
          title: "Always-on sales",
          description: "Capture leads, qualify intent, and book meetings while your team sleeps.",
        },
        {
          title: "Smarter support",
          description: "Deflect FAQs, resolve common issues instantly, and escalate when it matters.",
        },
        {
          title: "Unified inbox",
          description: "View every conversation by tenant, channel, and customer in one place.",
        },
      ],
    },
    useCases: {
      heading: "Use cases across industries",
      cta: "Learn more",
      subheading: "Industry-specific agents that respect your workflows.",
    },
    pricing: {
      heading: "Simple plans to get started fast",
      subheading: "Start free with a trial. Upgrade only when you’re ready.",
      tiers: [
        {
          title: "Starter",
          copy: "Hosted web chat, CS agent, basic analytics.",
          plan: "starter",
        },
        {
          title: "Growth",
          copy: "Sales + CS agent, more analytics, more seats.",
          plan: "growth",
        },
        {
          title: "Premium",
          copy: "Channel integrations, advanced analytics.",
          plan: "premium",
        },
      ],
    },
    footer: {
      privacy: "Privacy",
      terms: "Terms",
      contact: "Contact",
    },
    overview: {
      heading: "Find the right playbook for your industry",
      subheading: "OnDuty adapts to the channels and workflows your teams already use.",
    },
  },
  es: {
    nav: {
      features: "Características",
      useCases: "Casos de uso",
      pricing: "Precios",
      login: "Iniciar sesión",
      signup: "Crear cuenta",
    },
    hero: {
      badge: "AGENTES DE IA SIEMPRE ACTIVOS",
      title: "Ventas y soporte con IA que nunca se desconectan.",
      subtitle:
        "OnDuty se conecta a tu web, WhatsApp y Telegram para gestionar leads, reservas y preguntas de clientes 24/7, sin aumentar el equipo.",
      primaryCta: "Probar nuestro agente",
      secondaryCta: "Ver casos de uso",
    },
    features: {
      heading: "Diseñado para equipos modernos de ventas y soporte",
      subheading: "Agentes de IA siempre activos, enfocados en ingresos y soporte.",
      items: [
        {
          title: "Ventas siempre encendidas",
          description: "Captura leads, califica intención y agenda reuniones mientras duermes.",
        },
        {
          title: "Soporte más inteligente",
          description: "Resuelve preguntas frecuentes al instante y escala cuando es necesario.",
        },
        {
          title: "Bandeja unificada",
          description: "Ve cada conversación por tenant, canal y cliente en un solo lugar.",
        },
      ],
    },
    useCases: {
      heading: "Casos de uso por industria",
      cta: "Ver más",
      subheading: "Agentes específicos para cada industria y flujo de trabajo.",
    },
    pricing: {
      heading: "Planes simples para empezar rápido",
      subheading: "Comienza gratis con un trial y mejora cuando estés listo.",
      tiers: [
        {
          title: "Starter",
          copy: "Chat web alojado, agente de soporte, analíticas básicas.",
          plan: "starter",
        },
        {
          title: "Growth",
          copy: "Agente de ventas + soporte, más analíticas y asientos.",
          plan: "growth",
        },
        {
          title: "Premium",
          copy: "Integraciones de canales, analíticas avanzadas.",
          plan: "premium",
        },
      ],
    },
    footer: {
      privacy: "Privacidad",
      terms: "Términos",
      contact: "Contacto",
    },
    overview: {
      heading: "Encuentra el playbook ideal para tu industria",
      subheading: "OnDuty se adapta a los canales y flujos de trabajo que ya usas.",
    },
  },
};

export function useCopy() {
  const { language } = useLanguage();
  return copy[language];
}

