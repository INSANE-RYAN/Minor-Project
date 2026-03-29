"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BarChart3, Target, PieChart, TrendingUp } from "lucide-react"

const showcaseFeatures = [
  {
    id: "analytics",
    title: "Smart Analytics",
    icon: BarChart3,
    description: "Get detailed insights with beautiful charts",
    preview: (
      <div className="bg-gray-800 rounded-lg p-4 h-48">
        <div className="flex items-center justify-between mb-4">
          <span className="text-white font-medium">Spending Trend</span>
          <TrendingUp className="w-4 h-4 text-green-400" />
        </div>
        <div className="space-y-3">
          {[40, 65, 30, 80, 45].map((height, i) => (
            <motion.div
              key={i}
              initial={{ width: 0 }}
              animate={{ width: `${height}%` }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-6 rounded"
            />
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "goals",
    title: "Goal Tracking",
    icon: Target,
    description: "Visual progress tracking for your financial goals",
    preview: (
      <div className="bg-gray-800 rounded-lg p-4 h-48">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white">Emergency Fund</span>
              <span className="text-green-400">$2,750 / $5,000</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "55%" }}
                transition={{ duration: 1 }}
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white">Vacation</span>
              <span className="text-blue-400">$1,200 / $3,500</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "34%" }}
                transition={{ duration: 1, delay: 0.2 }}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "budgets",
    title: "Budget Management",
    icon: PieChart,
    description: "Track spending limits with smart alerts",
    preview: (
      <div className="bg-gray-800 rounded-lg p-4 h-48 flex items-center justify-center">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle cx="64" cy="64" r="56" stroke="rgb(55, 65, 81)" strokeWidth="8" fill="transparent" />
            <motion.circle
              cx="64"
              cy="64"
              r="56"
              stroke="url(#gradient)"
              strokeWidth="8"
              fill="transparent"
              strokeLinecap="round"
              initial={{ strokeDasharray: "0 351.86" }}
              animate={{ strokeDasharray: "263.9 351.86" }}
              transition={{ duration: 1.5 }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-white font-bold">75%</div>
              <div className="text-gray-400 text-xs">Used</div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
]

export function FeatureShowcase() {
  const [activeFeature, setActiveFeature] = useState(showcaseFeatures[0])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div className="space-y-6">
        <h3 className="text-3xl font-bold text-white mb-8">
          Experience the Power of
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            {" "}
            Smart Finance
          </span>
        </h3>

        <div className="space-y-4">
          {showcaseFeatures.map((feature) => (
            <motion.div
              key={feature.id}
              whileHover={{ x: 10 }}
              className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                activeFeature.id === feature.id
                  ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30"
                  : "bg-gray-800/50 border border-gray-700 hover:border-gray-600"
              }`}
              onClick={() => setActiveFeature(feature)}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    activeFeature.id === feature.id ? "bg-gradient-to-r from-purple-500 to-blue-500" : "bg-gray-700"
                  }`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">{feature.title}</h4>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFeature.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeFeature.preview}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
