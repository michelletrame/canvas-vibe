"use client"

import React from "react"
import {
  LayoutDashboard,
  BookText,
  CalendarDays,
  Inbox,
  CircleHelp,
  ShieldUser,
  Search,
  X,
  Sparkles,
  TriangleAlert,
  Mail,
  Award,
  Megaphone,
  SquareUserRound,
} from "lucide-react"
import { AppShell, type SidebarNavItem, type BreadcrumbItem, type TopNavAction } from "@/components/ui/app-shell"
import { SoloAgentShell } from "@/components/ui/solo-agent-shell"
import { AgentShell } from "@/components/ui/agent-shell"
import { IGNITE_SUPPORT_CONFIG } from "@/lib/solo-agent-configs"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProgressBar, ProgressCircle } from "@/components/ui/progress-bar"
import { NumberInput } from "@/components/ui/number-input"
import { Switch } from "@/components/ui/switch"
import { Alert } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { IconButton } from "@/components/ui/icon-button"
import { Separator } from "@/components/ui/separator"
import { CheckboxItem } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Pill } from "@/components/ui/pill"
import { Pagination } from "@/components/ui/pagination"
import { Tooltip } from "@/components/ui/tooltip"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectSeparator } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverAnchor } from "@/components/ui/popover"
import { USERS } from "@/app/prototypes/agent-dashboard/_shared"

// ── Constants ─────────────────────────────────────────────────────────────────

const MAX_ALLOWLIST = 5

const BETTER_ORG = { used: 3_520, total: 5_000 }
const BEST_ORG   = { used: 84_320, total: 120_000 }

const BETTER_USERS = [
  { name: "Sarah Chen",    initials: "SC", credits: 1_240, pct: 24.8 },
  { name: "Marcus Webb",   initials: "MW", credits: 1_040, pct: 20.8 },
  { name: "Priya Nair",    initials: "PN", credits:   880, pct: 17.6 },
  { name: "James Okafor",  initials: "JO", credits:   220, pct:  4.4 },
  { name: "Elena Vasquez", initials: "EV", credits:   140, pct:  2.8 },
]

const TOP_NAV_ACTIONS: TopNavAction[] = [
  { id: "igniteai", label: "IgniteAI Agent", icon: Sparkles, variant: "aiPrimary" },
]

const SIDEBAR_ITEMS: SidebarNavItem[] = [
  { id: "account",   label: "Account",   avatar: { src: "https://i.pravatar.cc/150?img=47" } },
  { id: "admin",     label: "Admin",     icon: ShieldUser, adminOnly: true },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "courses",   label: "Courses",   icon: BookText },
  { id: "calendar",  label: "Calendar",  icon: CalendarDays },
  { id: "inbox",     label: "Inbox",     icon: Inbox },
  { id: "help",      label: "Help",      icon: CircleHelp },
]

const BREADCRUMB: BreadcrumbItem[] = [
  { label: "Prototypes", href: "/prototypes" },
  { label: "IgniteAI Agent Admin" },
]

const CREDIT_EXAMPLES = [
  { task: "Answer a question",                          credits: "1–2 credits" },
  { task: "Create an assignment, announcement, or page", credits: "1–3 credits" },
  { task: "Search a course",                            credits: "2–4 credits" },
  { task: "Analyze gradebook in a course",              credits: "3–6 credits" },
  { task: "Shift dates for 10 assignments",             credits: "15–25 credits" },
]

// Mock users for allowlist lookup
const KNOWN_USERS: { name: string; email: string; initials: string }[] = [
  { name: "Sarah Chen",     email: "s.chen@university.edu",    initials: "SC" },
  { name: "Marcus Webb",    email: "m.webb@university.edu",    initials: "MW" },
  { name: "Priya Nair",     email: "p.nair@university.edu",    initials: "PN" },
  { name: "James Okafor",   email: "j.okafor@university.edu",  initials: "JO" },
  { name: "Elena Vasquez",  email: "e.vasquez@university.edu", initials: "EV" },
]

function fmt(n: number) {
  return n.toLocaleString()
}

function getUserInfo(name: string) {
  const known = KNOWN_USERS.find((u) => u.name === name || u.email === name)
  return {
    name:     known?.name ?? name,
    email:    known?.email,
    initials: known?.initials ?? name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
  }
}

// ── Variation Toggle ──────────────────────────────────────────────────────────

function VariationToggle({
  variation,
  onChange,
}: {
  variation: "good" | "better" | "best"
  onChange: (v: "good" | "better" | "best") => void
}) {
  return (
    <div
      className="flex rounded-lg overflow-hidden"
      style={{ border: "1px solid var(--color-stroke-base)" }}
    >
      {(["good", "better", "best"] as const).map((v) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={cn(
            "px-4 py-1.5 text-sm font-semibold transition-colors capitalize",
            variation === v
              ? "bg-[var(--primary)] text-white"
              : "bg-white text-[var(--foreground)] hover:bg-[var(--muted)]"
          )}
        >
          {v}
        </button>
      ))}
    </div>
  )
}

