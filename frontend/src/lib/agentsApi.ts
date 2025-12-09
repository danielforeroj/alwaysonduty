import { Agent, AgentType, KnowledgeDocumentMetadata } from "@/types/agent";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

function getApiBaseOrThrow(): string {
  if (!API_BASE) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");
  }
  return API_BASE;
}

async function authorizedFetch(path: string, token: string, init: RequestInit = {}) {
  const base = getApiBaseOrThrow();
  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      ...(init.headers || {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": init.headers?.["Content-Type"] ?? "application/json",
    },
  });
  if (res.status === 401) {
    throw new Error("unauthorized");
  }
  return res;
}

export async function fetchAgents(token: string): Promise<Agent[]> {
  const res = await authorizedFetch("/api/agents", token);
  if (!res.ok) throw new Error("Failed to load agents");
  return res.json();
}

export async function fetchAgent(token: string, id: string): Promise<Agent> {
  const res = await authorizedFetch(`/api/agents/${id}`, token);
  if (!res.ok) throw new Error("Failed to load agent");
  return res.json();
}

type AgentPayload = {
  name: string;
  slug: string;
  status: "draft" | "active" | "disabled";
  agent_type: AgentType;
  job_and_company_profile: Agent["job_and_company_profile"];
  customer_profile: Agent["customer_profile"];
  data_profile?: Agent["data_profile"] | null;
  allowed_websites?: Agent["allowed_websites"] | null;
};

export async function createAgent(token: string, payload: AgentPayload): Promise<Agent> {
  const res = await authorizedFetch("/api/agents", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create agent");
  return res.json();
}

export async function updateAgent(token: string, id: string, payload: Partial<AgentPayload>): Promise<Agent> {
  const res = await authorizedFetch(`/api/agents/${id}`, token, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update agent");
  return res.json();
}

export async function fetchAgentDocuments(token: string, agentId: string): Promise<KnowledgeDocumentMetadata[]> {
  const res = await authorizedFetch(`/api/agents/${agentId}/documents`, token);
  if (!res.ok) throw new Error("Failed to load documents");
  return res.json();
}

export async function uploadAgentDocument(
  token: string,
  agentId: string,
  file: File,
): Promise<KnowledgeDocumentMetadata> {
  const base = getApiBaseOrThrow();
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${base}/api/agents/${agentId}/documents`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (res.status === 401) {
    throw new Error("unauthorized");
  }
  if (!res.ok) throw new Error("Failed to upload document");
  return res.json();
}

export async function deleteAgentDocument(
  token: string,
  agentId: string,
  documentId: string,
): Promise<void> {
  const res = await authorizedFetch(`/api/agents/${agentId}/documents/${documentId}`, token, {
    method: "DELETE",
  });
  if (!res.ok && res.status !== 204) throw new Error("Failed to delete document");
}
