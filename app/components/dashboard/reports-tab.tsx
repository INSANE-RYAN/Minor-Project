"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useExpenses } from "../../contexts/expense-context"
import { Download, Calendar, TrendingUp, TrendingDown } from "lucide-react"
import { ExpenseChart } from "./expense-chart"
import { CategoryChart } from "./category-chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ReportsTab() {
  const { expenses, categories } = useExpenses()
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const getFilteredExpenses = () => {
    const now = new Date()
    let filteredByDate = expenses

    switch (selectedPeriod) {
      case "week":
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        filteredByDate = expenses.filter((expense) => new Date(expense.date) >= weekAgo)
        break
      case "month":
        filteredByDate = expenses.filter((expense) => {
          const expenseDate = new Date(expense.date)
          return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear()
        })
        break
      case "year":
        filteredByDate = expenses.filter((expense) => {
          const expenseDate = new Date(expense.date)
          return expenseDate.getFullYear() === now.getFullYear()
        })
        break
      default:
        filteredByDate = expenses
    }

    if (selectedCategory !== "all") {
      filteredByDate = filteredByDate.filter((expense) => expense.category === selectedCategory)
    }

    return filteredByDate
  }

  const filteredExpenses = getFilteredExpenses()
  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const averageAmount = filteredExpenses.length > 0 ? totalAmount / filteredExpenses.length : 0
  const transactionCount = filteredExpenses.length

  // Calculate trend (comparing with previous period)
  const getPreviousPeriodExpenses = () => {
    const now = new Date()
    let startDate: Date
    let endDate: Date

    switch (selectedPeriod) {
      case "week":
        startDate = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
        endDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "month":
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
        startDate = lastMonth
        endDate = lastMonthEnd
        break
      case "year":
        startDate = new Date(now.getFullYear() - 1, 0, 1)
        endDate = new Date(now.getFullYear() - 1, 11, 31)
        break
      default:
        return []
    }

    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date)
      return expenseDate >= startDate && expenseDate <= endDate
    })
  }

  const previousPeriodExpenses = getPreviousPeriodExpenses()
  const previousTotal = previousPeriodExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const trendPercentage = previousTotal > 0 ? ((totalAmount - previousTotal) / previousTotal) * 100 : 0

  const exportData = () => {
    const format = document.querySelector('input[name="export-format"]:checked')?.getAttribute("value") || "csv"

    if (format === "csv") {
      const csvContent = [
        ["Date", "Description", "Amount", "Category", "Tags", "Recurring"],
        ...filteredExpenses.map((expense) => [
          expense.date,
          expense.description,
          expense.amount.toString(),
          expense.category,
          expense.tags.join("; "),
          expense.recurring ? "Yes" : "No",
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n")

      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `expense-report-${selectedPeriod}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    } else if (format === "pdf") {
      // Mock PDF export - in a real app, you'd use a library like jsPDF
      const pdfContent = {
        title: `Expense Report - ${selectedPeriod}`,
        summary: {
          totalExpenses: filteredExpenses.length,
          totalAmount: totalAmount,
          averageAmount: averageAmount,
        },
        expenses: filteredExpenses.map((expense) => ({
          date: expense.date,
          description: expense.description,
          amount: expense.amount,
          category: expense.category,
          tags: expense.tags,
        })),
      }

      const blob = new Blob([JSON.stringify(pdfContent, null, 2)], { type: "application/json" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `expense-report-${selectedPeriod}.json`
      a.click()
      window.URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Reports</h1>
          <p className="text-gray-400">Analyze your spending patterns and trends</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <span>Export as:</span>
            <label className="flex items-center gap-1">
              <input type="radio" name="export-format" value="csv" defaultChecked className="text-purple-600" />
              CSV
            </label>
            <label className="flex items-center gap-1">
              <input type="radio" name="export-format" value="pdf" className="text-purple-600" />
              PDF
            </label>
          </div>
          <Button onClick={exportData} className="bg-purple-600 hover:bg-purple-700">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
            <Calendar className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-700 border-gray-600">
            <SelectItem value="week" className="text-white">
              This Week
            </SelectItem>
            <SelectItem value="month" className="text-white">
              This Month
            </SelectItem>
            <SelectItem value="year" className="text-white">
              This Year
            </SelectItem>
            <SelectItem value="all" className="text-white">
              All Time
            </SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-700 border-gray-600">
            <SelectItem value="all" className="text-white">
              All Categories
            </SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category} className="text-white">
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Spent</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${totalAmount.toFixed(2)}</div>
            <div className="flex items-center text-xs text-gray-400">
              {trendPercentage > 0 ? (
                <TrendingUp className="w-3 h-3 mr-1 text-red-400" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1 text-green-400" />
              )}
              <span className={trendPercentage > 0 ? "text-red-400" : "text-green-400"}>
                {Math.abs(trendPercentage).toFixed(1)}% from last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Transactions</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{transactionCount}</div>
            <p className="text-xs text-gray-400">Total transactions</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Average</CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${averageAmount.toFixed(2)}</div>
            <p className="text-xs text-gray-400">Per transaction</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Categories</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{new Set(filteredExpenses.map((e) => e.category)).size}</div>
            <p className="text-xs text-gray-400">Active categories</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpenseChart />
        <CategoryChart />
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Detailed Breakdown</CardTitle>
          <CardDescription className="text-gray-400">
            Category-wise spending analysis for the selected period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((category) => {
              const categoryExpenses = filteredExpenses.filter((e) => e.category === category)
              const categoryTotal = categoryExpenses.reduce((sum, e) => sum + e.amount, 0)
              const percentage = totalAmount > 0 ? (categoryTotal / totalAmount) * 100 : 0

              if (categoryTotal === 0) return null

              return (
                <div key={category} className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-white">{category}</span>
                      <span className="text-sm text-gray-400">{categoryExpenses.length} transactions</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <div className="font-semibold text-white">${categoryTotal.toFixed(2)}</div>
                    <div className="text-sm text-gray-400">{percentage.toFixed(1)}%</div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
