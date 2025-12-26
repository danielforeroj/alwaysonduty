"use client";

import { useState } from "react";
import { PrimaryButton, SecondaryButton } from "../../components/Buttons";
import { useAuth } from "../../components/providers/AuthProvider";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

type PlanType = "basic" | "growth" | "premium";

const plans: Array<{
  id: PlanType;
  name: string;
  price: string;
  limits: string[];
}> = [
  {
    id: "basic",
    name: "Basic",
    price: "$20/mo",
    limits: ["200 conversations", "1 workspace", "1 brand/location", "1 admin seat"],
  },
  {
    id: "growth",
    name: "Growth",
    price: "$40/mo",
    limits: ["500 conversations", "Up to 2 brands/locations", "Up to 3 admin seats"],
  },
  {
    id: "premium",
    name: "Premium",
    price: "$60/mo",
    limits: ["1000 conversations", "Up to 3 brands/locations", "Up to 5 admin seats"],
  },
];

const planOrder: Record<PlanType, number> = { basic: 0, growth: 1, premium: 2 };

function normalizeCurrentPlan(planType: string | undefined): PlanType | undefined {
  if (!planType) return undefined;
  if (planType === "starter") return "basic";
  if (planType === "basic" || planType === "growth" || planType === "premium") {
    return planType;
  }
  return undefined;
}

export default function BillingPage() {
  const { token, tenant } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState<PlanType | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = async (planType: PlanType) => {
    setError(null);
    if (!API_BASE) {
      setError("API base URL is not configured.");
      return;
    }
    if (!token) {
      setError("You must be signed in to manage billing.");
      return;
    }
    setLoadingPlan(planType);
    try {
      const res = await fetch(`${API_BASE}/api/billing/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan_type: planType, trial_mode: "with_card" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.checkout_url) {
        throw new Error(data?.detail || "Unable to start checkout. Please try again.");
      }
      window.location.href = data.checkout_url;
    } catch (err: any) {
      setError(err.message || "Unable to start checkout. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

  const startPortal = async () => {
    setError(null);
    if (!API_BASE) {
      setError("API base URL is not configured.");
      return;
    }
    if (!token) {
      setError("You must be signed in to manage billing.");
      return;
    }
    setPortalLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/billing/portal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.url) {
        throw new Error(data?.detail || "Unable to open the billing portal.");
      }
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message || "Unable to open the billing portal.");
    } finally {
      setPortalLoading(false);
    }
  };

  const currentPlan = normalizeCurrentPlan(tenant?.plan_type);

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Billing</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Choose the plan that fits your volume. You can upgrade or downgrade anytime.
        </p>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => {
          const isCurrent = currentPlan === plan.id;
          let buttonLabel = "Choose plan";
          if (isCurrent) {
            buttonLabel = "Current plan";
          } else if (currentPlan && planOrder[plan.id] > planOrder[currentPlan]) {
            buttonLabel = "Upgrade";
          } else if (currentPlan && planOrder[plan.id] < planOrder[currentPlan]) {
            buttonLabel = "Downgrade";
          }

          return (
            <div
              key={plan.id}
              className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80"
            >
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-onDutyGold">{plan.name}</p>
                  <p className="mt-1 text-3xl font-semibold text-slate-900 dark:text-white">{plan.price}</p>
                </div>
                <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
                  {plan.limits.map((limit) => (
                    <li key={limit}>• {limit}</li>
                  ))}
                </ul>
              </div>
              <PrimaryButton
                className="mt-6 w-full justify-center"
                onClick={() => startCheckout(plan.id)}
                disabled={isCurrent || loadingPlan === plan.id}
              >
                {loadingPlan === plan.id ? "Starting checkout..." : buttonLabel}
              </PrimaryButton>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SecondaryButton onClick={startPortal} disabled={portalLoading}>
          {portalLoading ? "Opening billing portal..." : "Manage billing"}
        </SecondaryButton>
        <span className="text-sm text-slate-500">Need help? Email support@alwaysonduty.ai</span>
      </div>
    </div>
  );
}
