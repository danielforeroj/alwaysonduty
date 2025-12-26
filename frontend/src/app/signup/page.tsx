"use client";

import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../components/providers/AuthProvider";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

type PlanType = "basic" | "growth" | "premium";
type TrialMode = "with_card" | "no_card";

function normalizePlanParam(plan: string | null): PlanType {
  switch (plan) {
    case "starter":
    case "basic":
      return "basic";
    case "growth":
      return "growth";
    case "premium":
      return "premium";
    default:
      return "basic";
  }
}

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuth();
  const initialPlan = useMemo<PlanType>(() => {
    const plan = searchParams?.get("plan");
    return normalizePlanParam(plan);
  }, [searchParams]);

  const [form, setForm] = useState<{ name: string; business_name: string; email: string; password: string; plan_type: PlanType }>(
    { name: "", business_name: "", email: "", password: "", plan_type: initialPlan },
  );
  const [trialMode, setTrialMode] = useState<TrialMode>("no_card");
  const [error, setError] = useState<string | null>(null);
  const [configError, setConfigError] = useState<string | null>(
    API_BASE ? null : "API base URL is not configured. Please set NEXT_PUBLIC_API_BASE_URL.",
  );
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setForm((prev) => ({ ...prev, plan_type: initialPlan }));
  }, [initialPlan]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const base = API_BASE;
    if (!base) {
      console.error("NEXT_PUBLIC_API_BASE_URL is not set. Cannot sign up.");
      setConfigError("API base URL is not configured. Please set NEXT_PUBLIC_API_BASE_URL.");
      setSubmitting(false);
      return;
    }
    try {
      const res = await fetch(`${base}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, trial_mode: trialMode }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.detail || "Signup failed");
      }
      setAuth(data);

      if (trialMode === "no_card") {
        router.push("/dashboard");
        return;
      }

      const checkoutRes = await fetch(`${base}/api/billing/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.access_token}`,
        },
        body: JSON.stringify({ plan_type: form.plan_type, trial_mode: "with_card" }),
      });
      const checkoutData = await checkoutRes.json();
      if (!checkoutRes.ok || !checkoutData.checkout_url) {
        throw new Error(checkoutData?.detail || "Could not start checkout");
      }
      window.location.href = checkoutData.checkout_url;
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Create your account</h1>
        <p className="text-slate-600 dark:text-slate-300">Spin up your tenant and invite your team later.</p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm text-slate-600 dark:text-slate-300">Name</label>
            <input
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm text-slate-600 dark:text-slate-300">Business name</label>
            <input
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50"
              value={form.business_name}
              onChange={(e) => setForm({ ...form, business_name: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="text-sm text-slate-600 dark:text-slate-300">Email</label>
          <input
            required
            type="email"
            autoComplete="username"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm text-slate-600 dark:text-slate-300">Password</label>
          <input
            required
            type="password"
            autoComplete="new-password"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm text-slate-600 dark:text-slate-300">Plan</label>
          <select
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50"
            value={form.plan_type}
            onChange={(e) => setForm({ ...form, plan_type: e.target.value as PlanType })}
          >
            <option value="basic">Basic</option>
            <option value="growth">Growth</option>
            <option value="premium">Premium</option>
          </select>
        </div>
        <div className="space-y-2 rounded-lg border border-dashed border-slate-300 p-3 text-sm dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200">Trial options</p>
          <label className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
            <input
              type="radio"
              name="trial"
              value="with_card"
              checked={trialMode === "with_card"}
              onChange={() => setTrialMode("with_card")}
            />
            <span>15-day free trial (card required)</span>
          </label>
          <label className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
            <input
              type="radio"
              name="trial"
              value="no_card"
              checked={trialMode === "no_card"}
              onChange={() => setTrialMode("no_card")}
            />
            <span>3-day free trial (no card yet)</span>
          </label>
        </div>
        {configError && <p className="text-sm text-red-600">{configError}</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={!!configError || submitting}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700 disabled:opacity-50 dark:hover:bg-blue-500"
        >
          {submitting ? "Creating..." : "Create account"}
        </button>
      </form>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-sm text-slate-500">Loading signup…</div>}>
      <SignupForm />
    </Suspense>
  );
}
