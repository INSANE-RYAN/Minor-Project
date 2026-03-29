"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type User, onAuthStateChanged } from "firebase/auth"
import { demoLogin, demoSignup, demoLogout, getDemoUser } from "../../lib/firebase/demo-auth"

// Import Firebase services after ensuring they're initialized
let auth: any
let getCurrentUserProfile: any
let createUserAccount: any
let signInUser: any
let signOutUser: any

// Check if Firebase is properly configured
const isFirebaseConfigured = () => {
  return !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "demo-api-key"
  )
}

// Dynamic imports to ensure Firebase is initialized
const initializeFirebase = async () => {
  if (typeof window !== "undefined" && isFirebaseConfigured()) {
    try {
      const { auth: firebaseAuth } = await import("../../lib/firebase/config")
      const authModule = await import("../../lib/firebase/auth")

      auth = firebaseAuth
      getCurrentUserProfile = authModule.getCurrentUserProfile
      createUserAccount = authModule.createUserAccount
      signInUser = authModule.signInUser
      signOutUser = authModule.signOutUser

      return true
    } catch (error) {
      console.warn("Firebase initialization failed, falling back to demo mode:", error)
      return false
    }
  }
  return false
}

interface UserProfile {
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

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  loading: boolean
  error: string | null
  isDemoMode: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function FirebaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [firebaseInitialized, setFirebaseInitialized] = useState(false)
  const [isDemoMode, setIsDemoMode] = useState(false)

  useEffect(() => {
    const initFirebase = async () => {
      try {
        const initialized = await initializeFirebase()

        if (initialized && auth) {
          setFirebaseInitialized(true)
          setIsDemoMode(false)

          const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user)

            if (user && getCurrentUserProfile) {
              try {
                const profile = await getCurrentUserProfile(user.uid)
                setUserProfile(profile)
              } catch (error) {
                console.error("Error fetching user profile:", error)
              }
            } else {
              setUserProfile(null)
            }

            setLoading(false)
          })

          return () => unsubscribe()
        } else {
          // Fallback to demo mode
          setIsDemoMode(true)
          setFirebaseInitialized(false)

          // Check for existing demo user
          const demoUser = getDemoUser()
          if (demoUser) {
            setUser(demoUser.user as any)
            setUserProfile(demoUser.profile)
          }

          setLoading(false)
        }
      } catch (error) {
        console.error("Firebase initialization error:", error)
        setIsDemoMode(true)
        setError("Using demo mode - Firebase not configured")
        setLoading(false)
      }
    }

    initFirebase()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setError(null)
      setLoading(true)

      if (isDemoMode || !firebaseInitialized) {
        const result = await demoLogin(email, password)

        if ("error" in result) {
          setError(result.error)
          return false
        }

        setUser(result.user as any)
        setUserProfile(result.profile)
        return true
      }

      if (!signInUser) {
        setError("Authentication service not available")
        return false
      }

      const result = await signInUser(email, password)

      if ("error" in result) {
        setError(result.error)
        return false
      }

      setUser(result.user)
      setUserProfile(result.profile)
      return true
    } catch (error) {
      setError("An unexpected error occurred")
      return false
    } finally {
      setLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setError(null)
      setLoading(true)

      if (isDemoMode || !firebaseInitialized) {
        const result = await demoSignup(name, email, password)
        setUser(result.user as any)
        setUserProfile(result.profile)
        return true
      }

      if (!createUserAccount) {
        setError("Authentication service not available")
        return false
      }

      const result = await createUserAccount(email, password, name)

      if ("error" in result) {
        setError(result.error)
        return false
      }

      setUser(result.user)
      setUserProfile(result.profile)
      return true
    } catch (error) {
      setError("An unexpected error occurred")
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      if (isDemoMode || !firebaseInitialized) {
        await demoLogout()
      } else if (signOutUser) {
        await signOutUser()
      }

      setUser(null)
      setUserProfile(null)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        login,
        signup,
        logout,
        loading,
        error,
        isDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useFirebaseAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useFirebaseAuth must be used within a FirebaseAuthProvider")
  }
  return context
}
