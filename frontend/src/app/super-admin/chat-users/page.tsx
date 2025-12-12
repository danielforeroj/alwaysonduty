"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { buildApiUrl } from "../utils/api";

interface ChatUser {
  id: string;
  tenant_id: string;
  tenant_name: string;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  phone?: string | null;
  source?: string | null;
  created_at: string;
  last_seen_at?: string | null;
  total_conversations: number;
  total_messages: number;
}

interface Pagination {
  total: number;
  page: number;
  page_size: number;
}

interface ChatUserResponse {
  items: ChatUser[];
  pagination: Pagination;
}

export default function ChatUsersPage() {
  const { token, user, loading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<ChatUserResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");

  useEffect(() => {
    if (!loading && (!token || user?.role !== "SUPER_ADMIN")) {
      router.replace("/super-admin");
    }
  }, [loading, router, token, user?.role]);

  const loadChatUsers = useCallback(async () => {
    if (!token) return;
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (sourceFilter) params.append("source", sourceFilter);
      const endpoint = buildApiUrl(`/api/super-admin/chat-users${params.toString() ? `?${params}` : ""}`);
      if (!endpoint) {
        setError("API base URL is not configured. Please set NEXT_PUBLIC_API_BASE_URL.");
        return;
      }
      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        let detail = `Failed to load chat users (status ${res.status})`;
        try {
          const data = await res.json();
          if (data?.detail) detail = `${data.detail} (status ${res.status})`;
        } catch {
          // ignore
        }
        throw new Error(detail);
      }
      setData(await res.json());
    } catch (err: any) {
      setError(err.message || "Unable to load chat users");
    }
  }, [token, search, sourceFilter]);

  useEffect(() => {
    loadChatUsers();
  }, [loadChatUsers]);

  if (!token) return null;

  return (
    <div className="space-y-4 py-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Chat Users</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">End-users created through gated chats.</p>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search email"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
          />
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <option value="">All sources</option>
            <option value="TENANT_AGENT">Tenant agent</option>
            <option value="TRY">/try demo</option>
          </select>
          <button
            onClick={loadChatUsers}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-800">{error}</div>}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-200">Name</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-200">Email</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-200">Phone</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-200">Tenant</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-200">Source</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-200">Conversations</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-200">Messages</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-200">Last seen</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-200">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {data?.items?.map((user) => (
              <tr
                key={user.id}
                onClick={() => router.push(`/super-admin/chat-users/${user.id}`)}
                className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60"
              >
                <td className="px-4 py-3 font-medium text-blue-600 dark:text-blue-300">
                  {[user.first_name, user.last_name].filter(Boolean).join(" ") || "—"}
                </td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{user.email || "—"}</td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{user.phone || "—"}</td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{user.tenant_name}</td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{user.source || "—"}</td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{user.total_conversations}</td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{user.total_messages}</td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-200">
                  {user.last_seen_at ? new Date(user.last_seen_at).toLocaleString() : "—"}
                </td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{new Date(user.created_at).toLocaleString()}</td>
              </tr>
            ))}
            {(!data || data.items.length === 0) && (
              <tr>
                <td colSpan={9} className="px-4 py-6 text-center text-slate-500">
                  No chat users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
