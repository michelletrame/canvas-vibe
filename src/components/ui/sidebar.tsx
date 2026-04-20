"use client"

import * as React from "react"
import Link from "next/link"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"

import { Avatar } from "@/components/ui/avatar"
import { Icon } from "@/components/ui/icon"
import { cn } from "@/lib/utils"

// ── Types ─────────────────────────────────────────────────────────────────────

export type SidebarNavItem = {
  id: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
  avatar?: { src?: string; initials?: string } // renders Avatar instead of icon
  badge?: number      // notification count — omit to hide
  adminOnly?: boolean // only rendered when isAdmin=true
}

// ── Internal helpers ──────────────────────────────────────────────────────────

function NavItem({
  item,
  isActive,
  minimized,
  onClick,
}: {
  item: SidebarNavItem
  isActive: boolean
  minimized: boolean
  onClick: () => void
}) {
  const Icon = item.icon

  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "relative w-full flex flex-col items-center rounded-xl p-1.5",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sidebar-ring)]",
        "transition-colors",
        isActive
          ? "bg-[#1d354f] text-white"
          : "text-[var(--icon-base)] hover:bg-[var(--btn-tertiary-bg-hover)]",
      )}
    >
      {/* Badge */}
      {item.badge != null && item.badge > 0 && (
        <span
          aria-label={`${item.badge} notifications`}
          className={cn(
            "absolute top-1 right-1 h-5 min-w-5 px-1",
            "rounded-full text-xs font-semibold leading-5 text-center",
            isActive
              ? "bg-white text-[var(--sidebar-item-active)]"
              : "bg-[var(--sidebar-primary)] text-white",
          )}
        >
          {item.badge}
        </span>
      )}

      {/* Avatar or Icon */}
      <div className="h-9 w-full flex items-center justify-center">
        {item.avatar ? (
          <Avatar
            size="xSmall"
            showBorder
            src={item.avatar.src}
            initials={item.avatar.initials}
          />
        ) : Icon ? (
          <Icon className="w-6 h-6 shrink-0" />
        ) : null}
      </div>

      {/* Label */}
      {!minimized && (
        <span className="text-sm leading-normal text-center w-full truncate">
          {item.label}
        </span>
      )}
    </button>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

/**
 * Sidebar — Narrow icon-rail navigation (Canvas-style).
 *
 * Expanded: 94px card (+ 12px outer padding = 118px total).
 * Minimized: 54px card (+ 12px outer padding = 78px total).
 * Icons + labels when expanded; icons only when minimized.
 *
 * Place inside a fixed/sticky container sized to fit (e.g. h-screen).
 *
 * @prop items            Standard nav items
 * @prop customItems      Add-on items rendered below a separator
 * @prop activeId         Controlled active item id
 * @prop onSelect         Called when an item is clicked
 * @prop isAdmin          Show items marked adminOnly
 * @prop logo             Content for the 85px logo area at top
 * @prop defaultMinimized Initial collapsed state (default: false)
 * @prop onMinimizeChange Called when minimized state changes
 *
 * @example
 * <div className="fixed inset-y-0 left-0 z-40 h-screen">
 *   <Sidebar items={NAV_ITEMS} activeId={id} onSelect={setId} />
 * </div>
 */
function Sidebar({
  items,
  customItems,
  activeId: activeIdProp,
  onSelect,
  isAdmin = false,
  logo,
  logoHref,
  defaultMinimized = false,
  onMinimizeChange,
  className,
}: {
  items: SidebarNavItem[]
  customItems?: SidebarNavItem[]
  activeId?: string
  onSelect?: (id: string) => void
  isAdmin?: boolean
  logo?: React.ReactNode
  logoHref?: string
  defaultMinimized?: boolean
  onMinimizeChange?: (minimized: boolean) => void
  className?: string
}) {
  const [minimized, setMinimized] = React.useState(defaultMinimized)
  const [activeId, setActiveId] = React.useState(activeIdProp)

  React.useEffect(() => {
    setActiveId(activeIdProp)
  }, [activeIdProp])

  function handleSelect(id: string) {
    setActiveId(id)
    onSelect?.(id)
  }

  function toggleMinimized() {
    const next = !minimized
    setMinimized(next)
    onMinimizeChange?.(next)
  }

  const visibleItems = items.filter((item) => !item.adminOnly || isAdmin)

  return (
    <aside
      data-slot="sidebar"
      data-minimized={minimized}
      className={cn("h-full p-3 flex flex-col", className)}
    >
      {/* Card */}
      <div
        className={cn(
          "flex-1 flex flex-col rounded-2xl bg-white overflow-hidden",
          "shadow-[0_2px_3.5px_2px_rgba(0,0,0,0.15),0_1px_1.75px_0_rgba(0,0,0,0.30)]",
          "transition-[width] duration-200 ease-in-out",
          minimized ? "w-[54px]" : "w-[94px]",
        )}
      >
        {/* Logo area */}
        <div className="h-[85px] flex items-center justify-center shrink-0">
          {logoHref ? (
            <Link href={logoHref} className="flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sidebar-ring)] rounded-xl">
              {logo}
            </Link>
          ) : logo}
        </div>

        {/* Nav items */}
        <nav className="flex-1 flex flex-col gap-1 px-1.5 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {visibleItems.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              isActive={item.id === activeId}
              minimized={minimized}
              onClick={() => handleSelect(item.id)}
            />
          ))}

          {customItems && customItems.length > 0 && (
            <>
              <hr className="my-1 border-[var(--sidebar-border)]" />
              {customItems.map((item) => (
                <NavItem
                  key={item.id}
                  item={item}
                  isActive={item.id === activeId}
                  minimized={minimized}
                  onClick={() => handleSelect(item.id)}
                />
              ))}
            </>
          )}
        </nav>

        {/* Minimize button */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={toggleMinimized}
            aria-label={minimized ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "w-full flex items-center justify-center p-1.5 h-12",
              "rounded-[0_0_16px_16px]",
              "text-[var(--icon-base)] hover:bg-[var(--btn-tertiary-bg-hover)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sidebar-ring)]",
              "transition-colors",
            )}
          >
            {minimized ? (
              <Icon icon={PanelLeftOpen} size="lg" color="base" />
            ) : (
              <Icon icon={PanelLeftClose} size="lg" color="base" />
            )}
          </button>
        </div>
      </div>
    </aside>
  )
}

export { Sidebar }
