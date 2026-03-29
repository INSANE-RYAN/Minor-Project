import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "./config"

export interface FirebaseExpense {
  id?: string
  userId: string
  description: string
  amount: number // Amount in rupees
  category: string
  date: Timestamp
  recurring?: boolean
  recurringType?: "daily" | "weekly" | "monthly" | "yearly"
  tags: string[]
  createdAt: any
  updatedAt: any
}

export interface ExpenseFilters {
  category?: string
  startDate?: Date
  endDate?: Date
  tags?: string[]
  minAmount?: number
  maxAmount?: number
}

export const addExpense = async (
  userId: string,
  expenseData: Omit<FirebaseExpense, "id" | "userId" | "createdAt" | "updatedAt">,
): Promise<string> => {
  try {
    const expense: Omit<FirebaseExpense, "id"> = {
      ...expenseData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    const docRef = await addDoc(collection(db, "users", userId, "expenses"), expense)
    return docRef.id
  } catch (error) {
    console.error("Error adding expense:", error)
    throw error
  }
}

export const updateExpense = async (
  userId: string,
  expenseId: string,
  updates: Partial<Omit<FirebaseExpense, "id" | "userId" | "createdAt">>,
): Promise<void> => {
  try {
    const expenseRef = doc(db, "users", userId, "expenses", expenseId)
    await updateDoc(expenseRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating expense:", error)
    throw error
  }
}

export const deleteExpense = async (userId: string, expenseId: string): Promise<void> => {
  try {
    const expenseRef = doc(db, "users", userId, "expenses", expenseId)
    await deleteDoc(expenseRef)
  } catch (error) {
    console.error("Error deleting expense:", error)
    throw error
  }
}

export const getUserExpenses = async (
  userId: string,
  filters?: ExpenseFilters,
  limitCount = 50,
): Promise<FirebaseExpense[]> => {
  try {
    let q = query(collection(db, "users", userId, "expenses"), orderBy("date", "desc"), limit(limitCount))

    // Apply filters
    if (filters?.category) {
      q = query(q, where("category", "==", filters.category))
    }

    if (filters?.startDate) {
      q = query(q, where("date", ">=", Timestamp.fromDate(filters.startDate)))
    }

    if (filters?.endDate) {
      q = query(q, where("date", "<=", Timestamp.fromDate(filters.endDate)))
    }

    const querySnapshot = await getDocs(q)
    const expenses: FirebaseExpense[] = []

    querySnapshot.forEach((doc) => {
      expenses.push({
        id: doc.id,
        ...doc.data(),
      } as FirebaseExpense)
    })

    return expenses
  } catch (error) {
    console.error("Error getting expenses:", error)
    throw error
  }
}

export const getExpenseById = async (userId: string, expenseId: string): Promise<FirebaseExpense | null> => {
  try {
    const expenseRef = doc(db, "users", userId, "expenses", expenseId)
    const expenseDoc = await getDoc(expenseRef)

    if (expenseDoc.exists()) {
      return {
        id: expenseDoc.id,
        ...expenseDoc.data(),
      } as FirebaseExpense
    }

    return null
  } catch (error) {
    console.error("Error getting expense:", error)
    throw error
  }
}

export const getExpensesByCategory = async (userId: string, category: string): Promise<FirebaseExpense[]> => {
  try {
    const q = query(
      collection(db, "users", userId, "expenses"),
      where("category", "==", category),
      orderBy("date", "desc"),
    )

    const querySnapshot = await getDocs(q)
    const expenses: FirebaseExpense[] = []

    querySnapshot.forEach((doc) => {
      expenses.push({
        id: doc.id,
        ...doc.data(),
      } as FirebaseExpense)
    })

    return expenses
  } catch (error) {
    console.error("Error getting expenses by category:", error)
    throw error
  }
}

export const getExpensesByDateRange = async (
  userId: string,
  startDate: Date,
  endDate: Date,
): Promise<FirebaseExpense[]> => {
  try {
    const q = query(
      collection(db, "users", userId, "expenses"),
      where("date", ">=", Timestamp.fromDate(startDate)),
      where("date", "<=", Timestamp.fromDate(endDate)),
      orderBy("date", "desc"),
    )

    const querySnapshot = await getDocs(q)
    const expenses: FirebaseExpense[] = []

    querySnapshot.forEach((doc) => {
      expenses.push({
        id: doc.id,
        ...doc.data(),
      } as FirebaseExpense)
    })

    return expenses
  } catch (error) {
    console.error("Error getting expenses by date range:", error)
    throw error
  }
}
