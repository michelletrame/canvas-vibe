import * as React from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Icon } from "@/components/ui/icon"

/**
 * Breadcrumb — Navigation trail with optional icons per item.
 *
 * The last item is always rendered as the current page (plain text, not a link).
 * All preceding items are rendered as links.
 *
 * @prop items  Ordered array of crumbs. Last item = current page.
 * @prop size   "sm" | "md" (default) | "lg"
 *
 * @example
 * <Breadcrumb items={[
 *   { label: "Home", href: "/" },
 *   { label: "Products", href: "/products" },
 *   { label: "MacBook Pro" },
 * ]} />
 *
 * <Breadcrumb size="lg" items={[
 *   { label: "Dashboard", href: "/", icon: Home },
 *   { label: "Settings" },
 * ]} />
 */

export type BreadcrumbItem = {
  label: string
  href?: string
  icon?: React.ComponentType<{ className?: string }>
}

function Breadcrumb({
  items,
  size = "md",
  className,
}: {
  items: BreadcrumbItem[]
  size?: "sm" | "md" | "lg"
  className?: string
}) {
  const textClass = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-[28px]",
  }[size]

  const iconClass = {
    sm: "w-3 h-3 shrink-0",
    md: "w-4 h-4 shrink-0",
    lg: "w-6 h-6 shrink-0",
  }[size]

  // gap between icon and label within a crumb
  const innerGapClass = {
    sm: "gap-0.5",
    md: "gap-1",
    lg: "gap-1",
  }[size]

  // gap between the crumb link and the following separator
  const separatorGapClass = {
    sm: "gap-1",
    md: "gap-1",
    lg: "gap-2",
  }[size]

  // space after the separator before the next crumb
  const afterSeparatorClass = {
    sm: "mr-1",
    md: "mr-1",
    lg: "mr-2",
  }[size]

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center">
        {items.map((item, i) => {
          const isLast = i === items.length - 1

          return (
            <li
              key={i}
              className={cn("flex items-center", !isLast && separatorGapClass)}
            >
              {isLast ? (
                // Current page — plain text, no link
                <span
                  aria-current="page"
                  className={cn(
                    "inline-flex items-center font-normal text-[var(--icon-base)]",
                    textClass,
                    innerGapClass,
                  )}
                >
                  {item.icon && <item.icon className={iconClass} />}
                  {item.label}
                </span>
              ) : (
                // Ancestor — link
                <Link
                  href={item.href ?? "#"}
                  className={cn(
                    "inline-flex items-center font-normal text-[var(--link-text)]",
                    "hover:text-[var(--link-text-hover)]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-info)] focus-visible:rounded-sm",
                    "transition-colors",
                    textClass,
                    innerGapClass,
                  )}
                >
                  {item.icon && <item.icon className={iconClass} />}
                  {item.label}
                </Link>
              )}

              {!isLast && (
                <Icon
                  icon={ChevronRight}
                  size="sm"
                  color="muted"
                  className={cn(afterSeparatorClass)}
                  aria-hidden
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export { Breadcrumb }
