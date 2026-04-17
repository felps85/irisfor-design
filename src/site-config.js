const RAW_CONFIG = window.DESIGN_INTELLIGENCE_CONFIG ?? {};

function normalizeSitePath(value, fallback) {
  if (typeof value !== "string" || !value.trim()) {
    return fallback;
  }

  return value.trim();
}

function trimRelativePrefix(value) {
  return value.replace(/^\.?\//, "");
}

function isAbsoluteHref(value) {
  return /^(?:[a-z]+:)?\/\//i.test(value) || value.startsWith("mailto:") || value.startsWith("#");
}

function normalizeAbsoluteUrl(value, fallback = "") {
  if (typeof value !== "string" || !value.trim()) {
    return fallback;
  }

  return value.trim().replace(/\/+$/, "");
}

export const SITE_CONFIG = {
  appName: RAW_CONFIG.appName ?? "Iris",
  publicOrigin: normalizeAbsoluteUrl(RAW_CONFIG.publicOrigin),
  publicConnectionUrl: normalizeAbsoluteUrl(RAW_CONFIG.publicConnectionUrl),
  publicAuthBaseUrl: normalizeAbsoluteUrl(RAW_CONFIG.publicAuthBaseUrl),
  publicFunctionsBaseUrl: normalizeAbsoluteUrl(RAW_CONFIG.publicFunctionsBaseUrl),
  supabaseUrl: normalizeAbsoluteUrl(
    RAW_CONFIG.supabaseUrl,
    "https://rfgulhwmpedzafgrasar.supabase.co"
  ),
  supabasePublishableKey: RAW_CONFIG.supabasePublishableKey ?? "",
  functionsBaseUrl: normalizeAbsoluteUrl(
    RAW_CONFIG.functionsBaseUrl,
    "https://rfgulhwmpedzafgrasar.supabase.co/functions/v1"
  ),
  supportEmail: typeof RAW_CONFIG.supportEmail === "string" ? RAW_CONFIG.supportEmail.trim() : "",
  privacyHref: normalizeSitePath(RAW_CONFIG.privacyHref, "privacy/"),
  supportHref: normalizeSitePath(RAW_CONFIG.supportHref, "support/"),
  installHref: normalizeSitePath(RAW_CONFIG.installHref, "./#start-iris"),
  startIrisHref: normalizeSitePath(RAW_CONFIG.startIrisHref ?? RAW_CONFIG.installHref, "./#start-iris")
};

export function resolveAuthBaseUrl() {
  return SITE_CONFIG.publicAuthBaseUrl || SITE_CONFIG.supabaseUrl;
}

export function resolveFunctionsBaseUrl() {
  return SITE_CONFIG.publicFunctionsBaseUrl || SITE_CONFIG.functionsBaseUrl;
}

export function resolveSiteHref(target, rootPrefix = "./") {
  if (!target) {
    return rootPrefix;
  }

  if (isAbsoluteHref(target)) {
    return target;
  }

  return `${rootPrefix}${trimRelativePrefix(target)}`;
}

export function resolveRemoteMcpEndpoint() {
  if (SITE_CONFIG.publicConnectionUrl) {
    return SITE_CONFIG.publicConnectionUrl;
  }

  return `${resolveFunctionsBaseUrl()}/remote-mcp`;
}

export function buildStartIrisHostHref(hostId, rootPrefix = "./") {
  const base = resolveSiteHref(SITE_CONFIG.startIrisHref, rootPrefix);
  const [pathPart, hashPart] = base.split("#");
  const separator = pathPart.includes("?") ? "&" : "?";
  const nextPath = `${pathPart}${separator}host=${encodeURIComponent(hostId)}`;
  return hashPart ? `${nextPath}#${hashPart}` : nextPath;
}
