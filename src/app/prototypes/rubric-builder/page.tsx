"use client"

import React from "react"
import {
  BookText,
  CalendarDays,
  CircleHelp,
  Clock,
  Inbox,
  LayoutDashboard,
  ShieldUser,
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
  Sparkles,
  CheckCheck,
  RefreshCw,
  Check,
  Trash2,
  PenLine,
  FilePlus,
  Grid3x3,
  Lightbulb,
  Search,
  X,
  BookOpen,
  Paperclip,
  Upload,
} from "lucide-react"

import { AppShell, type SidebarNavItem } from "@/components/ui/app-shell"
import { streamOllamaChat } from "@/lib/ollama"

// ─── Types ────────────────────────────────────────────────────────────────────

type ScoreLevel  = { id: string; label: string; points: number }
type AiMode      = "create" | "fill" | "improve" | "import"
type GenState    = "idle" | "generating" | "done"

type Criterion = {
  id: string
  title: string
  description: string
  maxPoints: number
  ratings: Record<string, string>
  aiGenerated?: boolean
  accepted?: boolean
  useCustomLevels?: boolean
  customLevels?: ScoreLevel[]
}

type Assignment = {
  id: string
  title: string
  course: string
  dueDate: string
  description: string
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_ASSIGNMENTS: Assignment[] = [
  { id: "a1",  title: "Persuasive Essay: Climate Policy",      course: "English 101",  dueDate: "Apr 14", description: "Write a 5-paragraph persuasive essay arguing for or against a specific climate policy. Must include at least 3 credible sources and a clear call to action." },
  { id: "a2",  title: "Cell Division Lab Report",              course: "Biology 101",  dueDate: "Apr 18", description: "Document your observations from the mitosis/meiosis lab. Include hypothesis, methods, data tables, microscopy sketches, and a discussion of results." },
  { id: "a3",  title: "World War I Causes Analysis",           course: "History 202",  dueDate: "Apr 22", description: "Analytical essay examining the long- and short-term causes of World War I. Evaluate the relative importance of militarism, alliances, imperialism, and nationalism." },
  { id: "a4",  title: "Quadratic Functions Project",           course: "Algebra II",   dueDate: "Apr 25", description: "Create a real-world scenario modeled by a quadratic function. Graph the function, identify key features, and present findings in a one-page report with visuals." },
  { id: "a5",  title: "Spanish Oral Presentation",             course: "Spanish III",  dueDate: "May 1",  description: "3-minute oral presentation in Spanish on a Hispanic cultural tradition of your choice. Graded on vocabulary, grammar, pronunciation, and cultural accuracy." },
  { id: "a6",  title: "Ecology Research Paper",                course: "Biology 101",  dueDate: "May 5",  description: "8–10 page research paper on a local ecosystem. Cover food webs, energy flow, human impact, and propose one evidence-based conservation strategy." },
  { id: "a7",  title: "Short Story: Unreliable Narrator",      course: "English 101",  dueDate: "May 8",  description: "Write a 1000–1500 word short story using an unreliable narrator. The reader should be able to identify clues that the narrator is withholding or distorting the truth." },
  { id: "a8",  title: "Primary Source Analysis: Civil Rights", course: "History 202",  dueDate: "May 12", description: "Analyze two primary sources from the Civil Rights Movement (1954–1968). Compare their purpose, audience, and historical significance in a structured essay." },
  { id: "a9",  title: "Genetics Problem Set",                  course: "Biology 101",  dueDate: "May 15", description: "Complete 20 genetics problems covering Mendelian inheritance, dihybrid crosses, codominance, sex-linked traits, and pedigree analysis. Show all work." },
  { id: "a10", title: "Debate: Technology in Schools",         course: "English 101",  dueDate: "May 20", description: "Prepare and deliver a 4-minute debate argument either for or against expanded AI use in K-12 classrooms. Rebuttal period included." },
  { id: "a11", title: "Polynomial Long Division Quiz",         course: "Algebra II",   dueDate: "Apr 30", description: "In-class quiz covering polynomial long division and synthetic division. Calculators not permitted." },
  { id: "a12", title: "Photo Essay: Community Change",         course: "Art & Media",  dueDate: "May 3",  description: "Produce a 10-image photo essay documenting a visible change in your community over time. Include a 200-word artist statement and captions for each image." },
]

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_SCORE_LEVELS: ScoreLevel[] = [
  { id: "l4", label: "Exceeds Expectations", points: 4 },
  { id: "l3", label: "Mastery",               points: 3 },
  { id: "l2", label: "Near Mastery",           points: 2 },
  { id: "l1", label: "Below Expectations",     points: 1 },
  { id: "l0", label: "No Evidence",            points: 0 },
]

const INITIAL_CRITERIA: Criterion[] = [
  { id: "c1", title: "Criterion 1", description: "Describe what this criterion measures", maxPoints: 4, ratings: {}, accepted: true },
]

const SIDEBAR_ITEMS: SidebarNavItem[] = [
  { id: "account",   label: "Account",   avatar: { src: "https://i.pravatar.cc/150?img=47" } },
  { id: "admin",     label: "Admin",     icon: ShieldUser,     adminOnly: true },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "courses",   label: "Courses",   icon: BookText },
  { id: "calendar",  label: "Calendar",  icon: CalendarDays },
  { id: "inbox",     label: "Inbox",     icon: Inbox },
  { id: "history",   label: "History",   icon: Clock },
  { id: "help",      label: "Help",      icon: CircleHelp },
]

const RUBRIC_TYPES = ["Scored Rubric", "Unscored Rubric", "Percent Rubric"]

const LEVEL_COLORS = [
  { bg: "bg-emerald-50", border: "border-emerald-100" },
  { bg: "bg-sky-50",     border: "border-sky-100"     },
  { bg: "bg-amber-50",   border: "border-amber-100"   },
  { bg: "bg-orange-50",  border: "border-orange-100"  },
  { bg: "bg-slate-50",   border: "border-slate-100"   },
  { bg: "bg-purple-50",  border: "border-purple-100"  },
  { bg: "bg-rose-50",    border: "border-rose-100"    },
  { bg: "bg-teal-50",    border: "border-teal-100"    },
]

