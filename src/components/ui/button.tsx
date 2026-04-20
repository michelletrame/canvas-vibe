import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import { type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-[var(--btn-radius)] text-sm font-semibold whitespace-nowrap transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // ── Pencil variants ────────────────────────────────────────────────
        primary:
          "bg-[var(--btn-primary-bg)] text-white hover:bg-[var(--btn-primary-bg-hover)] active:bg-[var(--btn-primary-bg-active)] disabled:bg-[var(--btn-disabled-bg)] disabled:text-[var(--btn-disabled-text)]",
        secondary:
          "bg-[var(--btn-secondary-bg)] text-[var(--btn-secondary-text)] hover:bg-[var(--btn-secondary-bg-hover)] active:bg-[var(--btn-secondary-bg-active)] disabled:bg-[var(--btn-disabled-bg)] disabled:text-[var(--btn-disabled-text)]",
        tertiary:
          "bg-transparent text-[var(--btn-secondary-text)] border border-[var(--btn-tertiary-stroke)] hover:bg-[var(--btn-tertiary-bg-hover)] active:bg-[var(--btn-tertiary-bg-active)] active:border-[var(--btn-tertiary-stroke-active)] disabled:bg-transparent disabled:border-[var(--btn-tertiary-stroke-disabled)] disabled:text-[var(--btn-tertiary-text-disabled)]",
        destructivePrimary:
          "bg-[var(--btn-destructive-bg)] text-white hover:bg-[var(--btn-destructive-bg-hover)] active:bg-[var(--btn-destructive-bg-active)] disabled:bg-[var(--btn-disabled-bg)] disabled:text-[var(--btn-disabled-text)]",
        destructiveSecondary:
          "bg-transparent text-[var(--btn-destructive-secondary-text)] border border-[var(--btn-destructive-secondary-text)] hover:bg-[var(--btn-destructive-secondary-bg-hover)] active:bg-[var(--btn-destructive-secondary-bg-active)] disabled:opacity-40",
        successPrimary:
          "bg-[var(--btn-success-bg)] text-white hover:bg-[var(--btn-success-bg-hover)] active:bg-[var(--btn-success-bg-active)] disabled:bg-[var(--btn-disabled-bg)] disabled:text-[var(--btn-disabled-text)]",
        successSecondary:
          "bg-transparent text-[var(--btn-success-secondary-text)] border border-[var(--btn-success-secondary-text)] hover:bg-[var(--btn-success-secondary-bg-hover)] active:bg-[var(--btn-success-secondary-bg-active)] disabled:opacity-40",
        aiPrimary:
          "btn-ai-primary text-white disabled:bg-[var(--btn-disabled-bg)] disabled:text-[var(--btn-disabled-text)]",
        aiSecondary:
          "btn-ai-secondary bg-transparent text-[var(--btn-ai-secondary-text)] border border-[var(--btn-ai-secondary-text)] disabled:opacity-40",
        onColorPrimary:
          "bg-[var(--btn-oncolor-primary-bg)] text-[var(--btn-oncolor-primary-text)] hover:bg-[var(--btn-oncolor-primary-bg-hover)] active:bg-[var(--btn-oncolor-primary-bg-active)] disabled:bg-[var(--btn-oncolor-primary-bg-disabled)] disabled:text-white",
        onColorSecondary:
          "bg-transparent text-[var(--btn-oncolor-secondary-text)] border border-[var(--btn-oncolor-secondary-text)] hover:bg-[var(--btn-oncolor-secondary-bg-hover)] active:bg-[var(--btn-oncolor-secondary-bg-hover)] disabled:opacity-40",

      },
      size: {
        sm: "h-8 px-3 gap-2 text-sm",
        md: "h-10 px-4 gap-2 text-base",
        lg: "h-12 px-5 gap-3 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

/** Icon pixel size per button size */
const iconPxMap: Record<string, number> = {
  sm: 16,
  md: 20,
  lg: 24,
}

/** Icon stroke width per button size (from Pencil size scale) */
const iconStrokeMap: Record<string, number> = {
  sm: 1.25,
  md: 1.5,
  lg: 2,
}

/**
 * Button — Pencil design system button component.
 *
 * @prop variant   "primary" | "secondary" | "tertiary" |
 *                 "destructivePrimary" | "destructiveSecondary" |
 *                 "successPrimary" | "successSecondary" |
 *                 "aiPrimary" | "aiSecondary" |
 *                 "onColorPrimary" | "onColorSecondary"
 * @prop size      "sm" (32px · 14px text · 16px icon · 8px gap) |
 *                 "md" (40px · 16px text · 20px icon · 8px gap) |
 *                 "lg" (48px · 18px text · 24px icon · 12px gap)
 * @prop leftIcon  Optional Lucide icon rendered before the label
 * @prop rightIcon Optional Lucide icon rendered after the label
 * @prop disabled  Applies Pencil disabled styling (explicit colors, not just opacity)
 * @prop asChild   Render as a Slot (for use with <Link>, <a>, etc.)
 *
 * @example
 * // Icon on left
 * <Button variant="primary" leftIcon={Settings}>Settings</Button>
 *
 * // Icon on right
 * <Button variant="tertiary" rightIcon={ArrowRight}>Continue</Button>
 *
 * // Both sides
 * <Button variant="aiPrimary" leftIcon={Zap} rightIcon={ArrowRight}>Generate</Button>
 */
function Button({
  className,
  variant = "primary",
  size = "md",
  asChild = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    leftIcon?: LucideIcon
    rightIcon?: LucideIcon
  }) {
  const Comp = asChild ? Slot.Root : "button"
  const iconPx = iconPxMap[size ?? "md"] ?? 20
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ""
  const aiSrc =
    variant === "aiPrimary" ? `${base}/svg/ignite-white.svg`
    : variant === "aiSecondary" ? `${base}/svg/ignite-color.svg`
    : null

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {aiSrc && (
        <img src={aiSrc} width={iconPx} height={iconPx} alt="" aria-hidden />
      )}
      {!aiSrc && LeftIcon && (
        <LeftIcon width={iconPx} height={iconPx} strokeWidth={iconStrokeMap[size ?? "md"] ?? 1.5} aria-hidden />
      )}
      {children}
      {RightIcon && (
        <RightIcon width={iconPx} height={iconPx} strokeWidth={iconStrokeMap[size ?? "md"] ?? 1.5} aria-hidden />
      )}
    </Comp>
  )
}

export { Button, buttonVariants }
