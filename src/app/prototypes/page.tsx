"use client"

import React from "react"
import { LayoutDashboard, BookText, CalendarDays, Inbox, CircleHelp, ShieldUser, ArrowUpRight } from "lucide-react"
import { AppShell, type SidebarNavItem, type TopNavAction, type BreadcrumbItem } from "@/components/ui/app-shell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const PASSWORD = "Panda01!"
const STORAGE_KEY = "proto_auth"

const TOP_NAV_ACTIONS: TopNavAction[] = [
  { id: "ignite", label: "IgniteAI Agent", variant: "aiPrimary" },
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
  { label: "Prototypes" },
]

type ProtoItem = { title: string; description: string; href: string }
const GROUPS: { label?: string; items: ProtoItem[] }[] = [
  {
    label: "In Review",
    items: [
      {
        title: "IgniteAI Agent Admin",
        description: "Reimagined settings page for configuring IgniteAI Agent — credit allotment, user access, and org-wide controls.",
        href: "/prototypes/agent-admin",
      },
      {
        title: "Support Mode",
        description: "IgniteAI Agent in Support Mode — a standalone Canvas support assistant for students, educators, and admins.",
        href: "/prototypes/pandabot",
      },
      {
        title: "Agent Analytics Widgets",
        description: "Analytics widgets for tracking IgniteAI Agent usage — designed for inclusion in the Analytics Dashboard.",
        href: "/prototypes/agent-analytics-widgets",
      },
    ],
  },
  {
    label: "WIP",
    items: [
      {
        title: "Gradebook",
        description: "Simplified gradebook with click-to-expand inline grading interface — rubric scoring and student feedback without leaving the table.",
        href: "/prototypes/gradebook",
      },
      {
        title: "Course Modules — Add Item Menus",
        description: "Interactive prototype of the Canvas Modules page with the Add Item dropdown and submenus (Add new item, Generate item) wired up.",
        href: "/prototypes/course-modules",
      },
      {
        title: "Rubric Builder — AI Assisted",
        description: "AI-powered rubric creation with live preview. Describe an assignment and let the AI draft criteria and ratings, then accept or refine inline.",
        href: "/prototypes/rubric-builder",
      },
      {
        title: "Prompt Builder",
        description: "Interface for building and configuring AI prompt templates.",
        href: "/prototypes/prompt-builder",
      },
      {
        title: "Standalone Agent",
        description: "IgniteAI Agent embedded as full-page body content — no windowed panel, chat fills the page.",
        href: "/prototypes/standalone-agent",
      },
    ],
  },
  {
    label: "Reference",
    items: [
      {
        title: "InstUI v11",
        description: "Component library showcase — all UI primitives and design system tokens in one place.",
        href: "/prototypes/kitchen-sink",
      },
      {
        title: "High Charts",
        description: "Every core Highcharts chart type — line, area, column, bar, pie, donut, scatter, step, and mixed — rendered in our design system's style.",
        href: "/prototypes/highcharts-kitchen-sink",
      },
    ],
  },
  {
    label: "Archive",
    items: [
      {
        title: "Agent Routing & Modes",
        description: "Live reference for IgniteAI Agent's intent routing — phrases that trigger persona switches and structured card responses.",
        href: "/prototypes/agent-routing",
      },
      {
        title: "Agent Dashboard",
        description: "Admin view for managing IgniteAI Agent credit allocation, user limits, alerts, and settings.",
        href: "/prototypes/agent-dashboard",
      },
    ],
  },
]

function PasswordGate({ onAuth }: { onAuth: () => void }) {
  const [value, setValue] = React.useState("")
  const [error, setError] = React.useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (value === PASSWORD) {
      localStorage.setItem(STORAGE_KEY, "1")
      onAuth()
    } else {
      setError(true)
      setValue("")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-bg-secondary, #f5f7f8)" }}>
      <div className="flex flex-col gap-6 w-full max-w-sm p-8 bg-white rounded-2xl shadow-md">
        <div className="flex flex-col gap-1">
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 20, fontWeight: 600, color: "#273540" }}>
            Prototypes
          </h1>
          <p className="text-sm" style={{ color: "#576773" }}>Enter the password to continue.</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <Input
              size="md"
              type="password"
              placeholder="Password"
              value={value}
              onChange={(e) => { setValue(e.target.value); setError(false) }}
              status={error ? "error" : undefined}
              autoFocus
            />
            {error && <span className="text-sm" style={{ color: "var(--color-error)" }}>Incorrect password.</span>}
          </div>
          <Button variant="primary" size="md" type="submit" className="w-full">
            Continue
          </Button>
        </form>
      </div>
    </div>
  )
}

export default function PrototypesIndex() {
  const router = useRouter()
  const [authed, setAuthed] = React.useState<boolean | null>(null)

  React.useEffect(() => {
    setAuthed(localStorage.getItem(STORAGE_KEY) === "1")
  }, [])

  if (authed === null) return null
  if (!authed) return <PasswordGate onAuth={() => setAuthed(true)} />

  return (
    <AppShell
      sidebarItems={SIDEBAR_ITEMS}
      breadcrumb={BREADCRUMB}
      topNavActions={TOP_NAV_ACTIONS}
      sidebarLogo={
        <img
          src={`${process.env.NEXT_PUBLIC_BASE_PATH}/svg/canvas.svg`}
          alt="Canvas"
          width={40}
          height={40}
        />
      }
      sidebarLogoHref="/prototypes"
      pageTitle="Prototypes"
      pageDescription="Work-in-progress explorations and design prototypes."
      sidebarActiveId="admin"
    >
      <div className="flex flex-col gap-6">
          {GROUPS.map((group, i) => (
            <div key={i} className="flex flex-col gap-3">
              {group.label && (
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 18, fontWeight: 600, color: "#273540" }}>
                  {group.label}
                </h2>
              )}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((p) => (
                  <Card
                    key={p.href}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => router.push(p.href)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle>{p.title}</CardTitle>
                        <ArrowUpRight size={16} strokeWidth={1.75} style={{ color: "#8d959f", flexShrink: 0, marginTop: 3 }} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{p.description}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
    </AppShell>
  )
}
