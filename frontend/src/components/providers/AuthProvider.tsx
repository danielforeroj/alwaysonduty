"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface TenantInfo {
  id?: string;
  name: string;
  slug?: string;
  plan_type: string;
  billing_status?: string | null;
  trial_ends_at?: string | null;
}

export interface UserInfo {
  id?: string;
  email: string;
  name?: string | null;
  role?: string | null;
  email_verified?: boolean | null;
}

export interface AuthPayload {
  access_token: string;
  tenant: TenantInfo;
  user: UserInfo;
}

interface AuthContextValue {
  token: string | null;
  user: UserInfo | null;
  tenant: TenantInfo | null;
  loading: boolean;
  setAuth: (data: AuthPayload) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [tenant, setTenant] = useState<TenantInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (storedToken: string) => {
    if (!API_BASE) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      setToken(data.access_token);
      setUser(data.user);
      setTenant(data.tenant);
    } catch (err) {
      console.error("Failed to hydrate auth state", err);
      localStorage.removeItem("on_duty_token");
      setToken(null);
      setUser(null);
      setTenant(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("on_duty_token");
    if (!stored) {
      setLoading(false);
      return;
    }
    fetchProfile(stored);
  }, [fetchProfile]);

  const setAuth = useCallback((data: AuthPayload) => {
    setToken(data.access_token);
    setUser(data.user);
    setTenant(data.tenant);
    if (typeof window !== "undefined") {
      localStorage.setItem("on_duty_token", data.access_token);
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setTenant(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("on_duty_token");
    }
  }, []);

  const value = useMemo(
    () => ({ token, user, tenant, loading, setAuth, logout }),
    [token, user, tenant, loading, setAuth, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
