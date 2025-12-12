"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { buildApiUrl } from "../../utils/api";

interface ConversationSummary {
  id: string;
  agent_name?: string | null;
  agent_type?: string | null;
  created_at: string;
  message_count: number;
  last_message_at?: string | null;
}

interface ChatUserDetail {
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
  conversations: ConversationSummary[];
}

export default function ChatUserDetailPage() {
  const params = useParams();
  const chatUserId = params?.chatUserId as string;
  const { token, user, loading } = useAuth();
  const router = useRouter();
  const [detail, setDetail] = useState<ChatUserDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && (!token || user?.role !== "SUPER_ADMIN")) {
      router.replace("/super-admin");
    }
  }, [loading, router, token, user?.role]);

  useEffect(() => {
    const load = async () => {
      if (!token || !chatUserId) return;
      try {
        const endpoint = buildApiUrl(`/api/super-admin/chat-users/${chatUserId}`);
        if (!endpoint) {
          setError("API base URL is not configured. Please set NEXT_PUBLIC_API_BASE_URL.");
          return;
        }
        const res = await fetch(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load chat user");
        setDetail(await res.json());
      } catch (err: any) {
        setError(err.message || "Unable to load chat user");
      }
    };
    load();
  }, [chatUserId, token]);

  if (!detail) {
    return <p className="text-slate-500">Loading chat user...</p>;
  }

  const fullName = [detail.first_name, detail.last_name].filter(Boolean).join(" ");

  return (
    <div className="space-y-4 py-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">{fullName || "Chat user"}</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">{detail.email || "No email on file"}</p>
        <p className="text-sm text-slate-600 dark:text-slate-300">Tenant: {detail.tenant_name}</p>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-800">{error}</div>}

      <div className="grid gap-4 md:grid-cols-2">
        <Metric label="Source" value={detail.source || "—"} />
        <Metric label="Phone" value={detail.phone || "—"} />
        <Metric label="Conversations" value={detail.total_conversations} />
        <Metric label="Messages" value={detail.total_messages} />
        <Metric label="Last seen" value={detail.last_seen_at ? new Date(detail.last_seen_at).toLocaleString() : "—"} />
        <Metric label="Created" value={new Date(detail.created_at).toLocaleString()} />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Conversations</h2>
        <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-200">ID</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-200">Agent</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-200">Started</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-200">Messages</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-200">Last message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {detail.conversations.map((conversation) => (
                <tr key={conversation.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                  <td className="px-4 py-3 font-mono text-xs text-blue-600 dark:text-blue-300">{conversation.id}</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-200">
                    {conversation.agent_name || conversation.agent_type || "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-200">
                    {new Date(conversation.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{conversation.message_count}</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-200">
                    {conversation.last_message_at ? new Date(conversation.last_message_at).toLocaleString() : "—"}
                  </td>
                </tr>
              ))}
              {detail.conversations.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                    No conversations yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm text-slate-500 dark:text-slate-300">{label}</p>
      <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">{value}</p>
    </div>
  );
}
