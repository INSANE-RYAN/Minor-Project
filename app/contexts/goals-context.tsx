"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface FinancialGoal {
  id: string
  title: string
  description: string
  targetAmount: number
  currentAmount: number
  deadline: string
  category: string
  priority: "low" | "medium" | "high"
  status: "active" | "completed" | "paused"
  createdAt: string
}

interface GoalsContextType {
  goals: FinancialGoal[]
  addGoal: (goal: Omit<FinancialGoal, "id" | "createdAt">) => void
  updateGoal: (id: string, goal: Partial<FinancialGoal>) => void
  deleteGoal: (id: string) => void
  addProgress: (id: string, amount: number) => void
}

const GoalsContext = createContext<GoalsContextType | undefined>(undefined)

const mockGoals: FinancialGoal[] = [
  {
    id: "1",
    title: "Emergency Fund",
    description: "Build an emergency fund for unexpected expenses",
    targetAmount: 5000,
    currentAmount: 2750,
    deadline: "2024-12-31",
    category: "Savings",
    priority: "high",
    status: "active",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    title: "Vacation to Japan",
    description: "Save for a 2-week trip to Japan",
    targetAmount: 3500,
    currentAmount: 1200,
    deadline: "2024-08-15",
    category: "Travel",
    priority: "medium",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: "3",
    title: "New Laptop",
    description: "MacBook Pro for work and personal use",
    targetAmount: 2500,
    currentAmount: 2500,
    deadline: "2024-03-01",
    category: "Technology",
    priority: "low",
    status: "completed",
    createdAt: "2023-12-01",
  },
]

export function GoalsProvider({ children }: { children: ReactNode }) {
  const [goals, setGoals] = useState<FinancialGoal[]>(mockGoals)

  const addGoal = (goal: Omit<FinancialGoal, "id" | "createdAt">) => {
    const newGoal: FinancialGoal = {
      ...goal,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setGoals((prev) => [newGoal, ...prev])
  }

  const updateGoal = (id: string, updatedGoal: Partial<FinancialGoal>) => {
    setGoals((prev) => prev.map((goal) => (goal.id === id ? { ...goal, ...updatedGoal } : goal)))
  }

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== id))
  }

  const addProgress = (id: string, amount: number) => {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id === id) {
          const newAmount = Math.min(goal.currentAmount + amount, goal.targetAmount)
          const status = newAmount >= goal.targetAmount ? "completed" : goal.status
          return { ...goal, currentAmount: newAmount, status }
        }
        return goal
      }),
    )
  }

  return (
    <GoalsContext.Provider value={{ goals, addGoal, updateGoal, deleteGoal, addProgress }}>
      {children}
    </GoalsContext.Provider>
  )
}

export function useGoals() {
  const context = useContext(GoalsContext)
  if (context === undefined) {
    throw new Error("useGoals must be used within a GoalsProvider")
  }
  return context
}
