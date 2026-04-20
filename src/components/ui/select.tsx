"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"
import { Check, ChevronDown, ChevronUp, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

// ── Trigger variants ───────────────────────────────────────────────────────────

const selectTriggerVariants = cva(
  [
    "group flex items-center gap-2 w-full min-w-0",
    "border border-[var(--input-border)] rounded-[var(--input-radius)]",
    "bg-[var(--input-bg)] text-[var(--foreground)]",
    "transition-[background-color,border-color,box-shadow] outline-none font-normal",
    "hover:bg-[var(--input-bg-hover)] hover:border-[var(--input-border-hover)]",
    "focus-visible:bg-[var(--input-bg)] focus-visible:border-[var(--color-info)]",
    "focus-visible:ring-2 focus-visible:ring-[var(--color-info)] focus-visible:ring-offset-[3px]",
    "disabled:pointer-events-none disabled:cursor-not-allowed",
    "disabled:bg-[var(--input-bg-disabled)] disabled:border-[var(--input-border-disabled)]",
    "disabled:text-[var(--input-text-disabled)]",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "h-8 pl-2 pr-3 text-sm",
        md: "h-10 px-3 text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

// Status border overrides (same pattern as Input)
const statusClasses = {
  error:
    "border-[var(--input-border-error)] hover:border-[var(--input-border-error)] focus-visible:border-[var(--input-border-error)]",
  success:
    "border-[var(--input-border-success)] hover:border-[var(--input-border-success)] focus-visible:border-[var(--input-border-success)]",
} as const

// ── Root ──────────────────────────────────────────────────────────────────────

/**
 * Select — Pencil design system select component.
 *
 * @prop size  "sm" (32px) | "md" (40px, default)
 *
 * @example
 * <Select>
 *   <SelectTrigger size="md" placeholder="Select an option" />
 *   <SelectContent>
 *     <SelectItem value="a">Option A</SelectItem>
 *     <SelectItem value="b">Option B</SelectItem>
 *   </SelectContent>
 * </Select>
 */
function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

// ── Group ─────────────────────────────────────────────────────────────────────

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

// ── Value ─────────────────────────────────────────────────────────────────────

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

// ── Trigger ───────────────────────────────────────────────────────────────────

function SelectTrigger({
  className,
  size = "md",
  status,
  placeholder,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> &
  VariantProps<typeof selectTriggerVariants> & {
    status?: "error" | "success"
    placeholder?: string
  }) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        selectTriggerVariants({ size }),
        status && statusClasses[status],
        className
      )}
      {...props}
    >
      {children ?? (
        <SelectPrimitive.Value
          placeholder={placeholder ?? "Select an option"}
          className="flex-1 min-w-0 text-left truncate data-[placeholder]:text-[var(--input-placeholder)]"
        />
      )}
      <ChevronDown
        width={16}
        height={16}
        strokeWidth={1.5}
        className="ml-auto shrink-0 text-[var(--color-stroke-base)] transition-transform duration-200 group-data-[state=open]:rotate-180"
        aria-hidden
      />
    </SelectPrimitive.Trigger>
  )
}

// ── Scroll buttons ─────────────────────────────────────────────────────────────

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up"
      className={cn(
        "flex items-center justify-center py-1 text-[var(--color-stroke-base)]",
        className
      )}
      {...props}
    >
      <ChevronUp width={16} height={16} strokeWidth={1.5} />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down"
      className={cn(
        "flex items-center justify-center py-1 text-[var(--color-stroke-base)]",
        className
      )}
      {...props}
    >
      <ChevronDown width={16} height={16} strokeWidth={1.5} />
    </SelectPrimitive.ScrollDownButton>
  )
}

// ── Content ───────────────────────────────────────────────────────────────────

function SelectContent({
  className,
  children,
  position = "popper",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        position={position}
        sideOffset={sideOffset}
        className={cn(
          "z-50 max-h-60 overflow-hidden rounded-xl",
          "border border-[var(--color-stroke-base)] bg-white",
          "shadow-[var(--shadow-popover)]",
          position === "popper" &&
            "min-w-[var(--radix-select-trigger-width)] w-[var(--radix-select-trigger-width)]",
          // Animations
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
          "data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2",
          className
        )}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport className="p-1">
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

// ── Label ─────────────────────────────────────────────────────────────────────

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn(
        "px-3 py-1.5 text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide",
        className
      )}
      {...props}
    />
  )
}

// ── Item ──────────────────────────────────────────────────────────────────────

/**
 * SelectItem — a single option in the dropdown.
 *
 * @prop icon         Optional Lucide icon rendered on the left (20px)
 * @prop trailingIcon Optional Lucide icon rendered on the right before the checkmark (16px)
 * @prop description  Optional subtitle text below the main label
 * @prop divider      When true, renders a bottom border separator after this item
 */
function SelectItem({
  className,
  children,
  icon: Icon,
  trailingIcon: TrailingIcon,
  description,
  divider,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item> & {
  icon?: LucideIcon
  trailingIcon?: LucideIcon
  description?: string
  divider?: boolean
}) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        // Layout
        "group relative flex items-center gap-2 rounded-lg px-3 py-3",
        // Text
        "text-base text-[var(--input-label)] select-none cursor-pointer outline-none",
        // States
        "data-[highlighted]:bg-[var(--btn-tertiary-bg-hover)]",
        "data-[state=checked]:!bg-[var(--btn-primary-bg)] data-[state=checked]:!text-white",
        "data-[disabled]:pointer-events-none data-[disabled]:text-[var(--input-text-disabled)]",
        // Divider
        divider && "border-b border-[var(--color-stroke-muted)] group-data-[state=checked]:border-white/20 rounded-b-none",
        className
      )}
      {...props}
    >
      {Icon && (
        <Icon
          width={20}
          height={20}
          strokeWidth={1.5}
          aria-hidden
          className="shrink-0 text-[var(--icon-base)] group-data-[state=checked]:text-white"
        />
      )}
      <span className="flex flex-col flex-1 min-w-0 gap-0.5">
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        {description && (
          <span className="text-sm text-[var(--muted-foreground)] group-data-[state=checked]:text-white/80 truncate">
            {description}
          </span>
        )}
      </span>
      {TrailingIcon && (
        <TrailingIcon
          width={16}
          height={16}
          strokeWidth={1.5}
          aria-hidden
          className="shrink-0 text-[var(--icon-muted)] group-data-[state=checked]:text-white"
        />
      )}
      <SelectPrimitive.ItemIndicator>
        <Check
          width={16}
          height={16}
          strokeWidth={1.5}
          className="shrink-0 text-[var(--color-info)] group-data-[state=checked]:text-white"
        />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}

// ── Separator ─────────────────────────────────────────────────────────────────

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("-mx-1 my-1 h-px bg-[var(--color-stroke-muted)]", className)}
      {...props}
    />
  )
}

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
