"use client"

import * as React from "react"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

// ── Internal helpers ────────────────────────────────────────────────────────

function ControlButton({
  icon: Icon,
  onClick,
  disabled,
  ariaLabel,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  onClick: () => void
  disabled: boolean
  ariaLabel: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center justify-center h-10 w-10 rounded-xl",
        "text-[var(--btn-primary-bg)]",
        "hover:bg-[var(--btn-tertiary-bg-hover)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-info)]",
        "disabled:opacity-40 disabled:pointer-events-none",
        "transition-colors",
      )}
    >
      <Icon className="w-5 h-5" strokeWidth={2} />
    </button>
  )
}

function PageButton({
  label,
  isSelected,
  onClick,
}: {
  label: string
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={isSelected ? "page" : undefined}
      className={cn(
        "inline-flex items-center justify-center h-10 min-w-10 rounded-xl px-4",
        "text-base font-semibold transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-info)]",
        isSelected
          ? "bg-[var(--btn-primary-bg)] text-white"
          : "text-[var(--btn-primary-bg)] hover:bg-[var(--btn-tertiary-bg-hover)]",
      )}
    >
      {label}
    </button>
  )
}

function EllipsisItem() {
  return (
    <span
      aria-hidden
      className="inline-flex items-center justify-center h-10 w-10 text-base font-semibold text-[var(--btn-primary-bg)] select-none"
    >
      …
    </span>
  )
}

// ── Ellipsis algorithm ───────────────────────────────────────────────────────

function buildPageRange(
  current: number,
  total: number,
  sibling: number,
): (number | "ellipsis")[] {
  if (total <= 1) return [1]

  const sibStart = Math.max(2, current - sibling)
  const sibEnd = Math.min(total - 1, current + sibling)

  const showLeftEllipsis = sibStart > 2
  const showRightEllipsis = sibEnd < total - 1

  const pages: (number | "ellipsis")[] = [1]

  if (showLeftEllipsis) {
    pages.push("ellipsis")
  } else {
    for (let i = 2; i < sibStart; i++) pages.push(i)
  }

  for (let i = sibStart; i <= sibEnd; i++) pages.push(i)

  if (showRightEllipsis) {
    pages.push("ellipsis")
  } else {
    for (let i = sibEnd + 1; i < total; i++) pages.push(i)
  }

  if (total > 1) pages.push(total)

  return pages
}

// ── Main component ───────────────────────────────────────────────────────────

type PaginationProps =
  | {
      variant: "numeric"
      currentPage: number
      totalPages: number
      onPageChange: (page: number) => void
      siblingCount?: number
      className?: string
    }
  | {
      variant: "alphabetical"
      pages: string[]
      currentPage: string
      onPageChange: (page: string) => void
      className?: string
    }
  | {
      variant: "jumpto"
      currentPage: number
      totalPages: number
      onPageChange: (page: number) => void
      className?: string
    }

/**
 * Pagination — Three variants matching the Pencil design system.
 *
 * @example
 * <Pagination variant="numeric" currentPage={3} totalPages={20} onPageChange={setPage} />
 * <Pagination variant="alphabetical" pages={["A-G","H-N","O-T"]} currentPage="A-G" onPageChange={setPage} />
 * <Pagination variant="jumpto" currentPage={5} totalPages={160} onPageChange={setPage} />
 */
function Pagination(props: PaginationProps) {
  if (props.variant === "numeric") {
    const { currentPage, totalPages, onPageChange, siblingCount = 1, className } = props
    const range = buildPageRange(currentPage, totalPages, siblingCount)

    return (
      <nav aria-label="Pagination" className={cn("inline-flex items-end gap-2", className)}>
        <ControlButton
          icon={ChevronsLeft}
          ariaLabel="First page"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(1)}
        />
        <ControlButton
          icon={ChevronLeft}
          ariaLabel="Previous page"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        />

        {range.map((item, i) =>
          item === "ellipsis" ? (
            <EllipsisItem key={`ellipsis-${i}`} />
          ) : (
            <PageButton
              key={item}
              label={String(item)}
              isSelected={item === currentPage}
              onClick={() => onPageChange(item)}
            />
          ),
        )}

        <ControlButton
          icon={ChevronRight}
          ariaLabel="Next page"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        />
        <ControlButton
          icon={ChevronsRight}
          ariaLabel="Last page"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(totalPages)}
        />
      </nav>
    )
  }

  if (props.variant === "alphabetical") {
    const { pages, currentPage, onPageChange, className } = props

    return (
      <nav aria-label="Pagination" className={cn("inline-flex items-end gap-2", className)}>
        <span className="inline-flex items-center h-10 px-2 text-sm font-semibold text-[var(--btn-primary-bg)] select-none">
          Jump to
        </span>
        {pages.map((page) => (
          <PageButton
            key={page}
            label={page}
            isSelected={page === currentPage}
            onClick={() => onPageChange(page)}
          />
        ))}
      </nav>
    )
  }

  // jumpto
  const { currentPage, totalPages, onPageChange, className } = props
  const [inputValue, setInputValue] = React.useState(String(currentPage))

  React.useEffect(() => {
    setInputValue(String(currentPage))
  }, [currentPage])

  function commitPage() {
    const parsed = parseInt(inputValue, 10)
    if (!isNaN(parsed)) {
      onPageChange(Math.min(Math.max(1, parsed), totalPages))
    } else {
      setInputValue(String(currentPage))
    }
  }

  return (
    <nav aria-label="Pagination" className={cn("inline-flex items-center gap-2", className)}>
      <ControlButton
        icon={ChevronsLeft}
        ariaLabel="First page"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(1)}
      />
      <ControlButton
        icon={ChevronLeft}
        ariaLabel="Previous page"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      />

      <div className="inline-flex items-center gap-2">
        <Input
          size="md"
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={commitPage}
          onKeyDown={(e) => { if (e.key === "Enter") commitPage() }}
          className="w-[67px] text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          aria-label="Page number"
        />
        <span className="text-base text-[var(--icon-base)]">of</span>
        <span className="text-base text-[var(--icon-base)]">{totalPages}</span>
      </div>

      <ControlButton
        icon={ChevronRight}
        ariaLabel="Next page"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      />
      <ControlButton
        icon={ChevronsRight}
        ariaLabel="Last page"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(totalPages)}
      />
    </nav>
  )
}

export { Pagination }
