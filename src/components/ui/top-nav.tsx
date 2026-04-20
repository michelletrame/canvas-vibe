"use client"

import * as React from "react"
import { Menu } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { IconButton } from "@/components/ui/icon-button"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import type { BreadcrumbItem } from "@/components/ui/breadcrumb"
import { cn } from "@/lib/utils"

// ── Types ─────────────────────────────────────────────────────────────────────

export type TopNavAction = {
  id: string
  icon?: LucideIcon
  /** Image src — when set, renders a custom image button instead of an icon button */
  imageSrc?: string
  label: string
  variant?: string
  onClick?: () => void
}

// ── Main component ────────────────────────────────────────────────────────────

/**
 * TopNav — 66px desktop top navigation bar.
 *
 * Left side: hamburger icon button + breadcrumb trail.
 * Right side: configurable icon button actions.
 *
 * Designed to sit to the right of the Sidebar (fixed, full-height).
 * Place inside a `fixed left-[118px] right-0 top-0 z-30` container.
 *
 * @prop breadcrumb   Ordered crumb items (last = current page)
 * @prop actions      Icon buttons rendered on the right side
 * @prop onMenuClick  Called when the hamburger button is clicked
 *
 * @example
 * <div className="fixed left-[118px] right-0 top-0 z-30">
 *   <TopNav
 *     breadcrumb={[{ label: "Courses", href: "/courses" }, { label: "Dashboard" }]}
 *     actions={[{ id: "help", icon: CircleHelp, label: "Help" }]}
 *   />
 * </div>
 */
function TopNav({
  breadcrumb,
  actions = [],
  onMenuClick,
  className,
}: {
  breadcrumb: BreadcrumbItem[]
  actions?: TopNavAction[]
  onMenuClick?: () => void
  className?: string
}) {
  return (
    <header
      data-slot="top-nav"
      className={cn(
        "flex items-center h-[66px] px-6 gap-6",
        "bg-white rounded-2xl",
        "shadow-[0_2px_3.5px_2px_rgba(35,68,101,0.10),0_1px_1.75px_0_rgba(35,68,101,0.15)]",
        className,
      )}
    >
      {/* Left: hamburger + breadcrumb */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <IconButton
          type="button"
          variant="ghost"
          size="md"
          icon={Menu}
          aria-label="Toggle menu"
          onClick={onMenuClick}
        />
        <Breadcrumb items={breadcrumb} />
      </div>

      {/* Right: action icon buttons */}
      {actions.length > 0 && (
        <div className="flex items-center gap-3 shrink-0">
          {actions.map((action) =>
            action.imageSrc ? (
              <button
                key={action.id}
                type="button"
                aria-label={action.label}
                onClick={action.onClick}
                className="flex items-center justify-center w-9 h-9 rounded-xl transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#111]"
                style={{ background: "#111" }}
              >
                <img src={action.imageSrc} width={24} height={24} alt="" aria-hidden style={{ objectFit: "contain" }} />
              </button>
            ) : (
              <IconButton
                key={action.id}
                type="button"
                variant={(action.variant as Parameters<typeof IconButton>[0]["variant"]) ?? "ghost"}
                size="md"
                icon={action.icon!}
                aria-label={action.label}
                onClick={action.onClick}
              />
            )
          )}
        </div>
      )}
    </header>
  )
}

export { TopNav }
export type { BreadcrumbItem }
