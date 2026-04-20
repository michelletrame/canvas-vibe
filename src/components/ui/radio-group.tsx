"use client"

import * as React from "react"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

// ── Group ─────────────────────────────────────────────────────────────────────

/**
 * RadioGroup — wraps RadioGroupPrimitive.Root with default vertical layout.
 *
 * @example
 * <RadioGroup defaultValue="a">
 *   <RadioGroupItem value="a" />
 *   <RadioGroupItem value="b" />
 * </RadioGroup>
 */
function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("flex flex-col gap-3", className)}
      {...props}
    />
  )
}

// ── Atom ──────────────────────────────────────────────────────────────────────

/**
 * RadioGroupItem — 24×24 circular control. Checked state shows a white inner dot.
 *
 * @example
 * <RadioGroupItem value="option-a" />
 */
function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "peer size-6 shrink-0 rounded-full",
        "border border-[var(--input-border)] bg-[var(--input-bg)]",
        "hover:border-[var(--input-border-hover)] hover:bg-[var(--input-bg-hover)]",
        "data-[state=checked]:bg-[var(--btn-primary-bg)] data-[state=checked]:border-[var(--btn-primary-bg)]",
        "outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-info)] focus-visible:ring-offset-[4px]",
        "disabled:pointer-events-none disabled:cursor-not-allowed",
        "disabled:bg-[var(--input-bg-disabled)] disabled:border-[var(--input-border-disabled)]",
        "transition-[background-color,border-color,box-shadow]",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <div className="size-2.5 rounded-full bg-white" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
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
 * RadioItem — RadioGroupItem with label and optional description.
 *
 * @prop value        Value passed to RadioGroupItem
 * @prop label        Label text rendered next to the radio
 * @prop description  Optional hint text below the label (always 14px)
 * @prop size         "sm" (14px) | "md" (16px, default) | "lg" (20px)
 * @prop disabled     Disables control and greys out label
 *
 * @example
 * <RadioGroup defaultValue="a">
 *   <RadioItem value="a" label="Option A" />
 *   <RadioItem value="b" label="Option B" description="With a description" />
 * </RadioGroup>
 */
function RadioItem({
  id,
  value,
  label,
  description,
  size = "md",
  disabled,
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item> & {
  label: string
  description?: string
  size?: "sm" | "md" | "lg"
}) {
  const generatedId = React.useId()
  const radioId = id ?? generatedId

  return (
    <div className={cn("flex items-start gap-2", className)}>
      <RadioGroupItem id={radioId} value={value} disabled={disabled} {...props} />
      <div className="flex flex-col gap-1">
        <label
          htmlFor={radioId}
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

export { RadioGroup, RadioGroupItem, RadioItem }
