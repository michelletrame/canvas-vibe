"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import type { Options } from "highcharts"
import { cn } from "@/lib/utils"

const HighchartsReact = dynamic(() => import("highcharts-react-official"), { ssr: false })

/**
 * Chart — Highcharts wrapper safe for Next.js static export.
 *
 * Accepts any standard Highcharts Options object. The Highcharts library is
 * loaded client-side only, so `window` is never accessed during the build pass.
 *
 * @prop options   Highcharts Options object
 * @prop className Optional wrapper class for sizing / layout
 *
 * @example
 * <Chart options={{ chart: { type: "line" }, series: [{ data: [1, 2, 3] }] }} />
 */
function Chart({
  options,
  className,
}: {
  options: Options
  className?: string
}) {
  const [Highcharts, setHighcharts] = React.useState<typeof import("highcharts") | null>(null)

  React.useEffect(() => {
    import("highcharts").then(setHighcharts)
  }, [])

  if (!Highcharts) return null

  return (
    <div className={cn("w-full", className)}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  )
}

export { Chart }
