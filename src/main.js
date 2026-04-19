import "./styles.css";

import { SITE_CONFIG, buildStartIrisHostHref, resolveSiteHref } from "./site-config.js";
import { FAQ_ITEMS, HOME_PROCESS, TRUST_POINTS, buildSiteInstallModel, mergeInstallModel } from "./site-data.js";
import { createInstallToken, fetchLiveInstallPayload, loadStoredInstallToken } from "./site-auth.js";
import { escapeHtml, renderSiteFrame } from "./site-shell.js";

const app = document.querySelector("#app");
const hostParam = new URLSearchParams(window.location.search).get("host");
const storedTokenBundle = loadStoredInstallToken();
const initialModel = buildSiteInstallModel({
  installToken: storedTokenBundle?.token
});
const DISPLAY_HOST_IDS = new Set(["cursor", "codex", "chatgpt", "claude", "figma"]);
const FIGMA_HOST = {
  id: "figma",
  name: "Figma",
  status: "secondary",
  capabilityLabel: "Figma beta",
  ctaLabel: "Ask about Figma beta",
  summary: "Review-first critique and explicit comment publishing inside Figma.",
  setupCopy:
    "Figma is part of the broader beta. We will help you choose the right access path instead of sending you through the LLM setup flow.",
  firstPrompt: "Review this frame first and turn the clearest improvements into comment-ready feedback."
};

const state = {
  installModel: initialModel,
  selectedHostId:
    (DISPLAY_HOST_IDS.has(hostParam) ? hostParam : null) || initialModel.hosts[0]?.id || "cursor",
  tokenBundle: storedTokenBundle,
  actionState: "idle",
  copiedKey: null,
  error: null,
  notice: null
};

let copyResetTimer = null;

function primaryHosts() {
  return state.installModel.hosts.filter((host) => host.status === "primary");
}

function displayHosts() {
  return [...primaryHosts(), FIGMA_HOST];
}

function currentHost() {
  return displayHosts().find((host) => host.id === state.selectedHostId) || displayHosts()[0];
}

function escapeAttribute(value) {
  return escapeHtml(String(value)).replaceAll("\n", "&#10;");
}

function buildInstallArtifactCopyValue(artifact) {
  if (artifact.kind === "fields") {
    return [
      artifact.title,
      "",
      ...artifact.fields.map((field) => `${field.label}: ${field.value}`)
    ].join("\n");
  }

  return artifact.content || "";
}

function renderInstallArtifact(host, artifact) {
  const copyValue = buildInstallArtifactCopyValue(artifact);

  return `
    <div class="${artifact.kind === "fields" ? "field-card" : "code-card"}">
      <div class="${artifact.kind === "fields" ? "field-card__header" : "code-card__header"}">
        <div>
          <p class="utility-label">${escapeHtml(artifact.title || `${host.name} setup`)}</p>
          ${
            artifact.description
              ? `<span class="status-copy">${escapeHtml(artifact.description)}</span>`
              : ""
          }
        </div>
        ${renderCopyButton({
          key: `setup:${host.id}:${artifact.id || artifact.title || "artifact"}`,
          value: copyValue,
          label: `${host.name} setup`
        })}
      </div>
      <pre class="code-block code-block--display">${escapeHtml(
        artifact.kind === "fields"
          ? artifact.fields.map((field) => `${field.label}: ${field.value}`).join("\n")
          : artifact.content || ""
      )}</pre>
    </div>
  `;
}

function renderCopyIcon() {
  return `
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <rect x="5" y="3" width="8" height="10" rx="1.5"></rect>
      <path d="M3.5 10.5h-1A1.5 1.5 0 0 1 1 9V3A1.5 1.5 0 0 1 2.5 1h5A1.5 1.5 0 0 1 9 2.5v1"></path>
    </svg>
  `;
}

function renderTickIcon() {
  return `
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M3 8.5 6.2 11.7 13 4.8"></path>
    </svg>
  `;
}

function renderCopyButton({ key, value, label }) {
  const copied = state.copiedKey === key;

  return `
    <button
      class="copy-button copy-button--icon${copied ? " is-copied" : ""}"
      data-copy-value="${escapeAttribute(value)}"
      data-copy-key="${escapeAttribute(key)}"
      aria-label="${escapeAttribute(copied ? `${label} copied` : `Copy ${label}`)}"
      title="${escapeAttribute(copied ? `${label} copied` : `Copy ${label}`)}"
    >
      ${copied ? renderTickIcon() : renderCopyIcon()}
    </button>
  `;
}

function renderProcessSteps() {
  return HOME_PROCESS.map(
    (item) => `
      <article class="process-step">
        <span class="utility-label">${escapeHtml(item.step)}</span>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.copy)}</p>
      </article>
    `
  ).join("");
}

