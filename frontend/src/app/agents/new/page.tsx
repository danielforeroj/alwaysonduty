"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { AgentWizard } from "@/components/agents/AgentWizard";

export default function NewAgentPage() {
  const { token, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!token) {
      router.push("/login");
    }
  }, [authLoading, token, router]);

  if (!token) {
    return <div className="p-6">Redirecting...</div>;
  }

  return <AgentWizard mode="create" />;
}
