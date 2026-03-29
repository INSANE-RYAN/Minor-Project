"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface CommunityTip {
  id: string
  title: string
  content: string
  author: {
    name: string
    avatar: string
  }
  category: string
  likes: number
  isLiked: boolean
  createdAt: string
  tags: string[]
}

interface CommunityContextType {
  tips: CommunityTip[]
  addTip: (tip: Omit<CommunityTip, "id" | "createdAt" | "likes" | "isLiked">) => void
  likeTip: (id: string) => void
  filterByCategory: (category: string) => CommunityTip[]
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined)

const mockTips: CommunityTip[] = [
  {
    id: "1",
    title: "The 50/30/20 Rule",
    content:
      "Allocate 50% of your income to needs, 30% to wants, and 20% to savings and debt repayment. This simple rule helps maintain a balanced budget.",
    author: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Budgeting",
    likes: 24,
    isLiked: false,
    createdAt: "2024-01-10",
    tags: ["budgeting", "savings", "planning"],
  },
  {
    id: "2",
    title: "Automate Your Savings",
    content:
      "Set up automatic transfers to your savings account right after payday. Even $25 per week adds up to $1,300 per year!",
    author: {
      name: "Mike Chen",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Savings",
    likes: 18,
    isLiked: true,
    createdAt: "2024-01-08",
    tags: ["automation", "savings", "habits"],
  },
  {
    id: "3",
    title: "Track Every Coffee Purchase",
    content:
      "Small daily expenses add up quickly. I started tracking my coffee purchases and realized I was spending $150/month. Now I make coffee at home and save $120/month!",
    author: {
      name: "Emma Davis",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Tracking",
    likes: 31,
    isLiked: false,
    createdAt: "2024-01-05",
    tags: ["tracking", "daily-expenses", "coffee"],
  },
  {
    id: "4",
    title: "Use the Envelope Method",
    content:
      "Allocate cash for different spending categories in separate envelopes. When the envelope is empty, you're done spending in that category for the month.",
    author: {
      name: "David Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Budgeting",
    likes: 15,
    isLiked: false,
    createdAt: "2024-01-03",
    tags: ["envelope-method", "cash", "budgeting"],
  },
]

export function CommunityProvider({ children }: { children: ReactNode }) {
  const [tips, setTips] = useState<CommunityTip[]>(mockTips)

  const addTip = (tip: Omit<CommunityTip, "id" | "createdAt" | "likes" | "isLiked">) => {
    const newTip: CommunityTip = {
      ...tip,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
    }
    setTips((prev) => [newTip, ...prev])
  }

  const likeTip = (id: string) => {
    setTips((prev) =>
      prev.map((tip) =>
        tip.id === id
          ? {
              ...tip,
              likes: tip.isLiked ? tip.likes - 1 : tip.likes + 1,
              isLiked: !tip.isLiked,
            }
          : tip,
      ),
    )
  }

  const filterByCategory = (category: string) => {
    return category === "all" ? tips : tips.filter((tip) => tip.category === category)
  }

  return (
    <CommunityContext.Provider value={{ tips, addTip, likeTip, filterByCategory }}>
      {children}
    </CommunityContext.Provider>
  )
}

export function useCommunity() {
  const context = useContext(CommunityContext)
  if (context === undefined) {
    throw new Error("useCommunity must be used within a CommunityProvider")
  }
  return context
}
