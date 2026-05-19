/** Browser calls same-origin /api/* — Next.js proxies to VPS using server-only API_URL. */

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("ssl-checker-token");
}

export function setToken(token: string | null): void {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem("ssl-checker-token", token);
  else localStorage.removeItem("ssl-checker-token");
}

export function isAuthenticated(): boolean {
  return Boolean(getToken());
}

export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers ?? {}),
  };
  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(path, { ...options, headers });

  if (res.status === 401) {
    setToken(null);
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Unauthorized");
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    let message = "Request failed";
    if (typeof data.error === "string") {
      message = data.error;
    } else if (data.error && typeof data.error === "object") {
      const fieldErrors = data.error.fieldErrors as
        | Record<string, string[]>
        | undefined;
      if (fieldErrors) {
        const first = Object.values(fieldErrors).flat()[0];
        if (first) message = first;
      }
    }
    throw new Error(message);
  }

  return data as T;
}
