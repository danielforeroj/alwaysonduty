import type { Agent } from "@/types/agent";

import PublicAgentExperience from "@/components/agents/PublicAgentExperience";
import PublicAgentNotFound from "@/components/agents/PublicAgentNotFound";

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
    return <PublicAgentNotFound />;
  }

  return <PublicAgentExperience agent={agent} />;
}
