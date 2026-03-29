"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Filter, Edit, Trash2 } from "lucide-react"
import { useExpenses } from "../../contexts/expense-context"
import { AddExpenseDialog } from "./add-expense-dialog"
import { EditExpenseDialog } from "./edit-expense-dialog"
import { formatDistanceToNow } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ExpensesTab() {
  const { expenses, deleteExpense, categories } = useExpenses()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<string | null>(null)

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || expense.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleDeleteExpense = (id: string) => {
    if (confirm("Are you sure you want to delete this expense?")) {
      deleteExpense(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Expenses</h1>
          <p className="text-gray-400">Manage your expense entries</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Expense
        </Button>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48 bg-gray-700 border-gray-600 text-white">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="all" className="text-white">
                  All Categories
                </SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category} className="text-white">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredExpenses.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No expenses found matching your criteria.</div>
            ) : (
              filteredExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-700/50 hover:bg-gray-700/70 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-white">{expense.description}</p>
                      {expense.recurring && (
                        <Badge variant="secondary" className="text-xs bg-purple-600/20 text-purple-300">
                          Recurring
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>{expense.category}</span>
                      <span>•</span>
                      <span>{new Date(expense.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{formatDistanceToNow(new Date(expense.date), { addSuffix: true })}</span>
                      {expense.tags.length > 0 && (
                        <>
                          <span>•</span>
                          <div className="flex gap-1">
                            {expense.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs bg-gray-600 text-gray-300">
                                #{tag}
                              </Badge>
                            ))}
                            {expense.tags.length > 2 && (
                              <Badge variant="secondary" className="text-xs bg-gray-600 text-gray-300">
                                +{expense.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-semibold text-red-400 text-lg">-${expense.amount.toFixed(2)}</p>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingExpense(expense.id)}
                        className="text-gray-400 hover:text-white"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="text-gray-400 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <AddExpenseDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />

      {editingExpense && (
        <EditExpenseDialog
          expenseId={editingExpense}
          open={!!editingExpense}
          onOpenChange={(open) => !open && setEditingExpense(null)}
        />
      )}
    </div>
  )
}
