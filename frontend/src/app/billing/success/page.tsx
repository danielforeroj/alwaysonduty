"use client";

import { useRouter } from "next/navigation";
import { PrimaryButton } from "../../../components/Buttons";

export default function BillingSuccessPage() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-2xl space-y-4 rounded-2xl border border-slate-200 bg-white/90 p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-onDutyGold">Billing</p>
        <h1 className="text-3xl font-semibold text-onDutyNavy dark:text-white">Billing set up successfully</h1>
        <p className="text-slate-600 dark:text-slate-300">
          Your subscription is active or in trial. You can manage your account from the dashboard.
        </p>
      </div>
      <PrimaryButton onClick={() => router.push("/dashboard")} className="justify-center">
        Go to dashboard
      </PrimaryButton>
    </div>
  );
}
