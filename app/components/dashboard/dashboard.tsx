"use client"

import { useState } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import { DashboardHeader } from "./dashboard-header"
import { OverviewTab } from "./overview-tab"
import { ExpensesTab } from "./expenses-tab"
import { BudgetsTab } from "./budgets-tab"
import { ReportsTab } from "./reports-tab"
import { GoalsTab } from "./goals-tab"
import { CommunityTab } from "./community-tab"
import { SettingsTab } from "./settings-tab"

export type TabType = "overview" | "expenses" | "budgets" | "goals" | "reports" | "community" | "settings"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("overview")

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab />
      case "expenses":
        return <ExpensesTab />
      case "budgets":
        return <BudgetsTab />
      case "goals":
        return <GoalsTab />
      case "reports":
        return <ReportsTab />
      case "community":
        return <CommunityTab />
      case "settings":
        return <SettingsTab />
      default:
        return <OverviewTab />
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <SidebarProvider>
        <AppSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <SidebarInset>
          <DashboardHeader />
          <main className="flex-1 p-6">{renderContent()}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
