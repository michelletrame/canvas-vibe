"use client"

import React, { useState, Fragment } from "react"
import {
  Search, Send, Download, ChevronRight, X, Maximize2, Check, Clock,
  LayoutDashboard, BookOpen, CalendarDays, Inbox, LifeBuoy, Eye, Info,
  ArrowRight, Calendar, FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { IconButton } from "@/components/ui/icon-button"
import { Avatar } from "@/components/ui/avatar"
import { Pill } from "@/components/ui/pill"
import { Alert } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select"

// ── Global Nav (matches course-modules) ───────────────────────────────────────

const NAV_ICONS = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: BookOpen,        label: "Courses"   },
  { icon: CalendarDays,    label: "Calendar"  },
  { icon: Inbox,           label: "Inbox"     },
  { icon: LifeBuoy,        label: "Help"      },
]

function GlobalNav() {
  return (
    <nav
      className="flex flex-col items-center py-3 gap-1 flex-shrink-0 h-screen"
      style={{ width: 52, background: "#273540" }}
    >
      <div
        className="flex items-center justify-center w-9 h-9 rounded-full mb-2 flex-shrink-0"
        style={{ background: "rgba(255,255,255,0.15)" }}
      >
        <img
          src={`${process.env.NEXT_PUBLIC_BASE_PATH}/svg/canvas.svg`}
          alt="Canvas"
          width={22}
          height={22}
        />
      </div>
      {NAV_ICONS.map(({ icon: Icon, label }) => (
        <button
          key={label}
          title={label}
          className="flex items-center justify-center w-9 h-9 rounded-xl transition-colors hover:bg-white/10"
          style={{ color: "rgba(255,255,255,0.65)" }}
        >
          <Icon size={20} />
        </button>
      ))}
    </nav>
  )
}

// ── Types ──────────────────────────────────────────────────────────────────────

type ScoreStatus = "graded" | "missing" | "late" | "ungraded"

type CellData = {
  score?: number
  max: number
  status: ScoreStatus
  submittedAt?: string
}

type StudentData = {
  id: string
  name: string
  cells: CellData[]
  currentGrade: string
}

type RubricCriterion = {
  id: string
  label: string
  points: number
  levels: { label: string; description: string; pts: number }[]
  selectedLevel?: number
}

type Comment = {
  id: string
  author: string
  role: "teacher" | "student"
  text: string
  time: string
}

type ExpandedCell = { studentId: string; assignmentIdx: number }

// ── Data generation ────────────────────────────────────────────────────────────

