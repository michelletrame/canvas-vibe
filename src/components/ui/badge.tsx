import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Badge — Notification indicator with two types:
 *
 * type="number"  A pill showing a count. Perfectly circular for single digits,
 *                pill-shaped for two+ digits. Caps display at 99+.
 * type="dot"     A 12×12 circle indicator with no text.
 *
 * @prop type     "number" (default) | "dot"
 * @prop color    "info" | "success" | "error" | "onColor"
 * @prop count    Number to display (type="number" only). Shown as 99+ when > 99.
 *
 * @example
 * <Badge count={3} />
 * <Badge count={120} color="error" />
 * <Badge type="dot" color="success" />
 */
function Badge({
  type = "number",
  color = "error",
  count,
  className,
}: {
  type?: "number" | "dot"
  color?: "info" | "success" | "error" | "onColor"
  count?: number
  className?: string
}) {
  const colorClass = {
    info: "bg-[var(--color-info)]",
    success: "bg-[var(--color-success)]",
    error: "bg-[var(--color-error)]",
    onColor: "bg-white",
  }[color]

  const textColorClass = color === "onColor"
    ? "text-[var(--icon-base)]"
    : "text-white"

  if (type === "dot") {
    return (
      <span
        data-slot="badge"
        data-type="dot"
        className={cn(
          "inline-block h-3 w-3 rounded-full shrink-0",
          colorClass,
          className
        )}
      />
    )
  }

  const label = count === undefined ? "" : count > 99 ? "99+" : String(count)

  return (
    <span
      data-slot="badge"
      data-type="number"
      className={cn(
        // h-5 = 20px; min-w-5 ensures a single digit is a perfect circle
        "inline-flex items-center justify-center",
        "h-5 min-w-5 rounded-full px-1",
        "text-sm font-semibold leading-none text-center tabular-nums",
        colorClass,
        textColorClass,
        className
      )}
    >
      {label}
    </span>
  )
}

export { Badge }
