import { NextRequest, NextResponse } from "next/server";

function backendBase(): string {
  const url = process.env.API_URL;
  if (!url) {
    throw new Error("API_URL is not configured");
  }
  return url.replace(/\/$/, "");
}

async function proxy(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> },
): Promise<NextResponse> {
  let base: string;
  try {
    base = backendBase();
  } catch {
    return NextResponse.json({ error: "API_URL is not configured" }, { status: 500 });
  }

  const { path } = await context.params;
  const pathStr = path.join("/");
  const search = req.nextUrl.search;
  const target = `${base}/api/${pathStr}${search}`;

  const headers = new Headers();
  const auth = req.headers.get("authorization");
  const contentType = req.headers.get("content-type");
  if (auth) headers.set("authorization", auth);
  if (contentType) headers.set("content-type", contentType);

  const init: RequestInit = {
    method: req.method,
    headers,
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = await req.text();
  }

  const upstream = await fetch(target, init);
  const body = await upstream.text();

  return new NextResponse(body || null, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "application/json",
    },
  });
}

export const GET = proxy;
export const POST = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const PUT = proxy;
