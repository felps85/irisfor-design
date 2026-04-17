import { buildPublicBetaInstallModel } from "./site-public-beta.js";

import { SITE_CONFIG, resolveRemoteMcpEndpoint } from "./site-config.js";

export const HOME_PROCESS = [
  {
    step: "01",
    title: "Understand the goal",
    copy:
      "Iris starts by understanding what you are trying to make instead of forcing you into a technical workflow first."
  },
  {
    step: "02",
    title: "Review what already exists",
    copy:
      "If you already have a page, screenshot, Figma file, or codebase, Iris should review that first before it starts suggesting risky changes."
  },
  {
    step: "03",
    title: "Explain the safest next step",
    copy:
      "Iris turns judgment into plain-language guidance, critique, or a careful plan so you can decide what should happen next."
  },
  {
    step: "04",
    title: "Move into change only when asked",
    copy:
      "Iris can help with implementation and comments later, but it should stay clear about when it is reviewing, proposing, or actually acting."
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
      "Iris helps people review, direct, and improve design and product work. It starts by understanding the goal or by reviewing what already exists before it suggests bigger changes."
  },
  {
    question: "Does Iris change files automatically?",
    answer:
      "No. Iris should stay clear about whether it is reviewing, proposing, or implementing. Changes and comment publishing should stay explicit."
  },
  {
    question: "Where can I use Iris right now?",
    answer:
      "The current public-beta story starts with Cursor, Codex, ChatGPT, and Claude, with Figma available as a secondary surface."
  },
  {
    question: "What does free include?",
    answer:
      "Free includes up to 10 interactions every 7 days during beta. No payment is required to start."
  },
  {
    question: "What does memory mean here?",
    answer:
      "Iris keeps session learning on so it can stay coherent inside the current task. Personal memory should only happen with explicit permission, and durable product learning should stay review-before-keep."
  },
  {
    question: "How does privacy work?",
    answer:
      "Iris should explain what it is using, what it inferred, and whether anything may be retained as learning. It should not silently scan or publish by default."
  },
  {
    question: "Is install really one-click yet?",
    answer:
      "Not everywhere. Cursor is the closest thing to that experience today. The other supported hosts are still guided setups, even though the shared Iris runtime stays the same."
  }
];

export const TRUST_POINTS = [
  {
    title: "No payment required to start",
    copy: "The free path is enough to begin using Iris on the supported LLM hosts."
  },
  {
    title: "Review before action",
    copy: "Iris is built to review what already exists first and move into change only when you clearly ask it to."
  },
  {
    title: "One shared judgment layer",
    copy:
      "Iris Core carries principles, taste, patterns, warnings, case studies, and operating rules across every supported surface."
  }
];

export function buildSiteInstallModel() {
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
