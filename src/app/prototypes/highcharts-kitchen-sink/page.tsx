"use client"

import React from "react"
import {
  LayoutDashboard, BookText, CalendarDays, Inbox, CircleHelp, ShieldUser,
} from "lucide-react"
import { AppShell, type SidebarNavItem, type TopNavAction, type BreadcrumbItem } from "@/components/ui/app-shell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Chart } from "@/components/ui/chart"

// ─── Shell config ─────────────────────────────────────────────────────────────

const TOP_NAV_ACTIONS: TopNavAction[] = [
  { id: "ignite", label: "IgniteAI Agent", variant: "aiPrimary" },
]

const SIDEBAR_ITEMS: SidebarNavItem[] = [
  { id: "account",   label: "Account",   avatar: { src: "https://i.pravatar.cc/150?img=47" } },
  { id: "admin",     label: "Admin",     icon: ShieldUser, adminOnly: true },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "courses",   label: "Courses",   icon: BookText },
  { id: "calendar",  label: "Calendar",  icon: CalendarDays },
  { id: "inbox",     label: "Inbox",     icon: Inbox },
  { id: "help",      label: "Help",      icon: CircleHelp },
]

const BREADCRUMB: BreadcrumbItem[] = [
  { label: "Prototypes", href: "/prototypes" },
  { label: "Highcharts Kitchen Sink" },
]

// ─── Shared style tokens ──────────────────────────────────────────────────────

const FONT = "var(--font-body)"

const CHART_BASE = {
  backgroundColor: "transparent",
  style: { fontFamily: FONT },
  height: 240,
} as const

const AXIS = {
  lineColor:  "#e2e6e9",
  tickColor:  "#e2e6e9",
  labels:     { style: { color: "#576773", fontSize: "12px", fontFamily: FONT } },
} as const

const Y_AXIS = {
  title:         { text: undefined },
  gridLineColor: "#e2e6e9",
  labels:        { style: { color: "#576773", fontSize: "12px", fontFamily: FONT } },
} as const

const LEGEND = {
  itemStyle: { color: "#576773", fontSize: "12px", fontWeight: "400", fontFamily: FONT },
  symbolRadius: 3,
} as const

const NO_CREDITS = { enabled: false } as const
const NO_TITLE   = { text: undefined } as const

// Palette
const C = {
  blue:   "#197eab",
  green:  "#22a06b",
  purple: "#7c5cbf",
  orange: "#e07b00",
  red:    "#c9372c",
  muted:  "#8d959f",
  teal:   "#00a3bf",
  indigo: "#4c6ef5",
}

// ─── Chart data ───────────────────────────────────────────────────────────────

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const WEEKS  = ["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5", "Wk 6", "Wk 7", "Wk 8"]

// ─── Section label ────────────────────────────────────────────────────────────

function SectionLabel({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col gap-1 pt-2">
      <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 16, fontWeight: 600, color: "#273540" }}>
        {title}
      </h2>
      {description && (
        <p className="text-sm" style={{ color: "#576773" }}>{description}</p>
      )}
    </div>
  )
}

// ─── Chart cards ─────────────────────────────────────────────────────────────

