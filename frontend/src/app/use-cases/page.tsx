"use client";

import Link from "next/link";
import { PrimaryButton, SecondaryButton } from "../../components/Buttons";
import { useCopy } from "../../lib/copy";
import { getUseCaseList } from "../../lib/useCases";
import { useLanguage } from "../../components/providers/LanguageProvider";

const pageCopy = {
  en: {
    title: "Industry playbooks, ready to launch",
    subtitle:
      "Explore how OnDuty adapts to your channels, workflows, and the way your teams already serve customers.",
    cta: "Talk to our agent",
    secondaryCta: "See pricing",
    cardCta: "View playbook",
    lead: "Highlights",
    quickFacts: "What you get",
  },
  es: {
    title: "Playbooks por industria, listos para activar",
    subtitle:
      "Descubre cómo OnDuty se adapta a tus canales, flujos de trabajo y la forma en que ya atiendes a tus clientes.",
    cta: "Habla con nuestro agente",
    secondaryCta: "Ver precios",
    cardCta: "Ver playbook",
    lead: "Destacados",
    quickFacts: "Lo que obtienes",
  },
};

export default function UseCasesPage() {
  const { language } = useLanguage();
  const t = useCopy();
  const local = pageCopy[language];
  const useCases = getUseCaseList(language);

  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-amber-50 via-white to-indigo-50 p-10 shadow-xl dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        <div className="absolute inset-0 opacity-60">
          <div className="absolute left-12 top-10 h-40 w-40 rounded-full bg-onDutyGold/60 blur-3xl" />
          <div className="absolute bottom-6 right-16 h-56 w-56 rounded-full bg-onDutyWine/40 blur-3xl" />
        </div>
        <div className="relative grid gap-8 md:grid-cols-[1.5fr_1fr] md:items-center">
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-onDutyWine dark:text-onDutyGold">{local.lead}</p>
            <h1 className="text-4xl font-bold text-onDutyNavy dark:text-white sm:text-5xl">{local.title}</h1>
            <p className="max-w-2xl text-lg text-slate-700 dark:text-slate-300">{local.subtitle}</p>
            <div className="flex flex-wrap gap-3 text-sm font-semibold">
              <PrimaryButton href="/try">{local.cta}</PrimaryButton>
              <SecondaryButton href="#pricing">{local.secondaryCta}</SecondaryButton>
            </div>
          </div>
          <div className="space-y-4 rounded-2xl border border-white/50 bg-white/80 p-6 shadow-lg backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
            <p className="text-sm font-semibold text-onDutyNavy dark:text-onDutyGold">{local.quickFacts}</p>
            <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="mt-1 text-onDutyWine dark:text-onDutyGold">●</span>
                <span>{t.features.items[0].description}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-onDutyWine dark:text-onDutyGold">●</span>
                <span>{t.features.items[1].description}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-onDutyWine dark:text-onDutyGold">●</span>
                <span>{t.features.items[2].description}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {useCases.map((useCase) => (
          <div
            key={useCase.slug}
            className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm transition hover:-translate-y-1 hover:border-onDutyNavy hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{useCase.icon}</span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-onDutyWine dark:text-onDutyGold">
                    {useCase.badge}
                  </p>
                  <h2 className="text-lg font-semibold text-onDutyNavy dark:text-white">{useCase.label}</h2>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">{useCase.primaryBenefit}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{useCase.heroSubtitle}</p>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm font-semibold">
              <Link
                href={`/use-cases/${useCase.slug}`}
                className="inline-flex items-center gap-2 text-onDutyNavy transition hover:gap-3 hover:text-onDutyWine dark:text-onDutyGold"
              >
                {local.cardCta}
                <span aria-hidden>→</span>
              </Link>
              <SecondaryButton href={`/use-cases/${useCase.slug}`} className="py-2 text-xs">
                {t.useCases.cta}
              </SecondaryButton>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
