import * as React from "react"
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Icon } from "@/components/ui/icon"

// ── Table ─────────────────────────────────────────────────────────────────────

/**
 * Table — Pencil design system data table.
 *
 * @example
 * <Table>
 *   <TableHeader>
 *     <TableRow>
 *       <TableHead sort="asc">Name</TableHead>
 *       <TableHead sort={false}>Status</TableHead>
 *     </TableRow>
 *   </TableHeader>
 *   <TableBody>
 *     <TableRow>
 *       <TableCell>Alice</TableCell>
 *       <TableCell>Active</TableCell>
 *     </TableRow>
 *   </TableBody>
 * </Table>
 */
function Table({
  className,
  ...props
}: React.ComponentProps<"table">) {
  return (
    <div className="relative w-full overflow-x-auto">
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-base", className)}
        {...props}
      />
    </div>
  )
}

// ── TableHeader ───────────────────────────────────────────────────────────────

function TableHeader({
  className,
  ...props
}: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn(className)}
      {...props}
    />
  )
}

// ── TableBody ─────────────────────────────────────────────────────────────────

function TableBody({
  className,
  ...props
}: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

// ── TableFooter ───────────────────────────────────────────────────────────────

function TableFooter({
  className,
  ...props
}: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t border-[var(--color-stroke-base)] font-semibold",
        "[&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

// ── TableRow ──────────────────────────────────────────────────────────────────

function TableRow({
  className,
  ...props
}: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b border-[var(--color-stroke-base)]",
        "hover:bg-[var(--input-bg-hover)]",
        "data-[state=selected]:bg-[var(--btn-tertiary-bg-hover)]",
        "transition-colors",
        className
      )}
      {...props}
    />
  )
}

// ── TableHead ─────────────────────────────────────────────────────────────────

/**
 * TableHead — `<th>` with optional sort indicator.
 *
 * @prop sort  "asc" | "desc" | false — shows sort icon; false = unsorted
 *             Omit entirely for non-sortable columns.
 */
function TableHead({
  className,
  sort,
  children,
  ...props
}: React.ComponentProps<"th"> & {
  sort?: "asc" | "desc" | false
}) {
  const isSortable = sort !== undefined
  const SortIcon =
    sort === "asc"
      ? ChevronDown
      : sort === "desc"
        ? ChevronUp
        : ChevronsUpDown

  return (
    <th
      data-slot="table-head"
      className={cn(
        "px-3 py-2 text-left align-middle",
        "text-base font-semibold text-[var(--foreground)]",
        "whitespace-nowrap",
        isSortable && "cursor-pointer select-none",
        className
      )}
      {...props}
    >
      {isSortable ? (
        <span className="inline-flex items-center gap-2">
          {children}
          <Icon icon={SortIcon} size="sm" color="muted" aria-hidden />
        </span>
      ) : (
        children
      )}
    </th>
  )
}

// ── TableCell ─────────────────────────────────────────────────────────────────

function TableCell({
  className,
  ...props
}: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "px-3 py-2 align-middle",
        "text-base text-[var(--foreground)]",
        className
      )}
      {...props}
    />
  )
}

// ── TableCaption ──────────────────────────────────────────────────────────────

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn(
        "mt-4 text-sm text-[var(--muted-foreground)]",
        className
      )}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
}
