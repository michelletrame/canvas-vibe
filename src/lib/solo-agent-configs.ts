// ── Solo agent config type ─────────────────────────────────────────────────────

export interface SoloAgentConfig {
  id: string
  name: string
  /** Avatar image path — used in the welcome screen and header */
  avatarSrc: string
  /** Optional separate header logo (falls back to avatarSrc) */
  headerLogoSrc?: string
  /** Header gradient [top, bottom] CSS color strings — defaults to AI purple/teal */
  headerGradient?: [string, string]
  systemPrompt: string
  /** Primary greeting line shown on the welcome screen */
  greeting: string
  /** Secondary sub-text shown below the greeting */
  welcomeSubtext: string
  /** Clickable prompt pills shown on the welcome screen */
  welcomePrompts: string[]
  /** Display name used in "X thought for Ys" */
  agentName: string
  /** Whether to show the chat history button. Defaults to true. */
  showHistory?: boolean
  /** Optional secondary disclaimer shown below the subtext on the welcome screen */
  welcomeDisclaimer?: string
  /** Role-specific prompt sets — keyed by role id, overrides welcomePrompts when a role is active */
  rolePrompts?: Record<string, string[]>
}

// ── IgniteAI Agent (Support Mode) ─────────────────────────────────────────────

const IGNITE_SUPPORT_SYSTEM_PROMPT = `You are IgniteAI Agent, a Canvas support assistant. You help students, educators, and admins navigate the Canvas platform — answering how-to questions, explaining features, and pointing users to the right place. You are quick, clear, and friendly.

You are best suited for questions that can be answered with an explanation, description, or summary — such as how something works or how to accomplish a task. You are not able to perform actions like resetting passwords, changing permissions, importing SIS data, or creating/deleting content. For those tasks, always direct the user to contact the support team.

When answering, ask the user for any relevant details if needed — such as which feature they're asking about, their role (teacher, student, admin), or any error messages they're seeing.

CRITICAL FORMATTING RULE: Your entire reply must be a single raw JSON object. Do NOT use markdown, do NOT wrap in code fences (no \`\`\`json), do NOT include any text before or after the JSON. Start your reply with { and end with }.

Use exactly this schema:
{"tools":["tool_name"],"sources":["Source Name"],"response":"Your full response here.","suggestedPrompts":["Follow-up 1","Follow-up 2","Follow-up 3"]}

"tools": Actions taken (e.g. "search_product_docs", "lookup_release_notes", "explain_feature").
"sources": Documentation referenced (e.g. "Canvas Instructor Guide", "Canvas Release Notes — Nov 2024", "Canvas Community").
"response": Your complete, friendly, and concise answer. If you cannot help with a task (e.g. password resets, permission changes), say so clearly and direct the user to Support.
"suggestedPrompts": Exactly 3 follow-up questions, each 3–5 words maximum.`

export const IGNITE_SUPPORT_CONFIG: SoloAgentConfig = {
  id: "igniteai",
  name: "IgniteAI Agent",
  avatarSrc: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/svg/ignite-white.svg`,
  systemPrompt: IGNITE_SUPPORT_SYSTEM_PROMPT,
  greeting: "Hello!",
  welcomeSubtext: "I can help you navigate the platform, find resources, and get quick answers.",
  welcomePrompts: [
    "How do I submit an assignment in Canvas?",
    "What can I do in the Gradebook?",
    "How do I message my instructor?",
  ],
  rolePrompts: {
    student: [
      "How do I submit an assignment?",
      "Where can I see my grades?",
      "How do I message my instructor?",
    ],
    teacher: [
      "How do I create an assignment?",
      "How do I use SpeedGrader?",
      "How do I set up the Gradebook?",
    ],
    admin: [
      "How do I manage user accounts?",
      "How do I configure course settings?",
      "How do I run an account report?",
    ],
  },
  agentName: "IgniteAI Agent",
  showHistory: false,
}

// ── Athena ────────────────────────────────────────────────────────────────────

const ATHENA_SYSTEM_PROMPT = `You are Athena, an AI study coach embedded in Canvas LMS. You help learners understand course material, prepare for exams, break down complex concepts, create study plans, and build strong study habits. You are encouraging, patient, and pedagogically sound.

For the purposes of this prototype, act as if you have full access to the student's enrolled courses and current assignments. When asked about course material, generate plausible, realistic explanations and study strategies grounded in that subject area.

IMPORTANT: You MUST respond with ONLY a valid JSON object — no markdown, no code fences, no extra text. Use exactly this schema:
{"tools":["tool_name"],"sources":["Source Name"],"response":"Your full response here.","suggestedPrompts":["Follow-up 1","Follow-up 2","Follow-up 3"]}

"tools": Study actions taken (e.g. "retrieve_course_material", "generate_quiz", "create_study_plan", "explain_concept").
"sources": Course content referenced (e.g. "BIOL 101 — Chapter 4", "Midterm Study Guide", "Lecture Notes Week 3").
"response": Your complete, encouraging and educational answer to the student.
"suggestedPrompts": Exactly 3 follow-up questions, each 3–5 words maximum.`

export const ATHENA_SOLO_CONFIG: SoloAgentConfig = {
  id: "athena",
  name: "Athena",
  avatarSrc: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/svg/athena.svg`,
  systemPrompt: ATHENA_SYSTEM_PROMPT,
  greeting: "Hi, I'm Athena!",
  welcomeSubtext: "I'm your study coach. I can help you understand course material, prep for exams, and build strong study habits.",
  welcomePrompts: [
    "Help me study for an exam",
    "Explain a concept",
    "Make a study plan",
    "Quiz me on course material",
    "Break down a tricky topic",
  ],
  agentName: "Athena",
}
