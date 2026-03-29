"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Plus, Trash2, AlertTriangle } from "lucide-react"
import { useExpenses } from "../../contexts/expense-context"
import { AddBudgetDialog } from "./add-budget-dialog"

export function BudgetsTab() {
  const { budgets, deleteBudget } = useExpenses()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const handleDeleteBudget = (id: string) => {
    if (confirm("Are you sure you want to delete this budget?")) {
      deleteBudget(id)
    }
  }

  const getBudgetStatus = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100
    if (percentage >= 100) return { status: "over", color: "bg-red-500" }
    if (percentage >= 80) return { status: "warning", color: "bg-yellow-500" }
    return { status: "good", color: "bg-green-500" }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Budgets</h1>
          <p className="text-gray-400">Track your spending limits and goals</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Budget
        </Button>
      </div>

      {budgets.length === 0 ? (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-2">No budgets set</h3>
              <p className="text-gray-400 mb-4">Create your first budget to start tracking your spending limits.</p>
              <Button onClick={() => setIsAddDialogOpen(true)} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Budget
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((budget) => {
            const percentage = (budget.spent / budget.limit) * 100
            const { status, color } = getBudgetStatus(budget.spent, budget.limit)

            return (
              <Card key={budget.id} className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-white">{budget.category}</CardTitle>
                    <div className="flex items-center gap-1">
                      {status === "over" && <AlertTriangle className="w-4 h-4 text-red-500" />}
                      {status === "warning" && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteBudget(budget.id)}
                        className="text-gray-400 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription className="text-gray-400 capitalize">{budget.period} budget</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Spent</span>
                      <span className="text-white font-medium">
                        ${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}
                      </span>
                    </div>

                    <Progress value={Math.min(percentage, 100)} className="h-2" />

                    <div className="flex items-center justify-between text-sm">
                      <span
                        className={`font-medium ${
                          status === "over"
                            ? "text-red-400"
                            : status === "warning"
                              ? "text-yellow-400"
                              : "text-green-400"
                        }`}
                      >
                        {percentage.toFixed(1)}% used
                      </span>
                      <span className="text-gray-400">${(budget.limit - budget.spent).toFixed(2)} remaining</span>
                    </div>

                    {status === "over" && (
                      <div className="flex items-center gap-2 p-2 bg-red-500/10 rounded-lg">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <span className="text-red-400 text-sm">Budget exceeded</span>
                      </div>
                    )}

                    {status === "warning" && (
                      <div className="flex items-center gap-2 p-2 bg-yellow-500/10 rounded-lg">
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                        <span className="text-yellow-400 text-sm">Approaching limit</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <AddBudgetDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </div>
  )
}