const AI_MODES: { id: AiMode; label: string; icon: React.ElementType; hint: string }[] = [
  { id: "create",  label: "Create from scratch",  icon: FilePlus,  hint: "Build a complete rubric based on attached assignments or your own description." },
  { id: "fill",    label: "Fill empty cells",      icon: Grid3x3,   hint: "Write descriptions for any cells you haven't filled in yet." },
  { id: "improve", label: "Suggest improvements", icon: Lightbulb, hint: "Review your rubric and rewrite descriptions to be clearer and more specific." },
  { id: "import",  label: "Import from document", icon: Upload,    hint: "Paste or upload an existing rubric and AI will parse it into the grid." },
]

// ─── AI prompts ───────────────────────────────────────────────────────────────

function createPrompt(
  attachedAssignments: Assignment[],
  extraInstructions: string,
  levels: ScoreLevel[],
): string {
  const levelDesc = levels.map((l) => `${l.label} (${l.points} pts)`).join(", ")

  const contextBlock = attachedAssignments.length > 0
    ? attachedAssignments.map((a, i) =>
        `Assignment ${i + 1}: "${a.title}" (${a.course}, due ${a.dueDate})\n${a.description}`
      ).join("\n\n")
    : `Assignment description: "${extraInstructions}"`

  const extra = attachedAssignments.length > 0 && extraInstructions.trim()
    ? `\nAdditional instructions: ${extraInstructions}`
    : ""

  return `Create a complete rubric for the following assignment${attachedAssignments.length > 1 ? "s" : ""}:

${contextBlock}${extra}

Score levels (use exactly these): ${levelDesc}

Respond with JSON only:
{
  "criteria": [
    {
      "title": "Criterion Title",
      "description": "What this criterion measures",
      "ratings": { ${levels.map((l) => `"${l.id}": "Performance description at ${l.label} level"`).join(", ")} }
    }
  ]
}

Generate 3–5 criteria with specific, measurable, student-facing descriptions.`
}

function fillPrompt(criteria: Criterion[], levels: ScoreLevel[]): string {
  const currentState = criteria.map((c) => ({
    id: c.id, title: c.title, description: c.description,
    levels: levels.map((l) => ({ levelId: l.id, levelLabel: l.label, existing: c.ratings[l.id] ?? "" })),
  }))
  return `Fill in missing rating descriptions for this rubric. Keep existing descriptions unchanged.

Current rubric:
${JSON.stringify(currentState, null, 2)}

Score levels: ${levels.map((l) => `${l.id}="${l.label} (${l.points}pts)"`).join(", ")}

Respond with JSON only:
{
  "criteria": [
    { "id": "criterion id", "ratings": { "levelId": "description — only for empty cells" } }
  ]
}`
}

function improvePrompt(criteria: Criterion[], levels: ScoreLevel[]): string {
  const state = criteria.map((c) => ({
    id: c.id, title: c.title, description: c.description,
    ratings: levels.reduce((acc, l) => ({ ...acc, [l.id]: c.ratings[l.id] ?? "" }), {} as Record<string, string>),
  }))
  return `Improve this rubric to be more specific, observable, and student-facing. Rewrite all cells.

Current rubric:
${JSON.stringify(state, null, 2)}

Score levels: ${levels.map((l) => `${l.id}="${l.label} (${l.points}pts)"`).join(", ")}

Respond with JSON only:
{
  "criteria": [
    { "id": "criterion id", "title": "improved title", "description": "improved description", "ratings": { "levelId": "improved description" } }
  ]
}`
}

function createWrittenFeedbackPrompt(
  attachedAssignments: Assignment[],
  extraInstructions: string,
): string {
  const contextBlock = attachedAssignments.length > 0
    ? attachedAssignments.map((a, i) =>
        `Assignment ${i + 1}: "${a.title}" (${a.course}, due ${a.dueDate})\n${a.description}`
      ).join("\n\n")
    : `Assignment description: "${extraInstructions}"`
  const extra = attachedAssignments.length > 0 && extraInstructions.trim()
    ? `\nAdditional instructions: ${extraInstructions}` : ""
  return `Create rubric criteria for a written-feedback rubric for the following assignment${attachedAssignments.length > 1 ? "s" : ""}:

${contextBlock}${extra}

Respond with JSON only:
{
  "criteria": [
    { "title": "Criterion Title", "description": "What this criterion measures" }
  ]
}

Generate 3–5 criteria with clear, student-facing descriptions.`
}

function fillWrittenFeedbackPrompt(criteria: Criterion[]): string {
  const targets = criteria
    .filter((c) => !c.title.trim() || !c.description.trim())
    .map((c) => ({ id: c.id, title: c.title, description: c.description }))
  return `Fill in missing titles and descriptions for these rubric criteria. Only fill blank fields; leave existing content unchanged.

Criteria to fill:
${JSON.stringify(targets, null, 2)}

Respond with JSON only:
{
  "criteria": [
    { "id": "criterion id", "title": "title", "description": "description" }
  ]
}`
}

function improveWrittenFeedbackPrompt(criteria: Criterion[]): string {
  const state = criteria.map((c) => ({ id: c.id, title: c.title, description: c.description }))
  return `Improve these rubric criteria to be more specific, observable, and student-facing. Rewrite all.

Current criteria:
${JSON.stringify(state, null, 2)}

Respond with JSON only:
{
  "criteria": [
    { "id": "criterion id", "title": "improved title", "description": "improved description" }
  ]
}`
}

function importPrompt(documentText: string, levels: ScoreLevel[]): string {
  const levelDesc = levels.map((l) => `${l.label} (${l.points} pts)`).join(", ")
  return `Parse the following rubric document and extract its criteria and performance descriptions.

Document:
${documentText}

Map all extracted rating descriptions to these score levels: ${levelDesc}

Respond with JSON only:
{
  "criteria": [
    {
      "title": "Criterion Title",
      "description": "What this criterion measures",
      "ratings": { ${levels.map((l) => `"${l.id}": "Performance description at ${l.label} level"`).join(", ")} }
    }
  ]
}

Extract all criteria from the document and map their rating descriptions to the closest matching score levels above. Generate 2–6 criteria.`
}

// ─── Assignment search ────────────────────────────────────────────────────────

