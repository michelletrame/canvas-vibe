"use client"

import * as React from "react"
import {
  SquarePen,
  History,
  X,
  ArrowUp,
  ExternalLink,
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
  Hand,
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
import { type SoloAgentConfig } from "@/lib/solo-agent-configs"

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
        // Correct closer
        stack.pop()
        result += ch
      } else if (stack.length > 0) {
        // Mismatched closer — insert missing closers until we find a match
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

  // Append any remaining unclosed containers
  return result + stack.reverse().join("")
}

// ── Structured response type ───────────────────────────────────────────────────

interface AssistantResponse {
  tools?: string[]
  sources?: string[]
  response: string
  suggestedPrompts?: string[]
}

// ── Animated success check icon ───────────────────────────────────────────────

function AnimatedCheckIcon({ size = 20 }: { size?: number }) {
  const circleRef = React.useRef<SVGPathElement>(null)
  const checkRef  = React.useRef<SVGPathElement>(null)

  React.useEffect(() => {
    const circle = circleRef.current
    const check  = checkRef.current
    if (!circle || !check) return

    const cLen = circle.getTotalLength()
    circle.style.strokeDasharray  = String(cLen)
    circle.style.strokeDashoffset = String(cLen)
    const t1 = setTimeout(() => {
      circle.style.transition      = "stroke-dashoffset 0.35s ease-out"
      circle.style.strokeDashoffset = "0"
    }, 30)

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
      <g clipPath="url(#clip-solo-check)">
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
        <clipPath id="clip-solo-check">
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

function CannedBubble({ content }: { content: string }) {
  return (
    <div className="text-base leading-relaxed agent-markdown" style={{ color: "var(--foreground)" }}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  )
}

function AssistantBubble({
  content: _content,
  structured,
  elapsedSec,
  isStreaming = false,
  agentName = "Agent",
  onRetry,
}: {
  content: string
  structured?: AssistantResponse
  elapsedSec: number | null
  isStreaming?: boolean
  agentName?: string
  onRetry?: () => void
}) {
  const [copied, setCopied]   = React.useState(false)
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
      {!isStreaming && responseText && (
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>Response powered by</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1582.67 452.49" aria-hidden="true" style={{ height: 11, width: "auto", color: "var(--color-text-muted)" }}>
            <path fill="currentColor" d="M703.76 440.34c-16.85-8.1-29.85-19.51-39.02-34.22-9.17-14.71-13.75-31.66-13.75-50.85 0-20.47 5.22-38.48 15.67-54.05 10.44-15.56 25.37-27.51 44.78-35.82 19.4-8.32 41.9-12.47 67.48-12.47h74.84c6.82 0 11.72-1.28 14.71-3.84 2.98-2.56 4.48-6.4 4.48-11.51 0-22.17-7.68-40.08-23.03-53.73-15.35-13.64-36.46-20.47-63.33-20.47-15.78 0-30.06 2.99-42.86 8.96-12.79 5.98-23.14 13.86-31.02 23.67-7.89 9.81-12.26 20.69-13.11 32.62h-49.25c2.13-20.47 9.48-39.02 22.07-55.65 12.57-16.63 28.99-29.63 49.25-39.02 20.25-9.38 42.11-14.07 65.57-14.07 27.72 0 51.81 5.02 72.28 15.03 20.47 10.02 36.35 23.99 47.66 41.9 11.29 17.91 16.95 38.81 16.95 62.69V447.4h-51.17v-55.65l-3.84 6.4c-6.4 11.09-15.03 20.69-25.91 28.78-10.87 8.11-23.14 14.39-36.78 18.87-13.65 4.48-28.37 6.72-44.14 6.72-22.18 0-41.69-4.06-58.53-12.15Zm142.01-59.81c18.12-18.97 27.19-45.1 27.19-78.36v-7.04h-90.83c-23.89 0-42.97 5.34-57.25 15.99-14.29 10.66-21.43 25.17-21.43 43.5 0 16.63 6.08 29.85 18.23 39.66 12.15 9.81 28.25 14.71 48.3 14.71 32.4 0 57.67-9.48 75.8-28.46Zm181.98 50.21c-23.03-14.49-40.62-34.32-52.77-59.49-12.15-25.16-18.23-53.51-18.23-85.08s6.08-59.91 18.23-85.08c12.15-25.16 29.75-44.99 52.77-59.49 23.03-14.49 50.95-21.75 83.8-21.75 22.17 0 43.18 5.34 63.01 15.99 19.83 10.66 34.64 24.53 44.46 41.58V0h51.17v447.37h-51.17v-53.09c-9.81 17.49-24.63 31.56-44.46 42.22-19.83 10.66-41.05 15.99-63.65 15.99-32.41 0-60.13-7.25-83.16-21.75Zm144.88-39.34c15.99-10.01 28.46-24.09 37.42-42.22 8.96-18.12 13.43-39.12 13.43-63.01 0-36.67-9.7-65.89-29.1-87.63-19.41-21.75-45.32-32.62-77.72-32.62-21.33 0-39.98 5.02-55.97 15.03-15.99 10.02-28.46 24.1-37.42 42.22-8.96 18.13-13.43 39.13-13.43 63.01 0 36.68 9.69 65.89 29.1 87.63 19.4 21.75 45.31 32.62 77.72 32.62 21.32 0 39.98-5.01 55.97-15.03Zm189.67 48.94c-16.85-8.1-29.85-19.51-39.02-34.22-9.18-14.71-13.75-31.66-13.75-50.85 0-20.47 5.22-38.48 15.67-54.05 10.44-15.56 25.37-27.51 44.78-35.82 19.4-8.32 41.9-12.47 67.48-12.47h74.84c6.82 0 11.72-1.28 14.71-3.84 2.98-2.56 4.48-6.4 4.48-11.51 0-22.17-7.68-40.08-23.03-53.73-15.35-13.64-36.46-20.47-63.33-20.47-15.78 0-30.06 2.99-42.86 8.96-12.79 5.98-23.14 13.86-31.02 23.67-7.9 9.81-12.26 20.69-13.11 32.62h-49.25c2.13-20.47 9.49-39.02 22.07-55.65 12.57-16.63 28.99-29.63 49.25-39.02 20.25-9.38 42.11-14.07 65.57-14.07 27.72 0 51.81 5.02 72.28 15.03 20.47 10.02 36.35 23.99 47.66 41.9 11.29 17.91 16.95 38.81 16.95 62.69V447.4h-51.17v-55.65l-3.84 6.4c-6.4 11.09-15.03 20.69-25.91 28.78-10.87 8.11-23.14 14.39-36.78 18.87-13.65 4.48-28.37 6.72-44.14 6.72-22.18 0-41.69-4.06-58.53-12.15Zm142.01-59.81c18.12-18.97 27.19-45.1 27.19-78.36v-7.04h-90.83c-23.89 0-42.97 5.34-57.25 15.99-14.29 10.66-21.43 25.17-21.43 43.5 0 16.63 6.08 29.85 18.23 39.66 12.15 9.81 28.25 14.71 48.29 14.71 32.4 0 57.67-9.48 75.8-28.46ZM219.53-.08C73.31-.08-.05 130.39 0 216.37v231.02h99.19c0-121.48 240.87-121.2 240.87 0h99.05V216.55c0-86.16-73.35-216.63-219.58-216.63Zm.07 316.77c-58.42.04-105.79-47.33-105.75-105.75.04-57.44 48.15-105.56 105.6-105.6 58.42-.04 105.79 47.33 105.75 105.75-.04 57.44-48.15 105.56-105.6 105.6Z" />
          </svg>
        </div>
      )}
    </div>
  )
}

// ── Chat history ───────────────────────────────────────────────────────────────

const HISTORY_ITEMS = [
  {
    date: "12/31/2025",
    conversations: [
      "How do I submit a late assignment?",
      "Find my missing grade in BIOL 101",
      "Set up email notifications for Canvas",
    ],
  },
  {
    date: "12/30/2025",
    conversations: [
      "Troubleshoot assignment submission error",
      "Where are my course announcements?",
    ],
  },
]

function HistoryView({ onBack }: { onBack: () => void }) {
  const [openMenu, setOpenMenu] = React.useState<string | null>(null)

  return (
    <div className="flex flex-col gap-6 px-6 pt-6 pb-6">
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

// ── Main component ─────────────────────────────────────────────────────────────

/**
 * SoloAgentShell — single-persona AI agent panel.
 *
 * A stripped-down variant of AgentShell for dedicated solo agent experiences
 * (e.g. PandaBot, Athena). No mode-switching, no IgniteAI branding.
 * Fully configured by a `SoloAgentConfig` object.
 *
 * To add a new solo agent: create a new config in `src/lib/solo-agent-configs.ts`
 * and render `<SoloAgentShell config={MY_CONFIG} ... />` on a new prototype page.
 */
function SoloAgentShell({
  open,
  onClose,
  onNewChat,
  onHistory,
  onSubmit,
  config,
  role,
  pendingInput,
  inline = false,
  className,
}: {
  open: boolean
  onClose: () => void
  onNewChat?: () => void
  onHistory?: () => void
  onSubmit?: (value: string) => void
  config: SoloAgentConfig
  /** Active user role — used to select role-specific welcome prompts and inject role context */
  role?: string
  pendingInput?: string
  /** When true, renders as a flex sibling (inline) instead of an absolute overlay. */
  inline?: boolean
  className?: string
}) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ""

  // ── View state ─────────────────────────────────────────────────────────────
  const [view, setView] = React.useState<"welcome" | "history" | "conversation">("welcome")

  // ── Input state ────────────────────────────────────────────────────────────
  const [inputValue, setInputValue] = React.useState("")

  React.useEffect(() => {
    if (pendingInput) {
      setInputValue(pendingInput)
      setTimeout(() => textareaRef.current?.focus(), 50)
    }
  }, [pendingInput])

  // ── Conversation state ─────────────────────────────────────────────────────
  type ConvoMessage = {
    role: "user" | "assistant" | "interrupted" | "canned"
    content: string
    structured?: AssistantResponse
    elapsedSec?: number
    lastPrompt?: string
    suggestedPrompts?: string[]
  }

  const [messages, setMessages]                 = React.useState<ConvoMessage[]>([])
  const [streamingContent, setStreamingContent] = React.useState("")
  const [isStreaming, setIsStreaming]           = React.useState(false)
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
      const H        = container.offsetHeight
      const naturalH = (contentRef.current?.offsetHeight ?? container.scrollHeight) - spacer.offsetHeight
      const cRect    = container.getBoundingClientRect()
      const mRect    = lastMsg.getBoundingClientRect()
      const Y        = mRect.top - cRect.top + container.scrollTop
      const M        = lastMsg.offsetHeight
      const C        = naturalH - Y - M
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
  }, [messages, streamingContent])

  const [inputFocused, setInputFocused] = React.useState(false)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const handRef     = React.useRef<HTMLSpanElement>(null)

  function waveHand() {
    const el = handRef.current
    if (!el) return
    el.classList.remove("solo-waving")
    void el.offsetWidth
    el.classList.add("solo-waving")
    el.addEventListener("animationend", () => el.classList.remove("solo-waving"), { once: true })
  }

  // Wave + focus input when panel opens
  React.useEffect(() => {
    if (open) {
      waveHand()
      setTimeout(() => textareaRef.current?.focus(), 50)
    }
  }, [open])

  // Return focus when streaming finishes
  const wasStreaming = React.useRef(false)
  React.useEffect(() => {
    if (wasStreaming.current && !isStreaming) textareaRef.current?.focus()
    wasStreaming.current = isStreaming
  }, [isStreaming])

  // Auto-resize textarea
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
    setView("welcome")
    scrollContainerRef.current?.scrollTo({ top: 0 })
    setTimeout(() => textareaRef.current?.focus(), 50)
    onNewChat?.()
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

    const roleContext = role ? `\n\nThe current user's role is: ${role}.` : ""
    const history: OllamaMessage[] = [
      { role: "system", content: config.systemPrompt + roleContext },
      ...messages
        .filter(m => m.role === "user" || m.role === "assistant")
        .map(m => ({ role: m.role as OllamaMessage["role"], content: m.content })),
      { role: "user", content: userText },
    ]

    pendingScrollRef.current = true
    setMessages(prev => [...prev, { role: "user", content: userText }])
    setView("conversation")
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
        } catch {
          console.warn("[SoloAgentShell] Response could not be parsed. Raw output:", full)
        }
        setMessages(prev => [...prev, {
          role: "assistant",
          content: full,
          structured,
          elapsedSec: Math.round((Date.now() - start) / 1000),
        }])
        setStreamingContent("")
        setIsStreaming(false)
      },
      onError: (msg) => {
        setChatError(msg)
        setIsStreaming(false)
      },
    }, ac.signal, { forceJson: true })

    onSubmit?.(userText)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const gradientCss = config.headerGradient
    ? `linear-gradient(135deg, ${config.headerGradient[0]} -25%, ${config.headerGradient[1]} 125%)`
    : `linear-gradient(135deg, var(--color-ai-top) -25%, var(--color-ai-bottom) 125%)`

  const logoSrc = config.headerLogoSrc ?? config.avatarSrc

  return (
    <div
      className={cn(
        inline
          ? cn(
              "shrink-0 overflow-hidden h-full",
              "transition-[width,opacity] duration-200 ease-out",
              open
                ? "w-[504px] opacity-100 pointer-events-auto"
                : "w-0 opacity-0 pointer-events-none",
            )
          : cn(
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
      <div
        className={inline ? "h-full flex pt-4 pr-3 pb-3 pl-3" : "contents"}
        style={inline ? { width: 504 } : undefined}
      >
      {/* Gradient border */}
      <div
        className="flex flex-col h-full"
        style={{
          width: 480,
          background: gradientCss,
          padding: "1px",
          borderRadius: "24px",
          boxShadow: "0 2px 3.5px 2px rgba(35,68,101,0.10), 0 1px 1.75px 0 rgba(35,68,101,0.15)",
        }}
      >
        {/* Inner white container */}
        <div className="flex flex-col h-full bg-white overflow-hidden" style={{ borderRadius: "23px" }}>
          <style>{`
            @keyframes solo-fade-in {
              from { opacity: 0; transform: translateY(4px); }
              to   { opacity: 1; transform: translateY(0); }
            }
            .solo-fade-in         { animation: solo-fade-in 0.25s ease 0.2s both; }
            .solo-fade-in-delayed { animation: solo-fade-in 0.6s ease 0.3s both; }
            @keyframes solo-icon-bg-pop {
              0%   { transform: scale(0); }
              65%  { transform: scale(1.1); }
              100% { transform: scale(1); }
            }
            @keyframes solo-icon-pop {
              0%   { transform: scale(0); opacity: 0; }
              20%  { transform: scale(0); opacity: 0; }
              50%  { transform: scale(1.18); opacity: 1; }
              100% { transform: scale(1); }
            }
            .solo-icon-bg  { animation: solo-icon-bg-pop 0.9s  cubic-bezier(0.2, 0, 0.3, 1) both; }
            .solo-icon-img { animation: solo-icon-pop   0.85s cubic-bezier(0.2, 0, 0.3, 1) 0.05s both; }
            @keyframes solo-ring-pulse {
              0%   { transform: scale(1);   opacity: 0.5; }
              100% { transform: scale(2.4); opacity: 0;   }
            }
            .solo-ring {
              position: absolute; inset: 0; border-radius: 50%;
              border: 1.5px solid #c8d0d6;
              animation: solo-ring-pulse 1.4s ease-out forwards;
              pointer-events: none;
            }
            .solo-ring-1 { animation-delay: 0.35s; }
            .solo-ring-2 { animation-delay: 0.65s; }
          `}</style>

          {/* ── Header ───────────────────────────────────────────────────── */}
          <div
            className="shrink-0 flex items-center justify-between px-4"
            style={{ height: 60, background: gradientCss }}
          >
            <button
              onClick={handleNewChat}
              className="flex items-center gap-2 rounded-lg px-1 -mx-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              <img src={logoSrc} width={20} height={20} alt="" aria-hidden style={{ objectFit: "contain" }} />
              <span
                className="font-bold leading-tight"
                style={{ fontFamily: "var(--font-heading)", fontSize: 20, color: "white" }}
              >
                {config.name}
              </span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleNewChat}
                aria-label="New chat"
                disabled={messages.length === 0 && !isStreaming}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 disabled:opacity-40 disabled:pointer-events-none"
                style={{ border: "1px solid rgba(255,255,255,0.4)" }}
              >
                <Icon icon={SquarePen} size="sm" color="onColor" />
              </button>
              {(config.showHistory ?? true) && (
                <button
                  onClick={() => { setView("history"); onHistory?.() }}
                  aria-label="History"
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                  style={{ border: "1px solid rgba(255,255,255,0.4)" }}
                >
                  <Icon icon={History} size="sm" color="onColor" />
                </button>
              )}
              <button
                onClick={onClose}
                aria-label={`Close ${config.name}`}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                <Icon icon={X} size="sm" color="onColor" />
              </button>
            </div>
          </div>

          {/* ── Scrollable content ────────────────────────────────────────── */}
          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto min-h-0 no-scrollbar" style={{ overflowAnchor: "none" }}>
            {view === "history" ? (
              <HistoryView onBack={() => setView(messages.length > 0 ? "conversation" : "welcome")} />
            ) : messages.length === 0 && !isStreaming ? (
              // ── Welcome screen ──────────────────────────────────────────────
              <div className="flex flex-col gap-8 px-6 pt-12 pb-6">
                <style>{`
                  @keyframes solo-wave {
                    0%   { transform: rotate(0deg);   }
                    20%  { transform: rotate(20deg);  }
                    40%  { transform: rotate(-15deg); }
                    60%  { transform: rotate(18deg);  }
                    80%  { transform: rotate(-8deg);  }
                    100% { transform: rotate(0deg);   }
                  }
                  .solo-wave-hand { display: inline-flex; flex-shrink: 0; transform-origin: bottom center; }
                  .solo-wave-hand.solo-waving { animation: solo-wave 0.7s ease-in-out; }
                `}</style>

                {/* Greeting */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span
                      ref={handRef}
                      className="solo-wave-hand"
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
                        backgroundImage: gradientCss,
                      }}
                    >
                      {config.greeting}
                    </span>
                  </div>
                  <p className="text-base" style={{ color: "var(--color-text-muted)" }}>
                    {config.welcomeSubtext}
                  </p>
                  {config.welcomeDisclaimer && (
                    <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
                      {config.welcomeDisclaimer}
                    </p>
                  )}
                </div>

                {/* Prompt cards */}
                <div className="flex flex-col">
                  <p className="text-sm font-semibold" style={{ color: "var(--muted-foreground)" }}>Try asking</p>
                  <div className="flex flex-col gap-2 my-5">
                    {(role && config.rolePrompts?.[role] ? config.rolePrompts[role] : config.welcomePrompts).map((prompt, i) => (
                      <button
                        key={i}
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

              </div>
            ) : (
              // ── Conversation view ───────────────────────────────────────────
              <div ref={contentRef} className="flex flex-col gap-6 px-6 pt-6 pb-4">
                {messages.map((msg, i) =>
                  msg.role === "user" ? (
                    <div key={i} data-user-msg="true">
                      <UserBubble content={msg.content} />
                    </div>
                  ) : msg.role === "interrupted" ? (
                    <div key={i} className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                          <path d="M2.15484 13.9384C1.84225 13.6259 1.6666 13.2021 1.6665 12.7601V7.24008C1.6666 6.79809 1.84225 6.37424 2.15484 6.06175L6.0615 2.15508C6.37399 1.8425 6.79785 1.66684 7.23984 1.66675H12.7598C13.2018 1.66684 13.6257 1.8425 13.9382 2.15508L17.8448 6.06175C18.1574 6.37424 18.3331 6.79809 18.3332 7.24008V12.7601C18.3331 13.2021 18.1574 13.6259 17.8448 13.9384L13.9382 17.8451C13.6257 18.1577 13.2018 18.3333 12.7598 18.3334H7.23984C6.79785 18.3333 6.37399 18.1577 6.0615 17.8451L2.15484 13.9384Z" stroke="#bb4200" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12.4998 7.50008L7.49984 12.5001M7.49984 7.50008L12.4998 12.5001" stroke="#bb4200" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="text-base font-semibold" style={{ color: "#bb4200" }}>You stopped the agent</span>
                      </div>
                      <p className="text-base" style={{ color: "#273540" }}>Try again or tell the agent what it should do instead.</p>
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
                      agentName={config.agentName}
                      onRetry={() => {
                        const prev = messages.slice(0, i).reverse().find(m => m.role === "user")
                        if (prev) handleSubmit(prev.content)
                      }}
                    />
                  )
                )}

                {/* In-progress streaming response */}
                {isStreaming && (
                  <AssistantBubble content={streamingContent} elapsedSec={null} isStreaming agentName={config.agentName} />
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

                {/* Suggested prompts after last assistant response */}
                {!isStreaming && !chatError && (() => {
                  const reversed = [...messages].reverse()
                  const lastSignificant = reversed.find(m => m.role !== "user")
                  if (lastSignificant?.role !== "assistant" && lastSignificant?.role !== "canned") return null
                  const prompts = lastSignificant?.role === "canned"
                    ? lastSignificant.suggestedPrompts
                    : lastSignificant?.structured?.suggestedPrompts
                  if (!prompts?.length) return null
                  return (
                    <div key={messages.length} className="solo-fade-in-delayed flex flex-col gap-4 pb-2">
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

          {/* ── Input area ───────────────────────────────────────────────── */}
          {view !== "history" && (
            <div className="shrink-0 px-4 pb-4">
              <div
                className={cn(
                  "flex flex-col gap-3 p-4 rounded-2xl bg-white border transition-[border-color,box-shadow]",
                  inputFocused
                    ? "border-[var(--color-info)] ring-2 ring-[var(--color-info)] ring-offset-[3px]"
                    : "border-[#5f6e7a]",
                )}
              >
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

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
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
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex flex-col gap-1">
                              <span style={{ fontFamily: "var(--font-heading)", fontSize: 16, fontWeight: 700, color: "#273540" }}>
                                {config.name}
                              </span>
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
                          <Link href="#" icon={ExternalLink} iconPlacement="end" onClick={(e) => e.preventDefault()}>
                            AI Privacy Notice
                          </Link>
                          <div className="flex flex-col">
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

            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  )
}

export { SoloAgentShell }
