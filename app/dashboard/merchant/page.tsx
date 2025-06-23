"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { ShoppingCart, DollarSign, Clock, Star, Plus, Edit, Eye } from "lucide-react"

interface MerchantStats {
  todayOrders: number
  todayRevenue: number
  avgRating: number
  totalMenuItems: number
}

interface Order {
  id: string
  customerName: string
  items: string[]
  total: number
  status: string
  createdAt: string
}

interface MenuItem {
  id: string
  name: string
  price: number
  category: string
  isAvailable: boolean
  orders: number
}

export default function MerchantDashboard() {
  const [stats, setStats] = useState<MerchantStats>({
    todayOrders: 0,
    todayRevenue: 0,
    avgRating: 0,
    totalMenuItems: 0,
  })
  const [orders, setOrders] = useState<Order[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [isStoreOpen, setIsStoreOpen] = useState(true)

  useEffect(() => {
    // Simulasi data merchant
    setStats({
      todayOrders: 24,
      todayRevenue: 1250000,
      avgRating: 4.5,
      totalMenuItems: 15,
    })

    setOrders([
      {
        id: "ORD001",
        customerName: "John Doe",
        items: ["Nasi Rendang", "Es Teh Manis"],
        total: 30000,
        status: "new",
        createdAt: "14:30",
      },
      {
        id: "ORD002",
        customerName: "Jane Smith",
        items: ["Ayam Pop", "Gulai Kambing"],
        total: 55000,
        status: "preparing",
        createdAt: "14:25",
      },
      {
        id: "ORD003",
        customerName: "Bob Wilson",
        items: ["Nasi Rendang"],
        total: 25000,
        status: "ready",
        createdAt: "14:20",
      },
    ])

    setMenuItems([
      {
        id: "1",
        name: "Nasi Rendang",
        price: 25000,
        category: "main",
        isAvailable: true,
        orders: 12,
      },
      {
        id: "2",
        name: "Ayam Pop",
        price: 20000,
        category: "main",
        isAvailable: true,
        orders: 8,
      },
      {
        id: "3",
        name: "Gulai Kambing",
        price: 35000,
        category: "main",
        isAvailable: false,
        orders: 3,
      },
      {
        id: "4",
        name: "Es Teh Manis",
        price: 5000,
        category: "drinks",
        isAvailable: true,
        orders: 15,
      },
    ])
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge className="bg-red-100 text-red-800">Pesanan Baru</Badge>
      case "preparing":
        return <Badge className="bg-yellow-100 text-yellow-800">Sedang Disiapkan</Badge>
      case "ready":
        return <Badge className="bg-green-100 text-green-800">Siap Diambil</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleOrderStatusUpdate = (orderId: string, newStatus: string) => {
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
  }

  const toggleMenuItemAvailability = (itemId: string) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item)),
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-green-600">Warung Padang Sederhana</h1>
              <p className="text-sm text-gray-600">Dashboard Merchant</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Toko</span>
                <Switch checked={isStoreOpen} onCheckedChange={setIsStoreOpen} />
                <span className={`text-sm font-medium ${isStoreOpen ? "text-green-600" : "text-red-600"}`}>
                  {isStoreOpen ? "Buka" : "Tutup"}
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
                  <p className="text-sm font-medium text-gray-600">Pesanan Hari Ini</p>
                  <p className="text-3xl font-bold">{stats.todayOrders}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendapatan Hari Ini</p>
                  <p className="text-3xl font-bold">Rp {stats.todayRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rating Rata-rata</p>
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
                  <p className="text-sm font-medium text-gray-600">Total Menu</p>
                  <p className="text-3xl font-bold">{stats.totalMenuItems}</p>
                </div>
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Content */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList>
            <TabsTrigger value="orders">Pesanan Masuk</TabsTrigger>
            <TabsTrigger value="menu">Kelola Menu</TabsTrigger>
            <TabsTrigger value="analytics">Analitik</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Pesanan Masuk</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="font-semibold">#{order.id}</p>
                            <p className="text-sm text-gray-600">{order.customerName}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{order.items.join(", ")}</p>
                            <p className="text-sm text-gray-600">{order.createdAt}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-semibold">Rp {order.total.toLocaleString()}</p>
                        </div>
                        {getStatusBadge(order.status)}
                        <div className="flex space-x-2">
                          {order.status === "new" && (
                            <Button size="sm" onClick={() => handleOrderStatusUpdate(order.id, "preparing")}>
                              Terima
                            </Button>
                          )}
                          {order.status === "preparing" && (
                            <Button size="sm" onClick={() => handleOrderStatusUpdate(order.id, "ready")}>
                              Siap
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="menu">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Kelola Menu</CardTitle>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Menu
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {menuItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-sm text-gray-600">
                              Rp {item.price.toLocaleString()} • {item.orders} pesanan
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant="outline">
                          {item.category === "main"
                            ? "Makanan Utama"
                            : item.category === "drinks"
                              ? "Minuman"
                              : "Snack"}
                        </Badge>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={item.isAvailable}
                            onCheckedChange={() => toggleMenuItemAvailability(item.id)}
                          />
                          <span className={`text-sm ${item.isAvailable ? "text-green-600" : "text-red-600"}`}>
                            {item.isAvailable ? "Tersedia" : "Habis"}
                          </span>
                        </div>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analitik Penjualan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Fitur analitik akan segera hadir</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
