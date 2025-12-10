import type { Agent } from "@/types/agent";

import PublicAgentChat from "@/components/agents/PublicAgentChat";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

async function fetchPublicAgent(slug: string): Promise<Agent | null> {
  if (!API_BASE) return null;

  const res = await fetch(`${API_BASE}/api/agents/public/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function PublicAgentPage({
  params,
}: {
  params: { agentSlug: string };
}) {
  const agent = await fetchPublicAgent(params.agentSlug);

  if (!agent) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-2xl font-semibold">Agent not found</h1>
        <p className="mt-2 text-gray-600">
          We couldn&apos;t find an agent with that slug. Please confirm the link or
          contact the workspace owner.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <header className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 p-8 text-white shadow-lg">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-200">OnDuty live agent</p>
        <h1 className="mt-2 text-3xl font-semibold">{agent.name}</h1>
        <p className="mt-1 text-sm text-slate-200">
          {agent.job_and_company_profile.company_name}
        </p>
        <p className="mt-4 max-w-2xl text-sm text-slate-200">
          Chat with this workspace&apos;s OnDuty AI. Messages are answered instantly by our
          Groq-powered assistant.
        </p>
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
          <h3 className="text-base font-semibold text-slate-900">About this agent</h3>
          <dl className="mt-4 space-y-3 text-sm text-slate-700">
            <div>
              <dt className="text-slate-500">Agent type</dt>
              <dd className="font-medium capitalize">{agent.agent_type.replace("_", " ")}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Primary goal</dt>
              <dd className="font-medium">{agent.job_and_company_profile.primary_goal.replace("_", " ")}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Company</dt>
              <dd className="font-medium">{agent.job_and_company_profile.company_name}</dd>
            </div>
            {agent.job_and_company_profile.company_website && (
              <div>
                <dt className="text-slate-500">Website</dt>
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
