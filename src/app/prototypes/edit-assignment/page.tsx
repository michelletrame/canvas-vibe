"use client"

import React from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  AlignJustify,
  Copy,
  CircleHelp,
  Undo2,
  Redo2,
  Eye,
  PenLine,
  ChevronDown,
  ChevronUp,
  X,
  Bold,
  Italic,
  Underline,
  Link2,
  Image,
  Code,
  Maximize2,
  GripVertical,
  Keyboard,
  AlignLeft,
  List,
  Indent,
  Check,
  Search,
  FileText,
  Shield,
  Lock,
  Minus,
  Plus,
  Sparkles,
  CheckCheck,
  RefreshCw,
  Trash2,
  FilePlus,
  Grid3x3,
  Lightbulb,
  BookOpen,
  Paperclip,
  Upload,
} from "lucide-react"
import { streamOllamaChat } from "@/lib/ollama"

// ── Mock data ─────────────────────────────────────────────────────────────────

const MODULES = [
  "Week 1: Introduction to Rhetoric",
  "Week 2: Argumentative Writing",
  "Week 3: Research Methods",
  "Week 4: Peer Review",
  "Week 5: Revision Strategies",
  "No module",
]

const ASSIGNMENT_GROUPS = [
  "Essays",
  "Homework",
  "In-class Activities",
  "Participation",
  "Quizzes",
  "Projects",
  "Final Exam",
]

const SAVED_OUTCOMES = [
  "Writing: Crafting Thesis Statements",
  "Writing: Argumentation",
  "Writing: Evidence Integration",
  "Writing: Revision and Editing",
  "Reading: Critical Analysis",
  "Reading: Comprehension Strategies",
  "Speaking: Oral Presentation",
  "Speaking: Collaborative Discussion",
  "Critical Thinking: Evaluating Sources",
  "Critical Thinking: Problem Solving",
]

// ── Shared dropdown components ────────────────────────────────────────────────

