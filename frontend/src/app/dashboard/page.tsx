"use client";

// NOTE: This is the main tenant dashboard component (confirmed).

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/providers/AuthProvider";
import {
  DashboardMetrics,
  EMPTY_METRICS,
  SAMPLE_METRICS,
  ClientAnalytics,
  EMPTY_CLIENT_ANALYTICS,
  SAMPLE_CLIENT_ANALYTICS,
} from "../../types/dashboard";
import { SecondaryButton } from "@/components/Buttons";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function DashboardPage() {
  const router = useRouter();
  const { token, user, tenant, loading: authLoading, logout } = useAuth();
  const [dashboard, setDashboard] = useState<DashboardMetrics>(EMPTY_METRICS);
  const [showSampleData, setShowSampleData] = useState(false);
  const [clientAnalytics, setClientAnalytics] = useState<ClientAnalytics>(EMPTY_CLIENT_ANALYTICS);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);
  const [analyticsTab, setAnalyticsTab] = useState<"overview" | "drilldown">("overview");
  const [selectedConversation, setSelectedConversation] =
    useState<ClientAnalytics["drilldown"]["conversations"][number] | null>(null);
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

  useEffect(() => {
    if (showSampleData) {
      setClientAnalytics(SAMPLE_CLIENT_ANALYTICS);
      setAnalyticsError(null);
    } else {
      setClientAnalytics(EMPTY_CLIENT_ANALYTICS);
      setAnalyticsError(null);
    }
  }, [showSampleData]);

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

  const effectiveAnalytics: ClientAnalytics = showSampleData
    ? SAMPLE_CLIENT_ANALYTICS
    : clientAnalytics;

  const hasAnalytics = Boolean(effectiveAnalytics);
  const channelLabel = (channel: "web" | "whatsapp" | "telegram") => {
    if (channel === "web") return "Web widget";
    if (channel === "whatsapp") return "WhatsApp (coming soon)";
    if (channel === "telegram") return "Telegram (coming soon)";
    return channel;
  };

  const trialEnds = formatDate(effectiveMetrics.plan.trial_ends_at || null);

  const planName = effectiveMetrics.plan.name ? effectiveMetrics.plan.name : "starter";
  const channelBreakdown = effectiveMetrics.breakdown.conversations_by_channel || [];
  const totalByChannel = channelBreakdown.reduce((acc, item) => acc + item.count, 0);

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
            <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900/70">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Analytics</h3>
                  <p className="text-xs text-slate-500">
                    Understand how your OnDuty agents are performing with your customers.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="inline-flex rounded-full border bg-slate-50 p-1 text-xs dark:border-slate-700 dark:bg-slate-800">
                    <button
                      type="button"
                      onClick={() => setAnalyticsTab("overview")}
                      className={`rounded-full px-3 py-1 transition ${
                        analyticsTab === "overview"
                          ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-50"
                          : "text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      Overview
                    </button>
                    <button
                      type="button"
                      onClick={() => setAnalyticsTab("drilldown")}
                      className={`rounded-full px-3 py-1 transition ${
                        analyticsTab === "drilldown"
                          ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-50"
                          : "text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      Drill-down
                    </button>
                  </div>
                  <SecondaryButton
                    type="button"
                    className="px-3 py-2 text-xs"
                    onClick={() => setShowSampleData((prev) => !prev)}
                  >
                    {showSampleData ? "Back to live data" : "Show sample data"}
                  </SecondaryButton>
                </div>
              </div>

              {showSampleData && (
                <div className="mt-3 rounded-md border border-dashed border-amber-300 bg-amber-50 px-4 py-2 text-xs text-amber-900">
                  Demo mode: You’re viewing <strong>sample analytics</strong> only. Real-time analytics will appear here as your
                  agents handle conversations.
                </div>
              )}

              {analyticsError && (
                <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-xs text-red-800">
                  {analyticsError}
                </div>
              )}

              {analyticsTab === "overview" && (
                <div className="mt-6 space-y-6">
                  {!hasAnalytics && !showSampleData && (
                    <p className="text-xs text-slate-500">
                      We’ll start showing analytics as soon as your agents handle conversations. Toggle sample data to preview
                      what a busy month looks like.
                    </p>
                  )}
                  {hasAnalytics && effectiveAnalytics && (
                    <>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                          <p className="text-xs uppercase text-slate-500">Total conversations</p>
                          <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                            {effectiveAnalytics.overview.totalConversations}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            Total unique conversations this month. Helps you understand traffic volume.
                          </p>
                        </div>
                        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                          <p className="text-xs uppercase text-slate-500">Sales vs support</p>
                          <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                            {effectiveAnalytics.overview.salesConversations} sales / {effectiveAnalytics.overview.supportConversations} support
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            Breakdown of conversations tagged as sales vs support so you can see where OnDuty creates value.
                          </p>
                        </div>
                        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                          <p className="text-xs uppercase text-slate-500">Response time</p>
                          <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                            {effectiveAnalytics.overview.avgFirstResponseSeconds}s first reply
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            Average time it takes your agent to send the first reply. Faster = happier customers.
                          </p>
                        </div>
                        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                          <p className="text-xs uppercase text-slate-500">Resolution rate</p>
                          <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                            {Math.round((effectiveAnalytics.overview.resolutionRate || 0) * 100)}%
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            Percentage of conversations successfully resolved. Track impact on your support quality.
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-4 lg:grid-cols-2">
                        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
                          <h4 className="text-base font-semibold text-slate-900 dark:text-slate-50">Most common questions</h4>
                          <p className="mt-1 text-xs text-slate-500">
                            Topics customers ask the most. Helps you refine FAQs and agent prompts.
                          </p>
                          <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
                            {effectiveAnalytics.overview.mostCommonQuestions.map((item) => (
                              <li key={item.question} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/80">
                                <span>{item.question}</span>
                                <span className="text-xs text-slate-500">{item.count}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
                          <h4 className="text-base font-semibold text-slate-900 dark:text-slate-50">Most common complaints</h4>
                          <p className="mt-1 text-xs text-slate-500">
                            Issues that trigger complaints. Use this to improve operations and messaging.
                          </p>
                          <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
                            {effectiveAnalytics.overview.mostCommonComplaints.map((item) => (
                              <li key={item.category} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/80">
                                <span>{item.category}</span>
                                <span className="text-xs text-slate-500">{item.count}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="grid gap-4 lg:grid-cols-3">
                        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
                          <h4 className="text-base font-semibold text-slate-900 dark:text-slate-50">Most requested services</h4>
                          <p className="mt-1 text-xs text-slate-500">
                            Top products/services your customers ask about. Helps you decide where to focus upsells.
                          </p>
                          <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
                            {effectiveAnalytics.overview.mostRequestedProducts.map((item) => (
                              <li key={item.name} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/80">
                                <span>{item.name}</span>
                                <span className="text-xs text-slate-500">{item.count}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
                          <h4 className="text-base font-semibold text-slate-900 dark:text-slate-50">Peak conversation times</h4>
                          <p className="mt-1 text-xs text-slate-500">
                            Hours with the most conversations. Use this to staff your team or schedule campaigns.
                          </p>
                          <div className="mt-3 space-y-2">
                            {effectiveAnalytics.overview.peakHours.map((hour) => {
                              const max = Math.max(...effectiveAnalytics.overview.peakHours.map((p) => p.conversations), 1);
                              const width = `${Math.max((hour.conversations / max) * 100, 8)}%`;
                              return (
                                <div key={hour.hourLabel} className="space-y-1">
                                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                                    <span>{hour.hourLabel}</span>
                                    <span>{hour.conversations}</span>
                                  </div>
                                  <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                                    <div className="h-2 rounded-full bg-onDutyNavy dark:bg-onDutyGold" style={{ width }} />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
                          <h4 className="text-base font-semibold text-slate-900 dark:text-slate-50">Languages</h4>
                          <p className="mt-1 text-xs text-slate-500">
                            Language distribution across conversations. Useful for multilingual support decisions.
                          </p>
                          <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
                            {effectiveAnalytics.overview.languages.map((lang) => (
                              <li key={lang.code} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/80">
                                <span>{lang.label}</span>
                                <span className="text-xs text-slate-500">{lang.percentage}%</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
                        <h4 className="text-base font-semibold text-slate-900 dark:text-slate-50">Customer satisfaction</h4>
                        <p className="mt-1 text-xs text-slate-500">
                          Customer satisfaction based on post-chat feedback. Higher scores usually correlate with faster,
                          accurate responses.
                        </p>
                        <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_2fr]">
                          <div className="rounded-xl bg-slate-50 p-4 text-center dark:bg-slate-800/80">
                            <p className="text-xs uppercase text-slate-500">Average score</p>
                            <p className="text-3xl font-semibold text-slate-900 dark:text-slate-50">
                              {effectiveAnalytics.overview.customerSatisfaction.avgScore.toFixed(1)} / 5
                            </p>
                          </div>
                          <div className="space-y-2">
                            {effectiveAnalytics.overview.customerSatisfaction.distribution.map((row) => {
                              const width = `${row.percentage}%`;
                              return (
                                <div key={row.score} className="space-y-1">
                                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                                    <span>{row.score} star</span>
                                    <span>{row.percentage}%</span>
                                  </div>
                                  <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                                    <div className="h-2 rounded-full bg-onDutyWine" style={{ width }} />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {analyticsTab === "drilldown" && (
                <div className="mt-6 space-y-4">
                  {!hasAnalytics && !showSampleData && (
                    <p className="text-xs text-slate-500">
                      We’ll show drill-down analytics once conversations start flowing. Try sample data to see the experience.
                    </p>
                  )}
                  {hasAnalytics && effectiveAnalytics && (
                    <>
                      <div className="rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-700 dark:bg-slate-800/80 dark:text-slate-200">
                        <p className="font-medium text-slate-900 dark:text-slate-50">This week’s insight</p>
                        <p>{effectiveAnalytics.drilldown.weeklyInsight}</p>
                      </div>
                      <p className="text-xs text-slate-500">
                        Drill into individual conversations to understand intent, satisfaction, and where your OnDuty agent is
                        creating (or losing) value.
                      </p>
                      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
                        <div className="max-h-[420px] overflow-auto">
                          <table className="min-w-full text-left text-xs text-slate-700 dark:text-slate-200">
                            <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800/70">
                              <tr>
                                <th className="px-4 py-2">Date</th>
                                <th className="px-4 py-2">Customer</th>
                                <th className="px-4 py-2">Channel</th>
                                <th className="px-4 py-2">Region</th>
                                <th className="px-4 py-2">Intent</th>
                                <th className="px-4 py-2">Lead status</th>
                                <th className="px-4 py-2">CSAT</th>
                                <th className="px-4 py-2">First response</th>
                                <th className="px-4 py-2">Resolution</th>
                              </tr>
                            </thead>
                            <tbody>
                              {effectiveAnalytics.drilldown.conversations.map((conv) => (
                                <tr
                                  key={conv.id}
                                  className="cursor-pointer border-t border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60"
                                  onClick={() => setSelectedConversation(conv)}
                                >
                                  <td className="px-4 py-2">
                                    {new Date(conv.date).toLocaleString(undefined, {
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </td>
                                  <td className="px-4 py-2">{conv.customerName}</td>
                                  <td className="px-4 py-2">{channelLabel(conv.channel)}</td>
                                  <td className="px-4 py-2">{conv.region} / {conv.country}</td>
                                  <td className="px-4 py-2 capitalize">{conv.intent}</td>
                                  <td className="px-4 py-2 capitalize">{conv.leadStatus.replace("_", " ")}</td>
                                  <td className="px-4 py-2">{conv.csatScore ?? "-"}</td>
                                  <td className="px-4 py-2">{conv.firstResponseSeconds}s</td>
                                  <td className="px-4 py-2">{conv.resolutionMinutes ? `${conv.resolutionMinutes}m` : "-"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {selectedConversation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" role="dialog" aria-modal>
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase text-slate-500">Conversation insight</p>
                <h4 className="text-xl font-semibold text-slate-900 dark:text-slate-50">{selectedConversation.customerName}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {channelLabel(selectedConversation.channel)} • {selectedConversation.region} / {selectedConversation.country}
                </p>
              </div>
              <button
                type="button"
                className="text-sm text-slate-500 hover:text-slate-800"
                onClick={() => setSelectedConversation(null)}
              >
                Close
              </button>
            </div>
            <div className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-200">
              <p className="font-medium">Summary</p>
              <p>{selectedConversation.summary}</p>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4 text-sm dark:bg-slate-800/80">
                <p className="text-xs uppercase text-slate-500">Intent</p>
                <p className="font-medium capitalize">{selectedConversation.intent}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 text-sm dark:bg-slate-800/80">
                <p className="text-xs uppercase text-slate-500">Lead status</p>
                <p className="font-medium capitalize">{selectedConversation.leadStatus.replace("_", " ")}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 text-sm dark:bg-slate-800/80">
                <p className="text-xs uppercase text-slate-500">First response</p>
                <p className="font-medium">{selectedConversation.firstResponseSeconds}s</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 text-sm dark:bg-slate-800/80">
                <p className="text-xs uppercase text-slate-500">Resolution</p>
                <p className="font-medium">{selectedConversation.resolutionMinutes ? `${selectedConversation.resolutionMinutes}m` : "-"}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 text-sm dark:bg-slate-800/80">
                <p className="text-xs uppercase text-slate-500">CSAT</p>
                <p className="font-medium">{selectedConversation.csatScore ?? "Not provided"}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 text-sm dark:bg-slate-800/80">
                <p className="text-xs uppercase text-slate-500">AI insight</p>
                <p>
                  This {selectedConversation.intent} conversation from {selectedConversation.country} had a
                  {selectedConversation.csatScore && selectedConversation.csatScore <= 3 ? " low" : " good"} satisfaction score.
                  Consider updating your {selectedConversation.intent === "complaint" ? "support flows" : "FAQ"} around this topic.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
