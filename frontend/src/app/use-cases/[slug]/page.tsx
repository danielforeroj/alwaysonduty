"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { PrimaryButton, SecondaryButton } from "../../../components/Buttons";
import { useLanguage } from "../../../components/providers/LanguageProvider";
import { getUseCaseDetail } from "../../../lib/useCases";

const copy = {
  en: {
    back: "← Back to use cases",
    notFoundTitle: "Not found",
    notFoundBody: "This use case is not available yet.",
    try: "Try our agent",
    signup: "Sign up for free",
    challenges: "Pain points we solve",
    outcomes: "Outcomes you can expect",
    metrics: "Signals & metrics",
    handled: "Handled by OnDuty",
    conversation: "Example conversation",
    workflow: "Workflow steps",
    kpis: "KPIs to watch",
    channels: "Channels covered",
  },
  es: {
    back: "← Volver a casos de uso",
    notFoundTitle: "No encontrado",
    notFoundBody: "Este caso aún no está disponible.",
    try: "Probar nuestro agente",
    signup: "Crear cuenta",
    challenges: "Puntos de dolor que resolvemos",
    outcomes: "Resultados que puedes esperar",
    metrics: "Señales y métricas",
    handled: "Qué atiende OnDuty",
    conversation: "Conversación de ejemplo",
    workflow: "Pasos del flujo",
    kpis: "KPIs a seguir",
    channels: "Canales cubiertos",
  },
};

export default function UseCaseDetailPage() {
  const params = useParams();
  const { language } = useLanguage();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : (params?.slug as string);
  const useCase = getUseCaseDetail(slug, language);
  const t = copy[language];

  if (!useCase) {
    return (
      <div className="space-y-6 rounded-3xl border border-slate-200 bg-white/90 p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-3xl font-bold text-onDutyNavy dark:text-white">{t.notFoundTitle}</h1>
        <p className="text-slate-600 dark:text-slate-300">{t.notFoundBody}</p>
        <PrimaryButton href="/use-cases" className="justify-center">
          {t.back}
        </PrimaryButton>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-indigo-50 via-white to-amber-50 p-10 shadow-xl dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        <div className="space-y-4">
          <Link href="/use-cases" className="inline-flex items-center gap-2 text-sm font-semibold text-onDutyNavy underline-offset-4 hover:underline dark:text-onDutyGold">
            {t.back}
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{useCase.icon}</span>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-onDutyWine dark:text-onDutyGold">{useCase.badge}</p>
              <h1 className="text-4xl font-bold text-onDutyNavy dark:text-white">{useCase.label}</h1>
            </div>
          </div>
          <p className="text-lg font-semibold text-onDutyNavy dark:text-onDutyGold">{useCase.heroTitle}</p>
          <p className="max-w-3xl text-lg text-slate-700 dark:text-slate-300">{useCase.heroSubtitle}</p>
          <div className="flex flex-wrap gap-3 text-sm font-semibold">
            <PrimaryButton href="/try">{t.try}</PrimaryButton>
            <SecondaryButton href="/signup">{t.signup}</SecondaryButton>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6 rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-semibold text-onDutyNavy dark:text-white">{t.challenges}</h2>
          <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
            {useCase.challenges.map((item, idx) => (
              <li key={`${useCase.slug}-challenge-${idx}`} className="flex gap-3">
                <span className="mt-1 text-onDutyWine dark:text-onDutyGold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <h3 className="text-lg font-semibold text-onDutyNavy dark:text-white">{t.outcomes}</h3>
          <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
            {useCase.outcomes.map((item, idx) => (
              <li key={`${useCase.slug}-outcome-${idx}`} className="flex gap-3">
                <span className="mt-1 text-onDutyWine dark:text-onDutyGold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-semibold text-onDutyNavy dark:text-white">{t.metrics}</h2>
          <div className="space-y-3">
            {useCase.metrics.map((stat, idx) => (
              <div
                key={`${useCase.slug}-metric-${idx}`}
                className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-3 text-sm dark:border-slate-800 dark:bg-slate-800"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-600 dark:text-slate-300">{stat.label}</span>
                  <span className="font-semibold text-onDutyNavy dark:text-onDutyGold">{stat.value}</span>
                </div>
                {stat.helper && <p className="text-xs text-slate-500 dark:text-slate-400">{stat.helper}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-onDutyNavy dark:text-white">{t.handled}</h2>
            <span className="text-xs font-semibold text-onDutyWine dark:text-onDutyGold">OnDuty</span>
          </div>
          <div className="space-y-4">
            {useCase.handledByOnDuty.map((item, idx) => (
              <div key={`${useCase.slug}-handled-${idx}`} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-800/80">
                <p className="text-sm font-semibold text-onDutyNavy dark:text-white">{item.title}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-semibold text-onDutyNavy dark:text-white">{t.conversation}</h2>
          <div className="space-y-3 text-sm">
            {useCase.exampleConversation.map((message, idx) => (
              <div
                key={`${useCase.slug}-message-${idx}`}
                className={`${
                  message.from === "agent"
                    ? "ml-auto max-w-[85%] rounded-2xl bg-emerald-50 px-4 py-3 text-onDutyNavy shadow-sm dark:bg-emerald-900/60 dark:text-emerald-100"
                    : "max-w-[85%] rounded-2xl bg-slate-100 px-4 py-3 text-slate-800 shadow-sm dark:bg-slate-800 dark:text-slate-100"
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-onDutyWine dark:text-onDutyGold">
                  {message.from === "agent" ? "OnDuty" : "User"}
                </p>
                <p>{message.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-onDutyNavy dark:text-white">{t.workflow}</h2>
            <span className="text-xs font-semibold text-onDutyWine dark:text-onDutyGold">{useCase.channels.length} channels</span>
          </div>
          <ol className="space-y-3">
            {useCase.workflowSteps.map((step, idx) => (
              <li
                key={`${useCase.slug}-workflow-${idx}`}
                className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-800/70"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-onDutyGold/30 text-xs font-bold text-onDutyNavy">
                  {idx + 1}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-onDutyNavy dark:text-white">{step.title}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <div className="space-y-3 rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-lg font-semibold text-onDutyNavy dark:text-white">{t.kpis}</h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              {useCase.kpis.map((kpi, idx) => (
                <li key={`${useCase.slug}-kpi-${idx}`} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-onDutyNavy dark:bg-onDutyGold" aria-hidden />
                  <span>{kpi}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-lg font-semibold text-onDutyNavy dark:text-white">{t.channels}</h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              {useCase.channels.map((channel, idx) => (
                <li key={`${useCase.slug}-channel-${idx}`} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-onDutyWine dark:bg-onDutyGold" aria-hidden />
                  <span>{channel}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
