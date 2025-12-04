"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

interface ChatMessage {
  role: "user" | "ai";
  text: string;
}

export default function TryPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [configError, setConfigError] = useState<string | null>(null);

  useEffect(() => {
    if (!API_BASE) {
      console.error("NEXT_PUBLIC_API_BASE_URL is not set. Cannot send chat messages.");
      setConfigError("API base URL is not configured. Please set NEXT_PUBLIC_API_BASE_URL.");
      return;
    }

    const existing = localStorage.getItem("on_duty_session_id");
    if (existing) {
      setSessionId(existing);
    } else {
      const id = crypto.randomUUID();
      localStorage.setItem("on_duty_session_id", id);
      setSessionId(id);
    }
  }, []);

  const sendMessage = async () => {
    if (configError) return;
    const base = API_BASE;
    if (!base) {
      setConfigError("API base URL is not configured. Please set NEXT_PUBLIC_API_BASE_URL.");
      return;
    }

    if (!input.trim() || !sessionId) return;
    const userMsg: ChatMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch(`${base}/api/webchat/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenant_slug: "demo",
          channel: "web",
          session_id: sessionId,
          text: userMsg.text,
        }),
      });
      const data = await res.json();
      const aiMsg: ChatMessage = { role: "ai", text: data.reply || "No response" };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "ai", text: "Something went wrong." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Try our agent</h1>
        <p className="text-slate-600">Chat with a demo assistant. Responses are stubbed for now.</p>
        {configError && <p className="mt-3 text-sm text-red-600">{configError}</p>}
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-4 h-80 overflow-y-auto rounded-lg border border-slate-200 p-4">
          {messages.length === 0 && <p className="text-sm text-slate-500">Start the conversation!</p>}
          {messages.map((msg, idx) => (
            <div key={idx} className={`mb-3 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`${msg.role === "user" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-900"} max-w-[80%] rounded-xl px-4 py-2 text-sm`}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && <p className="text-sm text-slate-500">Thinking...</p>}
        </div>

        <div className="flex gap-2">
          <input
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
            disabled={!!configError}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !!configError}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
