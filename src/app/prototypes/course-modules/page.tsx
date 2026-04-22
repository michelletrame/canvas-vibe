"use client"

import React from "react"
import { useRouter } from "next/navigation"
import {
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  Inbox,
  LifeBuoy,
  Plus,
  Sparkles,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Lock,
  GripVertical,
  MoreHorizontal,
  Settings,
  Maximize2,
  FileText,
  ClipboardList,
  ClipboardCheck,
  ExternalLink,
  Package,
  Paperclip,
  Heading1,
  Link2,
  MinusCircle,
} from "lucide-react"

// ── Types ─────────────────────────────────────────────────────────────────────

type MenuState = "closed" | "addMenu" | "addNewItem" | "generateItem"
type SetupStep = 1 | 2 | 3 | 4 | 5

// ── Grading Setup Modal ───────────────────────────────────────────────────────

const MODAL_SHADOW = "0 10px 24.5px rgba(0,0,0,0.25), 0 6px 6.125px rgba(0,0,0,0.1)"
const MODAL_BORDER = "1px solid #d7dade"

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      style={{
        width: 40, height: 22, borderRadius: 11, flexShrink: 0,
        background: on ? "#0770a3" : "#c7cdd1",
        position: "relative", border: "none", cursor: "pointer", transition: "background 0.15s",
      }}
    >
      <span style={{
        position: "absolute", top: 3, left: on ? 21 : 3,
        width: 16, height: 16, borderRadius: 8, background: "#fff",
        transition: "left 0.15s",
      }} />
    </button>
  )
}

function ModalBtn({ primary, children, onClick, disabled }: {
  primary?: boolean; children: React.ReactNode; onClick?: () => void; disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "7px 16px", borderRadius: 4, fontSize: 14, fontWeight: 500, cursor: disabled ? "default" : "pointer",
        background: primary ? "#0770a3" : "#fff",
        color: primary ? "#fff" : disabled ? "#9aa5ae" : "#273540",
        border: primary ? "none" : MODAL_BORDER,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {children}
    </button>
  )
}

function ModalShell({ title, children, footer }: {
  title: string; children: React.ReactNode; footer: React.ReactNode
}) {
  return (
    <div style={{
      background: "#fff", borderRadius: 4, width: 672,
      maxHeight: "calc(100vh - 48px)", overflow: "hidden",
      display: "flex", flexDirection: "column", boxShadow: MODAL_SHADOW,
    }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "21px 24px", borderBottom: MODAL_BORDER,
      }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#2d3b45", margin: 0, fontFamily: "var(--font-heading)" }}>
          {title}
        </h2>
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>{children}</div>
      <div style={{
        display: "flex", justifyContent: "flex-end", gap: 8,
        padding: "10px 24px", borderTop: MODAL_BORDER, background: "#f2f4f4",
      }}>
        {footer}
      </div>
    </div>
  )
}

function SectionBox({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ border: MODAL_BORDER, borderRadius: 8, padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
      {children}
    </div>
  )
}

