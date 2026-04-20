"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

// ── Arrow SVGs ────────────────────────────────────────────────────────────────

const A = "#8d959f"

function ArrowDown({ bgFill }: { bgFill: string }) {
  return (
    <svg width="17" height="9" viewBox="0 0 17 9" aria-hidden>
      <polygon points="0,0 17,0 8.5,9" fill={A} />
      <polygon points="0,0 17,0 8.5,7.5" fill={bgFill} />
    </svg>
  )
}

function ArrowUp({ bgFill }: { bgFill: string }) {
  return (
    <svg width="17" height="9" viewBox="0 0 17 9" aria-hidden>
      <polygon points="0,9 17,9 8.5,0" fill={A} />
      <polygon points="0,9 17,9 8.5,1.5" fill={bgFill} />
    </svg>
  )
}

function ArrowRight({ bgFill }: { bgFill: string }) {
  return (
    <svg width="9" height="17" viewBox="0 0 9 17" aria-hidden>
      <polygon points="0,0 0,17 9,8.5" fill={A} />
      <polygon points="0,0 0,17 7.5,8.5" fill={bgFill} />
    </svg>
  )
}

function ArrowLeft({ bgFill }: { bgFill: string }) {
  return (
    <svg width="9" height="17" viewBox="0 0 9 17" aria-hidden>
      <polygon points="9,0 9,17 0,8.5" fill={A} />
      <polygon points="9,0 9,17 1.5,8.5" fill={bgFill} />
    </svg>
  )
}

// ── Types ─────────────────────────────────────────────────────────────────────

export type TooltipPlacement =
  | "topCenter"
  | "topStart"
  | "topEnd"
  | "bottomCenter"
  | "bottomStart"
  | "bottomEnd"
  | "startCenter"
  | "startTop"
  | "startBottom"
  | "endCenter"
  | "endTop"
  | "endBottom"

// ── Placement configs ─────────────────────────────────────────────────────────

type Config = {
  outerClass: string
  arrowWrapClass: string
  Arrow: React.ComponentType<{ bgFill: string }>
  arrowFirst: boolean
}

const CONFIGS: Record<TooltipPlacement, Config> = {
  topCenter: {
    outerClass: "bottom-full left-1/2 -translate-x-1/2 mb-1 flex flex-col items-center",
    arrowWrapClass: "flex justify-center w-full",
    Arrow: ArrowDown,
    arrowFirst: false,
  },
  topStart: {
    outerClass: "bottom-full left-0 mb-1 flex flex-col",
    arrowWrapClass: "flex justify-start pl-3",
    Arrow: ArrowDown,
    arrowFirst: false,
  },
  topEnd: {
    outerClass: "bottom-full right-0 mb-1 flex flex-col",
    arrowWrapClass: "flex justify-end pr-3",
    Arrow: ArrowDown,
    arrowFirst: false,
  },
  bottomCenter: {
    outerClass: "top-full left-1/2 -translate-x-1/2 mt-1 flex flex-col items-center",
    arrowWrapClass: "flex justify-center w-full",
    Arrow: ArrowUp,
    arrowFirst: true,
  },
  bottomStart: {
    outerClass: "top-full left-0 mt-1 flex flex-col",
    arrowWrapClass: "flex justify-start pl-3",
    Arrow: ArrowUp,
    arrowFirst: true,
  },
  bottomEnd: {
    outerClass: "top-full right-0 mt-1 flex flex-col",
    arrowWrapClass: "flex justify-end pr-3",
    Arrow: ArrowUp,
    arrowFirst: true,
  },
  startCenter: {
    outerClass: "right-full top-1/2 -translate-y-1/2 mr-1 flex flex-row items-center",
    arrowWrapClass: "flex flex-col justify-center self-stretch",
    Arrow: ArrowRight,
    arrowFirst: false,
  },
  startTop: {
    outerClass: "right-full top-0 mr-1 flex flex-row",
    arrowWrapClass: "flex flex-col justify-start pt-3",
    Arrow: ArrowRight,
    arrowFirst: false,
  },
  startBottom: {
    outerClass: "right-full bottom-0 mr-1 flex flex-row",
    arrowWrapClass: "flex flex-col justify-end pb-3",
    Arrow: ArrowRight,
    arrowFirst: false,
  },
  endCenter: {
    outerClass: "left-full top-1/2 -translate-y-1/2 ml-1 flex flex-row items-center",
    arrowWrapClass: "flex flex-col justify-center self-stretch",
    Arrow: ArrowLeft,
    arrowFirst: true,
  },
  endTop: {
    outerClass: "left-full top-0 ml-1 flex flex-row",
    arrowWrapClass: "flex flex-col justify-start pt-3",
    Arrow: ArrowLeft,
    arrowFirst: true,
  },
  endBottom: {
    outerClass: "left-full bottom-0 ml-1 flex flex-row",
    arrowWrapClass: "flex flex-col justify-end pb-3",
    Arrow: ArrowLeft,
    arrowFirst: true,
  },
}

// ── Main component ────────────────────────────────────────────────────────────

/**
 * Tooltip — Simple text tooltip that appears on hover/focus.
 *
 * The "base" color uses a dark (#334450) background with white text.
 * The "onColor" variant uses a white background with dark text.
 *
 * @prop content    The tooltip text
 * @prop placement  Where the tooltip appears relative to the trigger (default: "topCenter")
 * @prop color      "base" (dark bg, white text) | "onColor" (white bg, dark text)
 *
 * @example
 * <Tooltip content="Save your work">
 *   <button>Save</button>
 * </Tooltip>
 *
 * <Tooltip content="Settings" placement="bottomCenter" color="onColor">
 *   <button>⚙</button>
 * </Tooltip>
 */
function Tooltip({
  content,
  placement = "topCenter",
  color = "base",
  children,
  className,
}: {
  content: string
  placement?: TooltipPlacement
  color?: "base" | "onColor"
  children: React.ReactNode
  className?: string
}) {
  const [open, setOpen] = React.useState(false)
  const id = React.useId()

  const { outerClass, arrowWrapClass, Arrow, arrowFirst } = CONFIGS[placement]

  const bgClass = color === "base" ? "bg-[#334450]" : "bg-white"
  const textClass = color === "base" ? "text-white" : "text-[var(--icon-base)]"

  const bubble = (
    <div
      className={cn(
        "rounded-xl border border-[#8d959f] px-3 py-3",
        "shadow-[0_2px_3.5px_2px_rgba(0,0,0,0.15),0_1px_1.75px_0_rgba(0,0,0,0.30)]",
        "text-sm font-medium leading-none whitespace-nowrap",
        bgClass,
        textClass,
      )}
    >
      {content}
    </div>
  )

  const bgFill = color === "base" ? "#334450" : "white"

  const arrow = (
    <div className={arrowWrapClass}>
      <Arrow bgFill={bgFill} />
    </div>
  )

  return (
    <span
      className={cn("relative inline-flex", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open && (
        <div
          id={id}
          role="tooltip"
          className={cn("absolute z-50 pointer-events-none", outerClass)}
        >
          {arrowFirst ? (
            <>{arrow}{bubble}</>
          ) : (
            <>{bubble}{arrow}</>
          )}
        </div>
      )}
    </span>
  )
}

export { Tooltip }
