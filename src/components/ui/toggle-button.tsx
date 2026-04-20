import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"
import { type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const toggleButtonVariants = cva(
  "inline-flex shrink-0 items-center justify-center transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        base:
          "bg-transparent text-[var(--btn-ghost-text)] hover:bg-[var(--btn-tertiary-bg-hover)] active:bg-[var(--btn-tertiary-bg-active)] data-[state=on]:bg-[var(--btn-tertiary-bg-active)] disabled:bg-transparent disabled:text-[var(--color-text-disabled)]",
        onColor:
          "bg-transparent text-white hover:bg-[var(--btn-oncolor-secondary-bg-hover)] active:bg-[var(--btn-oncolor-secondary-bg-hover)] data-[state=on]:bg-[var(--btn-oncolor-secondary-bg-hover)] disabled:text-[var(--btn-tertiary-stroke-disabled)]",
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
      variant: "base",
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

/**
 * ToggleButton — Icon-only toggle button from the Pencil design system.
 *
 * Wraps Radix `Toggle.Root` — handles `pressed`, `defaultPressed`,
 * `onPressedChange`, and `disabled` props and sets `data-state="on"/"off"`.
 *
 * @prop variant  "base" (light backgrounds) | "onColor" (dark/color backgrounds)
 * @prop size     "sm" (32px) | "md" (40px) | "lg" (48px)
 * @prop shape    "base" (12px radius) | "circle" (fully rounded)
 * @prop icon     Required Lucide icon component
 *
 * @example
 * <ToggleButton icon={Bold} />
 * <ToggleButton variant="onColor" size="sm" shape="circle" icon={Star} defaultPressed />
 */
function ToggleButton({
  className,
  variant = "base",
  size = "md",
  shape = "base",
  icon: IconComp,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleButtonVariants> & {
    icon: LucideIcon
  }) {
  const iconPx = iconPxMap[size ?? "md"] ?? 20

  return (
    <TogglePrimitive.Root
      data-slot="toggle-button"
      data-variant={variant}
      data-size={size}
      data-shape={shape}
      className={cn(toggleButtonVariants({ variant, size, shape, className }))}
      {...props}
    >
      <IconComp width={iconPx} height={iconPx} strokeWidth={1.5} aria-hidden />
    </TogglePrimitive.Root>
  )
}

export { ToggleButton, toggleButtonVariants }
