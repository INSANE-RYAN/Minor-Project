"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
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

interface EditExpenseDialogProps {
  expenseId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditExpenseDialog({ expenseId, open, onOpenChange }: EditExpenseDialogProps) {
  const { expenses, updateExpense, categories } = useExpenses()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const expense = expenses.find((e) => e.id === expenseId)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const description = formData.get("description") as string
    const amount = Number.parseFloat(formData.get("amount") as string)
    const category = formData.get("category") as string
    const date = formData.get("date") as string
    const recurring = formData.get("recurring") === "on"
    const recurringType = formData.get("recurringType") as "daily" | "weekly" | "monthly" | "yearly"
    const tagsString = formData.get("tags") as string
    const tags = tagsString
      ? tagsString
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag)
      : []

    try {
      updateExpense(expenseId, {
        description,
        amount,
        category,
        date,
        recurring,
        recurringType: recurring ? recurringType : undefined,
        tags,
      })

      toast({
        title: "Expense updated",
        description: "Your expense has been successfully updated.",
      })

      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update expense. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!expense) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>
          <DialogDescription className="text-gray-400">Update the details of your expense entry.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              defaultValue={expense.description}
              required
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0"
                defaultValue={expense.amount}
                required
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                defaultValue={expense.date}
                required
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select name="category" defaultValue={expense.category} required>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                {categories.map((category) => (
                  <SelectItem key={category} value={category} className="text-white">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (optional)</Label>
            <Input
              id="tags"
              name="tags"
              defaultValue={expense.tags.join(", ")}
              placeholder="e.g., groceries, weekly, essentials"
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="recurring" name="recurring" defaultChecked={expense.recurring} />
            <Label htmlFor="recurring" className="text-sm">
              This is a recurring expense
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recurringType">Recurring Frequency</Label>
            <Select name="recurringType" defaultValue={expense.recurringType}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="daily" className="text-white">
                  Daily
                </SelectItem>
                <SelectItem value="weekly" className="text-white">
                  Weekly
                </SelectItem>
                <SelectItem value="monthly" className="text-white">
                  Monthly
                </SelectItem>
                <SelectItem value="yearly" className="text-white">
                  Yearly
                </SelectItem>
              </SelectContent>
            </Select>
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
              {isLoading ? "Updating..." : "Update Expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
