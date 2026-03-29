"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Heart, MessageCircle, Share2, Plus, Search, Filter, Users, TrendingUp } from "lucide-react"
import { useCommunity } from "../../contexts/community-context"
import { formatDistanceToNow } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

const categories = ["All", "Budgeting", "Savings", "Tracking", "Investment", "Debt", "Goals"]

export function CommunityTab() {
  const { tips, likeTip, addTip, filterByCategory } = useCommunity()
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddTipOpen, setIsAddTipOpen] = useState(false)

  const filteredTips = filterByCategory(selectedCategory.toLowerCase())
    .filter(
      (tip) =>
        tip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tip.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tip.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    .sort((a, b) => b.likes - a.likes)

  const handleAddTip = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const newTip = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      category: formData.get("category") as string,
      author: {
        name: "You",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      tags: (formData.get("tags") as string).split(",").map((tag) => tag.trim()),
    }

    addTip(newTip)
    setIsAddTipOpen(false)
    ;(e.target as HTMLFormElement).reset()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Community Tips</h1>
          <p className="text-gray-400">Learn from others and share your financial wisdom</p>
        </div>
        <Dialog open={isAddTipOpen} onOpenChange={setIsAddTipOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Share Tip
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle>Share Your Financial Tip</DialogTitle>
              <DialogDescription className="text-gray-400">
                Help others by sharing your financial knowledge and experience.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddTip} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tip-title">Title</Label>
                <Input
                  id="tip-title"
                  name="title"
                  placeholder="e.g., How to save $100 monthly"
                  required
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tip-content">Content</Label>
                <Textarea
                  id="tip-content"
                  name="content"
                  placeholder="Share your tip in detail..."
                  required
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tip-category">Category</Label>
                  <Select name="category" required>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      {categories.slice(1).map((category) => (
                        <SelectItem key={category} value={category} className="text-white">
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tip-tags">Tags (comma-separated)</Label>
                  <Input
                    id="tip-tags"
                    name="tags"
                    placeholder="budgeting, savings, tips"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddTipOpen(false)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                  Share Tip
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Tips</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{tips.length}</div>
            <p className="text-xs text-gray-400">Community contributions</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Likes</CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{tips.reduce((sum, tip) => sum + tip.likes, 0)}</div>
            <p className="text-xs text-gray-400">Community appreciation</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Categories</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{categories.length - 1}</div>
            <p className="text-xs text-gray-400">Topic areas</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search tips..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48 bg-gray-700 border-gray-600 text-white">
                <Filter className="w-4 h-4 mr-2" />
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
        </CardHeader>
      </Card>

      {/* Tips List */}
      <div className="space-y-4">
        {filteredTips.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="w-16 h-16 text-gray-600 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No tips found</h3>
              <p className="text-gray-400 text-center">
                {searchTerm || selectedCategory !== "All"
                  ? "Try adjusting your search or filter criteria."
                  : "Be the first to share a financial tip with the community!"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredTips.map((tip) => (
            <Card key={tip.id} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={tip.author.avatar || "/placeholder.svg"} alt={tip.author.name} />
                      <AvatarFallback className="bg-purple-600 text-white">{tip.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg text-white">{tip.title}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span>{tip.author.name}</span>
                        <span>•</span>
                        <span>{formatDistanceToNow(new Date(tip.createdAt), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-purple-600/20 text-purple-300 border-purple-600/30">{tip.category}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">{tip.content}</p>

                {tip.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tip.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => likeTip(tip.id)}
                      className={`text-gray-400 hover:text-red-400 ${tip.isLiked ? "text-red-400" : ""}`}
                    >
                      <Heart className={`w-4 h-4 mr-1 ${tip.isLiked ? "fill-current" : ""}`} />
                      {tip.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-400">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Reply
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-green-400">
                      <Share2 className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
