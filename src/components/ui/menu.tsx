"use client"

import * as React from "react"
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui"
import { type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

// ── Root ──────────────────────────────────────────────────────────────────────

/**
 * Menu — Composable dropdown action menu.
 *
 * Shares visual language with Select (same border, shadow, item styles).
 * Intended for contextual action menus triggered by icon buttons (e.g. MoreVertical).
 *
 * @example
 * <Menu>
 *   <MenuTrigger>
 *     <button aria-label="Options"><MoreVertical /></button>
 *   </MenuTrigger>
 *   <MenuContent>
 *     <MenuItem icon={Trash2} variant="destructive">Delete</MenuItem>
 *   </MenuContent>
 * </Menu>
 */
function Menu({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root {...props} />
}

// ── Trigger ───────────────────────────────────────────────────────────────────

function MenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return <DropdownMenuPrimitive.Trigger asChild data-slot="menu-trigger" {...props} />
}

// ── Content ───────────────────────────────────────────────────────────────────

function MenuContent({
  className,
  sideOffset = 4,
  align = "end",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="menu-content"
        sideOffset={sideOffset}
        align={align}
        className={cn(
          "z-50 min-w-[8rem] overflow-hidden rounded-xl p-1",
          "border border-[var(--color-stroke-base)] bg-white",
          "shadow-[var(--shadow-popover)]",
          // Animations — matches SelectContent
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
          "data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2",
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

// ── Item ──────────────────────────────────────────────────────────────────────

/**
 * MenuItem — a single action in the menu.
 *
 * @prop icon        Optional Lucide icon rendered on the left (16px)
 * @prop imageSrc    Optional image src rendered instead of icon (e.g. custom SVG logos)
 * @prop variant     "default" | "destructive" — destructive renders text/icon in error red
 */
function MenuItem({
  className,
  children,
  icon: Icon,
  imageSrc,
  variant = "default",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  icon?: LucideIcon
  imageSrc?: string
  variant?: "default" | "destructive"
}) {
  const isDestructive = variant === "destructive"
  return (
    <DropdownMenuPrimitive.Item
      data-slot="menu-item"
      className={cn(
        // Layout
        "group relative flex items-center gap-2 rounded-lg px-3 py-2 w-full",
        // Text
        "text-base select-none cursor-pointer outline-none",
        // Default colors
        !isDestructive && "text-[var(--input-label)] data-[highlighted]:bg-[var(--btn-tertiary-bg-hover)]",
        // Destructive colors
        isDestructive && "text-[var(--color-error)] data-[highlighted]:bg-[#fef2f2]",
        // Disabled
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      {imageSrc
        ? <img src={imageSrc} width={16} height={16} alt="" aria-hidden className="shrink-0" style={{ objectFit: "contain" }} />
        : Icon && (
          <Icon
            width={16}
            height={16}
            strokeWidth={1.5}
            aria-hidden
            className={cn(
              "shrink-0",
              isDestructive ? "text-[var(--color-error)]" : "text-[var(--icon-base)]"
            )}
          />
        )
      }
      {children}
    </DropdownMenuPrimitive.Item>
  )
}

// ── Separator ─────────────────────────────────────────────────────────────────

function MenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="menu-separator"
      className={cn("-mx-1 my-1 h-px bg-[var(--color-stroke-muted)]", className)}
      {...props}
    />
  )
}

export { Menu, MenuTrigger, MenuContent, MenuItem, MenuSeparator }
