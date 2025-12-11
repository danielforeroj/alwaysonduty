"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

type Tenant = {
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
};

type Pagination = { total: number; page: number; page_size: number };

type TenantResponse = { items: Tenant[]; pagination: Pagination };

export default function TenantsPage() {
  const { token, user, loading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<TenantResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!loading && (!token || user?.role !== "SUPER_ADMIN")) {
      router.replace("/super-admin");
    }
  }, [loading, router, token, user?.role]);

  useEffect(() => {
    const load = async () => {
      if (!API_BASE || !token) return;
      try {
        const query = search ? `?search=${encodeURIComponent(search)}` : "";
        const res = await fetch(`${API_BASE}/api/super-admin/tenants${query}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load tenants");
        setData(await res.json());
      } catch (err: any) {
        setError(err.message || "Unable to load tenants");
      }
    };
    load();
  }, [search, token]);

  if (!token) return null;

  return (
    <div className="space-y-4 py-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Tenants</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">Manage every tenant across the platform.</p>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tenants"
          className="w-full max-w-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
        />
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-800">{error}</div>}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-200">Name</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-200">Slug</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-200">Plan</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-200">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-200">Special</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-200">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {data?.items?.map((tenant) => (
              <tr key={tenant.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                <td className="px-4 py-3 font-medium text-blue-600 dark:text-blue-300">
                  <Link href={`/super-admin/tenants/${tenant.id}`}>{tenant.name}</Link>
                </td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{tenant.slug}</td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{tenant.plan_type}</td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{tenant.billing_status}</td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{tenant.is_special_permissioned ? "Yes" : "No"}</td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-200">
                  {new Date(tenant.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {(!data || data.items.length === 0) && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                  No tenants found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
