import "./globals.css";
import NavBar from "../components/NavBar";
import Providers from "../components/providers/Providers";

export const metadata = {
  title: "OnDuty",
  description: "Always-on AI agents for your business",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased transition-colors dark:bg-slate-950 dark:text-slate-50">
        <Providers>
          <NavBar />
          <main className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
