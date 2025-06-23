"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Search, Filter, Star, Clock, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Restaurant {
  id: string
  name: string
  image: string
  rating: number
  deliveryTime: string
  deliveryFee: number
  category: string
  distance: number
  isOpen: boolean
  description: string
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("distance")
  const [isLoading, setIsLoading] = useState(false)

  const categories = [
    { value: "all", label: "Semua" },
    { value: "indonesian", label: "Indonesia" },
    { value: "fast_food", label: "Fast Food" },
    { value: "chinese", label: "Chinese" },
    { value: "western", label: "Western" },
    { value: "drinks", label: "Minuman" },
    { value: "dessert", label: "Dessert" },
  ]

  const sortOptions = [
    { value: "distance", label: "Terdekat" },
    { value: "rating", label: "Rating Tertinggi" },
    { value: "delivery_time", label: "Tercepat" },
    { value: "delivery_fee", label: "Ongkir Termurah" },
  ]

  useEffect(() => {
    // Mock data
    const mockRestaurants: Restaurant[] = [
      {
        id: "1",
        name: "Warung Padang Sederhana",
        image: "/placeholder.svg?height=200&width=300",
        rating: 4.5,
        deliveryTime: "15-25 min",
        deliveryFee: 3000,
        category: "indonesian",
        distance: 1.2,
        isOpen: true,
        description: "Warung Padang dengan cita rasa autentik",
      },
      {
        id: "2",
        name: "McDonald's",
        image: "/placeholder.svg?height=200&width=300",
        rating: 4.2,
        deliveryTime: "20-30 min",
        deliveryFee: 5000,
        category: "fast_food",
        distance: 2.1,
        isOpen: true,
        description: "Fast food restaurant dengan menu internasional",
      },
      {
        id: "3",
        name: "Bakmi GM",
        image: "/placeholder.svg?height=200&width=300",
        rating: 4.7,
        deliveryTime: "25-35 min",
        deliveryFee: 4000,
        category: "chinese",
        distance: 1.8,
        isOpen: false,
        description: "Bakmi dan masakan Chinese terbaik",
      },
      {
        id: "4",
        name: "Starbucks",
        image: "/placeholder.svg?height=200&width=300",
        rating: 4.3,
        deliveryTime: "10-20 min",
        deliveryFee: 6000,
        category: "drinks",
        distance: 0.8,
        isOpen: true,
        description: "Kopi dan minuman premium",
      },
      {
        id: "5",
        name: "Ayam Geprek Bensu",
        image: "/placeholder.svg?height=200&width=300",
        rating: 4.4,
        deliveryTime: "20-30 min",
        deliveryFee: 3500,
        category: "indonesian",
        distance: 1.5,
        isOpen: true,
        description: "Ayam geprek pedas dengan sambal mantap",
      },
      {
        id: "6",
        name: "Pizza Hut",
        image: "/placeholder.svg?height=200&width=300",
        rating: 4.1,
        deliveryTime: "30-40 min",
        deliveryFee: 7000,
        category: "western",
        distance: 3.2,
        isOpen: true,
        description: "Pizza dan pasta dengan cita rasa Italia",
      },
    ]

    setRestaurants(mockRestaurants)
  }, [])

  useEffect(() => {
    let filtered = restaurants

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (restaurant) =>
          restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          restaurant.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((restaurant) => restaurant.category === selectedCategory)
    }

    // Sort results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating
        case "delivery_time":
          return Number.parseInt(a.deliveryTime) - Number.parseInt(b.deliveryTime)
        case "delivery_fee":
          return a.deliveryFee - b.deliveryFee
        case "distance":
        default:
          return a.distance - b.distance
      }
    })

    setFilteredRestaurants(filtered)
  }, [restaurants, searchQuery, selectedCategory, sortBy])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search is handled by useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Cari restoran atau makanan..."
                  className="pl-10 pr-4"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search Results */}
        <div className="mb-4">
          <p className="text-gray-600">
            {searchQuery
              ? `Menampilkan ${filteredRestaurants.length} hasil untuk "${searchQuery}"`
              : `Menampilkan ${filteredRestaurants.length} restoran`}
          </p>
        </div>

        {/* Restaurant List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <Card key={restaurant.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative">
                <img
                  src={restaurant.image || "/placeholder.svg"}
                  alt={restaurant.name}
                  className="w-full h-48 object-cover"
                />
                {!restaurant.isOpen && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-semibold">Tutup</span>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-white text-black">
                    {restaurant.distance} km
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4">
                <h4 className="font-semibold text-lg mb-2">{restaurant.name}</h4>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{restaurant.description}</p>

                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{restaurant.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{restaurant.deliveryTime}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Ongkir: Rp {restaurant.deliveryFee.toLocaleString()}</span>
                  <Badge variant="outline">{categories.find((cat) => cat.value === restaurant.category)?.label}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredRestaurants.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Tidak ada hasil ditemukan</h3>
            <p className="text-gray-500 mb-4">Coba ubah kata kunci atau filter pencarian Anda</p>
            <Button onClick={() => setSearchQuery("")}>Reset Pencarian</Button>
          </div>
        )}
      </div>
    </div>
  )
}
