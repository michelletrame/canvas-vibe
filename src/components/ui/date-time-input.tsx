"use client"

import * as React from "react"
import { CircleAlert, CircleCheck } from "lucide-react"

import { cn } from "@/lib/utils"
import { Icon } from "@/components/ui/icon"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"

// 30-minute increments: "00:00" → "23:30", value="HH:MM", label="H:MM AM/PM"
const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hours = Math.floor(i / 2)
  const minutes = (i % 2) * 30
  const value = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
  const period = hours >= 12 ? "PM" : "AM"
  const h = hours % 12 || 12
  const label = `${h}:${minutes === 0 ? "00" : "30"} ${period}`
  return { value, label }
})

/**
 * DateTimeInput — Two coordinated fields (date picker + time input) that form a timestamp.
 *
 * @prop label           Group label shown above both fields
 * @prop required        Shows * on the group label
 * @prop layout          "columns" (side-by-side, default) | "stacked" (vertical)
 * @prop date            Controlled date value
 * @prop onDateChange    Called when the date changes
 * @prop time            Controlled time string in "HH:MM" 24h format
 * @prop onTimeChange    Called when the time string changes
 * @prop status          "error" | "success" — applied to both fields
 * @prop message         Error/success/hint message shown below the group
 * @prop hint            Hint text (shown as muted, no icon)
 * @prop disabled        Disables both fields
 * @prop showYearPicker  Passes through to the DatePicker
 *
 * @example
 * <DateTimeInput
 *   label="Appointment"
 *   required
 *   date={date}
 *   onDateChange={setDate}
 *   time={time}
 *   onTimeChange={setTime}
 * />
 */
function DateTimeInput({
  label,
  required,
  layout = "columns",
  date,
  onDateChange,
  time,
  onTimeChange,
  status,
  message,
  hint,
  disabled,
  showYearPicker = false,
  className,
}: {
  label?: string
  required?: boolean
  layout?: "columns" | "stacked"
  date?: Date
  onDateChange?: (date: Date | undefined) => void
  time?: string
  onTimeChange?: (time: string) => void
  status?: "error" | "success"
  message?: string
  hint?: string
  disabled?: boolean
  showYearPicker?: boolean
  className?: string
}) {
  // Replicates FormField's message rendering
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
      <p className="text-sm text-[var(--input-hint)]">{message ?? hint}</p>
    )
  }

  return (
    <div className={cn("flex flex-col gap-2 w-full", className)}>
      {/* Group label */}
      {label && (
        <Label className="flex items-center gap-1">
          {label}
          {required && (
            <span className="text-[var(--input-border-error)]" aria-hidden>*</span>
          )}
        </Label>
      )}

      {/* Input group */}
      <div
        className={cn(
          "flex",
          layout === "columns" ? "flex-row items-end gap-3" : "flex-col gap-2"
        )}
      >
        {/* Date field — always has "Date" sub-label */}
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <Label>Date</Label>
          <DatePicker
            value={date}
            onValueChange={onDateChange}
            status={status}
            disabled={disabled}
            showYearPicker={showYearPicker}
          />
        </div>

        {/* Time field */}
        <div className={cn("flex flex-col gap-2", layout === "columns" ? "flex-1 min-w-0" : "w-full")}>
          <Label>Time</Label>
          <Select
            value={time || undefined}
            onValueChange={(v) => onTimeChange?.(v)}
            disabled={disabled}
          >
            <SelectTrigger status={status} placeholder="Select time" />
            <SelectContent>
              {TIME_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Group message */}
      {messageEl}
    </div>
  )
}

export { DateTimeInput }
