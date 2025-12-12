"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

type TenantDetail = {
  id: string;
  name: string;
  slug: string;
  plan_type: string;
  billing_status: string;
  trial_mode?: string | null;
  trial_ends_at?: string | null;
  is_special_permissioned: boolean;
  trial_days_override?: number | null;
  card_required?: boolean | null;
  created_at: string;
  agent_count: number;
  user_count: number;
  total_conversations: number;
  total_messages: number;
  primary_contact_email?: string | null;
};

export default function TenantDetailPage() {
  const params = useParams();
  const tenantId = params?.tenantId as string;
  const { token, user, loading } = useAuth();
  const router = useRouter();
  const [tenant, setTenant] = useState<TenantDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && (!token || user?.role !== "SUPER_ADMIN")) {
      router.replace("/super-admin");
    }
  }, [loading, router, token, user?.role]);

  useEffect(() => {
    const load = async () => {
      if (!API_BASE || !token || !tenantId) return;
      try {
        const res = await fetch(`${API_BASE}/api/super-admin/tenants/${tenantId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load tenant");
        setTenant(await res.json());
      } catch (err: any) {
        setError(err.message || "Unable to load tenant");
      }
    };
    load();
  }, [tenantId, token]);

  const updateConfig = async (payload: Partial<TenantDetail>) => {
    if (!API_BASE || !token || !tenantId) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/super-admin/tenants/${tenantId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Update failed");
      setTenant(await res.json());
    } catch (err: any) {
      setError(err.message || "Unable to update tenant");
    } finally {
      setSaving(false);
    }
  };

  if (!tenant) {
    return <p className="text-slate-500">Loading tenant...</p>;
  }

  return (
    <div className="space-y-4 py-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">{tenant.name}</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">Slug: {tenant.slug}</p>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-800">{error}</div>}

      <div className="grid gap-4 md:grid-cols-2">
        <Metric label="Agents" value={tenant.agent_count} />
        <Metric label="Users" value={tenant.user_count} />
        <Metric label="Conversations" value={tenant.total_conversations} />
        <Metric label="Messages" value={tenant.total_messages} />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Plan & billing</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="space-y-1">
            <label className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">
              Plan
            </label>
            <select
              defaultValue={tenant.plan_type}
              onChange={(e) => updateConfig({ plan_type: e.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <option value="starter">Starter</option>
              <option value="growth">Growth</option>
              <option value="premium">Premium</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">
              Status
            </label>
            <select
              defaultValue={tenant.billing_status}
              onChange={(e) => updateConfig({ billing_status: e.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <option value="trial">Trial</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">
              Primary contact
            </label>
            <p className="text-sm text-slate-700 dark:text-slate-200">
              {tenant.primary_contact_email ?? "—"}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Trial & permissions</h2>
        <div className="mt-4 space-y-3">
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
            <input
              type="checkbox"
              checked={tenant.is_special_permissioned}
              onChange={(e) => updateConfig({ is_special_permissioned: e.target.checked })}
            />
            Special permissioned
          </label>
          <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
            <span>Trial days override</span>
            <input
              type="number"
              defaultValue={tenant.trial_days_override ?? ""}
              onBlur={(e) => updateConfig({ trial_days_override: e.target.value ? Number(e.target.value) : null })}
              className="w-24 rounded border border-slate-300 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-800"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
            <input
              type="checkbox"
              checked={tenant.card_required ?? false}
              onChange={(e) => updateConfig({ card_required: e.target.checked })}
            />
            Card required for trial
          </label>
          {saving && <p className="text-xs text-slate-500">Saving...</p>}
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm text-slate-500 dark:text-slate-300">{label}</p>
      <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50">{value}</p>
    </div>
  );
}
