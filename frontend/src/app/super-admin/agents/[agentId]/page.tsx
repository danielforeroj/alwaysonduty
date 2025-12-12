"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { buildApiUrl } from "../../utils/api";

type AgentDetail = {
  id: string;
  name: string;
  agent_type?: string | null;
  tenant_id: string;
  tenant_name: string;
  status: string;
  created_at: string;
  last_active_at?: string | null;
  total_conversations: number;
  total_messages: number;
};

export default function AgentDetailPage() {
  const { agentId } = useParams<{ agentId: string }>();
  const { token } = useAuth();
  const router = useRouter();
  const [agent, setAgent] = useState<AgentDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!token || !agentId) return;
      try {
        const endpoint = buildApiUrl(`/api/super-admin/agents/${agentId}`);
        if (!endpoint) {
          setError("API base URL is not configured. Please set NEXT_PUBLIC_API_BASE_URL.");
          return;
        }
        const res = await fetch(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load agent");
        setAgent(await res.json());
      } catch (err: any) {
        setError(err.message || "Unable to load agent");
      }
    };
    load();
  }, [token, agentId]);

  const updateAgent = async (payload: Partial<AgentDetail>) => {
    const endpoint = buildApiUrl(`/api/super-admin/agents/${agentId}`);
    if (!endpoint || !token) {
      setError("API base URL is not configured. Please set NEXT_PUBLIC_API_BASE_URL.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Update failed");
      setAgent(await res.json());
    } catch (err: any) {
      setError(err.message || "Unable to update agent");
    } finally {
      setSaving(false);
    }
  };

  if (!token) return null;
  if (!agent) return <p className="py-4 text-slate-500">Loading agent…</p>;

  return (
    <div className="space-y-4 py-4">
      <button
        onClick={() => router.back()}
        className="text-sm text-slate-600 hover:underline dark:text-slate-300"
      >
        ← Back to agents
      </button>

      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">{agent.name}</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Tenant: {agent.tenant_name} ({agent.tenant_id})
        </p>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-800">{error}</div>}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Status</h2>
          <div className="mt-3 space-y-3 text-sm text-slate-700 dark:text-slate-200">
            <select
              defaultValue={agent.status}
              onChange={(e) => updateAgent({ status: e.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="disabled">Disabled</option>
            </select>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Created: {new Date(agent.created_at).toLocaleString()}
              <br />
              Last active: {agent.last_active_at ? new Date(agent.last_active_at).toLocaleString() : "—"}
            </p>
          </div>
          {saving && <p className="mt-2 text-xs text-slate-500">Saving…</p>}
        </div>

        <div className="grid gap-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-300">Total conversations</p>
            <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50">{agent.total_conversations}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-300">Total messages</p>
            <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50">{agent.total_messages}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
