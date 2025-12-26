"use client";

import { PrimaryButton, SecondaryButton } from "../../../components/Buttons";

export default function BillingCancelPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-4 rounded-2xl border border-slate-200 bg-white/90 p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-onDutyGold">Billing</p>
        <h1 className="text-3xl font-semibold text-onDutyNavy dark:text-white">Checkout cancelled</h1>
        <p className="text-slate-600 dark:text-slate-300">
          No charges were made. You can restart checkout whenever you are ready.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <PrimaryButton href="/billing" className="justify-center">
          Return to billing
        </PrimaryButton>
        <SecondaryButton href="/dashboard" className="justify-center">
          Back to dashboard
        </SecondaryButton>
      </div>
    </div>
  );
}
