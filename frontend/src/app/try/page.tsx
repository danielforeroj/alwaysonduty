"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

import { PrimaryButton } from "@/components/common/Buttons";
import { SectionHeading } from "@/components/common/SectionHeading";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const STARTER_MESSAGE: ChatMessage = {
  role: "assistant",
  content:
    "Hi, I’m OnDuty’s demo agent. Ask me anything about OnDuty, our platform, and how we can run 24/7 sales & support for you.",
};

export default function TryPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([STARTER_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: input.trim() };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/onduty-try", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
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
    } catch (err) {
      console.error(err);
      setError("Our demo agent had trouble replying. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-white/90 p-8 shadow-sm ring-1 ring-slate-200">
        <SectionHeading eyebrow="Try OnDuty" title="Talk with our demo agent" />
        <p className="mt-2 text-base text-slate-600">
          Ask anything about OnDuty’s platform, use cases, roadmap, or how we onboard new businesses.
        </p>
      </div>

      <div className="rounded-3xl bg-white/95 p-6 shadow-sm ring-1 ring-slate-200">
        <div
          ref={scrollRef}
          className="mb-4 h-72 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
        >
          <div className="flex min-h-full flex-col justify-end gap-3">
            {messages.map((message, idx) => (
              <div key={`${message.role}-${idx}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
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

        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

        <form onSubmit={handleSubmit} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the demo agent about OnDuty"
            className="min-h-[3rem] flex-1 resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
            disabled={isLoading}
          />
          <PrimaryButton type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? "Sending..." : "Send"}
          </PrimaryButton>
        </form>
      </div>
    </div>
  );
}
