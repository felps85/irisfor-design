import { SITE_CONFIG, resolveSiteHref } from "./site-config.js";

export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderNavLink({ href, label, current }) {
  return `<a href="${escapeHtml(href)}"${
    current ? ' aria-current="page"' : ""
  }>${escapeHtml(label)}</a>`;
}

export function renderSiteFrame({ app, currentPage, rootPrefix = "./", pageClass = "", content }) {
  const homeHref = resolveSiteHref("", rootPrefix);
  const installHref = resolveSiteHref(SITE_CONFIG.startIrisHref, rootPrefix);
  const privacyHref = resolveSiteHref(SITE_CONFIG.privacyHref, rootPrefix);
  const supportHref = resolveSiteHref(SITE_CONFIG.supportHref, rootPrefix);
  const brandMarkSrc = `${rootPrefix}branding/current/iris-mark-final-mono.svg`;

  app.innerHTML = `
    <div class="site-shell">
      <header class="site-header">
        <a class="brand" href="${escapeHtml(homeHref)}" aria-label="${escapeHtml(
          SITE_CONFIG.appName
        )} home">
          <img class="brand-mark" src="${escapeHtml(brandMarkSrc)}" alt="${escapeHtml(
            SITE_CONFIG.appName
          )} mark" />
          <div class="brand-copy">
            <strong>${escapeHtml(SITE_CONFIG.appName)}</strong>
            <span>Design intelligence that reviews first.</span>
          </div>
        </a>

        <nav class="site-nav" aria-label="Primary">
          ${renderNavLink({ href: homeHref, label: "Home", current: currentPage === "home" })}
          ${renderNavLink({
            href: installHref,
            label: "Start Iris",
            current: currentPage === "install"
          })}
          ${renderNavLink({
            href: privacyHref,
            label: "Privacy",
            current: currentPage === "privacy"
          })}
          ${renderNavLink({
            href: supportHref,
            label: "Support",
            current: currentPage === "support"
          })}
        </nav>
      </header>

      <main class="page-stack ${escapeHtml(pageClass)}">${content}</main>

      <footer class="site-footer">
        <p>Iris is in public beta. It should review before it acts, explain the safest next step, and stay clear about what changed and what did not.</p>
        <div class="site-footer__links">
          <a href="${escapeHtml(installHref)}">Start Iris</a>
          <a href="${escapeHtml(privacyHref)}">Privacy</a>
          <a href="${escapeHtml(supportHref)}">Support</a>
        </div>
      </footer>
    </div>
  `;
}
