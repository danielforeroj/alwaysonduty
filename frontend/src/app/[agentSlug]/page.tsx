import type { Agent } from "@/types/agent";

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
    <main className="mx-auto max-w-4xl px-6 py-12">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-gray-500">OnDuty agent</p>
        <h1 className="text-3xl font-semibold text-gray-900">{agent.name}</h1>
        <p className="text-sm text-gray-600">
          {agent.job_and_company_profile.company_name}
        </p>
      </header>

      <section className="mt-6 rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Coming soon</h2>
        <p className="mt-2 text-gray-700">
          This is the public page for the agent <strong>{agent.slug}</strong>.
          The live chat experience will appear here once it&apos;s enabled.
        </p>
      </section>
    </main>
  );
}
