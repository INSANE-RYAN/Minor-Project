"use client"
import { useState, useEffect } from "react"
import { FirebaseAuthProvider, useFirebaseAuth } from "./contexts/firebase-auth-context"
import { FirebaseExpenseProvider } from "./contexts/firebase-expense-context"
import { FirebaseThemeProvider } from "./contexts/firebase-theme-context"
import { GoalsProvider } from "./contexts/goals-context"
import { OnboardingProvider, useOnboarding } from "./contexts/onboarding-context"
import { CommunityProvider } from "./contexts/community-context"
import LandingPage from "./components/landing/landing-page"
import LoginPage from "./components/auth/login-page"
import Dashboard from "./components/dashboard/dashboard"
import OnboardingFlow from "./components/onboarding/onboarding-flow"
import { AnimatedBackground } from "./components/landing/animated-background"
import { Toaster } from "@/components/ui/toaster"

type AppState = "landing" | "login" | "dashboard" | "onboarding"

function AppContent() {
  const { user, loading } = useFirebaseAuth()
  const { isOnboarding } = useOnboarding()
  const [appState, setAppState] = useState<AppState>("landing")

  useEffect(() => {
    if (loading) return

    if (!user) {
      // Always show landing page first for new visitors
      const hasSeenLanding = localStorage.getItem("expenzo-seen-landing")
      if (!hasSeenLanding) {
        setAppState("landing")
      } else {
        setAppState("login")
      }
    } else if (isOnboarding) {
      setAppState("onboarding")
    } else {
      setAppState("dashboard")
    }
  }, [user, loading, isOnboarding])

  const handleGetStarted = () => {
    localStorage.setItem("expenzo-seen-landing", "true")
    setAppState("login")
  }

  const handleBackToLanding = () => {
    localStorage.removeItem("expenzo-seen-landing")
    setAppState("landing")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <>
      {(appState === "landing" || appState === "login") && <AnimatedBackground />}

      {appState === "landing" && <LandingPage onGetStarted={handleGetStarted} />}

      {appState === "login" && <LoginPage onBackToLanding={handleBackToLanding} />}

      {appState === "onboarding" && <OnboardingFlow />}

      {appState === "dashboard" && <Dashboard />}

      <Toaster />
    </>
  )
}

export default function Home() {
  return (
    <FirebaseAuthProvider>
      <FirebaseThemeProvider>
        <OnboardingProvider>
          <FirebaseExpenseProvider>
            <GoalsProvider>
              <CommunityProvider>
                <AppContent />
              </CommunityProvider>
            </GoalsProvider>
          </FirebaseExpenseProvider>
        </OnboardingProvider>
      </FirebaseThemeProvider>
    </FirebaseAuthProvider>
  )
}
