"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft, Star, Clock, MapPin, Plus, Minus, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  isAvailable: boolean
}

interface Restaurant {
  id: string
  name: string
  image: string
  rating: number
  deliveryTime: string
  deliveryFee: number
  address: string
  phone: string
  isOpen: boolean
}

export default function RestaurantPage() {
  const params = useParams()
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [cart, setCart] = useState<{ [key: string]: number }>({})
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    // Simulasi data restoran dan menu
    const mockRestaurant: Restaurant = {
      id: params.id as string,
      name: "Warung Padang Sederhana",
      image: "/placeholder.svg?height=300&width=600",
      rating: 4.5,
      deliveryTime: "15-25 min",
      deliveryFee: 3000,
      address: "Jl. Sudirman No. 123, Jakarta Selatan",
      phone: "021-12345678",
      isOpen: true,
    }

    const mockMenuItems: MenuItem[] = [
      {
        id: "1",
        name: "Nasi Rendang",
        description: "Nasi putih dengan rendang daging sapi yang empuk dan bumbu rempah khas Padang",
        price: 25000,
        image: "/placeholder.svg?height=150&width=200",
        category: "main",
        isAvailable: true,
      },
      {
        id: "2",
        name: "Ayam Pop",
        description: "Ayam goreng khas Padang dengan bumbu kuning yang gurih",
        price: 20000,
        image: "/placeholder.svg?height=150&width=200",
        category: "main",
        isAvailable: true,
      },
      {
        id: "3",
        name: "Gulai Kambing",
        description: "Gulai kambing dengan kuah santan yang kental dan rempah yang kaya",
        price: 35000,
        image: "/placeholder.svg?height=150&width=200",
        category: "main",
        isAvailable: false,
      },
      {
        id: "4",
        name: "Es Teh Manis",
        description: "Teh manis dingin yang menyegarkan",
        price: 5000,
        image: "/placeholder.svg?height=150&width=200",
        category: "drinks",
        isAvailable: true,
      },
      {
        id: "5",
        name: "Kerupuk",
        description: "Kerupuk renyah sebagai pelengkap",
        price: 3000,
        image: "/placeholder.svg?height=150&width=200",
        category: "snacks",
        isAvailable: true,
      },
    ]

    setRestaurant(mockRestaurant)
    setMenuItems(mockMenuItems)
  }, [params.id])

  const categories = [
    { id: "all", name: "Semua" },
    { id: "main", name: "Makanan Utama" },
    { id: "drinks", name: "Minuman" },
    { id: "snacks", name: "Snack" },
  ]

  const filteredMenuItems =
    selectedCategory === "all" ? menuItems : menuItems.filter((item) => item.category === selectedCategory)

  const addToCart = (itemId: string) => {
    setCart((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }))
  }

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const newCart = { ...prev }
      if (newCart[itemId] > 1) {
        newCart[itemId]--
      } else {
        delete newCart[itemId]
      }
      return newCart
    })
  }

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, quantity) => sum + quantity, 0)
  }

  const getTotalPrice = () => {
    return Object.entries(cart).reduce((total, [itemId, quantity]) => {
      const item = menuItems.find((item) => item.id === itemId)
      return total + (item ? item.price * quantity : 0)
    }, 0)
  }

  if (!restaurant) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-lg font-semibold">{restaurant.name}</h1>
            </div>

            {getTotalItems() > 0 && (
              <Button className="relative">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Keranjang ({getTotalItems()})<Badge className="ml-2">Rp {getTotalPrice().toLocaleString()}</Badge>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Restaurant Info */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={restaurant.image || "/placeholder.svg"}
              alt={restaurant.name}
              className="w-full md:w-1/3 h-64 object-cover rounded-lg"
            />

            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-3xl font-bold">{restaurant.name}</h2>
                {restaurant.isOpen ? (
                  <Badge className="bg-green-100 text-green-800">Buka</Badge>
                ) : (
                  <Badge variant="destructive">Tutup</Badge>
                )}
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{restaurant.rating}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{restaurant.deliveryTime}</span>
                </div>
                <div>Ongkir: Rp {restaurant.deliveryFee.toLocaleString()}</div>
              </div>

              <div className="flex items-start space-x-2 text-sm text-gray-600 mb-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{restaurant.address}</span>
              </div>

              <div className="text-sm text-gray-600">Telepon: {restaurant.phone}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Categories */}
      <section className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex space-x-4 overflow-x-auto">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                className="whitespace-nowrap"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Items */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {filteredMenuItems.map((item) => (
              <Card key={item.id} className={`${!item.isAvailable ? "opacity-50" : ""}`}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                    />

                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                      <p className="font-bold text-lg text-green-600">Rp {item.price.toLocaleString()}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      {item.isAvailable ? (
                        cart[item.id] ? (
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline" onClick={() => removeFromCart(item.id)}>
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center">{cart[item.id]}</span>
                            <Button size="sm" onClick={() => addToCart(item.id)}>
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button size="sm" onClick={() => addToCart(item.id)}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        )
                      ) : (
                        <Badge variant="secondary">Habis</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Floating Cart Button */}
      {getTotalItems() > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-50">
          <Button className="w-full py-4 text-lg font-semibold">
            Lanjut ke Checkout • {getTotalItems()} item • Rp {getTotalPrice().toLocaleString()}
          </Button>
        </div>
      )}
    </div>
  )
}
