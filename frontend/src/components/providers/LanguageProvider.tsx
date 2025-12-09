"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type SupportedLanguage = "en" | "es";

interface LanguageContextValue {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>("en");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("onduty_language") as SupportedLanguage | null;
    if (stored === "en" || stored === "es") {
      setLanguageState(stored);
      return;
    }

    const browserLang = navigator.language || (navigator.languages ? navigator.languages[0] : "en");
    setLanguageState(browserLang.toLowerCase().startsWith("es") ? "es" : "en");
  }, []);

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem("onduty_language", lang);
  }, []);

  const toggleLanguage = useCallback(() => {
    const nextLanguage: SupportedLanguage = language === "en" ? "es" : "en";
    setLanguage(nextLanguage);
  }, [language, setLanguage]);

  const value = useMemo(
    () => ({ language, setLanguage, toggleLanguage }),
    [language, setLanguage, toggleLanguage],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}

