"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

// ── Variant context ───────────────────────────────────────────────────────────

type PopoverVariant = "default" | "inverse"
const PopoverVariantContext = React.createContext<PopoverVariant>("default")

// ── Root ──────────────────────────────────────────────────────────────────────

/**
 * Popover — Pencil design system popover component.
 *
 * @prop variant  "default" (white) | "inverse" (dark)
 *
 * Arrow direction is controlled via `side` + `align` on `PopoverContent`.
 * Radix auto-positions the arrow. Sides: "top" | "right" | "bottom" | "left".
 * Aligns: "start" | "center" | "end".
 *
 * @example
 * <Popover variant="default">
 *   <PopoverTrigger asChild><Button>Open</Button></PopoverTrigger>
 *   <PopoverContent side="bottom" align="center">
 *     Content goes here
 *   </PopoverContent>
 * </Popover>
 */
function Popover({
  variant = "default",
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root> & {
  variant?: PopoverVariant
}) {
  return (
    <PopoverVariantContext.Provider value={variant}>
      <PopoverPrimitive.Root data-slot="popover" {...props} />
    </PopoverVariantContext.Provider>
  )
}

// ── Trigger ───────────────────────────────────────────────────────────────────

function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

// ── Content ───────────────────────────────────────────────────────────────────

function PopoverContent({
  className,
  side = "bottom",
  align = "center",
  sideOffset = 10,
  showArrow = true,
  children,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content> & {
  showArrow?: boolean
}) {
  const variant = React.useContext(PopoverVariantContext)

  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        side={side}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-50 rounded-xl border border-[var(--color-stroke-base)]",
          "shadow-[var(--shadow-popover)] outline-none",
          // Variant
          variant === "default" && "bg-white text-[var(--foreground)]",
          variant === "inverse" && "bg-[var(--foreground)] text-white",
          // Animations — directional slide-in
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2",
          "data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2",
          "data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        {...props}
      >
        {children}
        {showArrow && (
          <PopoverPrimitive.Arrow asChild>
            <svg width={17} height={9} viewBox="0 0 30 10" preserveAspectRatio="none" overflow="visible">
              {/* Outer: full triangle in border color */}
              <polygon points="0,0 30,0 15,10" fill="#8d959f" />
              {/* Inner: base extends 2px beyond SVG to cover the container's border at the junction */}
              <polygon
                points="0,-2 30,-2 15,8.5"
                fill={variant === "default" ? "white" : "#334451"}
              />
            </svg>
          </PopoverPrimitive.Arrow>
        )}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  )
}

// ── Close ─────────────────────────────────────────────────────────────────────

function PopoverClose({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Close>) {
  return <PopoverPrimitive.Close data-slot="popover-close" {...props} />
}

function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

export { Popover, PopoverTrigger, PopoverContent, PopoverClose, PopoverAnchor }
