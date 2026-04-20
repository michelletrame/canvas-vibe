"use client"

import * as React from "react"

import { Sidebar } from "@/components/ui/sidebar"
import type { SidebarNavItem } from "@/components/ui/sidebar"
import { TopNav } from "@/components/ui/top-nav"
import type { TopNavAction, BreadcrumbItem } from "@/components/ui/top-nav"
import { AgentShell } from "@/components/ui/agent-shell"
import type { AgentShellSection } from "@/components/ui/agent-shell"
import { cn } from "@/lib/utils"

// ── Helpers ───────────────────────────────────────────────────────────────────

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(false)
  React.useEffect(() => {
    const mql = window.matchMedia(query)
    setMatches(mql.matches)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mql.addEventListener("change", handler)
    return () => mql.removeEventListener("change", handler)
  }, [query])
  return matches
}

// ── Main component ────────────────────────────────────────────────────────────

/**
 * AppShell — Full-page layout wrapper: sidebar + card top nav + scrollable content.
 *
 * Layout (flex row, no overflow):
 *   [Sidebar] [Right column: flex-col]
 *                ├─ TopNav (shrink-0, pt-3 pr-3 pb-3 pl-0)
 *                └─ Content area (flex-1, relative, overflow hidden)
 *                     ├─ Scroll wrapper (absolute inset-0, overflow-y-auto) ← only scrollbar
 *                     └─ AgentShell (absolute overlay on the right)
 *
 * Sidebar width: 118px expanded, 78px minimized — transitions with flex layout.
 *
 * When `pageTitle` is provided, a structured page header renders above the children:
 *   title → description → data points → labels → tab nav (all optional except title)
 *
 * Any topNavAction with `variant: "aiPrimary"` automatically toggles the AgentShell.
 *
 * @prop sidebarItems            Main sidebar nav items
 * @prop sidebarCustomItems      Optional second group of sidebar items (below separator)
 * @prop sidebarActiveId         Controlled active nav item id
 * @prop onSidebarSelect         Called when a sidebar item is clicked
 * @prop sidebarIsAdmin          Show adminOnly sidebar items
 * @prop sidebarLogo             Content for the 85px sidebar logo area
 * @prop defaultSidebarMinimized Initial sidebar collapsed state (default: false)
 * @prop breadcrumb              Top nav breadcrumb items (last = current page)
 * @prop topNavActions           Icon buttons rendered on the top nav right side
 * @prop onMenuClick             Called when the hamburger button is clicked
 * @prop agentShellSections      Custom welcome sections for the AgentShell panel
 * @prop agentShellUserName      Name shown in the AgentShell greeting
 * @prop pageTitle               Page heading (enables structured page layout)
 * @prop pageDescription         Optional subtitle below the page title
 * @prop pageDataPoints          Optional metadata line below the description
 * @prop pageLabels              Optional label/pill chips row
 * @prop pageTabNav              Optional tab navigation rendered below the labels
 * @prop pageActions             Optional action buttons rendered top-right of header
 * @prop children                Page content — rendered below the page header
 */
