"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

type Status = "pending" | "success" | "error";

function VerifyEmailHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams?.get("token") || "", [searchParams]);
  const [status, setStatus] = useState<Status>("pending");
  const [configError, setConfigError] = useState<string | null>(
    API_BASE ? null : "API base URL is not configured. Please set NEXT_PUBLIC_API_BASE_URL.",
  );

  useEffect(() => {
    const base = API_BASE;
    if (!base) {
      setConfigError("API base URL is not configured. Please set NEXT_PUBLIC_API_BASE_URL.");
      setStatus("error");
      return;
    }
    if (!token) {
      setStatus("error");
      return;
    }
    const verify = async () => {
      try {
        const res = await fetch(`${base}/api/auth/verify-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        if (!res.ok) {
          throw new Error("Invalid or expired verification token.");
        }
        setStatus("success");
      } catch (err) {
        setStatus("error");
      }
    };
    verify();
  }, [token]);

  return (
    <div className="mx-auto max-w-xl space-y-4 rounded-2xl bg-white p-6 shadow-sm">
      {status === "pending" && <p className="text-slate-700">Verifying your email…</p>}
      {configError && <p className="text-sm text-red-600">{configError}</p>}
      {status === "success" && (
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-slate-900">Your email is verified</h1>
          <p className="text-slate-700">You can now use all features of OnDuty.</p>
          <button
            className="rounded-lg bg-slate-900 px-4 py-2 text-white shadow hover:bg-slate-800"
            onClick={() => router.push("/dashboard")}
          >
            Go to dashboard
          </button>
        </div>
      )}
      {status === "error" && (
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-slate-900">Verification failed</h1>
          <p className="text-slate-700">Verification link is invalid or expired.</p>
          <button
            className="rounded-lg bg-slate-900 px-4 py-2 text-white shadow hover:bg-slate-800"
            onClick={() => router.push("/login")}
          >
            Go to login
          </button>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-slate-500">Verifying…</div>}>
      <VerifyEmailHandler />
    </Suspense>
  );
}
