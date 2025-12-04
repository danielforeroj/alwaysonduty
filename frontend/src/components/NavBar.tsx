"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "#product", label: "Product" },
  { href: "#use-cases", label: "Use cases" },
  { href: "#pricing", label: "Pricing" },
  { href: "#", label: "Docs" },
];

export function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-semibold text-slate-900 dark:text-white">
          OnDuty
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-700 dark:text-slate-200 md:flex">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} className="transition hover:text-slate-900 dark:hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-black"
          >
            Sign up for free
          </Link>
        </div>

        <button
          className="inline-flex items-center justify-center rounded-full border border-slate-300 p-2 text-slate-700 transition hover:border-slate-400 hover:bg-white md:hidden"
          aria-label="Toggle navigation"
          onClick={() => setOpen((prev) => !prev)}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 pb-4 pt-2 shadow-sm md:hidden">
          <div className="flex flex-col gap-3 text-sm font-medium text-slate-700">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-lg px-2 py-2 transition hover:bg-slate-100"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-1 flex flex-col gap-2">
              <Link
                href="/login"
                className="rounded-full border border-slate-300 px-3 py-2 text-center text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                onClick={() => setOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-slate-900 px-3 py-2 text-center text-sm font-semibold text-white shadow-lg transition hover:bg-black"
                onClick={() => setOpen(false)}
              >
                Sign up for free
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default NavBar;
