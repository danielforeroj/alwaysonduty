import { NextResponse } from "next/server";

import { ONDUTY_SYSTEM_PROMPT } from "@/lib/ondutyPrompt";

type IncomingMessage = {
  role: "user" | "assistant";
  content: string;
};

type GroqChoice = {
  message?: {
    content?: string;
  };
};

type GroqResponse = {
  choices?: GroqChoice[];
};

export async function POST(request: Request) {
  const groqApiKey = process.env.GROQ_API_KEY;

  if (!groqApiKey) {
    return NextResponse.json(
      { error: "GROQ_API_KEY is not configured" },
      { status: 500 }
    );
  }

  const body = await request.json();
  const messages: IncomingMessage[] = Array.isArray(body?.messages)
    ? body.messages
    : [];

  const groqMessages = [
    {
      role: "system",
      content: ONDUTY_SYSTEM_PROMPT,
    },
    ...messages,
  ];

  try {
    const groqRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: groqMessages,
        }),
      }
    );

    if (!groqRes.ok) {
      const errorText = await groqRes.text();
      console.error("Groq API error", errorText);
      return NextResponse.json(
        { error: "The demo agent is unavailable right now. Please try again." },
        { status: 502 }
      );
    }

    const data = (await groqRes.json()) as GroqResponse;
    const reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
      return NextResponse.json(
        { error: "The demo agent did not return a reply." },
        { status: 502 }
      );
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Groq API request failed", error);
    return NextResponse.json(
      { error: "The demo agent encountered an error. Please try again." },
      { status: 500 }
    );
  }
}
