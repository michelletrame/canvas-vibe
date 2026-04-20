"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

// ── Types ─────────────────────────────────────────────────────────────────────

type CardVariant = "base" | "nested"
type CardSize = "sm" | "md" | "lg"

// ── Size/variant context ──────────────────────────────────────────────────────

const CardContext = React.createContext<{ variant: CardVariant; size: CardSize }>({
  variant: "base",
  size: "lg",
})

/**
 * Horizontal padding per variant + size (always applied to each section).
 * Vertical padding uses first:/last: so adjacent sections never double up.
 *   base:   sm=16px  md=24px  lg=32px
 *   nested: sm=8px   md=12px  lg=16px
 */
const pxMap: Record<CardVariant, Record<CardSize, string>> = {
  base:   { sm: "px-4", md: "px-6", lg: "px-8" },
  nested: { sm: "px-2", md: "px-3", lg: "px-4" },
}

const pyMap: Record<CardVariant, Record<CardSize, string>> = {
  base:   { sm: "first:pt-4 last:pb-4", md: "first:pt-6 last:pb-6", lg: "first:pt-8 last:pb-8" },
  nested: { sm: "first:pt-2 last:pb-2", md: "first:pt-3 last:pb-3", lg: "first:pt-4 last:pb-4" },
}

/**
 * Corner radius per size (same for both variants):
 *   sm=12px  md=16px  lg=24px
 */
const radiusMap: Record<CardSize, string> = {
  sm: "rounded-xl",
  md: "rounded-2xl",
  lg: "rounded-3xl",
}

/** Gap between card sections (header → content → footer) */
const gapMap: Record<CardSize, string> = {
  sm: "gap-2",
  md: "gap-3",
  lg: "gap-4",
}

// ── Root ──────────────────────────────────────────────────────────────────────

/**
 * Card — Pencil design system card component.
 *
 * Two variants with three sizes each. Corner radii are 12/16/24px across sm/md/lg.
 *
 * @prop variant  "base" (default) — top-level content container (16/24/32px padding)
 *                "nested" — used only inside a base card (8/12/16px padding)
 * @prop size     "sm" | "md" | "lg" (default)
 *
 * @example
 * // Base card (section wrapper)
 * <Card>…</Card>                        // base lg: 32px pad, 24px radius
 * <Card size="md">…</Card>              // base md: 24px pad, 16px radius
 *
 * // Nested card (inside a base card)
 * <Card variant="nested" size="md">…</Card>  // nested md: 12px pad, 16px radius
 */
function Card({
  className,
  variant = "base",
  size = "lg",
  ...props
}: React.ComponentProps<"div"> & {
  variant?: CardVariant
  size?: CardSize
}) {
  return (
    <CardContext.Provider value={{ variant, size }}>
      <div
        data-slot="card"
        data-variant={variant}
        data-size={size}
        className={cn(
          "flex flex-col bg-[var(--card)] text-[var(--card-foreground)] overflow-hidden",
          "shadow-[var(--shadow-card)]",
          radiusMap[size],
          gapMap[size],
          className,
        )}
        {...props}
      />
    </CardContext.Provider>
  )
}

// ── Header ────────────────────────────────────────────────────────────────────

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  const { variant, size } = React.useContext(CardContext)
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-1", pxMap[variant][size], pyMap[variant][size], className)}
      {...props}
    />
  )
}

// ── Title ─────────────────────────────────────────────────────────────────────

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("text-xl font-semibold leading-tight", className)}
      {...props}
    />
  )
}

// ── Description ───────────────────────────────────────────────────────────────

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-[var(--muted-foreground)]", className)}
      {...props}
    />
  )
}

// ── Content ───────────────────────────────────────────────────────────────────

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  const { variant, size } = React.useContext(CardContext)
  return (
    <div
      data-slot="card-content"
      className={cn("flex flex-col gap-2", pxMap[variant][size], pyMap[variant][size], className)}
      {...props}
    />
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  const { variant, size } = React.useContext(CardContext)
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center gap-2", pxMap[variant][size], pyMap[variant][size], className)}
      {...props}
    />
  )
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
export type { CardVariant, CardSize }
