"use client"

import { useState, useEffect } from "react"
import {
  Car,
  DollarSign,
  Clock,
  Star,
  Phone,
  MessageCircle,
  CheckCircle,
  X,
  Navigation,
  TrendingUp,
  Battery,
  Wifi,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import MapComponent from "@/components/map-component"
import { getStoredUser, clearAuth } from "@/lib/auth"

interface Order {
  id: string
  customerName: string
  customerPhone: string
  customerPhoto: string
  pickup: string
  destination: string
  service: string
  estimatedCost: number
  distance: number
  estimatedTime: number
  status: string
  createdAt: string
  pickupCoords: { lat: number; lng: number }
  destinationCoords: { lat: number; lng: number }
}

export default function DriverDashboard() {
  const [isOnline, setIsOnline] = useState(false)
  const [activeOrder, setActiveOrder] = useState<Order | null>(null)
  const [availableOrders, setAvailableOrders] = useState<Order[]>([])
  const [todayEarnings, setTodayEarnings] = useState(125000)
  const [todayTrips, setTodayTrips] = useState(8)
  const [rating, setRating] = useState(4.8)
  const [completionRate, setCompletionRate] = useState(95)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    setUser(getStoredUser())

    // Get driver location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        () => {
          setUserLocation({ lat: -6.2088, lng: 106.8456 })
        },
      )
    }

    // Load available orders when online
    if (isOnline) {
      loadAvailableOrders()
    }
  }, [isOnline])

  const loadAvailableOrders = () => {
    const mockOrders: Order[] = [
      {
        id: "ORDER-1",
        customerName: "Budi Santoso",
        customerPhone: "081234567890",
        customerPhoto: "/placeholder.svg?height=40&width=40",
        pickup: "Mall Tasikmalaya",
        destination: "Perumahan Griya Asri",
        service: "ride",
        estimatedCost: 15000,
        distance: 3.2,
        estimatedTime: 18,
        status: "waiting_driver",
        createdAt: new Date().toISOString(),
        pickupCoords: { lat: -7.3274, lng: 108.2207 },
        destinationCoords: { lat: -7.3374, lng: 108.2307 },
      },
      {
        id: "ORDER-2",
        customerName: "Siti Nurhaliza",
        customerPhone: "081234567891",
        customerPhoto: "/placeholder.svg?height=40&width=40",
        pickup: "Stasiun Tasikmalaya",
        destination: "Hotel Santika",
        service: "car",
        estimatedCost: 25000,
        distance: 2.8,
        estimatedTime: 15,
        status: "waiting_driver",
        createdAt: new Date().toISOString(),
        pickupCoords: { lat: -7.3174, lng: 108.2107 },
        destinationCoords: { lat: -7.3274, lng: 108.2207 },
      },
    ]

    setAvailableOrders(mockOrders)
  }

  const handleAcceptOrder = (order: Order) => {
    setActiveOrder({ ...order, status: "accepted" })
    setAvailableOrders((prev) => prev.filter((o) => o.id !== order.id))

    // Simulate driver navigation
    setTimeout(() => {
      if (activeOrder) {
        setActiveOrder((prev) => prev && { ...prev, status: "arrived_pickup" })
      }
    }, 30000) // 30 seconds
  }

  const handleRejectOrder = (orderId: string) => {
    setAvailableOrders((prev) => prev.filter((o) => o.id !== orderId))
  }

  const handleCompletePickup = () => {
    if (activeOrder) {
      setActiveOrder({ ...activeOrder, status: "on_the_way" })
    }
  }

  const handleCompleteDelivery = () => {
    if (activeOrder) {
      setTodayEarnings((prev) => prev + activeOrder.estimatedCost)
      setTodayTrips((prev) => prev + 1)
      setActiveOrder(null)
    }
  }

  const handleLogout = () => {
    clearAuth()
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Status Bar */}
      <div className="bg-black text-white px-4 py-1 text-xs flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span>16:42</span>
        </div>
        <div className="flex items-center space-x-1">
          <Wifi className="h-3 w-3" />
          <div className="flex space-x-1">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-1 h-3 bg-white rounded-full"></div>
            ))}
          </div>
          <Battery className="h-3 w-3" />
          <span>100%</span>
        </div>
      </div>

      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-white text-purple-600 p-2 rounded-lg">
                <Car className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Driver Mode</h1>
                <p className="text-sm text-purple-100">Halo, {user?.name || "Driver"}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Status</span>
                <Switch
                  checked={isOnline}
                  onCheckedChange={setIsOnline}
                  className="data-[state=checked]:bg-green-500"
                />
                <span className={`text-sm font-medium ${isOnline ? "text-green-300" : "text-red-300"}`}>
                  {isOnline ? "Online" : "Offline"}
                </span>
              </div>
              <Button size="sm" variant="outline" onClick={handleLogout} className="border-white text-white">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Pendapatan Hari Ini</p>
                  <p className="text-2xl font-bold">Rp {todayEarnings.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Trip Hari Ini</p>
                  <p className="text-2xl font-bold">{todayTrips}</p>
                </div>
                <Car className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Rating</p>
                  <p className="text-2xl font-bold">{rating}</p>
                </div>
                <Star className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Completion Rate</p>
                  <p className="text-2xl font-bold">{completionRate}%</p>
                </div>
                <TrendingUp className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Order */}
        {activeOrder && (
          <Card className="mb-6 border-l-4 border-l-purple-500 shadow-lg">
            <CardHeader className="bg-purple-50">
              <CardTitle className="text-purple-800 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Pesanan Aktif - {activeOrder.id}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {/* Customer Info */}
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <img
                      src={activeOrder.customerPhoto || "/placeholder.svg"}
                      alt={activeOrder.customerName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold">{activeOrder.customerName}</h4>
                      <p className="text-sm text-gray-600">{activeOrder.customerPhone}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Trip Details */}
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Penjemputan</p>
                        <p className="text-sm text-gray-600">{activeOrder.pickup}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Tujuan</p>
                        <p className="text-sm text-gray-600">{activeOrder.destination}</p>
                      </div>
                    </div>
                  </div>

                  {/* Trip Stats */}
                  <div className="grid grid-cols-3 gap-4 p-4 bg-purple-50 rounded-lg">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Jarak</p>
                      <p className="font-bold">{activeOrder.distance} km</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Estimasi</p>
                      <p className="font-bold">{activeOrder.estimatedTime} min</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Tarif</p>
                      <p className="font-bold text-green-600">Rp {activeOrder.estimatedCost.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                      <Navigation className="h-4 w-4 mr-2" />
                      Buka Maps
                    </Button>
                    {activeOrder.status === "accepted" ? (
                      <Button onClick={handleCompletePickup} className="flex-1 bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Jemput Penumpang
                      </Button>
                    ) : (
                      <Button onClick={handleCompleteDelivery} className="flex-1 bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Selesai Antar
                      </Button>
                    )}
                  </div>
                </div>

                {/* Map */}
                <div className="h-80 bg-gray-200 rounded-lg overflow-hidden">
                  <MapComponent
                    userLocation={userLocation}
                    destination={activeOrder.destinationCoords}
                    showRoute={true}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Available Orders or Offline State */}
        {isOnline && !activeOrder ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Pesanan Tersedia</span>
                <Badge className="bg-green-100 text-green-800">{availableOrders.length} pesanan</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {availableOrders.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Menunggu Pesanan</h3>
                  <p className="text-gray-500">Pesanan baru akan muncul di sini</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {availableOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={order.customerPhoto || "/placeholder.svg"}
                            alt={order.customerName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <h4 className="font-semibold">{order.customerName}</h4>
                            <Badge className="bg-purple-100 text-purple-800 text-xs">
                              {order.service === "ride" ? "MaxRide" : "MaxCar"}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">Rp {order.estimatedCost.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">
                            {order.distance} km • {order.estimatedTime} min
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <p className="text-sm">{order.pickup}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <p className="text-sm">{order.destination}</p>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRejectOrder(order.id)}
                          className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Tolak
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleAcceptOrder(order)}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Terima
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ) : !isOnline ? (
          <Card className="text-center py-12">
            <CardContent>
              <Car className="h-20 w-20 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-600 mb-2">Anda Sedang Offline</h3>
              <p className="text-gray-500 mb-6">Aktifkan status online untuk menerima pesanan</p>
              <Button
                onClick={() => setIsOnline(true)}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 px-8 py-3"
              >
                Mulai Bekerja
              </Button>
            </CardContent>
          </Card>
        ) : null}

        {/* Tabs for History and Earnings */}
        <Tabs defaultValue="today" className="mt-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="today">Hari Ini</TabsTrigger>
            <TabsTrigger value="week">Minggu Ini</TabsTrigger>
            <TabsTrigger value="month">Bulan Ini</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Riwayat Trip Hari Ini</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">Trip #{i}</p>
                          <p className="text-sm text-gray-600">Sudirman - Senayan</p>
                          <p className="text-xs text-gray-500">14:30 - 14:45</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">Rp 15.000</p>
                          <Badge className="bg-green-100 text-green-800 text-xs">Selesai</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Hari Ini</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Completion Rate</span>
                      <span>{completionRate}%</span>
                    </div>
                    <Progress value={completionRate} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Customer Rating</span>
                      <span>{rating}/5.0</span>
                    </div>
                    <Progress value={(rating / 5) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Online Time</span>
                      <span>6.5 jam</span>
                    </div>
                    <Progress value={81} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="week">
            <Card>
              <CardHeader>
                <CardTitle>Ringkasan Minggu Ini</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg">
                    <p className="text-sm opacity-90">Total Pendapatan</p>
                    <p className="text-3xl font-bold">Rp 875.000</p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg">
                    <p className="text-sm opacity-90">Total Trip</p>
                    <p className="text-3xl font-bold">42</p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg">
                    <p className="text-sm opacity-90">Jam Online</p>
                    <p className="text-3xl font-bold">35.5</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="month">
            <Card>
              <CardHeader>
                <CardTitle>Ringkasan Bulan Ini</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg">
                    <p className="text-sm opacity-90">Total Pendapatan</p>
                    <p className="text-3xl font-bold">Rp 3.250.000</p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg">
                    <p className="text-sm opacity-90">Total Trip</p>
                    <p className="text-3xl font-bold">156</p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg">
                    <p className="text-sm opacity-90">Jam Online</p>
                    <p className="text-3xl font-bold">142</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
