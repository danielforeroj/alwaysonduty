"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "./providers/LanguageProvider";
import { useTheme } from "./providers/ThemeProvider";
import { PrimaryButton, SecondaryButton } from "./Buttons";
import { useAuth } from "./providers/AuthProvider";
import { useCopy } from "../lib/copy";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const { language, setLanguage, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { token, logout } = useAuth();
  const t = useCopy();
  const pathname = usePathname();

  const knownRoutes = useMemo(
    () =>
      new Set([
        "", // home
        "agents",
        "dashboard",
        "login",
        "signup",
        "use-cases",
        "pricing",
        "billing",
        "users",
        "settings",
      ]),
    [],
  );

  const segments = useMemo(() => pathname?.split("/").filter(Boolean) ?? [], [pathname]);
  const isPublicAgentPage = useMemo(() => {
    if (!pathname) return false;
    if (pathname.startsWith("/live/")) return true;
    if (segments.length === 1) {
      return !knownRoutes.has(segments[0]);
    }
    return false;
  }, [pathname, segments, knownRoutes]);

  const navLinks = useMemo(
    () => [
      { href: "#features", label: t.nav.features },
      { href: "/use-cases", label: t.nav.useCases },
      { href: "#pricing", label: t.nav.pricing },
    ],
    [t.nav.features, t.nav.pricing, t.nav.useCases],
  );

  const handleLanguageToggle = () => {
    toggleLanguage();
  };

  if (isPublicAgentPage) {
    return (
      <header className="sticky top-0 z-30 border-b border-white/10 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="rounded-full bg-onDutyNavy px-2.5 py-0.5 text-xs font-semibold text-white shadow-md transition hover:shadow-lg dark:bg-onDutyWine"
          >
            OnDuty
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden text-xs font-medium text-slate-700 underline-offset-4 transition hover:text-onDutyNavy hover:underline dark:text-slate-200 dark:hover:text-onDutyGold sm:inline-flex"
            >
              {t.publicAgent.cta}
            </Link>
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
              <button
                onClick={handleLanguageToggle}
                className={`rounded-full px-2 py-1 transition ${language === "en" ? "bg-onDutyGold/80 text-onDutyNavy" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                aria-label="Toggle language"
              >
                EN
              </button>
              <span className="text-slate-400">|</span>
              <button
                onClick={handleLanguageToggle}
                className={`rounded-full px-2 py-1 transition ${language === "es" ? "bg-onDutyGold/80 text-onDutyNavy" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                aria-label="Cambiar idioma"
              >
                ES
              </button>
            </div>
            <button
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:border-onDutyNavy hover:text-onDutyNavy dark:border-slate-800 dark:text-slate-200 dark:hover:border-onDutyGold dark:hover:text-onDutyGold"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M21.64 13a1 1 0 0 0-1.05-.14 8 8 0 0 1-10.45-10.45 1 1 0 0 0-.14-1.05A1 1 0 0 0 9 1a10 10 0 1 0 14 14 1 1 0 0 0-1.36-2Z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78 5.64 18.36M18.36 5.64 19.78 4.22" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full bg-onDutyNavy px-3 py-1 text-sm font-semibold text-white shadow-md transition hover:shadow-lg dark:bg-onDutyWine"
        >
          OnDuty
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-700 dark:text-slate-200 md:flex">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} className="transition hover:text-onDutyNavy dark:hover:text-onDutyGold">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
            <button
              onClick={handleLanguageToggle}
              className={`rounded-full px-2 py-1 transition ${language === "en" ? "bg-onDutyGold/80 text-onDutyNavy" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
              aria-label="Toggle language"
            >
              EN
            </button>
            <span className="text-slate-400">|</span>
            <button
              onClick={handleLanguageToggle}
              className={`rounded-full px-2 py-1 transition ${language === "es" ? "bg-onDutyGold/80 text-onDutyNavy" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
            >
              ES
            </button>
          </div>

          <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:border-onDutyNavy hover:text-onDutyNavy dark:border-slate-800 dark:text-slate-200 dark:hover:border-onDutyGold dark:hover:text-onDutyGold"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M21.64 13a1 1 0 0 0-1.05-.14 8 8 0 0 1-10.45-10.45 1 1 0 0 0-.14-1.05A1 1 0 0 0 9 1a10 10 0 1 0 14 14 1 1 0 0 0-1.36-2Z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78 5.64 18.36M18.36 5.64 19.78 4.22" />
              </svg>
            )}
          </button>

          {!token && (
            <>
              <SecondaryButton href="/login">{t.nav.login}</SecondaryButton>
              <PrimaryButton href="/signup" className="hidden lg:inline-flex">
                {t.nav.signup}
              </PrimaryButton>
            </>
          )}
          {token && (
            <>
              <SecondaryButton href="/dashboard">Dashboard</SecondaryButton>
              <SecondaryButton href="/agents">AI Agents</SecondaryButton>
              <PrimaryButton onClick={logout} className="hidden lg:inline-flex">
                Logout
              </PrimaryButton>
            </>
          )}
        </div>

        <button
          className="inline-flex items-center justify-center rounded-full border border-slate-300 p-2 text-slate-700 transition hover:border-slate-400 hover:bg-white dark:border-slate-800 dark:text-slate-100 dark:hover:bg-slate-900 md:hidden"
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
        <div className="border-t border-slate-200 bg-white px-4 pb-4 pt-2 shadow-sm dark:border-slate-800 dark:bg-slate-950 md:hidden">
          <div className="flex flex-col gap-3 text-sm font-medium text-slate-700 dark:text-slate-200">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-lg px-2 py-2 transition hover:bg-slate-100 dark:hover:bg-slate-900"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
              <button
                onClick={() => {
                  setLanguage("en");
                }}
                className={`rounded-full px-2 py-1 transition ${language === "en" ? "bg-onDutyGold/80 text-onDutyNavy" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
              >
                EN
              </button>
              <span className="text-slate-400">|</span>
              <button
                onClick={() => {
                  setLanguage("es");
                }}
                className={`rounded-full px-2 py-1 transition ${language === "es" ? "bg-onDutyGold/80 text-onDutyNavy" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
              >
                ES
              </button>
            </div>
            <button
              onClick={toggleTheme}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-left transition hover:border-onDutyNavy hover:bg-slate-50 dark:border-slate-800 dark:hover:border-onDutyGold dark:hover:bg-slate-900"
            >
              <span>{theme === "dark" ? "Dark" : "Light"} mode</span>
            </button>
            {!token && (
              <>
                <SecondaryButton href="/login" className="justify-center">
                  {t.nav.login}
                </SecondaryButton>
                <PrimaryButton href="/signup" className="justify-center">
                  {t.nav.signup}
                </PrimaryButton>
              </>
            )}
            {token && (
              <>
                <SecondaryButton href="/dashboard" className="justify-center">
                  Dashboard
                </SecondaryButton>
                <SecondaryButton href="/agents" className="justify-center">
                  AI Agents
                </SecondaryButton>
                <PrimaryButton onClick={logout} className="justify-center">
                  Logout
                </PrimaryButton>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

