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
  Users,
  Zap,
  Clock3,
  LoaderCircle,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  X,
  ChevronDown,
  TrendingUp,
  Info,
  Search,
  Trash2,
  MoreVertical,
  CircleCheck,
  CircleX,
} from "lucide-react"
import { useRouter } from "next/navigation"

import { type SidebarNavItem, type TopNavAction } from "@/components/ui/app-shell"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar } from "@/components/ui/avatar"
import { ProgressBar } from "@/components/ui/progress-bar"
import { NumberInput } from "@/components/ui/number-input"
import { Button, buttonVariants } from "@/components/ui/button"
import { ToggleButton } from "@/components/ui/toggle-button"
import { Chart } from "@/components/ui/chart"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
} from "@/components/ui/popover"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Pill } from "@/components/ui/pill"
import { Link } from "@/components/ui/link"
import { Pagination } from "@/components/ui/pagination"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Alert } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { CheckboxItem } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { IconButton } from "@/components/ui/icon-button"
import { Menu, MenuTrigger, MenuContent, MenuItem } from "@/components/ui/menu"
import { ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Mock data ────────────────────────────────────────────────────────────────

export const ORG = {
  total:       120_000,
  used:         84_320,
  hoursSaved:    1_240,
  activeUsers:      47,
  powerUsers:        3,
}

export const USERS = [
  { name: "Sarah Chen",    initials: "SC", userId: "usr_4a2f8c1d", email: "s.chen@canvas.edu",    role: "Instructor", credits: 21_200, pct: 24.0, cap: 25, status: "approaching", createdAt: "Aug 14, 2021", enrollments: 12 },
  { name: "Marcus Webb",   initials: "MW", userId: "usr_7b3e9f2a", email: "m.webb@canvas.edu",    role: "Instructor", credits: 19_040, pct: 23.6, cap: 25, status: "approaching", createdAt: "Jan 3, 2020",  enrollments: 9  },
  { name: "Priya Nair",    initials: "PN", userId: "usr_1c6d0e5b", email: "p.nair@canvas.edu",    role: "Instructor", credits: 11_000, pct: 18.2, cap: 25, status: "active",      createdAt: "Mar 22, 2022", enrollments: 7  },
  { name: "James Okafor",  initials: "JO", userId: "usr_9e4a7c3f", email: "j.okafor@canvas.edu",  role: "Student",    credits:  8_800, pct: 12.8, cap: 25, status: "active",      createdAt: "Sep 1, 2023",  enrollments: 5  },
  { name: "Elena Vasquez", initials: "EV", userId: "usr_2f8b1d6e", email: "e.vasquez@canvas.edu", role: "Instructor", credits:  8_600, pct:  7.4, cap: 25, status: "active",      createdAt: "Feb 10, 2019", enrollments: 14 },
  { name: "Tom Bradley",   initials: "TB", userId: "usr_5d0c9a4b", email: "t.bradley@canvas.edu", role: "Student",    credits:  5_200, pct:  4.9, cap: 10, status: "active",      createdAt: "Aug 28, 2023", enrollments: 4  },
  { name: "Aisha Patel",   initials: "AP", userId: "usr_8a3e2f7c", email: "a.patel@canvas.edu",   role: "Student",    credits:  4_100, pct:  3.7, cap: 10, status: "active",      createdAt: "Sep 1, 2023",  enrollments: 3  },
  { name: "Liu Yang",      initials: "LY", userId: "usr_3b7f4d1e", email: "l.yang@canvas.edu",    role: "Student",    credits:  3_100, pct:  3.3, cap: 10, status: "active",      createdAt: "Jan 15, 2024", enrollments: 6  },
  { name: "Devon Marsh",   initials: "DM", userId: "usr_6c1a8e5f", email: "d.marsh@canvas.edu",   role: "Instructor", credits:  2_200, pct:  2.6, cap: 25, status: "active",      createdAt: "Apr 5, 2021",  enrollments: 11 },
  { name: "Fatima Hassan", initials: "FH", userId: "usr_0e5b3c9a", email: "f.hassan@canvas.edu",  role: "Student",    credits:  1_080, pct:  1.7, cap: 10, status: "active",      createdAt: "Oct 12, 2022", enrollments: 8  },
]

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export const SIDEBAR_ITEMS: SidebarNavItem[] = [
  { id: "account",   label: "Account",   avatar: { src: "https://i.pravatar.cc/150?img=47" } },
  { id: "admin",     label: "Admin",     icon: ShieldUser,     adminOnly: true },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "courses",   label: "Courses",   icon: BookText },
  { id: "calendar",  label: "Calendar",  icon: CalendarDays },
  { id: "inbox",     label: "Inbox",     icon: Inbox },
  { id: "history",   label: "History",   icon: Clock },
  { id: "help",      label: "Help",      icon: CircleHelp },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function fmt(n: number) {
  return n.toLocaleString()
}

export const orgPct = Math.round((ORG.used / ORG.total) * 100)
export const remaining = ORG.total - ORG.used
export const avgPerUser = Math.round(ORG.used / ORG.activeUsers)

// ─── Chart constants ──────────────────────────────────────────────────────────

export const AXIS_STYLE = {
  lineColor:  "#e2e6e9",
  tickColor:  "#e2e6e9",
  labels:     { style: { color: "#576773", fontSize: "12px" } },
} as const

export const Y_AXIS = {
  title:         { text: undefined },
  gridLineColor: "#e2e6e9",
  labels:        { style: { color: "#576773", fontSize: "12px" } },
} as const

export const CHART_BASE = {
  backgroundColor: "transparent",
  style:           { fontFamily: "var(--font-body)" },
  height:          220,
} as const

export const BREAKDOWN_DATA = {
  subaccount: { categories: ["North Campus", "South Campus", "Online", "Graduate", "Continuing Ed"], data: [28400, 21200, 18600, 11300, 4820] },
  course:     { categories: ["Intro to AI", "Data Science", "English 101", "Calculus II", "History"], data: [19200, 16800, 12400, 9600, 7100] },
  role:       { categories: ["Instructor", "Admin", "TA", "Designer"], data: [41200, 7400, 5200, 2840] },
  term:       { categories: ["Spring 26", "Fall 25", "Summer 25", "Spring 25", "Fall 24"], data: [34200, 28400, 9800, 7600, 4320] },
}

export const TOOL_CALLS_DATA = [
  { name: "Student Progress & Tracking",  y: 28.4, color: "#197eab" },
  { name: "Assignment Management",        y: 22.1, color: "#22a06b" },
  { name: "Quiz Creation & Management",   y: 17.6, color: "#7c5cbf" },
  { name: "Module Management",            y: 14.3, color: "#e07b00" },
  { name: "Course Content & Pages",       y: 10.8, color: "#00a3bf" },
  { name: "Student Lists & Enrollment",   y: 6.8,  color: "#8d959f" },
]

// ─── Top Nav ──────────────────────────────────────────────────────────────────

export const TOP_NAV_ACTIONS: TopNavAction[] = [
  { id: "ignite", label: "IgniteAI Agent", variant: "aiPrimary" },
]

// ─── AnimatedDots ─────────────────────────────────────────────────────────────

export function AnimatedDots() {
  const [dots, setDots] = React.useState(".")
  React.useEffect(() => {
    const frames = [".", "..", "..."]
    let i = 0
    const id = setInterval(() => { i = (i + 1) % frames.length; setDots(frames[i]) }, 500)
    return () => clearInterval(id)
  }, [])
  return <span style={{ display: "inline-block", minWidth: "1.75ch" }}>{dots}</span>
}

// ─── AnimatedCheckIcon ────────────────────────────────────────────────────────

export function AnimatedCheckIcon({ size = 20 }: { size?: number }) {
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
      circle.style.transition       = "stroke-dashoffset 0.35s ease-out"
      circle.style.strokeDashoffset = "0"
    }, 30)
    const kLen = check.getTotalLength()
    check.style.strokeDasharray  = String(kLen)
    check.style.strokeDashoffset = String(kLen)
    const t2 = setTimeout(() => {
      check.style.transition        = "stroke-dashoffset 0.35s ease-out"
      check.style.strokeDashoffset  = "0"
    }, 400)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <g clipPath="url(#clip-dash-check)">
        <path ref={circleRef} d="M18.1676 8.33332C18.5482 10.2011 18.2769 12.1428 17.3991 13.8348C16.5213 15.5268 15.09 16.8667 13.3438 17.6311C11.5977 18.3955 9.64227 18.5381 7.80367 18.0353C5.96506 17.5325 4.35441 16.4145 3.24031 14.8678C2.12622 13.3212 1.57602 11.4394 1.68147 9.53615C1.78692 7.63294 2.54165 5.8234 3.81979 4.4093C5.09793 2.9952 6.82223 2.06202 8.70514 1.76537C10.588 1.46872 12.5157 1.82654 14.1667 2.77916" stroke="var(--color-success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path ref={checkRef} d="M7.5 9.16667L10 11.6667L18.3333 3.33333" stroke="var(--color-success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs><clipPath id="clip-dash-check"><rect width="20" height="20" fill="white"/></clipPath></defs>
    </svg>
  )
}

