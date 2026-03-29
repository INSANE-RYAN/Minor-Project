"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useFirebaseAuth } from "./firebase-auth-context"

// Dynamic import for Firebase
let db: any
let doc: any
let updateDoc: any

const initializeFirebase = async () => {
  if (typeof window !== "undefined") {
    const { db: firebaseDb } = await import("../../lib/firebase/config")
    const { doc: firestoreDoc, updateDoc: firestoreUpdateDoc } = await import("firebase/firestore")

    db = firebaseDb
    doc = firestoreDoc
    updateDoc = firestoreUpdateDoc

    return true
  }
  return false
}

export interface Theme {
  id: string
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    textSecondary: string
  }
  gradient: string
}

const themes: Theme[] = [
  {
    id: "purple",
    name: "Purple Dream",
    colors: {
      primary: "#8b5cf6",
      secondary: "#a78bfa",
      accent: "#c4b5fd",
      background: "#111827",
      surface: "#1f2937",
      text: "#ffffff",
      textSecondary: "#9ca3af",
    },
    gradient: "from-purple-900 via-blue-900 to-purple-900",
  },
  {
    id: "ocean",
    name: "Ocean Breeze",
    colors: {
      primary: "#06b6d4",
      secondary: "#0891b2",
      accent: "#67e8f9",
      background: "#0f172a",
      surface: "#1e293b",
      text: "#ffffff",
      textSecondary: "#94a3b8",
    },
    gradient: "from-cyan-900 via-blue-900 to-slate-900",
  },
  {
    id: "sunset",
    name: "Sunset Glow",
    colors: {
      primary: "#f59e0b",
      secondary: "#d97706",
      accent: "#fbbf24",
      background: "#1c1917",
      surface: "#292524",
      text: "#ffffff",
      textSecondary: "#a8a29e",
    },
    gradient: "from-orange-900 via-red-900 to-yellow-900",
  },
  {
    id: "forest",
    name: "Forest Green",
    colors: {
      primary: "#10b981",
      secondary: "#059669",
      accent: "#34d399",
      background: "#064e3b",
      surface: "#065f46",
      text: "#ffffff",
      textSecondary: "#a7f3d0",
    },
    gradient: "from-emerald-900 via-green-900 to-teal-900",
  },
  {
    id: "rose",
    name: "Rose Garden",
    colors: {
      primary: "#f43f5e",
      secondary: "#e11d48",
      accent: "#fb7185",
      background: "#1f1012",
      surface: "#2d1b20",
      text: "#ffffff",
      textSecondary: "#fda4af",
    },
    gradient: "from-rose-900 via-pink-900 to-red-900",
  },
]

interface ThemeContextType {
  currentTheme: Theme
  themes: Theme[]
  setTheme: (themeId: string) => Promise<void>
  loading: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function FirebaseThemeProvider({ children }: { children: ReactNode }) {
  const { user, userProfile } = useFirebaseAuth()
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0])
  const [loading, setLoading] = useState(false)
  const [firebaseInitialized, setFirebaseInitialized] = useState(false)

  // Initialize Firebase
  useEffect(() => {
    const initFirebase = async () => {
      const initialized = await initializeFirebase()
      setFirebaseInitialized(initialized)
    }
    initFirebase()
  }, [])

  // Load theme from user profile or localStorage
  useEffect(() => {
    if (userProfile?.preferences?.theme) {
      const theme = themes.find((t) => t.id === userProfile.preferences.theme)
      if (theme) {
        setCurrentTheme(theme)
        applyThemeToDOM(theme)
      }
    } else {
      // Fallback to localStorage for non-authenticated users
      const savedTheme = localStorage.getItem("expenzo-theme")
      if (savedTheme) {
        const theme = themes.find((t) => t.id === savedTheme)
        if (theme) {
          setCurrentTheme(theme)
          applyThemeToDOM(theme)
        }
      }
    }
  }, [userProfile])

  const applyThemeToDOM = (theme: Theme) => {
    if (typeof window === "undefined") return

    const root = document.documentElement

    // Apply CSS custom properties
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value)
    })

    // Apply Tailwind CSS variables for better integration
    root.style.setProperty("--color-primary", theme.colors.primary)
    root.style.setProperty("--color-secondary", theme.colors.secondary)
    root.style.setProperty("--color-accent", theme.colors.accent)
    root.style.setProperty("--color-background", theme.colors.background)
    root.style.setProperty("--color-surface", theme.colors.surface)
    root.style.setProperty("--color-text", theme.colors.text)
    root.style.setProperty("--color-text-secondary", theme.colors.textSecondary)

    // Update meta theme color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", theme.colors.primary)
    } else {
      const meta = document.createElement("meta")
      meta.name = "theme-color"
      meta.content = theme.colors.primary
      document.head.appendChild(meta)
    }
  }

  const setTheme = async (themeId: string) => {
    const theme = themes.find((t) => t.id === themeId)
    if (!theme) return

    setLoading(true)

    try {
      setCurrentTheme(theme)
      applyThemeToDOM(theme)

      // Save to Firebase if user is authenticated and Firebase is initialized
      if (user && firebaseInitialized && db && doc && updateDoc) {
        try {
          const userRef = doc(db, "users", user.uid)
          await updateDoc(userRef, {
            "preferences.theme": themeId,
            updatedAt: new Date(),
          })
        } catch (error) {
          console.error("Error saving theme to Firebase:", error)
          // Continue with local storage save even if Firebase fails
        }
      }

      // Always save to localStorage as backup
      localStorage.setItem("expenzo-theme", themeId)
    } catch (error) {
      console.error("Error setting theme:", error)
    } finally {
      setLoading(false)
    }
  }

  return <ThemeContext.Provider value={{ currentTheme, themes, setTheme, loading }}>{children}</ThemeContext.Provider>
}

export function useFirebaseTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useFirebaseTheme must be used within a FirebaseThemeProvider")
  }
  return context
}
