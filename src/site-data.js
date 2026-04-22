import { buildPublicBetaInstallModel } from "./site-public-beta.js";

import { SITE_CONFIG, resolveRemoteMcpEndpoint } from "./site-config.js";

export const HOME_PROCESS = [
  {
    step: "01",
    title: "Add Iris quickly",
    copy:
      "Choose the host you already use and get Iris into the workflow without starting from backend details."
  },
  {
    step: "02",
    title: "Review what already exists",
    copy:
      "If you already have a page, screenshot, Figma file, or codebase, Iris should review that first before it starts suggesting risky changes."
  },
  {
    step: "03",
    title: "Connect Iris for Iris Core",
    copy:
      "When the work gets deeper, Iris should prepare the right connection for that host so Iris Core can unlock stronger review, continuity, and shared intelligence."
  },
  {
    step: "04",
    title: "Keep moving with context",
    copy:
      "Once connected, Iris can stay consistent across critique, direction, and implementation support without losing the review-first posture."
  }
];

export const HOME_SURFACES = [
  {
    name: "Cursor",
    emphasis: "Easiest path",
    copy:
      "The cleanest non-technical starting point when you want Iris near your working files without a lot of setup language."
  },
  {
    name: "Codex",
    emphasis: "Technical path",
    copy:
      "A strong fit for people who want Iris inside build, review, and system work with one clear command to get started."
  },
  {
    name: "ChatGPT",
    emphasis: "Guided path",
    copy:
      "A familiar place to use Iris for direction, critique, and product thinking without turning the experience into infrastructure."
  },
  {
    name: "Claude",
    emphasis: "Guided path",
    copy:
      "A calmer surface for critique, framing, and careful reasoning when you want Iris to review before anything changes."
  },
  {
    name: "Figma",
    emphasis: "Secondary beta surface",
    copy:
      "Iris also works in Figma for review-first critique and explicit comment publishing, but this site centers the LLM onboarding story first."
  }
];

export const FAQ_ITEMS = [
  {
    question: "What does Iris actually do?",
    answer:
      "Iris helps you review work, understand what matters, and decide the safest next step before bigger changes."
  },
  {
    question: "Does Iris change files automatically?",
    answer:
      "No. Iris should stay clear about whether it is reviewing, proposing, or implementing. Changes stay explicit."
  },
  {
    question: "Where can I use Iris right now?",
    answer:
      "Cursor, Codex, ChatGPT, and Claude are in the main beta path. Figma is available as a secondary surface."
  },
  {
    question: "What does free include?",
    answer:
      "Free includes up to 10 interactions every 7 days during beta. No payment is required to start."
  },
  {
    question: "Why does Iris ask me to connect after install?",
    answer:
      "The quick add gets Iris into your workflow fast. Connecting turns on the fuller runtime for deeper review, continuity across work, and shared intelligence."
  },
  {
    question: "How does privacy work?",
    answer:
      "Iris should explain what it is using and what it inferred. It should not silently scan or publish by default."
  },
  {
    question: "Is install really one-click yet?",
    answer:
      "Not everywhere. Host-native install still depends on what each product supports, but Iris now generates the ready setup block or exact connection values for every supported host so people are not left assembling the config themselves."
  }
];

export const TRUST_POINTS = [
  {
    title: "Free to start",
    copy: "The beta path is enough to begin using Iris on the supported hosts."
  },
  {
    title: "Review before change",
    copy: "Iris is built to review what already exists first and move into change only when you clearly ask it to."
  },
  {
    title: "Clear connection path",
    copy: "Iris should get into the host quickly, then prepare the right connection details instead of leaving you with loose pieces."
  }
];

export function buildSiteInstallModel(options = {}) {
  return buildPublicBetaInstallModel({
    productName: SITE_CONFIG.appName,
    endpoint: resolveRemoteMcpEndpoint(),
    surface: "general_llm"
  });
}

export function mergeInstallModel(baseModel, payload = {}) {
  return {
    ...baseModel,
    endpoint: payload.endpoint || baseModel.endpoint,
    startup: payload.startup || baseModel.startup,
    irisCore: payload.irisCore || baseModel.irisCore,
    pricing: Array.isArray(payload.pricing) ? payload.pricing : baseModel.pricing,
    betaAccessNote: payload.betaAccessNote || baseModel.betaAccessNote,
    hosts: Array.isArray(payload.hosts) && payload.hosts.length > 0 ? payload.hosts : baseModel.hosts,
    transparencyNotes:
      Array.isArray(payload.transparencyNotes) && payload.transparencyNotes.length > 0
        ? payload.transparencyNotes
        : baseModel.transparencyNotes,
    learningNotes:
      Array.isArray(payload.learningNotes) && payload.learningNotes.length > 0
        ? payload.learningNotes
        : baseModel.learningNotes
  };
}
