"use client"

import * as React from "react"
import { ChevronUp, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"


/**
 * NumberInput — Numeric input with increment/decrement stepper buttons.
 *
 * @prop value           Controlled numeric value
 * @prop defaultValue    Uncontrolled initial value
 * @prop onValueChange   Called when value changes (typed or stepped)
 * @prop min             Minimum value
 * @prop max             Maximum value
 * @prop step            Step amount (default: 1)
 * @prop size            "sm" | "md" | "lg" — matches Input sizes
 * @prop status          "error" | "success" — colors the border
 * @prop disabled        Disables input and stepper buttons
 *
 * @example
 * <NumberInput value={qty} onValueChange={setQty} min={0} max={99} />
 */
function NumberInput({
  value: valueProp,
  defaultValue,
  onValueChange,
  min,
  max,
  step = 1,
  size = "md",
  status,
  disabled,
  placeholder = "0",
  className,
}: {
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  size?: "sm" | "md" | "lg"
  status?: "error" | "success"
  disabled?: boolean
  placeholder?: string
  className?: string
}) {
  const [internalValue, setInternalValue] = React.useState<number | undefined>(defaultValue)
  const controlled = valueProp !== undefined
  const value = controlled ? valueProp : internalValue

  function clamp(n: number) {
    if (min !== undefined) n = Math.max(min, n)
    if (max !== undefined) n = Math.min(max, n)
    return n
  }

  function handleChange(n: number) {
    const clamped = clamp(n)
    if (!controlled) setInternalValue(clamped)
    onValueChange?.(clamped)
  }

  const arrowWidth = size === "sm" ? "w-7" : "w-8"
  const rightPad = size === "sm" ? "pr-8" : "pr-10"

  return (
    <div className="relative">
      <Input
        type="number"
        value={value ?? ""}
        size={size}
        status={status}
        disabled={disabled}
        placeholder={placeholder}
        className={cn(
          rightPad,
          // Hide native browser number spinners
          "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
          className
        )}
        onChange={(e) => {
          const n = e.target.valueAsNumber
          if (!isNaN(n)) handleChange(n)
          else if (!controlled) setInternalValue(undefined)
        }}
      />

      {/* Stepper buttons — sit inside the input border */}
      <div
        className={cn(
          "absolute inset-y-[1px] right-[1px] flex flex-col",
          arrowWidth,
          "rounded-r-[calc(var(--input-radius)-1px)] overflow-hidden",
          disabled
            ? "bg-[var(--input-bg-disabled)] pointer-events-none"
            : "bg-[var(--btn-secondary-bg)]"
        )}
      >
        {/* Increment */}
        <button
          type="button"
          onClick={() => handleChange((value ?? 0) + step)}
          disabled={disabled}
          aria-label="Increment"
          className={cn(
            "flex-1 flex items-center justify-center",
            disabled ? "text-[var(--input-text-disabled)]" : "text-[var(--icon-base)]",
            "hover:bg-[var(--btn-secondary-bg-hover)] active:bg-[var(--btn-secondary-bg-active)]",
            "disabled:pointer-events-none",
            "focus-visible:outline-none focus-visible:z-10 focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[var(--color-info)]"
          )}
        >
          <ChevronUp width={12} height={12} strokeWidth={2} aria-hidden />
        </button>

        {/* Decrement */}
        <button
          type="button"
          onClick={() => handleChange((value ?? 0) - step)}
          disabled={disabled}
          aria-label="Decrement"
          className={cn(
            "flex-1 flex items-center justify-center",
            disabled ? "text-[var(--input-text-disabled)]" : "text-[var(--icon-base)]",
            "hover:bg-[var(--btn-secondary-bg-hover)] active:bg-[var(--btn-secondary-bg-active)]",
            "disabled:pointer-events-none",
            "focus-visible:outline-none focus-visible:z-10 focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[var(--color-info)]"
          )}
        >
          <ChevronDown width={12} height={12} strokeWidth={2} aria-hidden />
        </button>
      </div>
    </div>
  )
}

export { NumberInput }
