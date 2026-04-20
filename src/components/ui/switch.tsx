"use client"

import * as React from "react"
import { X, Check, CircleCheck, CircleAlert } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Switch — Accessible toggle input styled to match the Pencil design system.
 *
 * @prop checked          Controlled checked state
 * @prop defaultChecked   Uncontrolled initial state (default: false)
 * @prop onCheckedChange  Called when value changes
 * @prop label            Text shown beside the toggle
 * @prop hint             Secondary description text below label
 * @prop message          Validation message (colored by status)
 * @prop required         Shows red asterisk after label
 * @prop labelPlacement   "end" (default) | "start"
 * @prop status           "error" | "success" — colors the border and message
 * @prop disabled         Disables interaction
 * @prop readOnly         Prevents interaction without disabled styling
 * @prop id               Forwarded to the button (for label association)
 * @prop name             Adds a hidden checkbox for form submission
 *
 * @example
 * <Switch label="Enable notifications" defaultChecked />
 * <Switch checked={on} onCheckedChange={setOn} status="error" message="Required" />
 */
function Switch({
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  label,
  hint,
  message,
  required,
  labelPlacement = "end",
  status,
  disabled,
  readOnly,
  id,
  name,
  className,
}: {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  label?: React.ReactNode
  hint?: React.ReactNode
  message?: React.ReactNode
  required?: boolean
  labelPlacement?: "start" | "end"
  status?: "error" | "success"
  disabled?: boolean
  readOnly?: boolean
  id?: string
  name?: string
  className?: string
}) {
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked)
  const controlled = checkedProp !== undefined
  const checked = controlled ? checkedProp : internalChecked

  function handleToggle() {
    if (disabled || readOnly) return
    const next = !checked
    if (!controlled) setInternalChecked(next)
    onCheckedChange?.(next)
  }

  const isEnabled = !disabled && !readOnly

  const containerClass = cn(
    "relative inline-flex h-6 w-10 shrink-0 rounded-full p-0.5",
    "transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-info)] focus-visible:ring-offset-2",
    !checked && isEnabled && [
      "bg-white border border-[var(--input-border)]",
      !status && "hover:border-[var(--input-border-hover)]",
      status === "error" && "border-[var(--color-error)]",
    ],
    checked && isEnabled && "bg-[var(--color-success)] border border-[var(--color-success)]",
    disabled && !checked && "bg-[var(--input-bg-disabled)] border border-[var(--input-border-disabled)] cursor-not-allowed",
    disabled && checked && "bg-[var(--btn-disabled-bg)] border border-[var(--btn-disabled-bg)] cursor-not-allowed",
    readOnly && "bg-[var(--input-bg-readonly)] border border-[var(--input-border-readonly)] cursor-default",
  )

  const knobBorderClass =
    checked && isEnabled ? "border-[var(--color-success)]"
    : !checked && isEnabled && status === "error" ? "border-[var(--color-error)]"
    : !checked && isEnabled ? "border-[var(--input-border)]"
    : disabled && checked ? "border-[var(--btn-disabled-bg)]"
    : disabled ? "border-[var(--input-border-disabled)]"
    : "border-[var(--input-border-readonly)]"

  const iconColorClass = disabled
    ? "text-[var(--input-text-disabled)]"
    : readOnly
      ? "text-[var(--input-hint)]"
      : checked
        ? "text-[var(--color-success)]"
        : "text-[var(--icon-base)]"

  const toggle = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      id={id}
      onClick={handleToggle}
      className={containerClass}
    >
      {name && (
        <input type="checkbox" hidden name={name} checked={checked} onChange={() => {}} />
      )}
      <span
        className={cn(
          "inline-flex items-center justify-center h-full w-5 rounded-full bg-white",
          "transition-transform duration-200",
          checked && "translate-x-4",
          "border", knobBorderClass,
          isEnabled && "shadow-[0_2px_3.5px_2px_rgba(0,0,0,0.15),_0_1px_1.75px_0_rgba(0,0,0,0.30)]",
        )}
      >
        {checked
          ? <Check className={cn("w-3 h-3", iconColorClass)} strokeWidth={1.5} aria-hidden />
          : <X className={cn("w-3 h-3", iconColorClass)} strokeWidth={1.5} aria-hidden />
        }
      </span>
    </button>
  )

  const labelSection = (label != null || hint != null || message != null) ? (
    <div className="flex flex-col gap-1">
      {label != null && (
        <span className="text-base leading-6 text-[var(--input-label)]">
          {label}
          {required && <span className="text-[var(--color-error)] ml-0.5" aria-hidden>*</span>}
        </span>
      )}
      {hint != null && (
        <span className="text-sm leading-5 text-[var(--input-hint)]">{hint}</span>
      )}
      {message != null && (
        <span className={cn(
          "inline-flex items-center gap-1 text-sm leading-5",
          status === "error" && "text-[var(--color-error)]",
          status === "success" && "text-[var(--color-success)]",
          !status && "text-[var(--input-hint)]",
        )}>
          {status === "error" && <CircleAlert className="w-4 h-4 shrink-0" aria-hidden />}
          {status === "success" && <CircleCheck className="w-4 h-4 shrink-0" aria-hidden />}
          {message}
        </span>
      )}
    </div>
  ) : null

  return (
    <div className={cn("inline-flex items-start gap-2", className)}>
      {labelPlacement === "start" && labelSection}
      {toggle}
      {labelPlacement === "end" && labelSection}
    </div>
  )
}

export { Switch }