// ─── State hook ───────────────────────────────────────────────────────────────

export function useDashboardState() {
  const [sidebarActiveId, setSidebarActiveId] = React.useState("admin")
  const [maxAlloc, setMaxAlloc] = React.useState(25)
  const [savedMaxAlloc, setSavedMaxAlloc] = React.useState(25)
  const [maxAllocSaved, setMaxAllocSaved] = React.useState(false)
  const [analysisOpen, setAnalysisOpen] = React.useState(false)
  const [analysisThinking, setAnalysisThinking] = React.useState(false)
  const [analysisElapsed, setAnalysisElapsed] = React.useState<number | null>(null)
  const [analysisCollapsed, setAnalysisCollapsed] = React.useState(true)
  const [analysisFeedback, setAnalysisFeedback] = React.useState<"up" | "down" | null>(null)
  const [analysisCopied, setAnalysisCopied] = React.useState(false)
  const [alertsOpen, setAlertsOpen] = React.useState(false)
  const [limitModalOpen, setLimitModalOpen] = React.useState(false)
  const [maintenanceMode, setMaintenanceMode] = React.useState(false)
  const [blacklist, setBlacklist] = React.useState<string[]>(["Sarah Chen"])
  const [blacklistInput, setBlacklistInput] = React.useState("")
  const [addConfirmTarget, setAddConfirmTarget] = React.useState<string | null>(null)
  const [removeConfirmTarget, setRemoveConfirmTarget] = React.useState<string | null>(null)
  const [csmNotified, setCsmNotified] = React.useState(false)
  const [alertSettingsSaved, setAlertSettingsSaved] = React.useState(false)
  const [alertEmail, setAlertEmail] = React.useState(true)
  const [alertCanvas, setAlertCanvas] = React.useState(false)
  const [tablePage, setTablePage] = React.useState(1)
  const [activeTab, setActiveTab] = React.useState("usage")
  const [usagePeriod, setUsagePeriod] = React.useState<"day" | "week" | "month">("week")
  const [breakdownBy, setBreakdownBy] = React.useState<"subaccount" | "course" | "role" | "term">("subaccount")
  const [userPage, setUserPage] = React.useState(1)
  const USER_PAGE_SIZE = 5

  const analysisText = `Your organization has consumed ${orgPct}% of its ${fmt(ORG.total)}-credit allotment this billing period, with ${fmt(remaining)} credits remaining. At the current weekly burn rate (~11,600 credits/week), the budget will be exhausted in approximately 3 weeks.\n\nPower Users at Limit:\n• Sarah Chen (Instructor) has used 31.0% — exceeding her 25% cap by 6 points.\n• Marcus Webb (Instructor) is at 25.6%, just over the cap.\n\nApproaching Limit:\n• Priya Nair is at 19.9% against a 25% cap.\n• James Okafor is at 8.8% against a 10% student cap.\n\nUsage Spike — Weeks 6–7:\nOrg-wide credits jumped from ~11,200 (Wk 5) to 13,400 (Wk 7), a 20% week-over-week increase. Wk 8 shows a decline to 11,620, suggesting the spike was temporary.\n\nTop Tool Calls:\nStudent Progress & Tracking (28.4%) and Assignment Management (22.1%) account for over half of all agent tool calls. Instructors are the primary driver — the Instructor role accounts for 48.9% of total credit usage (41,200 of 84,320). Quiz Creation & Management (17.6%) and Module Management (14.3%) round out the top four.\n\nRecommendations:\n• Contact support to increase the org allotment before the 3-week runway expires.\n• Review Sarah Chen and Marcus Webb's usage patterns — consider raising their caps or distributing load across additional instructors.\n• Send proactive alerts to Priya Nair and James Okafor about their approaching caps.\n• North Campus accounts for the largest share (28,400 credits, 33.7%) — confirm this aligns with headcount and course load.\n• The high volume of Student Progress & Tracking calls suggests instructors are using IgniteAI heavily for feedback workflows — consider targeted guidance or templates to improve efficiency.`

  function openAnalysis() {
    const start = Date.now()
    setAnalysisThinking(true)
    setAnalysisElapsed(null)
    setAnalysisCollapsed(true)
    setAnalysisFeedback(null)
    setAnalysisCopied(false)
    setAnalysisOpen(true)
    setTimeout(() => {
      setAnalysisElapsed(Math.round((Date.now() - start) / 1000))
      setAnalysisThinking(false)
    }, 2200)
  }

  function handleAnalysisCopy() {
    navigator.clipboard.writeText(analysisText).then(() => {
      setAnalysisCopied(true)
      setTimeout(() => setAnalysisCopied(false), 2000)
    })
  }

  return {
    sidebarActiveId, setSidebarActiveId,
    maxAlloc, setMaxAlloc,
    savedMaxAlloc, setSavedMaxAlloc,
    maxAllocSaved, setMaxAllocSaved,
    analysisOpen, setAnalysisOpen,
    analysisThinking,
    analysisElapsed,
    analysisCollapsed, setAnalysisCollapsed,
    analysisFeedback, setAnalysisFeedback,
    analysisCopied,
    alertsOpen, setAlertsOpen,
    limitModalOpen, setLimitModalOpen,
    maintenanceMode, setMaintenanceMode,
    blacklist, setBlacklist,
    blacklistInput, setBlacklistInput,
    addConfirmTarget, setAddConfirmTarget,
    removeConfirmTarget, setRemoveConfirmTarget,
    csmNotified, setCsmNotified,
    alertSettingsSaved, setAlertSettingsSaved,
    alertEmail, setAlertEmail,
    alertCanvas, setAlertCanvas,
    tablePage, setTablePage,
    activeTab, setActiveTab,
    usagePeriod, setUsagePeriod,
    breakdownBy, setBreakdownBy,
    userPage, setUserPage,
    USER_PAGE_SIZE,
    analysisText,
    openAnalysis,
    handleAnalysisCopy,
  }
}

