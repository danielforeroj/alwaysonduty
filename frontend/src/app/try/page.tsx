import PublicAgentChat from "@/components/agents/PublicAgentChat";

const COMPANY_NAME = "OnDuty";
const COMPANY_WEBSITE = "https://alwaysonduty.ai";
const AGENT_NAME = "OnDuty Agent";
const COMPANY_SUMMARY =
  "AI-powered 24/7 web agents for customer support today, with sales and multi-channel deployments on the near-term roadmap.";

const DEMO_TENANT_SLUG = process.env.NEXT_PUBLIC_DEMO_TENANT_SLUG || "onduty-demo";
const DEMO_AGENT_SLUG = process.env.NEXT_PUBLIC_DEMO_AGENT_SLUG;

export default function TryPage() {
  return (
    <main className="mx-auto -mt-6 flex min-h-screen max-w-5xl flex-col px-6 pb-8 pt-2">
      <header className="rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 px-3 py-2 text-white shadow-lg md:py-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-200">Try OnDuty</p>
            <h1 className="mt-1 text-2xl font-semibold">Talk with our agent</h1>
            <p className="mt-1 text-xs text-slate-200">{COMPANY_NAME}</p>
          </div>
        </div>
      </header>

      <section className="mt-4 grid flex-1 gap-4 lg:h-[calc(100vh-200px)] lg:grid-cols-3">
        <div className="flex min-h-[60vh] flex-col rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur lg:col-span-2 lg:h-full">
          <PublicAgentChat
            agentSlug={DEMO_AGENT_SLUG || undefined}
            tenantSlug={DEMO_TENANT_SLUG}
            agentName={AGENT_NAME}
            companyName={COMPANY_NAME}
            source="try_demo"
          />
        </div>

        <aside className="flex min-h-[60vh] flex-col rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur lg:h-full">
          <h3 className="text-sm font-semibold text-slate-900">About this agent</h3>
          <dl className="mt-3 space-y-2 text-xs text-slate-700">
            <div>
              <dt className="text-slate-500">Company</dt>
              <dd className="font-medium">{COMPANY_NAME}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Website</dt>
              <dd>
                <a
                  href={COMPANY_WEBSITE}
                  className="font-medium text-blue-600 hover:text-blue-700"
                  target="_blank"
                  rel="noreferrer"
                >
                  {COMPANY_WEBSITE}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Agent name</dt>
              <dd className="font-medium">{AGENT_NAME}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Company summary</dt>
              <dd className="font-medium">{COMPANY_SUMMARY}</dd>
            </div>
          </dl>
        </aside>
      </section>
    </main>
  );
}
