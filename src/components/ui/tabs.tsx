"use client"

import * as React from "react"
import { Tabs as TabsPrimitive } from "radix-ui"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

// ── Variant context ───────────────────────────────────────────────────────────

type TabsVariant = "primary" | "secondary"
const TabsVariantContext = React.createContext<TabsVariant>("primary")

// ── Root ─────────────────────────────────────────────────────────────────────

/**
 * Tabs — Pencil design system tabs component.
 *
 * @prop variant  "primary" (underline indicator) | "secondary" (filled pill)
 *
 * @example
 * <Tabs defaultValue="a" variant="primary">
 *   <TabsList>
 *     <TabsTrigger value="a">Tab A</TabsTrigger>
 *     <TabsTrigger value="b">Tab B</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="a">Content A</TabsContent>
 *   <TabsContent value="b">Content B</TabsContent>
 * </Tabs>
 */
function Tabs({
  variant = "primary",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root> & {
  variant?: TabsVariant
}) {
  return (
    <TabsVariantContext.Provider value={variant}>
      <TabsPrimitive.Root data-slot="tabs" data-variant={variant} {...props} />
    </TabsVariantContext.Provider>
  )
}

// ── List ──────────────────────────────────────────────────────────────────────

const tabsListVariants = cva("inline-flex shrink-0", {
  variants: {
    variant: {
      // Full-width 1px gray bottom border — active trigger overlays it with 4px
      primary: "items-end border-b border-[var(--color-stroke-base)] bg-transparent w-full",
      // Tabs sit bottom-aligned; each trigger carries its own bottom border
      secondary: "items-end gap-0 bg-transparent",
    },
  },
  defaultVariants: { variant: "primary" },
})

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  const variant = React.useContext(TabsVariantContext)
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

// ── Trigger ───────────────────────────────────────────────────────────────────

const tabsTriggerVariants = cva(
  [
    "inline-flex items-center justify-center whitespace-nowrap select-none outline-none cursor-pointer",
    "transition-colors text-base font-normal text-[var(--input-label)]",
    "focus-visible:ring-2 focus-visible:ring-[var(--color-info)] focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-40",
  ].join(" "),
  {
    variants: {
      variant: {
        // Underline indicator: 4px dark bottom border on active, -mb-px overlays the list border
        primary: [
          "pt-4 pb-3 px-5 bg-transparent",
          "border-b-4 border-transparent -mb-px",
          "data-[state=active]:border-[var(--btn-primary-bg)]",
        ].join(" "),
        // Rounded top, flat bottom. Each trigger owns its bottom border.
        // CSS specificity ensures data-[state=active]+hover beats plain hover.
        secondary: [
          // Shape & padding — top-rounded only
          "rounded-t-lg py-3 px-4",
          // Border frame: 1px on all sides, transparent by default
          "border border-transparent",
          // ── Inactive default: gray bottom only ──
          "border-b-[var(--color-stroke-base)]",
          // ── Inactive hover: navy L/T/R, gray bottom ──
          "hover:border-[var(--btn-primary-bg)] hover:border-b-[var(--color-stroke-base)]",
          // ── Active default: navy bg, white text, navy border (invisible against bg), no bottom ──
          "data-[state=active]:bg-[var(--btn-primary-bg)] data-[state=active]:text-white",
          "data-[state=active]:border-[var(--btn-primary-bg)] data-[state=active]:border-b-transparent",
          // ── Active hover: gray L/T/R, no bottom ──
          "data-[state=active]:hover:border-[var(--color-stroke-base)] data-[state=active]:hover:border-b-transparent",
        ].join(" "),
      },
    },
    defaultVariants: { variant: "primary" },
  }
)

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const variant = React.useContext(TabsVariantContext)
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(tabsTriggerVariants({ variant }), className)}
      {...props}
    />
  )
}

// ── Content ───────────────────────────────────────────────────────────────────

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        "outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-info)] focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
