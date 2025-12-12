"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { buildApiUrl } from "../utils/api";

type Tenant = {
  id: string;
  contact_name?: string | null;
  contact_email?: string | null;
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
  agent_count?: number;
  user_count?: number;
};

type Pagination = { total: number; page: number; page_size: number };

type TenantResponse = { items: Tenant[]; pagination: Pagination };

export default function TenantsPage() {
  const { token, user, loading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<TenantResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [newName, setNewName] = useState("");
  const [newPlan, setNewPlan] = useState("starter");
  const [newTrialDays, setNewTrialDays] = useState<number | "">("");
  const [newSpecial, setNewSpecial] = useState(true);
  const [newCardRequired, setNewCardRequired] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPassword, setContactPassword] = useState("");

  const loadTenants = useCallback(async () => {
    try {
      const query = search ? `?search=${encodeURIComponent(search)}` : "";
      const endpoint = buildApiUrl(`/api/super-admin/tenants${query}`);
      if (!endpoint || !token) {
        setError("API base URL is not configured. Please set NEXT_PUBLIC_API_BASE_URL.");
        return;
      }
      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        let detail = `Failed to load tenants (status ${res.status})`;
        try {
          const data = await res.json();
          if (data?.detail) detail = `${data.detail} (status ${res.status})`;
        } catch {
          // ignore json parse errors
        }
        throw new Error(detail);
      }
      setData(await res.json());
    } catch (err: any) {
      setError(err.message || "Unable to load tenants");
    }
  }, [token, search]);

  useEffect(() => {
    if (!loading && (!token || user?.role !== "SUPER_ADMIN")) {
      router.replace("/super-admin");
    }
  }, [loading, router, token, user?.role]);

  useEffect(() => {
    loadTenants();
  }, [loadTenants]);

  const createTenant = async () => {
    const endpoint = buildApiUrl("/api/super-admin/tenants");
    if (!endpoint || !token || !newName || !contactEmail || !contactPassword) {
      setError("Name, contact email, and a temporary password are required");
      return;
    }
    setError(null);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: newName,
          plan_type: newPlan,
          trial_days_override: newTrialDays || null,
          is_special_permissioned: newSpecial,
          card_required: newCardRequired,
          trial_mode: "no_card",
          billing_status: "trial",
          contact_name: contactName || null,
          contact_email: contactEmail,
          contact_password: contactPassword,
        }),
      });
      if (!res.ok) throw new Error("Unable to create tenant");
      setNewName("");
      setNewTrialDays("");
      setNewSpecial(true);
      setNewCardRequired(false);
      setContactName("");
      setContactEmail("");
      setContactPassword("");
      await loadTenants();
    } catch (err: any) {
      setError(err.message || "Unable to create tenant");
    }
  };

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

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Create tenant</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-5">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Name"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
          />
          <input
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            placeholder="Contact name"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
          />
          <input
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder="Contact email"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            type="email"
          />
          <input
            value={contactPassword}
            onChange={(e) => setContactPassword(e.target.value)}
            placeholder="Temporary password"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            type="password"
          />
          <select
            value={newPlan}
            onChange={(e) => setNewPlan(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <option value="starter">Starter</option>
            <option value="growth">Growth</option>
            <option value="premium">Premium</option>
          </select>
          <input
            value={newTrialDays}
            onChange={(e) => setNewTrialDays(e.target.value ? Number(e.target.value) : "")}
            placeholder="Trial days"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            type="number"
          />
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
            <input
              type="checkbox"
              checked={newSpecial}
              onChange={(e) => setNewSpecial(e.target.checked)}
            />
            Special
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
            <input
              type="checkbox"
              checked={newCardRequired}
              onChange={(e) => setNewCardRequired(e.target.checked)}
            />
            Card required
          </label>
        </div>
        <button
          onClick={createTenant}
          className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Create tenant
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-200">Contact</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-200">Email</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-200">Business</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-200">Slug</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-200">Plan</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-200">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-200">Agents</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-200">Users</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-200">Special</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-200">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {data?.items?.map((tenant) => (
              <tr
                key={tenant.id}
                onClick={() => router.push(`/super-admin/tenants/${tenant.id}`)}
                className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60"
              >
                <td className="px-4 py-3 font-medium text-blue-600 dark:text-blue-300">{tenant.contact_name || "—"}</td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{tenant.contact_email || "—"}</td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{tenant.name}</td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{tenant.slug}</td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{tenant.plan_type}</td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{tenant.billing_status}</td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{tenant.agent_count ?? 0}</td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{tenant.user_count ?? 0}</td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{tenant.is_special_permissioned ? "Yes" : "No"}</td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-200">
                  {new Date(tenant.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {(!data || data.items.length === 0) && (
              <tr>
                <td colSpan={10} className="px-4 py-6 text-center text-slate-500">
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
