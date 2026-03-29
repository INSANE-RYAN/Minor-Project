"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Palette, Bell, Shield, Download, User, HelpCircle } from "lucide-react"
import { useTheme } from "../../contexts/theme-context"
import { useAuth } from "../../contexts/auth-context"
import { useOnboarding } from "../../contexts/onboarding-context"

export function SettingsTab() {
  const { currentTheme, themes, setTheme } = useTheme()
  const { user, logout } = useAuth()
  const { startOnboarding } = useOnboarding()
  const [notifications, setNotifications] = useState({
    budgetAlerts: true,
    goalReminders: true,
    weeklyReports: false,
    communityUpdates: true,
  })

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }))
  }

  const exportData = () => {
    // Mock export functionality
    const data = {
      user: user,
      exportDate: new Date().toISOString(),
      message: "This would contain all user data in a real implementation",
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "expense-tracker-data.json"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Customize your experience and manage your account</p>
      </div>

      {/* Theme Settings */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-purple-400" />
            <CardTitle className="text-white">Theme & Appearance</CardTitle>
          </div>
          <CardDescription className="text-gray-400">Customize the look and feel of your dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label className="text-white">Choose Theme</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setTheme(theme.id)}
                  className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                    currentTheme.id === theme.id ? "border-white shadow-lg" : "border-gray-600 hover:border-gray-500"
                  }`}
                  style={{ backgroundColor: theme.colors.surface }}
                >
                  <div className="space-y-2">
                    <div className="flex gap-1">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.colors.primary }} />
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.colors.secondary }} />
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.colors.accent }} />
                    </div>
                    <div className="text-sm font-medium text-white">{theme.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-400" />
            <CardTitle className="text-white">Notifications</CardTitle>
          </div>
          <CardDescription className="text-gray-400">Manage your notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Budget Alerts</Label>
                <p className="text-sm text-gray-400">Get notified when you're close to budget limits</p>
              </div>
              <Switch
                checked={notifications.budgetAlerts}
                onCheckedChange={(value) => handleNotificationChange("budgetAlerts", value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Goal Reminders</Label>
                <p className="text-sm text-gray-400">Receive reminders about your financial goals</p>
              </div>
              <Switch
                checked={notifications.goalReminders}
                onCheckedChange={(value) => handleNotificationChange("goalReminders", value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Weekly Reports</Label>
                <p className="text-sm text-gray-400">Get weekly spending summaries</p>
              </div>
              <Switch
                checked={notifications.weeklyReports}
                onCheckedChange={(value) => handleNotificationChange("weeklyReports", value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Community Updates</Label>
                <p className="text-sm text-gray-400">Stay updated with new community tips</p>
              </div>
              <Switch
                checked={notifications.communityUpdates}
                onCheckedChange={(value) => handleNotificationChange("communityUpdates", value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-green-400" />
            <CardTitle className="text-white">Account</CardTitle>
          </div>
          <CardDescription className="text-gray-400">Manage your account information and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Full Name</Label>
              <Input defaultValue={user?.name} className="bg-gray-700 border-gray-600 text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Email</Label>
              <Input defaultValue={user?.email} type="email" className="bg-gray-700 border-gray-600 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-white">Currency</Label>
            <Select defaultValue="USD">
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="USD" className="text-white">
                  USD ($)
                </SelectItem>
                <SelectItem value="EUR" className="text-white">
                  EUR (€)
                </SelectItem>
                <SelectItem value="GBP" className="text-white">
                  GBP (£)
                </SelectItem>
                <SelectItem value="JPY" className="text-white">
                  JPY (¥)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Data & Privacy */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-yellow-400" />
            <CardTitle className="text-white">Data & Privacy</CardTitle>
          </div>
          <CardDescription className="text-gray-400">Manage your data and privacy settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Export Data</Label>
              <p className="text-sm text-gray-400">Download all your data in JSON format</p>
            </div>
            <Button
              onClick={exportData}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Reset Tutorial</Label>
              <p className="text-sm text-gray-400">Go through the onboarding process again</p>
            </div>
            <Button
              onClick={startOnboarding}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Start Tutorial
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Reset Landing Page</Label>
              <p className="text-sm text-gray-400">Clear landing page cache to see it again</p>
            </div>
            <Button
              onClick={() => {
                localStorage.removeItem("expenzo-seen-landing")
                window.location.reload()
              }}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Reset Landing
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-gray-800 border-red-500/50">
        <CardHeader>
          <CardTitle className="text-red-400">Danger Zone</CardTitle>
          <CardDescription className="text-gray-400">Irreversible actions that affect your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={logout} variant="destructive" className="bg-red-600 hover:bg-red-700">
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