// ── Good Variation Content ────────────────────────────────────────────────────

const GOOD_CAN_ASK = [
  "How do I submit an assignment?",
  "How do I post a course announcement?",
  "Where are student enrollments?",
  "How do I join a video conference?",
  "How do I manage notifications?",
]

const GOOD_CANNOT_ASK = [
  "Draft an announcement for my class",
  "Build a course syllabus",
  "Manage student submissions",
  "Summarize student engagement",
  "Bulk update course dates and content",
]

function GoodVariationContent({ onUpgrade }: { onUpgrade: () => void }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center gap-6 py-8" style={{ maxWidth: 720, margin: "0 auto" }}>
          <div className="flex flex-col gap-2">
            <CardTitle>IgniteAI Agent is in Support Mode</CardTitle>
            <p className="text-sm" style={{ color: "#576773", lineHeight: 1.6 }}>
              On your current plan, IgniteAI Agent answers support questions for educators and students.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full text-left mt-2 mb-6">
            {/* Can ask */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#576773" }}>Can ask</p>
              <div className="flex flex-col gap-1.5">
                {GOOD_CAN_ASK.map((q) => (
                  <div key={q} className="flex items-center gap-2">
                    <span className="shrink-0" style={{ color: "var(--color-success)" }}>✓</span>
                    <span className="text-sm" style={{ color: "#273540" }}>{q}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Cannot ask */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#576773" }}>Not available on this plan</p>
              <div className="flex flex-col gap-1.5">
                {GOOD_CANNOT_ASK.map((q) => (
                  <div key={q} className="flex items-center gap-2">
                    <span className="shrink-0" style={{ color: "var(--color-error)" }}>✕</span>
                    <span className="text-sm" style={{ color: "#273540" }}>{q}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Button variant="primary" size="md" onClick={onUpgrade}>
            Upgrade
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ── Credit Allotment Card ─────────────────────────────────────────────────────

function CreditAllotmentCard({
  org,
  onRequestMore,
  infoAlert,
  warningAlert,
  buttonLabel = "Request more",
  cardDescription = "Track your organization's AI usage.",
  showLowCredits = false,
}: {
  org: { used: number; total: number }
  onRequestMore: () => void
  infoAlert?: React.ReactNode
  warningAlert?: React.ReactNode
  buttonLabel?: string
  cardDescription?: string
  showLowCredits?: boolean
}) {
  const pct = Math.round((org.used / org.total) * 100)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent credits</CardTitle>
        <CardDescription>{cardDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        {warningAlert && <div className="mb-4">{warningAlert}</div>}
        {infoAlert && <div className="mb-4">{infoAlert}</div>}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Usage — centered panel */}
          <div
            className="flex flex-col items-center justify-center gap-4 p-6 rounded-xl"
            style={{ minHeight: 200, flex: "0 0 30%", background: "#f9fafb", border: "1px solid var(--color-stroke-base)" }}
          >
            <ProgressCircle value={pct} size="lg" />
            <div className="flex flex-col items-center gap-1 text-center">
              {showLowCredits && <Pill color="warning" status="Low credits" />}
              <span style={{ fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 600, color: "#273540" }}>
                {fmt(org.used)} <span style={{ fontSize: 14, fontWeight: 400, color: "#576773" }}>used</span>
              </span>
              <span className="text-sm" style={{ color: "#576773" }}>{fmt(org.total - org.used)} credits remaining</span>
            </div>
            <Button variant="secondary" size="sm" onClick={onRequestMore}>
              {buttonLabel}
            </Button>
          </div>

          {/* What are credits */}
          <div className="flex flex-col gap-3 flex-1 p-4">
            <p className="text-sm font-semibold" style={{ color: "#273540" }}>What are credits?</p>
            <p className="text-sm" style={{ color: "#576773", lineHeight: 1.5 }}>
              Credits represent your organization&apos;s AI usage capacity for the billing period. Different tasks draw different amounts depending on their complexity.
            </p>
            <div className="flex flex-col gap-1.5" style={{ maxWidth: 420 }}>
              {CREDIT_EXAMPLES.map(({ task, credits }) => (
                <div key={task} className="flex items-baseline justify-between gap-3">
                  <span className="text-sm" style={{ color: "#273540" }}>{task}</span>
                  <span
                    className="text-xs font-medium shrink-0 py-0.5 rounded-full text-center"
                    style={{ background: "#f9fafb", color: "#273540", width: 80 }}
                  >{credits}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ── Max User Allocation Card ──────────────────────────────────────────────────

function MaxUserAllocationCard({
  maxAlloc,
  savedMaxAlloc,
  onValueChange,
  onSave,
}: {
  maxAlloc: number
  savedMaxAlloc: number
  onValueChange: (v: number) => void
  onSave: () => void
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Default max user allocation</CardTitle>
        <CardDescription>
          Set a soft limit on how much of your org&apos;s total credits any single user should consume in a billing period.
          Users who reach this threshold will be flagged and admins will be alerted.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <span className="text-sm" style={{ color: "#576773" }}>% of total org credits</span>
          <div className="flex items-center gap-3">
            <div style={{ width: 120 }}>
              <NumberInput
                value={maxAlloc}
                onValueChange={(v) => onValueChange(v ?? 25)}
                min={1}
                max={100}
              />
            </div>
            <Button
              variant="primary"
              size="md"
              disabled={maxAlloc === savedMaxAlloc}
              onClick={onSave}
            >
              Save
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ── Settings Card ─────────────────────────────────────────────────────────────

function SettingsCard({
  lowCreditsThreshold,
  onLowCreditsChange,
  maxAlloc,
  onMaxAllocChange,
  maintenanceMode,
  onMaintenanceModeChange,
  showUserAlloc = true,
  orgTotal,
}: {
  lowCreditsThreshold: number
  onLowCreditsChange: (v: number) => void
  maxAlloc: number
  onMaxAllocChange: (v: number) => void
  maintenanceMode: boolean
  onMaintenanceModeChange: (v: boolean) => void
  showUserAlloc?: boolean
  orgTotal: number
}) {
  const [draftLowCredits, setDraftLowCredits] = React.useState(lowCreditsThreshold)
  const [draftMaxAlloc, setDraftMaxAlloc] = React.useState(maxAlloc)
  const [draftMaintenance, setDraftMaintenance] = React.useState(maintenanceMode)

  React.useEffect(() => { setDraftMaintenance(maintenanceMode) }, [maintenanceMode])

  function handleSave() {
    onLowCreditsChange(draftLowCredits)
    onMaxAllocChange(draftMaxAlloc)
    onMaintenanceModeChange(draftMaintenance)
  }

  function handleReset() {
    setDraftLowCredits(80)
    setDraftMaxAlloc(24000)
    setDraftMaintenance(false)
  }

  const rows = [
    {
      label: "Low credit warning",
      description: `Notify when your organization's credit usage exceeds ${Math.round((draftLowCredits / 100) * orgTotal).toLocaleString()} credits.`,
      control: (
        <div className="flex items-center gap-2 shrink-0">
          <div style={{ width: 80 }}>
            <NumberInput value={draftLowCredits} onValueChange={(v) => setDraftLowCredits(v ?? 80)} min={1} max={99} size="sm" />
          </div>
          <span className="text-sm" style={{ color: "#576773" }}>%</span>
        </div>
      ),
    },
    ...(showUserAlloc ? [{
      label: "High usage warning",
      description: `Notify when an individual's credit usage exceeds ${draftMaxAlloc.toLocaleString()} credits.`,
      control: (
        <div className="flex items-center gap-2 shrink-0">
          <div style={{ width: 80 }}>
            <NumberInput
              value={parseFloat(((draftMaxAlloc / orgTotal) * 100).toFixed(1))}
              onValueChange={(v) => setDraftMaxAlloc(Math.round(((v ?? 0) / 100) * orgTotal))}
              min={0} max={100} size="sm"
            />
          </div>
          <span className="text-sm" style={{ color: "#576773" }}>%</span>
        </div>
      ),
    }] : []),
    {
      label: "Maintenance mode",
      description: "Temporarily disable IgniteAI Agent for all users in your organization. Users will see a message that the agent is temporarily unavailable.",
      control: <Switch checked={draftMaintenance} onCheckedChange={setDraftMaintenance} />,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex flex-col gap-2 py-4"
            >
              <p className="text-sm font-semibold" style={{ color: "#273540" }}>{row.label}</p>
              {row.control}
              <p className="text-sm" style={{ color: "#576773", lineHeight: 1.4 }}>{row.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="tertiary" size="md" onClick={handleReset}>Reset to defaults</Button>
        <Button variant="primary" size="md" onClick={handleSave}>Save</Button>
      </CardFooter>
    </Card>
  )
}

// ── Allowlist Card ────────────────────────────────────────────────────────────

function AllowlistCard({
  allowlist,
  input,
  onInputChange,
  onAdd,
  onRemove,
}: {
  allowlist: string[]
  input: string
  onInputChange: (v: string) => void
  onAdd: () => void
  onRemove: (name: string) => void
}) {
  const atMax = allowlist.length >= MAX_ALLOWLIST
  const alreadyAdded = allowlist.includes(input.trim())
  const canAdd = !!input.trim() && !alreadyAdded && !atMax

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent access</CardTitle>
        <CardDescription>Choose which educators on your team can use IgniteAI Agent. You can update this at any time.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex items-end justify-between gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold" style={{ color: "#273540" }}>Add user</label>
              <div className="flex items-center gap-3">
            <Input
              size="md"
              leftIcon={Search}
              placeholder="Search by name or email…"
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && canAdd) onAdd()
              }}
              disabled={atMax}
              style={{ width: 280 }}
            />
            <Button
              variant="secondary"
              size="md"
              disabled={!canAdd}
              onClick={onAdd}
            >
              Add
            </Button>
              </div>
            </div>
            <span
              className="text-xs font-medium px-2.5 py-1 rounded-full shrink-0"
              style={{ background: "#f9fafb", color: "#576773", border: "1px solid var(--color-stroke-base)" }}
            >
              {allowlist.length} / {MAX_ALLOWLIST} users
            </span>
          </div>

          {atMax && (
            <p className="text-sm" style={{ color: "#8d959f" }}>
              You&apos;ve reached the {MAX_ALLOWLIST}-user limit for your plan. Remove a user to add someone new.
            </p>
          )}

          {allowlist.length === 0 ? (
            <p className="text-sm" style={{ color: "#8d959f" }}>No users added yet.</p>
          ) : (
            <div className="flex flex-col">
              {allowlist.map((name, i) => {
                const user = getUserInfo(name)
                return (
                  <div
                    key={name}
                    className="flex flex-col"
                    style={{
                      borderTop: i === 0 ? "1px solid var(--color-stroke-base)" : undefined,
                      borderBottom: "1px solid var(--color-stroke-base)",
                    }}
                  >
                    <div className="flex items-center gap-3 py-3">
                      <Avatar initials={user.initials} size="small" showBorder />
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-base" style={{ color: "#273540" }}>{user.name}</span>
                        {user.email && (
                          <span className="text-sm" style={{ color: "#8d959f" }}>{user.email}</span>
                        )}
                      </div>
                      <IconButton
                        variant="ghost"
                        size="sm"
                        icon={X}
                        aria-label="Remove user"
                        onClick={() => onRemove(name)}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// ── Modals ────────────────────────────────────────────────────────────────────

function AgentAdminModals({
  limitModalOpen,
  setLimitModalOpen,
  upgradeModalOpen,
  setUpgradeModalOpen,
  fullAgentModalOpen,
  setFullAgentModalOpen,
  csmNotified,
  setCsmNotified,
  addTarget,
  setAddTarget,
  onConfirmAdd,
  removeTarget,
  setRemoveTarget,
  onConfirmRemove,
}: {
  limitModalOpen: boolean
  setLimitModalOpen: (v: boolean) => void
  upgradeModalOpen: boolean
  setUpgradeModalOpen: (v: boolean) => void
  fullAgentModalOpen: boolean
  setFullAgentModalOpen: (v: boolean) => void
  csmNotified: boolean
  setCsmNotified: (v: boolean) => void
  addTarget: string | null
  setAddTarget: (v: string | null) => void
  onConfirmAdd: (name: string) => void
  removeTarget: string | null
  setRemoveTarget: (v: string | null) => void
  onConfirmRemove: (name: string) => void
}) {
  const [addNotify, setAddNotify] = React.useState(true)
  const [addMsg, setAddMsg] = React.useState(
    "You've been selected to use IgniteAI Agent at your institution. Sign in to Canvas to get started."
  )
  const [removeNotify, setRemoveNotify] = React.useState(true)
  const [removeMsg, setRemoveMsg] = React.useState(
    "Your IgniteAI Agent access has been updated. Contact your administrator with any questions."
  )

  function resetAdd() { setAddNotify(true); setAddMsg("You've been selected to use IgniteAI Agent at your institution. Sign in to Canvas to get started.") }
  function resetRemove() { setRemoveNotify(true); setRemoveMsg("Your IgniteAI Agent access has been updated. Contact your administrator with any questions.") }

  return (
    <>
      {/* Request Limit Increase */}
      <Dialog open={limitModalOpen} onOpenChange={setLimitModalOpen}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Increase your credit allotment</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <div className="flex flex-col gap-3">
              <p className="text-sm" style={{ color: "#576773", lineHeight: 1.6 }}>
                <strong style={{ color: "#273540" }}>It looks like your organization is making great use of the IgniteAI Agent — that&apos;s a good sign.</strong>
              </p>
              <p className="text-sm" style={{ color: "#576773", lineHeight: 1.6 }}>
                If your current allotment isn&apos;t quite keeping pace with demand, we&apos;d love to have a conversation.
                Your Customer Success Manager can review your usage and explore options that work within your budget.
              </p>
              <p className="text-sm" style={{ color: "#576773", lineHeight: 1.6 }}>
                Clicking <strong style={{ color: "#273540" }}>Notify CSM</strong> will send them a heads-up to start the conversation.
              </p>
            </div>
          </DialogBody>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="primary" size="sm" onClick={() => setCsmNotified(true)}>Notify CSM</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="secondary" size="sm">Nevermind</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upgrade Plan */}
      <Dialog open={upgradeModalOpen} onOpenChange={setUpgradeModalOpen}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Upgrade your plan</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <div className="flex flex-col gap-3">
              <p className="text-sm" style={{ color: "#576773", lineHeight: 1.6 }}>
                <strong style={{ color: "#273540" }}>Ready to expand IgniteAI Agent beyond your pilot group?</strong>
              </p>
              <p className="text-sm" style={{ color: "#576773", lineHeight: 1.6 }}>
                Upgrading your plan unlocks access for your entire institution, with higher credit limits.
              </p>
              <p className="text-sm" style={{ color: "#576773", lineHeight: 1.6 }}>
                Your Customer Success Manager can walk you through options and find the right fit for your organization.
              </p>
            </div>
          </DialogBody>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="primary" size="sm" onClick={() => setCsmNotified(true)}>Contact my CSM</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="secondary" size="sm">Not now</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Full Agent Upgrade (Good tier) */}
      <Dialog open={fullAgentModalOpen} onOpenChange={setFullAgentModalOpen}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Unlock full IgniteAI Agent</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <div className="flex flex-col gap-3">
              <p className="text-sm" style={{ color: "#576773", lineHeight: 1.6 }}>
                <strong style={{ color: "#273540" }}>Take IgniteAI Agent beyond support and into the classroom.</strong>
              </p>
              <p className="text-sm" style={{ color: "#576773", lineHeight: 1.6 }}>
                Upgraded plans give instructors access to AI-assisted teaching tools — drafting announcements, building course content, bulk updating course dates, and more.
              </p>
              <p className="text-sm" style={{ color: "#576773", lineHeight: 1.6 }}>
                Your Customer Success Manager can walk you through what's included and find the right fit for your institution.
              </p>
            </div>
          </DialogBody>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="primary" size="sm" onClick={() => setCsmNotified(true)}>Contact my CSM</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="secondary" size="sm">Not now</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add to allowlist */}
      <Dialog
        open={addTarget !== null}
        onOpenChange={(open) => { if (!open) { setAddTarget(null); resetAdd() } }}
      >
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Enable agent access?</DialogTitle>
          </DialogHeader>
          <DialogBody>
            {(() => {
              const user = getUserInfo(addTarget ?? "")
              return (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar initials={user.initials} size="small" showBorder />
                    <div className="flex flex-col">
                      <span className="text-base font-medium" style={{ color: "#273540" }}>{user.name}</span>
                      {user.email && <span className="text-sm" style={{ color: "#8d959f" }}>{user.email}</span>}
                    </div>
                  </div>
                  <p className="text-sm" style={{ color: "#576773", lineHeight: 1.5 }}>
                    <strong style={{ color: "#273540" }}>{user.name}</strong> will be granted access to IgniteAI Agent. They&apos;ll be able to use the agent the next time they sign in to Canvas.
                  </p>
                  <div className="flex flex-col gap-3">
                    <CheckboxItem
                      checked={addNotify}
                      onCheckedChange={(v) => setAddNotify(!!v)}
                      label="Notify user"
                    />
                    {addNotify && (
                      <Textarea
                        value={addMsg}
                        onChange={(e) => setAddMsg(e.target.value)}
                        rows={3}
                      />
                    )}
                  </div>
                </div>
              )
            })()}
          </DialogBody>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary" size="md">Cancel</Button>
            </DialogClose>
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                if (addTarget) { onConfirmAdd(addTarget); setAddTarget(null); resetAdd() }
              }}
            >
              Enable access
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove from allowlist */}
      <Dialog
        open={removeTarget !== null}
        onOpenChange={(open) => { if (!open) { setRemoveTarget(null); resetRemove() } }}
      >
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Remove access?</DialogTitle>
          </DialogHeader>
          <DialogBody>
            {(() => {
              const user = getUserInfo(removeTarget ?? "")
              return (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar initials={user.initials} size="small" showBorder />
                    <div className="flex flex-col">
                      <span className="text-base font-medium" style={{ color: "#273540" }}>{user.name}</span>
                      {user.email && <span className="text-sm" style={{ color: "#8d959f" }}>{user.email}</span>}
                    </div>
                  </div>
                  <p className="text-sm" style={{ color: "#576773", lineHeight: 1.5 }}>
                    {user.name} will lose access to IgniteAI Agent. You can re-add them at any time.
                  </p>
                  <div className="flex flex-col gap-3">
                    <CheckboxItem
                      checked={removeNotify}
                      onCheckedChange={(v) => setRemoveNotify(!!v)}
                      label="Notify user"
                    />
                    {removeNotify && (
                      <Textarea
                        value={removeMsg}
                        onChange={(e) => setRemoveMsg(e.target.value)}
                        rows={3}
                      />
                    )}
                  </div>
                </div>
              )
            })()}
          </DialogBody>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary" size="md">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructivePrimary"
              size="md"
              onClick={() => {
                if (removeTarget) { onConfirmRemove(removeTarget); setRemoveTarget(null); resetRemove() }
              }}
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Floating alerts */}
      {csmNotified && (
        <Alert variant="success" display="floating" onDismiss={() => setCsmNotified(false)}>
          Your Customer Success Manager has been notified and will be in touch shortly.
        </Alert>
      )}
    </>
  )
}

// ── Agent Shell wrapper ────────────────────────────────────────────────────────

// ── Agent Users Card ──────────────────────────────────────────────────────────

type AgentUser = { name: string; initials: string; credits: number; pct: number }

function AgentUsersCard({
  users,
  description,
  maxAlloc = 20000,
  showAlerts = false,
  showPagination = true,
  showAllocPill = true,
  showImpact = false,
  orgUsed,
}: {
  users: AgentUser[]
  description: string
  maxAlloc?: number
  showAlerts?: boolean
  showPagination?: boolean
  showAllocPill?: boolean
  showImpact?: boolean
  orgUsed?: number
}) {
  const [page, setPage] = React.useState(1)
  const [impactOpen, setImpactOpen] = React.useState(false)
  const [impactTemplate, setImpactTemplate] = React.useState("")
  const usageShare = (u: AgentUser) =>
    orgUsed ? (u.credits / orgUsed) * 100 : u.pct
  const overAlloc = users.filter((u) => u.credits > maxAlloc)
  // Hard-coded org-wide average across all users (not just the top-10 visible page)
  const avgCredits = 4_500
  const powerUserCount = users.filter((u) => u.credits >= avgCredits * 1.1).length
  const underUtilCount = users.filter((u) => u.credits < avgCredits * 0.5).length
  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Leaderboard</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {showImpact && (
            <Button variant="secondary" size="sm" leftIcon={SquareUserRound} onClick={() => setImpactOpen(true)}>
              Guide & support users
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {showAlerts && overAlloc.length > 0 && (
          <div className="mb-4">
            <Alert variant="warning" layout="inline">
              <div className="flex flex-col gap-2">
                <span>
                  {overAlloc.length === 1
                    ? <><strong>{overAlloc[0].name}</strong> has</>
                    : <><strong>{overAlloc.length} users</strong> have</>
                  }{" "}high credit usage. Consider checking in to learn more about how {overAlloc.length === 1 ? "they're" : "they're"} getting value from the agent.
                </span>
                <div className="flex gap-2">
                  <Button variant="tertiary" size="sm">Message users</Button>
                </div>
              </div>
            </Alert>
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead sort={false}>User</TableHead>
              <TableHead sort={false}>Credits used</TableHead>
              <TableHead sort={false}>% of overall usage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.name}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar initials={u.initials} size="small" showBorder />
                    <a href="#" onClick={(e) => e.preventDefault()} className="text-sm font-medium" style={{ color: "#2d6ab4", textDecoration: "underline" }}>{u.name}</a>
                  </div>
                </TableCell>
                <TableCell>
                  {u.credits > maxAlloc ? (
                    <Pill color="warning" icon={TriangleAlert} status={u.credits.toLocaleString()} />
                  ) : (
                    <span className="text-sm font-mono" style={{ color: "#273540" }}>
                      {u.credits.toLocaleString()}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {(() => {
                    const share = usageShare(u)
                    return (
                      <div className="flex items-center gap-2" style={{ minWidth: 130 }}>
                        <ProgressBar
                          value={share}
                          size="xs"
                          showLabel={false}
                          className="flex-1"
                        />
                        <span className="text-xs font-mono" style={{ color: "#576773", minWidth: "3rem" }}>
                          {share.toFixed(2)}%
                        </span>
                      </div>
                    )
                  })()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      {showPagination && (
        <CardFooter className="justify-center">
          <Pagination
            variant="numeric"
            currentPage={page}
            totalPages={8}
            onPageChange={setPage}
          />
        </CardFooter>
      )}
    </Card>

    <Dialog open={impactOpen} onOpenChange={setImpactOpen}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>Guide & support users</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-4">
            <p className="text-sm" style={{ color: "#576773" }}>
              Impact is Canvas's in-app engagement platform. Admins can send targeted messages directly inside Canvas — as contextual hints, pop-ups, or banners — without relying on email. Campaigns bundle messages with adoption analytics so you can measure whether users actually change their behavior.
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold" style={{ color: "#273540" }}>Target power users</span>
                <p className="text-sm" style={{ color: "#576773" }}>
                  Reach your highest-engagement users to invite peer advocacy, gather early feedback, or highlight advanced features worth sharing across their department.
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold" style={{ color: "#273540" }}>Re-activate underutilizers</span>
                <p className="text-sm" style={{ color: "#576773" }}>
                  Surface contextual tips, guided walkthroughs, and feature spotlights to users who haven't fully engaged — meeting them where they are in Canvas without adding to their inbox.
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold" style={{ color: "#273540" }}>Track outcomes</span>
                <p className="text-sm" style={{ color: "#576773" }}>
                  Every campaign includes built-in analytics: who saw and dismissed the message, click-through rates, and tool adoption trends before and after the campaign ran.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 pt-1">
              <label className="text-sm font-medium" style={{ color: "#273540" }}>Start from a template</label>
              <Select value={impactTemplate} onValueChange={setImpactTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a template…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scratch">Start from scratch</SelectItem>
                  <SelectSeparator />
                  <SelectItem value="power-users">Power user recognition & advocacy</SelectItem>
                  <SelectItem value="underutilizers">Re-engage underutilizing users</SelectItem>
                  <SelectItem value="feature-launch">New feature announcement</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="tertiary" size="md">Close</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="primary" size="md" leftIcon={Megaphone}>Create Impact campaign</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  )
}

// ── Agent Shell wrapper ────────────────────────────────────────────────────────

function AgentShellWithSurvey({
  open, onClose, inline, suggestedPrompts, maintenance,
}: {
  open: boolean
  onClose: () => void
  inline: boolean
  suggestedPrompts?: string[]
  maintenance?: boolean
}) {
  return (
    <AgentShell
      open={open}
      onClose={onClose}
      inline={inline}
      maintenance={maintenance}
      suggestedPrompts={suggestedPrompts}
    />
  )
}

// ── Support mode popover (Good tier) ──────────────────────────────────────────

function SupportModePopover({
  agentOpen,
  dismissed,
  onDismiss,
  onClose,
  inline,
}: {
  agentOpen: boolean
  dismissed: boolean
  onDismiss: () => void
  onClose: () => void
  inline?: boolean
}) {
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    if (!agentOpen || dismissed) { setReady(false); return }
    const t = setTimeout(() => setReady(true), 400)
    return () => clearTimeout(t)
  }, [agentOpen, dismissed])

  function handleDismiss() {
    onDismiss()
    setTimeout(() => {
      document.querySelector<HTMLTextAreaElement>("textarea")?.focus()
    }, 50)
  }

  return (
    <Popover open={ready}>
      <div style={{ position: "relative" }}>
        <SoloAgentShell
          open={agentOpen}
          onClose={onClose}
          config={IGNITE_SUPPORT_CONFIG}
          role="admin"
          inline={inline}
        />
        <PopoverAnchor asChild>
          <div style={{ position: "absolute", bottom: 128, left: "50%", transform: "translateX(-50%)", width: 1, height: 1 }} />
        </PopoverAnchor>
      </div>
      <PopoverContent side="top" align="center" style={{ maxWidth: 300, padding: 16 }}>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold" style={{ color: "#273540" }}>Limited support mode</span>
            <p className="text-sm" style={{ color: "#576773", lineHeight: 1.5 }}>
              IgniteAI Agent is running in support mode with limited functionality. Only help desk and Canvas support questions are available.
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={handleDismiss}>
            Got it
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AgentAdminPage() {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ""

  const [variation, setVariation] = React.useState<"good" | "better" | "best">("best")

  // Shared
  const [limitModalOpen, setLimitModalOpen] = React.useState(false)
  const [upgradeModalOpen, setUpgradeModalOpen] = React.useState(false)
  const [fullAgentModalOpen, setFullAgentModalOpen] = React.useState(false)
  const [csmNotified, setCsmNotified] = React.useState(false)

  // Better — allowlist
  const [allowlist, setAllowlist] = React.useState<string[]>(["Sarah Chen"])
  const [allowlistInput, setAllowlistInput] = React.useState("")
  const [addTarget, setAddTarget] = React.useState<string | null>(null)
  const [removeTarget, setRemoveTarget] = React.useState<string | null>(null)

  // Good — support mode popover (persisted so it only shows once per session)
  const [supportPopoverDismissed, setSupportPopoverDismissed] = React.useState(
    () => typeof window !== "undefined" && sessionStorage.getItem("supportPopoverDismissed") === "true"
  )
  React.useEffect(() => {
    if (variation === "good") {
      setSupportPopoverDismissed(false)
      sessionStorage.removeItem("supportPopoverDismissed")
    }
  }, [variation])
  function dismissSupportPopover() {
    setSupportPopoverDismissed(true)
    sessionStorage.setItem("supportPopoverDismissed", "true")
  }

  // Best — allocation + maintenance
  const [maxAlloc, setMaxAlloc] = React.useState(24000)
  const [maintenanceMode, setMaintenanceMode] = React.useState(false)

  const [lowCreditsThreshold, setLowCreditsThreshold] = React.useState(80)
  const [lowCreditsDismissed, setLowCreditsDismissed] = React.useState(false)

  const org = variation === "better" ? BETTER_ORG : BEST_ORG

  return (
    <>
      <AppShell
        sidebarItems={SIDEBAR_ITEMS}
        sidebarLogo={
          <img src={`${base}/svg/canvas.svg`} alt="Canvas" width={40} height={40} />
        }
        sidebarLogoHref="/prototypes"
        sidebarActiveId="admin"
        sidebarIsAdmin
        breadcrumb={BREADCRUMB}
        topNavActions={TOP_NAV_ACTIONS}
        agentShellSlot={(open, onClose, inline) =>
          variation === "good"
            ? (
                <SupportModePopover
                  agentOpen={open}
                  dismissed={supportPopoverDismissed}
                  onDismiss={dismissSupportPopover}
                  onClose={onClose}
                  inline={inline}
                />
              )
            : (
                <AgentShellWithSurvey
                  open={open}
                  onClose={onClose}
                  inline={inline}
                  maintenance={maintenanceMode}
                  suggestedPrompts={[
                    "List recently published courses",
                    "Send message to instructors",
                    "Conclude courses in term",
                  ]}
                />
              )
        }
        pageTitleIcon={
          <img src={`${base}/svg/ignite-color.svg`} width={36} height={36} alt="" aria-hidden />
        }
        pageTitle="IgniteAI Agent"
        pageDescription="Configure IgniteAI Agent for your organization."
        pageActions={
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold" style={{ color: "#576773" }}>Prototype:</span>
            <VariationToggle variation={variation} onChange={setVariation} />
          </div>
        }
      >
        <div className="flex flex-col gap-6" style={{ maxWidth: 1100 }}>

          {variation === "good" && (
            <GoodVariationContent onUpgrade={() => setFullAgentModalOpen(true)} />
          )}

          {variation !== "good" && (
            <>
              {lowCreditsThreshold <= 70 && !lowCreditsDismissed && (
                <Alert variant="warning" display="floating" onDismiss={() => setLowCreditsDismissed(true)}>
                  <strong>Low credits:</strong> Your organization has used {lowCreditsThreshold}% of its IgniteAI Agent credits for this billing period. Consider requesting{" "}
                  <button
                    onClick={() => variation === "better" ? setUpgradeModalOpen(true) : setLimitModalOpen(true)}
                    style={{ color: "#2d6ab4", textDecoration: "underline", background: "none", border: "none", padding: 0, cursor: "pointer", font: "inherit" }}
                  >
                    additional credits
                  </button>.
                </Alert>
              )}

              {maintenanceMode && (
                <Alert variant="warning" layout="inline">
                  <div className="flex flex-col gap-2">
                    <span>IgniteAI Agent is in maintenance mode and disabled for your entire organization.</span>
                    <div>
                      <Button variant="tertiary" size="sm" onClick={() => setMaintenanceMode(false)}>Re-enable agent</Button>
                    </div>
                  </div>
                </Alert>
              )}

              <Tabs defaultValue="usage" variant="primary" className="flex flex-col gap-6">
              <TabsList>
                <TabsTrigger value="usage">Usage</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="usage" className="flex flex-col gap-6">
                <CreditAllotmentCard
                  org={org}
                  onRequestMore={variation === "better" ? () => setUpgradeModalOpen(true) : () => setLimitModalOpen(true)}
                  buttonLabel={variation === "better" ? "Upgrade plan" : "Request more"}
                  cardDescription="Track your organization's AI usage."
                  infoAlert={variation === "better" ? (
                    <Alert variant="info" layout="inline">
                      Your plan includes enough credits for around 5 users — a great way to start with a pilot group and build confidence in AI-assisted teaching before a wider rollout.
                      {" "}To grant access, assign users the{" "}
                      <a href="https://tommurphy.instructure.com/accounts/6657/settings#tab-users" target="_blank" rel="noopener noreferrer" style={{ color: "#2d6ab4", textDecoration: "underline" }}>agent-user role</a>
                      {" "}in Canvas admin settings.
                    </Alert>
                  ) : undefined}
                  showLowCredits={lowCreditsThreshold <= 70}
                />

                <AgentUsersCard
                  users={variation === "better" ? BETTER_USERS : USERS}
                  description={
                    variation === "better"
                      ? "All users with the agent-user account role in your organization."
                      : "Users who have used credits in this billing period."
                  }
                  maxAlloc={maxAlloc}
                  showAlerts={variation === "best"}
                  showPagination={variation === "best"}
                  showAllocPill={variation === "best"}
                  showImpact={variation === "best"}
                  orgUsed={org.used}
                />
              </TabsContent>

              <TabsContent value="settings">
                <SettingsCard
                  lowCreditsThreshold={lowCreditsThreshold}
                  onLowCreditsChange={setLowCreditsThreshold}
                  maxAlloc={maxAlloc}
                  onMaxAllocChange={setMaxAlloc}
                  maintenanceMode={maintenanceMode}
                  onMaintenanceModeChange={setMaintenanceMode}
                  showUserAlloc={variation === "best"}
                  orgTotal={org.total}
                />
              </TabsContent>
            </Tabs>
            </>
          )}

        </div>
      </AppShell>

      <AgentAdminModals
        limitModalOpen={limitModalOpen}
        setLimitModalOpen={setLimitModalOpen}
        upgradeModalOpen={upgradeModalOpen}
        setUpgradeModalOpen={setUpgradeModalOpen}
        fullAgentModalOpen={fullAgentModalOpen}
        setFullAgentModalOpen={setFullAgentModalOpen}
        csmNotified={csmNotified}
        setCsmNotified={setCsmNotified}
        addTarget={addTarget}
        setAddTarget={setAddTarget}
        onConfirmAdd={(name) => {
          setAllowlist((prev) => [...prev, name])
          setAllowlistInput("")
        }}
        removeTarget={removeTarget}
        setRemoveTarget={setRemoveTarget}
        onConfirmRemove={(name) => setAllowlist((prev) => prev.filter((n) => n !== name))}
      />

    </>
  )
}
