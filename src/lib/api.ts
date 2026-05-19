const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

function getToken(): string | null {
  return localStorage.getItem("ssl-checker-token");
}

export function setToken(token: string | null): void {
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

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    setToken(null);
    window.location.href = "/login";
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
