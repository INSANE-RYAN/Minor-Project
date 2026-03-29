"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useExpenses } from "../../contexts/expense-context"
import { useToast } from "@/hooks/use-toast"

interface AddBudgetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddBudgetDialog({ open, onOpenChange }: AddBudgetDialogProps) {
  const { addBudget, categories, budgets } = useExpenses()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Filter out categories that already have budgets
  const availableCategories = categories.filter((category) => !budgets.some((budget) => budget.category === category))

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const category = formData.get("category") as string
    const limit = Number.parseFloat(formData.get("limit") as string)
    const period = formData.get("period") as "monthly" | "yearly"

    try {
      addBudget({
        category,
        limit,
        period,
      })

      toast({
        title: "Budget created",
        description: "Your budget has been successfully created.",
      })

      onOpenChange(false)
      // Reset form
      ;(e.target as HTMLFormElement).reset()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create budget. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Create New Budget</DialogTitle>
          <DialogDescription className="text-gray-400">
            Set a spending limit for a specific category to track your expenses.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select name="category" required>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                {availableCategories.length === 0 ? (
                  <SelectItem value="" disabled className="text-gray-400">
                    All categories have budgets
                  </SelectItem>
                ) : (
                  availableCategories.map((category) => (
                    <SelectItem key={category} value={category} className="text-white">
                      {category}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="limit">Budget Limit ($)</Label>
              <Input
                id="limit"
                name="limit"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                required
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="period">Period</Label>
              <Select name="period" required>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="monthly" className="text-white">
                    Monthly
                  </SelectItem>
                  <SelectItem value="yearly" className="text-white">
                    Yearly
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || availableCategories.length === 0}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? "Creating..." : "Create Budget"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
