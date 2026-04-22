const API_PREFIX = "/api/";
const AUTH_PREFIX = "/auth/";
const MCP_PREFIX = "/mcp";

function buildTerminationHeaders(origin) {
  return {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
  };
}

function buildTerminationResponse(request) {
  const origin = request.headers.get("Origin");

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: buildTerminationHeaders(origin)
    });
  }

  return new Response(
    JSON.stringify({
      status: "terminated",
      message: "First test terminated. Project ongoing.",
      detail:
        "Iris is offline for now while the next phase is prepared. Public install and runtime routes are intentionally unavailable."
    }),
    {
      status: 410,
      headers: buildTerminationHeaders(origin)
    }
  );
}

function trimTrailingSlash(value) {
  return String(value || "").replace(/\/+$/, "");
}

function buildProxyTarget(requestUrl, env) {
  const url = new URL(requestUrl);
  const supabaseOrigin = trimTrailingSlash(env.SUPABASE_ORIGIN);

  if (!supabaseOrigin) {
    throw new Error("SUPABASE_ORIGIN is required.");
  }

  if (url.pathname === MCP_PREFIX || url.pathname.startsWith(`${MCP_PREFIX}/`)) {
    const suffix = url.pathname.slice(MCP_PREFIX.length);
    return `${supabaseOrigin}/functions/v1/remote-mcp${suffix}${url.search}`;
  }

  if (url.pathname.startsWith(API_PREFIX)) {
    return `${supabaseOrigin}/functions/v1/${url.pathname.slice(API_PREFIX.length)}${url.search}`;
  }

  if (url.pathname.startsWith(AUTH_PREFIX)) {
    return `${supabaseOrigin}${url.pathname}${url.search}`;
  }

  return null;
}

function buildProxyRequest(request, targetUrl) {
  const headers = new Headers(request.headers);
  headers.set("x-forwarded-host", new URL(request.url).host);

  const init = {
    method: request.method,
    headers,
    redirect: "manual"
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = request.body;
  }

  return new Request(targetUrl, init);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (
      url.pathname === MCP_PREFIX ||
      url.pathname.startsWith(`${MCP_PREFIX}/`) ||
      url.pathname.startsWith(API_PREFIX) ||
      url.pathname.startsWith(AUTH_PREFIX)
    ) {
      return buildTerminationResponse(request);
    }

    const proxyTarget = buildProxyTarget(request.url, env);

    if (!proxyTarget) {
      return fetch(request);
    }

    return fetch(buildProxyRequest(request, proxyTarget));
  }
};
