"use client";

import Link from "next/link";
import { PrimaryButton, SecondaryButton } from "../../components/Buttons";
import { useCopy } from "../../lib/copy";
import { getUseCaseList } from "../../lib/useCases";
import { useLanguage } from "../../components/providers/LanguageProvider";

export default function UseCasesPage() {
  const { language } = useLanguage();
  const t = useCopy();
  const useCases = getUseCaseList(language);

  return (
    <div className="space-y-12">
      <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-amber-50 via-white to-indigo-50 p-10 shadow-xl dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        <div className="space-y-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-onDutyWine dark:text-onDutyGold">Use Cases</p>
          <h1 className="text-4xl font-bold text-onDutyNavy dark:text-white">{t.overview.heading}</h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300">{t.overview.subheading}</p>
          <div className="flex flex-wrap justify-center gap-3 text-sm font-semibold">
            <PrimaryButton href="/try">Try our agent</PrimaryButton>
            <SecondaryButton href="/signup">{t.nav.signup}</SecondaryButton>
          </div>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {useCases.map((useCase) => (
          <div
            key={useCase.slug}
            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm transition hover:-translate-y-1 hover:border-onDutyNavy hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{useCase.icon}</span>
                <h2 className="text-lg font-semibold text-onDutyNavy dark:text-white">{useCase.title}</h2>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">{useCase.description}</p>
            </div>
            <Link
              href={`/use-cases/${useCase.slug}`}
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-onDutyNavy transition hover:gap-3 hover:text-onDutyWine dark:text-onDutyGold"
            >
              {t.useCases.cta}
              <span aria-hidden>→</span>
            </Link>
          </div>
        ))}
      </section>
    </div>
  );
}

