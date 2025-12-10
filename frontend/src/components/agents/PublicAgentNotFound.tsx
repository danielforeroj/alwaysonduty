"use client";

import { useCopy } from "@/lib/copy";

export default function PublicAgentNotFound() {
  const t = useCopy().publicAgent;

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold">{t.notFoundTitle}</h1>
      <p className="mt-2 text-gray-600">{t.notFoundBody}</p>
    </main>
  );
}