function SelectDropdown({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (v: string) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [dropdownPos, setDropdownPos] = React.useState({ top: 0, left: 0, width: 0 })
  const ref = React.useRef<HTMLDivElement>(null)
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    if (!open) return
    function handlePointerDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("pointerdown", handlePointerDown)
    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [open])

  function handleToggle() {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setDropdownPos({ top: rect.bottom + 4, left: rect.left, width: rect.width })
    }
    setOpen((v) => !v)
  }

  return (
    <div className="flex flex-col gap-2" ref={ref}>
      <label className="text-base font-medium" style={{ color: "#273540" }}>{label}</label>
      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          onClick={handleToggle}
          className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-left transition-colors"
          style={{
            background: "#fff",
            border: `1.2px solid ${open ? "#2b7abc" : "#6a7883"}`,
            boxShadow: open ? "0 0 0 3px rgba(43,122,188,0.12)" : "none",
          }}
        >
          <span className="text-base" style={{ color: "#273540" }}>{value}</span>
          <ChevronDown
            size={16}
            style={{
              color: "#273540",
              flexShrink: 0,
              transform: open ? "rotate(180deg)" : "none",
              transition: "transform 0.15s",
            }}
          />
        </button>
        {open && (
          <div
            style={{
              position: "fixed",
              top: dropdownPos.top,
              left: dropdownPos.left,
              width: dropdownPos.width,
              zIndex: 9999,
              background: "#fff",
              border: "1px solid #d7dade",
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(39,53,64,0.12)",
              overflow: "hidden",
            }}
          >
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                className="flex items-center justify-between w-full px-4 py-2.5 text-base text-left hover:bg-blue-50 transition-colors"
                style={{ color: "#273540" }}
                onPointerDown={(e) => {
                  e.preventDefault()
                  onChange(opt)
                  setOpen(false)
                }}
              >
                {opt}
                {opt === value && <Check size={15} style={{ color: "#2b7abc", flexShrink: 0 }} />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Compact dropdown for use inside cards (smaller text, tighter padding)
function MiniSelect({
  label,
  value,
  options,
  onChange,
  disabled = false,
}: {
  label: string
  value: string
  options: string[]
  onChange: (v: string) => void
  disabled?: boolean
}) {
  const [open, setOpen] = React.useState(false)
  const [dropdownPos, setDropdownPos] = React.useState({ top: 0, left: 0, width: 0 })
  const ref = React.useRef<HTMLDivElement>(null)
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    if (!open || disabled) return
    function handlePointerDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("pointerdown", handlePointerDown)
    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [open, disabled])

  function handleToggle() {
    if (disabled) return
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setDropdownPos({ top: rect.bottom + 4, left: rect.left, width: rect.width })
    }
    setOpen((v) => !v)
  }

  return (
    <div className="flex flex-col gap-1.5" ref={ref}>
      <label className="text-sm font-medium" style={{ color: disabled ? "#9aa5ae" : "#273540" }}>
        {label}
      </label>
      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          onClick={handleToggle}
          disabled={disabled}
          className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-left transition-colors"
          style={{
            background: disabled ? "#f5f7f8" : "#fff",
            border: `1.2px solid ${disabled ? "#d7dade" : open ? "#2b7abc" : "#6a7883"}`,
            boxShadow: open && !disabled ? "0 0 0 3px rgba(43,122,188,0.12)" : "none",
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          <span className="text-sm" style={{ color: disabled ? "#9aa5ae" : "#273540" }}>{value}</span>
          <ChevronDown
            size={14}
            style={{
              color: disabled ? "#9aa5ae" : "#273540",
              flexShrink: 0,
              transform: open ? "rotate(180deg)" : "none",
              transition: "transform 0.15s",
            }}
          />
        </button>
        {open && !disabled && (
          <div
            style={{
              position: "fixed",
              top: dropdownPos.top,
              left: dropdownPos.left,
              width: dropdownPos.width,
              zIndex: 9999,
              background: "#fff",
              border: "1px solid #d7dade",
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(39,53,64,0.12)",
              overflow: "hidden",
            }}
          >
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                className="flex items-center justify-between w-full px-4 py-2.5 text-sm text-left hover:bg-blue-50 transition-colors"
                style={{ color: "#273540" }}
                onPointerDown={(e) => {
                  e.preventDefault()
                  onChange(opt)
                  setOpen(false)
                }}
              >
                {opt}
                {opt === value && <Check size={14} style={{ color: "#2b7abc", flexShrink: 0 }} />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Outcomes autocomplete ─────────────────────────────────────────────────────

function OutcomesField({
  selected,
  onChange,
}: {
  selected: string[]
  onChange: (outcomes: string[]) => void
}) {
  const [query, setQuery] = React.useState("")
  const [focused, setFocused] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const suggestions = React.useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return SAVED_OUTCOMES.filter(
      (o) => !selected.includes(o) && o.toLowerCase().includes(q)
    ).slice(0, 6)
  }, [query, selected])

  const showDropdown = focused && (suggestions.length > 0 || query.trim().length > 0)

  React.useEffect(() => {
    if (!showDropdown) return
    function handlePointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false)
        setQuery("")
      }
    }
    document.addEventListener("pointerdown", handlePointerDown)
    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [showDropdown])

  function addOutcome(outcome: string) {
    onChange([...selected, outcome])
    setQuery("")
  }

  function removeOutcome(outcome: string) {
    onChange(selected.filter((o) => o !== outcome))
  }

  function splitOutcome(o: string) {
    const idx = o.indexOf(": ")
    if (idx === -1) return { category: "", detail: o }
    return { category: o.slice(0, idx + 1), detail: o.slice(idx + 2) }
  }

  return (
    <div className="flex flex-col gap-2" ref={containerRef}>
      <label className="text-base font-medium" style={{ color: "#273540" }}>
        Align Outcomes
      </label>
      <div className="relative">
        <div
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all"
          style={{
            background: "#fff",
            border: `1.2px solid ${focused ? "#2b7abc" : "#6a7883"}`,
            boxShadow: focused ? "0 0 0 3px rgba(43,122,188,0.12)" : "none",
          }}
        >
          <Search size={15} style={{ color: "#6a7883", flexShrink: 0 }} />
          <input
            className="flex-1 text-base bg-transparent focus:outline-none"
            style={{ color: "#273540" }}
            placeholder="Start typing outcome name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
          />
          {query && (
            <button type="button" onPointerDown={(e) => { e.preventDefault(); setQuery("") }}>
              <X size={14} style={{ color: "#6a7883" }} />
            </button>
          )}
        </div>
        {showDropdown && (
          <div
            className="absolute left-0 right-0 top-full mt-1 z-50 overflow-hidden"
            style={{
              background: "#fff",
              border: "1px solid #d7dade",
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(39,53,64,0.12)",
            }}
          >
            {suggestions.length > 0 ? (
              suggestions.map((outcome) => {
                const { category, detail } = splitOutcome(outcome)
                return (
                  <button
                    key={outcome}
                    type="button"
                    className="flex items-center w-full px-4 py-2.5 text-sm text-left hover:bg-blue-50 transition-colors"
                    style={{ color: "#273540" }}
                    onPointerDown={(e) => { e.preventDefault(); addOutcome(outcome) }}
                  >
                    {category && <span className="font-medium mr-1" style={{ color: "#273540" }}>{category}</span>}
                    {detail}
                  </button>
                )
              })
            ) : (
              <div className="px-4 py-3 text-sm text-center" style={{ color: "#6a7883" }}>
                No outcomes match &ldquo;{query}&rdquo;
              </div>
            )}
          </div>
        )}
      </div>
      {selected.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-1">
          {selected.map((outcome) => {
            const { category, detail } = splitOutcome(outcome)
            return (
              <div
                key={outcome}
                className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-lg text-sm"
                style={{ border: "1px solid #d7dade", background: "#fff", color: "#273540" }}
              >
                {category && <span className="font-medium">{category}</span>}
                <span>{detail}</span>
                <button
                  type="button"
                  onClick={() => removeOutcome(outcome)}
                  className="flex items-center justify-center w-4 h-4 rounded-full hover:bg-gray-100 transition-colors ml-0.5"
                >
                  <X size={11} style={{ color: "#6a7883" }} />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Editable title ────────────────────────────────────────────────────────────

function EditableTitle({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const [editing, setEditing] = React.useState(false)
  const [draft, setDraft] = React.useState(value)
  const inputRef = React.useRef<HTMLInputElement>(null)

  function startEdit() {
    setDraft(value)
    setEditing(true)
    setTimeout(() => inputRef.current?.select(), 0)
  }

  function commit() {
    const trimmed = draft.trim()
    onChange(trimmed || "Untitled assignment")
    setEditing(false)
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        autoFocus
        className="text-xl font-semibold bg-transparent focus:outline-none border-b-2 min-w-0 w-full max-w-md"
        style={{ color: "#273540", borderColor: "#2b7abc" }}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit()
          if (e.key === "Escape") setEditing(false)
        }}
      />
    )
  }

  return (
    <div className="flex items-center gap-2">
      <h1 className="text-xl font-semibold" style={{ color: "#273540" }}>{value}</h1>
      <button
        type="button"
        onClick={startEdit}
        className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-black/5 transition-colors"
        title="Edit title"
      >
        <PenLine size={16} style={{ color: "#273540" }} />
      </button>
    </div>
  )
}

// ── RCE ───────────────────────────────────────────────────────────────────────

const MENU_BAR_ITEMS = ["Edit", "View", "Insert", "Insert", "Format", "Tools", "Table"]

function RichContentEditor() {
  const [wordCount, setWordCount] = React.useState(0)

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const words = e.target.value.trim().split(/\s+/).filter(Boolean).length
    setWordCount(words)
  }

  return (
    <div className="flex flex-col" style={{ border: "1px solid #c7cdd1", borderRadius: 4 }}>
      <div className="flex items-center gap-6 px-3 py-2 flex-wrap" style={{ borderBottom: "1px solid #e8eaec" }}>
        {MENU_BAR_ITEMS.map((item, i) => (
          <button key={i} className="text-base hover:underline" style={{ color: "#2d3b45" }}>{item}</button>
        ))}
      </div>
      <div className="flex items-center gap-3 px-3 py-1.5 flex-wrap" style={{ borderBottom: "1px solid #e8eaec" }}>
        <span className="flex items-center gap-1 text-sm cursor-pointer select-none" style={{ color: "#2d3b45" }}>
          12pt <ChevronDown size={10} />
        </span>
        <span className="flex items-center gap-1 text-sm cursor-pointer select-none" style={{ color: "#2d3b45" }}>
          Paragraph <ChevronDown size={10} />
        </span>
        <div style={{ width: 1, height: 24, background: "#8b969e" }} />
        <button className="p-1 rounded hover:bg-gray-100"><Bold size={14} style={{ color: "#2d3b45" }} /></button>
        <button className="p-1 rounded hover:bg-gray-100"><Italic size={14} style={{ color: "#2d3b45" }} /></button>
        <button className="p-1 rounded hover:bg-gray-100"><Underline size={14} style={{ color: "#2d3b45" }} /></button>
        <div style={{ width: 1, height: 24, background: "#8b969e" }} />
        <button className="p-1 rounded hover:bg-gray-100"><Link2 size={14} style={{ color: "#2d3b45" }} /></button>
        <button className="p-1 rounded hover:bg-gray-100"><Image size={14} style={{ color: "#2d3b45" }} /></button>
        <div style={{ width: 1, height: 24, background: "#8b969e" }} />
        <button className="p-1 rounded hover:bg-gray-100"><AlignLeft size={14} style={{ color: "#2d3b45" }} /></button>
        <button className="p-1 rounded hover:bg-gray-100"><List size={14} style={{ color: "#2d3b45" }} /></button>
        <button className="p-1 rounded hover:bg-gray-100"><Indent size={14} style={{ color: "#2d3b45" }} /></button>
      </div>
      <textarea
        className="w-full resize-none px-3 py-2 text-base focus:outline-none bg-white"
        style={{ color: "#2d3b45", minHeight: 160 }}
        placeholder="Form text"
        onChange={handleChange}
      />
      <div className="flex items-center justify-end gap-3 px-3 py-2" style={{ borderTop: "1px solid #e8eaec" }}>
        <Keyboard size={14} style={{ color: "#2d3b45" }} />
        <div style={{ width: 1, height: 20, background: "#8b969e" }} />
        <span className="text-sm" style={{ color: "#2d3b45" }}>{wordCount} {wordCount === 1 ? "word" : "words"}</span>
        <div style={{ width: 1, height: 20, background: "#8b969e" }} />
        <button className="p-0.5 hover:opacity-70"><Code size={14} style={{ color: "#2d3b45" }} /></button>
        <button className="p-0.5 hover:opacity-70"><Maximize2 size={14} style={{ color: "#2d3b45" }} /></button>
        <button className="p-0.5 hover:opacity-70"><GripVertical size={14} style={{ color: "#2d3b45" }} /></button>
      </div>
    </div>
  )
}

// ── Grading tab ───────────────────────────────────────────────────────────────

type GradingTools = { score: boolean; comments: boolean; rubric: boolean; annotations: boolean }
type OnlineOptions = { textEntry: boolean; websiteUrl: boolean; fileUploads: boolean }

function CheckRow({
  label,
  checked,
  onChange,
  note,
}: {
  label: string
  checked: boolean
  onChange: () => void
  note?: string
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex items-start gap-3 w-full px-4 py-3 text-left transition-colors hover:bg-slate-50"
      style={{ borderBottom: "1px solid #e8eaec" }}
    >
      <div
        className="flex items-center justify-center w-4 h-4 mt-0.5 rounded flex-shrink-0"
        style={{
          border: checked ? "none" : "1.5px solid #6a7883",
          background: checked ? "#2b7abc" : "transparent",
        }}
      >
        {checked && <Check size={11} color="#fff" />}
      </div>
      <div>
        <div className="text-sm" style={{ color: "#273540" }}>{label}</div>
        {note && <div className="text-xs mt-0.5" style={{ color: "#6a7883" }}>{note}</div>}
      </div>
    </button>
  )
}

function GradingTab() {
  // Grading tools
  const [gradingTools, setGradingTools] = React.useState<GradingTools>({
    score: true, comments: false, rubric: false, annotations: true,
  })
  const rubricChecked = gradingTools.rubric

  // Score
  const [points, setPoints] = React.useState("10")
  const [displayScore, setDisplayScore] = React.useState("Letter Grade")
  const [doNotCount, setDoNotCount] = React.useState(false)

  // Submission types
  const [submissionType, setSubmissionType] = React.useState("online")
  const [onlineOptions, setOnlineOptions] = React.useState<OnlineOptions>({
    textEntry: true, websiteUrl: false, fileUploads: true,
  })

  // Grading defaults (attempts) — collapsed by default
  const [attemptsExpanded, setAttemptsExpanded] = React.useState(false)
  const [submissionsBeforeDue, setSubmissionsBeforeDue] = React.useState("Unlimited")
  const [numberOfAttempts, setNumberOfAttempts] = React.useState("3")
  const [resubmissionRevisions, setResubmissionRevisions] = React.useState("Allowed")
  const [regradeAfterResubmission, setRegradeAfterResubmission] = React.useState("Yes")

  // Policies — collapsed by default
  const [policiesExpanded, setPoliciesExpanded] = React.useState(false)
  const [latePolicy, setLatePolicy] = React.useState("Course default")
  const [gradePosting, setGradePosting] = React.useState("Manual")

  // Summary strings for collapsed rows
  const gradingDefaultsSummary = [
    submissionsBeforeDue === "Unlimited" ? "Unlimited submissions" : `Up to ${submissionsBeforeDue} submissions before due date`,
    resubmissionRevisions === "Allowed" ? "Require resubmission with revisions" : "No resubmission required",
    `Regrade after resubmission: ${regradeAfterResubmission}`,
  ].join(", ")

  const policiesSummary = `Late policy: ${latePolicy}, Grade posting: ${gradePosting}`

  return (
    <div className="max-w-[800px] mx-auto px-4 py-8 flex flex-col gap-6 pb-16">
      {/* Page heading */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold" style={{ color: "#273540" }}>Grading</h1>
        <p className="text-sm" style={{ color: "#6a7883" }}>Define how this assignment will be graded</p>
      </div>

      {/* Grading Tools */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: "1px solid #e8eaec" }}>
        <div className="px-4 py-3" style={{ borderBottom: "1px solid #e8eaec" }}>
          <h2 className="text-sm font-semibold" style={{ color: "#273540" }}>Grading Tools</h2>
        </div>
        <CheckRow label="Score" checked={gradingTools.score} onChange={() => setGradingTools(t => ({ ...t, score: !t.score }))} />
        <CheckRow label="Comments" checked={gradingTools.comments} onChange={() => setGradingTools(t => ({ ...t, comments: !t.comments }))} />
        <CheckRow label="Rubric" checked={gradingTools.rubric} onChange={() => setGradingTools(t => ({ ...t, rubric: !t.rubric }))} />
        <CheckRow label="Annotations" checked={gradingTools.annotations} onChange={() => setGradingTools(t => ({ ...t, annotations: !t.annotations }))} />
      </div>

      {/* Score */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: "1px solid #e8eaec" }}>
        <div className="px-4 py-3" style={{ borderBottom: "1px solid #e8eaec" }}>
          <h2 className="text-sm font-semibold" style={{ color: "#273540" }}>Score</h2>
        </div>
        <div className="px-4 py-4 flex flex-col gap-4">
          {/* Points + Display score as — side by side */}
          <div className="grid grid-cols-2 gap-4">
            {/* Points */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" style={{ color: rubricChecked ? "#9aa5ae" : "#273540" }}>
                Points
              </label>
              {rubricChecked ? (
                <div className="flex flex-col gap-1">
                  <div
                    className="flex items-center gap-2 px-3 py-2 rounded-xl"
                    style={{ background: "#f5f7f8", border: "1.2px solid #d7dade" }}
                  >
                    <Lock size={12} style={{ color: "#9aa5ae", flexShrink: 0 }} />
                    <span className="text-sm" style={{ color: "#9aa5ae" }}>{points}</span>
                  </div>
                  <p className="text-xs italic" style={{ color: "#6a7883" }}>Score determined by rubric</p>
                </div>
              ) : (
                <input
                  type="number"
                  min={0}
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  className="px-3 py-2 text-sm rounded-xl focus:outline-none transition-all"
                  style={{ border: "1.2px solid #6a7883", color: "#273540", background: "#fff" }}
                />
              )}
            </div>

            {/* Display score as */}
            <MiniSelect
              label="Display score as"
              value={displayScore}
              options={["Number", "Percentage", "Letter Grade"]}
              onChange={setDisplayScore}
            />
          </div>

          {/* Do not count checkbox */}
          <button
            type="button"
            onClick={() => setDoNotCount((v) => !v)}
            className="flex items-center gap-3 text-left"
          >
            <div
              className="flex items-center justify-center w-4 h-4 rounded flex-shrink-0"
              style={{
                border: doNotCount ? "none" : "1.5px solid #6a7883",
                background: doNotCount ? "#2b7abc" : "transparent",
              }}
            >
              {doNotCount && <Check size={11} color="#fff" />}
            </div>
            <span className="text-sm" style={{ color: "#273540" }}>
              Do not count this assignment towards the final grade
            </span>
          </button>
        </div>
      </div>

      {/* Submission types */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: "1px solid #e8eaec" }}>
        <div className="px-4 py-3" style={{ borderBottom: "1px solid #e8eaec" }}>
          <h2 className="text-sm font-semibold" style={{ color: "#273540" }}>Submission types</h2>
        </div>
        <div className="px-4 py-4 flex flex-col gap-4">
          <div className="flex overflow-hidden rounded-full" style={{ border: "1px solid #d7dade", width: "fit-content" }}>
            {(["online", "external"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSubmissionType(type)}
                className="px-5 py-1.5 text-sm transition-colors"
                style={{
                  background: submissionType === type ? "#273540" : "transparent",
                  color: submissionType === type ? "#fff" : "#273540",
                }}
              >
                {type === "online" ? "Online" : "External tool"}
              </button>
            ))}
          </div>

          {submissionType === "online" && (
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #e8eaec" }}>
              <div className="px-4 py-2" style={{ borderBottom: "1px solid #e8eaec", background: "#f9f9f9" }}>
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#6a7883" }}>
                  Online submission options
                </span>
              </div>
              <CheckRow
                label="Text entry"
                checked={onlineOptions.textEntry}
                onChange={() => setOnlineOptions(o => ({ ...o, textEntry: !o.textEntry }))}
              />
              <CheckRow
                label="Website URL"
                checked={onlineOptions.websiteUrl}
                onChange={() => setOnlineOptions(o => ({ ...o, websiteUrl: !o.websiteUrl }))}
                note="*This submission type is not supported for annotations"
              />
              <CheckRow
                label="File upload(s)"
                checked={onlineOptions.fileUploads}
                onChange={() => setOnlineOptions(o => ({ ...o, fileUploads: !o.fileUploads }))}
              />
            </div>
          )}
        </div>
      </div>

      {/* Grading Defaults — collapsed summary or expanded Attempts controls */}
      {!attemptsExpanded ? (
        <div
          className="flex items-start gap-3 p-4 rounded-2xl"
          style={{ background: "#f5f7f8", border: "1px solid #e8eaec" }}
        >
          <FileText size={18} style={{ color: "#576773", flexShrink: 0, marginTop: 2 }} />
          <div className="flex-1 flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#6a7883" }}>
              Grading Defaults
            </span>
            <p className="text-sm" style={{ color: "#273540" }}>{gradingDefaultsSummary}</p>
          </div>
          <button
            type="button"
            onClick={() => setAttemptsExpanded(true)}
            className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-black/5 transition-colors flex-shrink-0"
            title="Edit grading defaults"
          >
            <PenLine size={14} style={{ color: "#576773" }} />
          </button>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: "1px solid #e8eaec" }}>
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: "1px solid #e8eaec" }}
          >
            <h2 className="text-sm font-semibold" style={{ color: "#273540" }}>Grading Defaults</h2>
            <button
              type="button"
              onClick={() => setAttemptsExpanded(false)}
              className="text-xs font-medium transition-opacity hover:opacity-70"
              style={{ color: "#2b7abc" }}
            >
              Done
            </button>
          </div>
          <div className="px-4 py-4 flex flex-col gap-4">
            <h3 className="text-sm font-semibold" style={{ color: "#576773" }}>Attempts</h3>
            <div className="grid grid-cols-2 gap-4">
              <MiniSelect
                label="Submissions before due date"
                value={submissionsBeforeDue}
                options={["Unlimited", "1", "2", "3", "4", "5"]}
                onChange={setSubmissionsBeforeDue}
              />
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-sm font-medium"
                  style={{ color: submissionsBeforeDue === "Unlimited" ? "#9aa5ae" : "#273540" }}
                >
                  Number of attempts
                </label>
                <input
                  type="number"
                  min={1}
                  value={submissionsBeforeDue === "Unlimited" ? "" : numberOfAttempts}
                  onChange={(e) => setNumberOfAttempts(e.target.value)}
                  disabled={submissionsBeforeDue === "Unlimited"}
                  placeholder="—"
                  className="px-3 py-2 text-sm rounded-xl focus:outline-none transition-all"
                  style={{
                    border: `1.2px solid ${submissionsBeforeDue === "Unlimited" ? "#d7dade" : "#6a7883"}`,
                    background: submissionsBeforeDue === "Unlimited" ? "#f5f7f8" : "#fff",
                    color: submissionsBeforeDue === "Unlimited" ? "#9aa5ae" : "#273540",
                    cursor: submissionsBeforeDue === "Unlimited" ? "not-allowed" : "text",
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <MiniSelect
                label="Resubmission with revisions"
                value={resubmissionRevisions}
                options={["Allowed", "Not allowed"]}
                onChange={setResubmissionRevisions}
              />
              <MiniSelect
                label="Regrade after resubmission"
                value={regradeAfterResubmission}
                options={["Yes", "No"]}
                onChange={setRegradeAfterResubmission}
              />
            </div>
          </div>
        </div>
      )}

      {/* Policies — collapsed summary or expanded controls */}
      {!policiesExpanded ? (
        <div
          className="flex items-start gap-3 p-4 rounded-2xl"
          style={{ background: "#f5f7f8", border: "1px solid #e8eaec" }}
        >
          <Shield size={18} style={{ color: "#576773", flexShrink: 0, marginTop: 2 }} />
          <div className="flex-1 flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#6a7883" }}>
              Policies
            </span>
            <p className="text-sm" style={{ color: "#273540" }}>{policiesSummary}</p>
          </div>
          <button
            type="button"
            onClick={() => setPoliciesExpanded(true)}
            className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-black/5 transition-colors flex-shrink-0"
            title="Edit policies"
          >
            <PenLine size={14} style={{ color: "#576773" }} />
          </button>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: "1px solid #e8eaec" }}>
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: "1px solid #e8eaec" }}
          >
            <h2 className="text-sm font-semibold" style={{ color: "#273540" }}>Policies</h2>
            <button
              type="button"
              onClick={() => setPoliciesExpanded(false)}
              className="text-xs font-medium transition-opacity hover:opacity-70"
              style={{ color: "#2b7abc" }}
            >
              Done
            </button>
          </div>
          <div className="px-4 py-4 flex flex-col gap-4">
            <MiniSelect
              label="Late Policy"
              value={latePolicy}
              options={["Course default", "Deduct percentage", "No late submissions"]}
              onChange={setLatePolicy}
            />
            <MiniSelect
              label="Grade posting"
              value={gradePosting}
              options={["Manual", "Automatic"]}
              onChange={setGradePosting}
            />
          </div>
        </div>
      )}

      {/* Save button */}
      <div className="flex justify-end">
        <button
          className="px-5 py-2 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ background: "#1d354f" }}
        >
          Save changes
        </button>
      </div>
    </div>
  )
}

