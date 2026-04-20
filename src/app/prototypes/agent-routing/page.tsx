"use client"

import React from "react"
import { LayoutDashboard, BookText, CalendarDays, Inbox, CircleHelp, ShieldUser, Copy, Check } from "lucide-react"
import { AppShell, type SidebarNavItem, type TopNavAction, type BreadcrumbItem } from "@/components/ui/app-shell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tag } from "@/components/ui/tag"
import { IconButton } from "@/components/ui/icon-button"
import { Alert } from "@/components/ui/alert"

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
  { label: "Prototypes", href: "/prototypes" },
  { label: "Agent Routing & Modes" },
]

const PERSONA_PHRASES: { label: string; target: string; examples: string[] }[] = [
  {
    label: "IgniteAI Agent",
    target: "IgniteAI Agent",
    examples: [
      "IgniteAI Agent, how do I submit an assignment?",
      "Hey IgniteAI, where are my grades?",
    ],
  },
  {
    label: "Athena",
    target: "Athena",
    examples: [
      "Athena, help me study for my midterm",
      "Athena explain photosynthesis",
    ],
  },
]

const CARD_PHRASES: { label: string; target: string; examples: string[] }[] = [
  {
    label: "Rubric",
    target: "Rubric Generator",
    examples: [
      "Generate a rubric for this essay",
      "Help me build a rubric",
      "Create a rubric for participation",
    ],
  },
  {
    label: "Course",
    target: "Course Builder",
    examples: [
      "Build a course on intro biology",
      "Help me set up a course",
      "Create a new course",
    ],
  },
]

function CopyablePhrase({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div
      className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg"
      style={{ background: "#f5f7f8" }}
    >
      <span className="text-sm" style={{ color: "#273540" }}>"{text}"</span>
      <IconButton
        icon={copied ? Check : Copy}
        variant="tertiary"
        size="sm"
        aria-label="Copy"
        onClick={handleCopy}
        style={copied ? { color: "var(--color-success)" } : undefined}
      />
    </div>
  )
}

export default function AgentRoutingPage() {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ""

  return (
    <AppShell
      sidebarItems={SIDEBAR_ITEMS}
      breadcrumb={BREADCRUMB}
      topNavActions={TOP_NAV_ACTIONS}
      sidebarLogo={
        <img src={`${base}/svg/canvas.svg`} alt="Canvas" width={40} height={40} />
      }
      sidebarLogoHref="/prototypes"
      pageTitle="Agent Routing & Modes"
      pageDescription="Prototype reference for IgniteAI Agent intent routing."
      sidebarActiveId="admin"
      agentShellEnableModes={true}
    >
      <div className="flex flex-col gap-6">

        <Alert variant="warning" layout="inline">
          These phrases are prototype-only. Production routing logic to be designed by engineering.
        </Alert>

        {/* 1. Open the agent */}
        <Card>
          <CardHeader>
            <CardTitle>1. Open the agent</CardTitle>
            <CardDescription>
              Click the <strong>IgniteAI Agent</strong> button in the top navigation to open the agent panel, then type any of the phrases below.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* 2. Mode switching */}
        <Card>
          <CardHeader>
            <CardTitle>2. Mode switching phrases</CardTitle>
            <CardDescription>
              Mentioning a persona name routes the message to that persona's system prompt and switches the agent mode.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {PERSONA_PHRASES.map((group) => (
                <div key={group.label} className="flex flex-col gap-2">
                  <Tag size="sm">{group.target}</Tag>
                  <div className="flex flex-col gap-1.5">
                    {group.examples.map((ex) => <CopyablePhrase key={ex} text={ex} />)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 3. Feature link phrases */}
        <Card>
          <CardHeader>
            <CardTitle>3. Feature link phrases</CardTitle>
            <CardDescription>
              These phrases trigger a structured response with a feature card linking to a Canvas tool.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {CARD_PHRASES.map((group) => (
                <div key={group.label} className="flex flex-col gap-2">
                  <Tag size="sm">{group.target}</Tag>
                  <div className="flex flex-col gap-1.5">
                    {group.examples.map((ex) => <CopyablePhrase key={ex} text={ex} />)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </AppShell>
  )
}
