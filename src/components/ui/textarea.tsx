import * as React from "react"

import { cn } from "@/lib/utils"

// Status border overrides — same pattern as Input
const statusClasses = {
  error:
    "border-[var(--input-border-error)] hover:border-[var(--input-border-error)] focus-visible:border-[var(--input-border-error)]",
  success:
    "border-[var(--input-border-success)] hover:border-[var(--input-border-success)] focus-visible:border-[var(--input-border-success)]",
} as const

/**
 * Textarea — Multi-line text input styled to match the Input component.
 *
 * @prop status    "error" | "success" — colors the border
 * @prop disabled  Disables the textarea
 *
 * Pass `rows`, `placeholder`, `readOnly`, etc. as standard HTML props.
 *
 * @example
 * <Textarea placeholder="Enter a description…" rows={4} />
 * <Textarea status="error" defaultValue="Bad input" />
 */
function Textarea({
  className,
  status,
  ...props
}: React.ComponentProps<"textarea"> & {
  status?: "error" | "success"
}) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // Base — mirrors Input base styles exactly
        "w-full min-w-0 border border-[var(--input-border)] rounded-[var(--input-radius)]",
        "bg-[var(--input-bg)] text-[var(--foreground)]",
        "transition-[background-color,border-color,box-shadow] outline-none font-normal",
        "placeholder:text-[var(--input-placeholder)]",
        "hover:bg-[var(--input-bg-hover)] hover:border-[var(--input-border-hover)]",
        // Focus ring — identical to Input
        "focus-visible:bg-[var(--input-bg)] focus-visible:border-[var(--color-info)]",
        "focus-visible:ring-2 focus-visible:ring-[var(--color-info)] focus-visible:ring-offset-[3px]",
        // Disabled
        "disabled:pointer-events-none disabled:cursor-not-allowed",
        "disabled:bg-[var(--input-bg-disabled)] disabled:border-[var(--input-border-disabled)]",
        "disabled:text-[var(--input-text-disabled)] disabled:placeholder:text-[var(--input-text-disabled)]",
        // Read-only
        "read-only:pointer-events-none read-only:bg-[var(--input-bg-readonly)]",
        "read-only:border-[var(--input-border-readonly)]",
        // Padding + font — matches Input md
        "px-3 py-2 text-base",
        // Allow vertical resize only
        "resize-y",
        status && statusClasses[status],
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
