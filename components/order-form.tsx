"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { MapPin, User, Phone, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Service {
  id: string
  name: string
  basePrice: number
  pricePerKm: number
}

interface OrderFormProps {
  selectedService: string
  services: Service[]
  userLocation: { lat: number; lng: number } | null
}

export default function OrderForm({ selectedService, services, userLocation }: OrderFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [estimatedCost, setEstimatedCost] = useState(0)
  const [estimatedTime, setEstimatedTime] = useState(0)
  const [distance, setDistance] = useState(0)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    pickup: "",
    destination: "",
    passengerName: "",
    passengerPhone: "",
    notes: "",
    paymentMethod: "cash",
  })

  const currentService = services.find((s) => s.id === selectedService)

  useEffect(() => {
    if (formData.pickup && formData.destination && currentService) {
      calculateEstimate()
    }
  }, [formData.pickup, formData.destination, selectedService])

  const calculateEstimate = async () => {
    if (!window.google || !formData.pickup || !formData.destination) return

    try {
      const service = new window.google.maps.DistanceMatrixService()

      service.getDistanceMatrix(
        {
          origins: [formData.pickup],
          destinations: [formData.destination],
          travelMode: window.google.maps.TravelMode.DRIVING,
          unitSystem: window.google.maps.UnitSystem.METRIC,
        },
        (response: any, status: any) => {
          if (status === "OK" && response.rows[0].elements[0].status === "OK") {
            const distanceInKm = response.rows[0].elements[0].distance.value / 1000
            const durationInMinutes = response.rows[0].elements[0].duration.value / 60

            setDistance(distanceInKm)
            setEstimatedTime(Math.ceil(durationInMinutes))

            if (currentService) {
              const cost = currentService.basePrice + distanceInKm * currentService.pricePerKm
              setEstimatedCost(Math.ceil(cost))
            }
          }
        },
      )
    } catch (error) {
      console.error("Error calculating distance:", error)
      // Fallback calculation
      const estimatedDistance = 5 // km
      setDistance(estimatedDistance)
      setEstimatedTime(15)
      if (currentService) {
        const cost = currentService.basePrice + estimatedDistance * currentService.pricePerKm
        setEstimatedCost(cost)
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError("")
    setSuccess("")
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    // Validation
    if (!formData.pickup || !formData.destination) {
      setError("Lokasi penjemputan dan tujuan harus diisi")
      setIsLoading(false)
      return
    }

    if (!formData.passengerName || !formData.passengerPhone) {
      setError("Nama dan nomor telepon harus diisi")
      setIsLoading(false)
      return
    }

    try {
      // Simulate order creation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const orderData = {
        id: "ORDER-" + Date.now(),
        service: currentService?.name,
        pickup: formData.pickup,
        destination: formData.destination,
        passengerName: formData.passengerName,
        passengerPhone: formData.passengerPhone,
        notes: formData.notes,
        paymentMethod: formData.paymentMethod,
        estimatedCost,
        estimatedTime,
        distance,
        status: "searching_driver",
        createdAt: new Date().toISOString(),
      }

      // Save to localStorage for demo
      const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]")
      existingOrders.push(orderData)
      localStorage.setItem("orders", JSON.stringify(existingOrders))

      setSuccess("Pesanan berhasil dibuat! Mencari driver terdekat...")

      // Redirect to order tracking after 3 seconds
      setTimeout(() => {
        window.location.href = `/order-tracking/${orderData.id}`
      }, 3000)
    } catch (error) {
      console.error("Order creation error:", error)
      setError("Gagal membuat pesanan. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center text-purple-800">
          <MapPin className="h-5 w-5 mr-2" />
          Pesan {currentService?.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert className="mb-4 border-red-200 bg-red-50">
            <AlertDescription className="text-red-600">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 border-green-200 bg-green-50">
            <AlertDescription className="text-green-600">{success}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Location Fields */}
          <div className="space-y-2">
            <Label htmlFor="pickup">Lokasi Penjemputan</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="pickup"
                name="pickup"
                type="text"
                placeholder="Masukkan alamat penjemputan"
                value={formData.pickup}
                onChange={handleInputChange}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination">Tujuan</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="destination"
                name="destination"
                type="text"
                placeholder="Masukkan alamat tujuan"
                value={formData.destination}
                onChange={handleInputChange}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Passenger Info */}
          <div className="space-y-2">
            <Label htmlFor="passengerName">Nama Penumpang</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="passengerName"
                name="passengerName"
                type="text"
                placeholder="Nama lengkap"
                value={formData.passengerName}
                onChange={handleInputChange}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="passengerPhone">Nomor Telepon</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="passengerPhone"
                name="passengerPhone"
                type="tel"
                placeholder="08xxxxxxxxxx"
                value={formData.passengerPhone}
                onChange={handleInputChange}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Catatan (Opsional)</Label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
              <Textarea
                id="notes"
                name="notes"
                placeholder="Catatan tambahan untuk driver"
                value={formData.notes}
                onChange={handleInputChange}
                className="pl-10 min-h-[80px]"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Metode Pembayaran</Label>
            <Select onValueChange={(value) => handleSelectChange("paymentMethod", value)} defaultValue="cash">
              <SelectTrigger>
                <SelectValue placeholder="Pilih metode pembayaran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Tunai</SelectItem>
                <SelectItem value="gopay">GoPay</SelectItem>
                <SelectItem value="ovo">OVO</SelectItem>
                <SelectItem value="dana">DANA</SelectItem>
                <SelectItem value="credit_card">Kartu Kredit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Estimate */}
          {estimatedCost > 0 && (
            <div className="bg-purple-50 p-4 rounded-lg space-y-2">
              <h4 className="font-semibold text-purple-800">Estimasi Perjalanan</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Jarak</p>
                  <p className="font-semibold">{distance.toFixed(1)} km</p>
                </div>
                <div>
                  <p className="text-gray-600">Waktu</p>
                  <p className="font-semibold">{estimatedTime} menit</p>
                </div>
                <div>
                  <p className="text-gray-600">Biaya</p>
                  <p className="font-semibold text-purple-600">Rp {estimatedCost.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Memproses...
              </div>
            ) : (
              `Pesan ${currentService?.name}`
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
