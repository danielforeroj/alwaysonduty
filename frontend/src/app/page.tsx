import Link from "next/link";

const useCases = ["Hotels", "Clinics", "Restaurants", "Real Estate", "Politicians", "Telecom"];

export default function LandingPage() {
  return (
    <div className="space-y-16">
      <section className="grid gap-8 rounded-2xl bg-white p-10 shadow-sm md:grid-cols-2">
        <div className="space-y-6">
          <p className="text-sm font-semibold text-blue-600">Always on</p>
          <h1 className="text-4xl font-bold text-slate-900">OnDuty AI agents always on.</h1>
          <p className="text-lg text-slate-600">
            A multi-tenant customer service and sales copilot that responds instantly and learns from every
            conversation.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/try" className="rounded-lg bg-blue-600 px-5 py-3 text-white shadow hover:bg-blue-700">
              Try our agent
            </Link>
            <Link href="/signup" className="rounded-lg bg-slate-900 px-5 py-3 text-white shadow hover:bg-black">
              Sign up for free
            </Link>
            <a href="#use-cases" className="rounded-lg border border-slate-300 px-5 py-3 text-slate-800 hover:border-slate-400">
              See use cases
            </a>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="w-full rounded-xl bg-slate-900 p-6 text-white shadow-lg">
            <p className="text-sm uppercase tracking-wide text-slate-300">Live 24/7</p>
            <p className="mt-2 text-lg font-semibold">Your AI team member never sleeps.</p>
            <p className="mt-4 text-sm text-slate-200">
              Launch a web chat, plug in channels, and keep customers engaged with automatic answers and summaries.
            </p>
          </div>
        </div>
      </section>

      <section id="use-cases" className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Use cases</h2>
          <p className="text-slate-600">Built for frontline teams and revenue owners.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {useCases.map((name) => (
            <div key={name} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">{name}</h3>
              <p className="text-sm text-slate-600">Automate replies, qualify leads, and escalate when needed.</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-white p-10 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Pricing</h2>
        <p className="mt-2 text-slate-600">Starter / Growth / Premium. Pay for value, not seats.</p>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {["Starter", "Growth", "Premium"].map((tier) => (
            <div key={tier} className="rounded-xl border border-slate-200 p-6 text-center shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">{tier}</h3>
              <p className="mt-2 text-sm text-slate-600">Simple pricing to get you live fast.</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
