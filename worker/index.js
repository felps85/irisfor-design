const API_PREFIX = "/api/";
const AUTH_PREFIX = "/auth/";
const MCP_PREFIX = "/mcp";

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
    const proxyTarget = buildProxyTarget(request.url, env);

    if (!proxyTarget) {
      return fetch(request);
    }

    return fetch(buildProxyRequest(request, proxyTarget));
  }
};
