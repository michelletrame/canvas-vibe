"use client"

import React from "react"
import { AppShell } from "@/components/ui/app-shell"
import {
  useDashboardState,
  dashboardShellProps,
  LayoutSwitcher,
  CreditAllotmentCard,
  MaxUserAllocationCard,
  HoursSavedCard,
  ActiveUsersCard,
  AvgPerUserCard,
  TopUsageBreakdownCard,
  TopToolCallsCard,
  AgentUsersTable,
  SettingsTab,
  DashboardModals,
} from "../_shared"

export default function LayoutAPage() {
  const state = useDashboardState()
  const shellProps = dashboardShellProps(state)

  return (
    <>
      <AppShell
        {...shellProps}
        sidebarLogo={
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_PATH}/svg/canvas.svg`}
            alt="Canvas"
            width={40}
            height={40}
          />
        }
        pageTitleIcon={
          <img src={`${process.env.NEXT_PUBLIC_BASE_PATH}/svg/ignite-color.svg`} width={36} height={36} alt="" aria-hidden />
        }
        pageActions={
          <LayoutSwitcher layout="a" onAnalyze={state.openAnalysis} />
        }
      >
        {state.activeTab === "settings" && <SettingsTab state={state} />}
        {state.activeTab === "usage" && (
          <div className="flex flex-col gap-6">

            {/* 1. Credit Allotment + Max User Allocation */}
            <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <CreditAllotmentCard state={state} />
              <MaxUserAllocationCard state={state} />
            </div>

            {/* 2. Stat cards */}
            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
              <HoursSavedCard />
              <ActiveUsersCard />
              <AvgPerUserCard />
            </div>

            {/* 3. Charts */}
            <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <TopUsageBreakdownCard state={state} />
              <TopToolCallsCard />
            </div>

            {/* 4. Agent Users table */}
            <AgentUsersTable state={state} />

          </div>
        )}
      </AppShell>
      <DashboardModals state={state} />
    </>
  )
}
