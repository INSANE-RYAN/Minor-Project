"use client"

import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function DashboardHeader() {
  return (
    <header className="flex items-center justify-between p-6 bg-gray-800 border-b border-gray-700">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-gray-300 hover:text-white" />
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search transactions..."
            className="pl-10 w-80 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
          <Bell className="w-5 h-5" />
        </Button>
      </div>
    </header>
  )
}
