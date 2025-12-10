"use client";

import Link from "next/link";

import type { Agent } from "@/types/agent";
import { useCopy } from "@/lib/copy";
import PublicAgentChat from "./PublicAgentChat";

export default function PublicAgentExperience({ agent }: { agent: Agent }) {
  const t = useCopy().publicAgent;

  return (
    <main className="mx-auto -mt-6 flex min-h-screen max-w-5xl flex-col px-6 pb-8 pt-2">
      <header className="rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 px-3 py-2 text-white shadow-lg md:py-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-200">{t.heroTag}</p>
            <h1 className="mt-1 text-2xl font-semibold">{agent.name}</h1>
            <p className="mt-1 text-xs text-slate-200">{agent.job_and_company_profile.company_name}</p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20"
          >
            {t.cta}
          </Link>
        </div>
      </header>

      <section className="mt-4 grid flex-1 gap-4 lg:h-[calc(100vh-200px)] lg:grid-cols-3">
        <div className="flex min-h-[60vh] flex-col rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur lg:col-span-2 lg:h-full">
          <PublicAgentChat
            agentSlug={agent.slug}
            agentName={agent.name}
            companyName={agent.job_and_company_profile.company_name}
          />
        </div>
        <aside className="flex min-h-[60vh] flex-col rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur lg:h-full">
          <h3 className="text-sm font-semibold text-slate-900">{t.aboutHeading}</h3>
          <dl className="mt-3 space-y-2 text-xs text-slate-700">
            <div>
              <dt className="text-slate-500">{t.about.company}</dt>
              <dd className="font-medium">{agent.job_and_company_profile.company_name || "—"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">{t.about.website}</dt>
              <dd>
                {agent.job_and_company_profile.company_website ? (
                  <a
                    href={agent.job_and_company_profile.company_website}
                    className="font-medium text-blue-600 hover:text-blue-700"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {agent.job_and_company_profile.company_website}
                  </a>
                ) : (
                  <span className="font-medium">—</span>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">{t.about.agentName}</dt>
              <dd className="font-medium">{agent.name}</dd>
            </div>
            <div>
              <dt className="text-slate-500">{t.about.summary}</dt>
              <dd className="font-medium">
                {agent.job_and_company_profile.short_description || "No summary provided."}
              </dd>
            </div>
          </dl>
        </aside>
      </section>
    </main>
  );
}
