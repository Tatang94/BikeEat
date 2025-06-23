"use client"

import { useState, useEffect } from "react"
import { MapPin, Car, Bike, Package, Clock, Star, Search, User, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import MapComponent from "@/components/map-component"
import OrderForm from "@/components/order-form"
import { getStoredUser, isAuthenticated, clearAuth } from "@/lib/auth"
import type { JSX } from "react/jsx-runtime"

interface Service {
  id: string
  name: string
  icon: JSX.Element
  description: string
  basePrice: number
  pricePerKm: number
  color: string
}

interface Restaurant {
  id: string
  name: string
  image: string
  rating: number
  deliveryTime: string
  category: string
  distance: string
  isOpen: boolean
}

export default function CustomerDashboard() {
  const [selectedService, setSelectedService] = useState("food")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeOrders, setActiveOrders] = useState<any[]>([])
  const [nearbyRestaurants, setNearbyRestaurants] = useState<Restaurant[]>([])

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = "/"
      return
    }

    setUser(getStoredUser())
    loadActiveOrders()
    loadNearbyRestaurants()

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Error getting location:", error)
          setUserLocation({ lat: -6.2088, lng: 106.8456 })
        },
      )
    }
  }, [])

  const loadActiveOrders = () => {
    const orders = JSON.parse(localStorage.getItem("orders") || "[]")
    const active = orders.filter((order: any) => !["delivered", "cancelled"].includes(order.status))
    setActiveOrders(active)
  }

  const loadNearbyRestaurants = () => {
    const mockRestaurants: Restaurant[] = [
      {
        id: "1",
        name: "Warung Padang Sederhana",
        image: "/placeholder.svg?height=120&width=160",
        rating: 4.5,
        deliveryTime: "15-25 min",
        category: "Padang",
        distance: "0.8 km",
        isOpen: true,
      },
      {
        id: "2",
        name: "McDonald's Tasikmalaya",
        image: "/placeholder.svg?height=120&width=160",
        rating: 4.3,
        deliveryTime: "20-30 min",
        category: "Fast Food",
        distance: "1.2 km",
        isOpen: true,
      },
      {
        id: "3",
        name: "Ayam Geprek Bensu",
        image: "/placeholder.svg?height=120&width=160",
        rating: 4.7,
        deliveryTime: "10-20 min",
        category: "Ayam",
        distance: "0.5 km",
        isOpen: true,
      },
      {
        id: "4",
        name: "Bakso Malang Karapitan",
        image: "/placeholder.svg?height=120&width=160",
        rating: 4.4,
        deliveryTime: "25-35 min",
        category: "Bakso",
        distance: "2.1 km",
        isOpen: false,
      },
    ]
    setNearbyRestaurants(mockRestaurants)
  }

  const services: Service[] = [
    {
      id: "food",
      name: "MaxFood",
      icon: <Package className="h-6 w-6" />,
      description: "Pesan makanan favorit",
      basePrice: 2000,
      pricePerKm: 1500,
      color: "bg-purple-500",
    },
    {
      id: "ride",
      name: "MaxRide",
      icon: <Bike className="h-6 w-6" />,
      description: "Ojek online cepat",
      basePrice: 3000,
      pricePerKm: 2000,
      color: "bg-purple-600",
    },
    {
      id: "car",
      name: "MaxCar",
      icon: <Car className="h-6 w-6" />,
      description: "Mobil untuk perjalanan nyaman",
      basePrice: 8000,
      pricePerKm: 3500,
      color: "bg-purple-700",
    },
  ]

  const handleLogout = () => {
    clearAuth()
    window.location.href = "/"
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-purple-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-2 rounded-lg">
                <span className="text-xl font-bold">M</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-purple-800">MAXIM</h1>
                <div className="flex items-center space-x-1 text-xs text-gray-600">
                  <MapPin className="h-3 w-3" />
                  <span>Tasikmalaya</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/notifications")}>
                <Bell className="h-4 w-4" />
                {activeOrders.length > 0 && (
                  <Badge className="ml-1 h-5 w-5 p-0 text-xs bg-red-500">{activeOrders.length}</Badge>
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:block">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => (window.location.href = "/profile")}>Profil Saya</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => (window.location.href = "/history")}>
                    Riwayat Pesanan
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Active Orders Banner */}
      {activeOrders.length > 0 && (
        <div className="bg-purple-600 text-white py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">Anda memiliki {activeOrders.length} pesanan aktif</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-purple-600"
                onClick={() => (window.location.href = `/order-tracking/${activeOrders[0].id}`)}
              >
                Lihat Status
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <section className="bg-white py-4 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Cari makanan, restoran, atau tujuan..."
              className="pl-10 pr-4 py-3 text-base border-gray-200 focus:border-purple-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-6 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-4">
            {services.map((service) => (
              <Card
                key={service.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedService === service.id ? "ring-2 ring-purple-500 shadow-md" : ""
                }`}
                onClick={() => setSelectedService(service.id)}
              >
                <CardContent className="p-4 text-center">
                  <div
                    className={`${service.color} text-white p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center`}
                  >
                    {service.icon}
                  </div>
                  <h3 className="font-semibold text-sm">{service.name}</h3>
                  <p className="text-xs text-gray-600 mt-1">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {selectedService === "food" ? (
          <div className="space-y-6">
            {/* Nearby Restaurants */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Restoran Terdekat</h2>
                <Button variant="ghost" size="sm" className="text-purple-600">
                  Lihat Semua
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {nearbyRestaurants.map((restaurant) => (
                  <Card
                    key={restaurant.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => (window.location.href = `/restaurant/${restaurant.id}`)}
                  >
                    <div className="relative">
                      <img
                        src={restaurant.image || "/placeholder.svg"}
                        alt={restaurant.name}
                        className="w-full h-32 object-cover rounded-t-lg"
                      />
                      {!restaurant.isOpen && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-t-lg flex items-center justify-center">
                          <Badge variant="secondary" className="bg-red-500 text-white">
                            Tutup
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-base mb-1">{restaurant.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{restaurant.category}</p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{restaurant.rating}</span>
                        </div>
                        <span className="text-gray-600">{restaurant.deliveryTime}</span>
                        <span className="text-gray-600">{restaurant.distance}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Kategori Populer</h2>
              <div className="grid grid-cols-4 gap-4">
                {["Nasi", "Ayam", "Bakso", "Mie", "Soto", "Sate", "Gado-gado", "Lainnya"].map((category) => (
                  <Card key={category} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                      <div className="bg-purple-100 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                        <Package className="h-6 w-6 text-purple-600" />
                      </div>
                      <p className="text-sm font-medium">{category}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Form */}
            <div>
              <OrderForm selectedService={selectedService} services={services} userLocation={userLocation} />
            </div>

            {/* Map */}
            <div>
              <Card className="border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-purple-800">
                    <MapPin className="h-5 w-5 mr-2" />
                    Lokasi Anda
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96 bg-gray-200 rounded-lg overflow-hidden">
                    <MapComponent userLocation={userLocation} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 sm:hidden">
        <div className="flex justify-around">
          <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1">
            <MapPin className="h-4 w-4" />
            <span className="text-xs">Beranda</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1">
            <Search className="h-4 w-4" />
            <span className="text-xs">Cari</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1">
            <Clock className="h-4 w-4" />
            <span className="text-xs">Pesanan</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1">
            <User className="h-4 w-4" />
            <span className="text-xs">Profil</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
