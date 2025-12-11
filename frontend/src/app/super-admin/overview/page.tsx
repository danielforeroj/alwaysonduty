"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

type OverviewMetrics = {
  total_tenants: number;
  total_users: number;
  total_agents: number;
  total_conversations: number;
  recent_tenants: string[];
  recent_users: string[];
};

export default function SuperAdminOverview() {
  const { user, loading, token } = useAuth();
  const router = useRouter();
  const [metrics, setMetrics] = useState<OverviewMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && (!token || user?.role !== "SUPER_ADMIN")) {
      router.replace("/super-admin");
    }
  }, [loading, router, token, user?.role]);

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!API_BASE || !token) return;
      try {
        const res = await fetch(`${API_BASE}/api/super-admin/overview`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load overview");
        setMetrics(await res.json());
      } catch (err: any) {
        setError(err.message || "Failed to load overview");
      }
    };
    fetchMetrics();
  }, [token]);

  if (!token) return null;

  return (
    <div className="space-y-6 py-4">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-50">Overview</h1>
        <p className="text-slate-600 dark:text-slate-300">Platform-wide health at a glance.</p>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">{error}</div>}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Tenants" value={metrics?.total_tenants ?? 0} />
        <StatCard label="Users" value={metrics?.total_users ?? 0} />
        <StatCard label="Agents" value={metrics?.total_agents ?? 0} />
        <StatCard label="Conversations" value={metrics?.total_conversations ?? 0} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ListCard title="Recent tenants" items={metrics?.recent_tenants ?? []} emptyCopy="No tenants yet" />
        <ListCard title="Recent users" items={metrics?.recent_users ?? []} emptyCopy="No users yet" />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50">{value}</p>
    </div>
  );
}

function ListCard({
  title,
  items,
  emptyCopy,
}: {
  title: string;
  items: string[];
  emptyCopy: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
        {items.length === 0 && <li className="text-slate-500">{emptyCopy}</li>}
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
