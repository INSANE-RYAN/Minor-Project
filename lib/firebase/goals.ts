import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore"
import { db } from "./config"

export interface FirebaseGoal {
  id?: string
  userId: string
  title: string
  description: string
  targetAmount: number // Amount in rupees
  currentAmount: number // Amount in rupees
  deadline: Timestamp
  category: string
  priority: "low" | "medium" | "high"
  status: "active" | "completed" | "paused"
  createdAt: any
  updatedAt: any
}

export const addGoal = async (
  userId: string,
  goalData: Omit<FirebaseGoal, "id" | "userId" | "createdAt" | "updatedAt">,
): Promise<string> => {
  try {
    const goal: Omit<FirebaseGoal, "id"> = {
      ...goalData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    const docRef = await addDoc(collection(db, "users", userId, "goals"), goal)
    return docRef.id
  } catch (error) {
    console.error("Error adding goal:", error)
    throw error
  }
}

export const updateGoal = async (
  userId: string,
  goalId: string,
  updates: Partial<Omit<FirebaseGoal, "id" | "userId" | "createdAt">>,
): Promise<void> => {
  try {
    const goalRef = doc(db, "users", userId, "goals", goalId)
    await updateDoc(goalRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating goal:", error)
    throw error
  }
}

export const deleteGoal = async (userId: string, goalId: string): Promise<void> => {
  try {
    const goalRef = doc(db, "users", userId, "goals", goalId)
    await deleteDoc(goalRef)
  } catch (error) {
    console.error("Error deleting goal:", error)
    throw error
  }
}

export const getUserGoals = async (userId: string): Promise<FirebaseGoal[]> => {
  try {
    const q = query(collection(db, "users", userId, "goals"), orderBy("createdAt", "desc"))

    const querySnapshot = await getDocs(q)
    const goals: FirebaseGoal[] = []

    querySnapshot.forEach((doc) => {
      goals.push({
        id: doc.id,
        ...doc.data(),
      } as FirebaseGoal)
    })

    return goals
  } catch (error) {
    console.error("Error getting goals:", error)
    throw error
  }
}

export const getGoalsByStatus = async (
  userId: string,
  status: "active" | "completed" | "paused",
): Promise<FirebaseGoal[]> => {
  try {
    const q = query(
      collection(db, "users", userId, "goals"),
      where("status", "==", status),
      orderBy("createdAt", "desc"),
    )

    const querySnapshot = await getDocs(q)
    const goals: FirebaseGoal[] = []

    querySnapshot.forEach((doc) => {
      goals.push({
        id: doc.id,
        ...doc.data(),
      } as FirebaseGoal)
    })

    return goals
  } catch (error) {
    console.error("Error getting goals by status:", error)
    throw error
  }
}

export const addProgressToGoal = async (userId: string, goalId: string, amount: number): Promise<void> => {
  try {
    const goalRef = doc(db, "users", userId, "goals", goalId)
    const goalDoc = await getDoc(goalRef)

    if (goalDoc.exists()) {
      const goal = goalDoc.data() as FirebaseGoal
      const newAmount = Math.min(goal.currentAmount + amount, goal.targetAmount)
      const newStatus = newAmount >= goal.targetAmount ? "completed" : goal.status

      await updateDoc(goalRef, {
        currentAmount: newAmount,
        status: newStatus,
        updatedAt: serverTimestamp(),
      })
    }
  } catch (error) {
    console.error("Error adding progress to goal:", error)
    throw error
  }
}
