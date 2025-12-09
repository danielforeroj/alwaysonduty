"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { Agent } from "@/types/agent";
import { fetchAgent } from "@/lib/agentsApi";
import { AgentWizard } from "@/components/agents/AgentWizard";

export default function EditAgentPage() {
  const params = useParams();
  const router = useRouter();
  const { token, authLoading, logout } = useAuth();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const agentId = params?.agentId as string;

  useEffect(() => {
    if (authLoading) return;
    if (!token) {
      router.push("/login");
      return;
    }
    const load = async () => {
      try {
        const data = await fetchAgent(token, agentId);
        setAgent(data);
        setError(null);
      } catch (err: any) {
        if (err?.message === "unauthorized") {
          logout();
          router.push("/login");
          return;
        }
        setError("We couldn’t load this agent. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [authLoading, token, router, logout, agentId]);

  if (loading) return <div className="p-6">Loading agent...</div>;
  if (error) return <div className="p-6 text-sm text-red-600">{error}</div>;
  if (!agent) return <div className="p-6 text-sm">Agent not found.</div>;

  return <AgentWizard mode="edit" initialAgent={agent} />;
}
