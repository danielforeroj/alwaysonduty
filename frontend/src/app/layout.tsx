import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "OnDuty",
  description: "Always-on AI agents for your business",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50">
        <header className="border-b bg-white shadow-sm">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
            <Link href="/" className="text-lg font-semibold">OnDuty</Link>
            <nav className="flex gap-4 text-sm">
              <Link href="/try" className="text-slate-700 hover:text-slate-900">Try</Link>
              <Link href="/signup" className="text-slate-700 hover:text-slate-900">Sign up</Link>
              <Link href="/login" className="text-slate-700 hover:text-slate-900">Login</Link>
              <Link href="/dashboard" className="text-slate-700 hover:text-slate-900">Dashboard</Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
