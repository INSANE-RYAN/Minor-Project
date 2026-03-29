"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { useExpenses } from "../../contexts/expense-context"

const COLORS = [
  "#8b5cf6",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ef4444",
]

export function CategoryChart() {
  const { expenses } = useExpenses()

  // Group expenses by category
  const categoryData = expenses.reduce(
    (acc, expense) => {
      const existing = acc.find((item) => item.category === expense.category)
      if (existing) {
        existing.amount += expense.amount
      } else {
        acc.push({ category: expense.category, amount: expense.amount })
      }
      return acc
    },
    [] as { category: string; amount: number }[],
  )

  const chartConfig = categoryData.reduce(
    (config, item, index) => {
      config[item.category] = {
        label: item.category,
        color: COLORS[index % COLORS.length],
      }
      return config
    },
    {} as Record<string, { label: string; color: string }>,
  )

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Spending by Category</CardTitle>
        <CardDescription className="text-gray-400">Breakdown of expenses by category</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="amount"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
