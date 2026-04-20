"use client"

import React from "react"
import { BookOpen, Check, Copy, RotateCcw, ChevronDown, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/ui/form-field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { CheckboxItem } from "@/components/ui/checkbox"
import { NumberInput } from "@/components/ui/number-input"
import { DateTimeInput } from "@/components/ui/date-time-input"
import { FileDrop } from "@/components/ui/file-drop"
import {
  CATEGORIES,
  ACTIONS,
  TERM_OPTIONS,
  COURSE_OPTIONS,
  getActionsByCategory,
  generatePrompt,
  getDefaultFormData,
  type CategoryConfig,
  type ActionConfig,
  type FieldConfig,
} from "./config"

// ── Color maps (bg at palette-10, fg at palette-100) ─────────────────────────
// Colors assigned to avoid similar hues adjacent in the 2-column grid.

const CATEGORY_COLORS: Record<string, { bg: string; fg: string }> = {
  "create":             { bg: "#e0ebf5", fg: "#0a5a9e" }, // blue
  "manage":             { bg: "#f5e9ca", fg: "#745300" }, // amber
  "student-management": { bg: "#f1e6f5", fg: "#7f399e" }, // purple
  "course-analysis":    { bg: "#dceee4", fg: "#02672d" }, // green
}

const ACTION_COLORS: Record<string, { bg: string; fg: string }> = {
  // Create in Canvas — row0: blue|magenta  row1: orange|teal  row2: purple|amber
  "create-course":                   { bg: "#e0ebf5", fg: "#0a5a9e" }, // blue
  "create-assignment":               { bg: "#f7e5f0", fg: "#a31c73" }, // magenta
  "create-quiz":                     { bg: "#fce5d9", fg: "#9c3800" }, // orange
  "create-module":                   { bg: "#daeeef", fg: "#00626b" }, // teal
  "create-page":                     { bg: "#f1e6f5", fg: "#7f399e" }, // purple
  "create-announcement":             { bg: "#f5e9ca", fg: "#745300" }, // amber
  // Manage & Report — row0: red|green  row1: steel-blue|orange
  "list-assignments":                { bg: "#fce4e5", fg: "#ae1b1f" }, // red
  "list-modules":                    { bg: "#dceee4", fg: "#02672d" }, // green
  "get-module-items":                { bg: "#ddecf3", fg: "#135f81" }, // steel blue
  "update-due-date":                 { bg: "#fce5d9", fg: "#9c3800" }, // orange
  // Student Management — row0: blue|red  row1: amber|teal-green  row2: magenta|steel-blue  row3: green
  "send-message-to-students":        { bg: "#e0ebf5", fg: "#0a5a9e" }, // blue
  "find-students-not-logged-in":     { bg: "#fce4e5", fg: "#ae1b1f" }, // red
  "find-students-incomplete-module": { bg: "#f5e9ca", fg: "#745300" }, // amber
  "find-students-by-grade":          { bg: "#daeee8", fg: "#036549" }, // teal-green
  "find-low-engagement":             { bg: "#f7e5f0", fg: "#a31c73" }, // magenta
  "list-missing-submissions":        { bg: "#ddecf3", fg: "#135f81" }, // steel blue
  "get-assignment-submissions":      { bg: "#dceee4", fg: "#02672d" }, // green
  // Course Analysis — row0: orange|purple  row1: teal
  "analyze-design-features":         { bg: "#fce5d9", fg: "#9c3800" }, // orange
  "evaluate-backward-design":        { bg: "#f1e6f5", fg: "#7f399e" }, // purple
  "get-design-tips":                 { bg: "#daeeef", fg: "#00626b" }, // teal
}

// ── Step 1: Category grid ──────────────────────────────────────────────────────

function CategoryGrid({
  onSelect,
}: {
  onSelect: (category: CategoryConfig) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {CATEGORIES.map((cat) => {
        const Icon = cat.icon
        const colors = CATEGORY_COLORS[cat.id]
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelect(cat)}
            className={cn(
              "flex flex-col items-start gap-3 p-5 rounded-2xl text-left",
              "border border-[var(--color-stroke-muted)] bg-white",
              "hover:border-[var(--btn-primary-bg)] hover:bg-[var(--muted)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-info)]",
              "transition-colors",
            )}
          >
            <div className="p-2 rounded-xl" style={{ backgroundColor: colors?.bg ?? "var(--muted)" }}>
              <Icon
                className="w-5 h-5"
                style={{ color: colors?.fg ?? "var(--btn-primary-bg)" }}
                strokeWidth={1.5}
              />
            </div>
            <div>
              <p
                className="font-bold leading-snug"
                style={{ fontFamily: "var(--font-heading)", fontSize: 16, color: "var(--foreground)" }}
              >
                {cat.label}
              </p>
              <p className="text-sm leading-snug mt-1" style={{ color: "var(--color-text-muted)" }}>
                {cat.description}
              </p>
            </div>
          </button>
        )
      })}
    </div>
  )
}

