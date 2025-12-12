"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { buildApiUrl } from "../utils/api";

type UserRow = {
  id: string;
  email: string;
  role: string;
  tenant_id: string;
  tenant_name: string;
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
  last_login?: string | null;
};

export default function UsersPage() {
  const { token, user, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ email: "", role: "TENANT_USER", tenantId: "" });

  useEffect(() => {
    if (!loading && (!token || user?.role !== "SUPER_ADMIN")) {
      router.replace("/super-admin");
    }
  }, [loading, router, token, user?.role]);

  const loadUsers = async () => {
    const endpoint = buildApiUrl("/api/super-admin/users");
    if (!endpoint || !token) {
      setError("API base URL is not configured. Please set NEXT_PUBLIC_API_BASE_URL.");
      return;
    }
    try {
      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load users");
      const data = await res.json();
      setUsers(data.items || []);
    } catch (err: any) {
      setError(err.message || "Unable to load users");
    }
  };

  useEffect(() => {
    loadUsers();
  }, [token]);

  const createUser = async () => {
    const endpoint = buildApiUrl("/api/super-admin/users");
    if (!endpoint || !token) {
      setError("API base URL is not configured. Please set NEXT_PUBLIC_API_BASE_URL.");
      return;
    }
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email: form.email, role: form.role, tenant_id: form.tenantId }),
      });
      if (!res.ok) throw new Error("Unable to create user");
      setForm({ email: "", role: "TENANT_USER", tenantId: "" });
      await loadUsers();
    } catch (err: any) {
      setError(err.message || "Unable to create user");
    }
  };

  const toggleActive = async (id: string, is_active: boolean) => {
    const endpoint = buildApiUrl(`/api/super-admin/users/${id}`);
    if (!endpoint || !token) {
      setError("API base URL is not configured. Please set NEXT_PUBLIC_API_BASE_URL.");
      return;
    }
    try {
      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ is_active: !is_active }),
      });
      if (!res.ok) throw new Error("Unable to update user");
      await loadUsers();
    } catch (err: any) {
      setError(err.message || "Unable to update user");
    }
  };

  if (!token) return null;

  return (
    <div className="space-y-4 py-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Users</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">Create and manage all users.</p>
        </div>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-800">{error}</div>}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Create user</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
          />
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <option value="TENANT_USER">Tenant user</option>
            <option value="TENANT_ADMIN">Tenant admin</option>
            <option value="ADMIN">Admin</option>
            <option value="SUPER_ADMIN">Super admin</option>
          </select>
          <input
            value={form.tenantId}
            onChange={(e) => setForm({ ...form, tenantId: e.target.value })}
            placeholder="Tenant ID"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
          />
        </div>
        <button
          onClick={createUser}
          className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Create
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-200">Email</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-200">Role</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-200">Tenant</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-200">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-200">Last login</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {users.map((row) => (
              <tr
                key={row.id}
                onClick={() => router.push(`/super-admin/users/${row.id}`)}
                className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60"
              >
                <td className="px-4 py-3 text-blue-600 dark:text-blue-300">
                  <Link href={`/super-admin/users/${row.id}`}>{row.email}</Link>
                </td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{row.role}</td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{row.tenant_name}</td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{row.is_active ? "Active" : "Inactive"}</td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-200">
                  {row.last_login ? new Date(row.last_login).toLocaleString() : "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => toggleActive(row.id, row.is_active)}
                    className="text-sm text-blue-600 underline dark:text-blue-400"
                  >
                    {row.is_active ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
