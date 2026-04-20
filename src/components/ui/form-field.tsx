import * as React from "react"
import { CircleAlert, CircleCheck } from "lucide-react"

import { cn } from "@/lib/utils"
import { Icon } from "@/components/ui/icon"
import { Label } from "@/components/ui/label"

/** Height class for the inline label wrapper — must match the Input size */
const labelHeightMap: Record<string, string> = {
  sm: "h-8",
  md: "h-10",
  lg: "h-12",
}

interface FormFieldProps {
  label?: string
  required?: boolean
  hint?: string
  message?: string
  status?: "error" | "success"
  /** Match this to the Input size when using inline layout */
  size?: "sm" | "md" | "lg"
  layout?: "stacked" | "inline"
  className?: string
  children: React.ReactNode
}

function FormField({
  label,
  required,
  hint,
  message,
  status,
  size = "md",
  layout = "stacked",
  className,
  children,
}: FormFieldProps) {
  const labelEl = label ? (
    <Label className="flex items-center gap-1 shrink-0">
      {label}
      {required && (
        <span className="text-[var(--input-border-error)]" aria-hidden>
          *
        </span>
      )}
    </Label>
  ) : null

  let messageEl: React.ReactNode = null
  if (message && status === "error") {
    messageEl = (
      <span className="flex items-center gap-1 text-sm text-[var(--input-border-error)]">
        <Icon icon={CircleAlert} size="sm" color="error" aria-hidden />
        {message}
      </span>
    )
  } else if (message && status === "success") {
    messageEl = (
      <span className="flex items-center gap-1 text-sm text-[var(--input-border-success)]">
        <Icon icon={CircleCheck} size="sm" color="success" aria-hidden />
        {message}
      </span>
    )
  } else if (message || hint) {
    messageEl = (
      <p className="text-sm text-[var(--color-text-muted)]">{message ?? hint}</p>
    )
  }

  if (layout === "inline") {
    const labelHeight = labelHeightMap[size] ?? "h-10"
    return (
      <div className={cn("flex items-start gap-2 w-full", className)}>
        {labelEl && (
          <div className={cn("flex items-center shrink-0", labelHeight)}>
            {labelEl}
          </div>
        )}
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          {children}
          {messageEl}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-2 w-full", className)}>
      {labelEl}
      <div className="flex flex-col gap-1">
        {children}
        {messageEl}
      </div>
    </div>
  )
}

export { FormField }
