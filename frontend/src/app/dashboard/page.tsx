"use client";

// NOTE: This is the main tenant dashboard component (confirmed).

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/providers/AuthProvider";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

interface PlanDetails {
  name: string;
  billing_status?: string | null;
  trial_ends_at?: string | null;
  monthly_conversations_limit: number;
  brands_limit: number;
  seats_included: number;
  channels_included: number;
}

interface UsageMetrics {
  current_month_conversations: number;
  current_month_messages: number;
  customers_count: number;
  connected_channels_count: number;
  seats_used: number;
}

interface DailyConversationCount {
  date: string;
  count: number;
}

interface ChannelBreakdown {
  channel: string;
  count: number;
}

interface DashboardResponse {
  plan: PlanDetails;
  usage: UsageMetrics;
  timeseries: { daily_conversations_last_30_days: DailyConversationCount[] };
  breakdown: { conversations_by_channel: ChannelBreakdown[] };
}

export default function DashboardPage() {
  const router = useRouter();
  const { token, user, tenant, loading: authLoading, logout } = useAuth();
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [configError, setConfigError] = useState<string | null>(
    API_BASE ? null : "API base URL is not configured. Please set NEXT_PUBLIC_API_BASE_URL.",
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!token) {
      router.push("/login");
      return;
    }
    const base = API_BASE;
    if (!base) {
      setConfigError("API base URL is not configured. Please set NEXT_PUBLIC_API_BASE_URL.");
      setLoading(false);
      return;
    }

    const fetchDashboard = async () => {
      try {
        const res = await fetch(`${base}/api/dashboard/metrics`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) {
          logout();
          router.push("/login");
          return;
        }
        if (!res.ok) throw new Error("Failed to load dashboard");
        const data = await res.json();
        setDashboard(data);
      } catch (err) {
        console.error(err);
        setError("We couldn’t load your dashboard metrics. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [authLoading, router, token, logout]);

  const formatDate = (value?: string | null) => {
    if (!value) return null;
    const date = new Date(value);
    return date.toLocaleDateString();
  };

  if (authLoading) {
    return <p>Loading dashboard...</p>;
  }

  if (configError) {
    return <p className="text-red-600">{configError}</p>;
  }

  const trialEnds = formatDate(dashboard?.plan.trial_ends_at || null);

  const planName = dashboard?.plan.name ? dashboard.plan.name : "starter";
  const channelBreakdown = dashboard?.breakdown.conversations_by_channel || [];
  const totalByChannel = channelBreakdown.reduce((acc, item) => acc + item.count, 0);
  const usageSeries =
    dashboard?.timeseries.daily_conversations_last_30_days.slice(-7) || [];

  const usageCards = (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900/70">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Usage</h2>
        <ul className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <li>
            Conversations this month: {dashboard?.usage.current_month_conversations ?? 0} / {dashboard?.plan.monthly_conversations_limit ?? 0}
          </li>
          <li>
            Connected channels: {dashboard?.usage.connected_channels_count ?? 0} / {dashboard?.plan.channels_included ?? 0}
          </li>
          <li>
            Seats: {dashboard?.usage.seats_used ?? 0} / {dashboard?.plan.seats_included ?? 0}
          </li>
          <li>Customers: {dashboard?.usage.customers_count ?? 0}</li>
          <li>Messages this month: {dashboard?.usage.current_month_messages ?? 0}</li>
        </ul>
      </div>
      <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900/70">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Plan limits</h2>
        <ul className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <li>Monthly conversations: {dashboard?.plan.monthly_conversations_limit ?? 0}</li>
          <li>Brands/locations: {dashboard?.plan.brands_limit ?? 0}</li>
          <li>Seats included: {dashboard?.plan.seats_included ?? 0}</li>
          <li>Channels: {dashboard?.plan.channels_included ?? 0}</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {!user?.email_verified && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Please verify your email. Check your inbox for a verification link.
        </div>
      )}

      {loading && (
        <div className="rounded-2xl bg-white p-6 text-slate-600 shadow-sm dark:bg-slate-900/70">
          Loading dashboard...
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-950">
          {error}
        </div>
      )}

      {dashboard && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900/70">
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
              Welcome, {tenant?.name || user?.name || ""}
            </h1>
            <p className="text-slate-600 dark:text-slate-300">Plan: {planName}</p>
            {dashboard.plan.billing_status && (
              <p className="text-slate-600 dark:text-slate-300">Billing status: {dashboard.plan.billing_status}</p>
            )}
            {trialEnds && <p className="text-slate-600 dark:text-slate-300">Trial ends: {trialEnds}</p>}
          </div>

          {usageCards}

          <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900/70">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">Quick stats</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                <p className="text-xs uppercase text-slate-500">Customers</p>
                <p className="text-lg font-semibold">{dashboard.usage.customers_count}</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                <p className="text-xs uppercase text-slate-500">Seats used</p>
                <p className="text-lg font-semibold">
                  {dashboard.usage.seats_used} / {dashboard.plan.seats_included}
                </p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                <p className="text-xs uppercase text-slate-500">Connected channels</p>
                <p className="text-lg font-semibold">
                  {dashboard.usage.connected_channels_count}
                </p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                <p className="text-xs uppercase text-slate-500">Messages this month</p>
                <p className="text-lg font-semibold">
                  {dashboard.usage.current_month_messages}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900/70">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Usage over time</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">Conversations in the last 30 days</p>
              <div className="mt-4 space-y-3">
                {usageSeries.length === 0 && (
                  <p className="text-sm text-slate-500">No conversations yet.</p>
                )}
                {usageSeries.map((item) => {
                  const max = Math.max(...usageSeries.map((d) => d.count), 1);
                  const width = `${Math.max((item.count / max) * 100, 8)}%`;
                  return (
                    <div key={item.date} className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                        <span>{new Date(item.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
                        <span>{item.count}</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                        <div
                          className="h-2 rounded-full bg-onDutyNavy dark:bg-onDutyGold"
                          style={{ width }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900/70">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">By channel</h3>
              <div className="mt-4 space-y-3">
                {channelBreakdown.length === 0 && (
                  <p className="text-sm text-slate-500">No channel activity yet.</p>
                )}
                {channelBreakdown.map((item) => {
                  const percentage = totalByChannel
                    ? Math.round((item.count / totalByChannel) * 100)
                    : 0;
                  return (
                    <div
                      key={item.channel}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                    >
                      <div className="flex items-center gap-2">
                        <span className="inline-block h-2 w-2 rounded-full bg-onDutyNavy dark:bg-onDutyGold" aria-hidden />
                        <span className="capitalize">{item.channel}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                        <span>{item.count}</span>
                        <span className="text-slate-400">•</span>
                        <span>{percentage}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