// ── Rubric tab ────────────────────────────────────────────────────────────────

// Types
type ScoreLevel = { id: string; label: string; points: number }
type AiMode     = "create" | "fill" | "improve" | "import"
type GenState   = "idle" | "generating" | "done"
type RCriterion = {
  id: string; title: string; description: string; maxPoints: number
  ratings: Record<string, string>; aiGenerated?: boolean; accepted?: boolean
  useCustomLevels?: boolean; customLevels?: ScoreLevel[]
}
type RAssignment = { id: string; title: string; course: string; dueDate: string; description: string }

// Constants
const R_DEFAULT_SCORE_LEVELS: ScoreLevel[] = [
  { id: "l4", label: "Exceeds Expectations", points: 4 },
  { id: "l3", label: "Mastery",               points: 3 },
  { id: "l2", label: "Near Mastery",           points: 2 },
  { id: "l1", label: "Below Expectations",     points: 1 },
  { id: "l0", label: "No Evidence",            points: 0 },
]

const R_INITIAL_CRITERIA: RCriterion[] = [
  { id: "c1", title: "Thesis & Argument", description: "Clarity and strength of the central argument", maxPoints: 4, ratings: {
    l4: "Presents a clear, specific, arguable thesis consistently supported throughout the essay.",
    l3: "Presents a clear thesis with adequate support, though argument may waver at points.",
    l2: "Thesis is present but vague or inconsistently supported by the body paragraphs.",
    l1: "Thesis is unclear, missing, or the argument is largely undeveloped.", l0: "",
  }, accepted: true },
  { id: "c2", title: "Evidence & Support", description: "Use of credible sources and evidence", maxPoints: 4, ratings: {
    l4: "Integrates relevant, credible evidence effectively; all sources are properly cited.",
    l3: "Uses adequate evidence; most sources are cited correctly.",
    l2: "Evidence is limited or not always relevant; citation issues present.",
    l1: "Little to no supporting evidence provided; citations are missing.", l0: "",
  }, accepted: true },
  { id: "c3", title: "Organization", description: "Structure, flow, and transitions", maxPoints: 4, ratings: {
    l4: "Well-organized with clear intro, body, and conclusion; transitions are smooth and logical.",
    l3: "Generally well-organized; transitions present but occasionally abrupt.",
    l2: "Basic structure present; transitions are weak or missing in places.",
    l1: "Lacks clear organizational structure; reader cannot easily follow the argument.", l0: "",
  }, accepted: true },
  { id: "c4", title: "Writing Mechanics", description: "Grammar, spelling, and sentence structure", maxPoints: 4, ratings: {
    l4: "Essentially error-free; sophisticated and varied sentence structure throughout.",
    l3: "Few minor errors that do not impede understanding.",
    l2: "Multiple errors that occasionally impede understanding.",
    l1: "Frequent errors in grammar, spelling, or punctuation that significantly impede understanding.", l0: "",
  }, accepted: true },
]

