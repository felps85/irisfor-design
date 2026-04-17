import "./styles.css";

import { renderSiteFrame } from "./site-shell.js";

const app = document.querySelector("#app");

const content = `
  <section class="hero-section inner-hero">
    <div class="hero-copy">
      <p class="overline">Privacy</p>
      <h1 class="display-title">Keep the beta honest about what Iris sees, stores, and changes.</h1>
      <p class="lead">
        Iris helps people review, direct, and improve design and product work. This page explains
        what Iris may receive, what it should not do by default, and how learning and user control
        work during public beta.
      </p>
    </div>
    <aside class="hero-panel">
      <p class="utility-label">Default posture</p>
      <p>Iris should review before it acts, stay clear about when it is publishing or changing anything, and avoid silent retention as a default learning model.</p>
    </aside>
  </section>

  <section class="section">
    <div class="section-intro">
      <p class="overline">What this covers</p>
      <h2>The website, supported LLM hosts, and the Figma surface.</h2>
    </div>
    <div class="surface-grid">
      <article class="surface-card">
        <h3>Included surfaces</h3>
        <ul class="quiet-list compact-list">
          <li>the Iris website</li>
          <li>remote MCP installs for the supported LLM hosts</li>
          <li>the Iris Figma plugin</li>
          <li>hosted account and billing flows when they are active</li>
        </ul>
      </article>
      <article class="surface-card">
        <h3>What Iris may receive</h3>
        <ul class="quiet-list compact-list">
          <li>account and sign-in state</li>
          <li>prompts and instructions</li>
          <li>screenshots, files, links, or code the user explicitly shares</li>
          <li>Figma file or node context the user explicitly reviews</li>
        </ul>
      </article>
      <article class="surface-card">
        <h3>What Iris should not do by default</h3>
        <ul class="quiet-list compact-list">
          <li>silently edit a live site or codebase</li>
          <li>silently publish Figma comments</li>
          <li>scan every file in a user account</li>
          <li>treat every chat as durable memory</li>
        </ul>
      </article>
    </div>
  </section>

  <section class="section">
    <div class="section-intro">
      <p class="overline">Learning and memory</p>
      <h2>Conservative by default.</h2>
    </div>
    <div class="surface-grid">
      <article class="surface-card">
        <h3>Session learning</h3>
        <p>On by default so Iris can stay coherent during the current task.</p>
      </article>
      <article class="surface-card">
        <h3>Personal memory</h3>
        <p>Should only be enabled with explicit user permission.</p>
      </article>
      <article class="surface-card">
        <h3>Shared product learning</h3>
        <p>Should come from reviewed outcomes and structured learning signals, not silent transcript hoarding.</p>
      </article>
    </div>
  </section>

  <section class="section">
    <div class="section-intro">
      <p class="overline">User control</p>
      <h2>What people should always understand.</h2>
    </div>
    <ul class="quiet-list">
      <li>whether Iris is reviewing, proposing, prototyping, or implementing</li>
      <li>whether anything real changed</li>
      <li>what may be retained as product learning</li>
      <li>how to correct Iris if it inferred the wrong starting point</li>
    </ul>
  </section>
`;

renderSiteFrame({
  app,
  currentPage: "privacy",
  rootPrefix: "../",
  pageClass: "inner-page",
  content
});
