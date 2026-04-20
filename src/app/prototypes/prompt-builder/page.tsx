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
} from "lucide-react"

import { AppShell, type SidebarNavItem, type TopNavAction } from "@/components/ui/app-shell"
import { DEFAULT_SECTIONS } from "@/components/ui/agent-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pill } from "@/components/ui/pill"
import { PromptBuilderModal } from "./prompt-builder-modal"

const TOP_NAV_ACTIONS: TopNavAction[] = [
  { id: "ignite", label: "IgniteAI Agent", variant: "aiPrimary" },
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

export default function PromptBuilderPage() {
  const [sidebarActiveId, setSidebarActiveId] = React.useState("courses")
  const [promptBuilderOpen, setPromptBuilderOpen] = React.useState(false)
  const [agentInput, setAgentInput] = React.useState("")

  // Inject onClick for the prompt-builder item in the agent shell welcome screen
  const agentSections = DEFAULT_SECTIONS.map((section) => ({
    ...section,
    items: section.items.map((item) =>
      item.id === "prompt-builder"
        ? { ...item, onClick: () => setPromptBuilderOpen(true) }
        : item
    ),
  }))

  return (
    <>
      <AppShell
        sidebarItems={SIDEBAR_ITEMS}
        sidebarActiveId={sidebarActiveId}
        onSidebarSelect={setSidebarActiveId}
        sidebarIsAdmin={true}
        sidebarLogo={
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_PATH}/svg/canvas.svg`}
            alt="Canvas"
            width={40}
            height={40}
          />
        }
        sidebarLogoHref="/prototypes"
        breadcrumb={[
          { label: "Courses", href: "/prototypes/prompt-builder" },
          { label: "Biology 101" },
        ]}
        topNavActions={TOP_NAV_ACTIONS}
        pageTitle="Biology 101"
        pageDescription="Introduction to biological sciences — cells, genetics, ecology, and evolution."
        pageDataPoints="Spring 2026 · 3 Credits · Dr. Elena Vasquez"
        pageLabels={
          <>
            <Pill color="success" status="Published" />
            <Pill color="info" status="Undergraduate" />
          </>
        }
        agentShellSections={agentSections}
        agentShellSuggestedPromptsLabel="Biology 101 prompts"
        agentShellPendingInput={agentInput}
      >
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-relaxed" style={{ color: "var(--color-text-primary)" }}>
                Biology 101 provides a broad introduction to the living world. Students will explore
                the molecular basis of life, how cells function and divide, the principles of
                heredity and gene expression, evolutionary theory, and the diversity of organisms
                across ecosystems. No prior science background is required.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What You'll Learn</CardTitle>
            </CardHeader>
            <CardContent>
              <ul
                className="flex flex-col gap-2 text-base list-disc list-inside"
                style={{ color: "var(--color-text-primary)" }}
              >
                <li>Structure and function of prokaryotic and eukaryotic cells</li>
                <li>DNA replication, transcription, and translation</li>
                <li>Mendelian and molecular genetics</li>
                <li>Natural selection and mechanisms of evolution</li>
                <li>Classification and diversity of life</li>
                <li>Ecosystems, energy flow, and nutrient cycling</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </AppShell>

      <PromptBuilderModal
        open={promptBuilderOpen}
        onOpenChange={setPromptBuilderOpen}
        onAddPrompt={(p) => { setAgentInput(p); setTimeout(() => setAgentInput(""), 0) }}
        currentCourse="BIO-101"
        currentTerm="SPRING-2026"
      />
    </>
  )
}
