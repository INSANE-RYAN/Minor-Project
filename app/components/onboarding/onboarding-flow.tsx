"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useOnboarding } from "../../contexts/onboarding-context"
import { useTheme } from "../../contexts/theme-context"
import { Wallet, Target, Tags, BarChart3, Users, ArrowRight, ArrowLeft, X } from "lucide-react"

const onboardingSteps = [
  {
    title: "Welcome to Expenzo",
    description: "Your journey to financial freedom starts here",
    icon: Wallet,
    content: (
      <div className="text-center space-y-4">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
          <Wallet className="w-12 h-12 text-white" />
        </div>
        <p className="text-gray-300 text-lg">
          Expenzo helps you take control of your finances with powerful tools for tracking, budgeting, and achieving
          your financial goals.
        </p>
      </div>
    ),
  },
  {
    title: "Track Your Expenses",
    description: "Learn how to add and categorize your expenses",
    icon: BarChart3,
    content: (
      <div className="space-y-4">
        <div className="bg-gray-700/50 rounded-lg p-4">
          <h4 className="font-semibold text-white mb-2">Adding Expenses</h4>
          <p className="text-gray-300 text-sm">
            Click the "Add Expense" button to record your spending. Include details like amount, category, and
            description for better tracking.
          </p>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-4">
          <h4 className="font-semibold text-white mb-2">Categories & Tags</h4>
          <p className="text-gray-300 text-sm">
            Organize expenses with categories and add custom tags for better filtering and analysis.
          </p>
        </div>
      </div>
    ),
  },
  {
    title: "Set Financial Goals",
    description: "Create and track your savings goals",
    icon: Target,
    content: (
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg p-4">
          <Target className="w-8 h-8 text-green-400 mb-2" />
          <h4 className="font-semibold text-white mb-2">Goal Setting</h4>
          <p className="text-gray-300 text-sm">
            Set specific financial goals like emergency funds, vacation savings, or major purchases. Track your progress
            visually and stay motivated.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-700/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-400">$2,750</div>
            <div className="text-xs text-gray-400">Emergency Fund</div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-400">$1,200</div>
            <div className="text-xs text-gray-400">Vacation</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Customize Your Experience",
    description: "Choose your preferred theme and settings",
    icon: Tags,
    content: (
      <div className="space-y-4">
        <p className="text-gray-300">Choose from multiple beautiful themes to personalize your dashboard:</p>
        <ThemeSelector />
      </div>
    ),
  },
  {
    title: "Join the Community",
    description: "Connect with others and share financial tips",
    icon: Users,
    content: (
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-4">
          <Users className="w-8 h-8 text-purple-400 mb-2" />
          <h4 className="font-semibold text-white mb-2">Community Tips</h4>
          <p className="text-gray-300 text-sm">
            Learn from other users' experiences, share your own tips, and discover new strategies for managing your
            finances effectively.
          </p>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">S</span>
            </div>
            <div>
              <div className="text-white text-sm font-medium">Sarah's Tip</div>
              <div className="text-gray-400 text-xs">Use the 50/30/20 rule for budgeting</div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
]

function ThemeSelector() {
  const { themes, currentTheme, setTheme } = useTheme()

  return (
    <div className="grid grid-cols-3 gap-3">
      {themes.slice(0, 6).map((theme) => (
        <button
          key={theme.id}
          onClick={() => setTheme(theme.id)}
          className={`p-3 rounded-lg border-2 transition-all ${
            currentTheme.id === theme.id ? "border-white" : "border-gray-600 hover:border-gray-500"
          }`}
          style={{ backgroundColor: theme.colors.surface }}
        >
          <div className="w-full h-8 rounded mb-2" style={{ backgroundColor: theme.colors.primary }} />
          <div className="text-xs text-white">{theme.name}</div>
        </button>
      ))}
    </div>
  )
}

export default function OnboardingFlow() {
  const { currentStep, totalSteps, nextStep, prevStep, completeOnboarding, skipOnboarding } = useOnboarding()
  const { currentTheme } = useTheme()

  const currentStepData = onboardingSteps[currentStep]
  const progress = ((currentStep + 1) / totalSteps) * 100

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${currentTheme.gradient} flex items-center justify-center p-4`}
      style={{ backgroundColor: currentTheme.colors.background }}
    >
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-400">
              Step {currentStep + 1} of {totalSteps}
            </div>
            <Button variant="ghost" size="sm" onClick={skipOnboarding} className="text-gray-400 hover:text-white">
              <X className="w-4 h-4 mr-1" />
              Skip
            </Button>
          </div>
          <Progress value={progress} className="h-2 mb-6" />
        </div>

        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: currentTheme.colors.primary }}
              >
                <currentStepData.icon className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl text-white">{currentStepData.title}</CardTitle>
            <CardDescription className="text-gray-400 text-lg">{currentStepData.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStepData.content}

            <div className="flex items-center justify-between pt-6">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <Button
                onClick={nextStep}
                className="text-white"
                style={{ backgroundColor: currentTheme.colors.primary }}
              >
                {currentStep === totalSteps - 1 ? "Get Started" : "Next"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
