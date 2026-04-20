import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  [
    "w-full min-w-0 border border-[var(--input-border)] rounded-[var(--input-radius)]",
    "bg-[var(--input-bg)] text-[var(--foreground)]",
    "transition-[background-color,border-color,box-shadow] outline-none font-normal",
    "placeholder:text-[var(--input-placeholder)]",
    "hover:bg-[var(--input-bg-hover)] hover:border-[var(--input-border-hover)]",
    // Focus ring: 2px solid, 3px offset — matches Pencil .FocusRing (cornerRadius +3, thickness 2)
    "focus-visible:bg-[var(--input-bg)] focus-visible:border-[var(--color-info)]",
    "focus-visible:ring-2 focus-visible:ring-[var(--color-info)] focus-visible:ring-offset-[3px]",
    "disabled:pointer-events-none disabled:cursor-not-allowed",
    "disabled:bg-[var(--input-bg-disabled)] disabled:border-[var(--input-border-disabled)]",
    "disabled:text-[var(--input-text-disabled)] disabled:placeholder:text-[var(--input-text-disabled)]",
    "read-only:pointer-events-none read-only:bg-[var(--input-bg-readonly)]",
    "read-only:border-[var(--input-border-readonly)]",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "h-8 pl-2 pr-3 text-sm",
        md: "h-10 px-3 text-base",
        lg: "h-12 px-3 text-xl",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

/** Icon px size per input size */
const iconPxMap: Record<string, number> = { sm: 16, md: 20, lg: 20 }

/** Extra left padding when a leading icon is present: edge-pad + icon-size + gap */
const iconLeftPadMap: Record<string, string> = {
  // sm: 8px + 16px + 8px = 32px = pl-8
  sm: "pl-8",
  // md/lg: 12px + 20px + 12px = 44px = pl-11
  md: "pl-11",
  lg: "pl-11",
}

/** Extra right padding when a trailing icon is present */
const iconRightPadMap: Record<string, string> = { sm: "pr-8", md: "pr-11", lg: "pr-11" }

/** Shared styles for a clickable icon button rendered inside the input */
const iconButtonClass =
  "absolute top-1/2 -translate-y-1/2 shrink-0 flex items-center justify-center " +
  "rounded-[4px] text-[var(--icon-base)] transition-colors " +
  "hover:bg-[var(--btn-tertiary-bg-hover)] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-info)] " +
  "disabled:pointer-events-none disabled:opacity-50"

/** Button size per input size */
const iconBtnSizeMap: Record<string, string> = { sm: "size-5", md: "size-6", lg: "size-6" }

// Status only overrides border — focus ring always stays blue (Pencil .FocusRing is always #2b7abc)
const statusClasses = {
  error:
    "border-[var(--input-border-error)] hover:border-[var(--input-border-error)] focus-visible:border-[var(--input-border-error)]",
  success:
    "border-[var(--input-border-success)] hover:border-[var(--input-border-success)] focus-visible:border-[var(--input-border-success)]",
} as const

/**
 * Input — Pencil text input component.
 *
 * @prop size             "sm" (32px) | "md" (40px) | "lg" (48px)
 * @prop status           "error" | "success" — colors border and focus ring
 * @prop leftIcon         Optional Lucide icon rendered inside the input on the left
 * @prop rightIcon        Optional Lucide icon rendered inside the input on the right
 * @prop onLeftIconClick  When provided, the left icon becomes a clickable button
 * @prop onRightIconClick When provided, the right icon becomes a clickable button
 *
 * @example
 * <Input size="md" placeholder="Search…" leftIcon={Search} />
 * <Input size="md" type="password" rightIcon={Eye} onRightIconClick={toggleVisibility} />
 */
function Input({
  className,
  size = "md",
  status,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  onLeftIconClick,
  onRightIconClick,
  disabled,
  ...props
}: Omit<React.ComponentProps<"input">, "size"> &
  VariantProps<typeof inputVariants> & {
    status?: "error" | "success"
    leftIcon?: LucideIcon
    rightIcon?: LucideIcon
    onLeftIconClick?: () => void
    onRightIconClick?: () => void
  }) {
  const iconPx = iconPxMap[size ?? "md"] ?? 20
  // Must use full class strings (not template literals) so Tailwind JIT includes them
  const iconLeftInset = size === "sm" ? "left-2" : "left-3"
  const iconRightInset = size === "sm" ? "right-2" : "right-3"
  const iconClass = cn(
    "absolute top-1/2 -translate-y-1/2 pointer-events-none shrink-0",
    disabled ? "text-[var(--input-text-disabled)]" : "text-[var(--icon-base)]"
  )
  const iconBtnSize = iconBtnSizeMap[size ?? "md"]

  const inputEl = (
    <input
      data-slot="input"
      data-size={size}
      disabled={disabled}
      className={cn(
        inputVariants({ size }),
        status && statusClasses[status],
        LeftIcon && iconLeftPadMap[size ?? "md"],
        RightIcon && iconRightPadMap[size ?? "md"],
        className
      )}
      {...props}
    />
  )

  if (!LeftIcon && !RightIcon) return inputEl

  return (
    <div className="relative">
      {LeftIcon && (
        onLeftIconClick ? (
          <button
            type="button"
            onClick={onLeftIconClick}
            disabled={disabled}
            className={cn(iconButtonClass, iconBtnSize, iconLeftInset)}
          >
            <LeftIcon width={iconPx} height={iconPx} strokeWidth={1.5} aria-hidden />
          </button>
        ) : (
          <LeftIcon
            width={iconPx}
            height={iconPx}
            strokeWidth={1.5}
            className={cn(iconClass, iconLeftInset)}
            aria-hidden
          />
        )
      )}
      {inputEl}
      {RightIcon && (
        onRightIconClick ? (
          <button
            type="button"
            onClick={onRightIconClick}
            disabled={disabled}
            className={cn(iconButtonClass, iconBtnSize, iconRightInset)}
          >
            <RightIcon width={iconPx} height={iconPx} strokeWidth={1.5} aria-hidden />
          </button>
        ) : (
          <RightIcon
            width={iconPx}
            height={iconPx}
            strokeWidth={1.5}
            className={cn(iconClass, iconRightInset)}
            aria-hidden
          />
        )
      )}
    </div>
  )
}

export { Input, inputVariants }
