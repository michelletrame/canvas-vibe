import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Size values from Pencil: pencil-new.pen → Icon (SCael)
const sizeMap = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  "2xl": 36,
} as const;

// Stroke widths per size from Pencil vector stroke thickness values
const strokeWidthMap: Record<keyof typeof sizeMap, number> = {
  xs: 1,
  sm: 1.25,
  md: 1.5,
  lg: 2,
  xl: 2,
  "2xl": 3,
};

// Colors from Pencil: exact hex values extracted from icon path strokes
const colorMap = {
  base:         "var(--icon-base)",
  muted:        "var(--icon-muted)",
  onColor:      "var(--icon-on-color)",
  inverse:      "var(--icon-inverse)",
  success:      "var(--color-success)",
  warning:      "var(--color-warning)",
  error:        "var(--color-error)",
  info:         "var(--color-info)",
  accentAsh:    "var(--icon-accent-ash)",
  accentAurora: "var(--icon-accent-aurora)",
  accentBlue:   "var(--icon-accent-blue)",
  accentGreen:  "var(--icon-accent-green)",
  accentGrey:   "var(--icon-accent-grey)",
  accentHoney:  "var(--icon-accent-honey)",
  accentOrange: "var(--icon-accent-orange)",
  accentPlum:   "var(--icon-accent-plum)",
  accentRed:    "var(--icon-accent-red)",
  accentSea:    "var(--icon-accent-sea)",
  accentSky:    "var(--icon-accent-sky)",
  accentViolet: "var(--icon-accent-violet)",
} as const;

export type IconSize = keyof typeof sizeMap;
export type IconColor = keyof typeof colorMap;

export interface IconProps {
  icon: LucideIcon;
  size?: IconSize;
  color?: IconColor;
  className?: string;
}

export function Icon({
  icon: LucideIconComponent,
  size = "md",
  color = "base",
  className,
}: IconProps) {
  const px = sizeMap[size];
  const strokeColor = colorMap[color];

  return (
    <LucideIconComponent
      width={px}
      height={px}
      strokeWidth={strokeWidthMap[size]}
      style={{ color: strokeColor }}
      className={cn("shrink-0", className)}
    />
  );
}
