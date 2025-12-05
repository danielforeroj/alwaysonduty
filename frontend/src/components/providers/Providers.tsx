"use client";

import { type ReactNode } from "react";
import { LanguageProvider } from "./LanguageProvider";
import { ThemeProvider } from "./ThemeProvider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>{children}</LanguageProvider>
    </ThemeProvider>
  );
}

