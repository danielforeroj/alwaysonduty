import "./globals.css";
import NavBar from "../components/NavBar";

export const metadata = {
  title: "OnDuty",
  description: "Always-on AI agents for your business",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <NavBar />
        <main className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">{children}</main>
      </body>
    </html>
  );
}
