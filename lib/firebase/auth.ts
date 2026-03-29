import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
  type AuthError,
} from "firebase/auth"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "./config"

export interface UserProfile {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  createdAt: any
  updatedAt: any
  preferences: {
    currency: string
    theme: string
    notifications: {
      budgetAlerts: boolean
      goalReminders: boolean
      weeklyReports: boolean
      communityUpdates: boolean
    }
  }
}

export const createUserAccount = async (
  email: string,
  password: string,
  displayName: string,
): Promise<{ user: User; profile: UserProfile } | { error: string }> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Update the user's display name
    await updateProfile(user, { displayName })

    // Create user profile in Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName,
      photoURL: user.photoURL || undefined,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      preferences: {
        currency: "INR",
        theme: "purple",
        notifications: {
          budgetAlerts: true,
          goalReminders: true,
          weeklyReports: false,
          communityUpdates: true,
        },
      },
    }

    await setDoc(doc(db, "users", user.uid), userProfile)

    return { user, profile: userProfile }
  } catch (error) {
    const authError = error as AuthError
    return { error: authError.message }
  }
}

export const signInUser = async (
  email: string,
  password: string,
): Promise<{ user: User; profile: UserProfile } | { error: string }> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Get user profile from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid))
    const profile = userDoc.data() as UserProfile

    return { user, profile }
  } catch (error) {
    const authError = error as AuthError
    return { error: authError.message }
  }
}

export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth)
  } catch (error) {
    console.error("Error signing out:", error)
    throw error
  }
}

export const getCurrentUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid))
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile
    }
    return null
  } catch (error) {
    console.error("Error getting user profile:", error)
    return null
  }
}