function renderSurfaceTabs() {
  return `
    <div class="surface-tabs" role="tablist" aria-label="Where Iris works">
      ${displayHosts()
        .map((host) => {
          const active = host.id === state.selectedHostId;

          return `
            <button
              class="surface-tab${active ? " is-active" : ""}"
              data-host-id="${escapeHtml(host.id)}"
              id="surface-tab-${escapeHtml(host.id)}"
              role="tab"
              aria-selected="${active ? "true" : "false"}"
              aria-controls="surface-panel-${escapeHtml(host.id)}"
              tabindex="${active ? "0" : "-1"}"
            >
              <span class="surface-tab__label">${escapeHtml(host.capabilityLabel || "")}</span>
              <strong>${escapeHtml(host.name)}</strong>
            </button>
          `;
        })
        .join("")}
    </div>
  `;
}

function buildHostSetupBlock(host, supportHref) {
  if (host.id === "figma") {
    return `
      <div class="connection-panel connection-panel--simple">
        <p class="utility-label">Figma beta access</p>
        <p class="connection-intro">${escapeHtml(host.setupCopy || "")}</p>
        <div class="inline-actions">
          <a class="button button-primary" href="${escapeHtml(supportHref)}">${escapeHtml(host.ctaLabel)}</a>
        </div>
      </div>
    `;
  }

  if (!state.tokenBundle?.token) {
    return `
      <div class="connection-panel connection-panel--simple">
        <p class="utility-label">Free beta access</p>
        <p class="connection-intro">
          Start free and we will generate the ready Iris setup for ${escapeHtml(host.name)}.
        </p>
        <div class="inline-actions">
          <button class="button button-primary" data-action="continue-free">
            ${state.actionState === "loading" ? "Starting…" : escapeHtml(host.ctaLabel || "Start Iris")}
          </button>
          <a class="button-link" href="#how-it-works">See how it works</a>
        </div>
        <p class="status-copy">No payment is required during beta.</p>
      </div>
    `;
  }

  return `
    <div class="connection-panel">
      <p class="utility-label">${escapeHtml(host.ctaLabel || "")}</p>
      <p class="connection-intro">${escapeHtml(host.setupCopy || "")}</p>
      <ol class="guided-steps">
        ${(host.steps || []).map((step) => `<li>${escapeHtml(step)}</li>`).join("")}
      </ol>
      ${(host.installArtifacts || []).map((artifact) => renderInstallArtifact(host, artifact)).join("")}
    </div>
  `;
}

function renderFaqItems() {
  return FAQ_ITEMS.map(
    (item) => `
      <details class="faq-item">
        <summary>${escapeHtml(item.question)}</summary>
        <p>${escapeHtml(item.answer)}</p>
      </details>
    `
  ).join("");
}

function renderTrustPoints() {
  return `
    <div class="trust-grid">
      ${TRUST_POINTS.map(
        (point) => `
          <article class="trust-item">
            <h3>${escapeHtml(point.title)}</h3>
            <p>${escapeHtml(point.copy)}</p>
          </article>
        `
      ).join("")}
    </div>
  `;
}

function renderStatusNotices() {
  return `
    ${
      state.error
        ? `<div class="status-section is-error"><p>${escapeHtml(state.error)}</p></div>`
        : ""
    }
    ${
      state.notice
        ? `<div class="status-section is-success"><p>${escapeHtml(state.notice)}</p></div>`
        : ""
    }
  `;
}

