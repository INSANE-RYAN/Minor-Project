"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { Timestamp } from "firebase/firestore"
import { useFirebaseAuth } from "./firebase-auth-context"
import { formatIndianCurrency } from "../../lib/utils/currency"

// Dynamic imports for Firebase functions
let addExpense: any
let updateExpense: any
let deleteExpense: any
let getUserExpenses: any
let addBudget: any
let updateBudget: any
let deleteBudget: any
let getUserBudgets: any
let updateBudgetSpent: any

const initializeFirebaseServices = async () => {
  if (typeof window !== "undefined") {
    const expenseModule = await import("../../lib/firebase/expenses")
    const budgetModule = await import("../../lib/firebase/budgets")

    addExpense = expenseModule.addExpense
    updateExpense = expenseModule.updateExpense
    deleteExpense = expenseModule.deleteExpense
    getUserExpenses = expenseModule.getUserExpenses

    addBudget = budgetModule.addBudget
    updateBudget = budgetModule.updateBudget
    deleteBudget = budgetModule.deleteBudget
    getUserBudgets = budgetModule.getUserBudgets
    updateBudgetSpent = budgetModule.updateBudgetSpent

    return true
  }
  return false
}

export interface Expense {
  id: string
  description: string
  amount: number // Amount in rupees
  category: string
  date: string
  recurring?: boolean
  recurringType?: "daily" | "weekly" | "monthly" | "yearly"
  tags: string[]
}

export interface Budget {
  id: string
  category: string
  limit: number // Amount in rupees
  spent: number // Amount in rupees
  period: "monthly" | "yearly"
}

