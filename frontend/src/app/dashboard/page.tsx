"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

interface TenantInfo {
  name: string;
  plan_type: string;
}

interface Conversation {
  id: string;
  channel: string;
  status: string;
  started_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [tenant, setTenant] = useState<TenantInfo | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("on_duty_token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const meRes = await fetch(`${API_BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!meRes.ok) throw new Error("Unauthorized");
        const meData = await meRes.json();
        setTenant(meData.tenant);

        const convoRes = await fetch(`${API_BASE}/api/conversations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (convoRes.ok) {
          const convoData = await convoRes.json();
          setConversations(convoData);
        }
      } catch (err) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Welcome, {tenant?.name || ""}</h1>
        <p className="text-slate-600">Plan: {tenant?.plan_type}</p>
        <p className="text-slate-600">Conversations: {conversations.length}</p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Recent conversations</h2>
        <div className="mt-4 divide-y divide-slate-200">
          {conversations.length === 0 && <p className="text-sm text-slate-500">No conversations yet.</p>}
          {conversations.map((c) => (
            <div key={c.id} className="py-3 text-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{c.channel}</p>
                  <p className="text-slate-600">Started at {new Date(c.started_at).toLocaleString()}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase text-slate-700">{c.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
