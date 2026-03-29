"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useExpenses } from "../../contexts/expense-context"
import { formatDistanceToNow } from "date-fns"

export function RecentTransactions() {
  const { expenses } = useExpenses()

  const recentExpenses = expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Recent Transactions</CardTitle>
        <CardDescription className="text-gray-400">Your latest expense entries</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentExpenses.map((expense) => (
            <div key={expense.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-white">{expense.description}</p>
                  {expense.recurring && (
                    <Badge variant="secondary" className="text-xs bg-purple-600/20 text-purple-300">
                      Recurring
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>{expense.category}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(expense.date), { addSuffix: true })}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-red-400">-${expense.amount.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
