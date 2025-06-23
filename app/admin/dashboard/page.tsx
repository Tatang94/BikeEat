"use client"

import { useState, useEffect } from "react"
import { Users, Car, Store, DollarSign, TrendingUp, AlertTriangle, Shield, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"

interface User {
  id: string
  name: string
  email: string
  role: string
  status: string
  joinDate: string
}

interface Transaction {
  id: string
  type: string
  amount: number
  status: string
  date: string
  user: string
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [stats, setStats] = useState({
    totalUsers: 1250,
    totalDrivers: 320,
    totalMerchants: 180,
    totalRevenue: 125000000,
    activeOrders: 45,
    completedOrders: 2340,
  })

  useEffect(() => {
    // Load mock data
    setUsers([
      {
        id: "1",
        name: "John Customer",
        email: "user@maxim.com",
        role: "user",
        status: "active",
        joinDate: "2024-01-15",
      },
      {
        id: "2",
        name: "Ahmad Driver",
        email: "driver@maxim.com",
        role: "driver",
        status: "active",
        joinDate: "2024-01-10",
      },
      {
        id: "3",
        name: "Toko Sari",
        email: "merchant@maxim.com",
        role: "merchant",
        status: "active",
        joinDate: "2024-01-05",
      },
    ])

    setTransactions([
      {
        id: "TXN001",
        type: "ride",
        amount: 15000,
        status: "completed",
        date: "2024-01-15 14:30",
        user: "John Customer",
      },
      {
        id: "TXN002",
        type: "delivery",
        amount: 25000,
        status: "completed",
        date: "2024-01-15 14:25",
        user: "Jane Smith",
      },
      {
        id: "TXN003",
        type: "ride",
        amount: 12000,
        status: "pending",
        date: "2024-01-15 14:20",
        user: "Bob Wilson",
      },
    ])
  }, [])

  const handleUserAction = (userId: string, action: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? { ...user, status: action === "suspend" ? "suspended" : action === "activate" ? "active" : user.status }
          : user,
      ),
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Aktif</Badge>
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "user":
        return <Badge variant="outline">User</Badge>
      case "driver":
        return <Badge className="bg-blue-100 text-blue-800">Driver</Badge>
      case "merchant":
        return <Badge className="bg-purple-100 text-purple-800">Merchant</Badge>
      default:
        return <Badge variant="secondary">{role}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-black text-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-yellow-500">MAXIM Admin</h1>
              <p className="text-sm text-gray-300">System Administration</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button size="sm" variant="outline" className="border-yellow-500 text-yellow-500">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  localStorage.clear()
                  window.location.href = "/"
                }}
                className="bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                Logout
              </Button>
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
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.totalUsers.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Drivers</p>
                  <p className="text-3xl font-bold text-green-600">{stats.totalDrivers}</p>
                </div>
                <Car className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Merchants</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.totalMerchants}</p>
                </div>
                <Store className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-3xl font-bold text-yellow-600">Rp {(stats.totalRevenue / 1000000).toFixed(1)}M</p>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Orders</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.activeOrders}</p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +12% dari kemarin
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed Orders</p>
                  <p className="text-3xl font-bold text-green-600">{stats.completedOrders.toLocaleString()}</p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +8% dari bulan lalu
                  </p>
                </div>
                <Shield className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">Manage Users</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="settings">System Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>User Management</CardTitle>
                  <div className="flex space-x-2">
                    <Input placeholder="Search users..." className="w-64" />
                    <Button variant="outline">Filter</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-semibold">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-xs text-gray-500">Joined: {user.joinDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        {getRoleBadge(user.role)}
                        {getStatusBadge(user.status)}
                        <div className="flex space-x-2">
                          {user.status === "active" ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUserAction(user.id, "suspend")}
                              className="text-red-600 border-red-600"
                            >
                              Suspend
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleUserAction(user.id, "activate")}
                              className="bg-green-600"
                            >
                              Activate
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-semibold">#{transaction.id}</p>
                        <p className="text-sm text-gray-600">{transaction.user}</p>
                        <p className="text-xs text-gray-500">{transaction.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">Rp {transaction.amount.toLocaleString()}</p>
                        <Badge
                          className={
                            transaction.type === "ride" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                          }
                        >
                          {transaction.type}
                        </Badge>
                      </div>
                      <div>{getStatusBadge(transaction.status)}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>System Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Revenue Reports</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between p-3 bg-gray-50 rounded">
                        <span>Daily Revenue</span>
                        <span className="font-bold">Rp 2.5M</span>
                      </div>
                      <div className="flex justify-between p-3 bg-gray-50 rounded">
                        <span>Weekly Revenue</span>
                        <span className="font-bold">Rp 17.5M</span>
                      </div>
                      <div className="flex justify-between p-3 bg-gray-50 rounded">
                        <span>Monthly Revenue</span>
                        <span className="font-bold">Rp 75M</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Performance Metrics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between p-3 bg-gray-50 rounded">
                        <span>Average Response Time</span>
                        <span className="font-bold">3.2 min</span>
                      </div>
                      <div className="flex justify-between p-3 bg-gray-50 rounded">
                        <span>Customer Satisfaction</span>
                        <span className="font-bold">4.7/5</span>
                      </div>
                      <div className="flex justify-between p-3 bg-gray-50 rounded">
                        <span>Driver Utilization</span>
                        <span className="font-bold">78%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-4">Platform Configuration</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Maintenance Mode</p>
                          <p className="text-sm text-gray-600">Enable maintenance mode for system updates</p>
                        </div>
                        <Button variant="outline">Configure</Button>
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Commission Rates</p>
                          <p className="text-sm text-gray-600">Manage platform commission rates</p>
                        </div>
                        <Button variant="outline">Configure</Button>
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Notification Settings</p>
                          <p className="text-sm text-gray-600">Configure system notifications</p>
                        </div>
                        <Button variant="outline">Configure</Button>
                      </div>
                    </div>
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
