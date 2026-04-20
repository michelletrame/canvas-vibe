"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

function formatDate(date: Date | undefined) {
  if (!date) return ""
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  })
}

function parseDate(str: string): Date | undefined {
  const d = new Date(str)
  return isNaN(d.getTime()) ? undefined : d
}

/**
 * DatePicker — Input with a calendar icon button that opens a Calendar popover.
 *
 * Typing a date string directly will parse and select the date.
 * Pressing ArrowDown while focused opens the calendar.
 *
 * @prop value           Controlled selected date
 * @prop onValueChange   Called when the date changes (typed or picked)
 * @prop placeholder     Input placeholder text (default: "Select date")
 * @prop size            "sm" | "md" (default) | "lg" — matches Input sizes
 * @prop status          "error" | "success" — colors the border
 * @prop showYearPicker  Passes through to Calendar
 * @prop disabled        Disables the input and calendar icon
 *
 * @example
 * const [date, setDate] = React.useState<Date>()
 * <DatePicker value={date} onValueChange={setDate} />
 */
function DatePicker({
  value,
  onValueChange,
  placeholder = "Select date",
  size = "md",
  status,
  showYearPicker = false,
  disabled,
  className,
}: {
  value?: Date
  onValueChange?: (date: Date | undefined) => void
  placeholder?: string
  size?: "sm" | "md" | "lg"
  status?: "error" | "success"
  showYearPicker?: boolean
  disabled?: boolean
  className?: string
}) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState(formatDate(value))
  const [month, setMonth] = React.useState<Date | undefined>(value)

  // Sync display value when controlled `value` changes externally
  React.useEffect(() => {
    setInputValue(formatDate(value))
  }, [value])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <Input
          value={inputValue}
          placeholder={placeholder}
          size={size}
          status={status}
          disabled={disabled}
          className={className}
          rightIcon={CalendarIcon}
          onRightIconClick={() => setOpen((o) => !o)}
          onChange={(e) => {
            setInputValue(e.target.value)
            const parsed = parseDate(e.target.value)
            if (parsed) {
              setMonth(parsed)
              onValueChange?.(parsed)
            } else {
              onValueChange?.(undefined)
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault()
              setOpen(true)
            }
          }}
        />
      </PopoverAnchor>
      <PopoverContent showArrow={false} align="end" className="p-0 w-auto overflow-hidden">
        <Calendar
          mode="single"
          selected={value}
          month={month}
          onMonthChange={setMonth}
          onSelect={(date) => {
            onValueChange?.(date)
            setInputValue(formatDate(date))
            setOpen(false)
          }}
          showYearPicker={showYearPicker}
        />
      </PopoverContent>
    </Popover>
  )
}

export { DatePicker }