// ── Step 2: Actions list ───────────────────────────────────────────────────────

function ActionsList({
  category,
  onSelect,
}: {
  category: CategoryConfig
  onSelect: (action: ActionConfig) => void
}) {
  const actions = getActionsByCategory(category.id)
  return (
    <div className="grid grid-cols-2 gap-2">
      {actions.map((action) => {
        const Icon = action.icon as LucideIcon
        return (
          <button
            key={action.id}
            type="button"
            onClick={() => onSelect(action)}
            className={cn(
              "flex items-center gap-4 text-left p-4 rounded-2xl w-full",
              "border border-[var(--color-stroke-muted)] bg-white",
              "hover:border-[var(--btn-primary-bg)] hover:bg-[var(--muted)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-info)]",
              "transition-colors",
            )}
          >
            <div
              className="p-2 rounded-xl shrink-0"
              style={{ backgroundColor: ACTION_COLORS[action.id]?.bg ?? "var(--muted)" }}
            >
              <Icon
                className="w-5 h-5"
                style={{ color: ACTION_COLORS[action.id]?.fg ?? "var(--btn-primary-bg)" }}
                strokeWidth={1.5}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="font-bold leading-snug"
                style={{ fontFamily: "var(--font-heading)", fontSize: 16, color: "var(--foreground)" }}
              >
                {action.label}
              </p>
              <p className="text-sm leading-snug mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                {action.description}
              </p>
            </div>
          </button>
        )
      })}
    </div>
  )
}

