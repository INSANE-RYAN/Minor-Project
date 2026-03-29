"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface OnboardingContextType {
  isOnboarding: boolean
  currentStep: number
  totalSteps: number
  startOnboarding: () => void
  nextStep: () => void
  prevStep: () => void
  completeOnboarding: () => void
  skipOnboarding: () => void
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [isOnboarding, setIsOnboarding] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const totalSteps = 5

  const startOnboarding = () => {
    setIsOnboarding(true)
    setCurrentStep(0)
  }

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      completeOnboarding()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const completeOnboarding = () => {
    setIsOnboarding(false)
    setCurrentStep(0)
    localStorage.setItem("expenzo-onboarded", "true")
  }

  const skipOnboarding = () => {
    completeOnboarding()
  }

  return (
    <OnboardingContext.Provider
      value={{
        isOnboarding,
        currentStep,
        totalSteps,
        startOnboarding,
        nextStep,
        prevStep,
        completeOnboarding,
        skipOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider")
  }
  return context
}