function SelectField({ label, value, options }: { label: string; value: string; options: string[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label style={{ fontSize: 13, color: "#576773" }}>{label}</label>
      <div style={{
        border: MODAL_BORDER, borderRadius: 4, padding: "6px 10px",
        fontSize: 14, color: "#273540", display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span>{value}</span>
        <ChevronDown size={14} style={{ color: "#576773" }} />
      </div>
    </div>
  )
}

function NumberInput({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label style={{ fontSize: 13, color: "#576773" }}>{label}</label>
      <div style={{ border: MODAL_BORDER, borderRadius: 4, padding: "6px 10px", fontSize: 14, color: "#273540" }}>
        {value}
      </div>
    </div>
  )
}

function ToggleRow({ label, description, on, onChange }: {
  label: string; description?: string; on: boolean; onChange: (v: boolean) => void
}) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
      <Toggle on={on} onChange={onChange} />
      <div>
        <div style={{ fontSize: 14, color: "#273540" }}>{label}</div>
        {description && <div style={{ fontSize: 12, color: "#576773", marginTop: 2 }}>{description}</div>}
      </div>
    </div>
  )
}

// Step 1 — Welcome
function StepWelcome() {
  return (
    <div style={{ padding: "24px 24px 32px" }}>
      <p style={{ fontSize: 16, lineHeight: 1.6, color: "#273540", margin: 0 }}>
        Before we get started, we're going to ask you some questions about how you are grading coursework in Canvas.
      </p>
      <p style={{ fontSize: 16, lineHeight: 1.6, color: "#273540", marginTop: 16 }}>
        This will enable a more streamlined, personalized experience in Canvas.
      </p>
      <p style={{ fontSize: 16, lineHeight: 1.6, color: "#273540", marginTop: 16 }}>
        If you change your mind, you can always go to settings to update your answers.
      </p>
    </div>
  )
}

// Step 2 — Grading Approach
const APPROACH_OPTIONS = [
  { id: "traditional",  label: "Traditional Grading",           desc: "Grade is determined by accumulation of points" },
  { id: "outcomes",     label: "Outcomes/Mastery Grading",       desc: "Grade is determined by number of standards/outcomes met" },
  { id: "contract",     label: "Contract/Spec Grading",          desc: "Grade is determined by assignments completed according to terms" },
  { id: "portfolio",    label: "Self-Assessment/Portfolio",       desc: "Grade is determined by assessment of a portfolio of work" },
]

function StepGradingApproach() {
  const [selected, setSelected] = React.useState("traditional")
  return (
    <div style={{ padding: "24px 24px 8px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {APPROACH_OPTIONS.map((opt) => {
          const active = selected === opt.id
          return (
            <button
              key={opt.id}
              onClick={() => setSelected(opt.id)}
              style={{
                textAlign: "left", padding: 0, background: "#fff", cursor: "pointer",
                border: active ? "3px solid #0e68b3" : "1px solid #d7dade",
                borderRadius: 4, overflow: "hidden",
                boxShadow: active ? "0 4px 3.5px rgba(0,0,0,0.25)" : "none",
              }}
            >
              <div style={{ height: 120, background: "#1d354f" }} />
              <div style={{ padding: "10px 12px 14px" }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: active ? "#0e68b3" : "#273540", marginBottom: 4 }}>
                  {opt.label}
                </div>
                <div style={{ fontSize: 12, color: "#576773", lineHeight: 1.4 }}>{opt.desc}</div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// Step 3 — Grading Preferences
type AssignmentGroup = { id: number; name: string; weight: string }

let nextGroupId = 4

function StepGradingPreferences() {
  const [weighted, setWeighted] = React.useState(true)
  const [groups, setGroups] = React.useState<AssignmentGroup[]>([
    { id: 1, name: "Essays",     weight: "34" },
    { id: 2, name: "Attendance", weight: "33" },
    { id: 3, name: "Exams",      weight: "33" },
  ])

  const total = groups.reduce((sum, g) => {
    const n = parseFloat(g.weight)
    return sum + (isNaN(n) ? 0 : n)
  }, 0)
  const diff = Math.round((total - 100) * 10) / 10
  const hasError = weighted && groups.length > 0 && total !== 100

  function updateGroup(id: number, field: keyof AssignmentGroup, value: string) {
    setGroups((gs) => gs.map((g) => g.id === id ? { ...g, [field]: value } : g))
  }

  function addGroup() {
    setGroups((gs) => [...gs, { id: nextGroupId++, name: "", weight: "0" }])
  }

  function deleteGroup(id: number) {
    setGroups((gs) => gs.filter((g) => g.id !== id))
  }

  return (
    <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionBox>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#273540" }}>Grading Preferences</div>
        <SelectField label="Show scores as" value="Percentages" options={["Percentages", "Points", "Letter Grades"]} />
        <ToggleRow label="Weight final grade based on assignment group" on={weighted} onChange={setWeighted} />

        {weighted && (
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {/* Column headers */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 32px", gap: 8, paddingBottom: 6, borderBottom: MODAL_BORDER }}>
              <span style={{ fontSize: 12, color: "#576773" }}>Assignment Group</span>
              <span style={{ fontSize: 12, color: "#576773" }}>Weight</span>
              <span />
            </div>

            {/* Group rows */}
            {groups.map((g) => (
              <div
                key={g.id}
                style={{ display: "grid", gridTemplateColumns: "1fr 120px 32px", gap: 8, alignItems: "center", padding: "8px 0", borderBottom: MODAL_BORDER }}
              >
                <input
                  value={g.name}
                  onChange={(e) => updateGroup(g.id, "name", e.target.value)}
                  placeholder="Group name"
                  style={{
                    border: MODAL_BORDER, borderRadius: 4, padding: "5px 10px",
                    fontSize: 14, color: "#273540", outline: "none", width: "100%", boxSizing: "border-box",
                  }}
                />
                <div style={{
                  border: MODAL_BORDER, borderRadius: 4, padding: "5px 10px",
                  display: "flex", alignItems: "center", gap: 4,
                }}>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={g.weight}
                    onChange={(e) => updateGroup(g.id, "weight", e.target.value)}
                    style={{
                      border: "none", outline: "none", width: "100%",
                      fontSize: 14, color: "#273540", background: "transparent",
                    }}
                  />
                  <span style={{ fontSize: 14, color: "#576773", flexShrink: 0 }}>%</span>
                </div>
                <button
                  onClick={() => deleteGroup(g.id)}
                  title="Remove group"
                  style={{
                    width: 28, height: 28, borderRadius: 4, border: MODAL_BORDER,
                    background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#576773", fontSize: 16, lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </div>
            ))}

            {/* Total row */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 120px 32px", gap: 8, alignItems: "center",
              padding: "8px 0", borderBottom: hasError ? "none" : MODAL_BORDER,
            }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#273540" }}>Total</span>
              <div style={{
                border: `1px solid ${hasError ? "#c54040" : "#d7dade"}`,
                borderRadius: 4, padding: "5px 10px",
                display: "flex", alignItems: "center", gap: 4,
                background: hasError ? "#fff5f5" : "#f9f9f9",
              }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: hasError ? "#c54040" : "#273540", width: "100%" }}>
                  {total}
                </span>
                <span style={{ fontSize: 14, color: hasError ? "#c54040" : "#576773", flexShrink: 0 }}>%</span>
              </div>
              <span />
            </div>

            {/* Error message */}
            {hasError && (
              <div style={{
                marginTop: 8, padding: "8px 12px", borderRadius: 4,
                background: "#fff5f5", border: "1px solid #f5c5c5",
                fontSize: 13, color: "#c54040", lineHeight: 1.4,
              }}>
                {diff > 0
                  ? `Weights are ${diff}% over 100. Reduce by ${diff}% to balance.`
                  : `Weights are ${Math.abs(diff)}% under 100. Add ${Math.abs(diff)}% to reach 100%.`}
              </div>
            )}

            {/* Add group button */}
            <button
              onClick={addGroup}
              style={{
                marginTop: 12, display: "flex", alignItems: "center", gap: 6,
                background: "none", border: "none", cursor: "pointer",
                fontSize: 14, color: "#0770a3", padding: 0, fontWeight: 500,
              }}
            >
              <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Add assignment group
            </button>
          </div>
        )}
      </SectionBox>
    </div>
  )
}

// Step 4 — Grading Defaults
function StepGradingDefaults() {
  const [autoDeduct, setAutoDeduct] = React.useState(true)
  const [manualPost, setManualPost] = React.useState(true)
  return (
    <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionBox>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#273540" }}>Submissions</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <SelectField label="Submissions before due date" value="Unlimited" options={["Unlimited", "1", "2", "3"]} />
          <SelectField label="Number of attempts" value="1" options={["1", "2", "3", "Unlimited"]} />
          <SelectField label="Resubmission with revisions" value="Allowed" options={["Allowed", "Not allowed"]} />
          <SelectField label="Regrade after resubmission" value="Yes" options={["Yes", "No"]} />
        </div>
      </SectionBox>
      <SectionBox>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#273540" }}>Late Policy</div>
        <ToggleRow label="Automatically deduct points from late submissions" on={autoDeduct} onChange={setAutoDeduct} />
        {autoDeduct && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <NumberInput label="Deduction %" value="10" />
            <SelectField label="Deduction interval" value="Day" options={["Day", "Hour"]} />
            <NumberInput label="Lowest possible grade %" value="50" />
          </div>
        )}
      </SectionBox>
      <SectionBox>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#273540" }}>Grade Posting</div>
        <ToggleRow label="Manually post grades" on={manualPost} onChange={setManualPost} />
      </SectionBox>
    </div>
  )
}

// Step 5 — Settings and Feature Options
function StepSettings() {
  const [rubrics, setRubrics] = React.useState(true)
  const [stickers, setStickers] = React.useState(false)
  const [anonymize, setAnonymize] = React.useState(false)
  const [hideTotals, setHideTotals] = React.useState(true)
  const [speedgrader, setSpeedgrader] = React.useState(true)
  return (
    <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionBox>
        <div style={{ fontSize: 13, color: "#576773" }}>Grading settings required by your institution</div>
        <ToggleRow label="Enhanced Rubrics" on={rubrics} onChange={setRubrics} />
      </SectionBox>
      <SectionBox>
        <div style={{ fontSize: 13, color: "#576773" }}>Optional</div>
        <ToggleRow
          label="Submission Stickers"
          description="Add whimsical reward stickers to grading"
          on={stickers} onChange={setStickers}
        />
        <ToggleRow
          label="Anonymize Instructor Annotations"
          description="Do not identify graders by name in grading annotations"
          on={anonymize} onChange={setAnonymize}
        />
        <ToggleRow
          label="Hide grade totals in student grade summary"
          description="Students will only see grades for coursework and won't see an overall course grade"
          on={hideTotals} onChange={setHideTotals}
        />
        <ToggleRow
          label="Performance and usability upgrades for Speedgrader"
          description="Enable the latest version of Speedgrader"
          on={speedgrader} onChange={setSpeedgrader}
        />
      </SectionBox>
    </div>
  )
}

const STEP_TITLES: Record<SetupStep, string> = {
  1: "Welcome",
  2: "Grading Approach",
  3: "Grading Preferences",
  4: "Grading Defaults",
  5: "Settings and Feature Options",
}

function GradingSetupModal({ step, onNext, onBack, onDone }: {
  step: SetupStep; onNext: () => void; onBack: () => void; onDone: () => void
}) {
  return (
    <ModalShell
      title={STEP_TITLES[step]}
      footer={
        <>
          <ModalBtn onClick={onBack} disabled={step === 1}>Back</ModalBtn>
          {step < 5
            ? <ModalBtn primary onClick={onNext}>Next</ModalBtn>
            : <ModalBtn primary onClick={onDone}>Save</ModalBtn>
          }
        </>
      }
    >
      {step === 1 && <StepWelcome />}
      {step === 2 && <StepGradingApproach />}
      {step === 3 && <StepGradingPreferences />}
      {step === 4 && <StepGradingDefaults />}
      {step === 5 && <StepSettings />}
    </ModalShell>
  )
}

// ── Data ──────────────────────────────────────────────────────────────────────

const MODULE_ITEMS = [
  { id: "1", title: "Defining AI Ethics: Core Principles",                  type: "page"       },
  { id: "2", title: "Algorithmic Bias: Identification and Mitigation",      type: "assignment" },
  { id: "3", title: "Case Study: Ethical Dilemmas in Autonomous Systems",   type: "page"       },
  { id: "4", title: "Data Privacy and AI: Regulations and Best Practices",  type: "assignment" },
  { id: "5", title: "The Role of AI in Surveillance: Ethical Boundaries",   type: "page"       },
  { id: "6", title: "Group Project: Developing an AI Ethics Framework",     type: "assignment" },
  { id: "7", title: "Personal Reflection: AI Ethics in My Field",           type: "page"       },
]

const ADD_MENU_ITEMS = [
  { id: "addNewItem",    label: "Add new item",              icon: Plus,         hasArrow: true,  ai: false },
  { id: "generateItem",  label: "Generate item",             icon: Sparkles,     hasArrow: true,  ai: true  },
  { id: "contentIndex",  label: "Add from Content Index",    icon: FileText,     hasArrow: false, ai: false },
  { id: "syncable",      label: "Add from Syncable Objects", icon: Package,      hasArrow: false, ai: false },
  { id: "scorm",         label: "Add from SCORM",            icon: Paperclip,    hasArrow: false, ai: false },
]

const ADD_NEW_ITEM_TYPES = [
  { id: "textHeader",    label: "Text header",   icon: Heading1,      bg: "#e8eaec", color: "#273540" },
  { id: "page",          label: "Page",          icon: FileText,      bg: "#e8f0f8", color: "#2b7abc" },
  { id: "assignment",    label: "Assignment",    icon: ClipboardList, bg: "#fce8e8", color: "#c54396" },
  { id: "assessment",    label: "Assessment",    icon: ClipboardCheck,bg: "#e8f5e9", color: "#037d37" },
  { id: "externalLink",  label: "External link", icon: Link2,         bg: "#fff3e0", color: "#996e00" },
  { id: "externalTool",  label: "External tool", icon: ExternalLink,  bg: "#f3e5f7", color: "#944fb3" },
  { id: "file",          label: "File",          icon: Paperclip,     bg: "#e8f0f8", color: "#2b7abc" },
]

const GENERATE_ITEM_TYPES = [
  { id: "page",       label: "Page",       icon: FileText      },
  { id: "assignment", label: "Assignment", icon: ClipboardList },
]

// ── Global Nav ────────────────────────────────────────────────────────────────

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

// ── Add Menu dropdown ─────────────────────────────────────────────────────────

const DROPDOWN_STYLE: React.CSSProperties = {
  background: "#fff",
  borderRadius: 16,
  border: "1px solid #6a7883",
  boxShadow: "0 2px 7.875px 1px rgba(39,53,64,0.07)",
  overflow: "hidden",
}

function AddMenuPanel({
  activeItem,
  onHover,
  onClose,
}: {
  activeItem: string | null
  onHover: (id: string | null) => void
  onClose: () => void
}) {
  return (
    <div style={{ ...DROPDOWN_STYLE, width: 274, padding: "6px 0" }}>
      {ADD_MENU_ITEMS.map((item) => {
        const Icon = item.icon
        const highlighted = item.id === activeItem
        return (
          <button
            key={item.id}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left transition-colors"
            style={{
              color: item.ai ? "#944fb3" : "#273540",
              background: highlighted ? "#f2f4f4" : "transparent",
            }}
            onMouseEnter={() => onHover(item.hasArrow ? item.id : null)}
            onClick={() => { if (!item.hasArrow) onClose() }}
          >
            <Icon size={15} style={{ flexShrink: 0, color: item.ai ? "#944fb3" : "#4a5b68" }} />
            <span className="flex-1">{item.label}</span>
            {item.hasArrow && <ChevronRight size={13} style={{ color: "#8d959f" }} />}
          </button>
        )
      })}
    </div>
  )
}

function AddNewItemPanel({ onBack, onClose, onAssignment }: { onBack: () => void; onClose: () => void; onAssignment: () => void }) {
  return (
    <div style={{ ...DROPDOWN_STYLE, width: 225 }}>
      <div className="px-2 pt-2 pb-1">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 w-full px-2 py-2 rounded-xl text-sm hover:bg-gray-50 transition-colors"
          style={{ color: "#273540" }}
        >
          <ChevronLeft size={15} />
          Back
        </button>
      </div>
      <div className="mx-2" style={{ height: 1, background: "#e8eaec" }} />
      <div className="p-2 flex flex-col gap-0.5">
        {ADD_NEW_ITEM_TYPES.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              className="flex items-center gap-2.5 w-full px-2 py-1.5 rounded-xl text-sm hover:bg-gray-50 transition-colors text-left"
              style={{ color: "#273540" }}
              onClick={item.id === "assignment" ? onAssignment : onClose}
            >
              <div
                className="flex items-center justify-center rounded-lg flex-shrink-0"
                style={{ width: 28, height: 28, background: item.bg }}
              >
                <Icon size={14} style={{ color: item.color }} />
              </div>
              {item.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function GenerateItemPanel({ onBack, onClose }: { onBack: () => void; onClose: () => void }) {
  return (
    <div style={{ ...DROPDOWN_STYLE, width: 225 }}>
      <div className="px-2 pt-2 pb-1">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 w-full px-2 py-2 rounded-xl text-sm hover:bg-gray-50 transition-colors"
          style={{ color: "#273540" }}
        >
          <ChevronLeft size={15} />
          Back
        </button>
      </div>
      <div className="mx-2" style={{ height: 1, background: "#e8eaec" }} />
      <div className="p-2 flex flex-col gap-0.5">
        {GENERATE_ITEM_TYPES.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              className="flex items-center gap-2.5 w-full px-2 py-1.5 rounded-xl text-sm hover:bg-gray-50 transition-colors text-left"
              style={{ color: "#273540" }}
              onClick={onClose}
            >
              <div
                className="flex items-center justify-center rounded-lg flex-shrink-0"
                style={{
                  width: 28,
                  height: 28,
                  background: "linear-gradient(195deg, #944fb3, #027887)",
                }}
              >
                <Icon size={14} style={{ color: "#fff" }} />
              </div>
              {item.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// Each item in the Add Menu is ~40px tall; padding-top is 6px.
// "Add new item" = item 0, y-offset ≈ 0
// "Generate item" = item 1, y-offset ≈ 40px
const SUBMENU_OFFSETS: Record<string, number> = {
  addNewItem:   0,
  generateItem: 40,
}

function MenuOverlay({
  menuState,
  onClose,
  onChange,
  onAssignment,
}: {
  menuState: Exclude<MenuState, "closed">
  onClose: () => void
  onChange: (s: MenuState) => void
  onAssignment: () => void
}) {
  // Track which Add Menu item is highlighted (for hover-to-open submenu)
  const activeItem =
    menuState === "addNewItem"   ? "addNewItem"   :
    menuState === "generateItem" ? "generateItem" : null

  function handleHover(id: string | null) {
    if (id === "addNewItem")   onChange("addNewItem")
    if (id === "generateItem") onChange("generateItem")
    if (id === null)           onChange("addMenu")
  }

  return (
    <div className="flex items-start gap-1">
      {/* Submenu panel */}
      {menuState === "addNewItem" && (
        <div style={{ marginTop: SUBMENU_OFFSETS.addNewItem }}>
          <AddNewItemPanel onBack={() => onChange("addMenu")} onClose={onClose} onAssignment={onAssignment} />
        </div>
      )}
      {menuState === "generateItem" && (
        <div style={{ marginTop: SUBMENU_OFFSETS.generateItem }}>
          <GenerateItemPanel onBack={() => onChange("addMenu")} onClose={onClose} />
        </div>
      )}

      {/* Primary Add Menu */}
      <AddMenuPanel activeItem={activeItem} onHover={handleHover} onClose={onClose} />
    </div>
  )
}

// ── Module item ───────────────────────────────────────────────────────────────

function ModuleItem({ title, type, last }: { title: string; type: string; last?: boolean }) {
  const isAssignment = type === "assignment"
  const Icon = isAssignment ? ClipboardList : FileText
  const iconBg    = isAssignment ? "#fce8e8" : "#e8f0f8"
  const iconColor = isAssignment ? "#c54396" : "#2b7abc"

  return (
    <div
      className="flex items-center gap-2.5 px-4 py-2.5"
      style={{ borderBottom: last ? "none" : "1px solid #e8eaec" }}
    >
      <GripVertical size={15} style={{ color: "#c7cacd", flexShrink: 0 }} />
      <div
        className="flex items-center justify-center rounded-lg flex-shrink-0"
        style={{ width: 28, height: 28, background: iconBg }}
      >
        <Icon size={14} style={{ color: iconColor }} />
      </div>
      <span className="flex-1 text-sm" style={{ color: "#273540" }}>{title}</span>
      <span
        className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
        style={{ background: "#e8eaec", color: "#586874" }}
      >
        Optional
      </span>
      <button
        className="flex-shrink-0 p-1 rounded-lg hover:bg-gray-100 transition-colors"
        title="Remove"
      >
        <MinusCircle size={15} style={{ color: "#8d959f" }} />
      </button>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CourseModulesPage() {
  const router = useRouter()
  const [menuState, setMenuState] = React.useState<MenuState>("closed")
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [setupStep, setSetupStep] = React.useState<SetupStep | null>(1)

  // Close menu when clicking outside
  React.useEffect(() => {
    if (menuState === "closed") return
    function handlePointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setMenuState("closed")
      }
    }
    document.addEventListener("pointerdown", handlePointerDown)
    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [menuState])

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
            <button
              className="flex items-center justify-center flex-shrink-0"
              style={{ width: 32, height: 32, background: "#1d354f", borderRadius: 12 }}
              title="Course options"
            >
              <Plus size={16} color="#fff" />
            </button>
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
            {["Grades", "People", "Outcomes", "Apps"].map((label) => (
              <button
                key={label}
                className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-xl transition-colors hover:brightness-95"
                style={{ background: "#d5e2f6", color: "#1d354f" }}
                onClick={label === "Grades" ? () => window.location.assign("/prototypes/gradebook") : undefined}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">

          {/* Tabs card */}
          <div
            className="rounded-2xl flex-shrink-0 overflow-hidden"
            style={{
              background: "#fff",
              boxShadow: "0 1px 2px rgba(35,68,101,0.1), 0 2px 3.5px rgba(35,68,101,0.1)",
            }}
          >
            <div className="flex items-stretch" style={{ height: 52 }}>
              <button
                className="relative flex items-center px-5 text-sm font-medium"
                style={{ color: "#273540" }}
              >
                Modules
                <div
                  className="absolute bottom-0 left-4 right-4"
                  style={{ height: 4, background: "#334450", borderRadius: "2px 2px 0 0" }}
                />
              </button>
              <button
                className="flex items-center px-5 text-sm"
                style={{ color: "#586874" }}
              >
                Course details
              </button>
            </div>
          </div>

          {/* Module group card */}
          <div
            className="rounded-2xl overflow-visible flex-shrink-0"
            style={{
              background: "#fff",
              boxShadow: "0 1px 2px rgba(35,68,101,0.1), 0 2px 3.5px rgba(35,68,101,0.1)",
              borderRadius: 16,
            }}
          >
            {/* Module header (grey) — menu anchor */}
            <div
              ref={containerRef}
              className="relative px-4 py-3"
              style={{ background: "#586874", borderRadius: "16px 16px 0 0" }}
            >
              <div className="flex items-center justify-between">
                {/* Left: expand + lock + title */}
                <div className="flex items-center gap-2">
                  <button className="p-1 rounded-lg hover:bg-white/10 transition-colors">
                    <ChevronDown size={18} style={{ color: "rgba(255,255,255,0.85)" }} />
                  </button>
                  <Lock size={13} style={{ color: "rgba(255,255,255,0.55)" }} />
                  <span className="text-sm font-semibold" style={{ color: "#fff" }}>
                    AI Ethics: An Overview
                  </span>
                </div>

                {/* Right: action buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-sm font-medium transition-colors hover:bg-white/15"
                    style={{ color: "rgba(255,255,255,0.9)" }}
                    onPointerDown={(e) => {
                      e.stopPropagation()
                      setMenuState((s) => (s === "closed" ? "addMenu" : "closed"))
                    }}
                  >
                    <Plus size={14} />
                  </button>
                  <button
                    className="flex items-center justify-center w-7 h-7 rounded-lg hover:bg-white/15 transition-colors"
                    title="Module settings"
                  >
                    <Settings size={14} style={{ color: "rgba(255,255,255,0.8)" }} />
                  </button>
                  <button
                    className="flex items-center justify-center w-7 h-7 rounded-lg hover:bg-white/15 transition-colors"
                    title="More options"
                  >
                    <MoreHorizontal size={14} style={{ color: "rgba(255,255,255,0.8)" }} />
                  </button>
                  <button
                    className="flex items-center justify-center w-7 h-7 rounded-lg hover:bg-white/15 transition-colors"
                    title="Expand all"
                  >
                    <Maximize2 size={13} style={{ color: "rgba(255,255,255,0.8)" }} />
                  </button>
                </div>
              </div>

              {/* Sub-info row */}
              <div className="flex items-center gap-1.5 mt-1 pl-8">
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.65)" }}>
                  7 items
                </span>
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>·</span>
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.65)" }}>
                  Start with any module to begin
                </span>
              </div>

              {/* Dropdown overlay */}
              {menuState !== "closed" && (
                <div className="absolute right-4 top-full mt-1 z-50">
                  <MenuOverlay
                    menuState={menuState}
                    onClose={() => setMenuState("closed")}
                    onChange={setMenuState}
                    onAssignment={() => { setMenuState("closed"); router.push("/prototypes/edit-assignment") }}
                  />
                </div>
              )}
            </div>

            {/* Module items */}
            <div>
              {MODULE_ITEMS.map((item, i) => (
                <ModuleItem
                  key={item.id}
                  title={item.title}
                  type={item.type}
                  last={i === MODULE_ITEMS.length - 1}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grading setup modal overlay */}
      {setupStep !== null && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "rgba(0,0,0,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <GradingSetupModal
            step={setupStep}
            onNext={() => setSetupStep((s) => Math.min((s ?? 1) + 1, 5) as SetupStep)}
            onBack={() => setSetupStep((s) => Math.max((s ?? 1) - 1, 1) as SetupStep)}
            onDone={() => setSetupStep(null)}
          />
        </div>
      )}
    </div>
  )
}
