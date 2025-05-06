"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface TopBarProps {
  onSearch: (query: string) => void
}

export function TopBar({ onSearch }: TopBarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearch(query)
  }

  return (
    <div className="bg-white border-b border-purple-200 shadow-sm py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-purple-700">Customer Churn Prediction</h1>
        <div className="relative w-64">
          <Input
            type="search"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={handleInputChange}
            className="pr-10"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
    </div>
  )
}
