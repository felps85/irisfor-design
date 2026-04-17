import {
  SITE_CONFIG,
  resolveAuthBaseUrl,
  resolveFunctionsBaseUrl,
  resolveRemoteMcpEndpoint
} from "./site-config.js";

const SESSION_STORAGE_KEY = "iris.site.testing-session.v1";
const TOKEN_STORAGE_KEY = "iris.site.install-token.v1";

function readStoredJson(key) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeStoredJson(key, value) {
  if (!value) {
    window.localStorage.removeItem(key);
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

function authHeaders(accessToken) {
  return {
    apikey: SITE_CONFIG.supabasePublishableKey,
    "Content-Type": "application/json",
    ...(accessToken
      ? {
          Authorization: `Bearer ${accessToken}`
        }
      : {})
  };
}

async function fetchJson(url, options = {}) {
  let response;

  try {
    response = await fetch(url, options);
  } catch {
    throw new Error(
      "Unable to reach Iris right now. If you are testing locally, this usually means the website origin is not allowed yet or the request was blocked before it reached Iris."
    );
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      payload?.error_description ||
      payload?.msg ||
      payload?.error ||
      payload?.message ||
      `Request failed with status ${response.status}.`;
    throw new Error(message);
  }

  return payload;
}

function normalizeSession(payload) {
  const expiresIn = typeof payload.expires_in === "number" ? payload.expires_in : null;
  const expiresAt = expiresIn ? Date.now() + expiresIn * 1000 : null;

  return {
    accessToken: payload.access_token,
    refreshToken: payload.refresh_token || null,
    tokenType: payload.token_type || "bearer",
    expiresAt,
    user: payload.user || null,
    persistedAt: Date.now()
  };
}

function isSessionExpired(session) {
  if (!session?.accessToken) {
    return true;
  }

  if (typeof session.expiresAt !== "number") {
    return false;
  }

  return Date.now() > session.expiresAt - 30_000;
}

function isTokenExpired(tokenBundle) {
  const expiresAt = tokenBundle?.tokenRecord?.expiresAt;

  if (!expiresAt) {
    return false;
  }

  return new Date(expiresAt).getTime() <= Date.now();
}

async function signInForTesting() {
  try {
    const payload = await fetchJson(`${resolveAuthBaseUrl()}/auth/v1/signup`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        data: {
          source: "website_start_iris",
          surface: "general_llm",
          mode: "testing"
        }
      })
    });

    return normalizeSession(payload?.session ?? payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to start the testing session.";

    if (message.toLowerCase().includes("anonymous")) {
      const authError = new Error("Anonymous testing is not enabled for this Supabase project.");
      authError.name = "AnonymousTestingDisabledError";
      throw authError;
    }

    throw error;
  }
}

async function refreshSession(session) {
  if (!session?.refreshToken) {
    return null;
  }

  const payload = await fetchJson(
    `${resolveAuthBaseUrl()}/auth/v1/token?grant_type=refresh_token`,
    {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        refresh_token: session.refreshToken
      })
    }
  );

  const refreshed = normalizeSession(payload);
  writeStoredJson(SESSION_STORAGE_KEY, refreshed);
  return refreshed;
}

export function loadStoredSession() {
  const session = readStoredJson(SESSION_STORAGE_KEY);
  return session?.accessToken ? session : null;
}

export function loadStoredInstallToken() {
  const bundle = readStoredJson(TOKEN_STORAGE_KEY);

  if (!bundle?.token || isTokenExpired(bundle)) {
    writeStoredJson(TOKEN_STORAGE_KEY, null);
    return null;
  }

  return bundle;
}

export async function ensureTestingSession() {
  const storedSession = loadStoredSession();

  if (storedSession && !isSessionExpired(storedSession)) {
    return storedSession;
  }

  if (storedSession?.refreshToken) {
    const refreshed = await refreshSession(storedSession);

    if (refreshed?.accessToken) {
      return refreshed;
    }
  }

  const session = await signInForTesting();
  writeStoredJson(SESSION_STORAGE_KEY, session);
  return session;
}

export async function fetchLiveInstallPayload() {
  return fetchJson(resolveRemoteMcpEndpoint(), {
    method: "GET"
  });
}

export async function createInstallToken(hostId) {
  const session = await ensureTestingSession();
  const response = await fetchJson(`${resolveFunctionsBaseUrl()}/create-mcp-token`, {
    method: "POST",
    headers: authHeaders(session.accessToken),
    body: JSON.stringify({
      label: `Website ${hostId} start`
    })
  });

  const bundle = {
    hostId,
    token: response.token,
    tokenRecord: response.tokenRecord,
    install: response.install || null,
    persistedAt: Date.now()
  };

  writeStoredJson(TOKEN_STORAGE_KEY, bundle);
  return bundle;
}