function renderHomePage() {
  const host = currentHost();
  const startHref = resolveSiteHref(SITE_CONFIG.startIrisHref, "./");
  const supportHref = resolveSiteHref(SITE_CONFIG.supportHref, "./");

  const content = `
    <section class="hero-section">
      <div class="hero-copy">
        <p class="overline">Iris / Design intelligence for LLMs, Figma, and build work</p>
        <h1 class="display-title">Start with review. Keep the judgment. Change only when it is time.</h1>
        <p class="lead">
          Iris helps teams understand the goal, review what already exists, explain the safest next
          step, and stay useful across Cursor, Codex, ChatGPT, Claude, and Figma.
        </p>
        <div class="button-row">
          <a class="button button-primary" href="${escapeHtml(startHref)}">Start Iris</a>
          <a class="button button-secondary" href="#how-it-works">See how it works</a>
        </div>
      </div>

      <aside class="hero-panel">
        <p class="utility-label">What Iris should feel like</p>
        <div class="hero-note">
          <strong>${escapeHtml(state.installModel.startup.title)}</strong>
          <p>${escapeHtml(state.installModel.startup.summary)}</p>
        </div>
        <ul class="quiet-list">
          ${state.installModel.startup.suggestedActions
            .map((item) => `<li>${escapeHtml(item)}</li>`)
            .join("")}
        </ul>
      </aside>
    </section>

    <section class="section" id="how-it-works">
      <div class="section-intro">
        <p class="overline">How Iris works</p>
        <h2>One operating model from the first question to the next real change.</h2>
        <p>
          Iris should not make you learn backend language to get value. The product should feel clear
          before it feels technical.
        </p>
      </div>
      <div class="process-grid">
        ${renderProcessSteps()}
      </div>
    </section>

    <section class="section start-section" id="start-iris">
      <div class="section-intro">
        <p class="overline">Where Iris works</p>
        <h2>Pick the host that fits the work and start from the same review-first posture.</h2>
        <p>
          Cursor is the easiest path. Codex is the cleanest technical path. ChatGPT and Claude still
          use host-native flows, but Iris now generates the exact setup they need instead of leaving
          you to assemble the connection yourself. Figma remains part of the broader beta, but it is
          not the main onboarding story here.
        </p>
      </div>
      ${renderSurfaceTabs()}
      <div class="selected-surface" id="surface-panel-${escapeHtml(host.id)}" role="tabpanel" aria-labelledby="surface-tab-${escapeHtml(
        host.id
      )}">
        <div class="selected-surface__copy">
          <p class="overline">${escapeHtml(host.capabilityLabel || "")}</p>
          <h2>${escapeHtml(host.name)}</h2>
          <p>${escapeHtml(host.summary)}</p>
          <p class="host-detail">${escapeHtml(host.setupCopy || "")}</p>
        </div>
        <div class="selected-surface__panel">
          ${buildHostSetupBlock(host, supportHref)}
          <div class="prompt-note">
            <div class="prompt-note__header">
              <p class="utility-label">Suggested first prompt</p>
              ${renderCopyButton({
                key: `prompt:${host.id}`,
                value: host.firstPrompt,
                label: "suggested first prompt"
              })}
            </div>
            <p>${escapeHtml(host.firstPrompt)}</p>
          </div>
          ${renderStatusNotices()}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-intro">
        <p class="overline">FAQ</p>
        <h2>What people usually want to know before they begin.</h2>
      </div>
      <div class="faq-list">
        ${renderFaqItems()}
      </div>
    </section>

    <section class="section">
      <div class="section-intro">
        <p class="overline">Trust</p>
        <h2>Keep the beta boundaries visible.</h2>
        <p>
          Iris should make it easy to understand how to start, what the free path includes, and how to
          ask for help without making the support path feel hidden.
        </p>
      </div>
      ${renderTrustPoints()}
    </section>
  `;

  renderSiteFrame({
    app,
    currentPage: "home",
    rootPrefix: "./",
    pageClass: "home-page",
    content
  });
}

async function hydrateLiveInstallModel() {
  try {
    const payload = await fetchLiveInstallPayload();
    state.installModel = mergeInstallModel(state.installModel, payload);

    if (state.tokenBundle?.token) {
      state.installModel = mergeInstallModel(
        state.installModel,
        buildSiteInstallModel({
          installToken: state.tokenBundle.token
        })
      );
    }
  } catch {
    // The local shared owner already gives us a usable build-time model.
  }

  renderHomePage();
}

async function handleContinueFree() {
  const host = currentHost();

  state.actionState = "loading";
  state.error = null;
  state.notice = null;
  renderHomePage();

  try {
    const bundle = await createInstallToken(host.id);
    state.tokenBundle = bundle;

    if (bundle.install) {
      state.installModel = mergeInstallModel(state.installModel, bundle.install);
    }

    state.notice = `Iris is ready for ${host.name}. Copy the generated setup below and start with the suggested first prompt.`;
  } catch (error) {
    state.error = error instanceof Error ? error.message : "Unable to start Iris from this page.";
  } finally {
    state.actionState = "idle";
    renderHomePage();
  }
}

async function handleCopy(value, key) {
  try {
    await navigator.clipboard.writeText(value);
    state.notice = "Copied to your clipboard.";
    state.error = null;
    state.copiedKey = key || null;

    if (copyResetTimer) {
      clearTimeout(copyResetTimer);
    }

    copyResetTimer = window.setTimeout(() => {
      state.copiedKey = null;
      renderHomePage();
    }, 2200);
  } catch {
    state.error = "Clipboard copy failed. You can still select and copy the value manually.";
  }

  renderHomePage();
}

app.addEventListener("click", async (event) => {
  const hostButton = event.target.closest("[data-host-id]");

  if (hostButton) {
    const nextHostId = hostButton.getAttribute("data-host-id");

    if (nextHostId && nextHostId !== state.selectedHostId) {
      state.selectedHostId = nextHostId;
      state.error = null;
      state.notice = null;
      window.history.replaceState({}, "", buildStartIrisHostHref(nextHostId, "./"));
      renderHomePage();
    }

    return;
  }

  const actionButton = event.target.closest("[data-action='continue-free']");

  if (actionButton) {
    await handleContinueFree();
    return;
  }

  const copyButton = event.target.closest("[data-copy-value]");

  if (copyButton) {
    await handleCopy(
      copyButton.getAttribute("data-copy-value") || "",
      copyButton.getAttribute("data-copy-key") || ""
    );
  }
});

renderHomePage();
hydrateLiveInstallModel();
