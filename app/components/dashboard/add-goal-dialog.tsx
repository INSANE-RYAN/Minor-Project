"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGoals } from "../../contexts/goals-context"
import { useToast } from "@/hooks/use-toast"

interface AddGoalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const goalCategories = ["Savings", "Travel", "Technology", "Education", "Health", "Home", "Investment", "Other"]

export function AddGoalDialog({ open, onOpenChange }: AddGoalDialogProps) {
  const { addGoal } = useGoals()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const targetAmount = Number.parseFloat(formData.get("targetAmount") as string)
    const currentAmount = Number.parseFloat(formData.get("currentAmount") as string) || 0
    const deadline = formData.get("deadline") as string
    const category = formData.get("category") as string
    const priority = formData.get("priority") as "low" | "medium" | "high"

    try {
      addGoal({
        title,
        description,
        targetAmount,
        currentAmount,
        deadline,
        category,
        priority,
        status: "active",
      })

      toast({
        title: "Goal created",
        description: "Your financial goal has been successfully created.",
      })

      onOpenChange(false)
      // Reset form
      ;(e.target as HTMLFormElement).reset()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create goal. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>Create Financial Goal</DialogTitle>
          <DialogDescription className="text-gray-400">
            Set a new financial goal and track your progress towards achieving it.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Goal Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g., Emergency Fund"
              required
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your goal..."
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 resize-none"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetAmount">Target Amount ($)</Label>
              <Input
                id="targetAmount"
                name="targetAmount"
                type="number"
                step="0.01"
                min="0"
                placeholder="5000.00"
                required
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentAmount">Current Amount ($)</Label>
              <Input
                id="currentAmount"
                name="currentAmount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Target Date</Label>
            <Input
              id="deadline"
              name="deadline"
              type="date"
              required
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select name="category" required>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {goalCategories.map((category) => (
                    <SelectItem key={category} value={category} className="text-white">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select name="priority" required>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="high" className="text-white">
                    High
                  </SelectItem>
                  <SelectItem value="medium" className="text-white">
                    Medium
                  </SelectItem>
                  <SelectItem value="low" className="text-white">
                    Low
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
            <Button type="submit" disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
              {isLoading ? "Creating..." : "Create Goal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
