"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/providers/AuthProvider";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

interface DashboardResponse {
  tenant_name: string;
  plan_type: string;
  billing_status?: string | null;
  trial_ends_at?: string | null;
  limits: { conversations: number; brands: number; seats: number; channels: number };
  usage: { conversations: number; customers: number; channels: number; seats: number };
}

export default function DashboardPage() {
  const router = useRouter();
  const { token, user, tenant, loading: authLoading, logout } = useAuth();
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [configError, setConfigError] = useState<string | null>(
    API_BASE ? null : "API base URL is not configured. Please set NEXT_PUBLIC_API_BASE_URL.",
  );
  const [loading, setLoading] = useState(true);

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
        const res = await fetch(`${base}/api/dashboard/me`, {
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
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [authLoading, router, token, logout]);

  if (authLoading || loading) {
    return <p>Loading dashboard...</p>;
  }

  if (configError) {
    return <p className="text-red-600">{configError}</p>;
  }

  if (!dashboard) {
    return <p className="text-sm text-slate-500">Unable to load dashboard data.</p>;
  }

  const trialEnds = dashboard.trial_ends_at
    ? new Date(dashboard.trial_ends_at).toLocaleDateString()
    : null;

  return (
    <div className="space-y-6">
      {!user?.email_verified && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Please verify your email. Check your inbox for a verification link.
        </div>
      )}

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Welcome, {tenant?.name || dashboard.tenant_name}</h1>
        <p className="text-slate-600">Plan: {dashboard.plan_type}</p>
        {dashboard.billing_status && (
          <p className="text-slate-600">Billing status: {dashboard.billing_status}</p>
        )}
        {trialEnds && <p className="text-slate-600">Trial ends: {trialEnds}</p>}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Usage</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li>
              Conversations this month: {dashboard.usage.conversations} / {dashboard.limits.conversations}
            </li>
            <li>
              Connected channels: {dashboard.usage.channels} / {dashboard.limits.channels}
            </li>
            <li>
              Seats: {dashboard.usage.seats} / {dashboard.limits.seats}
            </li>
            <li>Customers: {dashboard.usage.customers}</li>
          </ul>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Plan limits</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li>Monthly conversations: {dashboard.limits.conversations}</li>
            <li>Brands/locations: {dashboard.limits.brands}</li>
            <li>Seats included: {dashboard.limits.seats}</li>
            <li>Channels: {dashboard.limits.channels}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
