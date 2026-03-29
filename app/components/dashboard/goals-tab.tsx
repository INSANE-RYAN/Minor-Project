"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Plus, Target, Calendar, DollarSign, TrendingUp, Trash2 } from "lucide-react"
import { useGoals } from "../../contexts/goals-context"
import { AddGoalDialog } from "./add-goal-dialog"
import { formatDistanceToNow } from "date-fns"

export function GoalsTab() {
  const { goals, deleteGoal, addProgress } = useGoals()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const activeGoals = goals.filter((goal) => goal.status === "active")
  const completedGoals = goals.filter((goal) => goal.status === "completed")

  const handleDeleteGoal = (id: string) => {
    if (confirm("Are you sure you want to delete this goal?")) {
      deleteGoal(id)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "low":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "active":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "paused":
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Financial Goals</h1>
          <p className="text-gray-400">Track your progress towards financial milestones</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Goal
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Active Goals</CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{activeGoals.length}</div>
            <p className="text-xs text-gray-400">In progress</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Target</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ${activeGoals.reduce((sum, goal) => sum + goal.targetAmount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-gray-400">Combined target amount</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Completed</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{completedGoals.length}</div>
            <p className="text-xs text-gray-400">Goals achieved</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Active Goals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeGoals.map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100
              const daysLeft = Math.ceil(
                (new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
              )

              return (
                <Card key={goal.id} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-lg text-white">{goal.title}</CardTitle>
                        <CardDescription className="text-gray-400">{goal.description}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(goal.priority)}>{goal.priority}</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteGoal(goal.id)}
                          className="text-gray-400 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-white font-medium">
                          ${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={progress} className="h-3" />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-purple-400 font-medium">{progress.toFixed(1)}% complete</span>
                        <span className="text-gray-400">
                          ${(goal.targetAmount - goal.currentAmount).toLocaleString()} remaining
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>{daysLeft > 0 ? `${daysLeft} days left` : "Deadline passed"}</span>
                      </div>
                      <Badge
                        className={`${goal.category === "Savings" ? "bg-green-500/20 text-green-300" : "bg-blue-500/20 text-blue-300"}`}
                      >
                        {goal.category}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Completed Goals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedGoals.map((goal) => (
              <Card key={goal.id} className="bg-gray-800 border-gray-700 opacity-75">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base text-white">{goal.title}</CardTitle>
                    <Badge className={getStatusColor(goal.status)}>Completed</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Amount</span>
                      <span className="text-green-400 font-medium">${goal.targetAmount.toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Completed {formatDistanceToNow(new Date(goal.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {goals.length === 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="w-16 h-16 text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No goals set yet</h3>
            <p className="text-gray-400 mb-4 text-center">
              Start your financial journey by setting your first goal. Whether it's an emergency fund, vacation, or a
              major purchase, we'll help you track your progress.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Goal
            </Button>
          </CardContent>
        </Card>
      )}

      <AddGoalDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </div>
  )
}
