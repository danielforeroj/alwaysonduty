"use client";

import { FormEvent, Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams?.get("token") || "", [searchParams]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [configError, setConfigError] = useState<string | null>(
    API_BASE ? null : "API base URL is not configured. Please set NEXT_PUBLIC_API_BASE_URL.",
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    const base = API_BASE;
    if (!base) {
      setConfigError("API base URL is not configured. Please set NEXT_PUBLIC_API_BASE_URL.");
      return;
    }
    try {
      const res = await fetch(`${base}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.detail || "Could not reset password");
      }
      setMessage("Password reset successfully. Redirecting to login...");
      setTimeout(() => router.push("/login"), 1200);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Set a new password</h1>
        <p className="text-slate-600 dark:text-slate-300">Enter and confirm your new password.</p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80"
      >
        <div>
          <label className="text-sm text-slate-600 dark:text-slate-300">New password</label>
          <input
            required
            type="password"
            autoComplete="new-password"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm text-slate-600 dark:text-slate-300">Confirm new password</label>
          <input
            required
            type="password"
            autoComplete="new-password"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {configError && <p className="text-sm text-red-600">{configError}</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-green-600">{message}</p>}
        <button
          type="submit"
          disabled={!!configError}
          className="w-full rounded-lg bg-slate-900 px-4 py-2 text-white shadow hover:bg-slate-800 disabled:opacity-50 dark:hover:bg-slate-700"
        >
          Update password
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-slate-500">Loading reset form…</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