export type DashboardState = ReturnType<typeof useDashboardState>

// ─── Layout switcher (ellipsis menu + optional Customize button) ──────────────

export function LayoutSwitcher({
  layout,
  onAnalyze,
  showCustomize = false,
}: {
  layout: "a" | "b"
  onAnalyze: () => void
  showCustomize?: boolean
}) {
  const router = useRouter()
  return (
    <div className="flex items-center gap-2">
      {showCustomize && (
        <Button variant="tertiary" size="md" onClick={() => {}}>
          <LayoutDashboard size={16} strokeWidth={1.5} />
          Customize
        </Button>
      )}
      <Button variant="aiPrimary" onClick={onAnalyze}>Analyze</Button>
      <Menu>
        <MenuTrigger>
          <IconButton variant="tertiary" icon={MoreVertical} aria-label="Layout options" />
        </MenuTrigger>
        <MenuContent align="end">
          <MenuItem
            onClick={() => router.push("/prototypes/agent-dashboard/layout-a")}
            className={layout === "a" ? "bg-[var(--btn-tertiary-bg-hover)] font-medium" : ""}
          >
            Layout A
          </MenuItem>
          <MenuItem
            onClick={() => router.push("/prototypes/agent-dashboard/layout-b")}
            className={layout === "b" ? "bg-[var(--btn-tertiary-bg-hover)] font-medium" : ""}
          >
            Layout B
          </MenuItem>
        </MenuContent>
      </Menu>
    </div>
  )
}

// ─── Credit Allotment Card ─────────────────────────────────────────────────────

