"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";

const navItems = [
  { href: "/super-admin/overview", label: "Overview" },
  { href: "/super-admin/tenants", label: "Tenants" },
  { href: "/super-admin/users", label: "Users" },
  { href: "/super-admin/chat-users", label: "Chat Users" },
  { href: "/super-admin/agents", label: "Agents" },
];

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const publicPaths = [
    "/super-admin",
    "/super-admin/forgot-password",
    "/super-admin/reset-password",
  ];

  const isPublicPath = publicPaths.some((path) => pathname?.startsWith(path));

  useEffect(() => {
    if (loading || isPublicPath) return;
    if (!token || user?.role !== "SUPER_ADMIN") {
      router.replace("/super-admin");
    }
  }, [isPublicPath, loading, pathname, router, token, user?.role]);

  const showNav = user?.role === "SUPER_ADMIN" && token && !isPublicPath;

  if (!showNav) {
    return <>{children}</>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-[220px_1fr]">
      <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-50">Super Admin</h2>
        <nav className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
          {navItems.map((item) => {
            const active = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-lg px-3 py-2 ${
                  active
                    ? "bg-blue-600 text-white shadow-sm"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