// ── Field input renderer ───────────────────────────────────────────────────────

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FieldConfig
  value: unknown
  onChange: (val: unknown) => void
}) {
  const { type, placeholder } = field

  if (type === "textarea") {
    return (
      <Textarea
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={field.rows ?? 3}
      />
    )
  }

  if (type === "select" || type === "term-select" || type === "course-select") {
    const options =
      type === "term-select"   ? TERM_OPTIONS :
      type === "course-select" ? COURSE_OPTIONS :
      (field.options ?? [])
    return (
      <Select
        value={String(value ?? "")}
        onValueChange={(v) => onChange(v)}
      >
        <SelectTrigger placeholder={placeholder ?? "Select an option"} />
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value || "__empty__"}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  if (type === "number") {
    return (
      <NumberInput
        value={value !== undefined && value !== "" ? Number(value) : undefined}
        onValueChange={(n) => onChange(n)}
        min={field.min}
        max={field.max}
        placeholder={placeholder}
      />
    )
  }

  if (type === "file-upload") {
    return (
      <FileDrop
        onFilesSelected={(files) => onChange(files[0]?.name ?? "")}
        accept={field.accept}
        title="Drop file here"
        subtitle="Drag and drop, or click to browse"
      />
    )
  }

  // text (default)
  return (
    <Input
      type="text"
      value={String(value ?? "")}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  )
}

// ── Single field (with conditional + checkbox special-case) ───────────────────

function SingleField({
  field,
  formData,
  onChange,
}: {
  field: FieldConfig
  formData: Record<string, unknown>
  onChange: (name: string, val: unknown) => void
}) {
  // Conditional: hide unless parent condition is met
  if (field.conditional) {
    const parentVal = formData[field.conditional.field]
    const expected = field.conditional.value
    const match =
      typeof expected === "boolean"
        ? Boolean(parentVal) === expected
        : String(parentVal) === String(expected)
    if (!match) return null
  }

  const value = formData[field.name]

  if (field.type === "checkbox") {
    return (
      <CheckboxItem
        label={field.label}
        description={field.helpText}
        checked={Boolean(value)}
        onCheckedChange={(checked) => onChange(field.name, checked === true)}
      />
    )
  }

  if (field.type === "datetime-local") {
    const strVal  = String(value ?? "")
    const [datePart = "", timePart = ""] = strVal.split("T")
    // Use noon to avoid UTC-offset midnight rollovers
    const dateObj = datePart ? new Date(`${datePart}T12:00:00`) : undefined
    return (
      <DateTimeInput
        label={field.label}
        required={field.required}
        hint={field.helpText}
        date={dateObj}
        onDateChange={(d) => {
          if (!d) { onChange(field.name, ""); return }
          const y  = d.getFullYear()
          const mo = String(d.getMonth() + 1).padStart(2, "0")
          const dy = String(d.getDate()).padStart(2, "0")
          onChange(field.name, `${y}-${mo}-${dy}T${timePart || "00:00"}`)
        }}
        time={timePart}
        onTimeChange={(t) => onChange(field.name, datePart ? `${datePart}T${t}` : "")}
      />
    )
  }

  return (
    <FormField label={field.label} required={field.required} hint={field.helpText}>
      <FieldInput
        field={field}
        value={value}
        onChange={(val) => onChange(field.name, val)}
      />
    </FormField>
  )
}

// ── Course selector ────────────────────────────────────────────────────────────

function CourseSelector({
  termValue,
  courseValue,
  onTermChange,
  onCourseChange,
  currentTerm,
  currentCourse,
  hasCourseName,
}: {
  termValue: string
  courseValue: string
  onTermChange: (v: string) => void
  onCourseChange: (v: string) => void
  currentTerm: string
  currentCourse: string
  hasCourseName: boolean
}) {
  const [expanded, setExpanded] = React.useState(false)

  const termLabel  = TERM_OPTIONS.find(o => o.value === termValue)?.label   ?? termValue
  const courseLabel = COURSE_OPTIONS.find(o => o.value === courseValue)?.label ?? courseValue

  function handleReset() {
    onTermChange(currentTerm)
    onCourseChange(currentCourse)
    setExpanded(false)
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: "1px solid var(--color-stroke-muted)" }}
    >
      {/* Summary row */}
      <div
        className="flex items-center gap-2 px-3 py-2"
        style={{ backgroundColor: "var(--muted)" }}
      >
        <BookOpen
          size={15}
          strokeWidth={1.5}
          className="shrink-0"
          style={{ color: "var(--color-text-muted)" }}
        />
        <span className="flex-1 min-w-0 flex items-center gap-1.5 text-sm">
          <span className="font-semibold" style={{ color: "var(--foreground)" }}>
            {courseLabel || "No course selected"}
          </span>
          {termLabel && (
            <>
              <span style={{ color: "var(--color-text-muted)" }}>·</span>
              <span style={{ color: "var(--color-text-muted)" }}>{termLabel}</span>
            </>
          )}
        </span>
        <button
          type="button"
          onClick={() => expanded ? handleReset() : setExpanded(true)}
          className="shrink-0 text-sm font-medium focus-visible:outline-none"
          style={{ color: "var(--btn-primary-bg)" }}
        >
          {expanded ? "Reset" : "Change course"}
        </button>
      </div>

      {/* Expanded selects */}
      {expanded && (
        <div
          className={cn("px-3 pt-2 pb-3", hasCourseName ? "grid grid-cols-2 gap-2" : "flex")}
          style={{ borderTop: "1px solid var(--color-stroke-muted)" }}
        >
          <Select value={termValue} onValueChange={onTermChange}>
            <SelectTrigger size="sm" placeholder="Term" />
            <SelectContent>
              {TERM_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasCourseName && (
            <Select value={courseValue} onValueChange={onCourseChange}>
              <SelectTrigger size="sm" placeholder="Course" />
              <SelectContent>
                {COURSE_OPTIONS.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}
    </div>
  )
}

// ── Step 3: Dynamic form ───────────────────────────────────────────────────────

function DynamicForm({
  action,
  formData,
  onChange,
  currentCourse,
  currentTerm,
}: {
  action: ActionConfig
  formData: Record<string, unknown>
  onChange: (name: string, val: unknown) => void
  currentCourse: string
  currentTerm: string
}) {
  const [advancedOpen, setAdvancedOpen] = React.useState(false)

  const hasTermField   = action.fields.some(f => f.name === "term")
  const hasCourseField = action.fields.some(f => f.name === "courseName")
  const courseFieldNames = new Set(["term", "courseName"])

  const mainFields     = action.fields.filter(f => !f.advanced && !courseFieldNames.has(f.name))
  const advancedFields = action.fields.filter(f =>  f.advanced && !courseFieldNames.has(f.name))

  function fieldIsVisible(field: FieldConfig): boolean {
    if (!field.conditional) return true
    const parentVal = formData[field.conditional.field]
    const expected = field.conditional.value
    return typeof expected === "boolean"
      ? Boolean(parentVal) === expected
      : String(parentVal) === String(expected)
  }

  function getColSpan(field: FieldConfig): string {
    if (field.type === "textarea" || field.type === "checkbox" || field.type === "file-upload" || field.type === "datetime-local") return "col-span-2"
    return field.colSpan === 2 ? "col-span-2" : "col-span-1"
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {hasTermField && (
        <div className="col-span-2">
          <CourseSelector
            termValue={String(formData.term ?? "")}
            courseValue={String(formData.courseName ?? "")}
            onTermChange={(v) => onChange("term", v)}
            onCourseChange={(v) => onChange("courseName", v)}
            currentTerm={currentTerm}
            currentCourse={currentCourse}
            hasCourseName={hasCourseField}
          />
        </div>
      )}
      {mainFields.filter(f => fieldIsVisible(f)).map((field) => (
        <div key={field.name} className={getColSpan(field)}>
          <SingleField
            field={field}
            formData={formData}
            onChange={onChange}
          />
        </div>
      ))}

      {advancedFields.length > 0 && (
        <div className="col-span-2 rounded-xl border border-[var(--color-stroke-muted)] overflow-hidden">
          <button
            type="button"
            onClick={() => setAdvancedOpen((v) => !v)}
            className={cn(
              "w-full flex items-center justify-between px-4 py-3 text-left",
              "text-sm font-semibold text-[var(--color-text-muted)]",
              "hover:bg-[var(--muted)] transition-colors",
            )}
          >
            Advanced options
            <ChevronDown
              size={16}
              strokeWidth={1.5}
              className={cn("transition-transform duration-200", advancedOpen && "rotate-180")}
            />
          </button>
          {advancedOpen && (
            <div className="grid grid-cols-2 gap-4 px-4 pb-4 pt-2 border-t border-[var(--color-stroke-muted)]">
              {advancedFields.filter(f => fieldIsVisible(f)).map((field) => (
                <div key={field.name} className={getColSpan(field)}>
                  <SingleField
                    field={field}
                    formData={formData}
                    onChange={onChange}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Step 3: Refine ─────────────────────────────────────────────────────────────

function PromptResult({
  value,
  onChange,
}: {
  value: string
  onChange: (val: string) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
        Review and edit your prompt, then add it to the IgniteAI Agent input or save it for later.
      </p>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={12}
        className="resize-y"
      />
    </div>
  )
}

// ── Main modal ─────────────────────────────────────────────────────────────────

export function PromptBuilderModal({
  open,
  onOpenChange,
  onAddPrompt,
  currentCourse = "",
  currentTerm = "",
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddPrompt?: (prompt: string) => void
  currentCourse?: string
  currentTerm?: string
}) {
  const [step, setStep] = React.useState<1 | 2 | 3>(1)
  const [selectedCategory, setSelectedCategory] = React.useState<CategoryConfig | null>(null)
  const [selectedAction, setSelectedAction] = React.useState<ActionConfig | null>(null)
  const [formData, setFormData] = React.useState<Record<string, unknown>>({})
  const [generatedPrompt, setGeneratedPrompt] = React.useState("")
  const [copied, setCopied] = React.useState(false)
  const [saved, setSaved] = React.useState(false)

  // Reset when modal closes
  React.useEffect(() => {
    if (!open) {
      setStep(1)
      setSelectedCategory(null)
      setSelectedAction(null)
      setFormData({})
      setGeneratedPrompt("")
    }
  }, [open])

  // Step 1 sub-navigation: category → actions within the same step
  function handleSelectCategory(category: CategoryConfig) {
    setSelectedCategory(category)
  }

  function handleSelectAction(action: ActionConfig) {
    setSelectedAction(action)
    const defaults = getDefaultFormData(action)
    setFormData({
      ...defaults,
      ...(action.fields.some(f => f.name === "term")       ? { term: currentTerm }       : {}),
      ...(action.fields.some(f => f.name === "courseName") ? { courseName: currentCourse } : {}),
    })
    setStep(2)
  }

  function handleFieldChange(name: string, value: unknown) {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  function handleGenerate() {
    if (!selectedAction) return
    const prompt = generatePrompt(selectedAction, formData)
    setGeneratedPrompt(prompt)
    setStep(3)
  }

  function handleBack() {
    if (step === 1 && selectedCategory !== null) {
      setSelectedCategory(null) // back to category grid within step 1
    } else if (step === 2) {
      setStep(1) // returns to actions list (selectedCategory is still set)
    } else if (step === 3) {
      setStep(2)
    }
  }

  function handleStartOver() {
    setStep(1)
    setSelectedCategory(null)
    setSelectedAction(null)
    setFormData({})
    setGeneratedPrompt("")
    setCopied(false)
    setSaved(false)
  }

  function handleAddPrompt() {
    onAddPrompt?.(generatedPrompt)
    onOpenChange(false)
  }

  function handleCopy() {
    navigator.clipboard.writeText(generatedPrompt).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const showBack = step > 1 || selectedCategory !== null

  const stepHeading =
    step === 1
      ? "Select an action"
      : step === 2
      ? selectedAction?.label ?? "Configure"
      : "Your prompt is ready"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Prompt builder</DialogTitle>
        </DialogHeader>

        <DialogBody className="overflow-y-auto" style={{ maxHeight: "60vh" }}>
          {/* Heading + description together */}
          <div className="mb-4">
            <h2
              className="text-xl font-bold leading-snug"
              style={{ fontFamily: "var(--font-heading)", color: "var(--foreground)" }}
            >
              {stepHeading}
            </h2>
            {step === 2 && selectedAction?.description && (
              <p className="text-sm leading-relaxed mt-1" style={{ color: "var(--color-text-muted)" }}>
                {selectedAction.description}
              </p>
            )}
          </div>

          {step === 1 && !selectedCategory && (
            <CategoryGrid onSelect={handleSelectCategory} />
          )}
          {step === 1 && selectedCategory && (
            <ActionsList category={selectedCategory} onSelect={handleSelectAction} />
          )}
          {step === 2 && selectedAction && (
            <DynamicForm
              action={selectedAction}
              formData={formData}
              onChange={handleFieldChange}
              currentCourse={currentCourse}
              currentTerm={currentTerm}
            />
          )}
          {step === 3 && (
            <PromptResult
              value={generatedPrompt}
              onChange={setGeneratedPrompt}
            />
          )}
        </DialogBody>

        <DialogFooter className={!showBack ? "justify-end" : "justify-between"}>
          {showBack && (
            <Button variant="tertiary" size="md" onClick={handleBack}>
              Back
            </Button>
          )}
          <div className="flex items-center gap-3">
            {step === 3 && (
              <>
                <Button variant="tertiary" size="md" onClick={handleStartOver}>
                  <RotateCcw size={16} strokeWidth={1.5} />
                  Start over
                </Button>
                <Button variant="tertiary" size="md" onClick={handleCopy}>
                  {copied ? (
                    <><Check size={16} strokeWidth={2} />Copied!</>
                  ) : (
                    <><Copy size={16} strokeWidth={1.5} />Copy to clipboard</>
                  )}
                </Button>
                <Button variant="secondary" size="md" onClick={handleSave}>
                  {saved ? (
                    <><Check size={16} strokeWidth={2} />Saved!</>
                  ) : (
                    "Save prompt"
                  )}
                </Button>
                <Button variant="primary" size="md" onClick={handleAddPrompt}>
                  Add prompt
                </Button>
              </>
            )}
            {step === 2 && (
              <Button variant="primary" size="md" onClick={handleGenerate}>
                Generate prompt
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
