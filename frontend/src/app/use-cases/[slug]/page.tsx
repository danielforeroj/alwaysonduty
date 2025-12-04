"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { PrimaryButton, SecondaryButton } from "../../../components/Buttons";
import { useLanguage } from "../../../components/providers/LanguageProvider";
import { getUseCaseCopy, type UseCaseSlug } from "../../../lib/useCases";

export default function UseCaseDetailPage() {
  const params = useParams();
  const { language } = useLanguage();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : (params?.slug as string);
  const useCase = getUseCaseCopy(slug as UseCaseSlug, language);
  const headingCopy = {
    back: language === "es" ? "← Volver a casos de uso" : "← Back to use cases",
    why: language === "es" ? "Por qué funciona" : "Why it works",
    signals: language === "es" ? "Señales" : "Signals",
    try: language === "es" ? "Probar nuestro agente" : "Try our agent",
    signup: language === "es" ? "Crear cuenta" : "Sign up for free",
    notFoundTitle: language === "es" ? "No encontrado" : "Not found",
    notFoundBody: language === "es" ? "Este caso aún no está disponible." : "This use case is not available yet.",
    backHome: language === "es" ? "Volver a casos de uso" : "Back to use cases",
  };

  if (!useCase) {
    return (
      <div className="space-y-6 rounded-3xl border border-slate-200 bg-white/90 p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-3xl font-bold text-onDutyNavy dark:text-white">{headingCopy.notFoundTitle}</h1>
        <p className="text-slate-600 dark:text-slate-300">{headingCopy.notFoundBody}</p>
        <PrimaryButton href="/use-cases" className="justify-center">
          {headingCopy.backHome}
        </PrimaryButton>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-indigo-50 via-white to-amber-50 p-10 shadow-xl dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        <div className="space-y-4">
          <Link href="/use-cases" className="inline-flex items-center gap-2 text-sm font-semibold text-onDutyNavy underline-offset-4 hover:underline dark:text-onDutyGold">
            {headingCopy.back}
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{useCase.icon}</span>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-onDutyWine dark:text-onDutyGold">OnDuty</p>
              <h1 className="text-4xl font-bold text-onDutyNavy dark:text-white">{useCase.title}</h1>
            </div>
          </div>
          <p className="max-w-3xl text-lg text-slate-700 dark:text-slate-300">{useCase.hero}</p>
          <div className="flex flex-wrap gap-3 text-sm font-semibold">
            <PrimaryButton href="/try">{headingCopy.try}</PrimaryButton>
            <SecondaryButton href="/signup">{headingCopy.signup}</SecondaryButton>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4 rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-semibold text-onDutyNavy dark:text-white">{headingCopy.why}</h2>
          <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
            {useCase.bullets.map((bullet, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="mt-1 text-onDutyWine dark:text-onDutyGold">•</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-semibold text-onDutyNavy dark:text-white">{headingCopy.signals}</h2>
          <div className="space-y-3">
            {useCase.stats.map((stat) => (
              <div key={stat.label} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-800">
                <span className="text-slate-600 dark:text-slate-300">{stat.label}</span>
                <span className="font-semibold text-onDutyNavy dark:text-onDutyGold">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