const R_MOCK_ASSIGNMENTS: RAssignment[] = [
  { id: "a1", title: "Persuasive Essay: Climate Policy",   course: "English 101",  dueDate: "Apr 14", description: "Write a 5-paragraph persuasive essay arguing for or against a specific climate policy. Must include at least 3 credible sources and a clear call to action." },
  { id: "a2", title: "Cell Division Lab Report",           course: "Biology 101",  dueDate: "Apr 18", description: "Document your observations from the mitosis/meiosis lab. Include hypothesis, methods, data tables, microscopy sketches, and a discussion of results." },
  { id: "a3", title: "World War I Causes Analysis",        course: "History 202",  dueDate: "Apr 22", description: "Analytical essay examining the long- and short-term causes of World War I. Evaluate the relative importance of militarism, alliances, imperialism, and nationalism." },
  { id: "a4", title: "Quadratic Functions Project",        course: "Algebra II",   dueDate: "Apr 25", description: "Create a real-world scenario modeled by a quadratic function. Graph the function, identify key features, and present findings in a one-page report with visuals." },
  { id: "a5", title: "Spanish Oral Presentation",          course: "Spanish III",  dueDate: "May 1",  description: "3-minute oral presentation in Spanish on a Hispanic cultural tradition of your choice. Graded on vocabulary, grammar, pronunciation, and cultural accuracy." },
  { id: "a6", title: "Ecology Research Paper",             course: "Biology 101",  dueDate: "May 5",  description: "8–10 page research paper on a local ecosystem. Cover food webs, energy flow, human impact, and propose one evidence-based conservation strategy." },
  { id: "a7", title: "Short Story: Unreliable Narrator",   course: "English 101",  dueDate: "May 8",  description: "Write a 1000–1500 word short story using an unreliable narrator." },
  { id: "a8", title: "Primary Source Analysis",            course: "History 202",  dueDate: "May 12", description: "Analyze two primary sources from the Civil Rights Movement (1954–1968). Compare their purpose, audience, and historical significance." },
]

const R_RUBRIC_TYPES = ["Scored Rubric", "Unscored Rubric", "Percent Rubric"]

const R_LEVEL_COLORS = [
  { bg: "bg-emerald-50", border: "border-emerald-100" },
  { bg: "bg-sky-50",     border: "border-sky-100"     },
  { bg: "bg-amber-50",   border: "border-amber-100"   },
  { bg: "bg-orange-50",  border: "border-orange-100"  },
  { bg: "bg-slate-50",   border: "border-slate-100"   },
  { bg: "bg-purple-50",  border: "border-purple-100"  },
  { bg: "bg-rose-50",    border: "border-rose-100"    },
  { bg: "bg-teal-50",    border: "border-teal-100"    },
]

const R_AI_MODES: { id: AiMode; label: string; icon: React.ElementType; hint: string }[] = [
  { id: "create",  label: "Create from scratch",  icon: FilePlus,  hint: "Build a complete rubric based on attached assignments or your own description." },
  { id: "fill",    label: "Fill empty cells",      icon: Grid3x3,   hint: "Write descriptions for any cells you haven't filled in yet." },
  { id: "improve", label: "Suggest improvements", icon: Lightbulb, hint: "Review your rubric and rewrite descriptions to be clearer and more specific." },
  { id: "import",  label: "Import from document", icon: Upload,    hint: "Paste or upload an existing rubric and AI will parse it into the grid." },
]

// AI prompt helpers
function rCreatePrompt(attached: RAssignment[], extra: string, levels: ScoreLevel[]): string {
  const ld = levels.map((l) => `${l.label} (${l.points} pts)`).join(", ")
  const ctx = attached.length > 0
    ? attached.map((a, i) => `Assignment ${i + 1}: "${a.title}" (${a.course}, due ${a.dueDate})\n${a.description}`).join("\n\n")
    : `Assignment description: "${extra}"`
  const ex = attached.length > 0 && extra.trim() ? `\nAdditional instructions: ${extra}` : ""
  return `Create a complete rubric for the following assignment${attached.length > 1 ? "s" : ""}:\n\n${ctx}${ex}\n\nScore levels (use exactly these): ${ld}\n\nRespond with JSON only:\n{\n  "criteria": [\n    { "title": "...", "description": "...", "ratings": { ${levels.map((l) => `"${l.id}": "..."`).join(", ")} } }\n  ]\n}\n\nGenerate 3–5 criteria with specific, measurable, student-facing descriptions.`
}
function rFillPrompt(criteria: RCriterion[], levels: ScoreLevel[]): string {
  const state = criteria.map((c) => ({ id: c.id, title: c.title, description: c.description, levels: levels.map((l) => ({ levelId: l.id, levelLabel: l.label, existing: c.ratings[l.id] ?? "" })) }))
  return `Fill in missing rating descriptions for this rubric. Keep existing descriptions unchanged.\n\nCurrent rubric:\n${JSON.stringify(state, null, 2)}\n\nScore levels: ${levels.map((l) => `${l.id}="${l.label} (${l.points}pts)"`).join(", ")}\n\nRespond with JSON only:\n{ "criteria": [ { "id": "...", "ratings": { "levelId": "description — only for empty cells" } } ] }`
}
function rImprovePrompt(criteria: RCriterion[], levels: ScoreLevel[]): string {
  const state = criteria.map((c) => ({ id: c.id, title: c.title, description: c.description, ratings: levels.reduce((acc, l) => ({ ...acc, [l.id]: c.ratings[l.id] ?? "" }), {} as Record<string, string>) }))
  return `Improve this rubric to be more specific, observable, and student-facing. Rewrite all cells.\n\nCurrent rubric:\n${JSON.stringify(state, null, 2)}\n\nScore levels: ${levels.map((l) => `${l.id}="${l.label} (${l.points}pts)"`).join(", ")}\n\nRespond with JSON only:\n{ "criteria": [ { "id": "...", "title": "...", "description": "...", "ratings": { "levelId": "..." } } ] }`
}
function rImportPrompt(docText: string, levels: ScoreLevel[]): string {
  const ld = levels.map((l) => `${l.label} (${l.points} pts)`).join(", ")
  return `Parse the following rubric document and extract its criteria and performance descriptions.\n\nDocument:\n${docText}\n\nMap all extracted rating descriptions to these score levels: ${ld}\n\nRespond with JSON only:\n{\n  "criteria": [\n    { "title": "...", "description": "...", "ratings": { ${levels.map((l) => `"${l.id}": "..."`).join(", ")} } }\n  ]\n}\n\nExtract all criteria and map descriptions to the closest matching score levels. Generate 2–6 criteria.`
}

