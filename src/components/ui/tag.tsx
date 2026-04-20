import * as React from "react"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Tag — Compact label chip with optional leading icon and dismiss button.
 *
 * @prop size       "sm" | "md" (default) | "lg"
 * @prop icon       Optional Lucide icon component shown before the label
 * @prop onDismiss  If provided, renders a dismiss (×) button
 * @prop disabled   50% opacity, no interaction
 *
 * @example
 * <Tag>Design</Tag>
 * <Tag size="sm" icon={Tag} onDismiss={() => remove(id)}>React</Tag>
 * <Tag size="lg" disabled>Archived</Tag>
 */
function Tag({
  size = "md",
  icon: Icon,
  onDismiss,
  disabled,
  children,
  className,
}: {
  size?: "sm" | "md" | "lg"
  icon?: React.ComponentType<{ className?: string }>
  onDismiss?: () => void
  disabled?: boolean
  children: React.ReactNode
  className?: string
}) {
  const sizeClass = {
    sm: "h-6 text-xs",
    md: "h-7 text-sm",
    lg: "h-8 text-base",
  }[size]

  return (
    <div
      data-slot="tag"
      data-size={size}
      className={cn(
        "inline-flex items-center gap-2 shrink-0 rounded-lg px-2",
        "bg-[var(--btn-secondary-bg)] text-[var(--icon-base)]",
        !disabled && !!onDismiss && "hover:bg-[var(--btn-secondary-bg-hover)]",
        disabled && "opacity-50 pointer-events-none",
        sizeClass,
        className,
      )}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      <span className="leading-none">{children}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          disabled={disabled}
          aria-label="Remove"
          className={cn(
            "group/dismiss rounded-sm p-0.5 -mr-1 shrink-0",

            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-info)]",
          )}
        >
          <X className="w-4 h-4 text-[var(--icon-muted)] group-hover/dismiss:text-[var(--icon-base)]" />
        </button>
      )}
    </div>
  )
}

export { Tag }
