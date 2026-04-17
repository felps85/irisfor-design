const DEFAULT_STARTUP = {
  surface: "general_llm",
  title: "Start with the safest useful next step.",
  summary:
    "Iris should start by understanding what the user is trying to build. If the user already has a website, screenshot, file, or codebase, Iris should review that first before suggesting changes.",
  plainLanguageNote:
    "Plain-language note: Iris starts by understanding what is already there and by taking the safest useful next step.",
  firstPrompt:
    "Tell Iris what you are trying to build, or share the website, screenshot, file, or codebase you already have.",
  transparency:
    "Iris should explain what it thinks you need, then help from there without forcing you to learn internal modes first.",
  suggestedActions: [
    "Understand what the user is trying to build before generating output.",
    "Review what already exists before proposing risky changes.",
    "Explain the next step in plain language and let the user redirect if needed."
  ]
};

const DEFAULT_IRIS_CORE = {
  name: "Iris Core",
  status: "active",
  surface: "general_llm",
  summary:
    "Iris Core is Iris's structured judgment layer for principles, taste, patterns, warnings, case studies, and operating rules.",
  surfaceSummary:
    "Iris Core is active in startup guidance, direction sessions, critique output, and remote MCP-based LLM flows.",
  defaultRule:
    "Durable knowledge stays review-before-keep by default. Iris should promote reviewed, reusable judgment rather than storing raw chat."
};

const DEFAULT_HOSTS = [
  {
    id: "cursor",
    name: "Cursor",
    status: "primary",
    installType: "one_click_candidate",
    installExperience: "easy",
    installDifficultyLabel: "Closest thing to one-click",
    capabilityLabel: "Easiest path",
    ctaLabel: "Add to Cursor",
    summary:
      "The easiest place to bring Iris close to the work when you want review and direction without much setup.",
    setupCopy:
      "Unlock one Iris connection, paste it into Cursor, and start with a review-first prompt.",
    steps: [
      "Start free once from the Iris site.",
      "Add the Iris connection in Cursor.",
      "Begin with the first prompt so Iris reviews before changing anything."
    ],
    firstPrompt: "Review this project first and tell me the safest next step before we change anything.",
    irisCoreSummary:
      "Iris Core is active in startup guidance, direction sessions, critique output, and remote MCP-based LLM flows."
  },
  {
    id: "codex",
    name: "Codex",
    status: "primary",
    installType: "technical_remote_mcp",
    installExperience: "technical",
    installDifficultyLabel: "Single-command technical path",
    capabilityLabel: "Technical install",
    ctaLabel: "Start in Codex",
    summary:
      "The cleanest technical path when you want Iris near build, review, and system work.",
    setupCopy:
      "Copy one setup block into Codex, then start with a review-first prompt.",
    steps: [
      "Start free once from the Iris site.",
      "Paste the setup block into Codex.",
      "Start with a review-first prompt before implementation."
    ],
    firstPrompt: "Review this codebase and the design system before we implement the next change.",
    irisCoreSummary:
      "Iris Core is active in review, direction, system translation, and code-adjacent flows so build work inherits the same judgment layer."
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    status: "primary",
    installType: "guided_remote_mcp",
    installExperience: "guided",
    installDifficultyLabel: "Guided setup",
    capabilityLabel: "Guided install",
    ctaLabel: "Set up in ChatGPT",
    summary:
      "A familiar place to use Iris for product thinking, critique, and careful direction.",
    setupCopy:
      "Turn on Developer mode, add Iris once, and keep the same connection for future sessions.",
    steps: [
      "Turn on Developer mode in ChatGPT settings.",
      "Add Iris as a remote connection.",
      "Start with the first prompt and let Iris explain the safest next step."
    ],
    firstPrompt: "Review this page and tell me what is working before we decide what to change.",
    irisCoreSummary:
      "Iris Core is active in startup guidance, direction sessions, critique output, and remote MCP-based LLM flows."
  },
  {
    id: "claude",
    name: "Claude",
    status: "primary",
    installType: "guided_remote_mcp",
    installExperience: "guided",
    installDifficultyLabel: "Guided setup",
    capabilityLabel: "Guided install",
    ctaLabel: "Set up in Claude",
    summary:
      "A quieter guided path for critique, framing, and review-first reasoning.",
    setupCopy:
      "Add the Iris connection in Claude MCP settings, then start with the first prompt.",
    steps: [
      "Open Claude MCP setup for a remote server.",
      "Paste in the Iris connection details.",
      "Start with the first prompt so Iris reviews before proposing changes."
    ],
    firstPrompt: "Review this interface and tell me what deserves attention before we make changes.",
    irisCoreSummary:
      "Iris Core is active in startup guidance, direction sessions, critique output, and remote MCP-based LLM flows."
  }
];

const DEFAULT_PRICING = [
  {
    id: "free",
    name: "Free",
    priceLabel: "EUR 0",
    summary:
      "Up to 10 interactions every 7 days across all modes, with review-first onboarding and no payment required to start.",
    accessModel: "default"
  }
];

const DEFAULT_TRANSPARENCY_NOTES = [
  "Iris starts by understanding what the user is trying to build before suggesting risky changes.",
  "If the user already has a live site, screenshot, file, or codebase, Iris should review that first.",
  "Iris should explain the starting point in plain language and avoid technical jargon when possible.",
  "Iris should not imply that code, comments, or live systems were changed unless that step was explicitly requested."
];

const DEFAULT_LEARNING_NOTES = [
  "Session learning is on by default so Iris can stay coherent inside the current task.",
  "Personal memory should only be kept with explicit user permission.",
  "Shared product learning should come from structured accepted or rejected outcomes, not silent transcript retention."
];

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function buildPublicBetaInstallModel(options = {}) {
  return {
    productName: options.productName || "Iris",
    endpoint:
      options.endpoint ||
      "https://rfgulhwmpedzafgrasar.supabase.co/functions/v1/remote-mcp",
    startup: deepClone(DEFAULT_STARTUP),
    irisCore: deepClone(DEFAULT_IRIS_CORE),
    pricing: deepClone(DEFAULT_PRICING),
    betaAccessNote:
      "During beta, selected users can receive Pro-level access without payment while Iris learns from real usage.",
    hosts: deepClone(DEFAULT_HOSTS),
    transparencyNotes: deepClone(DEFAULT_TRANSPARENCY_NOTES),
    learningNotes: deepClone(DEFAULT_LEARNING_NOTES)
  };
}
