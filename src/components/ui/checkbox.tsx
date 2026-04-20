"use client"

import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"
import { Check, Minus } from "lucide-react"

import { cn } from "@/lib/utils"

// ── Atom ──────────────────────────────────────────────────────────────────────

/**
 * Checkbox — 24×24 control. Supports checked, indeterminate, and disabled states.
 *
 * @example
 * <Checkbox />
 * <Checkbox defaultChecked />
 * <Checkbox checked="indeterminate" />
 */
function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "group peer size-6 shrink-0 rounded-[4px]",
        "border border-[var(--input-border)] bg-[var(--input-bg)]",
        "hover:border-[var(--input-border-hover)] hover:bg-[var(--input-bg-hover)]",
        "data-[state=checked]:bg-[var(--btn-primary-bg)] data-[state=checked]:border-[var(--btn-primary-bg)]",
        "data-[state=indeterminate]:bg-[var(--btn-primary-bg)] data-[state=indeterminate]:border-[var(--btn-primary-bg)]",
        "outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-info)] focus-visible:ring-offset-[4px]",
        "disabled:pointer-events-none disabled:cursor-not-allowed",
        "disabled:bg-[var(--input-bg-disabled)] disabled:border-[var(--input-border-disabled)]",
        "transition-[background-color,border-color,box-shadow]",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-white">
        <Check
          width={14}
          height={14}
          strokeWidth={2.5}
          className="hidden group-data-[state=checked]:block"
        />
        <Minus
          width={14}
          height={14}
          strokeWidth={2.5}
          className="hidden group-data-[state=indeterminate]:block"
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

// ── Label sizes ───────────────────────────────────────────────────────────────

const labelSizeClasses = {
  sm: "text-sm",    // 14px
  md: "text-base",  // 16px
  lg: "text-xl",    // 20px
} as const

// ── Compound ──────────────────────────────────────────────────────────────────

/**
 * CheckboxItem — Checkbox with label and optional description.
 *
 * @prop label        Label text rendered next to the checkbox
 * @prop description  Optional hint text below the label (always 14px)
 * @prop size         "sm" (14px) | "md" (16px, default) | "lg" (20px)
 * @prop disabled     Disables control and greys out label
 *
 * @example
 * <CheckboxItem label="Remember me" />
 * <CheckboxItem label="Subscribe" description="Receive weekly updates" size="sm" />
 */
function CheckboxItem({
  id,
  label,
  description,
  size = "md",
  disabled,
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & {
  label: string
  description?: string
  size?: "sm" | "md" | "lg"
}) {
  const generatedId = React.useId()
  const checkboxId = id ?? generatedId

  return (
    <div className={cn("flex items-start gap-2", className)}>
      <Checkbox id={checkboxId} disabled={disabled} {...props} />
      <div className="flex flex-col gap-1">
        <label
          htmlFor={checkboxId}
          className={cn(
            "cursor-pointer text-[var(--foreground)] leading-[1.5]",
            labelSizeClasses[size],
            disabled && "cursor-not-allowed text-[var(--input-text-disabled)]"
          )}
        >
          {label}
        </label>
        {description && (
          <span
            className={cn(
              "text-sm leading-[1.4286]",
              disabled
                ? "text-[var(--input-text-disabled)]"
                : "text-[var(--muted-foreground)]"
            )}
          >
            {description}
          </span>
        )}
      </div>
    </div>
  )
}

export { Checkbox, CheckboxItem }