function AssignmentSearch({
  attached,
  onAdd,
}: {
  attached: Assignment[]
  onAdd: (a: Assignment) => void
}) {
  const [query, setQuery]   = React.useState("")
  const [open, setOpen]     = React.useState(false)
  const containerRef        = React.useRef<HTMLDivElement>(null)

  const results = React.useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    const attachedIds = new Set(attached.map((a) => a.id))
    return MOCK_ASSIGNMENTS.filter(
      (a) => !attachedIds.has(a.id) && (a.title.toLowerCase().includes(q) || a.course.toLowerCase().includes(q))
    ).slice(0, 6)
  }, [query, attached])

  React.useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [])

  function handleAdd(a: Assignment) {
    onAdd(a)
    setQuery("")
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <div
        className="flex items-center gap-2 rounded-xl border px-3 py-2 transition-all"
        style={{
          borderColor: open ? "var(--ring)" : "var(--border)",
          background: "#fff",
          boxShadow: open ? "0 0 0 3px rgba(43,122,188,0.12)" : "none",
        }}
      >
        <Search size={13} style={{ color: "var(--color-text-muted)", flexShrink: 0 }} />
        <input
          className="flex-1 text-xs bg-transparent focus:outline-none"
          style={{ color: "var(--foreground)" }}
          placeholder="Search by assignment or course name…"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
        />
        {query && (
          <button onClick={() => { setQuery(""); setOpen(false) }}>
            <X size={12} style={{ color: "var(--color-text-muted)" }} />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div
          className="absolute z-50 left-0 right-0 mt-1 rounded-xl overflow-hidden"
          style={{ background: "#fff", border: "1px solid var(--border)", boxShadow: "var(--shadow-popover)" }}
        >
          {results.map((a) => (
            <button
              key={a.id}
              onPointerDown={(e) => { e.preventDefault(); handleAdd(a) }}
              className="flex flex-col w-full text-left px-3 py-2.5 hover:bg-blue-50 transition-colors border-b last:border-b-0"
              style={{ borderColor: "var(--color-stroke-muted)" }}
            >
              <span className="text-xs font-medium truncate" style={{ color: "var(--foreground)" }}>{a.title}</span>
              <span className="text-[11px]" style={{ color: "var(--color-text-muted)" }}>{a.course} · Due {a.dueDate}</span>
            </button>
          ))}
        </div>
      )}

      {open && query.trim() && results.length === 0 && (
        <div
          className="absolute z-50 left-0 right-0 mt-1 rounded-xl px-3 py-3 text-center"
          style={{ background: "#fff", border: "1px solid var(--border)", boxShadow: "var(--shadow-popover)" }}
        >
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>No assignments match "{query}"</p>
        </div>
      )}
    </div>
  )
}

// ─── Editable cell ────────────────────────────────────────────────────────────

function EditableCell({ value, onChange, placeholder, isTitle, isAiPending }: {
  value: string; onChange: (v: string) => void
  placeholder?: string; isTitle?: boolean; isAiPending?: boolean
}) {
  const [focused, setFocused] = React.useState(false)
  return (
    <div className={`group relative rounded transition-all ${
      focused ? "ring-2 ring-blue-400/60 bg-white"
      : isAiPending ? "bg-violet-50/60 hover:bg-violet-50"
      : "hover:bg-blue-50/40"
    }`}>
      <textarea
        className={`w-full resize-none bg-transparent px-2 py-1.5 focus:outline-none leading-relaxed ${isTitle ? "text-sm font-semibold" : "text-xs"}`}
        style={{ color: "var(--foreground)", minHeight: isTitle ? 28 : 56, caretColor: "var(--primary)" }}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        rows={isTitle ? 1 : 3}
      />
      {!focused && (
        <PenLine size={10} className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-40 transition-opacity pointer-events-none" style={{ color: "var(--primary)" }} />
      )}
    </div>
  )
}

// ─── Criterion row ────────────────────────────────────────────────────────────