interface ExpenseContextType {
  expenses: Expense[]
  budgets: Budget[]
  addExpense: (expense: Omit<Expense, "id">) => Promise<void>
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<void>
  deleteExpense: (id: string) => Promise<void>
  addBudget: (budget: Omit<Budget, "id" | "spent">) => Promise<void>
  updateBudget: (id: string, budget: Partial<Budget>) => Promise<void>
  deleteBudget: (id: string) => Promise<void>
  categories: string[]
  searchExpenses: (query: string) => Expense[]
  loading: boolean
  error: string | null
  formatCurrency: (amount: number) => string
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

export function FirebaseExpenseProvider({ children }: { children: ReactNode }) {
  const { user } = useFirebaseAuth()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [servicesInitialized, setServicesInitialized] = useState(false)

  // Initialize Firebase services
  useEffect(() => {
    const initServices = async () => {
      const initialized = await initializeFirebaseServices()
      setServicesInitialized(initialized)
    }
    initServices()
  }, [])

  // Load user data when user changes
  useEffect(() => {
    if (user && servicesInitialized) {
      loadUserData()
    } else {
      setExpenses([])
      setBudgets([])
    }
  }, [user, servicesInitialized])

  const loadUserData = async () => {
    if (!user || !getUserExpenses || !getUserBudgets) return

    try {
      setLoading(true)
      setError(null)

      // Load expenses and budgets in parallel
      const [userExpenses, userBudgets] = await Promise.all([getUserExpenses(user.uid), getUserBudgets(user.uid)])

      // Convert Firebase expenses to local format
      const convertedExpenses: Expense[] = userExpenses.map((expense: any) => ({
        id: expense.id!,
        description: expense.description,
        amount: expense.amount,
        category: expense.category,
        date: expense.date.toDate().toISOString().split("T")[0],
        recurring: expense.recurring,
        recurringType: expense.recurringType,
        tags: expense.tags,
      }))

      // Convert Firebase budgets to local format
      const convertedBudgets: Budget[] = userBudgets.map((budget: any) => ({
        id: budget.id!,
        category: budget.category,
        limit: budget.limit,
        spent: budget.spent,
        period: budget.period,
      }))

      setExpenses(convertedExpenses)
      setBudgets(convertedBudgets)
    } catch (err) {
      setError("Failed to load data")
      console.error("Error loading user data:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddExpense = async (expense: Omit<Expense, "id">) => {
    if (!user || !addExpense) return

    try {
      setError(null)

      // Convert to Firebase format
      const firebaseExpense = {
        description: expense.description,
        amount: expense.amount, // Already in rupees
        category: expense.category,
        date: Timestamp.fromDate(new Date(expense.date)),
        recurring: expense.recurring,
        recurringType: expense.recurringType,
        tags: expense.tags,
      }

      const expenseId = await addExpense(user.uid, firebaseExpense)

      // Update local state
      const newExpense: Expense = {
        ...expense,
        id: expenseId,
      }
      setExpenses((prev) => [newExpense, ...prev])

      // Update budget spent amount
      if (updateBudgetSpent) {
        await updateBudgetSpent(user.uid, expense.category, expense.amount)

        // Reload budgets to get updated spent amounts
        if (getUserBudgets) {
          const updatedBudgets = await getUserBudgets(user.uid)
          const convertedBudgets: Budget[] = updatedBudgets.map((budget: any) => ({
            id: budget.id!,
            category: budget.category,
            limit: budget.limit,
            spent: budget.spent,
            period: budget.period,
          }))
          setBudgets(convertedBudgets)
        }
      }
    } catch (err) {
      setError("Failed to add expense")
      console.error("Error adding expense:", err)
    }
  }

  const handleUpdateExpense = async (id: string, updates: Partial<Expense>) => {
    if (!user || !updateExpense) return

    try {
      setError(null)

      const firebaseUpdates: any = { ...updates }
      if (updates.date) {
        firebaseUpdates.date = Timestamp.fromDate(new Date(updates.date))
      }

      await updateExpense(user.uid, id, firebaseUpdates)

      // Update local state
      setExpenses((prev) => prev.map((expense) => (expense.id === id ? { ...expense, ...updates } : expense)))
    } catch (err) {
      setError("Failed to update expense")
      console.error("Error updating expense:", err)
    }
  }

  const handleDeleteExpense = async (id: string) => {
    if (!user || !deleteExpense) return

    try {
      setError(null)

      await deleteExpense(user.uid, id)

      // Update local state
      setExpenses((prev) => prev.filter((expense) => expense.id !== id))
    } catch (err) {
      setError("Failed to delete expense")
      console.error("Error deleting expense:", err)
    }
  }

  const handleAddBudget = async (budget: Omit<Budget, "id" | "spent">) => {
    if (!user || !addBudget) return

    try {
      setError(null)

      // Calculate current period dates
      const now = new Date()
      const startDate =
        budget.period === "monthly" ? new Date(now.getFullYear(), now.getMonth(), 1) : new Date(now.getFullYear(), 0, 1)

      const endDate =
        budget.period === "monthly"
          ? new Date(now.getFullYear(), now.getMonth() + 1, 0)
          : new Date(now.getFullYear(), 11, 31)

      const firebaseBudget = {
        category: budget.category,
        limit: budget.limit,
        period: budget.period,
        startDate: Timestamp.fromDate(startDate),
        endDate: Timestamp.fromDate(endDate),
      }

      const budgetId = await addBudget(user.uid, firebaseBudget)

      // Update local state
      const newBudget: Budget = {
        ...budget,
        id: budgetId,
        spent: 0,
      }
      setBudgets((prev) => [...prev, newBudget])
    } catch (err) {
      setError("Failed to add budget")
      console.error("Error adding budget:", err)
    }
  }

  const handleUpdateBudget = async (id: string, updates: Partial<Budget>) => {
    if (!user || !updateBudget) return

    try {
      setError(null)

      await updateBudget(user.uid, id, updates)

      // Update local state
      setBudgets((prev) => prev.map((budget) => (budget.id === id ? { ...budget, ...updates } : budget)))
    } catch (err) {
      setError("Failed to update budget")
      console.error("Error updating budget:", err)
    }
  }

  const handleDeleteBudget = async (id: string) => {
    if (!user || !deleteBudget) return

    try {
      setError(null)

      await deleteBudget(user.uid, id)

      // Update local state
      setBudgets((prev) => prev.filter((budget) => budget.id !== id))
    } catch (err) {
      setError("Failed to delete budget")
      console.error("Error deleting budget:", err)
    }
  }

  const searchExpenses = (query: string): Expense[] => {
    if (!query) return expenses

    const lowercaseQuery = query.toLowerCase()
    return expenses.filter(
      (expense) =>
        expense.description.toLowerCase().includes(lowercaseQuery) ||
        expense.category.toLowerCase().includes(lowercaseQuery) ||
        expense.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
    )
  }

  const formatCurrency = (amount: number): string => {
    return formatIndianCurrency(amount)
  }

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        budgets,
        addExpense: handleAddExpense,
        updateExpense: handleUpdateExpense,
        deleteExpense: handleDeleteExpense,
        addBudget: handleAddBudget,
        updateBudget: handleUpdateBudget,
        deleteBudget: handleDeleteBudget,
        categories: defaultCategories,
        searchExpenses,
        loading,
        error,
        formatCurrency,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  )
}

export function useFirebaseExpenses() {
  const context = useContext(ExpenseContext)
  if (context === undefined) {
    throw new Error("useFirebaseExpenses must be used within a FirebaseExpenseProvider")
  }
  return context
}
