"use client"

import { LayoutDashboard, BookText, CalendarDays, Inbox, CircleHelp, ShieldUser, Sparkles } from "lucide-react"
import { AppShell, type SidebarNavItem, type BreadcrumbItem } from "@/components/ui/app-shell"
import { AgentShell } from "@/components/ui/agent-shell"

const SIDEBAR_ITEMS: SidebarNavItem[] = [
  { id: "account",   label: "Account",   avatar: { src: "https://i.pravatar.cc/150?img=47" } },
  { id: "admin",     label: "Admin",     icon: ShieldUser, adminOnly: true },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "agent",     label: "Agent",     icon: Sparkles },
  { id: "courses",   label: "Courses",   icon: BookText },
  { id: "calendar",  label: "Calendar",  icon: CalendarDays },
  { id: "inbox",     label: "Inbox",     icon: Inbox },
  { id: "help",      label: "Help",      icon: CircleHelp },
]

const BREADCRUMB: BreadcrumbItem[] = [
  { label: "Prototypes", href: "/prototypes" },
  { label: "Standalone Agent" },
]

export default function StandaloneAgentPage() {
  return (
    <AppShell
      sidebarItems={SIDEBAR_ITEMS}
      sidebarActiveId="agent"
      sidebarLogo={
        <img src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/svg/canvas.svg`} alt="Canvas" width={40} height={40} />
      }
      sidebarLogoHref="/prototypes"
      breadcrumb={BREADCRUMB}
      fullWidth
      hideTopNav
    >
      <div className="h-full p-4">
        <AgentShell
          variant="embedded"
          open={true}
          onClose={() => {}}
        />
      </div>
    </AppShell>
  )
}
