"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

import { PrimaryButton } from "@/components/Buttons";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const STARTER_MESSAGE: ChatMessage = {
  role: "assistant",
  content: "Hi, I’m OnDuty’s agent. How can I help you learn about OnDuty?",
};

const COMPANY_NAME = "OnDuty";
const COMPANY_WEBSITE = "https://alwaysonduty.ai";
const AGENT_NAME = "OnDuty Agent";
const COMPANY_SUMMARY =
  "AI-powered 24/7 web agents for customer support today, with sales and multi-channel deployments on the near-term roadmap.";

export default function TryPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([STARTER_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  useEffect(() => {
    if (!inputRef.current) return;
    const el = inputRef.current;
    el.style.height = "auto";
    const maxHeight = 4 * 24;
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
  }, [input]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: input.trim() };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);
    setError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    try {
      const response = await fetch("/api/onduty-try", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
        signal: controller.signal,
      });

      const data = await response.json();

      if (!response.ok || !data?.reply) {
        throw new Error("Failed to fetch reply");
      }

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: data.reply,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error(err);
      if (err?.name === "AbortError") {
        setError("The agent is taking too long to reply. Please try again.");
      } else {
        setError("Our agent had trouble replying. Please try again.");
      }
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  return (
    <main className="mx-auto -mt-6 flex min-h-screen max-w-5xl flex-col px-6 pb-8 pt-2">
      <header className="rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 px-3 py-2 text-white shadow-lg md:py-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-200">Try OnDuty</p>
            <h1 className="mt-1 text-2xl font-semibold">Talk with our agent</h1>
            <p className="mt-1 text-xs text-slate-200">{COMPANY_NAME}</p>
          </div>
        </div>
      </header>

      <section className="mt-4 grid flex-1 gap-4 lg:h-[calc(100vh-200px)] lg:grid-cols-3">
        <div className="flex min-h-[60vh] flex-col rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur lg:col-span-2 lg:h-full">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Live chat</p>
              <h2 className="text-lg font-semibold text-slate-900">{AGENT_NAME}</h2>
              <p className="text-sm text-slate-600">{COMPANY_NAME}</p>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">Online</span>
          </div>

          <div
            ref={scrollRef}
            className="mt-4 flex-1 min-h-[18rem] overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
          >
            <div className="flex min-h-full flex-col justify-end gap-3">
              {messages.map((message, idx) => (
                <div
                  key={`${message.role}-${idx}`}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                      message.role === "user"
                        ? "bg-slate-900 text-white"
                        : "bg-white text-slate-900 ring-1 ring-slate-200"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs text-slate-600 ring-1 ring-slate-200">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
                    Thinking...
                  </div>
                </div>
              )}
            </div>
          </div>

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

          <form
            onSubmit={handleSubmit}
            className="mt-3 flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm"
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the agent about OnDuty"
              rows={1}
              className="min-h-[2.75rem] max-h-24 flex-1 resize-none overflow-y-auto rounded-xl border border-slate-200 px-3 py-2 text-sm leading-6 focus:border-slate-400 focus:outline-none"
              disabled={isLoading}
            />
            <PrimaryButton type="submit" disabled={isLoading || !input.trim()}>
              {isLoading ? "Sending..." : "Send"}
            </PrimaryButton>
          </form>
        </div>

        <aside className="flex min-h-[60vh] flex-col rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur lg:h-full">
          <h3 className="text-sm font-semibold text-slate-900">About this agent</h3>
          <dl className="mt-3 space-y-2 text-xs text-slate-700">
            <div>
              <dt className="text-slate-500">Company</dt>
              <dd className="font-medium">{COMPANY_NAME}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Website</dt>
              <dd>
                <a
                  href={COMPANY_WEBSITE}
                  className="font-medium text-blue-600 hover:text-blue-700"
                  target="_blank"
                  rel="noreferrer"
                >
                  {COMPANY_WEBSITE}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Agent name</dt>
              <dd className="font-medium">{AGENT_NAME}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Company summary</dt>
              <dd className="font-medium">{COMPANY_SUMMARY}</dd>
            </div>
          </dl>
        </aside>
      </section>
    </main>
  );
}