// Sub-components
function RAssignmentSearch({ attached, onAdd }: { attached: RAssignment[]; onAdd: (a: RAssignment) => void }) {
  const [query, setQuery] = React.useState("")
  const [open, setOpen]   = React.useState(false)
  const containerRef      = React.useRef<HTMLDivElement>(null)

  const results = React.useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    const ids = new Set(attached.map((a) => a.id))
    return R_MOCK_ASSIGNMENTS.filter((a) => !ids.has(a.id) && (a.title.toLowerCase().includes(q) || a.course.toLowerCase().includes(q))).slice(0, 6)
  }, [query, attached])

  React.useEffect(() => {
    function handler(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("pointerdown", handler)
    return () => document.removeEventListener("pointerdown", handler)
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center gap-2 rounded-xl border px-3 py-2 transition-all" style={{ borderColor: open ? "var(--ring)" : "var(--border)", background: "#fff", boxShadow: open ? "0 0 0 3px rgba(43,122,188,0.12)" : "none" }}>
        <Search size={13} style={{ color: "var(--color-text-muted)", flexShrink: 0 }} />
        <input className="flex-1 text-xs bg-transparent focus:outline-none" style={{ color: "var(--foreground)" }} placeholder="Search by assignment or course name…" value={query} onChange={(e) => { setQuery(e.target.value); setOpen(true) }} onFocus={() => setOpen(true)} />
        {query && <button onClick={() => { setQuery(""); setOpen(false) }}><X size={12} style={{ color: "var(--color-text-muted)" }} /></button>}
      </div>
      {open && results.length > 0 && (
        <div className="absolute z-50 left-0 right-0 mt-1 rounded-xl overflow-hidden" style={{ background: "#fff", border: "1px solid var(--border)", boxShadow: "var(--shadow-popover)" }}>
          {results.map((a) => (
            <button key={a.id} onPointerDown={(e) => { e.preventDefault(); onAdd(a); setQuery(""); setOpen(false) }} className="flex flex-col w-full text-left px-3 py-2.5 hover:bg-blue-50 transition-colors border-b last:border-b-0" style={{ borderColor: "var(--color-stroke-muted)" }}>
              <span className="text-xs font-medium truncate" style={{ color: "var(--foreground)" }}>{a.title}</span>
              <span className="text-[11px]" style={{ color: "var(--color-text-muted)" }}>{a.course} · Due {a.dueDate}</span>
            </button>
          ))}
        </div>
      )}
      {open && query.trim() && results.length === 0 && (
        <div className="absolute z-50 left-0 right-0 mt-1 rounded-xl px-3 py-3 text-center" style={{ background: "#fff", border: "1px solid var(--border)", boxShadow: "var(--shadow-popover)" }}>
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>No assignments match "{query}"</p>
        </div>
      )}
    </div>
  )
}

function REditableCell({ value, onChange, placeholder, isTitle, isAiPending }: { value: string; onChange: (v: string) => void; placeholder?: string; isTitle?: boolean; isAiPending?: boolean }) {
  const [focused, setFocused] = React.useState(false)
  return (
    <div className={`group relative rounded transition-all ${focused ? "ring-2 ring-blue-400/60 bg-white" : isAiPending ? "bg-violet-50/60 hover:bg-violet-50" : "hover:bg-blue-50/40"}`}>
      <textarea className={`w-full resize-none bg-transparent px-2 py-1.5 focus:outline-none leading-relaxed ${isTitle ? "text-sm font-semibold" : "text-xs"}`} style={{ color: "var(--foreground)", minHeight: isTitle ? 28 : 56, caretColor: "var(--primary)" }} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} rows={isTitle ? 1 : 3} />
      {!focused && <PenLine size={10} className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-40 transition-opacity pointer-events-none" style={{ color: "var(--primary)" }} />}
    </div>
  )
}

function RCriterionRow({ criterion, levels, isAiPending, writtenFeedback, showPoints, pointLabel, onUpdateTitle, onUpdateDescription, onUpdateRating, onAccept, onDelete, onToggleCustomLevels, onUpdateCustomLevel, onAddCustomLevel, onRemoveCustomLevel }: {
  criterion: RCriterion; levels: ScoreLevel[]; isAiPending: boolean; writtenFeedback: boolean; showPoints: boolean; pointLabel: string
  onUpdateTitle: (v: string) => void; onUpdateDescription: (v: string) => void; onUpdateRating: (levelId: string, v: string) => void
  onAccept: () => void; onDelete: () => void; onToggleCustomLevels: () => void
  onUpdateCustomLevel: (levelId: string, patch: Partial<ScoreLevel>) => void; onAddCustomLevel: () => void; onRemoveCustomLevel: (levelId: string) => void
}) {
  return (
    <tr className="group/row border-b" style={{ borderColor: "var(--border)", background: isAiPending ? "rgba(148,79,179,0.025)" : "white" }}>
      <td className="p-2 align-top" style={{ width: 200, minWidth: 170, borderRight: "1px solid var(--border)", background: isAiPending ? "rgba(148,79,179,0.05)" : "var(--muted)" }}>
        <div className="flex flex-col gap-1.5">
          <REditableCell value={criterion.title} onChange={onUpdateTitle} placeholder="Criterion name…" isTitle isAiPending={isAiPending} />
          <REditableCell value={criterion.description} onChange={onUpdateDescription} placeholder="Describe what this criterion measures…" isAiPending={isAiPending} />
          <div className="flex items-center mt-1 px-2 gap-1">
            {showPoints && <span className="text-[11px] font-medium mr-auto" style={{ color: "var(--color-text-muted)" }}>{criterion.maxPoints} {pointLabel}</span>}
            {!writtenFeedback && (
              <button onClick={onToggleCustomLevels} title={criterion.useCustomLevels ? "Use global levels" : "Override levels for this criterion"} className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-all" style={{ background: criterion.useCustomLevels ? "rgba(148,79,179,0.1)" : "transparent", color: criterion.useCustomLevels ? "#944fb3" : "var(--color-text-muted)", border: criterion.useCustomLevels ? "1px solid rgba(148,79,179,0.3)" : "1px solid transparent" }}>
                <Grid3x3 size={10} /> {criterion.useCustomLevels ? "Custom" : "Override"}
              </button>
            )}
            {isAiPending && (
              <button onClick={onAccept} className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold text-white" style={{ background: "var(--btn-success-bg)" }}>
                <Check size={10} /> Accept
              </button>
            )}
            <button onClick={onDelete} className="opacity-0 group-hover/row:opacity-60 hover:!opacity-100 transition-opacity p-1 rounded">
              <Trash2 size={12} style={{ color: "var(--color-error)" }} />
            </button>
          </div>
        </div>
      </td>
      {writtenFeedback ? (
        <td colSpan={levels.length} className="p-3 align-middle" style={{ borderRight: "1px solid var(--border)" }}>
          <div className="w-full h-16 rounded-lg flex items-center justify-center" style={{ background: isAiPending ? "rgba(148,79,179,0.04)" : "var(--muted)", border: "1px dashed var(--border)" }}>
            <span className="text-xs" style={{ color: "var(--color-text-placeholder)" }}>Feedback written during grading</span>
          </div>
        </td>
      ) : criterion.useCustomLevels ? (
        <td colSpan={levels.length} className="p-0 align-top" style={{ borderLeft: "1px solid var(--border)" }}>
          <div className="flex flex-col">
            <div className="flex" style={{ borderBottom: "1px solid var(--border)", background: "rgba(148,79,179,0.07)" }}>
              {(criterion.customLevels ?? []).map((lvl, i) => (
                <div key={lvl.id} className="group/clvl flex items-center gap-1 p-2" style={{ flex: 1, minWidth: 90, borderRight: i < (criterion.customLevels!.length - 1) ? "1px solid var(--border)" : "none" }}>
                  <div className="flex flex-col flex-1 gap-0.5 min-w-0">
                    <input className="text-xs font-semibold w-full focus:outline-none bg-transparent truncate" style={{ color: "var(--foreground)" }} value={lvl.label} onChange={(e) => onUpdateCustomLevel(lvl.id, { label: e.target.value })} />
                    {showPoints && (
                      <div className="flex items-center gap-1">
                        <input type="number" min={0} className="text-xs w-10 text-center rounded px-1 py-0.5 focus:outline-none focus:ring-1" style={{ background: "white", border: "1px solid var(--border)", color: "var(--foreground)" }} value={lvl.points} onChange={(e) => onUpdateCustomLevel(lvl.id, { points: Number(e.target.value) })} />
                        <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>{pointLabel}</span>
                      </div>
                    )}
                  </div>
                  <button onClick={() => onRemoveCustomLevel(lvl.id)} className="opacity-0 group-hover/clvl:opacity-50 hover:!opacity-100 flex-shrink-0 transition-opacity"><X size={10} style={{ color: "var(--color-error)" }} /></button>
                </div>
              ))}
              <div className="flex items-center justify-center px-2 flex-shrink-0" style={{ borderLeft: "1px solid var(--border)" }}>
                <button onClick={onAddCustomLevel} className="p-0.5 rounded hover:bg-purple-100 transition-colors" title="Add level"><Plus size={12} style={{ color: "#944fb3" }} /></button>
              </div>
            </div>
            <div className="flex" style={{ minHeight: 80 }}>
              {(criterion.customLevels ?? []).map((lvl, i) => {
                const color = R_LEVEL_COLORS[i % R_LEVEL_COLORS.length]
                return (
                  <div key={lvl.id} className={`p-2 ${color.bg}`} style={{ flex: 1, borderRight: i < (criterion.customLevels!.length - 1) ? "1px solid var(--border)" : "none" }}>
                    <REditableCell value={criterion.ratings[lvl.id] ?? ""} onChange={(v) => onUpdateRating(lvl.id, v)} placeholder={`Describe ${lvl.label} performance…`} isAiPending={isAiPending} />
                  </div>
                )
              })}
              <div className="flex-shrink-0" style={{ width: 40, borderLeft: "1px solid var(--border)" }} />
            </div>
          </div>
        </td>
      ) : (
        levels.map((level, i) => {
          const color = R_LEVEL_COLORS[i] ?? R_LEVEL_COLORS[R_LEVEL_COLORS.length - 1]
          return (
            <td key={level.id} className={`p-2 align-top ${color.bg}`} style={{ borderRight: "1px solid var(--border)" }}>
              <REditableCell value={criterion.ratings[level.id] ?? ""} onChange={(v) => onUpdateRating(level.id, v)} placeholder={`Describe ${level.label} performance…`} isAiPending={isAiPending} />
            </td>
          )
        })
      )}
    </tr>
  )
}

function RAiPanel({ mode, setMode, freeTextPrompt, setFreeTextPrompt, importFileContent, setImportFileContent, attachedAssignments, genState, genError, writtenFeedback, onRun }: {
  mode: AiMode; setMode: (m: AiMode) => void; freeTextPrompt: string; setFreeTextPrompt: (p: string) => void
  importFileContent: string; setImportFileContent: (v: string) => void; attachedAssignments: RAssignment[]
  genState: GenState; genError: string | null; writtenFeedback: boolean; onRun: () => void
}) {
  const hasAttachments = attachedAssignments.length > 0
  const canRun = genState !== "generating" && (
    (mode !== "create" || hasAttachments || freeTextPrompt.trim().length > 0) &&
    (mode !== "import" || importFileContent.trim().length > 0)
  )
  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader(); reader.onload = (ev) => setImportFileContent(ev.target?.result as string ?? ""); reader.readAsText(file)
  }
  return (
    <div className="px-4 py-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--btn-ai-gradient)" }}><Sparkles size={11} color="#fff" /></div>
        <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>AI Assistant</span>
      </div>
      <div className="flex flex-col gap-1.5 mb-4">
        {R_AI_MODES.filter((m) => !writtenFeedback || m.id !== "import").map((m) => {
          const Icon = m.icon; const active = mode === m.id
          const label = writtenFeedback && m.id === "fill" ? "Fill empty descriptions" : m.label
          return (
            <button key={m.id} onClick={() => setMode(m.id)} className="flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-xl transition-all" style={{ background: active ? "linear-gradient(135deg,rgba(148,79,179,0.1),rgba(2,120,135,0.1))" : "var(--muted)", border: active ? "1px solid rgba(148,79,179,0.3)" : "1px solid transparent" }}>
              <Icon size={14} style={{ color: active ? "#944fb3" : "var(--color-text-muted)", flexShrink: 0 }} />
              <span className="text-xs font-medium" style={{ color: active ? "#944fb3" : "var(--foreground)" }}>{label}</span>
            </button>
          )
        })}
      </div>
      {mode === "create" && (
        hasAttachments ? (
          <>
            <p className="text-xs mb-2 leading-relaxed" style={{ color: "var(--color-text-muted)" }}>AI will build the rubric based on the attached {attachedAssignments.length === 1 ? "assignment" : `${attachedAssignments.length} assignments`}.</p>
            <textarea className="w-full rounded-xl border px-3 py-2.5 text-xs resize-none focus:outline-none focus:ring-2 transition-colors mb-3" style={{ borderColor: "var(--border)", color: "var(--foreground)", minHeight: 60 }} placeholder="Add any extra instructions… (optional)" value={freeTextPrompt} onChange={(e) => setFreeTextPrompt(e.target.value)} disabled={genState === "generating"} />
          </>
        ) : (
          <>
            <p className="text-xs mb-2 leading-relaxed" style={{ color: "var(--color-text-muted)" }}>Describe the assignment, or attach one above to pull in its details automatically.</p>
            <textarea className="w-full rounded-xl border px-3 py-2.5 text-xs resize-none focus:outline-none focus:ring-2 transition-colors mb-3" style={{ borderColor: genState === "generating" ? "var(--color-ai-top)" : "var(--border)", color: "var(--foreground)", minHeight: 80 }} placeholder="e.g. A persuasive essay about a current environmental issue…" value={freeTextPrompt} onChange={(e) => setFreeTextPrompt(e.target.value)} disabled={genState === "generating"} />
          </>
        )
      )}
      {mode === "import" && (
        <>
          <p className="text-xs mb-2 leading-relaxed" style={{ color: "var(--color-text-muted)" }}>Paste an existing rubric document or upload a text file — AI will extract criteria and ratings into the grid.</p>
          <label className="flex items-center justify-center gap-2 w-full mb-2 rounded-xl border-2 border-dashed px-3 py-3 text-xs cursor-pointer transition-colors hover:bg-blue-50" style={{ borderColor: "var(--border)", color: "var(--color-text-muted)" }}>
            <Upload size={14} />Upload a file (.txt, .csv)
            <input type="file" className="hidden" accept=".txt,.csv" onChange={handleFileUpload} disabled={genState === "generating"} />
          </label>
          <p className="text-center text-[11px] mb-2" style={{ color: "var(--color-text-muted)" }}>— or paste text below —</p>
          <textarea className="w-full rounded-xl border px-3 py-2.5 text-xs resize-none focus:outline-none focus:ring-2 transition-colors mb-3" style={{ borderColor: "var(--border)", color: "var(--foreground)", minHeight: 100 }} placeholder="Paste rubric text here…" value={importFileContent} onChange={(e) => setImportFileContent(e.target.value)} disabled={genState === "generating"} />
        </>
      )}
      {mode !== "create" && mode !== "import" && (
        <p className="text-xs mb-3 leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
          {writtenFeedback && mode === "fill" ? "Write descriptions for any criteria that don't have one yet." : R_AI_MODES.find((m) => m.id === mode)!.hint}
        </p>
      )}
      {genError && <p className="text-xs mb-2" style={{ color: "var(--color-error)" }}>{genError}</p>}
      <button onClick={onRun} disabled={!canRun} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50" style={{ background: "var(--btn-ai-gradient)", borderRadius: "var(--btn-radius)" }}>
        {genState === "generating"
          ? <><RefreshCw size={14} className="animate-spin" /> Working…</>
          : <><Sparkles size={14} /> {mode === "create" ? "Generate Rubric" : mode === "fill" ? (writtenFeedback ? "Fill Empty Descriptions" : "Fill Empty Cells") : mode === "import" ? "Parse Document" : "Suggest Improvements"}</>
        }
      </button>
    </div>
  )
}

