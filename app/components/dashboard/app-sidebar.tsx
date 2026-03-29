"use client"

import { Wallet, BarChart3, CreditCard, PieChart, Target, Users, Settings, LogOut } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "../../contexts/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { TabType } from "./dashboard"

interface AppSidebarProps {
  activeTab: TabType
  setActiveTab: (tab: TabType) => void
}

const menuItems = [
  {
    title: "Overview",
    icon: BarChart3,
    id: "overview" as TabType,
  },
  {
    title: "Expenses",
    icon: CreditCard,
    id: "expenses" as TabType,
  },
  {
    title: "Budgets",
    icon: PieChart,
    id: "budgets" as TabType,
  },
  {
    title: "Goals",
    icon: Target,
    id: "goals" as TabType,
  },
  {
    title: "Reports",
    icon: BarChart3,
    id: "reports" as TabType,
  },
  {
    title: "Community",
    icon: Users,
    id: "community" as TabType,
  },
  {
    title: "Settings",
    icon: Settings,
    id: "settings" as TabType,
  },
]

export function AppSidebar({ activeTab, setActiveTab }: AppSidebarProps) {
  const { user, logout } = useAuth()

  return (
    <Sidebar className="bg-gray-800 border-gray-700">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-purple-600 rounded-xl">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Expenzo</h2>
            <p className="text-sm text-gray-400">Financial Management</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveTab(item.id)}
                    isActive={activeTab === item.id}
                    className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700 data-[active=true]:bg-purple-600 data-[active=true]:text-white"
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
            <AvatarFallback className="bg-purple-600 text-white">{user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
        <Button
          onClick={logout}
          variant="ghost"
          className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