export function CreditAllotmentCard({ state }: { state: DashboardState }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Credit allotment</CardTitle>
        <CardDescription>
          Credit usage for the current billing period.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex items-baseline gap-2 mb-2">
          <span style={{ fontFamily: "var(--font-heading)", fontSize: 28, fontWeight: 600, color: "#273540" }}>{fmt(ORG.used)}</span>
          <span className="text-sm" style={{ color: "#576773" }}>of {fmt(ORG.total)}</span>
        </div>
        <ProgressBar value={orgPct} size="sm" />
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="secondary" size="sm" onClick={() => state.setLimitModalOpen(true)}>
          Request more
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="tertiary" size="sm"><Info size={16} strokeWidth={1.75} />What are credits?</Button>
          </PopoverTrigger>
          <PopoverContent className="max-w-xs p-4">
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold" style={{ color: "#273540" }}>What are credits?</p>
              <p className="text-sm" style={{ color: "#576773", lineHeight: 1.5 }}>
                Credits represent your organization&apos;s AI usage capacity for the billing period. Your allotment was sized during account setup based on your organization&apos;s expected activity — accounting for a mix of frequent and occasional users.
              </p>
              <p className="text-sm" style={{ color: "#576773", lineHeight: 1.5 }}>
                Different tasks draw different amounts depending on their complexity.
              </p>
              <Separator />
              <p className="text-sm font-semibold" style={{ color: "#273540" }}>Typical usage examples</p>
              <div className="flex flex-col gap-1.5">
                {[
                  { task: "Answer a question",            credits: "~1 credit" },
                  { task: "Draft a course announcement",  credits: "~10 credits" },
                  { task: "Build a full course syllabus", credits: "~40 credits" },
                  { task: "Generate a quiz with rubric",  credits: "~120 credits" },
                  { task: "Shift all dates in a course",  credits: "~250 credits" },
                ].map(({ task, credits }) => (
                  <div key={task} className="flex items-baseline justify-between gap-3">
                    <span className="text-sm" style={{ color: "#576773" }}>{task}</span>
                    <span className="text-sm font-medium shrink-0" style={{ color: "#273540" }}>{credits}</span>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </CardFooter>
    </Card>
  )
}

// ─── Max User Allocation Card ─────────────────────────────────────────────────

export function MaxUserAllocationCard({ state }: { state: DashboardState }) {
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
                value={state.maxAlloc}
                onValueChange={(v) => state.setMaxAlloc(v ?? 25)}
                min={1}
                max={100}
              />
            </div>
            <Button
              variant="primary"
              size="md"
              disabled={state.maxAlloc === state.savedMaxAlloc}
              onClick={() => { state.setSavedMaxAlloc(state.maxAlloc); state.setMaxAllocSaved(true) }}
            >Save</Button>
            <div className="flex-1" />
            <Link href="#" onClick={(e) => { e.preventDefault(); state.setAlertsOpen(true) }}>Manage Alerts</Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Stat Cards ───────────────────────────────────────────────────────────────

export function HoursSavedCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-1.5" style={{ color: "#576773" }}>
          <Clock3 size={13} strokeWidth={1.5} />
          <CardTitle style={{ fontSize: 13, fontWeight: 500 }}>Hours saved</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-0.5">
          <p style={{ fontFamily: "var(--font-heading)", fontSize: 28, fontWeight: 600, color: "#273540" }}>{fmt(ORG.hoursSaved)}</p>
          <p className="text-sm" style={{ color: "#576773" }}>est. with Agent this period</p>
        </div>
      </CardContent>
    </Card>
  )
}

export function ActiveUsersCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-1.5" style={{ color: "#576773" }}>
          <Users size={13} strokeWidth={1.5} />
          <CardTitle style={{ fontSize: 13, fontWeight: 500 }}>Active users</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-0.5">
          <p style={{ fontFamily: "var(--font-heading)", fontSize: 28, fontWeight: 600, color: "#273540" }}>{ORG.activeUsers}</p>
          <p className="text-sm" style={{ color: "#576773" }}>users today</p>
        </div>
      </CardContent>
    </Card>
  )
}

export function AvgPerUserCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-1.5" style={{ color: "#576773" }}>
          <Zap size={13} strokeWidth={1.5} />
          <CardTitle style={{ fontSize: 13, fontWeight: 500 }}>Average credits per user</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <p style={{ fontFamily: "var(--font-heading)", fontSize: 28, fontWeight: 600, color: "#273540" }}>{fmt(avgPerUser)}</p>
            <TrendingUp size={18} strokeWidth={2} style={{ color: "#22a06b" }} />
          </div>
          <p className="text-sm" style={{ color: "#576773" }}>credits this period</p>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Charts ───────────────────────────────────────────────────────────────────

export function TopUsageBreakdownCard({ state, narrow = false }: { state: DashboardState; narrow?: boolean }) {
  const raw = BREAKDOWN_DATA[state.breakdownBy].data
  const total = raw.reduce((s, v) => s + v, 0)
  const pctData = raw.map((v) => Math.round((v / total) * 1000) / 10)
  return (
    <Card>
      <CardHeader>
        <div className={cn("flex gap-2", narrow ? "flex-col items-start" : "flex-row items-center justify-between")}>
          <div className="flex flex-col gap-1">
            <CardTitle>Top usage breakdown</CardTitle>
            <CardDescription>Percentage of all credits used.</CardDescription>
          </div>
          <Select value={state.breakdownBy} onValueChange={(v) => state.setBreakdownBy(v as typeof state.breakdownBy)}>
            <SelectTrigger size="sm" className={narrow ? "w-full" : "w-[140px]"}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="subaccount">Subaccount</SelectItem>
              <SelectItem value="course">Course</SelectItem>
              <SelectItem value="role">Role</SelectItem>
              <SelectItem value="term">Term</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Chart options={{
          chart: { ...CHART_BASE, type: "bar", height: narrow ? 180 : 220 },
          title: { text: undefined },
          credits: { enabled: false },
          legend: { enabled: false },
          xAxis: { ...AXIS_STYLE, categories: BREAKDOWN_DATA[state.breakdownBy].categories },
          yAxis: {
            ...Y_AXIS,
            max: 100,
            labels: {
              style: { color: "#576773", fontSize: "12px" },
              formatter(this: { value: string | number }) { return `${this.value}%` },
            },
          },
          tooltip: { valueSuffix: "%" },
          plotOptions: { bar: { borderWidth: 0, borderRadius: 3 } },
          series: [{
            type: "bar",
            name: "Usage",
            data: pctData,
            color: "#197eab",
          }],
        }} />
      </CardContent>
    </Card>
  )
}

