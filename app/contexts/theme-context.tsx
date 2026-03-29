"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

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
  setTheme: (themeId: string) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0])

  useEffect(() => {
    const savedTheme = localStorage.getItem("expenzo-theme")
    if (savedTheme) {
      const theme = themes.find((t) => t.id === savedTheme)
      if (theme) {
        setCurrentTheme(theme)
      }
    }
  }, [])

  useEffect(() => {
    // Apply theme to CSS variables
    const root = document.documentElement
    Object.entries(currentTheme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value)
    })
  }, [currentTheme])

  const setTheme = (themeId: string) => {
    const theme = themes.find((t) => t.id === themeId)
    if (theme) {
      setCurrentTheme(theme)
      localStorage.setItem("expenzo-theme", themeId)
    }
  }

  return <ThemeContext.Provider value={{ currentTheme, themes, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
