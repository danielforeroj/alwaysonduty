"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PrimaryButton, SecondaryButton } from "@/components/Buttons";
import { useAuth } from "@/components/providers/AuthProvider";
import { COUNTRY_OPTIONS, REGION_OPTIONS, type RegionId } from "@/constants/locations";
import {
  Agent,
  AgentType,
  AllowedWebsite,
  CustomerProfile,
  CustomerSegment,
  DataProfile,
  JobAndCompanyProfile,
  KnowledgeDocumentMetadata,
} from "@/types/agent";
import {
  createAgent,
  deleteAgentDocument,
  fetchAgentDocuments,
  updateAgent,
  uploadAgentDocument,
} from "@/lib/agentsApi";

export type Mode = "create" | "edit";

export interface AgentWizardProps {
  mode: Mode;
  initialAgent?: Agent | null;
}

type Step = 1 | 2 | 3 | 4 | 5;

const defaultJobAndCompany = (): JobAndCompanyProfile => ({
  agent_name: "OnDuty Assistant",
  primary_goal: "reduce_support_load",
  primary_goal_other: "",
  success_metrics: [],
  success_metrics_other: "",
  environment_primary: "web_widget",
  environment_future: [],
  allowed_actions: [],
  escalation_rules: "",
  hard_constraints: "",
  company_name: "",
  company_website: "",
  industry: "",
  short_description: "",
  mission: "",
  vision: "",
});

const defaultCustomerProfile = (): CustomerProfile => ({
  target_segments: [],
  regions: [],
  countries: [],
  languages: [],
  tone_style: "professional_friendly",
  tone_notes: "",
  typical_intents: [],
  typical_intents_other: "",
  cultural_dos: "",
  cultural_donts: "",
});

const defaultDataProfile = (): DataProfile => ({
  strategy_notes: "",
  authoritative_doc_ids: [],
  out_of_date_notes: "",
});

const defaultAllowedWebsite = (): AllowedWebsite => ({
  url: "",
  label: "",
  trust_level: "reference_only",
});

