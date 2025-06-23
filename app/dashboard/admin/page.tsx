"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Store, Bike, ShoppingCart, TrendingUp, DollarSign } from "lucide-react"

interface DashboardStats {
  totalUsers: number
  totalMerchants: number
  totalDrivers: number
  totalOrders: number
  totalRevenue: number
  activeOrders: number
}

interface Order {
  id: string
  customerName: string
  merchantName: string
  driverName: string
  status: string
  total: number
  createdAt: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalMerchants: 0,
    totalDrivers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeOrders: 0,
  })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])

  useEffect(() => {
    // Simulasi data dashboard
    setStats({
      totalUsers: 1250,
      totalMerchants: 85,
      totalDrivers: 120,
      totalOrders: 3420,
      totalRevenue: 125000000,
      activeOrders: 45,
    })

    setRecentOrders([
      {
        id: "ORD001",
        customerName: "John Doe",
        merchantName: "Warung Padang Sederhana",
        driverName: "Ahmad Rizki",
        status: "on_the_way",
        total: 85000,
        createdAt: "2024-01-15 14:30",
      },
      {
        id: "ORD002",
        customerName: "Jane Smith",
        merchantName: "McDonald's",
        driverName: "Budi Santoso",
        status: "preparing",
        total: 125000,
        createdAt: "2024-01-15 14:25",
      },
      {
        id: "ORD003",
        customerName: "Bob Wilson",
        merchantName: "Starbucks",
        driverName: "Sari Dewi",
        status: "delivered",
        total: 65000,
        createdAt: "2024-01-15 14:20",
      },
    ])
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "preparing":
        return <Badge className="bg-yellow-100 text-yellow-800">Sedang Disiapkan</Badge>
      case "on_the_way":
        return <Badge className="bg-blue-100 text-blue-800">Dalam Perjalanan</Badge>
      case "delivered":
        return <Badge className="bg-green-100 text-green-800">Terkirim</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-green-600">BikeEats Admin</h1>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                Pengaturan
              </Button>
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
                  <p className="text-sm font-medium text-gray-600">Total Pengguna</p>
                  <p className="text-3xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Merchant</p>
                  <p className="text-3xl font-bold">{stats.totalMerchants}</p>
                </div>
                <Store className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Driver</p>
                  <p className="text-3xl font-bold">{stats.totalDrivers}</p>
                </div>
                <Bike className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pesanan Aktif</p>
                  <p className="text-3xl font-bold">{stats.activeOrders}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Pesanan</p>
                  <p className="text-3xl font-bold">{stats.totalOrders.toLocaleString()}</p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +12% dari bulan lalu
                  </p>
                </div>
                <ShoppingCart className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Pendapatan</p>
                  <p className="text-3xl font-bold">Rp {stats.totalRevenue.toLocaleString()}</p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +8% dari bulan lalu
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Content */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList>
            <TabsTrigger value="orders">Pesanan Terbaru</TabsTrigger>
            <TabsTrigger value="merchants">Merchant</TabsTrigger>
            <TabsTrigger value="drivers">Driver</TabsTrigger>
            <TabsTrigger value="users">Pengguna</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Pesanan Terbaru</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="font-semibold">#{order.id}</p>
                            <p className="text-sm text-gray-600">{order.customerName}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{order.merchantName}</p>
                            <p className="text-sm text-gray-600">Driver: {order.driverName}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-semibold">Rp {order.total.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">{order.createdAt}</p>
                        </div>
                        {getStatusBadge(order.status)}
                        <Button size="sm" variant="outline">
                          Detail
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="merchants">
            <Card>
              <CardHeader>
                <CardTitle>Manajemen Merchant</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Fitur manajemen merchant akan segera hadir</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="drivers">
            <Card>
              <CardHeader>
                <CardTitle>Manajemen Driver</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Bike className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Fitur manajemen driver akan segera hadir</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Manajemen Pengguna</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Fitur manajemen pengguna akan segera hadir</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
