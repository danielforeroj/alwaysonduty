"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { Agent } from "@/types/agent";
import { fetchAgents } from "@/lib/agentsApi";
import { PrimaryButton, SecondaryButton } from "@/components/Buttons";

export default function AgentsPage() {
  const router = useRouter();
  const { token, authLoading, logout } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!token) {
      router.push("/login");
      return;
    }

    const load = async () => {
      try {
        const data = await fetchAgents(token);
        setAgents(data);
        setError(null);
      } catch (err: any) {
        if (err?.message === "unauthorized") {
          logout();
          router.push("/login");
          return;
        }
        setError("We couldn’t load your agents. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [authLoading, token, router, logout]);

  if (loading) {
    return <div className="p-6">Loading agents...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">AI Agents</h1>
          <p className="text-sm text-gray-500">
            Create and configure your OnDuty assistants. Each agent has its own job, tone, and data.
          </p>
        </div>
        <PrimaryButton onClick={() => router.push("/agents/new")}>
          Create new agent
        </PrimaryButton>
      </div>

      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      {agents.length === 0 ? (
        <div className="text-sm text-gray-500">
          You don’t have any agents yet. Click “Create new agent” to get started.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {agents.map((agent) => (
            <div key={agent.id} className="rounded-lg border bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold">{agent.name}</h2>
                  <p className="text-xs text-gray-500">Slug: {agent.slug}</p>
                </div>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs capitalize text-gray-700">
                  {agent.status}
                </span>
              </div>
              <div className="mt-3 text-xs text-gray-500">
                Goal: {agent.job_and_company_profile?.primary_goal ?? "—"}
              </div>
              <div className="mt-4 flex justify-end">
                <SecondaryButton onClick={() => router.push(`/agents/${agent.id}`)}>
                  Edit
                </SecondaryButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