export function TopToolCallsCard({ narrow = false }: { narrow?: boolean }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Agent tasks</CardTitle>
        <CardDescription>Based on overall agent usage this billing period.</CardDescription>
      </CardHeader>
      <CardContent className={narrow ? "!px-8 !pb-8 !pt-0" : ""}>
        <Chart options={{
          chart: { ...CHART_BASE, type: "pie", height: narrow ? 320 : 220 },
          title: { text: undefined },
          credits: { enabled: false },
          legend: {
            enabled: true,
            layout: narrow ? "horizontal" : "vertical",
            align: narrow ? "left" : "right",
            verticalAlign: narrow ? "bottom" : "middle",
            itemStyle: { color: "#576773", fontSize: "11px", fontWeight: "400" },
            symbolRadius: 4,
            navigation: { enabled: false },
            x: narrow ? -10 : 0,
          },
          tooltip: { valueSuffix: "%" },
          plotOptions: {
            pie: {
              allowPointSelect: false,
              cursor: "default",
              dataLabels: { enabled: false },
              showInLegend: true,
              borderWidth: 0,
              innerSize: "55%",
            },
          },
          series: [{
            type: "pie",
            name: "Tool Calls",
            data: TOOL_CALLS_DATA,
          }],
        }} />
      </CardContent>
    </Card>
  )
}

// ─── Agent Users Table ────────────────────────────────────────────────────────

