"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface Expense {
  id: string
  description: string
  amount: number
  category: string
  date: string
  recurring?: boolean
  recurringType?: "daily" | "weekly" | "monthly" | "yearly"
  tags: string[]
}

export interface Budget {
  id: string
  category: string
  limit: number
  spent: number
  period: "monthly" | "yearly"
}

interface ExpenseContextType {
  expenses: Expense[]
  budgets: Budget[]
  addExpense: (expense: Omit<Expense, "id">) => void
  updateExpense: (id: string, expense: Partial<Expense>) => void
  deleteExpense: (id: string) => void
  addBudget: (budget: Omit<Budget, "id" | "spent">) => void
  updateBudget: (id: string, budget: Partial<Budget>) => void
  deleteBudget: (id: string) => void
  categories: string[]
  searchExpenses: (query: string) => Expense[]
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined)

const defaultCategories = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Travel",
  "Education",
  "Personal Care",
  "Other",
]

const mockExpenses: Expense[] = [
  {
    id: "1",
    description: "Grocery shopping",
    amount: 85.5,
    category: "Food & Dining",
    date: "2024-01-15",
    tags: ["groceries", "weekly", "essentials"],
  },
  {
    id: "2",
    description: "Gas station",
    amount: 45.0,
    category: "Transportation",
    date: "2024-01-14",
    tags: ["fuel", "car", "commute"],
  },
  {
    id: "3",
    description: "Netflix subscription",
    amount: 15.99,
    category: "Entertainment",
    date: "2024-01-13",
    recurring: true,
    recurringType: "monthly",
    tags: ["streaming", "subscription", "entertainment"],
  },
  {
    id: "4",
    description: "Coffee shop",
    amount: 12.5,
    category: "Food & Dining",
    date: "2024-01-12",
    tags: ["coffee", "daily", "treat"],
  },
  {
    id: "5",
    description: "Electricity bill",
    amount: 120.0,
    category: "Bills & Utilities",
    date: "2024-01-10",
    recurring: true,
    recurringType: "monthly",
    tags: ["utilities", "monthly", "essential"],
  },
]

const mockBudgets: Budget[] = [
  {
    id: "1",
    category: "Food & Dining",
    limit: 500,
    spent: 298,
    period: "monthly",
  },
  {
    id: "2",
    category: "Transportation",
    limit: 200,
    spent: 145,
    period: "monthly",
  },
  {
    id: "3",
    category: "Entertainment",
    limit: 100,
    spent: 65.99,
    period: "monthly",
  },
]

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses)
  const [budgets, setBudgets] = useState<Budget[]>(mockBudgets)

  const addExpense = (expense: Omit<Expense, "id">) => {
    const newExpense = {
      ...expense,
      id: Date.now().toString(),
    }
    setExpenses((prev) => [newExpense, ...prev])

    // Update budget spent amount
    setBudgets((prev) =>
      prev.map((budget) =>
        budget.category === expense.category ? { ...budget, spent: budget.spent + expense.amount } : budget,
      ),
    )
  }

  const updateExpense = (id: string, updatedExpense: Partial<Expense>) => {
    setExpenses((prev) => prev.map((expense) => (expense.id === id ? { ...expense, ...updatedExpense } : expense)))
  }

  const deleteExpense = (id: string) => {
    const expense = expenses.find((e) => e.id === id)
    if (expense) {
      setExpenses((prev) => prev.filter((e) => e.id !== id))

      // Update budget spent amount
      setBudgets((prev) =>
        prev.map((budget) =>
          budget.category === expense.category
            ? { ...budget, spent: Math.max(0, budget.spent - expense.amount) }
            : budget,
        ),
      )
    }
  }

  const addBudget = (budget: Omit<Budget, "id" | "spent">) => {
    const spent = expenses
      .filter((expense) => expense.category === budget.category)
      .reduce((total, expense) => total + expense.amount, 0)

    const newBudget = {
      ...budget,
      id: Date.now().toString(),
      spent,
    }
    setBudgets((prev) => [...prev, newBudget])
  }

  const updateBudget = (id: string, updatedBudget: Partial<Budget>) => {
    setBudgets((prev) => prev.map((budget) => (budget.id === id ? { ...budget, ...updatedBudget } : budget)))
  }

  const deleteBudget = (id: string) => {
    setBudgets((prev) => prev.filter((budget) => budget.id !== id))
  }

  const searchExpenses = (query: string, expenses: Expense[]) => {
    if (!query) return expenses

    const lowercaseQuery = query.toLowerCase()
    return expenses.filter(
      (expense) =>
        expense.description.toLowerCase().includes(lowercaseQuery) ||
        expense.category.toLowerCase().includes(lowercaseQuery) ||
        expense.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
    )
  }

  const searchExpensesByQuery = (query: string) => {
    return searchExpenses(query, expenses)
  }

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        budgets,
        addExpense,
        updateExpense,
        deleteExpense,
        addBudget,
        updateBudget,
        deleteBudget,
        categories: defaultCategories,
        searchExpenses: searchExpensesByQuery,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  )
}

export function useExpenses() {
  const context = useContext(ExpenseContext)
  if (context === undefined) {
    throw new Error("useExpenses must be used within an ExpenseProvider")
  }
  return context
}
