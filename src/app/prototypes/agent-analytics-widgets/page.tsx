"use client"

import React from "react"
import { ShieldUser, LayoutDashboard, BookText, CalendarDays, Inbox, CircleHelp } from "lucide-react"
import { AppShell, type SidebarNavItem, type BreadcrumbItem } from "@/components/ui/app-shell"
import { Alert } from "@/components/ui/alert"
import {
  HoursSavedCard,
  ActiveUsersCard,
  AvgPerUserCard,
  TopUsageBreakdownCard,
  TopToolCallsCard,
} from "@/app/prototypes/agent-dashboard/_shared"

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
  { label: "Agent Analytics Widgets" },
]

export default function AgentAnalyticsWidgetsPage() {
  const [breakdownBy, setBreakdownBy] = React.useState<"subaccount" | "course" | "role" | "term">("role")

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const state = {
    breakdownBy,
    setBreakdownBy,
    setLimitModalOpen: () => {},
    setAlertsOpen: () => {},
    maxAlloc: 25,
    setMaxAlloc: () => {},
    savedMaxAlloc: 25,
    setSavedMaxAlloc: () => {},
    setMaxAllocSaved: () => {},
  } as any

  return (
    <AppShell
      sidebarItems={SIDEBAR_ITEMS}
      sidebarLogo={
        <img src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/svg/canvas.svg`} alt="Canvas" width={40} height={40} />
      }
      sidebarLogoHref="/prototypes"
      sidebarActiveId="admin"
      sidebarIsAdmin
      breadcrumb={BREADCRUMB}
      pageTitle="Agent Analytics Widgets"
      pageDescription="Analytics widgets for IgniteAI Agent usage."
    >
      <div className="flex flex-col gap-6" style={{ maxWidth: 900 }}>

        <Alert variant="info" layout="inline">
          These widgets are being designed for inclusion in the Analytics Dashboard, where admins will be able to track agent usage alongside other institutional data.
        </Alert>

        <div className="grid grid-cols-3 gap-4">
          <HoursSavedCard />
          <ActiveUsersCard />
          <AvgPerUserCard />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <TopUsageBreakdownCard state={state} />
          <TopToolCallsCard />
        </div>

      </div>
    </AppShell>
  )
}