export function AgentUsersTable({ state }: { state: DashboardState }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent users</CardTitle>
        <CardDescription>
          All users of IgniteAI Agent this billing period.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead sort={false}>User</TableHead>
              <TableHead sort="desc">Credits</TableHead>
              <TableHead sort={false}>% of allocation</TableHead>
              <TableHead sort={false} className="text-center">Status</TableHead>
              <TableHead sort={false} className="text-center">Access</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {USERS.map((u) => (
              <TableRow key={u.name}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar initials={u.initials} size="small" showBorder />
                    <Link href="#" onClick={(e) => e.preventDefault()}>{u.name}</Link>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-mono" style={{ color: "#273540" }}>{fmt(u.credits)}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2" style={{ minWidth: 120 }}>
                    <ProgressBar
                      value={Math.min((u.pct / state.savedMaxAlloc) * 100, 100)}
                      size="xs"
                      showLabel={false}
                      className="flex-1"
                    />
                    <span className="text-xs font-mono" style={{ color: "#576773", minWidth: "2.5rem", textAlign: "left" }}>
                      {u.pct}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    {u.pct >= state.savedMaxAlloc
                      ? <Pill color="error" status="Exceeded limit" />
                      : u.pct >= state.savedMaxAlloc * 0.8
                      ? <Pill color="warning" status="Nearing limit" />
                      : <Pill color="info" status="Within limits" />
                    }
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {(() => {
                    const isRevoked = state.blacklist.includes(u.name)
                    return (
                      <Menu>
                        <MenuTrigger asChild>
                          <button
                            aria-label={isRevoked ? "Access revoked" : "Access granted"}
                            className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors hover:bg-[var(--btn-tertiary-bg-hover)] mx-auto"
                          >
                            {isRevoked
                              ? <CircleX size={22} strokeWidth={1.75} style={{ color: "var(--color-error)" }} />
                              : <CircleCheck size={22} strokeWidth={1.75} style={{ color: "var(--color-success)" }} />
                            }
                          </button>
                        </MenuTrigger>
                        <MenuContent align="end">
                          {isRevoked
                            ? <MenuItem onClick={() => state.setRemoveConfirmTarget(u.name)}>Restore access</MenuItem>
                            : <MenuItem onClick={() => state.setAddConfirmTarget(u.name)}>Revoke access</MenuItem>
                          }
                        </MenuContent>
                      </Menu>
                    )
                  })()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="justify-center">
        <Pagination
          variant="numeric"
          currentPage={state.userPage}
          totalPages={8}
          onPageChange={state.setUserPage}
        />
      </CardFooter>
    </Card>
  )
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────

export function SettingsTab({ state }: { state: DashboardState }) {
  return (
    <div className="flex flex-col gap-6">
      {/* Maintenance Mode */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <CardTitle>Maintenance mode</CardTitle>
              <CardDescription>
                Temporarily disable IgniteAI Agent for all users in your organization. Users will see a message that the agent is temporarily unavailable and will be back soon.
              </CardDescription>
            </div>
            <Switch
              checked={state.maintenanceMode}
              onCheckedChange={state.setMaintenanceMode}
            />
          </div>
        </CardHeader>
        {state.maintenanceMode && (
          <CardContent>
            <Alert variant="warning" layout="inline">
              IgniteAI Agent is currently disabled for your entire organization.
            </Alert>
          </CardContent>
        )}
      </Card>

      {/* User Blocklist */}
      <Card>
        <CardHeader>
          <CardTitle>User blocklist</CardTitle>
          <CardDescription>
            Users on this list will not see the IgniteAI Agent interface. This can be used to exclude specific accounts from access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Input
                size="md"
                leftIcon={Search}
                placeholder="Search by name or email…"
                value={state.blacklistInput}
                onChange={(e) => state.setBlacklistInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && state.blacklistInput.trim() && !state.blacklist.includes(state.blacklistInput.trim())) {
                    state.setAddConfirmTarget(state.blacklistInput.trim())
                  }
                }}
                className="w-72"
              />
              <Button
                variant="secondary"
                size="md"
                disabled={!state.blacklistInput.trim() || state.blacklist.includes(state.blacklistInput.trim())}
                onClick={() => {
                  if (state.blacklistInput.trim()) {
                    state.setAddConfirmTarget(state.blacklistInput.trim())
                  }
                }}
              >
                Add
              </Button>
            </div>

            {state.blacklist.length === 0 ? (
              <p className="text-sm" style={{ color: "#8d959f" }}>No users blocked.</p>
            ) : (
              <div className="flex flex-col">
                {state.blacklist.map((name, i) => {
                  const user = USERS.find((u) => u.name === name)
                  const initials = user?.initials ?? name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
                  return (
                    <div
                      key={name}
                      className="flex flex-col"
                      style={{ borderTop: i === 0 ? "1px solid var(--color-stroke-base)" : undefined, borderBottom: "1px solid var(--color-stroke-base)" }}
                    >
                      <div className="flex items-center gap-3 py-3">
                        <Avatar initials={initials} size="small" showBorder />
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="text-base" style={{ color: "#273540" }}>{name}</span>
                          <span className="text-sm" style={{ color: "#8d959f" }}>{user?.email}</span>
                        </div>
                        <IconButton
                          variant="ghost"
                          size="sm"
                          icon={Trash2}
                          aria-label="Remove user"
                          onClick={() => state.setRemoveConfirmTarget(name)}
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
    </div>
  )
}

// ─── Modals + Floating Alerts ─────────────────────────────────────────────────

export function DashboardModals({ state }: { state: DashboardState }) {
  const [addNotify, setAddNotify] = React.useState(true)
  const [addNotifyMessage, setAddNotifyMessage] = React.useState(`Your access to IgniteAI Agent has been revoked. Please contact your administrator if you have questions.`)
  const [removeNotify, setRemoveNotify] = React.useState(true)
  const [removeNotifyMessage, setRemoveNotifyMessage] = React.useState(`Your access to IgniteAI Agent has been restored. You can now use the agent again.`)
  return (
    <>
      {/* AI Analysis Modal */}
      <Dialog open={state.analysisOpen} onOpenChange={state.setAnalysisOpen}>
        <DialogContent size="md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <img src={`${process.env.NEXT_PUBLIC_BASE_PATH}/svg/ignite-color.svg`} width={24} height={24} alt="" aria-hidden />
              <DialogTitle>Usage Analysis</DialogTitle>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    aria-label="AI info"
                    className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors hover:bg-[var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                  >
                    <img src={`${process.env.NEXT_PUBLIC_BASE_PATH}/svg/ai-info.svg`} width={20} height={20} alt="" aria-hidden />
                  </button>
                </PopoverTrigger>
                <PopoverContent side="bottom" align="start" className="w-[296px] p-6">
                  <div className="flex flex-col gap-6">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-col gap-1">
                        <img
                          src={`${process.env.NEXT_PUBLIC_BASE_PATH}/svg/IgniteAI.png`}
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
                    <Link href="#" icon={ExternalLink} iconPlacement="end" onClick={(e) => e.preventDefault()}>
                      AI Privacy Notice
                    </Link>
                    <div className="flex flex-col">
                      <p style={{ fontFamily: "var(--font-heading)", fontSize: 20, fontWeight: 700, color: "#273540", lineHeight: 1.25, marginBottom: 16 }}>
                        Usage Analysis
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
            </div>
          </DialogHeader>
          <DialogBody>
            {state.analysisThinking ? (
              <div className="flex items-center gap-2 py-2" style={{ color: "#576773" }}>
                <LoaderCircle size={20} strokeWidth={2} className="animate-spin" />
                <span className="text-base font-semibold">Thinking<AnimatedDots /></span>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {state.analysisElapsed !== null && (
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => state.setAnalysisCollapsed(c => !c)}
                      className="flex items-center gap-2"
                      style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                    >
                      <AnimatedCheckIcon size={20} />
                      <span className="text-base font-semibold" style={{ color: "var(--color-success)" }}>
                        IgniteAI Agent analyzed in {state.analysisElapsed}s
                      </span>
                      <ChevronDown
                        size={20}
                        strokeWidth={1.5}
                        style={{ color: "var(--color-success)", transform: state.analysisCollapsed ? "rotate(-90deg)" : "rotate(0deg)", transition: "transform 0.15s ease" }}
                      />
                    </button>
                    {!state.analysisCollapsed && (
                      <div style={{ paddingLeft: 16 }}>
                        <div className="flex flex-col gap-3" style={{ borderLeft: "1px solid #8d959f", paddingLeft: 16 }}>
                          <div className="flex flex-col" style={{ gap: 2 }}>
                            <span style={{ fontSize: 14, color: "#576773" }}>Tools</span>
                            <span style={{ fontSize: 14, color: "#273540" }}>get_org_credits, get_user_allocations, get_weekly_trend</span>
                          </div>
                          <div className="flex flex-col" style={{ gap: 2 }}>
                            <span style={{ fontSize: 14, color: "#576773" }}>Sources</span>
                            <span style={{ fontSize: 14, color: "#273540" }}>Org Credit Report — March 2026, User Allocation Table, Weekly Usage Chart</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex flex-col gap-5 text-sm" style={{ color: "#273540", lineHeight: 1.6 }}>
                  <p>
                    Your organization has consumed <strong>{orgPct}%</strong> of its {fmt(ORG.total)}-credit
                    allotment this billing period, with <strong>{fmt(remaining)} credits remaining</strong>.
                    At the current weekly burn rate (~11,600 credits/week), the budget will be exhausted
                    in approximately <strong>3 weeks</strong>. Consider requesting an allotment increase soon.
                  </p>
                  <div>
                    <p className="font-semibold mb-2">Power Users at Limit</p>
                    <ul className="flex flex-col gap-1 pl-4 list-disc">
                      <li><strong>Sarah Chen</strong> (Instructor) has used <strong>31.0%</strong> of org credits — exceeding her 25% cap by 6 percentage points. Her account has been flagged for throttling.</li>
                      <li><strong>Marcus Webb</strong> (Instructor) is at <strong>25.6%</strong>, just over the cap. Usage spiked significantly in weeks 6–7 suggesting a high-intensity grading or tutoring period.</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Approaching Limit</p>
                    <ul className="flex flex-col gap-1 pl-4 list-disc">
                      <li><strong>Priya Nair</strong> is at 19.9% against a 25% cap — she may hit the limit before the period ends if current usage continues.</li>
                      <li><strong>James Okafor</strong> is at 8.8% against a 10% student cap. Consider proactively adjusting his allocation or alerting him.</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Usage Spike — Weeks 6–7</p>
                    <p>Org-wide credits jumped from ~11,200 (Wk 5) to <strong>13,400 (Wk 7)</strong>, a 20% week-over-week increase. This aligns with Sarah Chen and Marcus Webb&apos;s elevated usage and likely corresponds to a mid-term grading or feedback cycle. Wk 8 has declined to <strong>11,620 credits</strong>, suggesting the spike was temporary.</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Top Tool Calls</p>
                    <p className="mb-2"><strong>Student Progress &amp; Tracking</strong> (28.4%) and <strong>Assignment Management</strong> (22.1%) account for over half of all agent tool calls. The Instructor role drives <strong>48.9%</strong> of total credit consumption (41,200 of 84,320 credits). Quiz Creation &amp; Management (17.6%) and Module Management (14.3%) round out the top four use cases.</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Recommendations</p>
                    <ul className="flex flex-col gap-1 pl-4 list-disc">
                      <li>Contact support to increase the org allotment before the 3-week runway expires.</li>
                      <li>Review Sarah Chen and Marcus Webb&apos;s usage patterns — consider raising their individual caps or distributing load across additional instructors.</li>
                      <li>Send a proactive alert to Priya Nair and James Okafor about their approaching caps.</li>
                      <li>North Campus accounts for the largest share by subaccount (<strong>28,400 credits, 33.7%</strong>). Confirm this aligns with expected headcount and course load.</li>
                      <li>The high volume of Student Progress &amp; Tracking calls suggests instructors are using IgniteAI heavily for feedback workflows — consider targeted guidance or prompt templates to improve efficiency.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </DialogBody>
          <DialogFooter className="!justify-start gap-6">
            <div className="flex items-center gap-2">
              <button
                onClick={state.handleAnalysisCopy}
                aria-label="Copy response"
                className={cn(buttonVariants({ variant: "tertiary", size: "sm" }), "w-8 px-0")}
              >
                {state.analysisCopied
                  ? <Check size={16} strokeWidth={2} style={{ color: "var(--color-success)" }} />
                  : <Copy size={16} strokeWidth={1.5} />}
              </button>
              <ToggleButton
                icon={ThumbsUp}
                size="sm"
                aria-label="Helpful"
                pressed={state.analysisFeedback === "up"}
                onPressedChange={on => state.setAnalysisFeedback(on ? "up" : null)}
                className="border border-[var(--btn-tertiary-stroke)]"
              />
              <ToggleButton
                icon={ThumbsDown}
                size="sm"
                aria-label="Not helpful"
                pressed={state.analysisFeedback === "down"}
                onPressedChange={on => state.setAnalysisFeedback(on ? "down" : null)}
                className="border border-[var(--btn-tertiary-stroke)]"
              />
            </div>
            <p className="text-xs" style={{ color: "#8d959f" }}>AI can make mistakes. Consider checking important information.</p>
            <DialogClose asChild>
              <Button variant="secondary" className="ml-auto">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Alerts Modal */}
      <Dialog open={state.alertsOpen} onOpenChange={state.setAlertsOpen}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Max Allocation Alert</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <div className="flex flex-col gap-5">
              <p className="text-sm" style={{ color: "#576773" }}>
                Choose how you want to be notified when a user exceeds their allocation cap. Alerts are sent to all account admins.
              </p>
              <div className="flex flex-col gap-4">
                <Switch
                  label="Email"
                  hint="Send an alert to your admin email address."
                  checked={state.alertEmail}
                  onCheckedChange={state.setAlertEmail}
                />
                <Switch
                  label="Canvas Message"
                  hint="Send an in-app message via the Canvas inbox."
                  checked={state.alertCanvas}
                  onCheckedChange={state.setAlertCanvas}
                />
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="primary" size="sm" onClick={() => state.setAlertSettingsSaved(true)}>Save</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="secondary" size="sm">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request Limit Increase Modal */}
      <Dialog open={state.limitModalOpen} onOpenChange={state.setLimitModalOpen}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Increase Your Credit Allotment</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <div className="flex flex-col gap-3">
              <p className="text-sm" style={{ color: "#576773", lineHeight: 1.6 }}>
                <strong style={{ color: "#273540" }}>It looks like your organization is making great use of the IgniteAI Agent — that&apos;s a good sign.</strong>
              </p>
              <p className="text-sm" style={{ color: "#576773", lineHeight: 1.6 }}>
                If your current allotment isn&apos;t quite keeping pace with demand, we&apos;d love to have a conversation. Your Customer Success Manager can review your usage patterns and explore what options make sense for your organization — we&apos;re always open to finding a fit that works within your budget.
              </p>
              <p className="text-sm" style={{ color: "#576773", lineHeight: 1.6 }}>
                Clicking <strong style={{ color: "#273540" }}>Notify CSM</strong> will send them a heads-up so they can reach out to start the conversation.
              </p>
            </div>
          </DialogBody>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="primary" size="sm" onClick={() => state.setCsmNotified(true)}>Notify CSM</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="secondary" size="sm">Nevermind</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add to blocklist confirmation */}
      <Dialog open={state.addConfirmTarget !== null} onOpenChange={(open) => { if (!open) { state.setAddConfirmTarget(null); setAddNotify(false); setAddNotifyMessage("") } }}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Revoke access?</DialogTitle>
          </DialogHeader>
          <DialogBody>
            {(() => {
              const name = state.addConfirmTarget ?? ""
              const user = USERS.find((u) => u.name === name || u.email === name)
              const initials = user?.initials ?? name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
              return (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar initials={initials} size="small" showBorder />
                    <div className="flex flex-col">
                      <span className="text-base font-medium" style={{ color: "#273540" }}>{user?.name ?? name}</span>
                      <span className="text-sm" style={{ color: "#8d959f" }}>{user?.email}</span>
                    </div>
                  </div>
                  <p className="text-sm" style={{ color: "#576773", lineHeight: 1.5 }}>
                    <strong style={{ color: "#273540" }}>This user will be added to the blocklist</strong> and will immediately lose access to the IgniteAI Agent. You can restore their access at any time.
                  </p>
                  <div className="flex flex-col gap-3">
                    <CheckboxItem
                      checked={addNotify}
                      onCheckedChange={(v) => setAddNotify(!!v)}
                      label="Notify user"
                    />
                    {addNotify && (
                      <Textarea
                        value={addNotifyMessage}
                        onChange={(e) => setAddNotifyMessage(e.target.value)}
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
                if (state.addConfirmTarget) {
                  state.setBlacklist([...state.blacklist, state.addConfirmTarget])
                  state.setBlacklistInput("")
                  state.setAddConfirmTarget(null)
                  setAddNotify(false)
                  setAddNotifyMessage("")
                }
              }}
            >
              Revoke access
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove from blocklist confirmation */}
      <Dialog open={state.removeConfirmTarget !== null} onOpenChange={(open) => { if (!open) { state.setRemoveConfirmTarget(null); setRemoveNotify(false); setRemoveNotifyMessage("") } }}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Restore access?</DialogTitle>
          </DialogHeader>
          <DialogBody>
            {(() => {
              const name = state.removeConfirmTarget ?? ""
              const user = USERS.find((u) => u.name === name || u.email === name)
              const initials = user?.initials ?? name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
              return (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar initials={initials} size="small" showBorder />
                    <div className="flex flex-col">
                      <span className="text-base font-medium" style={{ color: "#273540" }}>{user?.name ?? name}</span>
                      <span className="text-sm" style={{ color: "#8d959f" }}>{user?.email}</span>
                    </div>
                  </div>
                  <p className="text-sm" style={{ color: "#576773", lineHeight: 1.5 }}>
                    {name} will be removed from the blocklist and may use the agent again.
                  </p>
                  <div className="flex flex-col gap-3">
                    <CheckboxItem
                      checked={removeNotify}
                      onCheckedChange={(v) => setRemoveNotify(!!v)}
                      label="Notify user"
                    />
                    {removeNotify && (
                      <Textarea
                        value={removeNotifyMessage}
                        onChange={(e) => setRemoveNotifyMessage(e.target.value)}
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
              variant="successPrimary"
              size="md"
              onClick={() => {
                state.setBlacklist(state.blacklist.filter((n) => n !== state.removeConfirmTarget))
                state.setRemoveConfirmTarget(null)
                setRemoveNotify(false)
                setRemoveNotifyMessage("")
              }}
            >
              Restore access
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Floating success alerts */}
      {state.csmNotified && (
        <Alert variant="success" display="floating" onDismiss={() => state.setCsmNotified(false)}>
          Your Customer Success Manager has been notified and will be in touch shortly.
        </Alert>
      )}
      {state.alertSettingsSaved && (
        <Alert variant="success" display="floating" onDismiss={() => state.setAlertSettingsSaved(false)}>
          Alert notification settings saved.
        </Alert>
      )}
      {state.maxAllocSaved && (
        <Alert variant="success" display="floating" onDismiss={() => state.setMaxAllocSaved(false)}>
          Default max user allocation updated to {state.savedMaxAlloc}%.
        </Alert>
      )}
    </>
  )
}

// ─── Shared AppShell wrapper props ────────────────────────────────────────────

export function dashboardShellProps(state: DashboardState) {
  return {
    sidebarItems: SIDEBAR_ITEMS,
    sidebarActiveId: state.sidebarActiveId,
    onSidebarSelect: state.setSidebarActiveId,
    sidebarIsAdmin: true,
    sidebarLogoHref: "/prototypes",
    topNavActions: TOP_NAV_ACTIONS,
    breadcrumb: [{ label: "Admin" }, { label: "IgniteAI Agent" }],
    pageTitle: "IgniteAI Agent",
    pageTabNav: (
      <Tabs value={state.activeTab} onValueChange={state.setActiveTab}>
        <TabsList>
          <TabsTrigger value="usage">Dashboard</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
      </Tabs>
    ),
  }
}
