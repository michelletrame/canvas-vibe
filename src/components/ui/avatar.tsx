"use client"

import * as React from "react"
import { Avatar as AvatarPrimitive } from "radix-ui"
import { User } from "lucide-react"

import { cn } from "@/lib/utils"

// ── Types ──────────────────────────────────────────────────────────────────────

type AvatarSize =
  | "xxSmall"
  | "xSmall"
  | "small"
  | "medium"
  | "large"
  | "xLarge"
  | "xxLarge"

type AvatarShape = "circle" | "rectangle"

// ── Size lookup tables ─────────────────────────────────────────────────────────

const containerSizeClasses: Record<AvatarSize, string> = {
  xxSmall: "size-6",
  xSmall:  "size-8",
  small:   "size-10",
  medium:  "size-12",
  large:   "size-14",
  xLarge:  "size-16",
  xxLarge: "size-20",
}

const textSizeClasses: Record<AvatarSize, string> = {
  xxSmall: "text-xs",
  xSmall:  "text-xs",
  small:   "text-sm",
  medium:  "text-base",
  large:   "text-xl",
  xLarge:  "text-[28px]",
  xxLarge: "text-[40px]",
}

const iconSizeMap: Record<AvatarSize, number> = {
  xxSmall: 12,
  xSmall:  12,
  small:   16,
  medium:  20,
  large:   24,
  xLarge:  28,
  xxLarge: 36,
}

// ── AvatarRoot ─────────────────────────────────────────────────────────────────

/**
 * AvatarRoot — low-level wrapper around AvatarPrimitive.Root.
 * Handles size, shape, border, and inverse colour scheme.
 */
function AvatarRoot({
  className,
  size = "medium",
  shape = "circle",
  showBorder = false,
  inverse = false,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> & {
  size?: AvatarSize
  shape?: AvatarShape
  showBorder?: boolean
  inverse?: boolean
}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex shrink-0 overflow-hidden",
        containerSizeClasses[size],
        shape === "circle" ? "rounded-full" : "rounded-[4px]",
        inverse
          ? "bg-[var(--color-info)]"
          : "bg-white",
        showBorder && "ring-1 ring-[var(--color-stroke-base)]",
        className
      )}
      {...props}
    />
  )
}

// ── AvatarImage ────────────────────────────────────────────────────────────────

/**
 * AvatarImage — fills the avatar container, object-cover.
 */
function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full object-cover", className)}
      {...props}
    />
  )
}

// ── AvatarFallback ─────────────────────────────────────────────────────────────

/**
 * AvatarFallback — shown when image fails or no image is provided.
 * Pass size + inverse to get correct text sizing and colour.
 */
function AvatarFallback({
  className,
  size = "medium",
  inverse = false,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback> & {
  size?: AvatarSize
  inverse?: boolean
}) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center font-semibold select-none",
        textSizeClasses[size],
        inverse ? "text-white" : "text-[var(--color-info)]",
        className
      )}
      {...props}
    />
  )
}

// ── Avatar (compound) ──────────────────────────────────────────────────────────

/**
 * Avatar — compound component combining Root + Image + Fallback.
 *
 * Content priority:
 *   1. `src` → shows image; `initials` or `icon` used as fallback
 *   2. `initials` only → text fallback (no image)
 *   3. `icon` only → icon fallback (no image)
 *   4. neither → default User icon fallback
 *
 * @example
 * // Image with text fallback
 * <Avatar src="/photo.jpg" alt="Sara R." initials="SR" size="medium" />
 *
 * // Text initials
 * <Avatar initials="SR" size="large" inverse />
 *
 * // Icon
 * <Avatar icon={UserIcon} size="small" showBorder />
 */
function Avatar({
  size = "medium",
  shape = "circle",
  showBorder = false,
  inverse = false,
  src,
  alt,
  initials,
  icon: IconComponent,
  className,
}: {
  size?: AvatarSize
  shape?: AvatarShape
  showBorder?: boolean
  inverse?: boolean
  src?: string
  alt?: string
  initials?: string
  icon?: React.ElementType
  className?: string
}) {
  const iconPx = iconSizeMap[size]

  const FallbackContent = initials ? (
    <span>{initials}</span>
  ) : IconComponent ? (
    <IconComponent width={iconPx} height={iconPx} aria-hidden />
  ) : (
    <User width={iconPx} height={iconPx} aria-hidden />
  )

  return (
    <AvatarRoot
      size={size}
      shape={shape}
      showBorder={showBorder}
      inverse={inverse}
      className={className}
    >
      {src && <AvatarImage src={src} alt={alt ?? ""} />}
      <AvatarFallback size={size} inverse={inverse}>
        {FallbackContent}
      </AvatarFallback>
    </AvatarRoot>
  )
}

export { AvatarRoot, AvatarImage, AvatarFallback, Avatar }
export type { AvatarSize, AvatarShape }