function ChartCard({ title, description, children }: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HighchartsKitchenSink() {
  return (
    <AppShell
      sidebarItems={SIDEBAR_ITEMS}
      breadcrumb={BREADCRUMB}
      topNavActions={TOP_NAV_ACTIONS}
      sidebarLogo={
        <img
          src={`${process.env.NEXT_PUBLIC_BASE_PATH}/svg/canvas.svg`}
          alt="Canvas"
          width={40}
          height={40}
        />
      }
      sidebarLogoHref="/prototypes"
      pageTitle="Highcharts Kitchen Sink"
      pageDescription="Every core Highcharts chart type rendered in our design system's style tokens."
      sidebarActiveId="admin"
    >
      <div className="flex flex-col gap-8">

        {/* ── Line & Spline ─────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          <SectionLabel title="Line & Spline" description="Time series and trend visualization." />
          <div className="grid grid-cols-2 gap-4">

            <ChartCard title="Multi-Series Line" description="Credits used across three campuses over 12 months.">
              <Chart options={{
                chart: { ...CHART_BASE, type: "line" },
                title: NO_TITLE,
                credits: NO_CREDITS,
                legend: LEGEND,
                xAxis: { ...AXIS, categories: MONTHS },
                yAxis: Y_AXIS,
                series: [
                  { type: "line", name: "North Campus", color: C.blue,   data: [4200, 4800, 5100, 5400, 6200, 7100, 7600, 8200, 8800, 9100, 9600, 10200] },
                  { type: "line", name: "South Campus", color: C.green,  data: [2800, 3100, 3400, 3200, 3800, 4200, 4600, 4900, 5200, 5400, 5600, 5900] },
                  { type: "line", name: "Online",       color: C.purple, data: [1900, 2100, 2400, 2600, 2900, 3200, 3600, 3900, 4100, 4300, 4600, 4900] },
                ],
              }} />
            </ChartCard>

            <ChartCard title="Spline" description="Smoothed weekly active user trend.">
              <Chart options={{
                chart: { ...CHART_BASE, type: "spline" },
                title: NO_TITLE,
                credits: NO_CREDITS,
                legend: { enabled: false },
                xAxis: { ...AXIS, categories: WEEKS },
                yAxis: Y_AXIS,
                series: [{
                  type: "spline",
                  name: "Active Users",
                  color: C.teal,
                  data: [420, 510, 480, 640, 720, 810, 880, 760],
                  marker: { fillColor: C.teal, lineColor: C.teal, radius: 4 },
                }],
              }} />
            </ChartCard>

          </div>
        </div>

        {/* ── Area ──────────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          <SectionLabel title="Area" description="Volume and cumulative patterns." />
          <div className="grid grid-cols-2 gap-4">

            <ChartCard title="Area" description="Total credit consumption by billing period.">
              <Chart options={{
                chart: { ...CHART_BASE, type: "area" },
                title: NO_TITLE,
                credits: NO_CREDITS,
                legend: { enabled: false },
                xAxis: { ...AXIS, categories: MONTHS },
                yAxis: Y_AXIS,
                plotOptions: { area: { fillOpacity: 0.15, lineWidth: 2 } },
                series: [{
                  type: "area",
                  name: "Credits",
                  color: C.blue,
                  fillColor: { linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 }, stops: [[0, `${C.blue}33`], [1, `${C.blue}00`]] },
                  data: [8200, 9400, 10100, 10800, 12200, 14100, 15600, 16800, 17400, 18200, 19100, 20400],
                  marker: { enabled: false },
                }],
              }} />
            </ChartCard>

            <ChartCard title="Stacked Area" description="Credit usage by role, stacked over time.">
              <Chart options={{
                chart: { ...CHART_BASE, type: "area" },
                title: NO_TITLE,
                credits: NO_CREDITS,
                legend: LEGEND,
                xAxis: { ...AXIS, categories: MONTHS.slice(0, 8) },
                yAxis: Y_AXIS,
                plotOptions: { area: { stacking: "normal", lineWidth: 1, fillOpacity: 0.7 } },
                series: [
                  { type: "area", name: "Student",    color: C.blue,   data: [5200, 5800, 6100, 6400, 7100, 7800, 8400, 8900] },
                  { type: "area", name: "Instructor", color: C.green,  data: [2100, 2400, 2600, 2800, 3100, 3400, 3700, 3900] },
                  { type: "area", name: "Admin",      color: C.purple, data: [800,  900,  1000, 1100, 1200, 1300, 1400, 1500] },
                ],
              }} />
            </ChartCard>

          </div>
        </div>

        {/* ── Column & Bar ──────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          <SectionLabel title="Column & Bar" description="Categorical comparisons, vertical and horizontal." />
          <div className="grid grid-cols-2 gap-4">

            <ChartCard title="Column" description="Monthly credit usage per quarter.">
              <Chart options={{
                chart: { ...CHART_BASE, type: "column" },
                title: NO_TITLE,
                credits: NO_CREDITS,
                legend: { enabled: false },
                xAxis: { ...AXIS, categories: MONTHS },
                yAxis: Y_AXIS,
                plotOptions: { column: { borderWidth: 0, borderRadius: 3 } },
                series: [{
                  type: "column",
                  name: "Credits",
                  color: C.blue,
                  data: [8200, 9400, 10100, 10800, 12200, 14100, 15600, 16800, 17400, 18200, 19100, 20400],
                }],
              }} />
            </ChartCard>

            <ChartCard title="Grouped Column" description="Credit usage vs. allocation by subaccount.">
              <Chart options={{
                chart: { ...CHART_BASE, type: "column" },
                title: NO_TITLE,
                credits: NO_CREDITS,
                legend: LEGEND,
                xAxis: { ...AXIS, categories: ["North", "South", "Online", "Grad", "Cont. Ed"] },
                yAxis: Y_AXIS,
                plotOptions: { column: { borderWidth: 0, borderRadius: 3, groupPadding: 0.1 } },
                series: [
                  { type: "column", name: "Used",      color: C.blue,  data: [28400, 21200, 18600, 11300, 4820] },
                  { type: "column", name: "Allocated",  color: "#e2e6e9", data: [35000, 28000, 22000, 15000, 8000] },
                ],
              }} />
            </ChartCard>

            <ChartCard title="Stacked Column" description="Usage mix by persona type per month.">
              <Chart options={{
                chart: { ...CHART_BASE, type: "column" },
                title: NO_TITLE,
                credits: NO_CREDITS,
                legend: LEGEND,
                xAxis: { ...AXIS, categories: MONTHS.slice(0, 8) },
                yAxis: Y_AXIS,
                plotOptions: { column: { stacking: "normal", borderWidth: 0 } },
                series: [
                  { type: "column", name: "Student",    color: C.blue,   data: [5200, 5800, 6100, 6400, 7100, 7800, 8400, 8900] },
                  { type: "column", name: "Instructor", color: C.green,  data: [2100, 2400, 2600, 2800, 3100, 3400, 3700, 3900] },
                  { type: "column", name: "Admin",      color: C.purple, data: [800,  900,  1000, 1100, 1200, 1300, 1400, 1500] },
                ],
              }} />
            </ChartCard>

            <ChartCard title="Bar (Horizontal)" description="Top courses by credit consumption.">
              <Chart options={{
                chart: { ...CHART_BASE, type: "bar" },
                title: NO_TITLE,
                credits: NO_CREDITS,
                legend: { enabled: false },
                xAxis: { ...AXIS, categories: ["Intro to AI", "Data Science", "English 101", "Calculus II", "History 201"] },
                yAxis: Y_AXIS,
                plotOptions: { bar: { borderWidth: 0, borderRadius: 3 } },
                series: [{
                  type: "bar",
                  name: "Credits",
                  color: C.green,
                  data: [19200, 16800, 12400, 9600, 7100],
                }],
              }} />
            </ChartCard>

          </div>
        </div>

        {/* ── Pie & Donut ───────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          <SectionLabel title="Pie & Donut" description="Proportional and part-to-whole relationships." />
          <div className="grid grid-cols-2 gap-4">

            <ChartCard title="Pie" description="Credit share by subaccount.">
              <Chart options={{
                chart: { ...CHART_BASE, type: "pie" },
                title: NO_TITLE,
                credits: NO_CREDITS,
                legend: { ...LEGEND, enabled: true, align: "right", verticalAlign: "middle", layout: "vertical" },
                tooltip: { valueSuffix: "%" },
                plotOptions: {
                  pie: {
                    borderWidth: 0,
                    dataLabels: { enabled: false },
                    showInLegend: true,
                  },
                },
                series: [{
                  type: "pie",
                  name: "Share",
                  data: [
                    { name: "North Campus", y: 33.7, color: C.blue   },
                    { name: "South Campus", y: 25.1, color: C.green  },
                    { name: "Online",       y: 22.1, color: C.purple },
                    { name: "Graduate",     y: 13.4, color: C.orange },
                    { name: "Cont. Ed",     y: 5.7,  color: C.muted  },
                  ],
                }],
              }} />
            </ChartCard>

            <ChartCard title="Donut" description="Tool call distribution — share of usage by action type.">
              <Chart options={{
                chart: { ...CHART_BASE, type: "pie" },
                title: NO_TITLE,
                credits: NO_CREDITS,
                legend: { ...LEGEND, enabled: true, align: "right", verticalAlign: "middle", layout: "vertical" },
                tooltip: { valueSuffix: "%" },
                plotOptions: {
                  pie: {
                    borderWidth: 0,
                    innerSize: "55%",
                    dataLabels: { enabled: false },
                    showInLegend: true,
                  },
                },
                series: [{
                  type: "pie",
                  name: "Tool Calls",
                  data: [
                    { name: "Answer Question",   y: 38.4, color: C.blue   },
                    { name: "Summarize Content", y: 22.1, color: C.green  },
                    { name: "Generate Rubric",   y: 15.7, color: C.purple },
                    { name: "Translate Text",    y: 12.3, color: C.orange },
                    { name: "Other",             y: 11.5, color: C.muted  },
                  ],
                }],
              }} />
            </ChartCard>

          </div>
        </div>

        {/* ── Scatter ───────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          <SectionLabel title="Scatter" description="Correlation and distribution between two variables." />
          <div className="grid grid-cols-2 gap-4">

            <ChartCard title="Scatter Plot" description="Credits used vs. course enrollment size.">
              <Chart options={{
                chart: { ...CHART_BASE, type: "scatter" },
                title: NO_TITLE,
                credits: NO_CREDITS,
                legend: { enabled: false },
                xAxis: { ...AXIS, title: { text: "Enrollment", style: { color: "#576773", fontSize: "12px" } } },
                yAxis: { ...Y_AXIS, title: { text: "Credits Used", style: { color: "#576773", fontSize: "12px" } } },
                tooltip: {
                  formatter(this: { x: number | string; y?: number }) {
                    return `<b>Enrollment:</b> ${this.x}<br/><b>Credits:</b> ${this.y}`
                  },
                },
                plotOptions: { scatter: { marker: { radius: 5, fillColor: C.blue, lineColor: C.blue } } },
                series: [{
                  type: "scatter",
                  name: "Courses",
                  data: [
                    [18, 1200], [24, 1900], [32, 2800], [41, 3600], [55, 5100],
                    [62, 6200], [48, 4400], [29, 2400], [37, 3100], [70, 7800],
                    [15, 900],  [44, 3900], [58, 5600], [33, 2900], [27, 2100],
                    [51, 4800], [66, 6900], [22, 1600], [39, 3400], [75, 8400],
                  ],
                }],
              }} />
            </ChartCard>

            <ChartCard title="Multi-Series Scatter" description="Credits vs. sessions — students vs. instructors.">
              <Chart options={{
                chart: { ...CHART_BASE, type: "scatter" },
                title: NO_TITLE,
                credits: NO_CREDITS,
                legend: LEGEND,
                xAxis: { ...AXIS, title: { text: "Sessions", style: { color: "#576773", fontSize: "12px" } } },
                yAxis: { ...Y_AXIS, title: { text: "Credits Used", style: { color: "#576773", fontSize: "12px" } } },
                plotOptions: { scatter: { marker: { radius: 5 } } },
                series: [
                  {
                    type: "scatter",
                    name: "Students",
                    color: C.blue,
                    data: [[8,320],[12,580],[15,720],[20,960],[25,1200],[30,1450],[18,880],[22,1050],[28,1340],[35,1700]],
                  },
                  {
                    type: "scatter",
                    name: "Instructors",
                    color: C.orange,
                    data: [[5,280],[8,420],[11,600],[14,780],[17,920],[20,1100],[9,480],[13,700],[16,850],[22,1250]],
                  },
                ],
              }} />
            </ChartCard>

          </div>
        </div>

        {/* ── Step & Mixed ──────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          <SectionLabel title="Step Line & Mixed" description="Threshold changes and combined chart types." />
          <div className="grid grid-cols-2 gap-4">

            <ChartCard title="Step Line" description="Credit limit changes over time — stepped to show exact change points.">
              <Chart options={{
                chart: { ...CHART_BASE, type: "line" },
                title: NO_TITLE,
                credits: NO_CREDITS,
                legend: { enabled: false },
                xAxis: { ...AXIS, categories: MONTHS },
                yAxis: Y_AXIS,
                plotOptions: { line: { step: "left" } },
                series: [{
                  type: "line",
                  name: "Credit Limit",
                  color: C.purple,
                  data: [50000, 50000, 50000, 75000, 75000, 75000, 75000, 100000, 100000, 100000, 120000, 120000],
                  marker: { enabled: false },
                }],
              }} />
            </ChartCard>

            <ChartCard title="Column + Line (Mixed)" description="Monthly usage (bars) vs. rolling 3-month average (line).">
              <Chart options={{
                chart: { ...CHART_BASE, type: "column" },
                title: NO_TITLE,
                credits: NO_CREDITS,
                legend: LEGEND,
                xAxis: { ...AXIS, categories: MONTHS },
                yAxis: Y_AXIS,
                plotOptions: { column: { borderWidth: 0, borderRadius: 3 } },
                series: [
                  {
                    type: "column",
                    name: "Monthly Usage",
                    color: `${C.blue}99`,
                    data: [8200, 9400, 10100, 10800, 12200, 14100, 15600, 16800, 17400, 18200, 19100, 20400],
                  },
                  {
                    type: "spline",
                    name: "3-Month Avg",
                    color: C.orange,
                    data: [null, null, 9233, 10100, 11033, 12367, 13967, 15500, 16600, 17467, 18233, 19233],
                    marker: { enabled: false },
                    lineWidth: 2,
                  },
                ],
              }} />
            </ChartCard>

          </div>
        </div>

      </div>
    </AppShell>
  )
}
