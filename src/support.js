import "./styles.css";

import { SITE_CONFIG, resolveSiteHref } from "./site-config.js";
import { escapeHtml, renderSiteFrame } from "./site-shell.js";

const app = document.querySelector("#app");
const state = {
  notice: null,
  error: null
};

function buildSupportMessage(formData) {
  return [
    `Surface: ${formData.surface || "Not specified"}`,
    `Email: ${formData.email || "Not provided"}`,
    `What they were trying to do:`,
    formData.goal || "Not provided",
    ``,
    `What happened instead:`,
    formData.issue || "Not provided",
    ``,
    `Links or screenshots:`,
    formData.context || "Not provided"
  ].join("\n");
}

async function submitSupportRequest(formData) {
  const subject = `[Iris beta support] ${formData.surface || "General support"}`;
  const body = buildSupportMessage(formData);

  if (SITE_CONFIG.supportEmail) {
    const mailto = `mailto:${encodeURIComponent(SITE_CONFIG.supportEmail)}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    state.notice = `Opening your email app for ${SITE_CONFIG.supportEmail}.`;
    state.error = null;
    renderSupportPage();
    return;
  }

  try {
    await navigator.clipboard.writeText(`${subject}\n\n${body}`);
    state.notice =
      "No support email is configured yet, so your support request was copied to the clipboard. Paste it into your chosen inbox.";
    state.error = null;
  } catch {
    state.error =
      "No support email is configured yet, and clipboard copy failed. Please copy the details manually from the form.";
    state.notice = null;
  }

  renderSupportPage();
}

function renderSupportPage() {
  const content = `
    <section class="hero-section inner-hero">
      <div class="hero-copy">
        <p class="overline">Support</p>
        <h1 class="display-title">Tell us what you were trying to do and where the beta got in the way.</h1>
        <p class="lead">
          Iris is still in public beta. If something feels broken, unclear, or more technical than it
          should, use this form so we get the right context the first time.
        </p>
      </div>
      <aside class="hero-panel">
        <p class="utility-label">Best support requests include</p>
        <ul class="quiet-list compact-list">
          <li>which surface you were using</li>
          <li>what you expected to happen</li>
          <li>what happened instead</li>
          <li>a screenshot or link if it helps reproduce the issue</li>
        </ul>
      </aside>
    </section>

    <section class="section support-section">
      <div class="section-intro">
        <p class="overline">Beta support form</p>
        <h2>Send one clear support request.</h2>
        <p>
          This stays lightweight for now. The form will either open your email app or copy a ready-to-send
          support message if we have not wired the final inbox yet.
        </p>
      </div>

      <div class="support-layout">
        <form class="support-form" data-support-form>
          <div class="form-grid">
            <label class="field-label">
              <span>Surface</span>
              <select name="surface" required>
                <option value="Cursor">Cursor</option>
                <option value="Codex">Codex</option>
                <option value="ChatGPT">ChatGPT</option>
                <option value="Claude">Claude</option>
                <option value="Figma">Figma</option>
                <option value="Website">Website</option>
                <option value="Other">Other</option>
              </select>
            </label>

            <label class="field-label">
              <span>Your email (optional)</span>
              <input type="email" name="email" placeholder="you@example.com" />
            </label>
          </div>

          <label class="field-label">
            <span>What were you trying to do?</span>
            <textarea
              name="goal"
              rows="4"
              required
              placeholder="Example: I was trying to start Iris in Cursor and expected the connection details to appear after pressing Continue free."
            ></textarea>
          </label>

          <label class="field-label">
            <span>What happened instead?</span>
            <textarea
              name="issue"
              rows="4"
              required
              placeholder="Example: The form looked disconnected and I was not sure what the next step was."
            ></textarea>
          </label>

          <label class="field-label">
            <span>Links or screenshots (optional)</span>
            <textarea
              name="context"
              rows="3"
              placeholder="Paste a link, screenshot path, or any extra context that will help us reproduce the issue."
            ></textarea>
          </label>

          <div class="button-row">
            <button class="button button-primary" type="submit">Send support request</button>
            <a class="button button-secondary" href="${resolveSiteHref(SITE_CONFIG.startIrisHref, "../")}">Start Iris</a>
          </div>
        </form>

        <aside class="support-note">
          <p class="utility-label">For now</p>
          <h3>Manual support is still fine.</h3>
          <p>
            ${
              SITE_CONFIG.supportEmail
                ? `This form will open your email app and prepare a message to ${escapeHtml(
                    SITE_CONFIG.supportEmail
                  )}.`
                : "This form will copy a structured support request until the final support inbox is configured."
            }
          </p>
          <p class="host-detail">
            Please do not send passwords, secret keys, or other highly sensitive credentials through the support path.
          </p>
        </aside>
      </div>
    </section>

    ${
      state.error
        ? `<section class="section status-section is-error"><p>${escapeHtml(state.error)}</p></section>`
        : ""
    }
    ${
      state.notice
        ? `<section class="section status-section is-success"><p>${escapeHtml(state.notice)}</p></section>`
        : ""
    }
  `;

  renderSiteFrame({
    app,
    currentPage: "support",
    rootPrefix: "../",
    pageClass: "inner-page",
    content
  });
}

app.addEventListener("submit", async (event) => {
  const form = event.target.closest("[data-support-form]");

  if (!form) {
    return;
  }

  event.preventDefault();
  const formData = new FormData(form);

  await submitSupportRequest({
    surface: String(formData.get("surface") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    goal: String(formData.get("goal") || "").trim(),
    issue: String(formData.get("issue") || "").trim(),
    context: String(formData.get("context") || "").trim()
  });
});

renderSupportPage();
