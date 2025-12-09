"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/providers/AuthProvider";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [configError, setConfigError] = useState<string | null>(
    API_BASE ? null : "API base URL is not configured. Please set NEXT_PUBLIC_API_BASE_URL.",
  );
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const base = API_BASE;
    if (!base) {
      console.error("NEXT_PUBLIC_API_BASE_URL is not set. Cannot log in.");
      setConfigError("API base URL is not configured. Please set NEXT_PUBLIC_API_BASE_URL.");
      setSubmitting(false);
      return;
    }
    try {
      const res = await fetch(`${base}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || "Login failed");
      setAuth(data);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Welcome back</h1>
        <p className="text-slate-600">Log in to manage your tenant.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
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
            autoComplete="current-password"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <div className="text-right text-sm">
          <a href="/forgot-password" className="text-slate-700 underline">
            Forgot password?
          </a>
        </div>
        {configError && <p className="text-sm text-red-600">{configError}</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={!!configError || submitting}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Logging in…" : "Log in"}
        </button>
      </form>
    </div>
  );
}
