"use client";

import Link from "next/link";

import type { Agent } from "@/types/agent";
import { useCopy } from "@/lib/copy";
import PublicAgentChat from "./PublicAgentChat";

export default function PublicAgentExperience({ agent }: { agent: Agent }) {
  const t = useCopy().publicAgent;

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <header className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 p-8 text-white shadow-lg">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-200">{t.heroTag}</p>
            <h1 className="mt-2 text-3xl font-semibold">{agent.name}</h1>
            <p className="mt-1 text-sm text-slate-200">{agent.job_and_company_profile.company_name}</p>
            <p className="mt-4 max-w-2xl text-sm text-slate-200">{t.heroDescription}</p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            {t.cta}
          </Link>
        </div>
      </header>

      <section className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur lg:col-span-2">
          <PublicAgentChat
            agentSlug={agent.slug}
            agentName={agent.name}
            companyName={agent.job_and_company_profile.company_name}
          />
        </div>
        <aside className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur">
          <h3 className="text-base font-semibold text-slate-900">{t.aboutHeading}</h3>
          <dl className="mt-4 space-y-3 text-sm text-slate-700">
            <div>
              <dt className="text-slate-500">{t.about.type}</dt>
              <dd className="font-medium capitalize">{agent.agent_type.replace("_", " ")}</dd>
            </div>
            <div>
              <dt className="text-slate-500">{t.about.goal}</dt>
              <dd className="font-medium">{agent.job_and_company_profile.primary_goal.replace("_", " ")}</dd>
            </div>
            <div>
              <dt className="text-slate-500">{t.about.company}</dt>
              <dd className="font-medium">{agent.job_and_company_profile.company_name}</dd>
            </div>
            {agent.job_and_company_profile.company_website && (
              <div>
                <dt className="text-slate-500">{t.about.website}</dt>
                <dd>
                  <a
                    href={agent.job_and_company_profile.company_website}
                    className="font-medium text-blue-600 hover:text-blue-700"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {agent.job_and_company_profile.company_website}
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </aside>
      </section>
    </main>
  );
}
