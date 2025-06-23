"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Bike, DollarSign, Clock, Star, MapPin, Phone, Navigation, CheckCircle } from "lucide-react"

interface DriverStats {
  todayEarnings: number
  todayDeliveries: number
  avgRating: number
  totalDistance: number
}

interface DeliveryOrder {
  id: string
  customerName: string
  customerPhone: string
  merchantName: string
  merchantAddress: string
  deliveryAddress: string
  items: string[]
  total: number
  deliveryFee: number
  status: string
  distance: number
  estimatedTime: number
}

export default function DriverDashboard() {
  const [stats, setStats] = useState<DriverStats>({
    todayEarnings: 0,
    todayDeliveries: 0,
    avgRating: 0,
    totalDistance: 0,
  })
  const [availableOrders, setAvailableOrders] = useState<DeliveryOrder[]>([])
  const [activeOrder, setActiveOrder] = useState<DeliveryOrder | null>(null)
  const [isOnline, setIsOnline] = useState(false)

  useEffect(() => {
    // Simulasi data driver
    setStats({
      todayEarnings: 125000,
      todayDeliveries: 8,
      avgRating: 4.8,
      totalDistance: 45.2,
    })

    setAvailableOrders([
      {
        id: "ORD001",
        customerName: "John Doe",
        customerPhone: "081234567890",
        merchantName: "Warung Padang Sederhana",
        merchantAddress: "Jl. Sudirman No. 123",
        deliveryAddress: "Jl. Kebon Jeruk No. 456",
        items: ["Nasi Rendang", "Es Teh Manis"],
        total: 30000,
        deliveryFee: 5000,
        status: "ready_for_pickup",
        distance: 2.5,
        estimatedTime: 15,
      },
      {
        id: "ORD002",
        customerName: "Jane Smith",
        customerPhone: "081234567891",
        merchantName: "McDonald's",
        merchantAddress: "Jl. Thamrin No. 789",
        deliveryAddress: "Jl. Gatot Subroto No. 321",
        items: ["Big Mac", "French Fries", "Coca Cola"],
        total: 85000,
        deliveryFee: 7000,
        status: "ready_for_pickup",
        distance: 3.2,
        estimatedTime: 20,
      },
    ])
  }, [])

  const handleAcceptOrder = (order: DeliveryOrder) => {
    setActiveOrder(order)
    setAvailableOrders((prev) => prev.filter((o) => o.id !== order.id))
  }

  const handleCompletePickup = () => {
    if (activeOrder) {
      setActiveOrder({
        ...activeOrder,
        status: "on_the_way",
      })
    }
  }

  const handleCompleteDelivery = () => {
    if (activeOrder) {
      setStats((prev) => ({
        ...prev,
        todayEarnings: prev.todayEarnings + activeOrder.deliveryFee,
        todayDeliveries: prev.todayDeliveries + 1,
        totalDistance: prev.totalDistance + activeOrder.distance,
      }))
      setActiveOrder(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-green-600">Ahmad Rizki</h1>
              <p className="text-sm text-gray-600">Driver Dashboard</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Status</span>
                <Switch checked={isOnline} onCheckedChange={setIsOnline} />
                <span className={`text-sm font-medium ${isOnline ? "text-green-600" : "text-red-600"}`}>
                  {isOnline ? "Online" : "Offline"}
                </span>
              </div>
              <Button size="sm">Logout</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendapatan Hari Ini</p>
                  <p className="text-3xl font-bold">Rp {stats.todayEarnings.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pengantaran Hari Ini</p>
                  <p className="text-3xl font-bold">{stats.todayDeliveries}</p>
                </div>
                <Bike className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rating</p>
                  <p className="text-3xl font-bold">{stats.avgRating}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Jarak Tempuh</p>
                  <p className="text-3xl font-bold">{stats.totalDistance} km</p>
                </div>
                <Navigation className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Order */}
        {activeOrder && (
          <Card className="mb-8 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800">Pesanan Aktif</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Informasi Pesanan</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>ID:</strong> #{activeOrder.id}
                    </p>
                    <p>
                      <strong>Merchant:</strong> {activeOrder.merchantName}
                    </p>
                    <p>
                      <strong>Items:</strong> {activeOrder.items.join(", ")}
                    </p>
                    <p>
                      <strong>Total:</strong> Rp {activeOrder.total.toLocaleString()}
                    </p>
                    <p>
                      <strong>Ongkir:</strong> Rp {activeOrder.deliveryFee.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Informasi Pelanggan</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Nama:</strong> {activeOrder.customerName}
                    </p>
                    <p>
                      <strong>Telepon:</strong> {activeOrder.customerPhone}
                    </p>
                    <p>
                      <strong>Alamat:</strong> {activeOrder.deliveryAddress}
                    </p>
                    <p>
                      <strong>Jarak:</strong> {activeOrder.distance} km
                    </p>
                    <p>
                      <strong>Estimasi:</strong> {activeOrder.estimatedTime} menit
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button className="flex-1">
                  <MapPin className="h-4 w-4 mr-2" />
                  Buka Maps
                </Button>
                <Button variant="outline">
                  <Phone className="h-4 w-4 mr-2" />
                  Hubungi Pelanggan
                </Button>
                {activeOrder.status === "ready_for_pickup" ? (
                  <Button onClick={handleCompletePickup} className="bg-blue-600 hover:bg-blue-700">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Pesanan Diambil
                  </Button>
                ) : (
                  <Button onClick={handleCompleteDelivery} className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Selesai Antar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Available Orders */}
        {isOnline && !activeOrder && (
          <Card>
            <CardHeader>
              <CardTitle>Pesanan Tersedia</CardTitle>
            </CardHeader>
            <CardContent>
              {availableOrders.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Tidak ada pesanan tersedia saat ini</p>
                  <p className="text-sm text-gray-500">Pesanan baru akan muncul di sini</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {availableOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-semibold">#{order.id}</h4>
                          <p className="text-sm text-gray-600">{order.merchantName}</p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">Rp {order.deliveryFee.toLocaleString()}</Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium">Ambil dari:</p>
                          <p className="text-sm text-gray-600">{order.merchantAddress}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Antar ke:</p>
                          <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{order.distance} km</span>
                          <span>~{order.estimatedTime} menit</span>
                          <span>Total: Rp {order.total.toLocaleString()}</span>
                        </div>
                        <Button onClick={() => handleAcceptOrder(order)}>Terima Pesanan</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Offline State */}
        {!isOnline && (
          <Card>
            <CardContent className="text-center py-12">
              <Bike className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Anda Sedang Offline</h3>
              <p className="text-gray-500 mb-4">Aktifkan status online untuk menerima pesanan pengantaran</p>
              <Button onClick={() => setIsOnline(true)}>Mulai Bekerja</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
