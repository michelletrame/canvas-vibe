"use client"

import * as React from "react"
import { DayPicker, useDayPicker } from "react-day-picker"
import type { CalendarMonth } from "react-day-picker"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { IconButton } from "@/components/ui/icon-button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// ── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Splits a formatted label like "March 2026" into [monthName, year].
 * Splits on the last space to handle multi-word month names.
 */
function splitLabel(label: string): [string, string] {
  const idx = label.lastIndexOf(" ")
  return [label.slice(0, idx), label.slice(idx + 1)]
}

// ── Context ──────────────────────────────────────────────────────────────────

const ShowYearPickerContext = React.createContext(false)

// ── Nav buttons ──────────────────────────────────────────────────────────────

function CalendarPrevButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <IconButton
      {...props}
      variant="ghost"
      size="sm"
      icon={ChevronLeft}
      className="size-6 rounded-[4px]"
    />
  )
}

function CalendarNextButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <IconButton
      {...props}
      variant="ghost"
      size="sm"
      icon={ChevronRight}
      className="size-6 rounded-[4px]"
    />
  )
}

// ── CalendarMonthCaption ──────────────────────────────────────────────────────

/**
 * Replaces DayPicker's default MonthCaption.
 * Renders:  ← [Month / Year-or-Select] →
 * Reads showYearPicker from context; reads nav state from useDayPicker().
 */
function CalendarMonthCaption({
  calendarMonth,
}: {
  calendarMonth: CalendarMonth
  displayIndex: number
} & React.HTMLAttributes<HTMLDivElement>) {
  const {
    goToMonth,
    previousMonth,
    nextMonth,
    formatters: { formatCaption },
  } = useDayPicker()
  const showYearPicker = React.useContext(ShowYearPickerContext)

  const date = calendarMonth.date
  const currentYear = date.getFullYear()
  const [monthName, yearStr] = splitLabel(formatCaption(date))
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i)

  return (
    <div className="flex items-center justify-between" aria-live="polite">
      <CalendarPrevButton
        type="button"
        onClick={() => previousMonth && goToMonth(previousMonth)}
        disabled={!previousMonth}
        aria-disabled={!previousMonth ? true : undefined}
        aria-label="Go to previous month"
      />

      <div className="flex flex-col items-center" role="status">
        <span className="text-base font-semibold leading-[1.5] text-[var(--foreground)]">
          {monthName}
        </span>
        {showYearPicker ? (
          <Select
            value={String(currentYear)}
            onValueChange={v => {
              const next = new Date(date)
              next.setFullYear(Number(v))
              goToMonth(next)
            }}
          >
            <SelectTrigger size="sm" className="w-auto text-base font-semibold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map(y => (
                <SelectItem key={y} value={String(y)}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <span className="text-base font-semibold leading-[1.5] text-[var(--foreground)]">
            {yearStr}
          </span>
        )}
      </div>

      <CalendarNextButton
        type="button"
        onClick={() => nextMonth && goToMonth(nextMonth)}
        disabled={!nextMonth}
        aria-disabled={!nextMonth ? true : undefined}
        aria-label="Go to next month"
      />
    </div>
  )
}

// ── Calendar ───────────────────────────────────────────────────────────────────

/**
 * Calendar — DayPicker wrapper styled to the Pencil design system.
 *
 * @prop showYearPicker  true → year label becomes a select dropdown
 * @prop showOutsideDays true (default) → renders days outside the current month
 *
 * @example
 * // Uncontrolled single-date picker
 * <Calendar mode="single" />
 *
 * // Controlled
 * const [date, setDate] = React.useState<Date>()
 * <Calendar mode="single" selected={date} onSelect={setDate} />
 *
 * // Range
 * <Calendar mode="range" selected={range} onSelect={setRange} />
 *
 * // With year picker
 * <Calendar mode="single" showYearPicker />
 */
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  showYearPicker = false,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  showYearPicker?: boolean
}) {
  return (
    <ShowYearPickerContext.Provider value={showYearPicker}>
      <DayPicker
        showOutsideDays={showOutsideDays}
        captionLayout="label"
        hideNavigation
        className={cn(
          "p-3 bg-white rounded-[5px] inline-block",
          className
        )}
        classNames={{
          // ── Layout ─────────────────────────────────────────────────────────
          months: "flex flex-col",
          month: "flex flex-col gap-4",
          month_caption: "flex items-center justify-between",

          // ── Grid ───────────────────────────────────────────────────────────
          month_grid: "border-collapse",
          weekdays: "flex gap-[2px] mb-1",
          weekday: cn(
            "w-[34px] h-[26px] p-1 rounded-[12px]",
            "text-base font-semibold text-[var(--foreground)] text-center",
            "flex items-center justify-center"
          ),
          weeks: "flex flex-col gap-1",
          week: "flex gap-1",

          // ── Day cell ───────────────────────────────────────────────────────
          day: "relative p-0",
          day_button: cn(
            "w-8 h-8 text-base flex items-center justify-center",
            "rounded-[12px] text-[var(--foreground)]",
            "hover:bg-[var(--input-bg-hover)] transition-colors",
            "outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-info)] focus-visible:ring-offset-[2px]"
          ),

          // ── Day state modifiers (applied to outer day cell) ─────────────────
          today: [
            "[&>button]:bg-[#1d354f]",
            "[&>button]:text-white",
            "[&>button]:rounded-full",
            "[&>button:hover]:bg-[#1d354f]",
          ].join(" "),

          selected: [
            "[&>button]:bg-[var(--color-success)]",
            "[&>button]:text-white",
            "[&>button]:rounded-[12px]",
            "[&>button:hover]:bg-[var(--color-success)]",
          ].join(" "),

          outside: [
            "[&>button]:text-[var(--muted-foreground)]",
            "[&>button]:opacity-60",
          ].join(" "),

          disabled: [
            "[&>button]:opacity-50",
            "[&>button]:pointer-events-none",
          ].join(" "),

          hidden: "invisible",

          // ── Range states ───────────────────────────────────────────────────
          range_start: [
            "[&>button]:bg-[var(--color-success)]",
            "[&>button]:text-white",
            "[&>button]:rounded-[12px]",
            "[&>button:hover]:bg-[var(--color-success)]",
          ].join(" "),

          range_end: [
            "[&>button]:bg-[var(--color-success)]",
            "[&>button]:text-white",
            "[&>button]:rounded-[12px]",
            "[&>button:hover]:bg-[var(--color-success)]",
          ].join(" "),

          range_middle: [
            "[&>button]:bg-[var(--color-success)]/50",
            "[&>button]:text-white",
            "[&>button]:rounded-[12px]",
          ].join(" "),

          ...classNames,
        }}
        components={{
          MonthCaption: CalendarMonthCaption,
        }}
        {...props}
      />
    </ShowYearPickerContext.Provider>
  )
}

export { Calendar }
