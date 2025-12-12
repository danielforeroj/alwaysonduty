"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

type UserDetail = {
  id: string;
  email: string;
  role: string;
  tenant_id: string;
  tenant_name: string;
  is_active: boolean;
  created_at: string;
  last_login?: string | null;
  email_verified: boolean;
};

export default function UserDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const { token } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!API_BASE || !token || !userId) return;
      try {
        const res = await fetch(`${API_BASE}/api/super-admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load user");
        setUser(await res.json());
      } catch (err: any) {
        setError(err.message || "Unable to load user");
      }
    };
    load();
  }, [token, userId]);

  const updateUser = async (payload: Partial<UserDetail>) => {
    if (!API_BASE || !token || !userId) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/super-admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Update failed");
      setUser(await res.json());
    } catch (err: any) {
      setError(err.message || "Unable to update user");
    } finally {
      setSaving(false);
    }
  };

  if (!token) return null;
  if (!user) return <p className="py-4 text-slate-500">Loading user…</p>;

  return (
    <div className="space-y-4 py-4">
      <button
        onClick={() => router.back()}
        className="text-sm text-slate-600 hover:underline dark:text-slate-300"
      >
        ← Back to users
      </button>

      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">{user.email}</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Tenant: {user.tenant_name} ({user.tenant_id})
        </p>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-800">{error}</div>}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Role & status</h2>
          <div className="mt-3 space-y-3 text-sm text-slate-700 dark:text-slate-200">
            <div className="space-y-1">
              <span>Role</span>
              <select
                defaultValue={user.role}
                onChange={(e) => updateUser({ role: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
              >
                <option value="TENANT_USER">Tenant user</option>
                <option value="TENANT_ADMIN">Tenant admin</option>
                <option value="ADMIN">Admin</option>
                <option value="SUPER_ADMIN">Super admin</option>
              </select>
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={user.is_active}
                onChange={(e) => updateUser({ is_active: e.target.checked })}
              />
              Active
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Created: {new Date(user.created_at).toLocaleString()}
              <br />
              Last login: {user.last_login ? new Date(user.last_login).toLocaleString() : "—"}
            </p>
          </div>
          {saving && <p className="mt-2 text-xs text-slate-500">Saving…</p>}
        </div>
      </div>
    </div>
  );
}
