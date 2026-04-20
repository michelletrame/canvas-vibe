"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

// ── Contexts ──────────────────────────────────────────────────────────────────

type DialogVariant = "default" | "inverse"
const DialogVariantContext = React.createContext<DialogVariant>("default")

type DialogSize = "sm" | "md" | "lg" | "fullscreen"
const DialogSizeContext = React.createContext<DialogSize>("sm")

// ── Root ──────────────────────────────────────────────────────────────────────

/**
 * Dialog — Pencil design system modal component.
 *
 * @prop variant  "default" (white) | "inverse" (dark navy)
 *
 * @example
 * <Dialog variant="default">
 *   <DialogTrigger asChild><Button>Open</Button></DialogTrigger>
 *   <DialogContent size="sm">
 *     <DialogHeader><DialogTitle>Title</DialogTitle></DialogHeader>
 *     <DialogBody>Content</DialogBody>
 *     <DialogFooter>
 *       <Button variant="secondary">Cancel</Button>
 *       <Button variant="primary">Confirm</Button>
 *     </DialogFooter>
 *   </DialogContent>
 * </Dialog>
 */
function Dialog({
  variant = "default",
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root> & {
  variant?: DialogVariant
}) {
  return (
    <DialogVariantContext.Provider value={variant}>
      <DialogPrimitive.Root data-slot="dialog" {...props} />
    </DialogVariantContext.Provider>
  )
}

// ── Trigger ───────────────────────────────────────────────────────────────────

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

// ── Portal ────────────────────────────────────────────────────────────────────

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

// ── Overlay ───────────────────────────────────────────────────────────────────

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-white/75",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  )
}

// ── Content ───────────────────────────────────────────────────────────────────

const dialogMaxWidthMap: Record<DialogSize, string> = {
  sm: "max-w-[480px]",
  md: "max-w-[768px]",
  lg: "max-w-[992px]",
  fullscreen: "max-w-none w-screen h-screen",
}

function DialogContent({
  className,
  size = "sm",
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  size?: DialogSize
}) {
  const variant = React.useContext(DialogVariantContext)
  const isFullscreen = size === "fullscreen"

  return (
    <DialogSizeContext.Provider value={size}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          data-slot="dialog-content"
          className={cn(
            // Position
            "fixed z-50",
            isFullscreen
              ? "inset-0"
              : "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full",
            // Shape
            isFullscreen ? "" : "rounded-2xl",
            "overflow-hidden flex flex-col",
            // Border + shadow
            "border shadow-[var(--shadow-modal)]",
            // Variant
            variant === "default" && "bg-white border-[var(--color-stroke-muted)]",
            variant === "inverse" && "bg-[var(--modal-dark-bg)] border-[var(--modal-dark-border)]",
            // Size
            dialogMaxWidthMap[size],
            // Animation
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            className
          )}
          {...props}
        >
          {children}
        </DialogPrimitive.Content>
      </DialogPortal>
    </DialogSizeContext.Provider>
  )
}

// ── Header ────────────────────────────────────────────────────────────────────

const dialogHeaderPadMap: Record<DialogSize, string> = {
  sm: "py-3 px-5",
  md: "py-6 px-6",
  lg: "py-6 px-6",
  fullscreen: "py-6 px-6",
}

function DialogHeader({ className, children, ...props }: React.ComponentProps<"div">) {
  const variant = React.useContext(DialogVariantContext)
  const size = React.useContext(DialogSizeContext)

  return (
    <div
      data-slot="dialog-header"
      className={cn(
        "flex items-center gap-3",
        dialogHeaderPadMap[size],
        "border-b",
        variant === "default" && "border-[var(--color-stroke-muted)]",
        variant === "inverse" && "border-[var(--modal-dark-border)]",
        className
      )}
      {...props}
    >
      <div className="flex-1 min-w-0">{children}</div>
      <DialogPrimitive.Close
        className={cn(
          "ml-auto shrink-0 flex items-center justify-center",
          "h-8 w-8 rounded-xl outline-none cursor-pointer",
          "transition-colors",
          "focus-visible:ring-2 focus-visible:ring-[var(--color-info)] focus-visible:ring-offset-2",
          variant === "default" && [
            "text-[var(--input-label)]",
            "hover:bg-[var(--color-stroke-muted)]",
          ],
          variant === "inverse" && [
            "text-white",
            "hover:bg-white/10",
          ]
        )}
      >
        <X width={16} height={16} strokeWidth={1.25} aria-hidden />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </div>
  )
}

// ── Title ─────────────────────────────────────────────────────────────────────

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  const variant = React.useContext(DialogVariantContext)
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "text-2xl font-bold leading-tight font-[family-name:var(--font-heading)]",
        variant === "default" && "text-[var(--input-label)]",
        variant === "inverse" && "text-white",
        className
      )}
      {...props}
    />
  )
}

// ── Description ───────────────────────────────────────────────────────────────

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  const variant = React.useContext(DialogVariantContext)
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-sm",
        variant === "default" && "text-[var(--muted-foreground)]",
        variant === "inverse" && "text-white/70",
        className
      )}
      {...props}
    />
  )
}

// ── Body ──────────────────────────────────────────────────────────────────────

function DialogBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-body"
      className={cn("flex flex-col gap-4 p-6 flex-1", className)}
      {...props}
    />
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────

const dialogFooterPadMap: Record<DialogSize, string> = {
  sm: "p-3",
  md: "p-6",
  lg: "p-6",
  fullscreen: "p-6",
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  const variant = React.useContext(DialogVariantContext)
  const size = React.useContext(DialogSizeContext)

  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex items-center justify-end gap-3",
        dialogFooterPadMap[size],
        "border-t",
        variant === "default" && "border-[var(--color-stroke-muted)]",
        variant === "inverse" && "border-[var(--modal-dark-border)]",
        className
      )}
      {...props}
    />
  )
}

// ── Close (exposed for custom triggers) ───────────────────────────────────────

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  DialogClose,
}
