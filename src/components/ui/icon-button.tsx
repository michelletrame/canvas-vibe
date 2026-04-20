import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import { type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const iconButtonVariants = cva(
  "inline-flex shrink-0 items-center justify-center transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
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
        ghost:
          "bg-transparent text-[var(--btn-ghost-text)] hover:bg-[var(--btn-tertiary-bg-hover)] active:bg-[var(--btn-tertiary-bg-active)] disabled:bg-transparent disabled:text-[var(--color-text-disabled)]",
        ghostOnColor:
          "bg-transparent text-white hover:bg-[var(--btn-oncolor-secondary-bg-hover)] active:bg-[var(--btn-oncolor-secondary-bg-hover)] disabled:text-[var(--btn-tertiary-stroke-disabled)]",
      },
      size: {
        sm: "size-8",
        md: "size-10",
        lg: "size-12",
      },
      shape: {
        base: "rounded-[var(--btn-radius)]",
        circle: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      shape: "base",
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
 * IconButton — Icon-only square/circle button for all 11 Pencil variants.
 *
 * @prop variant  "primary" | "secondary" | "tertiary" |
 *                "destructivePrimary" | "destructiveSecondary" |
 *                "successPrimary" | "successSecondary" |
 *                "aiPrimary" | "aiSecondary" |
 *                "onColorPrimary" | "onColorSecondary" |
 *                "ghost" | "ghostOnColor"
 * @prop size     "sm" (32px) | "md" (40px) | "lg" (48px)
 * @prop shape    "base" (12px radius) | "circle" (fully rounded)
 * @prop icon     Required Lucide icon component
 * @prop asChild  Render as a Slot (for use with <Link>, <a>, etc.)
 *
 * @example
 * <IconButton variant="primary" icon={Settings} />
 * <IconButton variant="tertiary" size="sm" shape="circle" icon={X} />
 */
function IconButton({
  className,
  variant = "primary",
  size = "md",
  shape = "base",
  asChild = false,
  icon: IconComp,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof iconButtonVariants> & {
    asChild?: boolean
    icon?: LucideIcon
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
      data-slot="icon-button"
      data-variant={variant}
      data-size={size}
      data-shape={shape}
      className={cn(iconButtonVariants({ variant, size, shape, className }))}
      {...props}
    >
      {aiSrc
        ? <img src={aiSrc} width={iconPx} height={iconPx} alt="" aria-hidden />
        : IconComp
          ? <IconComp width={iconPx} height={iconPx} strokeWidth={iconStrokeMap[size ?? "md"] ?? 1.5} aria-hidden />
          : null
      }
    </Comp>
  )
}

export { IconButton, iconButtonVariants }