export function AgentWizard({ mode, initialAgent }: AgentWizardProps) {
  const router = useRouter();
  const { token, logout, tenant } = useAuth();

  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [name, setName] = useState("OnDuty Assistant");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState<Agent["status"]>("draft");
  const [agentType, setAgentType] = useState<AgentType>("customer_service");

  const [jobProfile, setJobProfile] = useState<JobAndCompanyProfile>(defaultJobAndCompany());
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile>(defaultCustomerProfile());
  const [regions, setRegions] = useState<RegionId[]>(
    initialAgent?.customer_profile?.regions ?? []
  );
  const [countries, setCountries] = useState<string[]>(
    initialAgent?.customer_profile?.countries ?? []
  );
  const [dataProfile, setDataProfile] = useState<DataProfile | null>(defaultDataProfile());
  const [allowedWebsites, setAllowedWebsites] = useState<AllowedWebsite[] | null>(null);

  const [documents, setDocuments] = useState<KnowledgeDocumentMetadata[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [docError, setDocError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const planDisplayLabel = (() => {
    const labelMap: Record<string, string> = {
      starter: "Basic",
      growth: "Growth",
      premium: "Premium",
    };
    if (tenant?.plan_type && labelMap[tenant.plan_type]) {
      return labelMap[tenant.plan_type];
    }
    return "Growth";
  })();

  useEffect(() => {
    if (initialAgent) {
      setName(initialAgent.name);
      setSlug(initialAgent.slug);
      setStatus(initialAgent.status);
      setAgentType(initialAgent.agent_type ?? "customer_service");
      setJobProfile({
        ...defaultJobAndCompany(),
        ...initialAgent.job_and_company_profile,
      });
      setCustomerProfile({
        ...defaultCustomerProfile(),
        ...initialAgent.customer_profile,
      });
      setRegions(initialAgent.customer_profile.regions ?? []);
      setCountries(initialAgent.customer_profile.countries ?? []);
      setDataProfile(initialAgent.data_profile ?? defaultDataProfile());
      setAllowedWebsites(initialAgent.allowed_websites ?? null);
    }
  }, [initialAgent]);

  useEffect(() => {
    const loadDocuments = async () => {
      if (!token || mode !== "edit" || !initialAgent?.id) return;
      setLoadingDocs(true);
      try {
        const docs = await fetchAgentDocuments(token, initialAgent.id);
        setDocuments(docs);
        setDocError(null);
      } catch (err: any) {
        if (err?.message === "unauthorized") {
          logout();
          router.push("/login");
          return;
        }
        setDocError("Unable to load documents right now.");
      } finally {
        setLoadingDocs(false);
      }
    };
    loadDocuments();
  }, [token, mode, initialAgent?.id, logout, router]);

  const availableCountries = COUNTRY_OPTIONS.filter((c) =>
    regions.includes(c.region)
  );

  const handleToggleRegion = (regionId: RegionId) => {
    setRegions((prev) => {
      const exists = prev.includes(regionId);
      const next = exists ? prev.filter((r) => r !== regionId) : [...prev, regionId];

      const allowedNames = COUNTRY_OPTIONS.filter((c) =>
        next.includes(c.region)
      ).map((c) => c.name);

      setCountries((prevCountries) =>
        prevCountries.filter((name) => allowedNames.includes(name))
      );

      return next;
    });
  };

  const handleToggleCountry = (countryName: string) => {
    setCountries((prev) =>
      prev.includes(countryName)
        ? prev.filter((c) => c !== countryName)
        : [...prev, countryName]
    );
  };

  const handleAddSegment = () => {
    setCustomerProfile((prev) => ({
      ...prev,
      target_segments: [...prev.target_segments, { name: "", description: "" }],
    }));
  };

  const handleSegmentChange = (index: number, field: keyof CustomerSegment, value: string) => {
    setCustomerProfile((prev) => {
      const next = [...prev.target_segments];
      next[index] = { ...next[index], [field]: value } as CustomerSegment;
      return { ...prev, target_segments: next };
    });
  };

  const handleRemoveSegment = (index: number) => {
    setCustomerProfile((prev) => {
      const next = [...prev.target_segments];
      next.splice(index, 1);
      return { ...prev, target_segments: next };
    });
  };

  const handleAddWebsite = () => {
    setAllowedWebsites((prev) => [...(prev ?? []), defaultAllowedWebsite()]);
  };

  const handleWebsiteChange = (index: number, field: keyof AllowedWebsite, value: string) => {
    setAllowedWebsites((prev) => {
      const list = [...(prev ?? [])];
      list[index] = { ...list[index], [field]: value } as AllowedWebsite;
      return list;
    });
  };

  const handleRemoveWebsite = (index: number) => {
    setAllowedWebsites((prev) => {
      const list = [...(prev ?? [])];
      list.splice(index, 1);
      return list.length ? list : null;
    });
  };

  const validateStep1 = () => {
    if (!name.trim() || !jobProfile.company_name.trim() || !jobProfile.primary_goal) {
      setError("Please provide an agent name, company name, and primary goal.");
      return false;
    }
    setError(null);
    return true;
  };

  const validateStep2 = () => {
    if (!customerProfile.tone_style || (customerProfile.languages?.length ?? 0) === 0) {
      setError("Add at least one language and choose a tone style.");
      return false;
    }
    setError(null);
    return true;
  };

  const goToNextStep = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    setCurrentStep((prev) => (prev < 5 ? ((prev + 1) as Step) : prev));
  };

  const skipOptional = () => {
    setCurrentStep((prev) => (prev < 5 ? ((prev + 1) as Step) : prev));
  };

  const goBack = () => {
    setCurrentStep((prev) => (prev > 1 ? ((prev - 1) as Step) : prev));
  };

  const handleSubmit = async () => {
    if (!token) {
      router.push("/login");
      return;
    }
    setSaving(true);
    setSaveMessage(null);
    setError(null);

    const jobProfileForPayload: JobAndCompanyProfile = {
      ...jobProfile,
      environment_primary: "web_widget",
      environment_future: [],
    };

    const customerProfileState: CustomerProfile = {
      ...customerProfile,
      regions,
      countries,
    };

    const payload = {
      name,
      slug,
      status,
      agent_type: agentType,
      job_and_company_profile: jobProfileForPayload,
      customer_profile: customerProfileState,
      data_profile: dataProfile && dataProfile.strategy_notes === "" && (dataProfile.authoritative_doc_ids?.length ?? 0) === 0 && dataProfile.out_of_date_notes === "" ? null : dataProfile,
      allowed_websites: allowedWebsites && allowedWebsites.length > 0 ? allowedWebsites : null,
    };

    try {
      if (mode === "create") {
        const created = await createAgent(token, payload);
        setSaveMessage("Agent created! Redirecting...");
        router.push(`/agents/${created.id}`);
      } else if (mode === "edit" && initialAgent) {
        await updateAgent(token, initialAgent.id, payload);
        setSaveMessage("Changes saved!");
      }
    } catch (err: any) {
      if (err?.message === "unauthorized") {
        logout();
        router.push("/login");
        return;
      }
      setError("We couldn’t save your agent right now. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDocumentUpload = async (file: File) => {
    if (!token || !initialAgent?.id) return;
    setDocError(null);
    setLoadingDocs(true);
    try {
      const doc = await uploadAgentDocument(token, initialAgent.id, file);
      setDocuments((prev) => [doc, ...prev]);
      setDataProfile((prev) => ({ ...(prev || defaultDataProfile()), authoritative_doc_ids: [doc.id, ...(prev?.authoritative_doc_ids || [])] }));
    } catch (err: any) {
      if (err?.message === "unauthorized") {
        logout();
        router.push("/login");
        return;
      }
      setDocError("Upload failed. Please try again (max 10MB, pdf/docx/txt/md).");
    } finally {
      setLoadingDocs(false);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (!token || !initialAgent?.id) return;
    setLoadingDocs(true);
    try {
      await deleteAgentDocument(token, initialAgent.id, documentId);
      setDocuments((prev) => prev.filter((d) => d.id !== documentId));
      setDataProfile((prev) => ({
        ...(prev || defaultDataProfile()),
        authoritative_doc_ids: (prev?.authoritative_doc_ids || []).filter((id) => id !== documentId),
      }));
    } catch (err: any) {
      if (err?.message === "unauthorized") {
        logout();
        router.push("/login");
        return;
      }
      setDocError("Could not delete document. Please try again.");
    } finally {
      setLoadingDocs(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center gap-3 text-sm text-gray-500">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center gap-1">
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
              currentStep === step ? "bg-blue-600 text-white" : step < currentStep ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            {step}
          </div>
          <span className={`${currentStep === step ? "text-gray-900" : ""}`}>
            {step === 1 && "Company & Job"}
            {step === 2 && "Clients & Tone"}
            {step === 3 && "Data"}
            {step === 4 && "Allowed Websites"}
          </span>
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Know your company & job</h3>
        <p className="text-sm text-gray-500">
          Choose what kind of agent you’re creating and share the basics about your business.
        </p>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <h4 className="text-sm font-medium text-gray-900">Agent type</h4>
        <p className="mt-1 text-xs text-gray-500">
          Customer Service agents are available today. Sales agents are coming soon.
        </p>
        <div className="mt-3 flex flex-col gap-2 md:flex-row">
          <button
            type="button"
            onClick={() => setAgentType("customer_service")}
            className={`flex-1 rounded-lg border p-3 text-left text-sm transition ${
              agentType === "customer_service"
                ? "border-black bg-black text-white"
                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="font-medium">Customer Service</div>
            <div className="mt-1 text-xs text-gray-300 md:text-gray-200">
              Handle FAQs, resolve issues, and keep CSAT high around the clock.
            </div>
          </button>
          <button
            type="button"
            disabled
            className="relative flex-1 rounded-lg border border-dashed border-gray-200 bg-gray-50 p-3 text-left text-sm text-gray-400"
          >
            <div className="font-medium">Sales</div>
            <div className="mt-1 text-xs text-gray-500">Sales agents are coming soon.</div>
            <span className="mt-2 inline-flex items-center rounded-full bg-gray-200 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-gray-700">
              Coming soon
            </span>
            <span className="pointer-events-none absolute inset-0 rounded-lg" aria-hidden="true" />
          </button>
        </div>
      </div>

      {agentType === "customer_service" && (
        <section className="rounded-lg border bg-slate-50 p-4">
          <h4 className="text-sm font-semibold text-gray-900">Customer Service plan</h4>
          <p className="mt-1 text-xs text-gray-600">
            Your Customer Service plan was selected when your account was created. This is a reminder of your current coverage. Manage any changes from Billing.
          </p>
          <div className="mt-3 inline-flex items-center gap-3 rounded-lg bg-white px-4 py-3 shadow-sm">
            <div className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-gray-700">
              Current plan
            </div>
            <div className="text-sm font-semibold text-gray-900">{planDisplayLabel}</div>
            <p className="text-xs text-gray-600">Manage plan and billing from the Billing section.</p>
          </div>
        </section>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Agent name</label>
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setJobProfile((prev) => ({ ...prev, agent_name: e.target.value }));
          }}
          className="mt-1 w-full rounded-md border px-3 py-2"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Company name</label>
          <input
            value={jobProfile.company_name}
            onChange={(e) => setJobProfile({ ...jobProfile, company_name: e.target.value })}
            className="mt-1 w-full rounded-md border px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Company website</label>
          <input
            value={jobProfile.company_website || ""}
            onChange={(e) => setJobProfile({ ...jobProfile, company_website: e.target.value })}
            placeholder="https://example.com"
            className="mt-1 w-full rounded-md border px-3 py-2"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">Industry</label>
          <input
            value={jobProfile.industry || ""}
            onChange={(e) => setJobProfile({ ...jobProfile, industry: e.target.value })}
            className="mt-1 w-full rounded-md border px-3 py-2"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Mission</label>
          <textarea
            value={jobProfile.mission || ""}
            onChange={(e) => setJobProfile({ ...jobProfile, mission: e.target.value })}
            className="mt-1 w-full rounded-md border px-3 py-2"
            rows={3}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-gray-700">Vision</label>
          <textarea
            value={jobProfile.vision || ""}
            onChange={(e) => setJobProfile({ ...jobProfile, vision: e.target.value })}
            className="mt-1 w-full rounded-md border px-3 py-2"
            rows={3}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Short description</label>
        <textarea
          value={jobProfile.short_description || ""}
          onChange={(e) => setJobProfile({ ...jobProfile, short_description: e.target.value })}
          className="mt-1 w-full rounded-md border px-3 py-2"
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Primary goal</p>
        <div className="grid gap-2 md:grid-cols-2">
          {["reduce_support_load", "internal_assistant", "other"].map((goal) => (
            <label key={goal} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="primary_goal"
                value={goal}
                checked={jobProfile.primary_goal === goal}
                onChange={() => setJobProfile({ ...jobProfile, primary_goal: goal as JobAndCompanyProfile["primary_goal"] })}
              />
              <span className="capitalize">{goal.replace(/_/g, " ")}</span>
            </label>
          ))}
        </div>
        {jobProfile.primary_goal === "other" && (
          <input
            value={jobProfile.primary_goal_other || ""}
            onChange={(e) => setJobProfile({ ...jobProfile, primary_goal_other: e.target.value })}
            placeholder="Describe other goal"
            className="w-full rounded-md border px-3 py-2"
          />
        )}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Success metrics</p>
        <div className="grid gap-2 md:grid-cols-2">
          {["fewer_support_tickets", "more_calls_booked", "more_revenue_per_chat", "faster_response_times", "higher_csat", "other"].map((metric) => (
            <label key={metric} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={jobProfile.success_metrics.includes(metric as JobAndCompanyProfile["success_metrics"][number])}
                onChange={(e) => {
                  const exists = jobProfile.success_metrics.includes(metric as JobAndCompanyProfile["success_metrics"][number]);
                  const next = exists
                    ? jobProfile.success_metrics.filter((m) => m !== metric)
                    : [...jobProfile.success_metrics, metric as JobAndCompanyProfile["success_metrics"][number]];
                  setJobProfile({ ...jobProfile, success_metrics: next });
                }}
              />
              <span className="capitalize">{metric.replace(/_/g, " ")}</span>
            </label>
          ))}
        </div>
        {jobProfile.success_metrics.includes("other") && (
          <input
            value={jobProfile.success_metrics_other || ""}
            onChange={(e) => setJobProfile({ ...jobProfile, success_metrics_other: e.target.value })}
            placeholder="Describe other metric"
            className="w-full rounded-md border px-3 py-2"
          />
        )}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Environment</p>
        <p className="text-xs text-gray-500">
          For now, your agent will live in a web chat widget hosted by OnDuty. Additional channels are on the way.
        </p>
        <div className="flex flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2 rounded-full bg-black px-3 py-1 text-white">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>Web widget (current)</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-dashed border-gray-300 px-3 py-1 text-gray-400">
            <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
            <span>WhatsApp (coming soon)</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-dashed border-gray-300 px-3 py-1 text-gray-400">
            <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
            <span>Telegram (coming soon)</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-dashed border-gray-300 px-3 py-1 text-gray-400">
            <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
            <span>Email (coming soon)</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-dashed border-gray-300 px-3 py-1 text-gray-400">
            <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
            <span>Internal tools (coming soon)</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Allowed actions</p>
        <div className="grid gap-2 md:grid-cols-2">
          {["answer_faqs", "capture_leads", "book_appointments_light", "take_simple_orders", "route_to_human", "tag_conversations"].map((action) => (
            <label key={action} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={jobProfile.allowed_actions.includes(action as JobAndCompanyProfile["allowed_actions"][number])}
                onChange={() => {
                  const exists = jobProfile.allowed_actions.includes(action as JobAndCompanyProfile["allowed_actions"][number]);
                  const next = exists
                    ? jobProfile.allowed_actions.filter((a) => a !== action)
                    : [...jobProfile.allowed_actions, action as JobAndCompanyProfile["allowed_actions"][number]];
                  setJobProfile({ ...jobProfile, allowed_actions: next });
                }}
              />
              <span className="capitalize">{action.replace(/_/g, " ")}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Escalation rules</label>
          <textarea
            value={jobProfile.escalation_rules}
            onChange={(e) => setJobProfile({ ...jobProfile, escalation_rules: e.target.value })}
            className="mt-1 w-full rounded-md border px-3 py-2"
            placeholder="When should the agent hand off to a human?"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Hard constraints</label>
          <textarea
            value={jobProfile.hard_constraints}
            onChange={(e) => setJobProfile({ ...jobProfile, hard_constraints: e.target.value })}
            className="mt-1 w-full rounded-md border px-3 py-2"
            placeholder="e.g. No refunds over $500, no legal/medical advice"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Clients & Tone</h3>
        <button className="text-xs text-blue-600" onClick={handleAddSegment}>
          + Add segment
        </button>
      </div>
      <div className="space-y-2">
        {customerProfile.target_segments.length === 0 && (
          <p className="text-sm text-gray-500">Define at least one target customer segment.</p>
        )}
        {customerProfile.target_segments.map((segment, idx) => (
          <div key={idx} className="rounded-md border p-3">
            <div className="flex items-center justify-between text-sm font-medium">
              <span>Segment {idx + 1}</span>
              <button className="text-xs text-red-600" onClick={() => handleRemoveSegment(idx)}>
                Remove
              </button>
            </div>
            <div className="mt-2 grid gap-3 md:grid-cols-2">
              <input
                value={segment.name}
                onChange={(e) => handleSegmentChange(idx, "name", e.target.value)}
                placeholder="Segment name"
                className="w-full rounded-md border px-3 py-2"
              />
              <input
                value={segment.description || ""}
                onChange={(e) => handleSegmentChange(idx, "description", e.target.value)}
                placeholder="Description"
                className="w-full rounded-md border px-3 py-2"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Regions</label>
          <p className="text-xs text-gray-500">
            Where do most of your customers come from? You can select more than one.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {REGION_OPTIONS.map((option) => {
              const checked = regions.includes(option.id);
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleToggleRegion(option.id)}
                  className={[
                    "inline-flex items-center rounded-full border px-3 py-1 text-xs",
                    checked
                      ? "border-black bg-black text-white"
                      : "border-gray-200 bg-white text-gray-700",
                  ].join(" ")}
                >
                  <span className="mr-1 h-2 w-2 rounded-full border border-current bg-current/80" />
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Countries</label>
          <p className="text-xs text-gray-500">
            Choose specific countries within those regions (optional).
          </p>

          {regions.length === 0 ? (
            <p className="text-xs text-gray-400">Select at least one region to choose countries.</p>
          ) : (
            <div className="relative inline-block w-full max-w-md">
              {/* Simple multi-select "dropdown" */}
              <details className="group w-full">
                <summary className="flex cursor-pointer items-center justify-between rounded-md border bg-white px-3 py-2 text-xs text-gray-700">
                  <span>
                    {countries.length === 0
                      ? "Select one or more countries"
                      : `${countries.length} country${countries.length > 1 ? "ies" : ""} selected`}
                  </span>
                  <span className="ml-2 text-gray-400 group-open:rotate-180">▾</span>
                </summary>
                <div className="absolute z-10 mt-1 max-h-64 w-full overflow-auto rounded-md border bg-white p-2 text-xs shadow-md">
                  {availableCountries.map((option) => {
                    const checked = countries.includes(option.name);
                    return (
                      <label
                        key={option.code}
                        className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          className="h-3 w-3"
                          checked={checked}
                          onChange={() => handleToggleCountry(option.name)}
                        />
                        <span>{option.name}</span>
                        <span className="ml-auto text-[10px] uppercase text-gray-400">{option.region}</span>
                      </label>
                    );
                  })}
                  {availableCountries.length === 0 && (
                    <p className="px-2 py-1 text-[11px] text-gray-400">
                      No countries available for the selected regions.
                    </p>
                  )}
                </div>
              </details>

              {/* Selected chips */}
              {countries.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {countries.map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => handleToggleCountry(name)}
                      className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-700"
                    >
                      {name}
                      <span className="ml-1 text-gray-400">×</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Languages</label>
          <div className="mt-2 space-y-2">
            {["english", "spanish", "portuguese"].map((lang) => (
              <label key={lang} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={customerProfile.languages.includes(lang)}
                  onChange={() => {
                    const exists = customerProfile.languages.includes(lang);
                    const next = exists
                      ? customerProfile.languages.filter((l) => l !== lang)
                      : [...customerProfile.languages, lang];
                    setCustomerProfile({ ...customerProfile, languages: next });
                  }}
                />
                <span className="capitalize">{lang}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Tone style</label>
          <div className="mt-2 space-y-2">
            {["very_formal", "professional_friendly", "casual_human", "playful", "bilingual"].map((tone) => (
              <label key={tone} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="tone_style"
                  value={tone}
                  checked={customerProfile.tone_style === tone}
                  onChange={() => setCustomerProfile({ ...customerProfile, tone_style: tone as CustomerProfile["tone_style"] })}
                />
                <span className="capitalize">{tone.replace(/_/g, " ")}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Tone notes</label>
        <textarea
          value={customerProfile.tone_notes || ""}
          onChange={(e) => setCustomerProfile({ ...customerProfile, tone_notes: e.target.value })}
          className="mt-1 w-full rounded-md border px-3 py-2"
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Typical intents</p>
        <div className="grid gap-2 md:grid-cols-2">
          {["pricing_questions", "booking_appointments", "technical_support", "order_status", "complaints", "product_recommendations", "other"].map((intent) => (
            <label key={intent} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={customerProfile.typical_intents.includes(intent as CustomerProfile["typical_intents"][number])}
                onChange={() => {
                  const exists = customerProfile.typical_intents.includes(intent as CustomerProfile["typical_intents"][number]);
                  const next = exists
                    ? customerProfile.typical_intents.filter((i) => i !== intent)
                    : [...customerProfile.typical_intents, intent as CustomerProfile["typical_intents"][number]];
                  setCustomerProfile({ ...customerProfile, typical_intents: next });
                }}
              />
              <span className="capitalize">{intent.replace(/_/g, " ")}</span>
            </label>
          ))}
        </div>
        {customerProfile.typical_intents.includes("other") && (
          <input
            value={customerProfile.typical_intents_other || ""}
            onChange={(e) => setCustomerProfile({ ...customerProfile, typical_intents_other: e.target.value })}
            placeholder="Describe other intents"
            className="w-full rounded-md border px-3 py-2"
          />
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Cultural do's</label>
          <textarea
            value={customerProfile.cultural_dos || ""}
            onChange={(e) => setCustomerProfile({ ...customerProfile, cultural_dos: e.target.value })}
            className="mt-1 w-full rounded-md border px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Cultural don'ts</label>
          <textarea
            value={customerProfile.cultural_donts || ""}
            onChange={(e) => setCustomerProfile({ ...customerProfile, cultural_donts: e.target.value })}
            className="mt-1 w-full rounded-md border px-3 py-2"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Knowledge & Data (optional)</h3>
        {mode === "edit" && initialAgent?.id && (
          <span className="text-xs text-gray-500">{documents.length} docs</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Strategy notes</label>
        <textarea
          value={dataProfile?.strategy_notes || ""}
          onChange={(e) => setDataProfile({ ...(dataProfile || defaultDataProfile()), strategy_notes: e.target.value })}
          className="mt-1 w-full rounded-md border px-3 py-2"
          placeholder="e.g. Use FAQ + product catalog first"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Out-of-date notes</label>
        <textarea
          value={dataProfile?.out_of_date_notes || ""}
          onChange={(e) => setDataProfile({ ...(dataProfile || defaultDataProfile()), out_of_date_notes: e.target.value })}
          className="mt-1 w-full rounded-md border px-3 py-2"
          placeholder="Anything the agent should treat as outdated?"
        />
      </div>

      {mode === "create" && (
        <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-800">
          You can upload documents after saving your agent.
        </div>
      )}

      {mode === "edit" && initialAgent?.id && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Documents</h4>
            <label className="text-sm text-blue-600">
              <input
                type="file"
                className="hidden"
                accept=".pdf,.docx,.txt,.md"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleDocumentUpload(file);
                  }
                }}
              />
              <span className="cursor-pointer">Upload document</span>
            </label>
          </div>
          {docError && <div className="text-sm text-red-600">{docError}</div>}
          {loadingDocs && <div className="text-sm text-gray-600">Working...</div>}
          <div className="space-y-2">
            {documents.length === 0 && <div className="text-sm text-gray-500">No documents yet.</div>}
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between rounded-md border p-2 text-sm">
                <div>
                  <div className="font-medium">{doc.filename}</div>
                  <div className="text-xs text-gray-500">{(doc.size_bytes / 1024).toFixed(1)} KB</div>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1 text-xs">
                    <input
                      type="checkbox"
                      checked={dataProfile?.authoritative_doc_ids?.includes(doc.id) ?? false}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setDataProfile((prev) => {
                          const ids = new Set(prev?.authoritative_doc_ids || []);
                          if (checked) {
                            ids.add(doc.id);
                          } else {
                            ids.delete(doc.id);
                          }
                          return { ...(prev || defaultDataProfile()), authoritative_doc_ids: Array.from(ids) };
                        });
                      }}
                    />
                    Authoritative
                  </label>
                  <button className="text-xs text-red-600" onClick={() => handleDeleteDocument(doc.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Allowed websites (optional)</h3>
        <button className="text-sm text-blue-600" onClick={handleAddWebsite}>
          + Add website
        </button>
      </div>

      {(allowedWebsites?.length ?? 0) === 0 && (
        <div className="text-sm text-gray-500">No websites added yet.</div>
      )}

      {(allowedWebsites || []).map((website, idx) => (
        <div key={idx} className="rounded-md border p-3">
          <div className="flex items-center justify-between text-sm font-medium">
            <span>Website {idx + 1}</span>
            <button className="text-xs text-red-600" onClick={() => handleRemoveWebsite(idx)}>
              Remove
            </button>
          </div>
          <div className="mt-2 grid gap-3 md:grid-cols-3">
            <input
              value={website.url}
              onChange={(e) => handleWebsiteChange(idx, "url", e.target.value)}
              placeholder="https://docs.example.com"
              className="w-full rounded-md border px-3 py-2"
            />
            <input
              value={website.label || ""}
              onChange={(e) => handleWebsiteChange(idx, "label", e.target.value)}
              placeholder="Label (optional)"
              className="w-full rounded-md border px-3 py-2"
            />
            <select
              value={website.trust_level}
              onChange={(e) => handleWebsiteChange(idx, "trust_level", e.target.value)}
              className="w-full rounded-md border px-3 py-2"
            >
              <option value="reference_only">Reference only</option>
              <option value="authoritative">Authoritative</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );

  const renderReview = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Review</h3>
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Agent</p>
            <p className="text-lg font-semibold">{name}</p>
          </div>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs capitalize text-gray-700">{status}</span>
        </div>
        <div className="mt-1 text-xs uppercase tracking-wide text-gray-500">
          Type: {agentType === "customer_service" ? "Customer Service" : "Sales"}
        </div>
        <div className="mt-2 text-sm text-gray-600">Goal: {jobProfile.primary_goal}</div>
        <div className="text-sm text-gray-600">Success: {jobProfile.success_metrics.join(", ") || "Not specified"}</div>
        <div className="mt-2 text-sm text-gray-600">Company: {jobProfile.company_name}</div>
        <div className="text-sm text-gray-600">Industry: {jobProfile.industry || "—"}</div>
        <div className="text-sm text-gray-600">Description: {jobProfile.short_description || "—"}</div>
      </div>

      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="text-sm text-gray-500">Tone & audience</div>
        <div className="text-sm text-gray-700">Style: {customerProfile.tone_style}</div>
        <div className="text-sm text-gray-700">Languages: {customerProfile.languages.join(", ")}</div>
        <div className="text-sm text-gray-700">Segments: {customerProfile.target_segments.map((s) => s.name).join(", ") || "—"}</div>
      </div>

      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="text-sm text-gray-500">Knowledge</div>
        <div className="text-sm text-gray-700">
          Strategy: {dataProfile?.strategy_notes ? dataProfile.strategy_notes : "Default knowledge approach"}
        </div>
        <div className="text-sm text-gray-700">
          Authoritative docs: {dataProfile?.authoritative_doc_ids?.length || 0}
        </div>
        <div className="text-sm text-gray-700">Allowed websites: {allowedWebsites?.length || 0}</div>
      </div>

      <div className="flex justify-between">
        <SecondaryButton onClick={() => setCurrentStep(4)}>Back and edit</SecondaryButton>
        <PrimaryButton onClick={handleSubmit} disabled={saving}>
          {saving ? "Saving..." : mode === "create" ? "Create agent" : "Save changes"}
        </PrimaryButton>
      </div>
      {saveMessage && <div className="text-sm text-green-600">{saveMessage}</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}
    </div>
  );

  const renderFooter = () => (
    <div className="flex items-center justify-between">
      {currentStep > 1 ? (
        <SecondaryButton onClick={goBack}>Back</SecondaryButton>
      ) : (
        <span />
      )}
      {currentStep < 4 ? (
        <div className="flex items-center gap-3">
          {currentStep >= 3 && (
            <button className="text-sm text-gray-600 underline" onClick={skipOptional}>
              Skip for now
            </button>
          )}
          <PrimaryButton onClick={goToNextStep}>Next</PrimaryButton>
        </div>
      ) : (
        <PrimaryButton onClick={() => setCurrentStep(5)}>Review & save</PrimaryButton>
      )}
    </div>
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{mode === "create" ? "Create new agent" : `Edit agent: ${name}`}</h1>
          <p className="text-sm text-gray-500">Follow the steps to configure your OnDuty assistant.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Agent["status"])}
            className="rounded-md border px-3 py-2 text-sm"
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>
      </div>

      {renderStepIndicator()}

      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {saveMessage && <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">{saveMessage}</div>}

      <div className="rounded-lg border bg-white p-5 shadow-sm">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
        {currentStep === 5 && renderReview()}
      </div>

      {currentStep <= 4 && renderFooter()}
    </div>
  );
}
