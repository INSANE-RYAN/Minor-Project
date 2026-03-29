// Demo authentication for development/testing
export const demoLogin = async (email: string, password: string) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  if (email === "demo@expenzo.app" && password === "demo123") {
    const userData = {
      uid: "demo-user-123",
      email: "demo@expenzo.app",
      displayName: "Demo User",
      photoURL: "/placeholder.svg?height=40&width=40",
    }

    const userProfile = {
      uid: userData.uid,
      email: userData.email,
      displayName: userData.displayName,
      photoURL: userData.photoURL,
      createdAt: new Date(),
      updatedAt: new Date(),
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

    // Store in localStorage for demo
    localStorage.setItem("expenzo-demo-user", JSON.stringify(userData))
    localStorage.setItem("expenzo-demo-profile", JSON.stringify(userProfile))

    return { user: userData, profile: userProfile }
  }

  return { error: "Invalid credentials. Use demo@expenzo.app / demo123" }
}

export const demoSignup = async (name: string, email: string, password: string) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const userData = {
    uid: `demo-${Date.now()}`,
    email,
    displayName: name,
    photoURL: "/placeholder.svg?height=40&width=40",
  }

  const userProfile = {
    uid: userData.uid,
    email: userData.email,
    displayName: userData.displayName,
    photoURL: userData.photoURL,
    createdAt: new Date(),
    updatedAt: new Date(),
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

  // Store in localStorage for demo
  localStorage.setItem("expenzo-demo-user", JSON.stringify(userData))
  localStorage.setItem("expenzo-demo-profile", JSON.stringify(userProfile))

  return { user: userData, profile: userProfile }
}

export const demoLogout = async () => {
  localStorage.removeItem("expenzo-demo-user")
  localStorage.removeItem("expenzo-demo-profile")
}

export const getDemoUser = () => {
  if (typeof window === "undefined") return null

  const userData = localStorage.getItem("expenzo-demo-user")
  const userProfile = localStorage.getItem("expenzo-demo-profile")

  if (userData && userProfile) {
    return {
      user: JSON.parse(userData),
      profile: JSON.parse(userProfile),
    }
  }

  return null
}
