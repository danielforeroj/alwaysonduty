const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export const resolveApiBase = () => API_BASE || (typeof window !== "undefined" ? window.location.origin : "");

export const buildApiUrl = (path: string) => {
  const base = resolveApiBase();
  if (!base) return "";
  try {
    return new URL(path, base).toString();
  } catch {
    return "";
  }
};
