"use client";

import { FormEvent, Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

type PlanType = "starter" | "growth" | "premium";
type TrialMode = "with_card" | "no_card";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPlan = useMemo<PlanType>(() => {
    const plan = (searchParams?.get("plan") as PlanType | null) || "starter";
    return ["starter", "growth", "premium"].includes(plan) ? plan : "starter";
  }, [searchParams]);

  const [form, setForm] = useState<{ name: string; business_name: string; email: string; password: string; plan_type: PlanType }>(
    { name: "", business_name: "", email: "", password: "", plan_type: initialPlan },
  );
  const [trialMode, setTrialMode] = useState<TrialMode>("with_card");
  const [error, setError] = useState<string | null>(null);
  const [configError, setConfigError] = useState<string | null>(
    API_BASE ? null : "API base URL is not configured. Please set NEXT_PUBLIC_API_BASE_URL.",
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const base = API_BASE;
    if (!base) {
      console.error("NEXT_PUBLIC_API_BASE_URL is not set. Cannot sign up.");
      setConfigError("API base URL is not configured. Please set NEXT_PUBLIC_API_BASE_URL.");
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
      localStorage.setItem("on_duty_token", data.access_token);

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
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Create your account</h1>
        <p className="text-slate-600">Spin up your tenant and invite your team later.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm text-slate-600">Name</label>
            <input
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm text-slate-600">Business name</label>
            <input
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={form.business_name}
              onChange={(e) => setForm({ ...form, business_name: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="text-sm text-slate-600">Email</label>
          <input
            required
            type="email"
            autoComplete="username"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm text-slate-600">Password</label>
          <input
            required
            type="password"
            autoComplete="new-password"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm text-slate-600">Plan</label>
          <select
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={form.plan_type}
            onChange={(e) => setForm({ ...form, plan_type: e.target.value as PlanType })}
          >
            <option value="starter">Starter</option>
            <option value="growth">Growth</option>
            <option value="premium">Premium</option>
          </select>
        </div>
        <div className="space-y-2 rounded-lg border border-dashed border-slate-300 p-3 text-sm">
          <p className="font-semibold text-slate-700">Trial options</p>
          <label className="flex items-center gap-2 text-slate-700">
            <input
              type="radio"
              name="trial"
              value="with_card"
              checked={trialMode === "with_card"}
              onChange={() => setTrialMode("with_card")}
            />
            <span>15-day free trial (card required)</span>
          </label>
          <label className="flex items-center gap-2 text-slate-700">
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
          disabled={!!configError}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700 disabled:opacity-50"
        >
          Create account
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