function seededRand(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

function submittedDate(aIdx: number, sIdx: number): string {
  const day = Math.min(28, 4 + Math.floor(aIdx * 0.9) + Math.floor(seededRand(aIdx * 17 + sIdx * 3) * 3))
  const hour = 8 + Math.floor(seededRand(aIdx * 11 + sIdx * 7) * 15)
  const min  = Math.floor(seededRand(aIdx * 13 + sIdx * 5) * 60)
  const ampm = hour >= 12 ? "PM" : "AM"
  const h12  = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
  return `Apr ${day}, ${h12}:${String(min).padStart(2, "0")} ${ampm}`
}

function generateCell(sIdx: number, aIdx: number, pts: number, perf: number): CellData {
  const r1 = seededRand(sIdx * 97 + aIdx * 31)
  const r2 = seededRand(sIdx * 97 + aIdx * 31 + 500)
  // Future assignments — not yet submitted
  if (aIdx >= 22) return { max: pts, status: "ungraded" }
  const missingP  = perf < 0.60 ? 0.22 : perf < 0.75 ? 0.09 : 0.03
  const lateP     = perf < 0.70 ? 0.14 : perf < 0.85 ? 0.07 : 0.02
  // Recent past-due (a19–a22): ~40% of submissions await grading
  const pendingP  = aIdx >= 18 ? 0.40 : 0
  if (r1 < missingP) return { max: pts, status: "missing" }
  if (r1 < missingP + lateP) {
    return { score: Math.round(pts * Math.max(0.4, perf * 0.85 + (r2 - 0.5) * 0.15)), max: pts, status: "late", submittedAt: submittedDate(aIdx, sIdx) }
  }
  if (r1 < missingP + lateP + pendingP) {
    // Submitted but teacher hasn't graded yet
    return { max: pts, status: "ungraded", submittedAt: submittedDate(aIdx, sIdx) }
  }
  return { score: Math.round(pts * Math.min(1, Math.max(0.5, perf + (r2 - 0.5) * 0.22))), max: pts, status: "graded", submittedAt: submittedDate(aIdx, sIdx) }
}

function gradeFromPerf(p: number): string {
  if (p >= 0.93) return "A";  if (p >= 0.90) return "A−"; if (p >= 0.87) return "B+"
  if (p >= 0.83) return "B";  if (p >= 0.80) return "B−"; if (p >= 0.77) return "C+"
  if (p >= 0.73) return "C";  if (p >= 0.70) return "C−"; if (p >= 0.67) return "D+"
  if (p >= 0.63) return "D";  if (p >= 0.60) return "D−"; return "F"
}

// ── Data ───────────────────────────────────────────────────────────────────────

// Today in the prototype world is 2026-04-20
const TODAY = new Date("2026-04-20")

function formatDue(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

const ASSIGNMENT_DEFS = [
  { id: "a1",  name: "Research Paper Draft",   pts: 100, modality: "essay"        as const, due: "2026-01-15" },
  { id: "a2",  name: "Annotated Bibliography", pts: 50,  modality: "slides"       as const, due: "2026-01-22" },
  { id: "a3",  name: "Midterm Essay",          pts: 80,  modality: "essay"        as const, due: "2026-02-05" },
  { id: "a4",  name: "Peer Review",            pts: 25,  modality: "illustration" as const, due: "2026-02-12" },
  { id: "a5",  name: "Final Essay",            pts: 150, modality: "essay"        as const, due: "2026-02-19" },
  { id: "a6",  name: "Lab Report 1",           pts: 60,  modality: "essay"        as const, due: "2026-02-26" },
  { id: "a7",  name: "Weekly Reflection 1",    pts: 20,  modality: "essay"        as const, due: "2026-03-05" },
  { id: "a8",  name: "Cell Diagram Quiz",      pts: 30,  modality: "illustration" as const, due: "2026-03-09" },
  { id: "a9",  name: "Reading Response 1",     pts: 15,  modality: "essay"        as const, due: "2026-03-12" },
  { id: "a10", name: "Group Presentation",     pts: 75,  modality: "slides"       as const, due: "2026-03-19" },
  { id: "a11", name: "Lab Report 2",           pts: 60,  modality: "essay"        as const, due: "2026-03-26" },
  { id: "a12", name: "Weekly Reflection 2",    pts: 20,  modality: "essay"        as const, due: "2026-04-02" },
  { id: "a13", name: "Literature Review",      pts: 90,  modality: "essay"        as const, due: "2026-04-05" },
  { id: "a14", name: "Reading Response 2",     pts: 15,  modality: "essay"        as const, due: "2026-04-09" },
  { id: "a15", name: "Concept Map",            pts: 40,  modality: "illustration" as const, due: "2026-04-12" },
  { id: "a16", name: "Lab Report 3",           pts: 60,  modality: "essay"        as const, due: "2026-04-14" },
  { id: "a17", name: "Weekly Reflection 3",    pts: 20,  modality: "essay"        as const, due: "2026-04-16" },
  { id: "a18", name: "Case Study",             pts: 85,  modality: "essay"        as const, due: "2026-04-17" },
  { id: "a19", name: "Reading Response 3",     pts: 15,  modality: "essay"        as const, due: "2026-04-18" },
  { id: "a20", name: "Poster Presentation",    pts: 70,  modality: "slides"       as const, due: "2026-04-19" },
  { id: "a21", name: "Lab Report 4",           pts: 60,  modality: "essay"        as const, due: "2026-04-19" },
  { id: "a22", name: "Weekly Reflection 4",    pts: 20,  modality: "essay"        as const, due: "2026-04-20" },
  { id: "a23", name: "Research Proposal",      pts: 100, modality: "essay"        as const, due: "2026-04-25" },
  { id: "a24", name: "Peer Evaluation",        pts: 25,  modality: "illustration" as const, due: "2026-05-02" },
  { id: "a25", name: "Final Project Report",   pts: 200, modality: "essay"        as const, due: "2026-05-15" },
]

const STUDENT_DEFS = [
  { id: "s1",  name: "Amara Osei",        perf: 0.94 }, // A
  { id: "s2",  name: "Ben Kowalski",      perf: 0.83 }, // B
  { id: "s3",  name: "Cleo Martinez",     perf: 0.75 }, // C
  { id: "s4",  name: "Daniel Park",       perf: 0.91 }, // A−
  { id: "s5",  name: "Elena Rossi",       perf: 0.81 }, // B−
  { id: "s6",  name: "Marcus Williams",   perf: 0.45 }, // F
  { id: "s7",  name: "Fiona Chen",        perf: 0.88 }, // B+
  { id: "s8",  name: "George Okafor",     perf: 0.80 }, // B−
  { id: "s9",  name: "Hannah Schmidt",    perf: 0.96 }, // A
  { id: "s10", name: "Isaac Patel",       perf: 0.84 }, // B
  { id: "s11", name: "Jasmine Torres",    perf: 0.78 }, // C+
  { id: "s12", name: "Kevin Nakamura",    perf: 0.91 }, // A−
  { id: "s13", name: "Laura Andersen",    perf: 0.63 }, // D
  { id: "s14", name: "Malik Robinson",    perf: 0.87 }, // B+
  { id: "s15", name: "Nadia Petrov",      perf: 0.87 }, // B+
  { id: "s16", name: "Omar Hassan",       perf: 0.71 }, // C−
  { id: "s17", name: "Priya Sharma",      perf: 0.93 }, // A
  { id: "s18", name: "Quinn Davis",       perf: 0.83 }, // B
  { id: "s19", name: "Rosa Mendez",       perf: 0.74 }, // C
  { id: "s20", name: "Samuel Lee",        perf: 0.90 }, // A−
  { id: "s21", name: "Tara O'Brien",      perf: 0.80 }, // B−
  { id: "s22", name: "Umar Diallo",       perf: 0.85 }, // B
  { id: "s23", name: "Valentina Cruz",    perf: 0.86 }, // B+
  { id: "s24", name: "William Foster",    perf: 0.67 }, // D+
  { id: "s25", name: "Xiao Wei",          perf: 0.92 }, // A−
  { id: "s26", name: "Yuki Yamamoto",     perf: 0.78 }, // C+
]

const STUDENTS: StudentData[] = STUDENT_DEFS.map((def, sIdx) => ({
  id: def.id,
  name: def.name,
  currentGrade: gradeFromPerf(def.perf),
  cells: ASSIGNMENT_DEFS.map((a, aIdx) => generateCell(sIdx, aIdx, a.pts, def.perf)),
}))

const ASSIGNMENTS = ASSIGNMENT_DEFS.map((def, aIdx) => {
  const cells   = STUDENTS.map(s => s.cells[aIdx])
  const pastDue = new Date(def.due) <= TODAY
  // "needs grading" = submitted but not yet graded (ungraded with a submittedAt)
  const needsGradingCount = pastDue
    ? cells.filter(c => c.status === "ungraded" && c.submittedAt).length
    : 0
  return { ...def, pastDue, needsGradingCount, dueLabel: formatDue(def.due) }
})

const RUBRIC_TEMPLATE: RubricCriterion[] = [
  {
    id: "r1", label: "Content & Analysis", points: 30,
    levels: [
      { label: "Excellent",  description: "Comprehensive, insightful analysis with strong evidence", pts: 30 },
      { label: "Proficient", description: "Good analysis with adequate supporting evidence",          pts: 22 },
      { label: "Developing", description: "Partial analysis with limited evidence",                   pts: 14 },
    ],
  },
  {
    id: "r2", label: "Organization", points: 20,
    levels: [
      { label: "Excellent",  description: "Clear, logical structure throughout",                      pts: 20 },
      { label: "Proficient", description: "Mostly organized with minor issues",                       pts: 15 },
      { label: "Developing", description: "Structure unclear in places",                              pts: 8  },
    ],
  },
  {
    id: "r3", label: "Quality & Craft", points: 15,
    levels: [
      { label: "Excellent",  description: "Polished, precise, and professional",                      pts: 15 },
      { label: "Proficient", description: "Clear quality with minor weaknesses",                      pts: 11 },
      { label: "Developing", description: "Quality issues affect the work",                           pts: 6  },
    ],
  },
]
const RUBRIC_MAX = RUBRIC_TEMPLATE.reduce((sum, c) => sum + c.points, 0)

// ── Submission content ─────────────────────────────────────────────────────────

const ESSAY_CONTENT: Record<string, string> = {
  a1: `Cell Cycle Regulation and the Role of Cyclin-CDK Complexes

The accurate and timely progression through the cell cycle is essential for maintaining genomic integrity. At the core of this regulatory framework are the cyclin-dependent kinases (CDKs), a family of serine/threonine protein kinases activated upon binding to their regulatory partners, the cyclins.

The G1/S transition — a commitment point often called the restriction point — is governed primarily by CDK4 and CDK6 in complex with D-type cyclins. These complexes phosphorylate the retinoblastoma protein (Rb), releasing the transcription factor E2F and allowing transcription of genes required for S-phase entry. Once cells pass this checkpoint, commitment to division is essentially irreversible under normal physiological conditions.

Entry into mitosis requires activation of CDK1 in complex with Cyclin B, forming the complex historically known as Maturation Promoting Factor (MPF). CDK1/Cyclin B phosphorylates numerous substrates to orchestrate chromosome condensation, nuclear envelope breakdown, and spindle assembly. Subsequent activation of the APC/C ubiquitin ligase targets Cyclin B for proteasomal degradation, driving mitotic exit.`,

  a3: `Membrane Transport and Cellular Homeostasis

Cellular homeostasis depends on the ability of cells to regulate the passage of ions and molecules across the plasma membrane. This selective permeability is mediated by a diverse repertoire of transport proteins, including ion channels, transporters, and pumps.

The sodium-potassium ATPase (Na⁺/K⁺-ATPase) exemplifies primary active transport: for every ATP hydrolyzed, three sodium ions are extruded and two potassium ions are imported against their respective concentration gradients. This electrochemical gradient underpins neuronal excitability and provides the driving force for secondary active transporters throughout the body.

Aquaporins facilitate passive water movement down osmotic gradients. The identification of AQP1 by Peter Agre — for which he shared the 2003 Nobel Prize in Chemistry — revealed the molecular basis of rapid transcellular water flux in the kidney, red blood cells, and other tissues.`,

  a5: `CRISPR-Cas9: Mechanisms, Specificity, and Therapeutic Implications

The discovery and engineering of the CRISPR-Cas9 system has transformed molecular biology, enabling programmable, site-specific modifications to genomic sequences in living cells. Originally characterized as an adaptive immune mechanism in Streptococcus pyogenes, the system has been repurposed as a molecular tool with extraordinary precision.

The Cas9 endonuclease, guided by a synthetic single-guide RNA (sgRNA), creates site-specific double-strand breaks adjacent to a protospacer-adjacent motif (PAM). These breaks are repaired via non-homologous end joining (NHEJ), which introduces indels, or homology-directed repair (HDR), which can incorporate a defined sequence from a provided template.

Off-target editing remains a primary safety concern for therapeutic applications. High-fidelity Cas9 variants such as eSpCas9 and HiFi Cas9 have been engineered with reduced off-target activity while maintaining on-target efficacy.`,
}

function EssaySubmission({ assignmentId }: { assignmentId: string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-white p-6">
      <p className="text-sm leading-relaxed whitespace-pre-line text-[#273540]">
        {ESSAY_CONTENT[assignmentId] ?? ESSAY_CONTENT["a1"]}
      </p>
    </div>
  )
}

function SlidesSubmission({ studentName }: { studentName: string }) {
  const slides = [
    {
      number: 1, headerLabel: "TITLE",
      title: "Annotated Bibliography",
      body: `Cellular Energetics & Metabolism\n\n${studentName}\nBIO 202 · Spring 2025`,
    },
    {
      number: 2, headerLabel: "SOURCE 1",
      title: "Berg, Tymoczko & Stryer",
      body: `Biochemistry, 8th ed. (2015). W.H. Freeman.\n\nThis foundational text provides comprehensive coverage of metabolic pathways. Particularly relevant for ATP synthesis mechanisms central to our course learning objectives on oxidative phosphorylation.`,
    },
    {
      number: 3, headerLabel: "SOURCE 2",
      title: "Alberts et al.",
      body: `Molecular Biology of the Cell, 6th ed. (2014). Garland Science.\n\nChapter 14 covers chemiosmosis and the ATP synthase mechanism in rigorous detail. The electron transport chain diagrams were directly referenced in my mitochondrial function analysis.`,
    },
  ]

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-4 flex-nowrap">
        {slides.map((slide) => (
          <div key={slide.number} className="flex-none w-64 rounded-xl border border-[var(--border)] bg-white overflow-hidden" style={{ minHeight: 300 }}>
            <div className="px-3 py-1.5" style={{ background: "var(--btn-primary-bg)" }}>
              <span className="text-xs font-bold text-white">{slide.headerLabel}</span>
            </div>
            <div className="p-4">
              <p className="font-semibold text-sm mb-2">{slide.title}</p>
              <p className="text-xs text-[#576773] whitespace-pre-line">{slide.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function IllustrationSubmission({ studentName }: { studentName: string }) {
  const organelles = [
    { name: "Nucleus",         color: "#3B82F6", bg: "#EFF6FF", note: "Contains chromatin; coordinates cell activity via mRNA transcription." },
    { name: "Mitochondria",    color: "#EF4444", bg: "#FEF2F2", note: "Site of oxidative phosphorylation; ~30 ATP per glucose." },
    { name: "Rough ER",        color: "#10B981", bg: "#F0FDF4", note: "Ribosome-studded membrane; folds and translocates secretory proteins." },
    { name: "Golgi Apparatus", color: "#F59E0B", bg: "#FFFBEB", note: "Modifies and sorts proteins; packages into transport vesicles." },
    { name: "Ribosome",        color: "#8B5CF6", bg: "#F5F3FF", note: "Translates mRNA into protein; free ribosomes → cytosolic proteins." },
    { name: "Lysosome",        color: "#EC4899", bg: "#FFF1F2", note: "Acid hydrolases digest worn organelles via autophagy." },
  ]

  return (
    <div>
      <p className="font-semibold text-sm mb-3">Annotated Cell Diagram — {studentName}</p>
      <div className="rounded-xl border-2 border-[var(--color-info)] p-4">
        <p className="text-xs font-bold text-[#576773] text-center mb-3">── PLASMA MEMBRANE ──</p>
        <div className="flex flex-wrap gap-2">
          {organelles.map((org) => (
            <div
              key={org.name}
              className="rounded-lg p-2"
              style={{ backgroundColor: org.bg, borderLeft: `3px solid ${org.color}`, flex: "1 1 calc(33% - 0.5rem)", minWidth: 140 }}
            >
              <p className="text-sm font-bold" style={{ color: org.color }}>{org.name}</p>
              <p className="text-xs text-[#576773] mt-0.5">{org.note}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 p-3 rounded-lg bg-[#fffbeb]" style={{ borderLeft: "4px solid #F59E0B" }}>
        <p className="text-xs font-bold mb-1">Peer Reviewer's Notes</p>
        <p className="text-xs text-[#576773]">
          Strong identification and labeling. Nucleus and mitochondria annotations are thorough.
          Consider expanding the rough ER–Golgi secretory pathway relationship and adding smooth ER.
        </p>
      </div>
    </div>
  )
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function pct(score: number, max: number) { return Math.round((score / max) * 100) }

function initials(name: string) {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
}

function cellStyle(cell: CellData): { bg: string; textColor: string; label: string } {
  if (cell.status === "missing")  return { bg: "#FEE2E2", textColor: "#DC2626", label: "Missing" }
  if (cell.status === "ungraded") return { bg: "#F8FAFC", textColor: "#94A3B8", label: "—" }
  if (cell.status === "late")     return { bg: "#FEF0E8", textColor: "#C2410C", label: `${cell.score}  Late` }
  const p = pct(cell.score!, cell.max)
  if (p >= 90) return { bg: "#D1FAE5", textColor: "#059669", label: String(cell.score) }
  if (p >= 70) return { bg: "#FEF9C3", textColor: "#CA8A04", label: String(cell.score) }
  return         { bg: "#FEE2E2", textColor: "#DC2626", label: String(cell.score) }
}

const GRADE_COLORS: Record<string, string> = {
  "A": "#059669", "A−": "#059669", "B+": "#0D9488", "B": "#0D9488", "B−": "#0D9488",
  "C+": "#CA8A04", "C": "#CA8A04", "C−": "#CA8A04", "D": "#DC2626", "F": "#DC2626",
}

const STATUS_PILL_COLOR: Record<ScoreStatus, "success" | "error" | "warning" | "neutral"> = {
  graded: "success", missing: "error", late: "warning", ungraded: "neutral",
}
const STATUS_LABELS: Record<ScoreStatus, string> = {
  graded: "Graded", missing: "Missing", late: "Late", ungraded: "Not submitted",
}

// ── ScoreBadge (compact pill-badge format) ────────────────────────────────────

function ScoreBadge({ cell, onInfo }: { cell: CellData; onInfo: () => void }) {
  const [hovered, setHovered] = useState(false)
  const hasSubmission = cell.status !== "missing" && (cell.status !== "ungraded" || !!cell.submittedAt)

  let cls = ""
  let label = ""

  if (cell.status === "missing") {
    cls = "bg-rose-50 text-rose-700 border-rose-200"; label = "Missing"
  } else if (cell.status === "ungraded" && !cell.submittedAt) {
    cls = "bg-slate-50 text-slate-400 border-slate-100"; label = "—"
  } else if (cell.status === "ungraded") {
    cls = "bg-slate-100 text-slate-600 border-slate-200"; label = "Needs grading"
  } else if (cell.status === "late") {
    cls = "bg-amber-50 text-amber-800 border-amber-200"
    label = `${cell.score}/${cell.max} Late`
  } else {
    const p = pct(cell.score!, cell.max)
    cls = p >= 70 ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"
    label = `${cell.score}/${cell.max}`
  }

  return (
    <div
      className="flex items-center gap-1.5"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className={`inline-flex items-center px-2 h-5 text-[11px] font-medium rounded-full border whitespace-nowrap ${cls}`}>
        {label}
      </span>
      <button
        type="button"
        title="Grade details"
        className="p-0.5 rounded text-[#8d959f] hover:text-[#576773] outline-none transition-colors"
        style={{ visibility: hasSubmission && hovered ? "visible" : "hidden" }}
        onClick={(e) => { e.stopPropagation(); onInfo() }}
      >
        <Info size={11} strokeWidth={1.75} />
      </button>
    </div>
  )
}

// ── ScoreCell (kept for reference) ────────────────────────────────────────────

function ScoreCell({
  cell, isExpanded, onOpen, onInfo,
}: {
  cell: CellData
  isExpanded: boolean
  onOpen: () => void
  onInfo: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const { bg, textColor, label } = cellStyle(cell)
  // "ungraded" with a submittedAt = submitted but not yet graded — still openable
  const hasSubmission = cell.status !== "missing" && (cell.status !== "ungraded" || !!cell.submittedAt)

  // Icon button shared styles
  const iconBtn = (color: string) =>
    `p-0.5 rounded transition-colors hover:bg-black/10 outline-none focus-visible:ring-1 focus-visible:ring-[${color}]`

  return (
    <div
      className="w-full rounded-lg px-2 py-1.5 text-center transition-all"
      style={{
        backgroundColor: isExpanded ? "#EEF2FF" : bg,
        minWidth: 80,
        border: isExpanded ? "1.5px solid #4338CA" : "1.5px solid transparent",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="block text-sm font-bold" style={{ color: isExpanded ? "#4338CA" : textColor }}>
        {label}
      </span>
      {/* Always rendered for stable height; hidden when not hovered/expanded */}
      <div
        className="mt-0.5 flex items-center justify-center gap-1"
        style={{ visibility: hasSubmission && (hovered || isExpanded) ? "visible" : "hidden" }}
      >
        <button
          type="button"
          title="View submission"
          className={iconBtn("#4338CA")}
          style={{ color: "#4338CA" }}
          onClick={onOpen}
        >
          <Eye size={12} strokeWidth={1.75} />
        </button>
        <button
          type="button"
          title="Grade details"
          className={iconBtn("#576773")}
          style={{ color: "#576773" }}
          onClick={(e) => { e.stopPropagation(); onInfo() }}
        >
          <Info size={12} strokeWidth={1.75} />
        </button>
      </div>
    </div>
  )
}

// ── ExpandedRow ────────────────────────────────────────────────────────────────

function ExpandedRow({
  student, assignmentIdx, cell, rubric, comments, feedbackText,
  onSelectLevel, onSaveGrade, onClose, onFeedbackChange, onSendFeedback,
}: {
  student: StudentData
  assignmentIdx: number
  cell: CellData
  rubric: RubricCriterion[]
  comments: Comment[]
  feedbackText: string
  onSelectLevel: (criterionId: string, levelIdx: number) => void
  onSaveGrade: () => void
  onClose: () => void
  onFeedbackChange: (text: string) => void
  onSendFeedback: () => void
}) {
  const assignment  = ASSIGNMENTS[assignmentIdx]
  const rubricTotal = rubric.reduce((sum, c) =>
    sum + (c.selectedLevel !== undefined ? c.levels[c.selectedLevel].pts : 0), 0)
  const submittedAt = student.cells[assignmentIdx].submittedAt

  return (
    <div
      className="border-t border-b border-[var(--border)]"
      style={{ background: "#f5f7f8", height: 720 }}
    >
      <div className="flex flex-col h-full">

        {/* Header */}
        <div className="flex items-center justify-between gap-4 bg-white border-b border-[var(--border)] px-4 py-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar initials={initials(student.name)} size="xSmall" inverse />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm text-[#273540]">{student.name}</span>
                <span className="text-[#8d959f] text-sm">·</span>
                <span className="text-[#576773] text-sm truncate">{assignment.name}</span>
                <Pill color={STATUS_PILL_COLOR[cell.status]} status={STATUS_LABELS[cell.status]} />
              </div>
              {submittedAt && (
                <div className="flex items-center gap-1 mt-0.5">
                  <Clock size={12} strokeWidth={1.75} className="text-[#8d959f]" />
                  <span className="text-xs text-[#8d959f]">Submitted {submittedAt}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => { window.location.assign("/prototypes/grading-workspace") }}
            >
              <Maximize2 size={14} strokeWidth={1.75} />
              Full view
            </Button>
            <IconButton
              variant="ghost"
              size="sm"
              icon={X}
              aria-label="Close submission view"
              onClick={onClose}
            />
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 min-h-0">

          {/* Submission viewer */}
          <div className="flex-1 overflow-y-auto p-4 min-w-0">
            {assignment.modality === "essay"        && <EssaySubmission assignmentId={assignment.id} />}
            {assignment.modality === "slides"       && <SlidesSubmission studentName={student.name} />}
            {assignment.modality === "illustration" && <IllustrationSubmission studentName={student.name} />}
          </div>

          {/* Grading tray */}
          <div className="shrink-0 overflow-y-auto border-l border-[var(--border)] bg-white p-4" style={{ width: 340 }}>

            {/* Rubric */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-sm text-[#273540]">Rubric</span>
                <span className="text-sm text-[#576773]">{rubricTotal} / {RUBRIC_MAX} pts</span>
              </div>

              {rubric.map(criterion => (
                <div key={criterion.id} className="mb-3 p-3 rounded-xl" style={{ background: "#f5f7f8" }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-[#273540]">{criterion.label}</span>
                    <span className="text-xs text-[#8d959f]">{criterion.points} pts</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {criterion.levels.map((level, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className="rounded-lg px-2 py-1 text-xs font-semibold border transition-colors outline-none"
                        style={
                          criterion.selectedLevel === idx
                            ? { background: "var(--btn-primary-bg)", color: "#fff", borderColor: "var(--btn-primary-bg)" }
                            : { background: "#fff", color: "#273540", borderColor: "var(--border)" }
                        }
                        onClick={() => onSelectLevel(criterion.id, idx)}
                      >
                        {level.label} · {level.pts}
                      </button>
                    ))}
                  </div>
                  {criterion.selectedLevel !== undefined && (
                    <p className="mt-2 text-xs text-[#576773]">
                      {criterion.levels[criterion.selectedLevel].description}
                    </p>
                  )}
                </div>
              ))}

              <div className="border-t border-[var(--border)] pt-3 mt-2">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-sm text-[#273540]">Total Score</span>
                  <span className="font-bold text-base text-[#273540]">{rubricTotal} / {RUBRIC_MAX} pts</span>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  disabled={rubricTotal === 0}
                  onClick={onSaveGrade}
                >
                  <Check size={14} strokeWidth={2} />
                  Save Grade
                </Button>
              </div>
            </div>

            {/* Feedback */}
            <div className="border-t border-[var(--border)] pt-4">
              <span className="font-semibold text-sm text-[#273540] block mb-3">Feedback to Student</span>

              {comments.length > 0 && (
                <div className="mb-3 flex flex-col gap-2">
                  {comments.map(c => (
                    <div
                      key={c.id}
                      className="rounded-lg p-3"
                      style={{ background: "#f5f7f8", borderLeft: "3px solid var(--btn-primary-bg)" }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-[#273540]">{c.author}</span>
                        <span className="text-xs text-[#8d959f]">{c.time}</span>
                      </div>
                      <p className="text-sm text-[#273540]">{c.text}</p>
                    </div>
                  ))}
                </div>
              )}

              <Textarea
                placeholder="Write feedback for this student…"
                value={feedbackText}
                onChange={e => onFeedbackChange(e.target.value)}
                rows={3}
              />
              <div className="mt-2 flex justify-end">
                <Button
                  variant="primary"
                  size="sm"
                  disabled={!feedbackText.trim()}
                  onClick={onSendFeedback}
                >
                  <Send size={14} strokeWidth={1.75} />
                  Send
                </Button>
              </div>

              <div
                className="mt-4 rounded-lg p-3 flex items-center gap-2"
                style={{ background: "#f0fdf4", borderLeft: "3px solid #16a34a" }}
              >
                <Check size={14} strokeWidth={2} className="text-[#16a34a] shrink-0" />
                <span className="text-xs text-[#16a34a]">Student will be notified when they read this feedback</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

// ── Grade Tray ─────────────────────────────────────────────────────────────────

function GradeTray({
  student, assignmentIdx, onClose,
}: {
  student: StudentData
  assignmentIdx: number
  onClose: () => void
}) {
  const assignment = ASSIGNMENTS[assignmentIdx]
  const cell       = student.cells[assignmentIdx]
  const score      = cell.score
  const scorePct   = score !== undefined ? Math.round((score / cell.max) * 100) : null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: "rgba(39,53,64,0.25)" }}
        onClick={onClose}
      />

      {/* Tray */}
      <div
        className="fixed top-0 right-0 h-full z-50 flex flex-col bg-white overflow-y-auto"
        style={{ width: 360, boxShadow: "-4px 0 24px rgba(0,0,0,0.12)" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-[var(--border)]">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <Avatar initials={initials(student.name)} size="xSmall" inverse />
              <span className="font-semibold text-sm text-[#273540] truncate">{student.name}</span>
            </div>
            <p className="text-xs text-[#576773] truncate">{assignment.name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 p-1 rounded-lg hover:bg-[#f5f7f8] transition-colors"
            style={{ color: "#576773" }}
          >
            <X size={16} strokeWidth={1.75} />
          </button>
        </div>

        {/* Score summary */}
        <div className="px-5 py-4 border-b border-[var(--border)]">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#8d959f] mb-3">Score</p>
          <div className="flex items-end gap-2 mb-2">
            {score !== undefined ? (
              <>
                <span className="text-3xl font-bold text-[#273540]">{score}</span>
                <span className="text-base text-[#576773] mb-0.5">/ {cell.max}</span>
                <span className="text-sm text-[#8d959f] mb-0.5 ml-1">({scorePct}%)</span>
              </>
            ) : (
              <span className="text-2xl font-bold text-[#94a3b8]">—</span>
            )}
          </div>
          <Pill color={STATUS_PILL_COLOR[cell.status]} status={STATUS_LABELS[cell.status]} />
          {cell.submittedAt && (
            <div className="flex items-center gap-1.5 mt-2">
              <Clock size={12} strokeWidth={1.75} className="text-[#8d959f]" />
              <span className="text-xs text-[#8d959f]">Submitted {cell.submittedAt}</span>
            </div>
          )}
        </div>

        {/* Rubric breakdown (simulated) */}
        {score !== undefined && (
          <div className="px-5 py-4 border-b border-[var(--border)]">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#8d959f] mb-3">Rubric</p>
            {RUBRIC_TEMPLATE.map((criterion, i) => {
              const r   = seededRand(student.id.charCodeAt(1) * 17 + i * 31)
              const pts = criterion.levels[Math.floor(r * criterion.levels.length)].pts
              return (
                <div key={criterion.id} className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-[#273540]">{criterion.label}</span>
                    <span className="text-sm font-semibold text-[#273540]">{pts}/{criterion.points}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#e8eaec" }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${Math.round((pts / criterion.points) * 100)}%`, background: "var(--btn-primary-bg)" }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Grade history */}
        <div className="px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#8d959f] mb-3">History</p>
          <div className="flex flex-col gap-2">
            {score !== undefined && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#576773]">Graded</span>
                <span className="font-semibold text-[#273540]">{score} / {cell.max}</span>
              </div>
            )}
            {cell.submittedAt && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#576773]">Submitted</span>
                <span className="text-[#273540]">{cell.submittedAt}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#576773]">Due</span>
              <span className="text-[#273540]">{assignment.dueLabel}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#576773]">Points possible</span>
              <span className="text-[#273540]">{cell.max}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function GradebookPage() {
  const [search, setSearch]               = useState("")
  const [sortBy, setSortBy]               = useState("name")
  const [expandedCell, setExpandedCell]   = useState<ExpandedCell | null>(null)
  const [infoTray, setInfoTray]           = useState<{ studentId: string; assignmentIdx: number } | null>(null)
  const [cellOverrides, setCellOverrides] = useState<Record<string, Partial<CellData>>>({})
  const [rubricStates, setRubricStates]   = useState<Record<string, RubricCriterion[]>>({})
  const [cellComments, setCellComments]   = useState<Record<string, Comment[]>>({})
  const [pendingText, setPendingText]     = useState<Record<string, string>>({})
  const [legendOpen, setLegendOpen]       = useState(false)

  function getCell(student: StudentData, idx: number): CellData {
    const key = `${student.id}_${idx}`
    const ov = cellOverrides[key]
    return ov ? { ...student.cells[idx], ...ov } : student.cells[idx]
  }

  function openCell(studentId: string, assignmentIdx: number) {
    if (expandedCell?.studentId === studentId && expandedCell?.assignmentIdx === assignmentIdx) {
      setExpandedCell(null)
      return
    }
    setExpandedCell({ studentId, assignmentIdx })
    const key = `${studentId}_${assignmentIdx}`
    if (!rubricStates[key]) {
      setRubricStates(prev => ({
        ...prev,
        [key]: RUBRIC_TEMPLATE.map(c => ({ ...c, selectedLevel: undefined })),
      }))
    }
  }

  function selectLevel(cellKey: string, criterionId: string, levelIdx: number) {
    setRubricStates(prev => ({
      ...prev,
      [cellKey]: (prev[cellKey] ?? RUBRIC_TEMPLATE.map(c => ({ ...c }))).map(c =>
        c.id === criterionId ? { ...c, selectedLevel: levelIdx } : c
      ),
    }))
  }

  function saveGrade(studentId: string, assignmentIdx: number) {
    const key = `${studentId}_${assignmentIdx}`
    const rubric = rubricStates[key] ?? []
    const total = rubric.reduce((sum, c) =>
      sum + (c.selectedLevel !== undefined ? c.levels[c.selectedLevel].pts : 0), 0)
    if (total === 0) return
    setCellOverrides(prev => ({ ...prev, [key]: { score: total, status: "graded" } }))
  }

  function sendComment(studentId: string, assignmentIdx: number) {
    const key = `${studentId}_${assignmentIdx}`
    const text = pendingText[key]?.trim()
    if (!text) return
    setCellComments(prev => ({
      ...prev,
      [key]: [...(prev[key] ?? []), { id: `c${Date.now()}`, author: "Ms. Trame", role: "teacher", text, time: "Just now" }],
    }))
    setPendingText(prev => ({ ...prev, [key]: "" }))
  }

  const BELOW_C = new Set(["D+", "D", "D−", "F"])
  const AT_RISK = STUDENTS.filter(s => {
    if (!BELOW_C.has(s.currentGrade)) return false
    const cells = s.cells.map((_, i) => getCell(s, i))
    return (
      cells.some(c => c.status === "missing") ||
      cells.filter(c => c.status === "graded" && c.score !== undefined && pct(c.score, c.max) < 70).length >= 2
    )
  })

  const totalUngraded = STUDENTS.reduce((sum, s) =>
    sum + s.cells.filter((_, i) => getCell(s, i).status === "ungraded").length, 0)

  const totalMissing = STUDENTS.reduce((sum, s) =>
    sum + s.cells.filter((_, i) => getCell(s, i).status === "missing").length, 0)

  const filtered = STUDENTS.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#f2f4f4" }}>
      {/* Global Nav */}
      <GlobalNav />

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">

        {/* Course header */}
        <div
          className="flex items-center justify-between flex-shrink-0 px-6 gap-4"
          style={{ height: 64, background: "#fff", borderBottom: "1px solid #e8eaec" }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <h1
              className="text-xl font-bold truncate"
              style={{ color: "#273540", fontFamily: "var(--font-heading)" }}
            >
              Artificial Intelligence Ethics
            </h1>
            <span
              className="text-xs px-2 py-0.5 rounded flex-shrink-0"
              style={{ background: "#ddecf3", color: "#77360b" }}
            >
              Not published
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {(["Grades", "People", "Outcomes", "Apps"] as const).map((label) => (
              <button
                key={label}
                className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-xl transition-colors"
                style={
                  label === "Grades"
                    ? { background: "#1d354f", color: "#fff" }
                    : { background: "#d5e2f6", color: "#1d354f" }
                }
                onClick={label !== "Grades" ? () => window.location.assign("/prototypes/course-modules") : undefined}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6">
      <div className="flex flex-col gap-5">

        {/* Metrics + export */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex gap-6 rounded-2xl border border-[var(--border)] bg-white px-6 py-4 shadow-[var(--shadow-card)]">
            {[
              { label: "Ungraded", value: totalUngraded },
              { label: "Missing",  value: totalMissing },
              { label: "At-risk",  value: AT_RISK.length },
            ].map((m, i) => (
              <div key={m.label} className={`flex flex-col items-center gap-0.5 ${i > 0 ? "pl-6 border-l border-[var(--border)]" : ""}`}>
                <span className="text-2xl font-bold text-[#273540]">{m.value}</span>
                <span className="text-xs text-[#576773]">{m.label}</span>
              </div>
            ))}
          </div>
          <Button variant="secondary" size="sm">
            <Download size={14} strokeWidth={1.75} />
            Export
          </Button>
        </div>

        {/* At-risk alert */}
        {AT_RISK.length > 0 && (
          <Alert variant="warning">
            <div className="flex items-center justify-between gap-4 w-full">
              <div>
                <span className="font-semibold">
                  {AT_RISK.length} student{AT_RISK.length !== 1 ? "s" : ""} may need support
                </span>
                <span className="text-sm text-[#576773] ml-2">
                  {AT_RISK.map(s => s.name).join(" and ")} — missing work or scores below 70.
                </span>
              </div>
              <Button variant="secondary" size="sm" className="shrink-0">
                <Send size={14} strokeWidth={1.75} />
                Message students
              </Button>
            </div>
          </Alert>
        )}

        {/* Recent Coursework — Frame 1171276317 (rubrics.pen / Gradebook to-do open) */}
        <div
          className="rounded-2xl flex flex-col"
          style={{ background: "#f9f9f9", border: "1px solid #e8eaec", padding: 16, gap: 16 }}
        >
          <span style={{ fontFamily: "var(--font-heading)", fontSize: 16, fontWeight: 600, color: "#273540" }}>
            Recent Coursework
          </span>
          <div className="grid grid-cols-3 gap-6">
            {ASSIGNMENTS
              .filter(a => a.pastDue && a.needsGradingCount > 0)
              .sort((a, b) => new Date(b.due).getTime() - new Date(a.due).getTime())
              .slice(0, 3)
              .map(assignment => {
                const moduleMap: Record<string, string> = {
                  a1: "Unit 1: Research Foundations", a2: "Unit 1: Research Foundations",
                  a3: "Unit 1: Research Foundations", a4: "Unit 1: Research Foundations",
                  a5: "Unit 1: Research Foundations", a6: "Unit 2: Scientific Methods",
                  a7: "Unit 2: Scientific Methods",   a8: "Unit 2: Scientific Methods",
                  a9: "Unit 2: Scientific Methods",   a10: "Unit 2: Scientific Methods",
                  a11: "Unit 3: Critical Analysis",   a12: "Unit 3: Critical Analysis",
                  a13: "Unit 3: Critical Analysis",   a14: "Unit 3: Critical Analysis",
                  a15: "Unit 3: Critical Analysis",   a16: "Unit 4: Synthesis & Presentation",
                  a17: "Unit 4: Synthesis & Presentation", a18: "Unit 4: Synthesis & Presentation",
                  a19: "Unit 4: Synthesis & Presentation", a20: "Unit 4: Synthesis & Presentation",
                  a21: "Unit 4: Synthesis & Presentation", a22: "Unit 4: Synthesis & Presentation",
                }
                const isQuiz = assignment.name.toLowerCase().includes("quiz")
                const typeLabel = isQuiz ? "Quiz" : assignment.modality === "slides" ? "Presentation" : "Assignment"
                return (
                  <div
                    key={assignment.id}
                    className="flex flex-col rounded-2xl bg-white"
                    style={{ padding: 24, gap: 28, boxShadow: "1px 2px 7px rgba(39,53,64,0.12)", border: "1px solid #e8eaec" }}
                  >
                    <div className="flex flex-col gap-1">
                      <span style={{ fontSize: 13, color: "#576773" }}>
                        {moduleMap[assignment.id] ?? "Unit 4: Synthesis & Presentation"}
                      </span>
                      <span style={{ fontFamily: "var(--font-heading)", fontSize: 18, fontWeight: 600, color: "#09508c", lineHeight: 1.3 }}>
                        {assignment.name}
                      </span>
                    </div>
                    <div className="flex items-end justify-between">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5">
                          <Clock size={14} style={{ color: "#09508c", flexShrink: 0 }} />
                          <span style={{ fontSize: 13, color: "#273540" }}>{assignment.needsGradingCount} need grading</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <FileText size={14} style={{ color: "#09508c", flexShrink: 0 }} />
                          <span style={{ fontSize: 13, color: "#273540" }}>{typeLabel}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} style={{ color: "#09508c", flexShrink: 0 }} />
                          <span style={{ fontSize: 13, color: "#273540" }}>Due {assignment.dueLabel}</span>
                        </div>
                      </div>
                      <button
                        className="flex items-center justify-center rounded-full shrink-0"
                        style={{ width: 40, height: 40, background: "#09508c", border: "none", cursor: "pointer" }}
                      >
                        <ArrowRight size={16} style={{ color: "#ffffff" }} />
                      </button>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search size={16} strokeWidth={1.75} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8d959f] pointer-events-none" />
            <Input
              size="sm"
              placeholder="Search students…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 w-52"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger size="sm" className="w-44" />
            <SelectContent>
              <SelectItem value="name">Sort: Name A–Z</SelectItem>
              <SelectItem value="grade">Sort: Current grade</SelectItem>
              <SelectItem value="risk">Sort: At-risk first</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="primary" size="sm">
            <ChevronRight size={14} strokeWidth={1.75} />
            Grade {totalUngraded} ungraded
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-[var(--border)] bg-white overflow-x-auto shadow-[var(--shadow-card)]">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[var(--border)]" style={{ background: "#f5f7f8" }}>
                <th
                  className="sticky left-0 z-20 px-5 py-3 text-xs font-semibold text-[#8d959f] uppercase tracking-wide border-r border-[var(--border)]"
                  style={{ background: "#f5f7f8", minWidth: 220 }}
                >
                  Student
                </th>
                {ASSIGNMENTS.map(a => (
                  <th key={a.id} className="px-4 py-3" style={{ background: "#f5f7f8", minWidth: 160 }}>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-semibold text-[var(--btn-primary-bg)]">{a.name}</span>
                      <span className="text-xs text-[#8d959f]">{a.dueLabel} · {a.pts} pts</span>
                      {a.pastDue && (
                        <div className="mt-0.5">
                          {a.needsGradingCount > 0
                            ? <Pill color="warning" status={`${a.needsGradingCount} need grading`} />
                            : <Pill color="success" status="All graded" />
                          }
                        </div>
                      )}
                    </div>
                  </th>
                ))}
                <th
                  className="sticky right-0 z-20 px-4 py-3 text-xs font-semibold text-[#8d959f] uppercase tracking-wide text-center"
                  style={{ background: "#f5f7f8", minWidth: 80, boxShadow: "-4px 0 8px rgba(0,0,0,0.06)" }}
                >
                  Grade
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(student => {
                const isAtRisk = AT_RISK.some(s => s.id === student.id)
                const rowBg = isAtRisk ? "#fffbeb" : "#fff"
                return (
                  <tr key={student.id} className="border-b border-[var(--border)]" style={{ background: rowBg }}>
                    <td
                      className="sticky left-0 px-5 py-2.5 border-r border-[var(--border)]"
                      style={{ background: rowBg, minWidth: 220 }}
                    >
                      <div className="flex items-center gap-2">
                        <Avatar initials={initials(student.name)} size="xSmall" inverse />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#273540] leading-tight">{student.name}</p>
                          <div className="mt-0.5">
                            {isAtRisk
                              ? <Pill color="warning" status="At risk" />
                              : <Pill color="success" status="On track" />
                            }
                          </div>
                        </div>
                      </div>
                    </td>
                    {student.cells.map((_, cIdx) => (
                      <td key={cIdx} className="px-4 py-2.5">
                        <ScoreBadge
                          cell={getCell(student, cIdx)}
                          onInfo={() => setInfoTray({ studentId: student.id, assignmentIdx: cIdx })}
                        />
                      </td>
                    ))}
                    <td
                      className="sticky right-0 px-4 py-2.5 text-center"
                      style={{ background: rowBg, minWidth: 80, boxShadow: "-4px 0 8px rgba(0,0,0,0.06)" }}
                    >
                      <span className="font-bold text-lg" style={{ color: GRADE_COLORS[student.currentGrade] ?? "#475569" }}>
                        {student.currentGrade}
                      </span>
                    </td>
                  </tr>
                )
              })}

              {/* Class average row */}
              <tr>
                <td
                  className="sticky left-0 px-5 py-3 border-r border-[var(--border)]"
                  style={{ background: "#f5f7f8", minWidth: 220 }}
                >
                  <span className="text-sm font-semibold text-[#8d959f]">Class Average</span>
                </td>
                {ASSIGNMENTS.map((a, aIdx) => {
                  const gradedCells = STUDENTS
                    .map(s => getCell(s, aIdx))
                    .filter(c => c.status === "graded" && c.score !== undefined)
                  const avg = gradedCells.length > 0
                    ? Math.round(gradedCells.reduce((s, c) => s + c.score!, 0) / gradedCells.length)
                    : null
                  const avgCell: CellData = avg !== null
                    ? { score: avg, max: a.pts, status: "graded" }
                    : { max: a.pts, status: "ungraded" }
                  return (
                    <td key={a.id} className="px-4 py-3" style={{ background: "#f5f7f8" }}>
                      <ScoreBadge cell={avgCell} onInfo={() => {}} />
                    </td>
                  )
                })}
                <td
                  className="sticky right-0 px-4 py-3 text-center"
                  style={{ background: "#f5f7f8", minWidth: 80, boxShadow: "-4px 0 8px rgba(0,0,0,0.06)" }}
                >
                  <span className="font-bold text-sm text-[#576773]">C+</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Legend toggle */}
        <div>
          <button
            type="button"
            className="text-sm text-[var(--btn-primary-bg)] hover:underline outline-none"
            onClick={() => setLegendOpen(v => !v)}
          >
            {legendOpen ? "▾" : "▸"} Score colour legend
          </button>
          {legendOpen && (
            <div className="mt-2 flex flex-wrap gap-4">
              {[
                { bg: "#ECFDF5", color: "#059669", label: "Graded ≥ 70%" },
                { bg: "#FEE2E2", color: "#B91C1C", label: "Graded < 70% / Missing" },
                { bg: "#FEF3C7", color: "#92400E", label: "Late submission" },
                { bg: "#F1F5F9", color: "#475569", label: "Needs grading (submitted)" },
                { bg: "#F8FAFC", color: "#94A3B8", label: "Not submitted" },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <span
                    className="inline-block w-4 h-4 rounded shrink-0"
                    style={{ backgroundColor: item.bg, border: `1px solid ${item.color}44` }}
                  />
                  <span className="text-xs text-[#576773]">{item.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
        </div>
      </div>

      {infoTray && (() => {
        const trayStudent = STUDENTS.find(s => s.id === infoTray.studentId)!
        return (
          <GradeTray
            student={trayStudent}
            assignmentIdx={infoTray.assignmentIdx}
            onClose={() => setInfoTray(null)}
          />
        )
      })()}

    </div>
  )
}
