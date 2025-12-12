"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { buildApiUrl } from "../utils/api";

type AgentRow = {
  id: string;
  name: string;
  agent_type?: string | null;
  tenant_id: string;
  tenant_name: string;
  status: string;
  created_at: string;
};

type AgentsResponse = { items: AgentRow[] };

export default function AgentsPage() {
  const { token, user, loading } = useAuth();
  const router = useRouter();
  const [agents, setAgents] = useState<AgentRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && (!token || user?.role !== "SUPER_ADMIN")) {
      router.replace("/super-admin");
    }
  }, [loading, router, token, user?.role]);

  const loadAgents = async () => {
    const endpoint = buildApiUrl("/api/super-admin/agents");
    if (!endpoint || !token) {
      setError("API base URL is not configured. Please set NEXT_PUBLIC_API_BASE_URL.");
      return;
    }
    try {
      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load agents");
      const data: AgentsResponse = await res.json();
      setAgents(data.items || []);
    } catch (err: any) {
      setError(err.message || "Unable to load agents");
    }
  };

  useEffect(() => {
    loadAgents();
  }, [token]);

  if (!token) return null;

  return (
    <div className="space-y-4 py-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Agents</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">Global view across all tenant agents.</p>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-800">{error}</div>}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-200">Name</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-200">Type</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-200">Tenant</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-200">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-200">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {agents.map((agent) => (
              <tr
                key={agent.id}
                onClick={() => router.push(`/super-admin/agents/${agent.id}`)}
                className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60"
              >
                <td className="px-4 py-3 text-blue-600 dark:text-blue-300">{agent.name}</td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{agent.agent_type || "—"}</td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{agent.tenant_name}</td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{agent.status}</td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-200">
                  {new Date(agent.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {agents.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                  No agents found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
