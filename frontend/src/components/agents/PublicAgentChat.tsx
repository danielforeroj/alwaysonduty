"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

import { useCopy } from "@/lib/copy";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

type ChatMessage = {
  id: string;
  role: "user" | "ai";
  text: string;
};

type Props = {
  agentSlug: string;
  agentName: string;
  companyName?: string | null;
};

const generateId = () => crypto.randomUUID();

export default function PublicAgentChat({ agentSlug, agentName, companyName }: Props) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const t = useCopy().publicAgent.chat;

  const storageKey = useMemo(() => `on_duty_session_id:${agentSlug}`, [agentSlug]);

  useEffect(() => {
    if (!API_BASE) {
      setError(t.error);
      return;
    }
    const existing = localStorage.getItem(storageKey);
    if (existing) {
      setSessionId(existing);
    } else {
      const id = crypto.randomUUID();
      localStorage.setItem(storageKey, id);
      setSessionId(id);
    }
  }, [storageKey, t.error]);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading || !sessionId || !API_BASE) return;
    setError(null);
    const text = input.trim();
    const userMsg: ChatMessage = { id: generateId(), role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/webchat/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent_slug: agentSlug,
          channel: "web",
          session_id: sessionId,
          text,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to reach agent");
      }

      const data = await res.json();
      const aiMsg: ChatMessage = {
        id: generateId(),
        role: "ai",
        text: data.reply || t.starterBody,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">{t.heading}</p>
          <h2 className="text-lg font-semibold text-slate-900">{agentName}</h2>
          <p className="text-sm text-slate-600">{companyName || "OnDuty agent"}</p>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
          {t.badge}
        </span>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 space-y-3 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
      >
        {messages.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white/80 p-4 text-sm text-slate-600">
            <p className="font-medium text-slate-800">{t.starterTitle}</p>
            <p className="mt-1 text-slate-600">{t.starterBody}</p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                msg.role === "user"
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-900 ring-1 ring-slate-200"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs text-slate-600 ring-1 ring-slate-200">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
              {t.thinking}
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{t.error}</p>}

      <div className="flex gap-2 rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-sm">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t.placeholder}
          className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
          disabled={loading || (!!error && !API_BASE)}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim() || !sessionId || !API_BASE}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? t.sending : t.send}
        </button>
      </div>
    </div>
  );
}