function CriterionRow({ criterion, levels, isAiPending, writtenFeedback, showPoints, pointLabel, onUpdateTitle, onUpdateDescription, onUpdateRating, onAccept, onDelete, onToggleCustomLevels, onUpdateCustomLevel, onAddCustomLevel, onRemoveCustomLevel }: {
  criterion: Criterion; levels: ScoreLevel[]; isAiPending: boolean
  writtenFeedback: boolean; showPoints: boolean; pointLabel: string
  onUpdateTitle: (v: string) => void; onUpdateDescription: (v: string) => void
  onUpdateRating: (levelId: string, v: string) => void; onAccept: () => void; onDelete: () => void
  onToggleCustomLevels: () => void
  onUpdateCustomLevel: (levelId: string, patch: Partial<ScoreLevel>) => void
  onAddCustomLevel: () => void
  onRemoveCustomLevel: (levelId: string) => void
}) {
  return (
    <tr className="group/row border-b" style={{ borderColor: "var(--border)", background: isAiPending ? "rgba(148,79,179,0.025)" : "white" }}>
      <td className="p-2 align-top" style={{ width: 200, minWidth: 170, borderRight: "1px solid var(--border)", background: isAiPending ? "rgba(148,79,179,0.05)" : "var(--muted)" }}>
        <div className="flex flex-col gap-1.5">
          <EditableCell value={criterion.title} onChange={onUpdateTitle} placeholder="Criterion name…" isTitle isAiPending={isAiPending} />
          <EditableCell value={criterion.description} onChange={onUpdateDescription} placeholder="Describe what this criterion measures…" isAiPending={isAiPending} />
          <div className="flex items-center justify-between mt-1 px-2">
            {showPoints && (
              <span className="text-[11px] font-medium" style={{ color: "var(--color-text-muted)" }}>{criterion.maxPoints} {pointLabel}</span>
            )}
            <div className="flex items-center gap-1 ml-auto">
              {!writtenFeedback && (
                <button
                  onClick={onToggleCustomLevels}
                  title={criterion.useCustomLevels ? "Use global levels" : "Override levels for this criterion"}
                  className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-all"
                  style={{
                    background: criterion.useCustomLevels ? "rgba(148,79,179,0.1)" : "transparent",
                    color: criterion.useCustomLevels ? "#944fb3" : "var(--color-text-muted)",
                    border: criterion.useCustomLevels ? "1px solid rgba(148,79,179,0.3)" : "1px solid transparent",
                  }}
                >
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
        </div>
      </td>
      {writtenFeedback ? (
        <td colSpan={levels.length} className="p-3 align-middle" style={{ borderRight: "1px solid var(--border)" }}>
          <div
            className="w-full h-16 rounded-lg flex items-center justify-center"
            style={{ background: isAiPending ? "rgba(148,79,179,0.04)" : "var(--muted)", border: "1px dashed var(--border)" }}
          >
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
                    <input
                      className="text-xs font-semibold w-full focus:outline-none bg-transparent truncate"
                      style={{ color: "var(--foreground)" }}
                      value={lvl.label}
                      onChange={(e) => onUpdateCustomLevel(lvl.id, { label: e.target.value })}
                    />
                    {showPoints && (
                      <div className="flex items-center gap-1">
                        <input
                          type="number" min={0}
                          className="text-xs w-10 text-center rounded px-1 py-0.5 focus:outline-none focus:ring-1"
                          style={{ background: "white", border: "1px solid var(--border)", color: "var(--foreground)" }}
                          value={lvl.points}
                          onChange={(e) => onUpdateCustomLevel(lvl.id, { points: Number(e.target.value) })}
                        />
                        <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>{pointLabel}</span>
                      </div>
                    )}
                  </div>
                  <button onClick={() => onRemoveCustomLevel(lvl.id)} className="opacity-0 group-hover/clvl:opacity-50 hover:!opacity-100 flex-shrink-0 transition-opacity">
                    <X size={10} style={{ color: "var(--color-error)" }} />
                  </button>
                </div>
              ))}
              <div className="flex items-center justify-center px-2 flex-shrink-0" style={{ borderLeft: "1px solid var(--border)" }}>
                <button onClick={onAddCustomLevel} className="p-0.5 rounded hover:bg-purple-100 transition-colors" title="Add level">
                  <Plus size={12} style={{ color: "#944fb3" }} />
                </button>
              </div>
            </div>
            <div className="flex" style={{ minHeight: 80 }}>
              {(criterion.customLevels ?? []).map((lvl, i) => {
                const color = LEVEL_COLORS[i % LEVEL_COLORS.length]
                return (
                  <div key={lvl.id} className={`p-2 ${color.bg}`} style={{ flex: 1, borderRight: i < (criterion.customLevels!.length - 1) ? "1px solid var(--border)" : "none" }}>
                    <EditableCell value={criterion.ratings[lvl.id] ?? ""} onChange={(v) => onUpdateRating(lvl.id, v)} placeholder={`Describe ${lvl.label} performance…`} isAiPending={isAiPending} />
                  </div>
                )
              })}
              <div className="flex-shrink-0" style={{ width: 40, borderLeft: "1px solid var(--border)" }} />
            </div>
          </div>
        </td>
      ) : (
        levels.map((level, i) => {
          const color = LEVEL_COLORS[i] ?? LEVEL_COLORS[LEVEL_COLORS.length - 1]
          return (
            <td key={level.id} className={`p-2 align-top ${color.bg}`} style={{ borderRight: "1px solid var(--border)" }}>
              <EditableCell value={criterion.ratings[level.id] ?? ""} onChange={(v) => onUpdateRating(level.id, v)} placeholder={`Describe ${level.label} performance…`} isAiPending={isAiPending} />
            </td>
          )
        })
      )}
    </tr>
  )
}

// ─── AI panel ─────────────────────────────────────────────────────────────────

