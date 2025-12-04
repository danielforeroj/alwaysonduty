import Link from "next/link";

const useCases = [
  {
    title: "Hotels & rentals",
    description: "Automate bookings, check-in questions, and upsell late checkout.",
    icon: "🏨",
  },
  {
    title: "Clinics & dentists",
    description: "Answer FAQs, manage inquiries, and reduce no-shows.",
    icon: "🦷",
  },
  {
    title: "Restaurants",
    description: "Handle reservations, menus, and common questions in seconds.",
    icon: "🍽️",
  },
  {
    title: "Real estate",
    description: "Qualify leads, schedule viewings, and follow up automatically.",
    icon: "🏠",
  },
  {
    title: "Politicians & public figures",
    description: "Filter support requests and share key updates at scale.",
    icon: "📢",
  },
  {
    title: "Telecom & ISPs",
    description: "Triage support tickets before they hit your human team.",
    icon: "📡",
  },
];

const steps = [
  {
    title: "Connect your channels",
    description: "Start with a hosted web chat and later plug in WhatsApp, Telegram, or your own domain.",
  },
  {
    title: "Train your agents",
    description: "Upload FAQs, policies, and playbooks. OnDuty learns your tone and workflows.",
  },
  {
    title: "Go always-on",
    description: "Let your sales and CS agents handle conversations 24/7 and escalate when needed.",
  },
];

const pricing = [
  { title: "Starter", copy: "Hosted web chat, CS agent, basic analytics." },
  { title: "Growth", copy: "Sales + CS agent, more analytics, more seats." },
  { title: "Premium", copy: "Channel integrations, advanced analytics." },
];

export default function LandingPage() {
  return (
    <div className="space-y-24">
      {/* Hero */}
      <section
        id="product"
        className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-b from-slate-900 via-slate-900 to-sky-100 shadow-2xl"
      >
        <div className="absolute inset-0">
          <div className="absolute -left-10 top-10 h-48 w-48 rounded-full bg-blue-400/30 blur-3xl" />
          <div className="absolute bottom-10 right-4 h-64 w-64 rounded-full bg-sky-200/40 blur-3xl" />
        </div>
        <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-16 text-white md:grid-cols-2 md:py-20 lg:px-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-100">
              always-on ai agents
            </div>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl sm:leading-tight">
              AI sales & support that never clock out.
            </h1>
            <p className="max-w-2xl text-lg text-slate-100/90">
              OnDuty connects to your web, WhatsApp, and Telegram channels to handle leads, bookings, and customer
              questions 24/7—without adding headcount.
            </p>
            <div className="flex flex-wrap gap-3 text-sm font-semibold">
              <Link
                href="/try"
                className="rounded-full bg-white px-5 py-3 text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                Try our agent
              </Link>
              <Link
                href="/signup"
                className="rounded-full border border-white/50 px-5 py-3 text-white transition hover:border-white hover:bg-white/10"
              >
                Sign up for free
              </Link>
              <a
                href="#use-cases"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 underline-offset-4 hover:text-white"
              >
                See use cases
              </a>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-white/80">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">⚡ 30s setup</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">🔒 Tenant isolated</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">🧠 AI-driven</span>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/95 p-6 text-slate-900 shadow-2xl backdrop-blur-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500">OnDuty Dashboard</p>
                  <p className="text-lg font-semibold text-slate-900">Live engagement</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Online</span>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 shadow-sm">
                  <p className="text-xs text-slate-500">Leads captured</p>
                  <p className="text-xl font-bold text-slate-900">482</p>
                  <p className="text-xs text-emerald-600">+18% this week</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 shadow-sm">
                  <p className="text-xs text-slate-500">Conversations</p>
                  <p className="text-xl font-bold text-slate-900">1,274</p>
                  <p className="text-xs text-emerald-600">AI handled 92%</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 shadow-sm">
                  <p className="text-xs text-slate-500">Avg. response</p>
                  <p className="text-xl font-bold text-slate-900">1.8s</p>
                  <p className="text-xs text-slate-600">24/7 coverage</p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white">AI</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Agent Nova</p>
                    <p className="text-xs text-slate-500">Realtime responses</p>
                  </div>
                </div>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 text-lg">💬</span>
                    <p className="rounded-2xl bg-slate-50 px-4 py-3 text-slate-800 shadow-sm">
                      We need a last-minute booking for tomorrow night. Can you help?
                    </p>
                  </div>
                  <div className="ml-auto flex max-w-[85%] items-start gap-3">
                    <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-slate-900 shadow-sm">
                      Absolutely! I can reserve a queen suite for tomorrow with late check-in. Should I confirm under your
                      name?
                    </p>
                    <span className="mt-0.5 text-lg">🤖</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section id="use-cases" className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-3xl font-semibold text-slate-900">Built for teams who can’t afford to miss a message.</h2>
          <p className="text-lg text-slate-600">Responsive, omnichannel AI that keeps revenue opportunities moving.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {useCases.map((item) => (
            <div
              key={item.title}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
              </div>
              <p className="mt-3 text-sm text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="space-y-8" aria-labelledby="how-it-works">
        <div className="space-y-2">
          <h2 id="how-it-works" className="text-3xl font-semibold text-slate-900">
            How OnDuty works
          </h2>
          <p className="text-lg text-slate-600">Three simple steps to go live with AI-backed sales and support.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                {index + 1}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing teaser */}
      <section id="pricing" className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold text-slate-900">Simple plans to get started fast</h2>
          <p className="text-lg text-slate-600">Start free with a trial. Upgrade only when you’re ready.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {pricing.map((tier) => (
            <div key={tier.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">{tier.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{tier.copy}</p>
              <Link
                href="/signup"
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-black"
              >
                Sign up for free
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 pt-8 text-sm text-slate-600">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} OnDuty. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-slate-900">
              Privacy
            </Link>
            <Link href="#" className="hover:text-slate-900">
              Terms
            </Link>
            <Link href="#" className="hover:text-slate-900">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
