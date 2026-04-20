"use client"

import React from "react"
import { LayoutDashboard, BookText, CalendarDays, Inbox, CircleHelp, ShieldUser, Sparkles } from "lucide-react"
import { AppShell, type SidebarNavItem, type TopNavAction, type BreadcrumbItem } from "@/components/ui/app-shell"
import { SoloAgentShell } from "@/components/ui/solo-agent-shell"
import { IGNITE_SUPPORT_CONFIG } from "@/lib/solo-agent-configs"
import { Alert } from "@/components/ui/alert"

const TOP_NAV_ACTIONS: TopNavAction[] = [
  {
    id: "igniteai",
    label: "IgniteAI Agent",
    icon: Sparkles,
    variant: "aiPrimary",
  },
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
  { label: "Support Mode" },
]

const ROLES = [
  { id: "student", label: "Student" },
  { id: "teacher", label: "Teacher" },
  { id: "admin",   label: "Admin" },
] as const

type Role = typeof ROLES[number]["id"]

export default function PandaBotPage() {
  const [role, setRole] = React.useState<Role>("student")

  return (
    <AppShell
      sidebarItems={SIDEBAR_ITEMS}
      breadcrumb={BREADCRUMB}
      topNavActions={TOP_NAV_ACTIONS}
      sidebarLogo={
        <img src={`${process.env.NEXT_PUBLIC_BASE_PATH}/svg/canvas.svg`} alt="Canvas" width={40} height={40} />
      }
      sidebarLogoHref="/prototypes"
      sidebarActiveId="help"
      pageTitle="Support Mode"
      pageDescription="IgniteAI Agent in Support Mode answers Canvas how-to questions for students, educators, and admins. Click the IgniteAI Agent button in the top nav to open the chat."
      agentShellSlot={(open, onClose, inline) => (
        <SoloAgentShell
          open={open}
          onClose={onClose}
          config={IGNITE_SUPPORT_CONFIG}
          role={role}
          inline={inline}
        />
      )}
    >
      <div className="flex flex-col gap-6 max-w-2xl">
        <Alert variant="warning">
          This prototype is for directional purposes only. AI responses are simulated and not connected to a live system.
        </Alert>

        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium" style={{ color: "#273540" }}>Prototype as</p>
          <div className="flex gap-2">
            {ROLES.map(({ id, label }) => (
              <label
                key={id}
                className="flex items-center gap-2 cursor-pointer select-none px-4 py-2 rounded-xl transition-colors"
                style={{
                  border: `1px solid ${role === id ? "#2d6ab4" : "#d4d9de"}`,
                  background: role === id ? "#eef4fc" : "white",
                  color: role === id ? "#1d354f" : "#576773",
                  fontWeight: role === id ? 500 : 400,
                  fontSize: 14,
                }}
              >
                <input
                  type="radio"
                  name="role"
                  value={id}
                  checked={role === id}
                  onChange={() => setRole(id)}
                  className="sr-only"
                />
                <span
                  className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    border: `2px solid ${role === id ? "#2d6ab4" : "#adb5bb"}`,
                    background: "white",
                  }}
                >
                  {role === id && (
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: "#2d6ab4" }}
                    />
                  )}
                </span>
                {label}
              </label>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
