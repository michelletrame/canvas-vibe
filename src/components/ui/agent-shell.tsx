"use client"

import * as React from "react"
import {
  SquarePen,
  History,
  X,
  Plus,
  ArrowUp,
  Upload,
  ExternalLink,
  Wand2,
  Library,
  Hand,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  ChevronLeft,
  MoreVertical,
  Trash2,
  LoaderCircle,
  Square,
  Redo2,
  Info,
  type LucideIcon,
} from "lucide-react"

import ReactMarkdown from "react-markdown"

import { cn } from "@/lib/utils"
import { Icon } from "@/components/ui/icon"
import { Link } from "@/components/ui/link"
import { buttonVariants } from "@/components/ui/button"
import { ToggleButton } from "@/components/ui/toggle-button"
import { Menu, MenuTrigger, MenuContent, MenuItem } from "@/components/ui/menu"
import { Popover, PopoverTrigger, PopoverContent, PopoverClose } from "@/components/ui/popover"
import { streamOllamaChat, type OllamaMessage } from "@/lib/ollama"

// ── Types ──────────────────────────────────────────────────────────────────────

export interface AgentShellItem {
  id: string
  icon?: LucideIcon
  /** Image src rendered instead of icon (e.g. custom SVG/PNG logos) */
  imageSrc?: string
  label: string
  description?: string
  /** Optional right-side label (e.g. "Start here") */
  badge?: string
  badgeVariant?: "primary" | "neutral"
  onClick?: () => void
}

export interface AgentShellSection {
  title?: string
  items: AgentShellItem[]
}

// ── Default welcome content ────────────────────────────────────────────────────

export const DEFAULT_SUGGESTED_PROMPTS = [
  "List recent submissions",
  "Create announcement",
  "Student engagement",
]

