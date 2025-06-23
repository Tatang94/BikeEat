"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft, MapPin, Clock, CheckCircle, Car, Package, Phone, MessageCircle, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface OrderStatus {
  id: string
  status: string
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
  const [currentStatus, setCurrentStatus] = useState<string>("searching_driver")
  const [driver, setDriver] = useState<Driver | null>(null)
  const [estimatedTime, setEstimatedTime] = useState(15)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    // Get user location
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

    // Simulasi data tracking
    const mockStatuses: OrderStatus[] = [
      {
        id: "1",
        status: "searching_driver",
        timestamp: "14:30",
        description: "Mencari driver terdekat",
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

    // Simulasi update status secara real-time
    const statusUpdates = [
      { status: "driver_found", delay: 3000, description: "Driver ditemukan dan menuju lokasi" },
      { status: "driver_arrived", delay: 8000, description: "Driver telah tiba di lokasi penjemputan" },
      { status: "on_the_way", delay: 12000, description: "Perjalanan dimulai" },
    ]

    statusUpdates.forEach(({ status, delay, description }) => {
      setTimeout(() => {
        setCurrentStatus(status)
        setOrderStatuses((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            status,
            timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
            description,
          },
        ])
        setEstimatedTime((prev) => Math.max(0, prev - 3))

        if (status === "driver_found") {
          setDriver(mockDriver)
        }
      }, delay)
    })
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "searching_driver":
        return <Clock className="h-5 w-5" />
      case "driver_found":
        return <Car className="h-5 w-5" />
      case "driver_arrived":
        return <MapPin className="h-5 w-5" />
      case "on_the_way":
        return <Package className="h-5 w-5" />
      case "delivered":
        return <CheckCircle className="h-5 w-5" />
      default:
        return <Clock className="h-5 w-5" />
    }
  }

  const getProgressValue = () => {
    const statusOrder = ["searching_driver", "driver_found", "driver_arrived", "on_the_way", "delivered"]
    const currentIndex = statusOrder.indexOf(currentStatus)
    return ((currentIndex + 1) / statusOrder.length) * 100
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "searching_driver":
        return "Mencari Driver"
      case "driver_found":
        return "Driver Ditemukan"
      case "driver_arrived":
        return "Driver Tiba"
      case "on_the_way":
        return "Dalam Perjalanan"
      case "delivered":
        return "Selesai"
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-yellow-500 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="ghost" size="sm" className="mr-4" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-black">Lacak Pesanan</h1>
              <p className="text-sm text-gray-700">#{params.id}</p>
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
                  <Badge className="bg-yellow-100 text-yellow-800">{getStatusText(currentStatus)}</Badge>
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
                  <p className="text-sm text-blue-600">Driver akan segera tiba di lokasi Anda</p>
                </div>
              </CardContent>
            </Card>

            {/* Driver Info */}
            {driver && currentStatus !== "searching_driver" && (
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Driver</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={driver.photo || "/placeholder.svg"} alt={driver.name} />
                      <AvatarFallback>{driver.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{driver.name}</h3>
                      <div className="flex items-center space-x-1 mb-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{driver.rating}</span>
                      </div>
                      <p className="text-sm text-gray-600">{driver.vehicleNumber}</p>
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

            {/* Map */}
            <Card>
              <CardHeader>
                <CardTitle>Peta Lokasi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Peta akan dimuat di sini</p>
                    <p className="text-sm text-gray-500">Integrasi dengan Google Maps API</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Details */}
            <Card>
              <CardHeader>
                <CardTitle>Detail Pesanan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Layanan</p>
                  <p className="font-semibold">MaxBike</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Dari</p>
                  <p className="font-semibold">Jl. Sudirman No. 123</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ke</p>
                  <p className="font-semibold">Jl. Thamrin No. 456</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Jarak</p>
                  <p className="font-semibold">5.2 km</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Biaya</p>
                  <p className="font-semibold text-lg">Rp 15.000</p>
                </div>
              </CardContent>
            </Card>

            {/* Status Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Timeline Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderStatuses.map((status, index) => (
                    <div key={status.id} className="flex items-start space-x-3">
                      <div
                        className={`p-2 rounded-full ${
                          index === orderStatuses.length - 1
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {getStatusIcon(status.status)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{status.description}</p>
                        <p className="text-sm text-gray-500">{status.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
