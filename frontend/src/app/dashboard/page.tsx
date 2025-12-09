"use client";

// NOTE: This is the main tenant dashboard component (confirmed).

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/providers/AuthProvider";
import {
  DashboardMetrics,
  EMPTY_METRICS,
  SAMPLE_METRICS,
} from "../../types/dashboard";
import { SecondaryButton } from "@/components/Buttons";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function DashboardPage() {
  const router = useRouter();
  const { token, user, tenant, loading: authLoading, logout } = useAuth();
  const [dashboard, setDashboard] = useState<DashboardMetrics>(EMPTY_METRICS);
  const [showSampleData, setShowSampleData] = useState(false);
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
        const data: DashboardMetrics = await res.json();
        setDashboard(data);
        setError(null);
      } catch (err) {
        console.error("Failed to load dashboard metrics", err);
        setDashboard(EMPTY_METRICS);
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

  const effectiveMetrics: DashboardMetrics = showSampleData
    ? SAMPLE_METRICS
    : dashboard || EMPTY_METRICS;

  const trialEnds = formatDate(effectiveMetrics.plan.trial_ends_at || null);

  const planName = effectiveMetrics.plan.name ? effectiveMetrics.plan.name : "starter";
  const channelBreakdown = effectiveMetrics.breakdown.conversations_by_channel || [];
  const totalByChannel = channelBreakdown.reduce((acc, item) => acc + item.count, 0);
  const usageSeries = effectiveMetrics.timeseries.daily_conversations_last_30_days.slice(-7) || [];

  const usageCards = (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900/70">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Usage</h2>
        <ul className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <li>
            Conversations this month: {effectiveMetrics.usage.current_month_conversations ?? 0} / {effectiveMetrics.plan.monthly_conversations_limit ?? 0}
            <p className="text-xs text-slate-500">
              Total chat sessions handled this month. Helps you track volume against plan limits.
            </p>
          </li>
          <li>
            Connected channels: {effectiveMetrics.usage.connected_channels_count ?? 0} / {effectiveMetrics.plan.channels_included ?? 0}
            <p className="text-xs text-slate-500">How many channels are live out of your plan allowance.</p>
          </li>
          <li>
            Seats: {effectiveMetrics.usage.seats_used ?? 0} / {effectiveMetrics.plan.seats_included ?? 0}
            <p className="text-xs text-slate-500">Team members using the dashboard vs seats included.</p>
          </li>
          <li>
            Customers: {effectiveMetrics.usage.customers_count ?? 0}
            <p className="text-xs text-slate-500">Unique customers who have chatted with your agents.</p>
          </li>
          <li>
            Messages this month: {effectiveMetrics.usage.current_month_messages ?? 0}
            <p className="text-xs text-slate-500">Total exchanged messages across all conversations.</p>
          </li>
        </ul>
      </div>
      <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900/70">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Plan limits</h2>
        <ul className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <li>Monthly conversations: {effectiveMetrics.plan.monthly_conversations_limit ?? 0}</li>
          <li>Brands/locations: {effectiveMetrics.plan.brands_limit ?? 0}</li>
          <li>Seats included: {effectiveMetrics.plan.seats_included ?? 0}</li>
          <li>Channels: {effectiveMetrics.plan.channels_included ?? 0}</li>
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

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-950">
          {error}
        </div>
      )}

      {loading && (
        <div className="rounded-2xl bg-white p-6 text-slate-600 shadow-sm dark:bg-slate-900/70">
          Loading dashboard...
        </div>
      )}

      {!loading && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900/70">
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
              Welcome, {tenant?.name || user?.name || ""}
            </h1>
            <p className="text-slate-600 dark:text-slate-300">Plan: {planName}</p>
            {effectiveMetrics.plan.billing_status && (
              <p className="text-slate-600 dark:text-slate-300">Billing status: {effectiveMetrics.plan.billing_status}</p>
            )}
            {trialEnds && <p className="text-slate-600 dark:text-slate-300">Trial ends: {trialEnds}</p>}
          </div>

          {usageCards}

          <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900/70">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">Quick stats</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                <p className="text-xs uppercase text-slate-500">Customers</p>
                <p className="text-lg font-semibold">{effectiveMetrics.usage.customers_count}</p>
                <p className="text-xs text-slate-500">Total unique customers your agents talked to.</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                <p className="text-xs uppercase text-slate-500">Seats used</p>
                <p className="text-lg font-semibold">
                  {effectiveMetrics.usage.seats_used} / {effectiveMetrics.plan.seats_included}
                </p>
                <p className="text-xs text-slate-500">Team members occupying seats from your plan.</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                <p className="text-xs uppercase text-slate-500">Connected channels</p>
                <p className="text-lg font-semibold">
                  {effectiveMetrics.usage.connected_channels_count}
                </p>
                <p className="text-xs text-slate-500">Live channels (web today; WhatsApp/Telegram coming soon).</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                <p className="text-xs uppercase text-slate-500">Messages this month</p>
                <p className="text-lg font-semibold">
                  {effectiveMetrics.usage.current_month_messages}
                </p>
                <p className="text-xs text-slate-500">Total inbound + outbound messages across conversations.</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Analytics</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Explore live performance or switch to sample data to preview a busy month.
                </p>
              </div>
              <SecondaryButton
                type="button"
                className="px-3 py-2 text-xs"
                onClick={() => setShowSampleData((prev) => !prev)}
              >
                {showSampleData ? "Back to live data" : "Show sample data"}
              </SecondaryButton>
            </div>

            {showSampleData && (
              <div className="rounded-md border border-dashed border-amber-300 bg-amber-50 px-4 py-2 text-xs text-amber-900">
                Demo mode: You’re viewing <strong>sample analytics</strong> for a busy month. This data isn’t from your account.
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900/70">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Usage over time</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">Conversations in the last 30 days</p>
                <p className="mt-1 text-xs text-slate-500">
                  Daily conversations over the last 30 days. Spikes often match campaigns or busier business days.
                </p>
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
                <p className="mt-1 text-xs text-slate-500">
                  Distribution of conversations by channel. Web is live; WhatsApp/Telegram are shown as coming soon for planning.
                </p>
                <div className="mt-4 space-y-3">
                  {channelBreakdown.length === 0 && (
                    <p className="text-sm text-slate-500">No channel activity yet.</p>
                  )}
                  {channelBreakdown.map((item) => {
                    const basePercentage = totalByChannel
                      ? Math.round((item.count / totalByChannel) * 100)
                      : 0;
                    const percentage = item.percentage ?? basePercentage;
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
        </div>
      )}
    </div>
  );
}
