import type { Metadata } from "next"

export const metadata: Metadata = { title: "Highcharts Kitchen Sink" }

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
