import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Pill — Status indicator with a color, optional icon, optional label, and status text.
 *
 * @prop color    "neutral" (default) | "info" | "warning" | "success" | "error"
 * @prop icon     Optional Lucide icon component
 * @prop label    Optional prefix label (rendered with a colon: "Label: Status")
 * @prop status   The status text to display
 *
 * @example
 * <Pill status="Active" />
 * <Pill color="success" icon={CheckCircle} status="Completed" />
 * <Pill color="error" label="Status" status="Failed" />
 * <Pill color="info" icon={Info} label="Assigned" status="Tom" />
 */
function Pill({
  color = "neutral",
  icon: Icon,
  label,
  status,
  className,
}: {
  color?: "neutral" | "info" | "warning" | "success" | "error"
  icon?: React.ComponentType<{ className?: string }>
  label?: React.ReactNode
  status: React.ReactNode
  className?: string
}) {
  const { border, text } = {
    neutral: {
      border: "border-[var(--color-stroke-base)]",
      text: "text-[var(--icon-base)]",
    },
    info: {
      border: "border-[var(--color-info)]",
      text: "text-[var(--color-info)]",
    },
    warning: {
      border: "border-[var(--color-warning)]",
      text: "text-[var(--color-warning)]",
    },
    success: {
      border: "border-[var(--color-success)]",
      text: "text-[var(--color-success)]",
    },
    error: {
      border: "border-[var(--color-error)]",
      text: "text-[var(--color-error)]",
    },
  }[color]

  return (
    <div
      data-slot="pill"
      data-color={color}
      className={cn(
        "inline-flex items-center gap-1 h-6 rounded-lg bg-white border px-2 py-1 shrink-0",
        border,
        className,
      )}
    >
      {Icon && <Icon className={cn("w-4 h-4 shrink-0", text)} />}
      <div className="inline-flex items-center gap-0.5">
        {label != null && (
          <span className={cn("text-sm font-semibold leading-none", text)}>
            {label}:
          </span>
        )}
        <span className={cn("text-sm font-semibold leading-none", text)}>
          {status}
        </span>
      </div>
    </div>
  )
}

export { Pill }