function RubricTab() {
  // Config
  const [rubricTitle, setRubricTitle]         = React.useState("Essay Evaluation Rubric")
  const [editingTitle, setEditingTitle]       = React.useState(false)
  const [rubricType, setRubricType]           = React.useState(R_RUBRIC_TYPES[0])
  const [scoreLevels, setScoreLevels]         = React.useState<ScoreLevel[]>(R_DEFAULT_SCORE_LEVELS)
  const [scaleOpen, setScaleOpen]             = React.useState(false)
  const [configOpen, setConfigOpen]           = React.useState(false)
  const [writtenFeedback, setWrittenFeedback] = React.useState(false)
  const [ratingOrder, setRatingOrder]         = React.useState<"htl" | "lth">("htl")

  const showPoints    = rubricType !== "Unscored Rubric"
  const pointLabel    = rubricType === "Percent Rubric" ? "%" : "pts"
  const displayLevels = ratingOrder === "lth" ? [...scoreLevels].reverse() : scoreLevels

  // Attached assignments
  const [attachedAssignments, setAttachedAssignments] = React.useState<RAssignment[]>([])

  // Criteria
  const [criteria, setCriteria] = React.useState<RCriterion[]>(R_INITIAL_CRITERIA)

  // AI state
  const [aiMode, setAiMode]                       = React.useState<AiMode>("create")
  const [freeTextPrompt, setFreeTextPrompt]       = React.useState("")
  const [importFileContent, setImportFileContent] = React.useState("")
  const [genState, setGenState]                   = React.useState<GenState>("idle")
  const [genError, setGenError]                   = React.useState<string | null>(null)
  const abortRef = React.useRef<AbortController | null>(null)

  const hasAiPending = criteria.some((c) => c.aiGenerated && !c.accepted)
  const allAccepted  = criteria.every((c) => !c.aiGenerated || c.accepted)
  const totalPoints  = criteria.reduce((s, c) => s + c.maxPoints, 0)

  function addAttachment(a: RAssignment) {
    setAttachedAssignments((prev) => [...prev, a])
    if (attachedAssignments.length === 0) setRubricTitle(a.title)
  }
  function removeAttachment(id: string) {
    setAttachedAssignments((prev) => prev.filter((a) => a.id !== id))
  }

  function adjustLevels(delta: number) {
    setScoreLevels((prev) => {
      const next = prev.length + delta
      if (next < 2 || next > 8) return prev
      if (delta > 0) {
        const zeroIdx = prev.findIndex((l) => l.points === 0)
        const insertAt = zeroIdx === -1 ? prev.length - 1 : zeroIdx
        const updated = [...prev]
        updated.splice(insertAt, 0, { id: `l${Date.now()}`, label: `Level ${next - 1}`, points: next - 1 })
        return updated
      } else {
        const updated = [...prev]
        const zeroIdx = updated.findIndex((l) => l.points === 0)
        const removeAt = zeroIdx === -1 ? updated.length - 2 : zeroIdx - 1
        if (removeAt < 1) return prev
        updated.splice(removeAt, 1)
        return updated
      }
    })
  }

  async function handleAiRun() {
    if (genState === "generating") return
    if (aiMode === "create" && attachedAssignments.length === 0 && !freeTextPrompt.trim()) return
    if (aiMode === "import" && !importFileContent.trim()) return
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    setGenState("generating"); setGenError(null)
    let userMsg = ""
    if (aiMode === "import")      userMsg = rImportPrompt(importFileContent, scoreLevels)
    else if (aiMode === "create") userMsg = rCreatePrompt(attachedAssignments, freeTextPrompt, scoreLevels)
    else if (aiMode === "fill")   userMsg = rFillPrompt(criteria, scoreLevels)
    else                          userMsg = rImprovePrompt(criteria, scoreLevels)
    await streamOllamaChat(
      [
        { role: "system", content: "You are an instructional design expert. Respond with valid JSON only — no markdown, no explanation." },
        { role: "user",   content: userMsg },
      ],
      {
        onChunk: () => {},
        onDone: (content) => {
          try {
            const parsed = JSON.parse(content)
            if (aiMode === "create" || aiMode === "import") {
              const data = parsed as { criteria: Array<{ title: string; description: string; ratings: Record<string, string> }> }
              setCriteria(data.criteria.map((c, i) => ({ id: `ai-${Date.now()}-${i}`, title: c.title, description: c.description, maxPoints: scoreLevels[0]?.points ?? 4, ratings: c.ratings, aiGenerated: true, accepted: false })))
            } else if (aiMode === "fill") {
              const data = parsed as { criteria: Array<{ id: string; ratings: Record<string, string> }> }
              setCriteria((prev) => prev.map((c) => {
                const patch = data.criteria.find((d) => d.id === c.id); if (!patch) return c
                const merged = { ...c.ratings }
                for (const [k, v] of Object.entries(patch.ratings)) { if (!merged[k]?.trim()) merged[k] = v }
                return { ...c, ratings: merged, aiGenerated: true, accepted: false }
              }))
            } else {
              const data = parsed as { criteria: Array<{ id: string; title: string; description: string; ratings: Record<string, string> }> }
              setCriteria((prev) => prev.map((c) => { const patch = data.criteria.find((d) => d.id === c.id); if (!patch) return c; return { ...c, title: patch.title, description: patch.description, ratings: patch.ratings, aiGenerated: true, accepted: false } }))
            }
            setGenState("done")
          } catch { setGenError("Couldn't parse AI response. Try again."); setGenState("idle") }
        },
        onError: (msg) => { setGenError(msg); setGenState("idle") },
      },
      controller.signal,
      { forceJson: true },
    )
  }

  function updateCriterion(id: string, patch: Partial<RCriterion>) { setCriteria((prev) => prev.map((c) => c.id === id ? { ...c, ...patch } : c)) }
  function updateRating(criterionId: string, levelId: string, value: string) { setCriteria((prev) => prev.map((c) => c.id === criterionId ? { ...c, ratings: { ...c.ratings, [levelId]: value } } : c)) }
  function acceptAll() { setCriteria((prev) => prev.map((c) => ({ ...c, accepted: true }))) }
  function acceptCriterion(id: string) { setCriteria((prev) => prev.map((c) => c.id === id ? { ...c, accepted: true } : c)) }
  function deleteCriterion(id: string) { setCriteria((prev) => prev.filter((c) => c.id !== id)) }
  function addCriterion() {
    setCriteria((prev) => [...prev, { id: `c${Date.now()}`, title: `Criterion ${prev.length + 1}`, description: "", maxPoints: scoreLevels[0]?.points ?? 4, ratings: {}, accepted: true }])
  }
  function toggleCustomLevels(id: string) {
    setCriteria((prev) => prev.map((c) => {
      if (c.id !== id) return c
      if (c.useCustomLevels) return { ...c, useCustomLevels: false }
      const customLevels: ScoreLevel[] = scoreLevels.map((l) => ({ ...l, id: `cl${Date.now()}-${l.id}` }))
      return { ...c, useCustomLevels: true, customLevels }
    }))
  }
  function updateCustomLevel(criterionId: string, levelId: string, patch: Partial<ScoreLevel>) {
    setCriteria((prev) => prev.map((c) => { if (c.id !== criterionId) return c; return { ...c, customLevels: (c.customLevels ?? []).map((l) => l.id === levelId ? { ...l, ...patch } : l) } }))
  }
  function addCustomLevel(criterionId: string) {
    setCriteria((prev) => prev.map((c) => { if (c.id !== criterionId) return c; return { ...c, customLevels: [...(c.customLevels ?? []), { id: `cl${Date.now()}`, label: "New Level", points: 0 }] } }))
  }
  function removeCustomLevel(criterionId: string, levelId: string) {
    setCriteria((prev) => prev.map((c) => { if (c.id !== criterionId) return c; if ((c.customLevels ?? []).length <= 2) return c; return { ...c, customLevels: (c.customLevels ?? []).filter((l) => l.id !== levelId) } }))
  }

  return (
    <div className="flex h-full overflow-hidden" style={{ background: "#f5f7f8", padding: "16px 16px 8px 16px", gap: 16 }}>

      {/* ── LEFT: Configure panel ──────────────────────────────────────────── */}
      <div className="flex flex-col overflow-y-auto flex-shrink-0" style={{ width: 320, background: "#fff", borderRadius: 16, border: "1px solid var(--border)", boxShadow: "var(--shadow-card)" }}>
        <div className="flex items-center px-4 py-3 flex-shrink-0" style={{ borderBottom: "1px solid var(--border)", background: "var(--muted)" }}>
          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>Configuration</span>
        </div>
        <div className="flex flex-col flex-1">

          {/* Rubric title */}
          <div className="px-4 pt-4 pb-3" style={{ borderBottom: "1px solid var(--color-stroke-muted)" }}>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>Rubric Title</label>
            {editingTitle ? (
              <input autoFocus className="w-full rounded-xl border px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2" style={{ borderColor: "var(--ring)", color: "var(--foreground)" }} value={rubricTitle} onChange={(e) => setRubricTitle(e.target.value)} onBlur={() => setEditingTitle(false)} onKeyDown={(e) => { if (e.key === "Enter") setEditingTitle(false) }} />
            ) : (
              <button onClick={() => setEditingTitle(true)} className="group flex items-center gap-2 w-full text-left rounded-xl px-3 py-2 hover:bg-blue-50" style={{ border: "1px solid transparent" }}>
                <span className="text-sm font-semibold flex-1 truncate" style={{ color: "var(--foreground)" }}>{rubricTitle}</span>
                <PenLine size={12} className="opacity-0 group-hover:opacity-50 transition-opacity flex-shrink-0" style={{ color: "var(--primary)" }} />
              </button>
            )}
          </div>

          {/* Number of levels */}
          {!writtenFeedback && (
            <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--color-stroke-muted)" }}>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>Number of Levels</label>
              <div className="flex items-center gap-3">
                <button onClick={() => adjustLevels(-1)} disabled={scoreLevels.length <= 2} className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100 disabled:opacity-30" style={{ borderColor: "var(--border)" }}><Minus size={14} /></button>
                <span className="text-sm font-semibold w-4 text-center" style={{ color: "var(--foreground)" }}>{scoreLevels.length}</span>
                <button onClick={() => adjustLevels(1)} disabled={scoreLevels.length >= 8} className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100 disabled:opacity-30" style={{ borderColor: "var(--border)" }}><Plus size={14} /></button>
              </div>
            </div>
          )}

          {/* Scale labels & points */}
          {!writtenFeedback && (
            <div style={{ borderBottom: "1px solid var(--color-stroke-muted)" }}>
              <button onClick={() => setScaleOpen((v) => !v)} className="w-full flex items-center justify-between px-4 py-3 text-xs font-semibold uppercase tracking-wide hover:bg-gray-50" style={{ color: "var(--color-text-muted)" }}>
                Scale Labels &amp; Points
                {scaleOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {scaleOpen && (
                <div className="px-4 pb-4 flex flex-col gap-2">
                  {scoreLevels.map((level, i) => {
                    const color = R_LEVEL_COLORS[i] ?? R_LEVEL_COLORS[R_LEVEL_COLORS.length - 1]
                    return (
                      <div key={level.id} className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${color.bg} border ${color.border}`} />
                        <input className="flex-1 text-xs rounded-lg border px-2 py-1.5 focus:outline-none focus:ring-1" style={{ borderColor: "var(--border)", color: "var(--foreground)" }} value={level.label} onChange={(e) => setScoreLevels((prev) => prev.map((l) => l.id === level.id ? { ...l, label: e.target.value } : l))} />
                        {showPoints && (
                          <>
                            <input type="number" min={0} className="w-12 text-xs rounded-lg border px-2 py-1.5 text-center focus:outline-none focus:ring-1" style={{ borderColor: "var(--border)", color: "var(--foreground)" }} value={level.points} onChange={(e) => setScoreLevels((prev) => prev.map((l) => l.id === level.id ? { ...l, points: Number(e.target.value) } : l))} />
                            <span className="text-[11px]" style={{ color: "var(--color-text-muted)" }}>{pointLabel}</span>
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Configuration accordion */}
          <div style={{ borderBottom: "1px solid var(--color-stroke-muted)" }}>
            <button onClick={() => setConfigOpen((v) => !v)} className="w-full flex items-center justify-between px-4 py-3 text-xs font-semibold uppercase tracking-wide hover:bg-gray-50" style={{ color: "var(--color-text-muted)" }}>
              Configuration
              {configOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {configOpen && (
              <div className="px-4 pb-4 flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>Rubric Type</label>
                  <select className="w-full rounded-xl border px-3 py-2 text-sm focus:outline-none appearance-none bg-white" style={{ borderColor: "var(--border)", color: "var(--foreground)" }} value={rubricType} onChange={(e) => setRubricType(e.target.value)}>
                    {R_RUBRIC_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <button onClick={() => setWrittenFeedback((v) => !v)} className="flex items-center gap-3 w-full text-left">
                  <div className="relative flex-shrink-0 rounded-full transition-colors" style={{ width: 32, height: 18, background: writtenFeedback ? "var(--primary)" : "#d1d5db" }}>
                    <div className="absolute rounded-full bg-white shadow-sm transition-transform" style={{ top: 2, width: 14, height: 14, transform: `translateX(${writtenFeedback ? 16 : 2}px)` }} />
                  </div>
                  <div>
                    <div className="text-xs font-medium" style={{ color: "var(--foreground)" }}>Written Feedback Only</div>
                    <div className="text-[11px]" style={{ color: "var(--color-text-muted)" }}>Don't use scale ratings</div>
                  </div>
                </button>
                {!writtenFeedback && (
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>Rating Order</label>
                    <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: "var(--border)" }}>
                      <button onClick={() => setRatingOrder("htl")} className="flex-1 py-1.5 text-xs font-medium transition-colors" style={{ background: ratingOrder === "htl" ? "var(--btn-primary-bg)" : "#fff", color: ratingOrder === "htl" ? "#fff" : "var(--foreground)" }}>H → L</button>
                      <button onClick={() => setRatingOrder("lth")} className="flex-1 py-1.5 text-xs font-medium transition-colors border-l" style={{ borderColor: "var(--border)", background: ratingOrder === "lth" ? "var(--btn-primary-bg)" : "#fff", color: ratingOrder === "lth" ? "#fff" : "var(--foreground)" }}>L → H</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Attached assignments */}
          <div style={{ borderBottom: "1px solid var(--color-stroke-muted)" }}>
            <div className="flex items-center justify-between px-4 pt-3 pb-2">
              <div className="flex items-center gap-1.5">
                <Paperclip size={13} style={{ color: "var(--color-text-muted)" }} />
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>Attached Assignments</span>
              </div>
              {attachedAssignments.length > 0 && (
                <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: "var(--btn-secondary-bg)", color: "var(--btn-secondary-text)" }}>{attachedAssignments.length}</span>
              )}
            </div>
            <div className="px-4 pb-3 flex flex-col gap-2">
              {attachedAssignments.map((a) => (
                <div key={a.id} className="flex items-start gap-2 px-2.5 py-2 rounded-xl" style={{ background: "rgba(43,122,188,0.07)", border: "1px solid rgba(43,122,188,0.18)" }}>
                  <BookOpen size={13} className="flex-shrink-0 mt-0.5" style={{ color: "var(--primary)" }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium leading-snug truncate" style={{ color: "var(--foreground)" }}>{a.title}</p>
                    <p className="text-[11px]" style={{ color: "var(--color-text-muted)" }}>{a.course} · Due {a.dueDate}</p>
                  </div>
                  <button onClick={() => removeAttachment(a.id)} className="flex-shrink-0 p-0.5 rounded hover:bg-blue-100 transition-colors mt-0.5"><X size={12} style={{ color: "var(--color-text-muted)" }} /></button>
                </div>
              ))}
              <RAssignmentSearch attached={attachedAssignments} onAdd={addAttachment} />
            </div>
          </div>

          {/* AI assistant */}
          <RAiPanel
            mode={aiMode} setMode={setAiMode}
            freeTextPrompt={freeTextPrompt} setFreeTextPrompt={setFreeTextPrompt}
            importFileContent={importFileContent} setImportFileContent={setImportFileContent}
            attachedAssignments={attachedAssignments}
            genState={genState} genError={genError}
            writtenFeedback={writtenFeedback}
            onRun={handleAiRun}
          />
        </div>
      </div>

      {/* ── RIGHT: Rubric grid ─────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 overflow-hidden" style={{ background: "var(--muted)", borderRadius: 16, border: "1px solid var(--border)", boxShadow: "var(--shadow-card)" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 flex-shrink-0" style={{ borderBottom: "1px solid var(--border)", background: "#fff" }}>
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{rubricTitle}</h2>
            {attachedAssignments.length > 0 && (
              <span className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ background: "rgba(43,122,188,0.1)", color: "var(--primary)", border: "1px solid rgba(43,122,188,0.2)" }}>
                <Paperclip size={9} /> {attachedAssignments.length} attached
              </span>
            )}
            {genState === "done" && hasAiPending && (
              <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "linear-gradient(135deg,rgba(148,79,179,0.12),rgba(2,120,135,0.12))", color: "#944fb3", border: "1px solid rgba(148,79,179,0.25)" }}>
                <Sparkles size={10} /> AI Generated
              </span>
            )}
            <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>Click any cell to edit</span>
          </div>
          <div className="flex items-center gap-2">
            {hasAiPending && (
              <button onClick={acceptAll} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white" style={{ background: "var(--btn-success-bg)", borderRadius: "var(--btn-radius)" }}>
                <CheckCheck size={13} /> Accept All
              </button>
            )}
            {genState !== "idle" && (
              <button onClick={handleAiRun} disabled={genState === "generating"} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium disabled:opacity-40" style={{ border: "1px solid var(--btn-tertiary-stroke)", color: "var(--foreground)", background: "#fff", borderRadius: "var(--btn-radius)" }}>
                <RefreshCw size={12} className={genState === "generating" ? "animate-spin" : ""} /> Regenerate
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto p-4">
          {genState === "generating" ? (
            <div className="rounded-xl overflow-hidden border" style={{ borderColor: "var(--border)" }}>
              <table className="w-full border-collapse">
                <thead>
                  <tr style={{ background: "var(--btn-primary-bg)" }}>
                    <th className="p-3" style={{ width: 200 }}><div className="h-3 w-16 rounded bg-white/20 animate-pulse" /></th>
                    {displayLevels.map((l) => <th key={l.id} className="p-3"><div className="h-3 w-20 rounded bg-white/20 animate-pulse" />{showPoints && <div className="h-2 w-8 rounded bg-white/15 animate-pulse mt-1.5" />}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {[1,2,3,4].map((row) => (
                    <tr key={row} className="border-b" style={{ borderColor: "var(--border)" }}>
                      <td className="p-3" style={{ background: "var(--muted)", borderRight: "1px solid var(--border)" }}>
                        <div className="h-3 w-24 rounded bg-gray-200 animate-pulse" /><div className="h-2 w-16 rounded bg-gray-100 animate-pulse mt-1.5" />
                      </td>
                      {displayLevels.map((l) => <td key={l.id} className="p-3" style={{ borderRight: "1px solid var(--border)" }}><div className="h-2 w-full rounded bg-gray-100 animate-pulse mb-1" /><div className="h-2 w-3/5 rounded bg-gray-100 animate-pulse" /></td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-xl overflow-hidden border" style={{ borderColor: "var(--border)", boxShadow: "var(--shadow-card)" }}>
              <table className="w-full border-collapse">
                <thead>
                  <tr style={{ background: "var(--btn-primary-bg)" }}>
                    <th className="p-3 text-left" style={{ width: 200, minWidth: 170, borderRight: "1px solid rgba(255,255,255,0.15)" }}>
                      <span className="text-xs font-semibold uppercase tracking-wide text-white/70">Criterion</span>
                    </th>
                    {writtenFeedback ? (
                      <th className="p-3 text-left"><span className="text-xs font-semibold uppercase tracking-wide text-white/70">Written Feedback</span></th>
                    ) : (
                      displayLevels.map((level, i) => (
                        <th key={level.id} className="p-3 text-left" style={{ borderRight: i < displayLevels.length - 1 ? "1px solid rgba(255,255,255,0.15)" : "none" }}>
                          <div className="text-xs font-semibold text-white leading-tight">{level.label}</div>
                          {showPoints && <div className="text-[11px] text-white/60 mt-0.5">{level.points}{pointLabel === "%" ? "%" : " pts"}</div>}
                        </th>
                      ))
                    )}
                  </tr>
                </thead>
                <tbody>
                  {criteria.length === 0 ? (
                    <tr><td colSpan={scoreLevels.length + 1} className="py-16 text-center">
                      <p className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>No criteria yet</p>
                      <p className="text-xs mt-1" style={{ color: "var(--color-text-placeholder)" }}>Use AI or add a criterion below.</p>
                    </td></tr>
                  ) : criteria.map((criterion) => (
                    <RCriterionRow
                      key={criterion.id}
                      criterion={criterion}
                      levels={displayLevels}
                      isAiPending={!!(criterion.aiGenerated && !criterion.accepted)}
                      writtenFeedback={writtenFeedback}
                      showPoints={showPoints}
                      pointLabel={pointLabel}
                      onUpdateTitle={(v) => updateCriterion(criterion.id, { title: v })}
                      onUpdateDescription={(v) => updateCriterion(criterion.id, { description: v })}
                      onUpdateRating={(levelId, v) => updateRating(criterion.id, levelId, v)}
                      onAccept={() => acceptCriterion(criterion.id)}
                      onDelete={() => deleteCriterion(criterion.id)}
                      onToggleCustomLevels={() => toggleCustomLevels(criterion.id)}
                      onUpdateCustomLevel={(levelId, patch) => updateCustomLevel(criterion.id, levelId, patch)}
                      onAddCustomLevel={() => addCustomLevel(criterion.id)}
                      onRemoveCustomLevel={(levelId) => removeCustomLevel(criterion.id, levelId)}
                    />
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ background: "var(--muted)", borderTop: "2px solid var(--border)" }}>
                    <td className="p-3" style={{ borderRight: "1px solid var(--border)" }}>
                      <button onClick={addCriterion} className="flex items-center gap-1.5 text-xs font-medium hover:opacity-80" style={{ color: "var(--primary)" }}>
                        <Plus size={13} /> Add Criterion
                      </button>
                    </td>
                    <td colSpan={writtenFeedback ? 1 : displayLevels.length} className="p-3">
                      <span className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
                        {showPoints && <>{totalPoints}{pointLabel === "%" ? "% total" : " pts total"} · </>}
                        {criteria.length} {criteria.length === 1 ? "criterion" : "criteria"}
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 flex-shrink-0" style={{ borderTop: "1px solid var(--border)", background: "#fff" }}>
          <span className="text-xs flex items-center gap-1.5" style={{ color: "var(--color-text-muted)" }}>
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: allAccepted ? "var(--color-success)" : "#f59e0b" }} />
            {allAccepted ? "All changes saved" : "Unsaved AI suggestions — review above"}
          </span>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-xl text-sm font-medium" style={{ border: "1px solid var(--btn-tertiary-stroke)", color: "var(--foreground)", background: "#fff", borderRadius: "var(--btn-radius)" }}>Cancel</button>
            <button className="px-4 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90" style={{ background: "var(--btn-primary-bg)", borderRadius: "var(--btn-radius)" }}>Save Rubric</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────

const TABS = ["Instructions", "Grading", "Rubric", "Assign", "Version history"]

export default function EditAssignmentPage() {
  const router = useRouter()
  const [title, setTitle] = React.useState("Untitled assignment")
  const [activeTab, setActiveTab] = React.useState("Instructions")
  const [module, setModule] = React.useState("Week 1: Introduction to Rhetoric")
  const [assignmentGroup, setAssignmentGroup] = React.useState("Essays")
  const [outcomes, setOutcomes] = React.useState([
    "Writing: Crafting Thesis Statements",
    "Writing: Argumentation",
  ])

  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{ background: "linear-gradient(180deg, #f9f9f9 0%, #e8eaec 100%)" }}
    >
      {/* Global nav */}
      <div
        className="flex items-center justify-between flex-shrink-0 px-4 gap-3"
        style={{ height: 52, background: "#fff", borderBottom: "1px solid #e8eaec" }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-1">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
              title="Back"
            >
              <ArrowLeft size={18} style={{ color: "#273540" }} />
            </button>
            <button className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors" title="Menu">
              <AlignJustify size={18} style={{ color: "#273540" }} />
            </button>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={`${process.env.NEXT_PUBLIC_BASE_PATH}/svg/canvas.svg`}
              alt="Canvas"
              width={18}
              height={18}
              className="flex-shrink-0"
            />
            <span className="text-base font-semibold truncate" style={{ color: "#273540" }}>
              Edit {title}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs px-3 py-0.5 rounded" style={{ background: "#e0ebf5", color: "#273540" }}>Draft saved</span>
            <span className="text-xs px-3 py-0.5 rounded" style={{ background: "#f2f4f4", color: "#586874" }}>AI Ethics Module</span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm hover:bg-gray-50 transition-colors"
            style={{ border: "1px solid #d7dade", color: "#273540" }}
          >
            <Copy size={15} />
            Copy link
          </button>
          <button className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors" title="Help">
            <CircleHelp size={18} style={{ color: "#273540" }} />
          </button>
          <div
            className="rounded-full flex-shrink-0"
            style={{
              width: 32,
              height: 32,
              background: "url(https://i.pravatar.cc/150?img=47) center/cover",
              border: "1px solid #e8eaec",
            }}
          />
        </div>
      </div>

      {/* Tab bar */}
      <div
        className="flex items-center justify-between flex-shrink-0 px-4"
        style={{ height: 44, background: "#fff", borderBottom: "1px solid #e8eaec" }}
      >
        <div className="flex items-stretch h-full">
          {TABS.map((tab) => {
            const active = tab === activeTab
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="relative flex items-center px-3 text-sm transition-colors"
                style={{ color: "#273540", fontWeight: active ? 500 : 400 }}
              >
                {tab}
                {active && (
                  <div
                    className="absolute bottom-0 left-0 right-0"
                    style={{ height: 4, background: "#0a1b2a", borderRadius: "2px 2px 0 0" }}
                  />
                )}
              </button>
            )
          })}
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors" title="Undo">
            <Undo2 size={16} style={{ color: "#273540" }} />
          </button>
          <button className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors" title="Redo">
            <Redo2 size={16} style={{ color: "#273540" }} />
          </button>
          <button
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-sm hover:bg-gray-50 transition-colors"
            style={{ border: "1px solid #d7dade", color: "#273540" }}
          >
            <Eye size={14} />
            View as Learner
          </button>
          <span
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full"
            style={{ background: "#1d6621", color: "#fff" }}
          >
            <Check size={12} />
            Published
          </span>
        </div>
      </div>

      {/* Scrollable content */}
      <div className={`flex-1 ${activeTab === "Rubric" ? "overflow-hidden" : "overflow-y-auto"}`}>
        {activeTab === "Instructions" && (
          <div className="max-w-[800px] mx-auto px-4 py-8 flex flex-col gap-6 pb-16">
            <EditableTitle value={title} onChange={setTitle} />
            <div
              className="flex flex-col gap-4 p-4 rounded-2xl"
              style={{ background: "#f9f9f9", border: "1px solid #e8eaec" }}
            >
              <h2 className="text-base font-semibold" style={{ color: "#273540" }}>Alignment and Organization</h2>
              <OutcomesField selected={outcomes} onChange={setOutcomes} />
              <SelectDropdown label="Module" value={module} options={MODULES} onChange={setModule} />
              <SelectDropdown label="Assignment group" value={assignmentGroup} options={ASSIGNMENT_GROUPS} onChange={setAssignmentGroup} />
            </div>
            <div
              className="flex flex-col gap-4 p-4 rounded-2xl"
              style={{ background: "#f9f9f9", border: "1px solid #e8eaec" }}
            >
              <h2 className="text-base font-semibold" style={{ color: "#273540" }}>Instructions</h2>
              <RichContentEditor />
            </div>
            <div className="flex justify-end">
              <button
                className="px-5 py-2 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-90"
                style={{ background: "#1d354f" }}
              >
                Save changes
              </button>
            </div>
          </div>
        )}

        {activeTab === "Grading" && <GradingTab />}
        {activeTab === "Rubric" && <RubricTab />}
      </div>
    </div>
  )
}
