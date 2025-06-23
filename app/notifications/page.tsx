"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Bell, Check, X, Clock, ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Notification {
  id: string
  type: "order" | "promotion" | "system"
  title: string
  message: string
  isRead: boolean
  createdAt: string
  data?: any
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    // Mock notifications data
    const mockNotifications: Notification[] = [
      {
        id: "1",
        type: "order",
        title: "Pesanan Sedang Disiapkan",
        message: "Pesanan #ORD001 dari Warung Padang Sederhana sedang disiapkan",
        isRead: false,
        createdAt: "2024-01-15T14:30:00Z",
        data: { orderId: "ORD001" },
      },
      {
        id: "2",
        type: "order",
        title: "Driver Menuju Lokasi",
        message: "Ahmad Rizki sedang dalam perjalanan mengantar pesanan Anda",
        isRead: false,
        createdAt: "2024-01-15T14:25:00Z",
        data: { orderId: "ORD002", driverId: "DRV001" },
      },
      {
        id: "3",
        type: "promotion",
        title: "Promo Spesial Hari Ini!",
        message: "Dapatkan diskon 20% untuk semua menu di McDonald's",
        isRead: true,
        createdAt: "2024-01-15T10:00:00Z",
        data: { merchantId: "MCH002", discount: 20 },
      },
      {
        id: "4",
        type: "order",
        title: "Pesanan Berhasil Diantar",
        message: "Pesanan #ORD003 telah berhasil diantar. Jangan lupa beri rating!",
        isRead: true,
        createdAt: "2024-01-14T19:45:00Z",
        data: { orderId: "ORD003" },
      },
      {
        id: "5",
        type: "system",
        title: "Update Aplikasi Tersedia",
        message: "Versi terbaru BikeEats telah tersedia dengan fitur-fitur baru",
        isRead: true,
        createdAt: "2024-01-14T08:00:00Z",
      },
    ]

    setNotifications(mockNotifications)
  }, [])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return <ShoppingCart className="h-5 w-5 text-blue-600" />
      case "promotion":
        return <Star className="h-5 w-5 text-yellow-600" />
      case "system":
        return <Bell className="h-5 w-5 text-gray-600" />
      default:
        return <Bell className="h-5 w-5 text-gray-600" />
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
      return `${diffInMinutes} menit yang lalu`
    } else if (diffInHours < 24) {
      return `${diffInHours} jam yang lalu`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays} hari yang lalu`
    }
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const unreadCount = notifications.filter((notif) => !notif.isRead).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold">Notifikasi</h1>
                {unreadCount > 0 && <p className="text-sm text-gray-600">{unreadCount} notifikasi belum dibaca</p>}
              </div>
            </div>

            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <Check className="h-4 w-4 mr-2" />
                Tandai Semua Dibaca
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Belum Ada Notifikasi</h3>
            <p className="text-gray-500">Notifikasi akan muncul di sini ketika ada update pesanan atau promo</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`${!notification.isRead ? "border-blue-200 bg-blue-50" : ""} hover:shadow-md transition-shadow`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{notification.title}</h4>
                          <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{formatTime(notification.createdAt)}</span>
                            {!notification.isRead && (
                              <Badge variant="secondary" className="text-xs">
                                Baru
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.isRead && (
                            <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => deleteNotification(notification.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
