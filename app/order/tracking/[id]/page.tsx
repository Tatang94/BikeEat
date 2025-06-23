"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft, MapPin, Clock, Phone, MessageCircle, CheckCircle, Truck, ChefHat, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface OrderStatus {
  id: string
  status: "confirmed" | "preparing" | "ready" | "picked_up" | "on_the_way" | "delivered"
  timestamp: string
  description: string
}

interface Driver {
  id: string
  name: string
  phone: string
  rating: number
  vehicleNumber: string
  photo: string
}

export default function OrderTrackingPage() {
  const params = useParams()
  const [orderStatuses, setOrderStatuses] = useState<OrderStatus[]>([])
  const [currentStatus, setCurrentStatus] = useState<string>("confirmed")
  const [driver, setDriver] = useState<Driver | null>(null)
  const [estimatedTime, setEstimatedTime] = useState(20)

  useEffect(() => {
    // Simulasi data tracking
    const mockStatuses: OrderStatus[] = [
      {
        id: "1",
        status: "confirmed",
        timestamp: "14:30",
        description: "Pesanan dikonfirmasi oleh restoran",
      },
      {
        id: "2",
        status: "preparing",
        timestamp: "14:32",
        description: "Restoran sedang menyiapkan pesanan",
      },
    ]

    const mockDriver: Driver = {
      id: "1",
      name: "Ahmad Rizki",
      phone: "081234567890",
      rating: 4.8,
      vehicleNumber: "B 1234 XYZ",
      photo: "/placeholder.svg?height=100&width=100",
    }

    setOrderStatuses(mockStatuses)
    setDriver(mockDriver)

    // Simulasi update status secara real-time
    const statusUpdates = [
      { status: "ready", delay: 5000, description: "Pesanan siap diambil driver" },
      { status: "picked_up", delay: 8000, description: "Pesanan diambil oleh driver" },
      { status: "on_the_way", delay: 10000, description: "Driver sedang dalam perjalanan" },
    ]

    statusUpdates.forEach(({ status, delay, description }) => {
      setTimeout(() => {
        setCurrentStatus(status)
        setOrderStatuses((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            status: status as any,
            timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
            description,
          },
        ])
        setEstimatedTime((prev) => Math.max(0, prev - 5))
      }, delay)
    })
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-5 w-5" />
      case "preparing":
        return <ChefHat className="h-5 w-5" />
      case "ready":
        return <Package className="h-5 w-5" />
      case "picked_up":
      case "on_the_way":
        return <Truck className="h-5 w-5" />
      case "delivered":
        return <CheckCircle className="h-5 w-5" />
      default:
        return <Clock className="h-5 w-5" />
    }
  }

  const getProgressValue = () => {
    const statusOrder = ["confirmed", "preparing", "ready", "picked_up", "on_the_way", "delivered"]
    const currentIndex = statusOrder.indexOf(currentStatus)
    return ((currentIndex + 1) / statusOrder.length) * 100
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
            <div>
              <h1 className="text-lg font-semibold">Lacak Pesanan</h1>
              <p className="text-sm text-gray-600">#{params.id}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Status Pesanan</CardTitle>
                  <Badge className="bg-green-100 text-green-800">
                    {currentStatus === "confirmed" && "Dikonfirmasi"}
                    {currentStatus === "preparing" && "Sedang Disiapkan"}
                    {currentStatus === "ready" && "Siap Diambil"}
                    {currentStatus === "picked_up" && "Diambil Driver"}
                    {currentStatus === "on_the_way" && "Dalam Perjalanan"}
                    {currentStatus === "delivered" && "Terkirim"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-gray-600">{Math.round(getProgressValue())}%</span>
                  </div>
                  <Progress value={getProgressValue()} className="h-2" />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-blue-800">Estimasi: {estimatedTime} menit lagi</span>
                  </div>
                  <p className="text-sm text-blue-600">Pesanan akan segera sampai di lokasi Anda</p>
                </div>
              </CardContent>
            </Card>

            {/* Driver Info */}
            {driver && currentStatus !== "confirmed" && currentStatus !== "preparing" && (
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Driver</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <img
                      src={driver.photo || "/placeholder.svg"}
                      alt={driver.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{driver.name}</h3>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <span>⭐ {driver.rating}</span>
                        <span>•</span>
                        <span>{driver.vehicleNumber}</span>
                      </div>
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
                </CardContent>
              </Card>
            )}

            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Timeline Pesanan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderStatuses.map((status, index) => (
                    <div key={status.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        {getStatusIcon(status.status)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{status.description}</p>
                        <p className="text-sm text-gray-600">{status.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Detail Pesanan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Warung Padang Sederhana</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>2x Nasi Rendang</span>
                      <span>Rp 50.000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>1x Ayam Pop</span>
                      <span>Rp 20.000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>2x Es Teh Manis</span>
                      <span>Rp 10.000</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>Rp 80.000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ongkos Kirim</span>
                    <span>Rp 3.000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Biaya Layanan</span>
                    <span>Rp 2.000</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>Rp 85.000</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-start space-x-2 text-sm">
                    <MapPin className="h-4 w-4 mt-0.5 text-gray-500" />
                    <div>
                      <p className="font-medium">Alamat Pengantaran:</p>
                      <p className="text-gray-600">Jl. Kebon Jeruk No. 123, Jakarta Barat</p>
                    </div>
                  </div>
                </div>

                <Button className="w-full" variant="outline">
                  Hubungi Customer Service
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