function AiPanel({
  mode, setMode, freeTextPrompt, setFreeTextPrompt, importFileContent, setImportFileContent,
  attachedAssignments, genState, genError, writtenFeedback, onRun,
}: {
  mode: AiMode; setMode: (m: AiMode) => void
  freeTextPrompt: string; setFreeTextPrompt: (p: string) => void
  importFileContent: string; setImportFileContent: (v: string) => void
  attachedAssignments: Assignment[]
  genState: GenState; genError: string | null
  writtenFeedback: boolean
  onRun: () => void
}) {
  const hasAttachments = attachedAssignments.length > 0
  const canRun = genState !== "generating" && (
    (mode !== "create" || hasAttachments || freeTextPrompt.trim().length > 0) &&
    (mode !== "import" || importFileContent.trim().length > 0)
  )

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setImportFileContent(ev.target?.result as string ?? "")
    reader.readAsText(file)
  }

  return (
    <div className="px-4 py-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--btn-ai-gradient)" }}>
          <Sparkles size={11} color="#fff" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>AI Assistant</span>
      </div>

      {/* Mode selector */}
      <div className="flex flex-col gap-1.5 mb-4">
        {AI_MODES.filter((m) => !writtenFeedback || m.id !== "import").map((m) => {
          const Icon = m.icon
          const active = mode === m.id
          const label = writtenFeedback && m.id === "fill" ? "Fill empty descriptions" : m.label
          const hint  = writtenFeedback && m.id === "fill" ? "Write descriptions for any criteria that don't have one yet." : m.hint
          return (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className="flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-xl transition-all"
              style={{
                background: active ? "linear-gradient(135deg,rgba(148,79,179,0.1),rgba(2,120,135,0.1))" : "var(--muted)",
                border: active ? "1px solid rgba(148,79,179,0.3)" : "1px solid transparent",
              }}
            >
              <Icon size={14} style={{ color: active ? "#944fb3" : "var(--color-text-muted)", flexShrink: 0 }} />
              <span className="text-xs font-medium" style={{ color: active ? "#944fb3" : "var(--foreground)" }}>{label}</span>
            </button>
          )
        })}
      </div>

      {/* Create mode inputs */}
      {mode === "create" && (
        <>
          {hasAttachments ? (
            /* Attached assignments provide the context — free text is optional extra */
            <>
              <p className="text-xs mb-2 leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                AI will build the rubric based on the attached {attachedAssignments.length === 1 ? "assignment" : `${attachedAssignments.length} assignments"}`}.
              </p>
              <textarea
                className="w-full rounded-xl border px-3 py-2.5 text-xs resize-none focus:outline-none focus:ring-2 transition-colors mb-3"
                style={{ borderColor: "var(--border)", borderRadius: "0.75rem", color: "var(--foreground)", minHeight: 60 }}
                placeholder="Add any extra instructions or constraints… (optional)"
                value={freeTextPrompt}
                onChange={(e) => setFreeTextPrompt(e.target.value)}
                disabled={genState === "generating"}
              />
            </>
          ) : (
            /* No attachments — free text is the main input */
            <>
              <p className="text-xs mb-2 leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                Describe the assignment, or attach one above to pull in its details automatically.
              </p>
              <textarea
                className="w-full rounded-xl border px-3 py-2.5 text-xs resize-none focus:outline-none focus:ring-2 transition-colors mb-3"
                style={{
                  borderColor: genState === "generating" ? "var(--color-ai-top)" : "var(--border)",
                  borderRadius: "0.75rem",
                  color: "var(--foreground)",
                  minHeight: 80,
                }}
                placeholder="e.g. A persuasive essay about a current environmental issue…"
                value={freeTextPrompt}
                onChange={(e) => setFreeTextPrompt(e.target.value)}
                disabled={genState === "generating"}
              />
            </>
          )}
        </>
      )}

      {/* Import mode inputs */}
      {mode === "import" && (
        <>
          <p className="text-xs mb-2 leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
            Paste an existing rubric document or upload a text file — AI will extract criteria and ratings into the grid.
          </p>
          <label
            className="flex items-center justify-center gap-2 w-full mb-2 rounded-xl border-2 border-dashed px-3 py-3 text-xs cursor-pointer transition-colors hover:bg-blue-50"
            style={{ borderColor: "var(--border)", color: "var(--color-text-muted)" }}
          >
            <Upload size={14} />
            Upload a file (.txt, .csv)
            <input type="file" className="hidden" accept=".txt,.csv" onChange={handleFileUpload} disabled={genState === "generating"} />
          </label>
          <p className="text-center text-[11px] mb-2" style={{ color: "var(--color-text-muted)" }}>— or paste text below —</p>
          <textarea
            className="w-full rounded-xl border px-3 py-2.5 text-xs resize-none focus:outline-none focus:ring-2 transition-colors mb-3"
            style={{ borderColor: "var(--border)", borderRadius: "0.75rem", color: "var(--foreground)", minHeight: 100 }}
            placeholder="Paste rubric text here…"
            value={importFileContent}
            onChange={(e) => setImportFileContent(e.target.value)}
            disabled={genState === "generating"}
          />
        </>
      )}

      {/* Hint for other modes */}
      {mode !== "create" && mode !== "import" && (
        <p className="text-xs mb-3 leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
          {writtenFeedback && mode === "fill"
            ? "Write descriptions for any criteria that don't have one yet."
            : AI_MODES.find((m) => m.id === mode)!.hint
          }
        </p>
      )}

      {genError && <p className="text-xs mb-2" style={{ color: "var(--color-error)" }}>{genError}</p>}

      <button
        onClick={onRun}
        disabled={!canRun}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
        style={{ background: "var(--btn-ai-gradient)", borderRadius: "var(--btn-radius)" }}
      >
        {genState === "generating"
          ? <><RefreshCw size={14} className="animate-spin" /> Working…</>
          : <><Sparkles size={14} /> {mode === "create" ? "Generate Rubric" : mode === "fill" ? (writtenFeedback ? "Fill Empty Descriptions" : "Fill Empty Cells") : mode === "import" ? "Parse Document" : "Suggest Improvements"}</>
        }
      </button>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RubricBuilderPage() {
  const [sidebarActiveId, setSidebarActiveId] = React.useState("courses")

  // Config
  const [rubricTitle, setRubricTitle]   = React.useState("Untitled Rubric")
  const [editingTitle, setEditingTitle] = React.useState(false)
  const [rubricType, setRubricType]     = React.useState(RUBRIC_TYPES[0])
  const [scoreLevels, setScoreLevels]   = React.useState<ScoreLevel[]>(DEFAULT_SCORE_LEVELS)
  const [scaleOpen, setScaleOpen]         = React.useState(false)
  const [configOpen, setConfigOpen]       = React.useState(false)
  const [writtenFeedback, setWrittenFeedback] = React.useState(false)
  const [ratingOrder, setRatingOrder]     = React.useState<"htl" | "lth">("htl")

  const showPoints    = rubricType !== "Unscored Rubric"
  const pointLabel    = rubricType === "Percent Rubric" ? "%" : "pts"
  const displayLevels = ratingOrder === "lth" ? [...scoreLevels].reverse() : scoreLevels

  // Attached assignments (own section)
  const [attachedAssignments, setAttachedAssignments] = React.useState<Assignment[]>([])

  // Criteria
  const [criteria, setCriteria] = React.useState<Criterion[]>(INITIAL_CRITERIA)

  // AI
  const [aiMode, setAiMode]             = React.useState<AiMode>("create")
  const [freeTextPrompt, setFreeTextPrompt] = React.useState("")
  const [importFileContent, setImportFileContent] = React.useState("")
  const [genState, setGenState]         = React.useState<GenState>("idle")
  const [genError, setGenError]         = React.useState<string | null>(null)
  const abortRef = React.useRef<AbortController | null>(null)

  const hasAiPending = criteria.some((c) => c.aiGenerated && !c.accepted)
  const allAccepted  = criteria.every((c) => !c.aiGenerated || c.accepted)
  const totalPoints  = criteria.reduce((s, c) => s + c.maxPoints, 0)

  function addAttachment(a: Assignment) {
    setAttachedAssignments((prev) => [...prev, a])
    // Auto-fill title if first attachment
    if (attachedAssignments.length === 0) setRubricTitle(a.title)
  }
  function removeAttachment(id: string) {
    setAttachedAssignments((prev) => prev.filter((a) => a.id !== id))
  }

  // ── Score levels ──
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
        if (prev.length <= 2) return prev
        const updated = [...prev]
        const zeroIdx = updated.findIndex((l) => l.points === 0)
        const removeAt = zeroIdx === -1 ? updated.length - 2 : zeroIdx - 1
        if (removeAt < 1) return prev
        updated.splice(removeAt, 1)
        return updated
      }
    })
  }

  // ── AI run ──
  async function handleAiRun() {
    if (genState === "generating") return
    if (aiMode === "create" && attachedAssignments.length === 0 && !freeTextPrompt.trim()) return
    if (aiMode === "import" && !importFileContent.trim()) return

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    setGenState("generating")
    setGenError(null)

    let userMsg = ""
    if (aiMode === "import") {
      userMsg = importPrompt(importFileContent, scoreLevels)
    } else if (writtenFeedback) {
      if (aiMode === "create")     userMsg = createWrittenFeedbackPrompt(attachedAssignments, freeTextPrompt)
      else if (aiMode === "fill")  userMsg = fillWrittenFeedbackPrompt(criteria)
      else                         userMsg = improveWrittenFeedbackPrompt(criteria)
    } else {
      if (aiMode === "create")     userMsg = createPrompt(attachedAssignments, freeTextPrompt, scoreLevels)
      else if (aiMode === "fill")  userMsg = fillPrompt(criteria, scoreLevels)
      else                         userMsg = improvePrompt(criteria, scoreLevels)
    }

    if (!userMsg) { setGenState("idle"); return }

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

            if (writtenFeedback) {
              if (aiMode === "create") {
                const data = parsed as { criteria: Array<{ title: string; description: string }> }
                setCriteria(data.criteria.map((c, i) => ({
                  id: `ai-${Date.now()}-${i}`, title: c.title, description: c.description,
                  maxPoints: scoreLevels[0]?.points ?? 4, ratings: {}, aiGenerated: true, accepted: false,
                })))
              } else {
                const data = parsed as { criteria: Array<{ id: string; title: string; description: string }> }
                setCriteria((prev) => prev.map((c) => {
                  const patch = data.criteria.find((d) => d.id === c.id)
                  if (!patch) return c
                  return {
                    ...c,
                    title: aiMode === "fill" && c.title.trim() ? c.title : patch.title,
                    description: aiMode === "fill" && c.description.trim() ? c.description : patch.description,
                    aiGenerated: true, accepted: false,
                  }
                }))
              }
            } else if (aiMode === "create" || aiMode === "import") {
              const data = parsed as { criteria: Array<{ title: string; description: string; ratings: Record<string, string> }> }
              setCriteria(data.criteria.map((c, i) => ({
                id: `ai-${Date.now()}-${i}`, title: c.title, description: c.description,
                maxPoints: scoreLevels[0]?.points ?? 4, ratings: c.ratings, aiGenerated: true, accepted: false,
              })))
            } else if (aiMode === "fill") {
              const data = parsed as { criteria: Array<{ id: string; ratings: Record<string, string> }> }
              setCriteria((prev) => prev.map((c) => {
                const patch = data.criteria.find((d) => d.id === c.id)
                if (!patch) return c
                const merged = { ...c.ratings }
                for (const [k, v] of Object.entries(patch.ratings)) {
                  if (!merged[k]?.trim()) merged[k] = v
                }
                return { ...c, ratings: merged, aiGenerated: true, accepted: false }
              }))
            } else {
              const data = parsed as { criteria: Array<{ id: string; title: string; description: string; ratings: Record<string, string> }> }
              setCriteria((prev) => prev.map((c) => {
                const patch = data.criteria.find((d) => d.id === c.id)
                if (!patch) return c
                return { ...c, title: patch.title, description: patch.description, ratings: patch.ratings, aiGenerated: true, accepted: false }
              }))
            }
            setGenState("done")
          } catch {
            setGenError("Couldn't parse AI response. Try again.")
            setGenState("idle")
          }
        },
        onError: (msg) => { setGenError(msg); setGenState("idle") },
      },
      controller.signal,
      { forceJson: true },
    )
  }

  // ── Criteria helpers ──
  function updateCriterion(id: string, patch: Partial<Criterion>) {
    setCriteria((prev) => prev.map((c) => c.id === id ? { ...c, ...patch } : c))
  }
  function updateRating(criterionId: string, levelId: string, value: string) {
    setCriteria((prev) => prev.map((c) => c.id === criterionId ? { ...c, ratings: { ...c.ratings, [levelId]: value } } : c))
  }
  function acceptAll()             { setCriteria((prev) => prev.map((c) => ({ ...c, accepted: true }))) }
  function acceptCriterion(id: string) { setCriteria((prev) => prev.map((c) => c.id === id ? { ...c, accepted: true } : c)) }
  function deleteCriterion(id: string) { setCriteria((prev) => prev.filter((c) => c.id !== id)) }
  function addCriterion() {
    setCriteria((prev) => [...prev, {
      id: `c${Date.now()}`, title: `Criterion ${prev.length + 1}`,
      description: "", maxPoints: scoreLevels[0]?.points ?? 4, ratings: {}, accepted: true,
    }])
  }

  // ── Custom levels (per-criterion overrides) ──
  function toggleCustomLevels(id: string) {
    setCriteria((prev) => prev.map((c) => {
      if (c.id !== id) return c
      if (c.useCustomLevels) return { ...c, useCustomLevels: false }
      // Initialize custom levels from the current global levels
      const customLevels: ScoreLevel[] = scoreLevels.map((l) => ({ ...l, id: `cl${Date.now()}-${l.id}` }))
      return { ...c, useCustomLevels: true, customLevels }
    }))
  }
  function updateCustomLevel(criterionId: string, levelId: string, patch: Partial<ScoreLevel>) {
    setCriteria((prev) => prev.map((c) => {
      if (c.id !== criterionId) return c
      return { ...c, customLevels: (c.customLevels ?? []).map((l) => l.id === levelId ? { ...l, ...patch } : l) }
    }))
  }
  function addCustomLevel(criterionId: string) {
    setCriteria((prev) => prev.map((c) => {
      if (c.id !== criterionId) return c
      const newLevel: ScoreLevel = { id: `cl${Date.now()}`, label: "New Level", points: 0 }
      return { ...c, customLevels: [...(c.customLevels ?? []), newLevel] }
    }))
  }
  function removeCustomLevel(criterionId: string, levelId: string) {
    setCriteria((prev) => prev.map((c) => {
      if (c.id !== criterionId) return c
      if ((c.customLevels ?? []).length <= 2) return c // keep at least 2
      return { ...c, customLevels: (c.customLevels ?? []).filter((l) => l.id !== levelId) }
    }))
  }

  return (
    <AppShell
      sidebarItems={SIDEBAR_ITEMS}
      sidebarActiveId={sidebarActiveId}
      onSidebarSelect={setSidebarActiveId}
      sidebarIsAdmin
      sidebarLogo={<img src={`${process.env.NEXT_PUBLIC_BASE_PATH}/svg/canvas.svg`} alt="Canvas" width={40} height={40} />}
      sidebarLogoHref="/prototypes"
      breadcrumb={[
        { label: "Courses", href: "/prototypes/rubric-builder" },
        { label: "Biology 101" },
        { label: "Rubrics" },
        { label: rubricTitle },
      ]}
      topNavActions={[]}
      fullWidth
    >
      <div
        className="flex overflow-hidden rounded-xl"
        style={{ height: "calc(100vh - 66px)", border: "1px solid var(--border)", boxShadow: "var(--shadow-card)" }}
      >
        {/* ══════════════════════════════════════
            LEFT — Configuration
        ══════════════════════════════════════ */}
        <div className="flex flex-col overflow-y-auto flex-shrink-0" style={{ width: 320, borderRight: "1px solid var(--border)", background: "#fff" }}>
          <div className="flex items-center px-4 py-3 flex-shrink-0" style={{ borderBottom: "1px solid var(--border)", background: "var(--muted)" }}>
            <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>Configuration</span>
          </div>

          <div className="flex flex-col flex-1">

            {/* Rubric title */}
            <div className="px-4 pt-4 pb-3" style={{ borderBottom: "1px solid var(--color-stroke-muted)" }}>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>Rubric Title</label>
              {editingTitle ? (
                <input
                  autoFocus
                  className="w-full rounded-xl border px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2"
                  style={{ borderColor: "var(--ring)", borderRadius: "0.75rem", color: "var(--foreground)" }}
                  value={rubricTitle}
                  onChange={(e) => setRubricTitle(e.target.value)}
                  onBlur={() => setEditingTitle(false)}
                  onKeyDown={(e) => { if (e.key === "Enter") setEditingTitle(false) }}
                />
              ) : (
                <button
                  onClick={() => setEditingTitle(true)}
                  className="group flex items-center gap-2 w-full text-left rounded-xl px-3 py-2 hover:bg-blue-50"
                  style={{ border: "1px solid transparent" }}
                >
                  <span className="text-sm font-semibold flex-1 truncate" style={{ color: "var(--foreground)" }}>{rubricTitle}</span>
                  <PenLine size={12} className="opacity-0 group-hover:opacity-50 transition-opacity flex-shrink-0" style={{ color: "var(--primary)" }} />
                </button>
              )}
            </div>

            {/* Score levels — hidden in written feedback mode */}
            {!writtenFeedback && <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--color-stroke-muted)" }}>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>Number of Levels</label>
              <div className="flex items-center gap-3">
                <button onClick={() => adjustLevels(-1)} disabled={scoreLevels.length <= 2} className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100 disabled:opacity-30" style={{ borderColor: "var(--border)" }}>
                  <Minus size={14} />
                </button>
                <span className="text-sm font-semibold w-4 text-center" style={{ color: "var(--foreground)" }}>{scoreLevels.length}</span>
                <button onClick={() => adjustLevels(1)} disabled={scoreLevels.length >= 8} className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100 disabled:opacity-30" style={{ borderColor: "var(--border)" }}>
                  <Plus size={14} />
                </button>
              </div>
            </div>}

            {/* Scale labels + points — hidden in written feedback mode */}
            {!writtenFeedback && <div style={{ borderBottom: "1px solid var(--color-stroke-muted)" }}>
              <button
                onClick={() => setScaleOpen((v) => !v)}
                className="w-full flex items-center justify-between px-4 py-3 text-xs font-semibold uppercase tracking-wide hover:bg-gray-50"
                style={{ color: "var(--color-text-muted)" }}
              >
                Scale Labels &amp; Points
                {scaleOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {scaleOpen && (
                <div className="px-4 pb-4 flex flex-col gap-2">
                  {scoreLevels.map((level, i) => {
                    const color = LEVEL_COLORS[i] ?? LEVEL_COLORS[LEVEL_COLORS.length - 1]
                    return (
                      <div key={level.id} className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${color.bg} border ${color.border}`} />
                        <input
                          className="flex-1 text-xs rounded-lg border px-2 py-1.5 focus:outline-none focus:ring-1"
                          style={{ borderColor: "var(--border)", borderRadius: "0.5rem", color: "var(--foreground)" }}
                          value={level.label}
                          onChange={(e) => setScoreLevels((prev) => prev.map((l) => l.id === level.id ? { ...l, label: e.target.value } : l))}
                        />
                        {showPoints && (
                          <>
                            <input
                              type="number" min={0}
                              className="w-12 text-xs rounded-lg border px-2 py-1.5 text-center focus:outline-none focus:ring-1"
                              style={{ borderColor: "var(--border)", borderRadius: "0.5rem", color: "var(--foreground)" }}
                              value={level.points}
                              onChange={(e) => setScoreLevels((prev) => prev.map((l) => l.id === level.id ? { ...l, points: Number(e.target.value) } : l))}
                            />
                            <span className="text-[11px]" style={{ color: "var(--color-text-muted)" }}>{pointLabel}</span>
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>}

            {/* Configuration accordion */}
            <div style={{ borderBottom: "1px solid var(--color-stroke-muted)" }}>
              <button
                onClick={() => setConfigOpen((v) => !v)}
                className="w-full flex items-center justify-between px-4 py-3 text-xs font-semibold uppercase tracking-wide hover:bg-gray-50"
                style={{ color: "var(--color-text-muted)" }}
              >
                Configuration
                {configOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {configOpen && (
                <div className="px-4 pb-4 flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>Rubric Type</label>
                    <select
                      className="w-full rounded-xl border px-3 py-2 text-sm focus:outline-none appearance-none bg-white"
                      style={{ borderColor: "var(--border)", borderRadius: "0.75rem", color: "var(--foreground)" }}
                      value={rubricType}
                      onChange={(e) => setRubricType(e.target.value)}
                    >
                      {RUBRIC_TYPES.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>

                  {/* Written Feedback Only toggle */}
                  <button
                    onClick={() => setWrittenFeedback((v) => !v)}
                    className="flex items-center gap-3 w-full text-left"
                  >
                    <div
                      className="relative flex-shrink-0 rounded-full transition-colors"
                      style={{ width: 32, height: 18, background: writtenFeedback ? "var(--primary)" : "#d1d5db" }}
                    >
                      <div
                        className="absolute rounded-full bg-white shadow-sm transition-transform"
                        style={{ top: 2, width: 14, height: 14, transform: `translateX(${writtenFeedback ? 16 : 2}px)` }}
                      />
                    </div>
                    <div>
                      <div className="text-xs font-medium" style={{ color: "var(--foreground)" }}>Written Feedback Only</div>
                      <div className="text-[11px]" style={{ color: "var(--color-text-muted)" }}>Don't use scale ratings</div>
                    </div>
                  </button>

                  {/* Rating Order — hidden in written feedback mode */}
                  {!writtenFeedback && (
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>Rating Order</label>
                      <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: "var(--border)" }}>
                        <button
                          onClick={() => setRatingOrder("htl")}
                          className="flex-1 py-1.5 text-xs font-medium transition-colors"
                          style={{
                            background: ratingOrder === "htl" ? "var(--btn-primary-bg)" : "#fff",
                            color: ratingOrder === "htl" ? "#fff" : "var(--foreground)",
                          }}
                        >
                          H → L
                        </button>
                        <button
                          onClick={() => setRatingOrder("lth")}
                          className="flex-1 py-1.5 text-xs font-medium transition-colors border-l"
                          style={{
                            borderColor: "var(--border)",
                            background: ratingOrder === "lth" ? "var(--btn-primary-bg)" : "#fff",
                            color: ratingOrder === "lth" ? "#fff" : "var(--foreground)",
                          }}
                        >
                          L → H
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── Attached Assignments ── */}
            <div style={{ borderBottom: "1px solid var(--color-stroke-muted)" }}>
              <div className="flex items-center justify-between px-4 pt-3 pb-2">
                <div className="flex items-center gap-1.5">
                  <Paperclip size={13} style={{ color: "var(--color-text-muted)" }} />
                  <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>
                    Attached Assignments
                  </span>
                </div>
                {attachedAssignments.length > 0 && (
                  <span
                    className="text-[11px] font-semibold px-1.5 py-0.5 rounded-full"
                    style={{ background: "var(--btn-secondary-bg)", color: "var(--btn-secondary-text)" }}
                  >
                    {attachedAssignments.length}
                  </span>
                )}
              </div>

              <div className="px-4 pb-3 flex flex-col gap-2">
                {/* Attached list */}
                {attachedAssignments.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-start gap-2 px-2.5 py-2 rounded-xl"
                    style={{ background: "rgba(43,122,188,0.07)", border: "1px solid rgba(43,122,188,0.18)" }}
                  >
                    <BookOpen size={13} className="flex-shrink-0 mt-0.5" style={{ color: "var(--primary)" }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium leading-snug truncate" style={{ color: "var(--foreground)" }}>{a.title}</p>
                      <p className="text-[11px]" style={{ color: "var(--color-text-muted)" }}>{a.course} · Due {a.dueDate}</p>
                    </div>
                    <button
                      onClick={() => removeAttachment(a.id)}
                      className="flex-shrink-0 p-0.5 rounded hover:bg-blue-100 transition-colors mt-0.5"
                      title="Detach assignment"
                    >
                      <X size={12} style={{ color: "var(--color-text-muted)" }} />
                    </button>
                  </div>
                ))}

                {/* Search to add */}
                <AssignmentSearch attached={attachedAssignments} onAdd={addAttachment} />
              </div>
            </div>

            {/* ── AI Assistant ── */}
            <div>
              <AiPanel
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
        </div>

        {/* ══════════════════════════════════════
            RIGHT — Editable rubric grid
        ══════════════════════════════════════ */}
        <div className="flex flex-col flex-1 overflow-hidden" style={{ background: "var(--muted)" }}>
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
                <button
                  onClick={handleAiRun}
                  disabled={genState === "generating"}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium disabled:opacity-40"
                  style={{ border: "1px solid var(--btn-tertiary-stroke)", color: "var(--foreground)", background: "#fff", borderRadius: "var(--btn-radius)" }}
                >
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
                      {writtenFeedback
                        ? <th className="p-3"><div className="h-3 w-32 rounded bg-white/20 animate-pulse" /></th>
                        : displayLevels.map((l) => <th key={l.id} className="p-3"><div className="h-3 w-20 rounded bg-white/20 animate-pulse" />{showPoints && <div className="h-2 w-8 rounded bg-white/15 animate-pulse mt-1.5" />}</th>)
                      }
                    </tr>
                  </thead>
                  <tbody>
                    {[1,2,3,4].map((row) => (
                      <tr key={row} className="border-b" style={{ borderColor: "var(--border)" }}>
                        <td className="p-3" style={{ background: "var(--muted)", borderRight: "1px solid var(--border)" }}>
                          <div className="h-3 w-24 rounded bg-gray-200 animate-pulse" /><div className="h-2 w-16 rounded bg-gray-100 animate-pulse mt-1.5" />
                        </td>
                        {writtenFeedback
                          ? <td className="p-3"><div className="h-2 w-full rounded bg-gray-100 animate-pulse mb-1" /><div className="h-2 w-3/5 rounded bg-gray-100 animate-pulse" /></td>
                          : displayLevels.map((l) => <td key={l.id} className="p-3" style={{ borderRight: "1px solid var(--border)" }}><div className="h-2 w-full rounded bg-gray-100 animate-pulse mb-1" /><div className="h-2 w-4/5 rounded bg-gray-100 animate-pulse mb-1" /><div className="h-2 w-3/5 rounded bg-gray-100 animate-pulse" /></td>)
                        }
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
                        <th className="p-3 text-left">
                          <span className="text-xs font-semibold uppercase tracking-wide text-white/70">Written Feedback</span>
                        </th>
                      ) : (
                        displayLevels.map((level, i) => (
                          <th key={level.id} className="p-3 text-left" style={{ borderRight: i < displayLevels.length - 1 ? "1px solid rgba(255,255,255,0.15)" : "none" }}>
                            <div className="text-xs font-semibold text-white leading-tight">{level.label}</div>
                            {showPoints && (
                              <div className="text-[11px] text-white/60 mt-0.5">{level.points}{pointLabel === "%" ? "%" : " pts"}</div>
                            )}
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
                      <CriterionRow
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
    </AppShell>
  )
}
