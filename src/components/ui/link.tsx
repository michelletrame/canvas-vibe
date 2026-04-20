import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Link — Styled anchor with optional leading/trailing icon.
 *
 * @prop size          "sm" | "md" (default) | "lg"
 * @prop color         "base" (default) | "onColor"
 * @prop icon          Optional Lucide icon component
 * @prop iconPlacement "start" (default) | "end"
 * @prop disabled      Removes href, muted colors, cursor-not-allowed
 *
 * @example
 * <Link href="/dashboard">Dashboard</Link>
 * <Link href="/back" icon={ArrowLeft}>Back</Link>
 * <Link href="/next" icon={ArrowRight} iconPlacement="end">Next</Link>
 * <Link color="onColor" href="/help">Help</Link>
 */
function Link({
  href,
  size = "md",
  color = "base",
  icon: Icon,
  iconPlacement = "start",
  disabled,
  children,
  className,
  ...props
}: React.ComponentProps<"a"> & {
  size?: "sm" | "md" | "lg"
  color?: "base" | "onColor"
  icon?: React.ComponentType<{ className?: string }>
  iconPlacement?: "start" | "end"
  disabled?: boolean
}) {
  const gapClass = size === "sm" ? "gap-0.5" : "gap-1"

  const textClass = {
    sm: "text-sm font-medium leading-none",
    md: "text-base font-medium leading-none",
    lg: "text-[28px] font-medium leading-none",
  }[size]

  const iconClass = {
    sm: "w-3 h-3 shrink-0",
    md: "w-4 h-4 shrink-0",
    lg: "w-6 h-6 shrink-0",
  }[size]

  const textColor =
    disabled
      ? color === "base"
        ? "text-[var(--color-stroke-base)]"
        : "text-[var(--input-border-disabled)]"
      : color === "base"
        ? "text-[var(--link-text)] hover:text-[var(--link-text-hover)]"
        : "text-white hover:text-[var(--link-oncolor-text-hover)]"

  const iconColor =
    disabled
      ? color === "base"
        ? "text-[var(--color-stroke-base)]"
        : "text-[var(--border)]"
      : color === "base"
        ? "text-[var(--link-icon)] group-hover:text-[var(--link-icon-hover)]"
        : "text-white group-hover:text-[var(--link-oncolor-icon-hover)]"

  return (
    <a
      href={disabled ? undefined : href}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : undefined}
      data-slot="link"
      data-color={color}
      className={cn(
        "group inline-flex items-center",
        gapClass,
        textClass,
        textColor,
        disabled && "cursor-not-allowed",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-info)] focus-visible:rounded-sm",
        className,
      )}
      {...props}
    >
      {Icon && iconPlacement === "start" && (
        <Icon className={cn(iconClass, iconColor)} />
      )}
      {children}
      {Icon && iconPlacement === "end" && (
        <Icon className={cn(iconClass, iconColor)} />
      )}
    </a>
  )
}

export { Link }
