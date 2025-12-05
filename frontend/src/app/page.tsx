"use client";

import Link from "next/link";
import { PrimaryButton, SecondaryButton } from "../components/Buttons";
import { useCopy } from "../lib/copy";
import { getUseCaseList } from "../lib/useCases";
import { useLanguage } from "../components/providers/LanguageProvider";

export default function LandingPage() {
  const { language } = useLanguage();
  const t = useCopy();
  const useCases = getUseCaseList(language);

  return (
    <div className="space-y-24">
      {/* Hero */}
      <section
        id="product"
        className="relative overflow-hidden rounded-3xl border border-slate-200/60 bg-gradient-to-br from-indigo-50 via-white to-amber-50 shadow-2xl dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900"
      >
        <div className="absolute inset-0 opacity-70">
          <div className="absolute left-10 top-10 h-40 w-40 rounded-full bg-onDutyGold/40 blur-3xl" />
          <div className="absolute bottom-10 right-10 h-64 w-64 rounded-full bg-onDutyWine/30 blur-3xl" />
        </div>
        <div className="relative grid gap-12 px-6 py-16 md:grid-cols-2 md:py-20 lg:px-12">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-onDutyGold/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-onDutyNavy shadow-sm">
              {t.hero.badge}
            </div>
            <h1 className="text-4xl font-bold leading-tight text-onDutyNavy sm:text-5xl sm:leading-tight dark:text-white">
              {t.hero.title}
            </h1>
            <p className="max-w-2xl text-lg text-slate-700 dark:text-slate-200">{t.hero.subtitle}</p>
            <div className="flex flex-wrap gap-3 text-sm font-semibold">
              <PrimaryButton href="/try">{t.hero.primaryCta}</PrimaryButton>
              <SecondaryButton href="/use-cases" className="border-onDutyWine text-onDutyWine hover:border-onDutyWine hover:bg-onDutyWine dark:text-onDutyGold dark:border-onDutyGold dark:hover:bg-onDutyGold dark:hover:text-onDutyNavy">
                {t.hero.secondaryCta}
              </SecondaryButton>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-full max-w-lg rounded-3xl border border-white/40 bg-white/80 p-6 shadow-2xl backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">OnDuty Dashboard</p>
                  <p className="text-lg font-semibold text-onDutyNavy dark:text-white">Live engagement</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-200">
                  Online
                </span>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-slate-100 bg-white/80 p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Leads captured</p>
                  <p className="text-xl font-bold text-onDutyNavy dark:text-white">+28%</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">last 30 days</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white/80 p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Conversations</p>
                  <p className="text-xl font-bold text-onDutyNavy dark:text-white">2,341</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">multi-channel</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white/80 p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Avg. response</p>
                  <p className="text-xl font-bold text-onDutyNavy dark:text-white">1.8s</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">24/7 coverage</p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-100 bg-white/90 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-onDutyNavy text-white dark:bg-onDutyWine">AI</div>
                  <div>
                    <p className="text-sm font-semibold text-onDutyNavy dark:text-white">Agent Nova</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Realtime responses</p>
                  </div>
                </div>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 text-lg">💬</span>
                    <p className="rounded-2xl bg-slate-50 px-4 py-3 text-slate-800 shadow-sm dark:bg-slate-800 dark:text-slate-100">
                      We need a last-minute booking for tomorrow night. Can you help?
                    </p>
                  </div>
                  <div className="ml-auto flex max-w-[85%] items-start gap-3">
                    <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-slate-900 shadow-sm dark:bg-emerald-900/60 dark:text-emerald-100">
                      Absolutely! I can reserve a queen suite for tomorrow with late check-in. Should I confirm under your name?
                    </p>
                    <span className="mt-0.5 text-lg">🤖</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold text-onDutyNavy dark:text-white">{t.features.heading}</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">{t.features.subheading}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {t.features.items.map((item) => (
            <div
              key={item.title}
              className="group rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-onDutyGold/70 text-onDutyNavy shadow-sm">
                ✦
              </div>
              <h3 className="mt-4 text-lg font-semibold text-onDutyNavy dark:text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Use cases preview */}
      <section id="use-cases" className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold text-onDutyNavy dark:text-white">{t.useCases.heading}</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">{t.useCases.subheading}</p>
          </div>
          <SecondaryButton href="/use-cases" className="hidden md:inline-flex">
            {t.useCases.cta}
          </SecondaryButton>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {useCases.slice(0, 6).map((item) => (
            <div
              key={item.slug}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm transition hover:-translate-y-1 hover:border-onDutyNavy hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <h3 className="text-lg font-semibold text-onDutyNavy dark:text-white">{item.label}</h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">{item.primaryBenefit}</p>
              </div>
              <Link
                href={`/use-cases/${item.slug}`}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-onDutyNavy transition hover:gap-3 hover:text-onDutyWine dark:text-onDutyGold"
              >
                {t.useCases.cta}
                <span aria-hidden>→</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold text-onDutyNavy dark:text-white">{t.pricing.heading}</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">{t.pricing.subheading}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {t.pricing.tiers.map((tier) => (
            <div
              key={tier.title}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
            >
              <h3 className="text-xl font-semibold text-onDutyNavy dark:text-white">{tier.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{tier.copy}</p>
              <PrimaryButton href="/signup" className="mt-6 justify-center">
                {t.nav.signup}
              </PrimaryButton>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 pt-8 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} OnDuty. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-onDutyNavy dark:hover:text-onDutyGold">
              {t.footer.privacy}
            </Link>
            <Link href="#" className="hover:text-onDutyNavy dark:hover:text-onDutyGold">
              {t.footer.terms}
            </Link>
            <Link href="#" className="hover:text-onDutyNavy dark:hover:text-onDutyGold">
              {t.footer.contact}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

