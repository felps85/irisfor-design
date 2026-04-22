import { SITE_CONFIG, resolveSiteHref } from "./site-config.js";
import { escapeHtml, renderSiteFrame } from "./site-shell.js";

function buildTerminatedContent(rootPrefix = "./") {
  const supportHref = resolveSiteHref(SITE_CONFIG.supportHref, rootPrefix);
  const privacyHref = resolveSiteHref(SITE_CONFIG.privacyHref, rootPrefix);

  return `
    <section class="hero-section termination-hero">
      <div class="hero-copy">
        <p class="overline">Iris status</p>
        <h1 class="display-title">First test terminated. Project ongoing.</h1>
        <p class="lead">
          Iris is offline for now while the next phase is prepared. The first public test is over,
          the project is still active, and the runtime is intentionally unavailable during this reset.
        </p>
        <div class="inline-actions">
          <a class="button button-primary" href="${escapeHtml(supportHref)}">Contact support</a>
          <a class="button button-secondary" href="${escapeHtml(privacyHref)}">Privacy</a>
        </div>
      </div>
      <aside class="hero-panel">
        <div class="hero-note">
          <p class="utility-label">Current state</p>
          <strong>Public test paused</strong>
          <p>The website stays up so people can see the status, but live install and runtime routes are intentionally unavailable.</p>
        </div>
      </aside>
    </section>

    <section class="section">
      <div class="section-intro">
        <p class="overline">What this means</p>
        <h2>No live install or MCP runtime right now.</h2>
      </div>
      <div class="surface-grid">
        <article class="surface-card">
          <h3>Website</h3>
          <p>The public site stays available as a status page on <code>www.irisfor.design</code>.</p>
        </article>
        <article class="surface-card">
          <h3>Install flow</h3>
          <p>The first-test install path is paused. New sessions, MCP tokens, and runtime setup are not being served.</p>
        </article>
        <article class="surface-card">
          <h3>Project status</h3>
          <p>The work is ongoing. Iris will return in a later phase with a fresh runtime and a cleaner activation path.</p>
        </article>
      </div>
    </section>

    <section class="section">
      <div class="section-intro">
        <p class="overline">When Iris returns</p>
        <h2>The next phase can start fresh.</h2>
      </div>
      <ul class="quiet-list">
        <li>the previous test data does not need to be preserved</li>
        <li>the public domain and masked edge layer can be reused</li>
        <li>the runtime can be recreated from the documented recovery package</li>
        <li>the public site can switch back from status mode when the new backend is ready</li>
      </ul>
    </section>
  `;
}

export function renderProjectStatusPage({
  app,
  currentPage = "home",
  rootPrefix = "./",
  pageClass = "status-page"
}) {
  renderSiteFrame({
    app,
    currentPage,
    rootPrefix,
    pageClass,
    content: buildTerminatedContent(rootPrefix)
  });
}
