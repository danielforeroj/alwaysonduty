"use client";

import { useEffect, useMemo, useState } from "react";
import PhoneInputField from "./PhoneInputField";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

type Props = {
  contextKey: string;
  agentSlug?: string;
  tenantSlug?: string;
  source?: string;
  onVerified: (token: string, customerId: string) => void;
};

function decodeToken(token: string): { exp?: number } | null {
  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch (err) {
    console.error("Failed to decode token", err);
    return null;
  }
}

export default function EndUserGate({
  contextKey,
  agentSlug,
  tenantSlug,
  source = "public_agent",
  onVerified,
}: Props) {
  const [step, setStep] = useState<"collect" | "code">("collect");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const storageKey = useMemo(() => `onduty_unlock:${contextKey}`, [contextKey]);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const data = decodeToken(stored);
      if (data?.exp && data.exp * 1000 > Date.now()) {
        onVerified(stored, "");
        return;
      }
      localStorage.removeItem(storageKey);
    }
    // We intentionally avoid adding onVerified as a dependency to prevent
    // rerunning the effect when parent components re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  if (!API_BASE) return null;

  const handleCollect = async () => {
    setError(null);
    const missing = !firstName || !lastName || !email || !phone;
    setPhoneError(!phone ? "Please fill out this field." : null);
    if (missing) {
      setError("Please fill out all fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/end-user-verification/initiate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          agent_slug: agentSlug,
          tenant_slug: tenantSlug,
          source,
        }),
      });
      if (!res.ok) {
        let detail = `Unable to start verification (status ${res.status})`;
        try {
          const data = await res.json();
          if (data?.detail) detail = `${data.detail} (status ${res.status})`;
        } catch {
          try {
            const txt = await res.text();
            if (txt) detail = `${txt} (status ${res.status})`;
          } catch {
            // ignore
          }
        }
        throw new Error(detail);
      }
      const data = await res.json();
      setVerificationToken(data.verification_token);
      setStep("code");
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "We could not start verification. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!verificationToken) return;
    if (!code.trim()) {
      setError("Enter the 4-digit code from your email.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/end-user-verification/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verification_token: verificationToken, code }),
      });
      if (!res.ok) {
        throw new Error("Invalid code");
      }
      const data = await res.json();
      localStorage.setItem(storageKey, data.unlock_token);
      onVerified(data.unlock_token, data.customer.id);
    } catch (err) {
      console.error(err);
      setError("The code was invalid or expired. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="text-lg font-semibold text-slate-900">Verify to chat</h2>
        {step === "collect" && (
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600">Name</label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  placeholder="Jane"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600">Last Name</label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  placeholder="Doe"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-600">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                placeholder="you@example.com"
                type="email"
              />
            </div>
            <PhoneInputField
              value={phone}
              onChange={(val) => {
                setPhone(val);
                setPhoneError(null);
              }}
              error={phoneError || null}
              placeholder="576 908 413"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              onClick={handleCollect}
              disabled={loading}
              className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {loading ? "Sending code..." : "Send verification code"}
            </button>
          </div>
        )}

        {step === "code" && (
          <div className="mt-4 space-y-3">
            <p className="text-sm text-slate-600">Enter the 4-digit code we sent to your email.</p>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
              maxLength={4}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-center text-lg tracking-[0.4em]"
              placeholder="0000"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setStep("collect");
                  setCode("");
                }}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
                disabled={loading}
              >
                Back
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                {loading ? "Verifying..." : "Verify"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
