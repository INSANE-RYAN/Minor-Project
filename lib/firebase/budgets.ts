import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "./config"

export interface FirebaseBudget {
  id?: string
  userId: string
  category: string
  limit: number // Amount in rupees
  spent: number // Amount in rupees
  period: "monthly" | "yearly"
  startDate: any
  endDate: any
  createdAt: any
  updatedAt: any
}

export const addBudget = async (
  userId: string,
  budgetData: Omit<FirebaseBudget, "id" | "userId" | "spent" | "createdAt" | "updatedAt">,
): Promise<string> => {
  try {
    const budget: Omit<FirebaseBudget, "id"> = {
      ...budgetData,
      userId,
      spent: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    const docRef = await addDoc(collection(db, "users", userId, "budgets"), budget)
    return docRef.id
  } catch (error) {
    console.error("Error adding budget:", error)
    throw error
  }
}

export const updateBudget = async (
  userId: string,
  budgetId: string,
  updates: Partial<Omit<FirebaseBudget, "id" | "userId" | "createdAt">>,
): Promise<void> => {
  try {
    const budgetRef = doc(db, "users", userId, "budgets", budgetId)
    await updateDoc(budgetRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating budget:", error)
    throw error
  }
}

export const deleteBudget = async (userId: string, budgetId: string): Promise<void> => {
  try {
    const budgetRef = doc(db, "users", userId, "budgets", budgetId)
    await deleteDoc(budgetRef)
  } catch (error) {
    console.error("Error deleting budget:", error)
    throw error
  }
}

export const getUserBudgets = async (userId: string): Promise<FirebaseBudget[]> => {
  try {
    const q = query(collection(db, "users", userId, "budgets"), orderBy("createdAt", "desc"))

    const querySnapshot = await getDocs(q)
    const budgets: FirebaseBudget[] = []

    querySnapshot.forEach((doc) => {
      budgets.push({
        id: doc.id,
        ...doc.data(),
      } as FirebaseBudget)
    })

    return budgets
  } catch (error) {
    console.error("Error getting budgets:", error)
    throw error
  }
}

export const getBudgetByCategory = async (userId: string, category: string): Promise<FirebaseBudget | null> => {
  try {
    const q = query(collection(db, "users", userId, "budgets"), where("category", "==", category))

    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0]
      return {
        id: doc.id,
        ...doc.data(),
      } as FirebaseBudget
    }

    return null
  } catch (error) {
    console.error("Error getting budget by category:", error)
    throw error
  }
}

export const updateBudgetSpent = async (userId: string, category: string, amount: number): Promise<void> => {
  try {
    const budget = await getBudgetByCategory(userId, category)

    if (budget && budget.id) {
      await updateBudget(userId, budget.id, {
        spent: budget.spent + amount,
      })
    }
  } catch (error) {
    console.error("Error updating budget spent:", error)
    throw error
  }
}
