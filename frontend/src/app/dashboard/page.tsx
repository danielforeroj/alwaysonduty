"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

interface TenantInfo {
  name: string;
  plan_type: string;
  billing_status?: string;
  trial_ends_at?: string | null;
}

interface UserInfo {
  email: string;
  email_verified?: boolean;
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
  const [user, setUser] = useState<UserInfo | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [configError, setConfigError] = useState<string | null>(
    API_BASE ? null : "API base URL is not configured. Please set NEXT_PUBLIC_API_BASE_URL.",
  );

  useEffect(() => {
    const token = localStorage.getItem("on_duty_token");
    if (!token) {
      router.push("/login");
      return;
    }

    const base = API_BASE;
    if (!base) {
      console.error("NEXT_PUBLIC_API_BASE_URL is not set. Dashboard cannot fetch data.");
      setConfigError("API base URL is not configured. Please set NEXT_PUBLIC_API_BASE_URL.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const meRes = await fetch(`${base}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!meRes.ok) throw new Error("Unauthorized");
        const meData = await meRes.json();
        setTenant(meData.tenant);
        setUser(meData.user);

        const convoRes = await fetch(`${base}/api/conversations`, {
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

  if (configError) {
    return <p className="text-red-600">{configError}</p>;
  }

  return (
    <div className="space-y-6">
      {!user?.email_verified && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Please verify your email. Check your inbox for a verification link.
        </div>
      )}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Welcome, {tenant?.name || ""}</h1>
        <p className="text-slate-600">Plan: {tenant?.plan_type}</p>
        {tenant?.billing_status && <p className="text-slate-600">Billing status: {tenant.billing_status}</p>}
        {tenant?.trial_ends_at && (
          <p className="text-slate-600">
            Trial ends: {new Date(tenant.trial_ends_at).toLocaleDateString()}
          </p>
        )}
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