export const DEFAULT_SECTIONS: AgentShellSection[] = [
  {
    items: [
      {
        id: "prompt-builder",
        icon: Wand2,
        label: "Prompt builder",
        description: "Generate common prompts",
        badge: "Start here",
      },
      {
        id: "community-library",
        icon: Library,
        label: "Community library",
        description: "Browse and contribute community prompts",
        onClick: () => window.open("https://community.instructure.com/en/discussion/664881/share-your-igniteai-agent-prompts-here?tab=all", "_blank", "noopener,noreferrer"),
      },
      // {
      //   id: "chats",
      //   icon: History,
      //   label: "Chat history",
      //   description: "Access previous agent conversations",
      // },
      // {
      //   id: "saved-prompts",
      //   icon: Bookmark,
      //   label: "Saved prompts",
      //   description: "Re-use and share your favorite prompts",
      // },
    ],
  },
  {
    title: "Agent modes",
    items: [
      {
        id: "igniteai",
        imageSrc: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/svg/ignite-color.svg`,
        label: "IgniteAI Agent",
        description: "AI agent tools for educators",
        badge: "Default",
        badgeVariant: "neutral",
      },
      {
        id: "athena",
        imageSrc: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/svg/athena.svg`,
        label: "Study with Athena",
        description: "Chat with a study coach for learners",
      },
      {
        id: "pandabot",
        imageSrc: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/svg/pandabot.svg`,
        label: "PandaBot",
        description: "Ask questions and get support for Canvas",
      },
    ],
  },
]

// ── System prompts ────────────────────────────────────────────────────────────

const DEFAULT_SYSTEM_PROMPT = `You are IgniteAI Agent, an AI assistant prototype embedded in Canvas LMS. You are demoing what a fully integrated Canvas AI agent would look like — one with real-time access to the teacher's courses, assignments, grades, submissions, announcements, and calendar.

For the purposes of this prototype, act as if you have full access to the teacher's Canvas data. When asked about their courses, assignments, grades, or activity, respond with plausible, realistic-sounding details as if you retrieved them from Canvas. Make up reasonable course names, due dates, grade data, and student activity that feel authentic to a real Canvas environment. Never break character or say you don't have access to real data — this is a prototype interaction demo.

The user is a TEACHER. You help them design better learning experiences, surface insights from grading and engagement data, manage their courses and assignments, and assist with Canvas configuration and workflows. Keep responses clear, specific, and grounded in Canvas terminology (SpeedGrader, Modules, Outcomes, Rubrics, etc.).

IMPORTANT: You MUST respond with ONLY a valid JSON object — no markdown, no code fences, no extra text. Use exactly this schema:
{"tools":["tool_name"],"sources":["Source Name"],"response":"Your full response here.","suggestedPrompts":["Follow-up 1","Follow-up 2","Follow-up 3"]}

"tools": Canvas API calls you simulated (e.g. "list_courses", "get_assignments", "get_grades", "get_submissions", "get_announcements").
"sources": Specific Canvas data you accessed (e.g. "BIOL 101 — Spring 2025", "Unit 2 Module", "Midterm Essay Assignment").
"response": Your complete, well-written answer to the user.
"suggestedPrompts": Exactly 3 follow-up questions, each 3–4 words maximum (e.g. "Show my grades", "List upcoming assignments", "Who's missing work?").`

const PANDABOT_SYSTEM_PROMPT = `You are PandaBot, a friendly Canvas LMS support assistant embedded in Canvas. Help users navigate Canvas, submit assignments, find grades, manage notifications, and troubleshoot common issues. Keep responses concise and practical.

IMPORTANT: You MUST respond with ONLY a valid JSON object — no markdown, no code fences, no extra text. Use exactly this schema:
{"tools":["tool_name"],"sources":["Source Name"],"response":"Your full response here.","suggestedPrompts":["Follow-up 1","Follow-up 2","Follow-up 3"]}

"tools": Canvas support actions taken (e.g. "find_assignment", "check_submission_status", "locate_grades").
"sources": Canvas features or pages referenced (e.g. "Assignments page", "Grades tab", "Notification settings").
"response": Your complete, friendly and concise answer to the user.
"suggestedPrompts": Exactly 3 follow-up questions, each 3–5 words maximum.`

const PANDABOT_GREETING = `Hi! I'm **PandaBot**, your Canvas support assistant. I can help you navigate Canvas, submit assignments, find your grades, set up notifications, and troubleshoot common issues. What do you need help with today?`

const PANDABOT_PROMPTS = [
  "How do I submit an assignment?",
  "Where are my grades?",
  "Set up notifications",
]

const ATHENA_SYSTEM_PROMPT = `You are Athena, an AI study coach embedded in Canvas LMS. You help learners understand course material, prepare for exams, break down complex concepts, create study plans, and build strong study habits. You are encouraging, patient, and pedagogically sound.

For the purposes of this prototype, act as if you have full access to the student's enrolled courses and current assignments. When asked about course material, generate plausible, realistic explanations and study strategies grounded in that subject area.

IMPORTANT: You MUST respond with ONLY a valid JSON object — no markdown, no code fences, no extra text. Use exactly this schema:
{"tools":["tool_name"],"sources":["Source Name"],"response":"Your full response here.","suggestedPrompts":["Follow-up 1","Follow-up 2","Follow-up 3"]}

"tools": Study actions taken (e.g. "retrieve_course_material", "generate_quiz", "create_study_plan", "explain_concept").
"sources": Course content referenced (e.g. "BIOL 101 — Chapter 4", "Midterm Study Guide", "Lecture Notes Week 3").
"response": Your complete, encouraging and educational answer to the student.
"suggestedPrompts": Exactly 3 follow-up questions, each 3–5 words maximum.`

const ATHENA_GREETING = `Hi! I'm **Athena**, your study coach. I can help you understand course material, prep for exams, create study plans, and break down tricky concepts. What are you working on?`

const ATHENA_PROMPTS = [
  "Help me study for an exam",
  "Explain a concept",
  "Make a study plan",
]

const IGNITE_RETURN_GREETING = `Hi! I'm **IgniteAI Agent**, your AI assistant built for educators. I have access to your courses, submissions, gradebooks, and Canvas activity. What would you like to work on?`

const IGNITE_PROMPTS = [
  "List my courses",
  "List recent submissions",
  "Create an announcement",
]

// ── Section item ──────────────────────────────────────────────────────────────

function SectionItem({ item }: { item: AgentShellItem }) {
  const IconComp = item.icon
  return (
    <button
      onClick={item.onClick}
      className="flex items-center gap-4 text-left p-4 rounded-2xl w-full bg-white transition-colors hover:bg-[var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
      style={{ border: "1px solid #e8eaec" }}
    >
      {item.imageSrc
        ? <img src={item.imageSrc} width={24} height={24} alt="" aria-hidden className="shrink-0" />
        : IconComp && <Icon icon={IconComp} size="lg" color="info" />}
      <div className="flex-1 min-w-0">
        <p
          className="font-bold leading-[1.25]"
          style={{ fontFamily: "var(--font-heading)", fontSize: 16, color: "var(--foreground)" }}
        >
          {item.label}
        </p>
        {item.description && (
          <p className="text-sm leading-snug mt-0.5" style={{ color: "var(--color-text-muted)" }}>
            {item.description}
          </p>
        )}
      </div>
      {item.badge && (
        <span
          className="shrink-0 text-sm font-semibold px-2 py-1 rounded-lg whitespace-nowrap bg-white"
          style={item.badgeVariant === "neutral"
            ? { border: "1px solid var(--color-stroke-base)", color: "var(--muted-foreground)" }
            : { border: "1px solid var(--primary)", color: "var(--primary)" }}
        >
          {item.badge}
        </span>
      )}
    </button>
  )
}

// ── JSON repair helper ────────────────────────────────────────────────────────

/**
 * Repair malformed LLM JSON by reconstructing the string with correct closers.
 * Handles both truncated output (missing closers at end) and mismatched closers
 * e.g. `["a","b","c"}` → `["a","b","c"]}`.
 */
function repairJson(s: string): string {
  const openFor: Record<string, string> = { "{": "}", "[": "]" }
  const stack: string[] = []
  let inString = false
  let escape = false
  let result = ""

  for (const ch of s) {
    if (escape)                    { escape = false; result += ch; continue }
    if (ch === "\\" && inString)   { escape = true;  result += ch; continue }
    if (ch === '"')                { inString = !inString; result += ch; continue }
    if (inString)                  { result += ch; continue }

    if (ch === "{" || ch === "[") {
      stack.push(openFor[ch])
      result += ch
    } else if (ch === "}" || ch === "]") {
      if (stack.length > 0 && stack[stack.length - 1] === ch) {
        stack.pop()
        result += ch
      } else if (stack.length > 0) {
        while (stack.length > 0 && stack[stack.length - 1] !== ch) {
          result += stack.pop()!
        }
        if (stack.length > 0 && stack[stack.length - 1] === ch) {
          stack.pop()
          result += ch
        }
      }
      // else: extra closer with empty stack — skip it
    } else {
      result += ch
    }
  }

  return result + stack.reverse().join("")
}

// ── Structured response type ───────────────────────────────────────────────────

type AgentCard =
  | { type: "feature_link"; label: string; href: string; description?: string }
  // | { type: "course_list"; courses: { id: string; name: string }[] }

interface AssistantResponse {
  tools?: string[]
  sources?: string[]
  response: string
  suggestedPrompts?: string[]
  card?: AgentCard
}

// ── Agent routing ──────────────────────────────────────────────────────────────

type AgentMode = "default" | "pandabot" | "athena"
type RouteType = "mode" | "feature_link"

interface AgentRoute {
  id: string
  pattern: RegExp
  type: RouteType
  mode?: AgentMode
  /** For feature_link routes */
  featureName?: string
  href?: string
  cardDescription?: string
}

function getFeatureLinkSystemPrompt(featureName: string, href: string, cardDescription?: string): string {
  return `You are IgniteAI Agent, a Canvas LMS assistant. The user wants to use the ${featureName} feature.

Let them know that Canvas has a dedicated ${featureName} that is purpose-built for this — and that this functionality is not available directly in the agent. Be helpful and friendly, not apologetic.

IMPORTANT: You MUST respond with ONLY a valid JSON object:
{"tools":[],"sources":[],"response":"Your 2-3 sentence response directing them to the ${featureName} feature.","card":{"type":"feature_link","label":"${featureName}","href":"${href}","description":"${cardDescription ?? ""}"}}

Only return valid JSON. Do not include a suggestedPrompts field.`
}

const AGENT_ROUTES: AgentRoute[] = [
  {
    id: "pandabot",
    pattern: /\bpandabot\b/i,
    type: "mode",
    mode: "pandabot",
  },
  {
    id: "athena",
    pattern: /\bathena\b/i,
    type: "mode",
    mode: "athena",
  },
  {
    id: "rubric",
    pattern: /\b(generate|create|make|build)\s+(a\s+)?rubric\b/i,
    type: "feature_link",
    mode: "default",
    featureName: "Rubric Generator",
    href: "#rubric-builder",
    cardDescription: "Canvas's built-in tool for creating and managing rubrics.",
  },
  {
    id: "course_builder",
    pattern: /\b(create|build|make|set\s+up|design)\s+(a\s+)?course\b/i,
    type: "feature_link",
    mode: "default",
    featureName: "Course Builder",
    href: "#course-builder",
    cardDescription: "Canvas's built-in tool for creating and structuring courses.",
  },
]

function matchRoute(input: string): AgentRoute | null {
  return AGENT_ROUTES.find(r => r.pattern.test(input)) ?? null
}

/** Strip the matched route's trigger word + trailing punctuation from the message */
function stripTrigger(text: string, pattern: RegExp): string {
  return text.replace(pattern, "").replace(/^[\s,.:;!?]+/, "").trim()
}

// ── Canned bubble ─────────────────────────────────────────────────────────────

function CannedBubble({ content }: { content: string }) {
  return (
    <div className="text-base leading-relaxed agent-markdown" style={{ color: "var(--foreground)" }}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  )
}

// ── Animated success check icon ───────────────────────────────────────────────

function AnimatedCheckIcon({ size = 20 }: { size?: number }) {
  const circleRef = React.useRef<SVGPathElement>(null)
  const checkRef  = React.useRef<SVGPathElement>(null)

  React.useEffect(() => {
    const circle = circleRef.current
    const check  = checkRef.current
    if (!circle || !check) return

    // Circle draw
    const cLen = circle.getTotalLength()
    circle.style.strokeDasharray  = String(cLen)
    circle.style.strokeDashoffset = String(cLen)
    const t1 = setTimeout(() => {
      circle.style.transition     = "stroke-dashoffset 0.35s ease-out"
      circle.style.strokeDashoffset = "0"
    }, 30)

    // Checkmark draw after circle finishes
    const kLen = check.getTotalLength()
    check.style.strokeDasharray  = String(kLen)
    check.style.strokeDashoffset = String(kLen)
    const t2 = setTimeout(() => {
      check.style.transition      = "stroke-dashoffset 0.35s ease-out"
      check.style.strokeDashoffset = "0"
    }, 400)

    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <g clipPath="url(#clip-animated-check)">
        <path
          ref={circleRef}
          d="M18.1676 8.33332C18.5482 10.2011 18.2769 12.1428 17.3991 13.8348C16.5213 15.5268 15.09 16.8667 13.3438 17.6311C11.5977 18.3955 9.64227 18.5381 7.80367 18.0353C5.96506 17.5325 4.35441 16.4145 3.24031 14.8678C2.12622 13.3212 1.57602 11.4394 1.68147 9.53615C1.78692 7.63294 2.54165 5.8234 3.81979 4.4093C5.09793 2.9952 6.82223 2.06202 8.70514 1.76537C10.588 1.46872 12.5157 1.82654 14.1667 2.77916"
          stroke="var(--color-success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        />
        <path
          ref={checkRef}
          d="M7.5 9.16667L10 11.6667L18.3333 3.33333"
          stroke="var(--color-success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip-animated-check">
          <rect width="20" height="20" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  )
}

// ── Animated dots ─────────────────────────────────────────────────────────────

function AnimatedDots() {
  const [dots, setDots] = React.useState(".")
  React.useEffect(() => {
    const frames = [".", "..", "..."]
    let i = 0
    const id = setInterval(() => { i = (i + 1) % frames.length; setDots(frames[i]) }, 500)
    return () => clearInterval(id)
  }, [])
  return <span style={{ display: "inline-block", minWidth: "1.75ch" }}>{dots}</span>
}

// ── Conversation sub-components ───────────────────────────────────────────────

function UserBubble({ content }: { content: string }) {
  return (
    <div className="flex justify-end pl-6">
      <div
        className="text-base leading-relaxed px-4 py-3 rounded-2xl"
        style={{ backgroundColor: "white", border: "1px solid #e8eaec", color: "var(--foreground)" }}
      >
        {content}
      </div>
    </div>
  )
}

// ── Agent card renderer ────────────────────────────────────────────────────────

function FeatureCard({ label, href, description }: { label: string; href: string; description?: string }) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ""
  return (
    <a
      href={href}
      className="flex items-center justify-between gap-3 mt-2 px-4 py-3 rounded-xl no-underline transition-colors hover:bg-[var(--muted)]"
      style={{ border: "1px solid #e8eaec", color: "inherit" }}
    >
      <div className="flex items-center gap-3">
        <img src={`${base}/svg/canvas.svg`} alt="Canvas" width={28} height={28} style={{ flexShrink: 0 }} />
        <div className="flex flex-col gap-0.5">
          <span style={{ fontFamily: "var(--font-heading)", fontSize: 16, fontWeight: 600, color: "#273540" }}>{label}</span>
          {description && <span className="text-sm" style={{ color: "#576773" }}>{description}</span>}
        </div>
      </div>
      <Icon icon={ExternalLink} size="md" color="info" />
    </a>
  )
}

function renderAgentCard(card: AgentCard) {
  return <FeatureCard label={card.label} href={card.href} description={card.description} />
}

function AssistantBubble({
  content: _content,
  structured,
  elapsedSec,
  isStreaming = false,
  agentName = "IgniteAI Agent",
  onRetry,
}: {
  content: string
  structured?: AssistantResponse
  elapsedSec: number | null
  isStreaming?: boolean
  agentName?: string
  onRetry?: () => void
}) {
  const [copied, setCopied] = React.useState(false)
  const [detailsOpen, setDetailsOpen] = React.useState(false)
  const [feedback, setFeedback] = React.useState<"up" | "down" | null>(null)
  const responseText: string | null = structured?.response ?? (isStreaming ? "" : null)

  function handleCopy() {
    navigator.clipboard.writeText(responseText ?? "").then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const hasDetails = !isStreaming && !!(structured?.tools?.length || structured?.sources?.length)

  return (
    <div className="flex flex-col gap-3">
      {/* Generation time / thinking badge — or error header */}
      <div className="flex items-center gap-2">
        {isStreaming ? (
          <>
            <LoaderCircle size={20} strokeWidth={2} className="animate-spin" style={{ color: "#576773" }} />
            <span className="text-base font-semibold" style={{ color: "#576773" }}>Thinking<AnimatedDots /></span>
          </>
        ) : !isStreaming && responseText === null ? (
          <>
            <Info size={20} strokeWidth={1.5} style={{ color: "#cf1f24", flexShrink: 0 }} />
            <span className="text-base font-semibold" style={{ color: "#cf1f24" }}>Response could not be parsed</span>
          </>
        ) : elapsedSec !== null ? (
          <button
            onClick={() => hasDetails && setDetailsOpen(o => !o)}
            className="flex items-center gap-2"
            style={{ cursor: hasDetails ? "pointer" : "default", background: "none", border: "none", padding: 0 }}
          >
            <AnimatedCheckIcon size={20} />
            <span className="text-base font-semibold" style={{ color: "var(--color-success)" }}>{agentName} thought for {elapsedSec}s</span>
            {hasDetails && (
              <ChevronDown
                size={20}
                strokeWidth={1.5}
                style={{ color: "var(--color-success)", transform: detailsOpen ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform 0.15s ease" }}
              />
            )}
          </button>
        ) : null}
      </div>

      {/* Nested details: tools + sources */}
      {hasDetails && detailsOpen && (
        <div style={{ paddingLeft: 16 }}>
          <div className="flex flex-col gap-3" style={{ borderLeft: "1px solid #8d959f", paddingLeft: 16 }}>
            {!!structured?.tools?.length && (
              <div className="flex flex-col" style={{ gap: 2 }}>
                <span style={{ fontSize: 14, color: "#576773" }}>Tools</span>
                <span style={{ fontSize: 14, color: "#273540" }}>{structured.tools.join(", ")}</span>
              </div>
            )}
            {!!structured?.sources?.length && (
              <div className="flex flex-col" style={{ gap: 2 }}>
                <span style={{ fontSize: 14, color: "#576773" }}>Sources</span>
                <span style={{ fontSize: 14, color: "#273540" }}>{structured.sources.join(", ")}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {responseText ? (
        <div className="text-base leading-relaxed agent-markdown" style={{ color: "var(--foreground)" }}>
          <ReactMarkdown>{responseText}</ReactMarkdown>
        </div>
      ) : !isStreaming && responseText === null ? (
        <div className="flex flex-col gap-3">
          <p className="text-base" style={{ color: "#273540" }}>The agent returned an unexpected format. Your conversation is still intact.</p>
          {onRetry && (
            <button onClick={onRetry} className={cn(buttonVariants({ variant: "tertiary", size: "sm" }), "self-start")}>
              <Redo2 size={16} strokeWidth={1.5} />
              Try again
            </button>
          )}
        </div>
      ) : null}

      {/* Feedback row — shown once done */}
      {!isStreaming && responseText && (
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            aria-label="Copy response"
            className={cn(buttonVariants({ variant: "tertiary", size: "sm" }), "w-8 px-0")}
          >
            {copied
              ? <Check size={16} strokeWidth={2} style={{ color: "var(--color-success)" }} />
              : <Copy size={16} strokeWidth={1.5} />}
          </button>
          <ToggleButton
            icon={ThumbsUp}
            size="sm"
            aria-label="Helpful"
            pressed={feedback === "up"}
            onPressedChange={on => setFeedback(on ? "up" : null)}
            className="border border-[var(--btn-tertiary-stroke)]"
          />
          <ToggleButton
            icon={ThumbsDown}
            size="sm"
            aria-label="Not helpful"
            pressed={feedback === "down"}
            onPressedChange={on => setFeedback(on ? "down" : null)}
            className="border border-[var(--btn-tertiary-stroke)]"
          />
        </div>
      )}

      {!isStreaming && structured?.card && renderAgentCard(structured.card)}

    </div>
  )
}

// ── Chat history ───────────────────────────────────────────────────────────────

const HISTORY_ITEMS = [
  {
    date: "12/31/2025",
    conversations: [
      "Review geometry proofs for the Unit 4 quiz",
      "Build a weekly study plan across classes",
      "Get feedback on my English essay draft",
    ],
  },
  {
    date: "12/30/2025",
    conversations: [
      "Create a catch up plan for overdue work",
      "Practice biology terms with quick flashcards",
      "Prepare for tomorrow's chemistry lab checklist",
    ],
  },
  {
    date: "12/29/2025",
    conversations: [
      "List students missing the midterm essay",
      "Show grade distribution for BIOL 101",
      "Draft an announcement for the upcoming exam",
    ],
  },
]

function HistoryView({ onBack }: { onBack: () => void }) {
  const [openMenu, setOpenMenu] = React.useState<string | null>(null)

  return (
    <div className="flex flex-col gap-6 px-6 pt-6 pb-6">
      {/* Back + title */}
      <div className="flex flex-col gap-4">
        <Link
          href="#"
          size="sm"
          icon={ChevronLeft}
          onClick={(e) => { e.preventDefault(); onBack() }}
          className="self-start"
        >
          Back
        </Link>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 24, fontWeight: 700, color: "#273540", lineHeight: 1.25 }}>
          Chat History
        </h2>
      </div>

      {/* Date groups */}
      {HISTORY_ITEMS.map((group) => (
        <div key={group.date} className="flex flex-col gap-4">
          <p style={{ fontFamily: "var(--font-heading)", fontSize: 16, fontWeight: 600, color: "#273540", lineHeight: 1.25 }}>
            {group.date}
          </p>
          <div className="flex flex-col">
            {group.conversations.map((title, i) => (
              <React.Fragment key={title}>
                {i > 0 && <div style={{ height: 1, backgroundColor: "#e8eaec" }} />}
                <div className="flex items-center gap-4 py-3 w-full">
                  <Link
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="flex-1 min-w-0 truncate"
                  >
                    {title}
                  </Link>
                  <Menu
                    open={openMenu === title}
                    onOpenChange={(o) => setOpenMenu(o ? title : null)}
                  >
                    <MenuTrigger>
                      <button
                        aria-label="Options"
                        className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[var(--icon-base)] transition-colors hover:bg-[var(--btn-tertiary-bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-info)]"
                      >
                        <MoreVertical size={20} strokeWidth={1.5} aria-hidden />
                      </button>
                    </MenuTrigger>
                    <MenuContent>
                      <MenuItem icon={Trash2} variant="destructive">Delete</MenuItem>
                    </MenuContent>
                  </Menu>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Mode picker ────────────────────────────────────────────────────────────────

const MODES = [
  {
    value: "default" as const,
    label: "IgniteAI Agent",
    icon: (base: string) => `${base}/svg/ignite-color.svg`,
    description: "AI agent tools for educators — courses, gradebooks, and submissions.",
  },
  {
    value: "athena" as const,
    label: "Athena",
    icon: (base: string) => `${base}/svg/athena.svg`,
    description: "A study coach that helps you understand course material and prepare for assessments.",
  },
  {
    value: "pandabot" as const,
    label: "PandaBot",
    icon: (base: string) => `${base}/svg/pandabot.svg`,
    description: "Get help with Canvas — troubleshoot issues, learn features, and navigate the platform.",
  },
]

function ModeSelect({
  base,
  displayMode,
  onModeChange,
}: {
  base: string
  displayMode: "default" | "pandabot" | "athena"
  onModeChange: (value: "default" | "pandabot" | "athena") => void
}) {
  const current = MODES.find((m) => m.value === displayMode)!
  const [open, setOpen] = React.useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="h-8 rounded-xl flex items-center gap-2 px-2 transition-colors hover:bg-[var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          style={{ border: "1px solid var(--border)" }}
        >
          <img src={current.icon(base)} width={18} height={18} alt="" aria-hidden className="rounded-full shrink-0" />
          <span className="text-sm" style={{ color: "var(--foreground)" }}>{current.label}</span>
          <ChevronDown size={14} style={{ color: "var(--icon-muted)" }} />
        </button>
      </PopoverTrigger>
      <PopoverContent side="top" align="start" sideOffset={4} showArrow={false} className="w-72 p-1">
        <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--muted-foreground)" }}>
          Agent modes
        </p>
        {MODES.map((m) => {
          const isSelected = displayMode === m.value
          return (
            <button
              key={m.value}
              onClick={() => { onModeChange(m.value); setOpen(false) }}
              className="flex items-start gap-3 w-full text-left px-3 py-3 rounded-lg transition-colors"
              style={isSelected ? { backgroundColor: "#1d354f", color: "white" } : undefined}
              onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = "var(--muted)" }}
              onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = "" }}
            >
              <span
                className="rounded-full shrink-0 mt-0.5 flex items-center justify-center"
                style={{ width: 36, height: 36, background: "white", border: "1px solid", borderColor: isSelected ? "rgba(255,255,255,0.2)" : "var(--border)", padding: 4 }}
              >
                <img src={m.icon(base)} width={24} height={24} alt="" aria-hidden className="rounded-full" style={{ objectFit: "contain" }} />
              </span>
              <span className="flex flex-col flex-1 min-w-0 gap-0.5">
                <span className="text-sm font-medium leading-snug">{m.label}</span>
                <span className="text-xs leading-relaxed" style={{ color: isSelected ? "rgba(255,255,255,0.7)" : "var(--muted-foreground)" }}>
                  {m.description}
                </span>
              </span>
              {isSelected && <Check size={14} className="shrink-0 mt-1" style={{ color: "white" }} />}
            </button>
          )
        })}
      </PopoverContent>
    </Popover>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

/**
 * AgentShell — floating AI agent panel.
 *
 * Renders as an absolutely-positioned panel in the right column of the AppShell.
 * Has a gradient border (AI purple → teal), gradient header, scrollable welcome
 * content, and a prompt input box at the bottom.
 *
 * AppShell automatically mounts this and wires the aiPrimary top-nav action to
 * toggle it open/closed.
 *
 * @prop open              Whether the panel is visible
 * @prop onClose           Called when the X button is clicked
 * @prop onNewChat         Called when the edit/new-chat button is clicked
 * @prop onHistory         Called when the history button is clicked
 * @prop onSubmit          Called with the trimmed input string on send (Enter / button)
 * @prop userName          Optional name shown in the greeting ("Hello, {name}!")
 * @prop sections          Welcome-screen sections; defaults to the Ignite AI starter set
 */
function AgentShell({
  open,
  onClose,
  onNewChat,
  onHistory,
  onSubmit,
  userName,
  sections = DEFAULT_SECTIONS,
  pendingInput,
  inline = false,
  variant = "panel",
  enableModes = false,
  suggestedPrompts,
  suggestedPromptsLabel = "Try asking",
  maintenance = false,
  className,
}: {
  open: boolean
  onClose: () => void
  onNewChat?: () => void
  onHistory?: () => void
  onSubmit?: (value: string) => void
  userName?: string
  sections?: AgentShellSection[]
  pendingInput?: string
  /** When true, renders as a flex sibling (inline) instead of an absolute overlay. */
  inline?: boolean
  /** "embedded" renders as full-height page content instead of a slide-out panel. */
  variant?: "panel" | "embedded"
  /** When true, shows mode switching UI (ModeSelect, Agent modes section). Default false. */
  enableModes?: boolean
  suggestedPrompts?: string[]
  suggestedPromptsLabel?: string
  /** When true, shows offline maintenance screen; hides input, new-chat, and history. */
  maintenance?: boolean
  className?: string
}) {
  // ── View state ────────────────────────────────────────────────────────────────
  const [view, setView] = React.useState<"welcome" | "history" | "conversation">("welcome")

  // ── Mode state ────────────────────────────────────────────────────────────────
  const [mode, setMode] = React.useState<"default" | "pandabot" | "athena">("default")
  const [pendingMode, setPendingMode] = React.useState<AgentMode | null>(null)
  const pendingModeRef = React.useRef<AgentMode | null>(null)
  function queueMode(value: AgentMode | null) {
    pendingModeRef.current = value
    setPendingMode(value)
  }

  // ── Input state ──────────────────────────────────────────────────────────────
  const [inputValue, setInputValue] = React.useState("")

  // When a prompt is pushed in from outside, insert it and focus the textarea
  React.useEffect(() => {
    if (pendingInput) {
      setInputValue(pendingInput)
      setTimeout(() => textareaRef.current?.focus(), 50)
    }
  }, [pendingInput])

  // ── Conversation state ────────────────────────────────────────────────────────
  type ConvoMessage = { role: "user" | "assistant" | "interrupted" | "canned" | "mode_switch"; content: string; structured?: AssistantResponse; elapsedSec?: number; lastPrompt?: string; suggestedPrompts?: string[]; avatarSrc?: string; agentName?: string }
  const [messages, setMessages]                 = React.useState<ConvoMessage[]>([])
  const [streamingContent, setStreamingContent] = React.useState("")
  const [isStreaming, setIsStreaming]           = React.useState(false)
  const [isSwitchingMode, setIsSwitchingMode]   = React.useState(false)
  const [chatError, setChatError]               = React.useState<string | null>(null)
  const [lastUserPrompt, setLastUserPrompt]     = React.useState<string>("")
  const abortRef                                = React.useRef<AbortController | null>(null)
  const scrollContainerRef                      = React.useRef<HTMLDivElement>(null)
  const spacerRef                               = React.useRef<HTMLDivElement>(null)
  const contentRef                              = React.useRef<HTMLDivElement>(null)
  const pendingScrollRef                        = React.useRef(false)

  // Pin last user message to top; grow spacer so response builds below
  React.useLayoutEffect(() => {
    const container = scrollContainerRef.current
    const spacer    = spacerRef.current
    if (!container || !spacer) return
    const allUserMsgs = container.querySelectorAll('[data-user-msg]')
    const lastMsg = (allUserMsgs[allUserMsgs.length - 1] as HTMLElement | undefined) ?? null

    if (lastMsg) {
      const H         = container.offsetHeight
      const naturalH  = (contentRef.current?.offsetHeight ?? container.scrollHeight) - spacer.offsetHeight
      const cRect     = container.getBoundingClientRect()
      const mRect     = lastMsg.getBoundingClientRect()
      const Y         = mRect.top - cRect.top + container.scrollTop
      const M         = lastMsg.offsetHeight
      const C         = naturalH - Y - M
      spacer.style.height = `${Math.max(0, H - M - C)}px`
    }

    if (pendingScrollRef.current && lastMsg) {
      const cRect  = container.getBoundingClientRect()
      const mRect  = lastMsg.getBoundingClientRect()
      const target = mRect.top - cRect.top + container.scrollTop - 24
      pendingScrollRef.current = false
      requestAnimationFrame(() => {
        container.scrollTo({ top: target, behavior: "smooth" })
      })
    }
  }, [messages, streamingContent, isSwitchingMode])

  const [inputFocused, setInputFocused] = React.useState(false)

  const handRef = React.useRef<HTMLSpanElement>(null)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ""

  function waveHand() {
    const el = handRef.current
    if (!el) return
    el.classList.remove("waving")
    void el.offsetWidth // force reflow to restart animation
    el.classList.add("waving")
    el.addEventListener("animationend", () => el.classList.remove("waving"), { once: true })
  }

  // Wave + focus input when panel opens
  React.useEffect(() => {
    if (open) {
      waveHand()
      setTimeout(() => textareaRef.current?.focus(), 50)
    }
  }, [open])

  // Return focus when streaming finishes (not on initial mount)
  const wasStreaming = React.useRef(false)
  React.useEffect(() => {
    if (wasStreaming.current && !isStreaming) textareaRef.current?.focus()
    wasStreaming.current = isStreaming
  }, [isStreaming])

  // Auto-resize textarea as content grows
  React.useLayoutEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`
  }, [inputValue])

  function handleNewChat() {
    abortRef.current?.abort()
    setMessages([])
    setStreamingContent("")
    setIsStreaming(false)
    setChatError(null)
    setLastUserPrompt("")
    setMode("default")
    setView("welcome")
    scrollContainerRef.current?.scrollTo({ top: 0 })
    setTimeout(() => textareaRef.current?.focus(), 50)
    onNewChat?.()
  }

  function handleExitPandabot() {
    setMode("default")
    pendingScrollRef.current = true
    setMessages(prev => [...prev,
      { role: "mode_switch", content: "Now chatting with IgniteAI Agent", avatarSrc: `${base}/svg/ignite-color.svg` },
    ])
    setIsSwitchingMode(true)
    setTimeout(() => {
      setIsSwitchingMode(false)
      setMessages(prev => [...prev, { role: "canned", content: IGNITE_RETURN_GREETING, suggestedPrompts: IGNITE_PROMPTS, avatarSrc: `${base}/svg/ignite-color.svg` }])
      textareaRef.current?.focus()
    }, 1200)
  }

  function handleEnterPandabot() {
    abortRef.current?.abort()
    setStreamingContent("")
    setIsStreaming(false)
    setChatError(null)
    setLastUserPrompt("")
    setMode("pandabot")
    setView("conversation")
    pendingScrollRef.current = true
    setMessages(prev => [...prev,
      { role: "mode_switch", content: "Now chatting with PandaBot", avatarSrc: `${base}/svg/pandabot.svg` },
    ])
    setIsSwitchingMode(true)
    setTimeout(() => {
      setIsSwitchingMode(false)
      setMessages(prev => [...prev, { role: "canned", content: PANDABOT_GREETING, suggestedPrompts: PANDABOT_PROMPTS, avatarSrc: `${base}/svg/pandabot.svg` }])
      textareaRef.current?.focus()
    }, 1200)
  }

  function handleEnterAthena() {
    abortRef.current?.abort()
    setStreamingContent("")
    setIsStreaming(false)
    setChatError(null)
    setLastUserPrompt("")
    setMode("athena")
    setView("conversation")
    pendingScrollRef.current = true
    setMessages(prev => [...prev,
      { role: "mode_switch", content: "Now chatting with Athena", avatarSrc: `${base}/svg/athena.svg` },
    ])
    setIsSwitchingMode(true)
    setTimeout(() => {
      setIsSwitchingMode(false)
      setMessages(prev => [...prev, { role: "canned", content: ATHENA_GREETING, suggestedPrompts: ATHENA_PROMPTS, avatarSrc: `${base}/svg/athena.svg` }])
      textareaRef.current?.focus()
    }, 1200)
  }

  function handleStop() {
    abortRef.current?.abort()
    setIsStreaming(false)
    setStreamingContent("")
    setMessages(prev => [...prev, { role: "interrupted", content: "", lastPrompt: lastUserPrompt }])
  }

  function handleSubmit(overrideText?: string) {
    const userText = (overrideText ?? inputValue).trim()
    if (!userText || isStreaming) return
    if (!overrideText) setInputValue("")
    textareaRef.current?.blur()
    setChatError(null)
    setLastUserPrompt(userText)

    // ── Route matching ─────────────────────────────────────────────────────
    const rawRoute = matchRoute(userText)
    const route = (!enableModes && rawRoute?.type === "mode") ? null : rawRoute
    let resolvedText = userText

    // Route takes priority; pending selector is fallback if no route-driven switch
    const pendingFromSelector = pendingModeRef.current
    if (pendingFromSelector !== null) {
      pendingModeRef.current = null
      setPendingMode(null)
    }
    const resolvedMode: AgentMode = route?.mode ?? pendingFromSelector ?? mode

    if (route?.type === "mode") resolvedText = stripTrigger(userText, route.pattern)

    const getSystemPrompt = (m: AgentMode) =>
      m === "pandabot" ? PANDABOT_SYSTEM_PROMPT
      : m === "athena" ? ATHENA_SYSTEM_PROMPT
      : DEFAULT_SYSTEM_PROMPT

    const SYSTEM_PROMPT =
      route?.type === "feature_link" && route.featureName && route.href
        ? getFeatureLinkSystemPrompt(route.featureName, route.href, route.cardDescription)
        : getSystemPrompt(resolvedMode)
    // ──────────────────────────────────────────────────────────────────────

    const history: OllamaMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages
        .filter(m => m.role === "user" || m.role === "assistant")
        .map(m => ({ role: m.role as OllamaMessage["role"], content: m.content })),
      { role: "user", content: resolvedText },
    ]
    pendingScrollRef.current = true
    setMessages(prev => [...prev, { role: "user", content: userText }])

    function fireLLM() {
      setIsStreaming(true)
      setStreamingContent("")

      const start = Date.now()
      const ac    = new AbortController()
      abortRef.current = ac

      streamOllamaChat(history, {
        onChunk: (chunk) => setStreamingContent(prev => prev + chunk),
        onDone:  (full)  => {
          let structured: AssistantResponse | undefined
          try {
            const stripped = full.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "").trim()
            const jsonMatch = stripped.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
              try {
                structured = JSON.parse(jsonMatch[0])
              } catch {
                structured = JSON.parse(repairJson(jsonMatch[0]))
              }
            }
            // Only feature_link routes should ever show a card — strip hallucinated ones
            if (structured && route?.type !== "feature_link") delete structured.card
          } catch {
            console.warn("[AgentShell] Response could not be parsed. Raw output:", full)
          }
          const agentName = resolvedMode === "pandabot" ? "PandaBot" : resolvedMode === "athena" ? "Athena" : "IgniteAI Agent"
          setIsSwitchingMode(false)
          setMessages(prev => [...prev, { role: "assistant", content: full, structured, elapsedSec: Math.round((Date.now() - start) / 1000), agentName }])
          setStreamingContent("")
          setIsStreaming(false)
        },
        onError: (msg) => {
          setIsSwitchingMode(false)
          setChatError(msg)
          setIsStreaming(false)
        },
      }, ac.signal)
    }

    // ── Apply mode change (from route or selector) ─────────────────────────
    if (resolvedMode !== mode) {
      const switchAvatarSrc = resolvedMode === "pandabot" ? `${base}/svg/pandabot.svg` : resolvedMode === "athena" ? `${base}/svg/athena.svg` : `${base}/svg/ignite-color.svg`
      const switchModeName = resolvedMode === "pandabot" ? "Now chatting with PandaBot" : resolvedMode === "athena" ? "Now chatting with Athena" : "Now chatting with IgniteAI Agent"
      setMode(resolvedMode)
      setMessages(prev => [...prev, { role: "mode_switch", content: switchModeName, avatarSrc: switchAvatarSrc }])
      setIsSwitchingMode(true)
    }
    fireLLM()

    onSubmit?.(userText)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div
      className={cn(
        variant === "embedded"
          ? "h-full w-full flex flex-col"
          : inline
          ? cn(
              // Inline: flex sibling that clips its content via overflow-hidden as width transitions
              "shrink-0 overflow-hidden h-full",
              "transition-[width,opacity] duration-200 ease-out",
              open
                ? "w-[504px] opacity-100 pointer-events-auto"
                : "w-0 opacity-0 pointer-events-none",
            )
          : cn(
              // Overlay: absolute panel over the content area
              "absolute top-0 right-0 bottom-0 z-20",
              "flex pt-4 pr-3 pb-3",
              "transition-[opacity,transform] duration-200 ease-out",
              open
                ? "opacity-100 translate-x-0 pointer-events-auto"
                : "opacity-0 translate-x-3 pointer-events-none",
            ),
        className,
      )}
    >
      {/* Inline: fixed-width wrapper holds padding + panel so the outer can clip via overflow-hidden.
          Overlay: display:contents makes this transparent so the outer flex/padding applies directly.
          Embedded: transparent flex-col container with transparent header above the card. */}
      <div
        className={variant === "embedded" ? "flex-1 min-h-0 flex flex-col" : inline ? "h-full flex pt-4 pr-3 pb-3 pl-3" : "contents"}
        style={variant !== "embedded" && inline ? { width: 504 } : undefined}
      >
      {variant === "embedded" && (
        <div className="shrink-0 flex items-center gap-3" style={{ height: 80 }}>
          <img src={`${base}/svg/ignite-color.svg`} width={32} height={32} alt="" aria-hidden />
          <h1 className="leading-[1.25] font-bold" style={{ fontFamily: "var(--font-heading)", fontSize: 40, color: "var(--color-text-primary)" }}>
            IgniteAI Agent
          </h1>
          <div className="flex-1" />
          <button
            onClick={handleNewChat}
            aria-label="New chat"
            disabled={messages.length === 0 && !isStreaming}
            className={cn(buttonVariants({ variant: "tertiary", size: "sm" }), "w-8 px-0")}
          >
            <Icon icon={SquarePen} size="sm" color="base" />
          </button>
          <button
            onClick={() => { setView("history"); onHistory?.() }}
            aria-label="History"
            className={cn(buttonVariants({ variant: "tertiary", size: "sm" }), "w-8 px-0")}
          >
            <Icon icon={History} size="sm" color="base" />
          </button>
        </div>
      )}
      {/* Gradient border: gradient background shrunk by 1px padding reveals it as a border */}
      <div
        className={variant === "embedded" ? "flex-1 min-h-0 flex flex-col" : "flex flex-col h-full"}
        style={variant !== "embedded" ? {
          width: 480,
          background: `linear-gradient(135deg, var(--color-ai-top) -25%, var(--color-ai-bottom) 125%)`,
          padding: "1px",
          borderRadius: "24px",
          boxShadow:
            "0 2px 3.5px 2px rgba(35,68,101,0.10), 0 1px 1.75px 0 rgba(35,68,101,0.15)",
        } : undefined}
      >
        {/* Inner white container */}
        <div
          className={variant === "embedded" ? "flex-1 min-h-0 bg-white overflow-hidden rounded-2xl border border-[#e8eaec] flex flex-col" : "flex flex-col h-full bg-white overflow-hidden"}
          style={variant !== "embedded" ? { borderRadius: "23px" } : undefined}
        >
          <style>{`
            @keyframes agent-fade-in {
              from { opacity: 0; transform: translateY(4px); }
              to   { opacity: 1; transform: translateY(0); }
            }
            .agent-fade-in { animation: agent-fade-in 0.25s ease 0.2s both; }
            .agent-fade-in-delayed { animation: agent-fade-in 0.6s ease 0.3s both; }
            .agent-mode-label { animation: agent-fade-in 0.35s ease 1.4s both; }
            @keyframes agent-icon-bg-pop {
              0%   { transform: scale(0); }
              65%  { transform: scale(1.1); }
              100% { transform: scale(1); }
            }
            @keyframes agent-icon-pop {
              0%   { transform: scale(0); opacity: 0; }
              20%  { transform: scale(0); opacity: 0; }
              50%  { transform: scale(1.18); opacity: 1; }
              100% { transform: scale(1); }
            }
            .agent-icon-bg  { animation: agent-icon-bg-pop 0.9s  cubic-bezier(0.2, 0, 0.3, 1) both; }
            .agent-icon-img { animation: agent-icon-pop   0.85s cubic-bezier(0.2, 0, 0.3, 1) 0.05s both; }
            @keyframes agent-ring-pulse {
              0%   { transform: scale(1);   opacity: 0.5; }
              100% { transform: scale(2.4); opacity: 0;   }
            }
            .agent-ring {
              position: absolute; inset: 0; border-radius: 50%;
              border: 1.5px solid #c8d0d6;
              animation: agent-ring-pulse 1.4s ease-out forwards;
              pointer-events: none;
            }
            .agent-ring-1 { animation-delay: 0.35s; }
            .agent-ring-2 { animation-delay: 0.65s; }
          `}</style>
          {/* ── Header (panel mode only — embedded uses transparent header above card) ── */}
          {variant !== "embedded" && <div
            className="shrink-0 flex items-center justify-between px-4"
            style={{
              height: 60,
              background: `linear-gradient(135deg, var(--color-ai-top) -25%, var(--color-ai-bottom) 125%)`,
            }}
          >
            <button
              onClick={handleNewChat}
              className="flex items-center gap-2 rounded-lg px-1 -mx-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              <img
                src={`${base}/svg/ignite-white.svg`}
                width={20}
                height={20}
                alt=""
                aria-hidden
              />
              <span
                className="font-bold leading-tight"
                style={{ fontFamily: "var(--font-heading)", fontSize: 20, color: "white" }}
              >
                IgniteAI Agent
              </span>
            </button>

            <div className="flex items-center gap-2">
              {!maintenance && <>
                <button
                  onClick={handleNewChat}
                  aria-label="New chat"
                  disabled={messages.length === 0 && !isStreaming}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 disabled:opacity-40 disabled:pointer-events-none"
                  style={{ border: "1px solid rgba(255,255,255,0.4)" }}
                >
                  <Icon icon={SquarePen} size="sm" color="onColor" />
                </button>
                <button
                  onClick={() => { setView("history"); onHistory?.() }}
                  aria-label="History"
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                  style={{ border: "1px solid rgba(255,255,255,0.4)" }}
                >
                  <Icon icon={History} size="sm" color="onColor" />
                </button>
              </>}
              <button
                onClick={onClose}
                aria-label="Close IgniteAI Agent"
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                <Icon icon={X} size="sm" color="onColor" />
              </button>
            </div>
          </div>}

          {/* ── Scrollable content ─────────────────────────────────────────── */}
          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto min-h-0 no-scrollbar" style={{ overflowAnchor: "none" }}>
            {maintenance ? (
              <div className="h-full flex flex-col items-center justify-center gap-4 px-6 text-center">
                <img
                  src={`${base}/svg/panda-sleeping.png`}
                  alt="Sleeping panda"
                  width={168}
                />
                <div className="flex flex-col gap-1">
                  <p className="font-semibold" style={{ fontFamily: "var(--font-heading)", fontSize: 16, color: "#273540" }}>
                    Offline for maintenance
                  </p>
                  <p className="text-sm" style={{ color: "#576773" }}>
                    Please check back later.
                  </p>
                </div>
              </div>
            ) : view === "history" ? (
              <HistoryView onBack={() => setView(messages.length > 0 ? "conversation" : "welcome")} />
            ) : messages.length === 0 && !isStreaming ? (
              // ── Welcome screen ────────────────────────────────────────────────
              <div className={cn("flex flex-col gap-8 px-6 pt-12 pb-6", variant === "embedded" && "max-w-[640px] mx-auto")}>

                {/* Greeting */}
                <div className="flex flex-col gap-1">
                  <style>{`
                    @keyframes agent-wave {
                      0%   { transform: rotate(0deg);   }
                      20%  { transform: rotate(20deg);  }
                      40%  { transform: rotate(-15deg); }
                      60%  { transform: rotate(18deg);  }
                      80%  { transform: rotate(-8deg);  }
                      100% { transform: rotate(0deg);   }
                    }
                    .agent-wave-hand {
                      display: inline-flex;
                      flex-shrink: 0;
                      transform-origin: bottom center;
                    }
                    .agent-wave-hand.waving {
                      animation: agent-wave 0.7s ease-in-out;
                    }

                  `}</style>
                  <div className="flex items-center gap-2">
                    <span
                      ref={handRef}
                      className="agent-wave-hand"
                      aria-hidden
                      onMouseEnter={waveHand}
                    >
                      <Hand size={22} strokeWidth={1.5} style={{ color: "var(--foreground)", transform: "rotate(-35deg)" }} />
                    </span>
                    <span
                      className="font-bold leading-tight bg-clip-text text-transparent"
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: 24,
                        backgroundImage: `linear-gradient(90deg, var(--color-ai-top), var(--color-ai-bottom))`,
                      }}
                    >
                      {userName ? `Hello, ${userName}!` : "Hello!"}
                    </span>
                  </div>
                  <p className="text-base" style={{ color: "var(--color-text-muted)" }}>
                    What are we doing today?
                  </p>
                </div>

                {/* Sections */}
                {sections.filter((s) => enableModes || s.title !== "Agent modes").map((section) => (
                  <div key={section.title ?? section.items[0]?.id} className="flex flex-col gap-3">
                    {section.title && <h5 style={{ color: "var(--foreground)" }}>{section.title}</h5>}
                    <div className="flex flex-col gap-2">
                      {section.items.map((item) => (
                        <SectionItem
                          key={item.id}
                          item={
                            item.id === "chats"     ? { ...item, onClick: () => setView("history") }
                            : item.id === "igniteai" ? { ...item, onClick: handleExitPandabot }
                            : item.id === "pandabot" ? { ...item, onClick: handleEnterPandabot }
                            : item.id === "athena"   ? { ...item, onClick: handleEnterAthena }
                            : item
                          }
                        />
                      ))}
                    </div>
                    {section.title === "Agent modes" && (
                      <div className="mt-2"><Popover>
                        <PopoverTrigger className="self-start inline-flex items-center text-base font-medium leading-none text-[var(--link-text)] hover:text-[var(--link-text-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-info)] focus-visible:rounded-sm">
                          What are agent modes?
                        </PopoverTrigger>
                        <PopoverContent side="top" align="start" sideOffset={6} showArrow={false} className="w-72 p-4">
                          <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Agent modes</p>
                              <PopoverClose asChild>
                                <button
                                  aria-label="Close"
                                  className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                                >
                                  <X size={14} strokeWidth={1.5} style={{ color: "var(--icon-base)" }} />
                                </button>
                              </PopoverClose>
                            </div>
                            <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                              Agent modes let you switch between specialized AI assistants, each built for a different purpose.
                            </p>
                            <ul className="flex flex-col gap-1.5" style={{ paddingLeft: "1.1em", listStyleType: "disc" }}>
                              {[
                                { name: "IgniteAI Agent", desc: "An AI assistant built for educators — manage courses, grades, and content." },
                                { name: "Athena", desc: "A study coach that helps learners understand course material." },
                                { name: "PandaBot", desc: "Canvas support — troubleshoot issues and get platform help." },
                              ].map(({ name, desc }) => (
                                <li key={name} className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                                  <strong style={{ color: "var(--foreground)" }}>{name}</strong> — {desc}
                                </li>
                              ))}
                            </ul>
                            <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                              The agent may switch modes automatically based on your question. Feel free to chat with whichever feels right — you can always switch back.
                            </p>
                          </div>
                        </PopoverContent>
                      </Popover></div>
                    )}
                  </div>
                ))}

                {/* Suggested prompts */}
                {(suggestedPrompts ?? DEFAULT_SUGGESTED_PROMPTS).length > 0 && (
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold" style={{ color: "var(--muted-foreground)" }}>{suggestedPromptsLabel}</p>
                    <div className="flex flex-col gap-2 my-5">
                      {(suggestedPrompts ?? DEFAULT_SUGGESTED_PROMPTS).map((prompt) => (
                        <button
                          key={prompt}
                          onClick={() => handleSubmit(prompt)}
                          className="flex items-center gap-4 text-left px-4 py-2.5 rounded-xl w-full font-semibold text-base transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                          style={{ backgroundColor: "#d5e2f6", color: "#1d354f" }}
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                    <Link href="#" className="self-start text-base">
                      What else can you do?
                    </Link>
                  </div>
                )}

              </div>
            ) : (
              // ── Conversation view ─────────────────────────────────────────────
              <div ref={contentRef} className={cn("flex flex-col gap-6 px-6 pt-6 pb-4", variant === "embedded" && "max-w-[640px] mx-auto")}>
                {messages.map((msg, i) =>
                    msg.role === "user" ? (
                      <div key={i} data-user-msg="true">
                        <UserBubble content={msg.content} />
                      </div>
                  ) : msg.role === "interrupted" ? (
                    <div key={i} className="flex flex-col gap-3">
                      {/* Header row */}
                      <div className="flex items-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                          <path d="M2.15484 13.9384C1.84225 13.6259 1.6666 13.2021 1.6665 12.7601V7.24008C1.6666 6.79809 1.84225 6.37424 2.15484 6.06175L6.0615 2.15508C6.37399 1.8425 6.79785 1.66684 7.23984 1.66675H12.7598C13.2018 1.66684 13.6257 1.8425 13.9382 2.15508L17.8448 6.06175C18.1574 6.37424 18.3331 6.79809 18.3332 7.24008V12.7601C18.3331 13.2021 18.1574 13.6259 17.8448 13.9384L13.9382 17.8451C13.6257 18.1577 13.2018 18.3333 12.7598 18.3334H7.23984C6.79785 18.3333 6.37399 18.1577 6.0615 17.8451L2.15484 13.9384Z" stroke="#bb4200" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12.4998 7.50008L7.49984 12.5001M7.49984 7.50008L12.4998 12.5001" stroke="#bb4200" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="text-base font-semibold" style={{ color: "#bb4200" }}>You stopped the agent</span>
                      </div>
                      {/* Sub-text */}
                      <p className="text-base" style={{ color: "#273540" }}>Try again or tell the agent what it should do instead.</p>
                      {/* Try again button */}
                      {msg.lastPrompt && (
                        <button
                          onClick={() => handleSubmit(msg.lastPrompt)}
                          className={cn(buttonVariants({ variant: "tertiary", size: "sm" }), "self-start")}
                        >
                          <Redo2 size={16} strokeWidth={1.5} />
                          Try again
                        </button>
                      )}
                    </div>
                  ) : msg.role === "mode_switch" ? (
                    <div key={i} className="flex flex-col items-center gap-3" style={{ marginTop: 8, marginBottom: 16 }}>
                      <div className="flex items-center gap-3 w-full">
                        <div style={{ flex: 1, height: 1, backgroundColor: "#e8eaec" }} />
                        {msg.avatarSrc && (
                          <div style={{ position: "relative", width: 48, height: 48, flexShrink: 0 }}>
                            <div className="agent-ring agent-ring-1" />
                            <div className="agent-ring agent-ring-2" />
                            <div
                              className="agent-icon-bg flex items-center justify-center"
                              style={{ width: 48, height: 48, borderRadius: "50%", backgroundColor: "#e8eaec" }}
                            >
                              <img src={msg.avatarSrc} width={30} height={30} alt="" aria-hidden className="agent-icon-img" style={{ objectFit: "contain" }} />
                            </div>
                          </div>
                        )}
                        <div style={{ flex: 1, height: 1, backgroundColor: "#e8eaec" }} />
                      </div>
                      {msg.content && (
                        <span className="agent-mode-label text-xs whitespace-nowrap" style={{ color: "#576773" }}>{msg.content}</span>
                      )}
                    </div>
                  ) : msg.role === "canned" ? (
                    <React.Fragment key={i}>
                      <CannedBubble content={msg.content} />
                    </React.Fragment>
                  ) : (
                    <AssistantBubble
                      key={i}
                      content={msg.content}
                      structured={msg.structured}
                      elapsedSec={msg.elapsedSec ?? null}
                      agentName={msg.agentName}
                      onRetry={() => { const prev = messages.slice(0, i).reverse().find(m => m.role === "user"); if (prev) handleSubmit(prev.content) }}
                    />
                  )
                )}

                {/* In-progress streaming response */}
                {isStreaming && !isSwitchingMode && (
                  <AssistantBubble
                    content={streamingContent}
                    elapsedSec={null}
                    isStreaming
                  />
                )}

                {/* Mode switching — thinking loader (divider is in message history) */}
                {isSwitchingMode && (
                  <div className="flex items-center gap-2">
                    <LoaderCircle size={20} strokeWidth={2} className="animate-spin" style={{ color: "#576773" }} />
                    <span className="text-base font-semibold" style={{ color: "#576773" }}>Thinking<AnimatedDots /></span>
                  </div>
                )}

                {/* Error */}
                {chatError && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <Info size={20} strokeWidth={1.5} style={{ color: "#cf1f24", flexShrink: 0 }} />
                      <span className="text-base font-semibold" style={{ color: "#cf1f24" }}>Something interrupted the request</span>
                    </div>
                    <p className="text-base" style={{ color: "#273540" }}>{chatError}</p>
                    <button onClick={() => handleSubmit(lastUserPrompt)} className={cn(buttonVariants({ variant: "tertiary", size: "sm" }), "self-start")}>
                      <Redo2 size={16} strokeWidth={1.5} />
                      Try again
                    </button>
                  </div>
                )}

                {/* Suggested prompts + disclaimer — only after the last assistant/canned response */}
                {!isStreaming && !isSwitchingMode && !chatError && (() => {
                  const reversed = [...messages].reverse()
                  const lastSignificant = reversed.find(m => m.role !== "user")
                  if (lastSignificant?.role !== "assistant" && lastSignificant?.role !== "canned") return null
                  const prompts = lastSignificant?.role === "canned"
                    ? lastSignificant.suggestedPrompts
                    : lastSignificant?.structured?.suggestedPrompts
                  return (
                    <div key={messages.length} className="agent-fade-in-delayed flex flex-col gap-4 pb-2">
                      {prompts?.length && (
                        <div className="flex flex-wrap gap-3">
                          {prompts.map((prompt, i) => (
                            <button
                              key={i}
                              onClick={() => handleSubmit(prompt)}
                              className="h-10 rounded-xl text-base font-semibold transition-opacity hover:opacity-80"
                              style={{ backgroundColor: "#d5e2f6", color: "#1d354f", padding: "0 12px" }}
                            >
                              {prompt}
                            </button>
                          ))}
                        </div>
                      )}
                      {lastSignificant?.role === "canned" && (
                        <Link href="#" className="flex items-center gap-1.5 self-start text-sm">
                          What else can you do?
                          <ExternalLink size={14} strokeWidth={1.5} />
                        </Link>
                      )}
                      <p className="text-sm" style={{ color: "#576773" }}>
                        AI can make mistakes. Consider checking important information.
                      </p>
                    </div>
                  )
                })()}

                <div ref={spacerRef} style={{ flexShrink: 0 }} />
              </div>
            )}
          </div>

          {/* ── Input area ─────────────────────────────────────────────────── */}
          {!maintenance && view !== "history" && <div className={variant === "embedded" ? "shrink-0 px-6 pb-6 max-w-[640px] mx-auto w-full" : "shrink-0 px-4 pb-4"}>
            <div
              className={cn(
                "flex flex-col gap-3 p-4 rounded-2xl bg-white border transition-[border-color,box-shadow]",
                inputFocused
                  ? "border-[var(--color-info)] ring-2 ring-[var(--color-info)] ring-offset-[3px]"
                  : "border-[#5f6e7a]",
              )}
            >
              {/* Label + textarea */}
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                  Enter a prompt
                </span>
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  placeholder="Help me…"
                  rows={1}
                  className="resize-none overflow-hidden outline-none text-base bg-transparent w-full leading-relaxed"
                  style={{ color: "var(--foreground)", minHeight: "28px", maxHeight: "120px" }}
                />
              </div>

              {/* Toolbar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Menu>
                    <MenuTrigger>
                      <button
                        aria-label="Add attachment"
                        className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors hover:bg-[var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                        style={{ border: "1px solid var(--border)" }}
                      >
                        <Icon icon={Plus} size="sm" color="base" />
                      </button>
                    </MenuTrigger>
                    <MenuContent side="top" align="start">
                      <MenuItem imageSrc={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/svg/canvas.svg`}>
                        Attach Canvas content
                      </MenuItem>
                      <MenuItem icon={Upload}>Upload a file</MenuItem>
                    </MenuContent>
                  </Menu>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        aria-label="AI info"
                        className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors hover:bg-[var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                        style={{ border: "1px solid var(--border)" }}
                      >
                        <img src={`${base}/svg/ai-info.svg`} width={20} height={20} alt="" aria-hidden />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent side="top" align="center" className="w-[296px] p-6">
                      <div className="flex flex-col gap-6">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex flex-col gap-1">
                            <img
                              src={`${base}/svg/IgniteAI.png`}
                              alt="IgniteAI"
                              style={{ height: 20, width: "auto", alignSelf: "flex-start" }}
                            />
                            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 24, fontWeight: 700, color: "#273540", lineHeight: 1.25 }}>
                              Nutrition Facts
                            </h2>
                          </div>
                          <PopoverClose asChild>
                            <button
                              aria-label="Close"
                              className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-colors hover:bg-[var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                            >
                              <X size={16} strokeWidth={1.5} style={{ color: "var(--icon-base)" }} />
                            </button>
                          </PopoverClose>
                        </div>

                        {/* AI Privacy Notice */}
                        <Link href="#" icon={ExternalLink} iconPlacement="end" onClick={(e) => e.preventDefault()}>
                          AI Privacy Notice
                        </Link>

                        {/* Feature content */}
                        <div className="flex flex-col">
                          <p style={{ fontFamily: "var(--font-heading)", fontSize: 20, fontWeight: 700, color: "#273540", lineHeight: 1.25, marginBottom: 16 }}>
                            FeatureName
                          </p>
                          <p style={{ fontFamily: "var(--font-heading)", fontSize: 16, fontWeight: 700, color: "#273540", lineHeight: 1.25, marginBottom: 8 }}>
                            Permission Level
                          </p>
                          <p style={{ fontSize: 12, color: "#8a49a7", lineHeight: 1.5, marginBottom: 8 }}>
                            Level 1
                          </p>
                          <p style={{ fontSize: 14, color: "#273540", lineHeight: 1.5, marginBottom: 8 }}>
                            We leverage anonymized aggregate data for detailed analytics to inform model development and product improvements. No AI models are used at this level.
                          </p>
                          <div style={{ marginBottom: 24 }}>
                            <Link href="#" onClick={(e) => e.preventDefault()}>Permission Levels</Link>
                          </div>
                          <p style={{ fontFamily: "var(--font-heading)", fontSize: 16, fontWeight: 700, color: "#273540", lineHeight: 1.25, marginBottom: 4 }}>
                            Base Model
                          </p>
                          <p style={{ fontSize: 14, color: "#273540", lineHeight: 1.5, marginBottom: 4 }}>
                            Claude 3 Haiku
                          </p>
                          <Link href="#" onClick={(e) => e.preventDefault()}>AI Nutrition Facts</Link>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  {enableModes && (
                    <ModeSelect
                      base={base}
                      displayMode={pendingMode ?? mode}
                      onModeChange={(value) => {
                        queueMode(value === mode ? null : value)
                      }}
                    />
                  )}
                </div>
                {isStreaming ? (
                  <button
                    onClick={handleStop}
                    aria-label="Stop"
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                    style={{ backgroundColor: "#1d354f" }}
                  >
                    <Square size={14} fill="white" strokeWidth={0} />
                  </button>
                ) : (
                  <button
                    onClick={() => handleSubmit()}
                    aria-label="Send message"
                    disabled={!inputValue.trim()}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-white transition-colors disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                    style={{ backgroundColor: "#1d354f" }}
                  >
                    <Icon icon={ArrowUp} size="sm" color="onColor" />
                  </button>
                )}
              </div>
            </div>
          </div>}

        </div>
      </div>
      </div>
    </div>
  )
}

export { AgentShell }