function AppShell({
  sidebarItems,
  sidebarCustomItems,
  sidebarActiveId,
  onSidebarSelect,
  sidebarIsAdmin = false,
  sidebarLogo,
  sidebarLogoHref,
  defaultSidebarMinimized = false,
  breadcrumb,
  topNavActions,
  onMenuClick,
  agentShellSections,
  agentShellUserName,
  agentShellPendingInput,
  agentShellEnableModes,
  agentShellSuggestedPrompts,
  agentShellSuggestedPromptsLabel,
  agentShellSlot,
  pageTitle,
  pageTitleIcon,
  pageDescription,
  pageDataPoints,
  pageLabels,
  pageTabNav,
  pageActions,
  children,
  fullWidth,
  hideTopNav,
  className,
}: {
  sidebarItems: SidebarNavItem[]
  sidebarCustomItems?: SidebarNavItem[]
  sidebarActiveId?: string
  onSidebarSelect?: (id: string) => void
  sidebarIsAdmin?: boolean
  sidebarLogo?: React.ReactNode
  sidebarLogoHref?: string
  defaultSidebarMinimized?: boolean
  breadcrumb: BreadcrumbItem[]
  topNavActions?: TopNavAction[]
  onMenuClick?: () => void
  agentShellSections?: AgentShellSection[]
  agentShellUserName?: string
  agentShellPendingInput?: string
  /** When true, shows mode switching UI (ModeSelect, Agent modes section). Default false. */
  agentShellEnableModes?: boolean
  agentShellSuggestedPrompts?: string[]
  agentShellSuggestedPromptsLabel?: string
  /** Optional override: render a custom agent shell instead of the default AgentShell. Receives `open` and `onClose`. */
  agentShellSlot?: (open: boolean, onClose: () => void, inline: boolean) => React.ReactNode
  pageTitle?: string
  pageTitleIcon?: React.ReactNode
  pageDescription?: string
  pageDataPoints?: string
  pageLabels?: React.ReactNode
  pageTabNav?: React.ReactNode
  pageActions?: React.ReactNode
  children: React.ReactNode
  /** When true, children fill the scroll container directly with no max-width or padding wrapper. */
  fullWidth?: boolean
  /** When true, the top nav bar is not rendered. */
  hideTopNav?: boolean
  className?: string
}) {
  const [minimized, setMinimized] = React.useState(defaultSidebarMinimized)
  const [agentOpen, setAgentOpen] = React.useState(false)
  const isInline = useMediaQuery("(min-width: 1280px)")

  // Intercept any aiPrimary action to toggle the agent shell.
  // The action's own onClick (if any) still fires alongside the toggle.
  const enhancedTopNavActions = React.useMemo(
    () =>
      topNavActions?.map((action) =>
        action.variant === "aiPrimary"
          ? {
              ...action,
              onClick: () => {
                setAgentOpen((v) => !v)
                action.onClick?.()
              },
            }
          : action,
      ),
    [topNavActions],
  )

  return (
    <div
      className={cn("flex h-screen overflow-hidden", className)}
      style={{ backgroundColor: "var(--color-bg-page)" }}
    >
      {/* Sidebar — flex child, width animates with minimize state */}
      <div
        className={cn(
          "shrink-0 h-screen z-40",
          "transition-[width] duration-200 ease-in-out",
          minimized ? "w-[78px]" : "w-[118px]",
        )}
      >
        <Sidebar
          items={sidebarItems}
          customItems={sidebarCustomItems}
          activeId={sidebarActiveId}
          onSelect={onSidebarSelect}
          isAdmin={sidebarIsAdmin}
          logo={sidebarLogo}
          logoHref={sidebarLogoHref}
          defaultMinimized={defaultSidebarMinimized}
          onMinimizeChange={setMinimized}
        />
      </div>

      {/* Right column */}
      <div className="flex flex-col flex-1 min-w-0 h-screen">
        {/* TopNav — shrink-0, card padding matches design spec */}
        {!hideTopNav && (
        <div className="shrink-0 relative z-10 pt-3 pr-3 pl-0">
          <TopNav
            breadcrumb={breadcrumb}
            actions={enhancedTopNavActions}
            onMenuClick={onMenuClick}
          />
        </div>
        )}

        {/* Content area — fills remaining height, clips overflow */}
        <div className={cn("flex-1 min-h-0", isInline ? "flex" : "relative")}>
          {/* Scroll wrapper — the only scrollbar on the page */}
          <div className={cn("overflow-y-auto no-scrollbar", isInline ? "flex-1 min-w-0 h-full" : "absolute inset-0")}>
            {fullWidth ? children : (
            <div className="max-w-[1100px] mx-auto px-4 pb-4 pt-8">
              {pageTitle != null ? (
                <div className="flex flex-col gap-6">
                  {/* Page header */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start gap-3">
                      {/* Left: title, description, data points, labels */}
                      <div className="flex-1 min-w-0 flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          {pageTitleIcon}
                          <h1
                            className="leading-[1.25] font-bold"
                            style={{
                              fontFamily: "var(--font-heading)",
                              fontSize: 40,
                              color: "var(--color-text-primary)",
                            }}
                          >
                            {pageTitle}
                          </h1>
                        </div>
                        {pageDescription && (
                          <p
                            className="leading-[1.5]"
                            style={{ fontSize: 20, color: "var(--color-text-primary)" }}
                          >
                            {pageDescription}
                          </p>
                        )}
                        {pageDataPoints && (
                          <p
                            className="text-sm leading-[1.5]"
                            style={{ color: "var(--color-text-secondary)" }}
                          >
                            {pageDataPoints}
                          </p>
                        )}
                        {pageLabels && (
                          <div className="flex items-center gap-3">{pageLabels}</div>
                        )}
                      </div>
                      {/* Right: action buttons */}
                      {pageActions && (
                        <div className="flex items-center gap-3 shrink-0 pt-2">
                          {pageActions}
                        </div>
                      )}
                    </div>
                    {/* Tab navigation — spans full width below the header row */}
                    {pageTabNav && <div>{pageTabNav}</div>}
                  </div>

                  {/* Page content */}
                  {children}
                </div>
              ) : (
                children
              )}
            </div>
            )}
          </div>

          {/* Agent Shell — inline at xl+, overlay below */}
          {agentShellSlot
            ? agentShellSlot(agentOpen, () => setAgentOpen(false), isInline)
            : <AgentShell
                open={agentOpen}
                onClose={() => setAgentOpen(false)}
                sections={agentShellSections}
                userName={agentShellUserName}
                pendingInput={agentShellPendingInput}
                enableModes={agentShellEnableModes}
                suggestedPrompts={agentShellSuggestedPrompts}
                suggestedPromptsLabel={agentShellSuggestedPromptsLabel}
                inline={isInline}
              />
          }
        </div>
      </div>
    </div>
  )
}

export { AppShell }
export type { SidebarNavItem, TopNavAction, BreadcrumbItem }
export type { AgentShellSection }
