"use client";

import Link from "next/link";

export default function SuperAdminConversationsPlaceholder() {
  return (
    <div className="space-y-4 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Conversations</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Platform-wide conversation insights will appear here.
          </p>
        </div>
        <Link
          href="/super-admin/overview"
          className="text-sm text-blue-600 hover:underline dark:text-blue-300"
        >
          ← Back to overview
        </Link>
      </div>
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
        Conversation-level analytics are coming soon. In the meantime, you can review activity from tenants,
        users, and agents via their respective pages.
      </div>
    </div>
  );
}
