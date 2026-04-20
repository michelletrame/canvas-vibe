"use client"

import * as React from "react"
import { Info, XCircle, CheckCircle, TriangleAlert, X } from "lucide-react"
import { cn } from "@/lib/utils"

// ── Types ─────────────────────────────────────────────────────────────────────

type AlertVariant = "info" | "error" | "success" | "warning"
type AlertLayout  = "inline" | "expanded"
type AlertDisplay = "embedded" | "floating"

// ── Variant config ────────────────────────────────────────────────────────────

const VARIANT_CONFIG: Record<AlertVariant, {
  icon:      React.ComponentType<{ className?: string; strokeWidth?: number }>
  stripBg:   string
  contentBg: string
  border:    string
}> = {
  info:    { icon: Info,          stripBg: "#2b7abc", contentBg: "#ffffff", border: "#a8d0ef" },
  error:   { icon: XCircle,       stripBg: "#c0392b", contentBg: "#ffffff", border: "#f0b8b8" },
  success: { icon: CheckCircle,   stripBg: "#27ae60", contentBg: "#ffffff", border: "#a3ddb8" },
  warning: { icon: TriangleAlert, stripBg: "#e67e22", contentBg: "#ffffff", border: "#f5cfa0" },
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Alert — Pencil design system alert component.
 *
 * @prop variant           "info" | "error" | "success" | "warning"  (default "info")
 * @prop layout            "inline" (single row) | "expanded" (block with padding)  (default "inline")
 * @prop display           "embedded" (in-flow) | "floating" (fixed top-right, animates in)  (default "embedded")
 * @prop onDismiss         Shows × button. If omitted and display="floating", auto-closes after autoCloseDuration.
 * @prop autoCloseDuration ms before auto-close when floating with no onDismiss  (default 4000)
 *
 * @example
 * // Embedded inline info
 * <Alert variant="info">Your session will expire soon.</Alert>
 *
 * // Floating success with dismiss
 * <Alert variant="success" display="floating" onDismiss={() => setShow(false)}>
 *   Changes saved.
 * </Alert>
 *
 * // Floating auto-close (no dismiss)
 * <Alert variant="success" display="floating">Notified!</Alert>
 */
function Alert({
  variant = "info",
  layout = "inline",
  display = "embedded",
  children,
  onDismiss,
  autoCloseDuration = 4000,
  className,
}: {
  variant?:           AlertVariant
  layout?:            AlertLayout
  display?:           AlertDisplay
  children:           React.ReactNode
  onDismiss?:         () => void
  autoCloseDuration?: number
  className?:         string
}) {
  const [visible, setVisible] = React.useState(true)
  const [exiting, setExiting] = React.useState(false)

  const config = VARIANT_CONFIG[variant]
  const Icon   = config.icon

  // Auto-close for floating alerts with no manual dismiss
  React.useEffect(() => {
    if (display !== "floating" || onDismiss) return
    const timer = setTimeout(() => {
      setExiting(true)
      setTimeout(() => setVisible(false), 300)
    }, autoCloseDuration)
    return () => clearTimeout(timer)
  }, [display, onDismiss, autoCloseDuration])

  if (!visible) return null

  function handleDismiss() {
    if (display === "floating") {
      setExiting(true)
      setTimeout(() => {
        setVisible(false)
        onDismiss?.()
      }, 300)
    } else {
      onDismiss?.()
    }
  }

  const outer = cn(
    "flex flex-row rounded-xl overflow-hidden",
    // Floating positioning + animation
    display === "floating" && [
      "fixed top-8 left-1/2 -translate-x-1/2 z-50 w-[560px] shadow-lg",
      !exiting && "animate-in slide-in-from-top-2 fade-in-0 duration-200",
      exiting  && "animate-out fade-out-0 duration-300 fill-mode-forwards",
    ],
    // Embedded sizing
    display === "embedded" && "w-full",
    className,
  )

  const contentStyle: React.CSSProperties =
    layout === "expanded"
      ? { background: config.contentBg, borderTop: `1px solid ${config.border}`, borderRight: `1px solid ${config.border}`, borderBottom: `1px solid ${config.border}`, borderRadius: "0 0.75rem 0.75rem 0" }
      : { background: config.contentBg, borderTop: `1px solid ${config.border}`, borderRight: `1px solid ${config.border}`, borderBottom: `1px solid ${config.border}`, borderRadius: "0 0.75rem 0.75rem 0" }

  return (
    <div data-slot="alert" data-variant={variant} data-layout={layout} data-display={display} className={outer}>
      {/* Icon strip */}
      <div
        className="w-10 shrink-0 flex items-center justify-center"
        style={{ background: config.stripBg }}
      >
        <Icon className="w-5 h-5 text-white" strokeWidth={2} />
      </div>

      {/* Content */}
      <div
        className={cn(
          "flex-1 px-6",
          layout === "inline"    && "flex flex-row items-center gap-3 py-3",
          layout === "expanded"  && "flex flex-col gap-3 py-3",
        )}
        style={contentStyle}
      >
        <span
          className="flex-1 text-base leading-relaxed"
          style={{ color: "#273540" }}
        >
          {children}
        </span>

        {/* Dismiss button */}
        {(onDismiss || display === "floating") && (
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss"
            className={cn(
              "shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-md",
              "text-[#576773] hover:text-[#273540] hover:bg-black/5 transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-info)]",
              layout === "expanded" && "self-end",
            )}
          >
            <X size={14} strokeWidth={2} />
          </button>
        )}
      </div>
    </div>
  )
}

export { Alert }
export type { AlertVariant, AlertLayout, AlertDisplay }
