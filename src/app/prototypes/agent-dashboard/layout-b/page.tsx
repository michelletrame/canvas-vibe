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

export default function LayoutBPage() {
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
          <LayoutSwitcher layout="b" onAnalyze={state.openAnalysis} showCustomize />
        }
      >
        {state.activeTab === "settings" && <SettingsTab state={state} />}
        {state.activeTab === "usage" && (
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 items-start">

            {/* Main area */}
            <div className="flex flex-col gap-6">
              <CreditAllotmentCard state={state} />
              <MaxUserAllocationCard state={state} />
              <AgentUsersTable state={state} />
            </div>

            {/* Right rail */}
            <div className="flex flex-col gap-4">
              <TopToolCallsCard narrow />
              <TopUsageBreakdownCard state={state} narrow />
              <HoursSavedCard />
              <ActiveUsersCard />
              <AvgPerUserCard />
            </div>

          </div>
        )}
      </AppShell>
      <DashboardModals state={state} />
    </>
  )
}
