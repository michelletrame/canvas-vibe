import * as React from "react"
import { cn } from "@/lib/utils"

// Size → track height in px
const sizeMap = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
} as const

/**
 * ProgressBar — Horizontal progress indicator.
 *
 * @prop value        0–100 percentage. Clamped to that range.
 * @prop size         "xs" | "sm" | "md" | "lg" — track height (8/16/24/32px). Default "md".
 * @prop color        "primary" (dark navy) | "inverse" (white) | "warning" (amber). Default "primary".
 * @prop showLabel    Whether to show the percentage label on the right. Default true.
 *
 * @example
 * <ProgressBar value={60} />
 * <ProgressBar value={100} size="lg" />
 * <ProgressBar value={40} color="inverse" />
 * <ProgressBar value={85} color="warning" />
 */
function ProgressBar({
  value,
  size = "md",
  color = "primary",
  showLabel = true,
  className,
}: {
  value: number
  size?: keyof typeof sizeMap
  color?: "primary" | "inverse" | "warning"
  showLabel?: boolean
  className?: string
}) {
  const clamped   = Math.max(0, Math.min(100, value))
  const isComplete = clamped >= 100
  const h          = sizeMap[size]
  const fillColor  = color === "inverse" ? "#ffffff" : color === "warning" ? "var(--color-warning)" : "#1d354f"
  const labelColor = color === "inverse" ? "#ffffff" : color === "warning" ? "var(--color-warning)" : "#576773"

  return (
    <div
      data-slot="progress-bar"
      className={cn("flex items-center gap-2", className)}
    >
      {/* Track */}
      <div
        style={{
          display: "flex",
          overflow: "hidden",
          borderRadius: 8,
          height: h,
          flex: 1,
        }}
      >
        {/* Filled portion */}
        <div
          style={{
            width: `${clamped}%`,
            height: "100%",
            backgroundColor: fillColor,
            flexShrink: 0,
            transition: "width 0.4s ease",
          }}
        />
        {/* Empty portion — borders on 3 sides, no fill */}
        {!isComplete && (
          <div
            style={{
              flex: 1,
              height: "100%",
              borderTop:    `1px solid ${fillColor}`,
              borderRight:  `1px solid ${fillColor}`,
              borderBottom: `1px solid ${fillColor}`,
              borderRadius: "0 8px 8px 0",
            }}
          />
        )}
      </div>

      {/* Percentage label */}
      {showLabel && (
        <span
          style={{
            color:     labelColor,
            fontSize:  16,
            lineHeight: 1,
            minWidth:  "2.5rem",
            textAlign: "right",
            fontFamily: "var(--font-body)",
          }}
        >
          {clamped}%
        </span>
      )}
    </div>
  )
}

export { ProgressBar }

// ─── ProgressCircle ──────────────────────────────────────────────────────────

const circleSizeMap = {
  xs: 48,
  sm: 80,
  md: 112,
  lg: 144,
} as const

// Font sizes [valueSize, unitSize] for percentage, [fractionalSize] for fractional
const circleFontMap = {
  xs: { value: 13, unit: 9,  frac: 11 },
  sm: { value: 22, unit: 15, frac: 18 },
  md: { value: 30, unit: 20, frac: 24 },
  lg: { value: 38, unit: 26, frac: 32 },
} as const

/**
 * ProgressCircle — Circular (donut) progress indicator.
 *
 * @prop value        0–100 percentage. Clamped to that range.
 * @prop total        Denominator for type="fractional". Default 100.
 * @prop size         "xs" | "sm" | "md" | "lg" — outer diameter (48/80/112/144px). Default "md".
 * @prop color        "primary" (dark navy) | "inverse" (white). Default "primary".
 * @prop type         "percentage" | "fractional" | "slot". Default "percentage".
 * @prop children     Center content when type="slot".
 *
 * @example
 * <ProgressCircle value={60} />
 * <ProgressCircle value={40} total={60} type="fractional" size="lg" />
 * <ProgressCircle value={75} type="slot"><Star size={20} /></ProgressCircle>
 */
function ProgressCircle({
  value,
  total = 100,
  size = "md",
  color = "primary",
  type = "percentage",
  className,
  children,
}: {
  value: number
  total?: number
  size?: keyof typeof circleSizeMap
  color?: "primary" | "inverse"
  type?: "percentage" | "fractional" | "slot"
  className?: string
  children?: React.ReactNode
}) {
  const clamped    = Math.max(0, Math.min(100, value))
  const diameter   = circleSizeMap[size]
  const fonts      = circleFontMap[size]

  // Donut geometry: innerRadius = 0.85 of outer
  const outerR     = diameter / 2
  const innerR     = outerR * 0.85
  const strokeW    = outerR - innerR                    // 0.15 * outerR
  const circleR    = (outerR + innerR) / 2              // center of stroke ring
  const circumf    = 2 * Math.PI * circleR
  const dashOffset = circumf * (1 - clamped / 100)

  const trackColor = color === "primary" ? "#8d959f" : "rgba(255,255,255,0.35)"
  const fillColor  = color === "primary" ? "#1d354f" : "#ffffff"
  const unitColor  = color === "primary" ? "#576773" : "rgba(255,255,255,0.65)"

  // Center content
  let centerNode: React.ReactNode = null
  if (type === "percentage") {
    centerNode = (
      <text
        x={outerR}
        y={outerR}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ fontFamily: "var(--font-heading)", fill: fillColor }}
      >
        <tspan style={{ fontSize: fonts.value, fontWeight: 700 }}>{clamped}</tspan>
        <tspan style={{ fontSize: fonts.unit, fill: unitColor, fontWeight: 400 }} dy={-fonts.value * 0.15}>%</tspan>
      </text>
    )
  } else if (type === "fractional") {
    centerNode = (
      <text
        x={outerR}
        y={outerR}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ fontFamily: "var(--font-heading)", fill: fillColor, fontSize: fonts.frac, fontWeight: 700 }}
      >
        {Math.round((clamped / 100) * total)}/{total}
      </text>
    )
  }

  return (
    <div
      data-slot="progress-circle"
      className={cn("relative inline-flex items-center justify-center shrink-0", className)}
      style={{ width: diameter, height: diameter }}
    >
      <svg
        width={diameter}
        height={diameter}
        viewBox={`0 0 ${diameter} ${diameter}`}
        style={{ position: "absolute", inset: 0 }}
      >
        {/* Inner border — defines the unfilled area edge */}
        <circle
          cx={outerR}
          cy={outerR}
          r={innerR}
          fill="none"
          stroke={fillColor}
          strokeWidth={1}
        />
        {/* Progress arc — starts at top (-90°) */}
        <circle
          cx={outerR}
          cy={outerR}
          r={circleR}
          fill="none"
          stroke={fillColor}
          strokeWidth={strokeW}
          strokeLinecap="butt"
          strokeDasharray={circumf}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${outerR} ${outerR})`}
          style={{ transition: "stroke-dashoffset 0.4s ease" }}
        />
        {/* Text center (percentage / fractional) */}
        {centerNode}
      </svg>

      {/* Slot content (foreign children) */}
      {type === "slot" && (
        <div className="relative flex items-center justify-center" style={{ zIndex: 1 }}>
          {children}
        </div>
      )}
    </div>
  )
}

export { ProgressCircle }
