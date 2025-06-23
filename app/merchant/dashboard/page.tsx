"use client"

import { useState, useEffect } from "react"
import {
  DollarSign,
  ShoppingCart,
  Star,
  Plus,
  Edit,
  Eye,
  Package,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Camera,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { getStoredUser, clearAuth } from "@/lib/auth"

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  isAvailable: boolean
  stock: number
  sold: number
}

interface Order {
  id: string
  customerName: string
  customerPhone: string
  customerPhoto: string
  items: { name: string; quantity: number; price: number }[]
  total: number
  status: string
  createdAt: string
  deliveryAddress: string
  notes?: string
}

export default function MerchantDashboard() {
  const [isStoreOpen, setIsStoreOpen] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [todayRevenue, setTodayRevenue] = useState(450000)
  const [todayOrders, setTodayOrders] = useState(12)
  const [rating, setRating] = useState(4.6)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [user, setUser] = useState<any>(null)

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: "",
  })

  useEffect(() => {
    setUser(getStoredUser())
    loadMockData()
  }, [])

  const loadMockData = () => {
    setProducts([
      {
        id: "1",
        name: "Nasi Gudeg Komplit",
        description: "Nasi gudeg khas Yogyakarta dengan ayam, telur, dan krecek",
        price: 25000,
        image: "/placeholder.svg?height=150&width=200",
        category: "Makanan Utama",
        isAvailable: true,
        stock: 20,
        sold: 45,
      },
      {
        id: "2",
        name: "Es Teh Manis",
        description: "Es teh manis segar dengan gula aren",
        price: 5000,
        image: "/placeholder.svg?height=150&width=200",
        category: "Minuman",
        isAvailable: true,
        stock: 50,
        sold: 78,
      },
      {
        id: "3",
        name: "Ayam Bakar Bumbu Kecap",
        description: "Ayam bakar dengan bumbu kecap manis dan lalapan",
        price: 30000,
        image: "/placeholder.svg?height=150&width=200",
        category: "Makanan Utama",
        isAvailable: false,
        stock: 0,
        sold: 23,
      },
      {
        id: "4",
        name: "Soto Ayam Tasikmalaya",
        description: "Soto ayam khas Tasikmalaya dengan kuah bening",
        price: 18000,
        image: "/placeholder.svg?height=150&width=200",
        category: "Makanan Utama",
        isAvailable: true,
        stock: 15,
        sold: 67,
      },
    ])

    setOrders([
      {
        id: "ORD001",
        customerName: "Budi Santoso",
        customerPhone: "081234567890",
        customerPhoto: "/placeholder.svg?height=40&width=40",
        items: [
          { name: "Nasi Gudeg Komplit", quantity: 2, price: 25000 },
          { name: "Es Teh Manis", quantity: 2, price: 5000 },
        ],
        total: 60000,
        status: "new",
        createdAt: "14:30",
        deliveryAddress: "Jl. Merdeka No. 123, Tasikmalaya",
        notes: "Pedas sedang, tanpa krecek",
      },
      {
        id: "ORD002",
        customerName: "Siti Nurhaliza",
        customerPhone: "081234567891",
        customerPhoto: "/placeholder.svg?height=40&width=40",
        items: [
          { name: "Ayam Bakar Bumbu Kecap", quantity: 1, price: 30000 },
          { name: "Soto Ayam Tasikmalaya", quantity: 1, price: 18000 },
        ],
        total: 48000,
        status: "preparing",
        createdAt: "14:25",
        deliveryAddress: "Perumahan Griya Asri Blok C No. 45",
      },
      {
        id: "ORD003",
        customerName: "Ahmad Rizki",
        customerPhone: "081234567892",
        customerPhoto: "/placeholder.svg?height=40&width=40",
        items: [{ name: "Nasi Gudeg Komplit", quantity: 1, price: 25000 }],
        total: 25000,
        status: "ready",
        createdAt: "14:20",
        deliveryAddress: "Jl. Sutisna Senjaya No. 67",
      },
    ])
  }

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) {
      alert("Nama dan harga produk harus diisi")
      return
    }

    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      description: newProduct.description,
      price: Number.parseInt(newProduct.price),
      image: newProduct.image || "/placeholder.svg?height=150&width=200",
      category: newProduct.category || "Lainnya",
      isAvailable: true,
      stock: Number.parseInt(newProduct.stock) || 0,
      sold: 0,
    }

    setProducts((prev) => [...prev, product])
    setNewProduct({ name: "", description: "", price: "", category: "", stock: "", image: "" })
    setShowAddProduct(false)
  }

  const toggleProductAvailability = (productId: string) => {
    setProducts((prev) =>
      prev.map((product) => (product.id === productId ? { ...product, isAvailable: !product.isAvailable } : product)),
    )
  }

  const handleOrderStatusUpdate = (orderId: string, newStatus: string) => {
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return (
          <Badge className="bg-red-100 text-red-800">
            <AlertCircle className="h-3 w-3 mr-1" />
            Pesanan Baru
          </Badge>
        )
      case "preparing":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Sedang Disiapkan
          </Badge>
        )
      case "ready":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Siap Diambil
          </Badge>
        )
      case "completed":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Selesai
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleLogout = () => {
    clearAuth()
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-white text-purple-600 p-2 rounded-lg">
                <ShoppingCart className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Merchant Dashboard</h1>
                <p className="text-sm text-purple-100">{user?.name || "Toko Sari"} - MAXIM Merchant</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Toko</span>
                <Switch
                  checked={isStoreOpen}
                  onCheckedChange={setIsStoreOpen}
                  className="data-[state=checked]:bg-green-500"
                />
                <span className={`text-sm font-medium ${isStoreOpen ? "text-green-300" : "text-red-300"}`}>
                  {isStoreOpen ? "Buka" : "Tutup"}
                </span>
              </div>
              <Button size="sm" variant="outline" onClick={handleLogout} className="border-white text-white">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Pendapatan Hari Ini</p>
                  <p className="text-2xl font-bold">Rp {todayRevenue.toLocaleString()}</p>
                  <p className="text-xs opacity-75 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12% dari kemarin
                  </p>
                </div>
                <DollarSign className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Pesanan Hari Ini</p>
                  <p className="text-2xl font-bold">{todayOrders}</p>
                  <p className="text-xs opacity-75">3 pesanan aktif</p>
                </div>
                <ShoppingCart className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Rating Toko</p>
                  <p className="text-2xl font-bold">{rating}</p>
                  <p className="text-xs opacity-75">dari 156 review</p>
                </div>
                <Star className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Total Produk</p>
                  <p className="text-2xl font-bold">{products.length}</p>
                  <p className="text-xs opacity-75">{products.filter((p) => p.isAvailable).length} tersedia</p>
                </div>
                <Package className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Store Status Alert */}
        {!isStoreOpen && (
          <Card className="mb-6 border-l-4 border-l-red-500 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center">
                <XCircle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-red-700 font-medium">
                  Toko Anda sedang tutup. Pelanggan tidak dapat melihat menu atau memesan.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="orders">Pesanan Masuk</TabsTrigger>
            <TabsTrigger value="products">Kelola Produk</TabsTrigger>
            <TabsTrigger value="analytics">Analitik</TabsTrigger>
            <TabsTrigger value="settings">Pengaturan</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Pesanan Masuk</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-red-100 text-red-800">
                      {orders.filter((o) => o.status === "new").length} baru
                    </Badge>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      {orders.filter((o) => o.status === "preparing").length} diproses
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id} className="border-l-4 border-l-purple-500">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={order.customerPhoto || "/placeholder.svg"}
                              alt={order.customerName}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                              <h4 className="font-semibold">#{order.id}</h4>
                              <p className="text-sm text-gray-600">{order.customerName}</p>
                              <p className="text-xs text-gray-500">{order.createdAt}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">Rp {order.total.toLocaleString()}</p>
                            {getStatusBadge(order.status)}
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <h5 className="font-medium">Items:</h5>
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                              <span>
                                {item.quantity}x {item.name}
                              </span>
                              <span>Rp {(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-start space-x-2">
                            <Package className="h-4 w-4 text-gray-500 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium">Alamat Pengiriman:</p>
                              <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
                            </div>
                          </div>
                          {order.notes && (
                            <div className="flex items-start space-x-2">
                              <AlertCircle className="h-4 w-4 text-gray-500 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium">Catatan:</p>
                                <p className="text-sm text-gray-600">{order.notes}</p>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex space-x-2">
                          {order.status === "new" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleOrderStatusUpdate(order.id, "preparing")}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Terima Pesanan
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleOrderStatusUpdate(order.id, "cancelled")}
                                className="text-red-600 border-red-600"
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Tolak
                              </Button>
                            </>
                          )}
                          {order.status === "preparing" && (
                            <Button
                              size="sm"
                              onClick={() => handleOrderStatusUpdate(order.id, "ready")}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Siap Diambil
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            Detail
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Kelola Produk</CardTitle>
                  <Button
                    onClick={() => setShowAddProduct(true)}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Produk
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Add Product Form */}
                {showAddProduct && (
                  <Card className="mb-6 border-purple-200 bg-purple-50">
                    <CardHeader>
                      <CardTitle className="text-purple-800">Tambah Produk Baru</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="productName">Nama Produk</Label>
                          <Input
                            id="productName"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                            placeholder="Nama produk"
                          />
                        </div>
                        <div>
                          <Label htmlFor="productPrice">Harga</Label>
                          <Input
                            id="productPrice"
                            type="number"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                            placeholder="Harga"
                          />
                        </div>
                        <div>
                          <Label htmlFor="productCategory">Kategori</Label>
                          <Select onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih kategori" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Makanan Utama">Makanan Utama</SelectItem>
                              <SelectItem value="Minuman">Minuman</SelectItem>
                              <SelectItem value="Snack">Snack</SelectItem>
                              <SelectItem value="Dessert">Dessert</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="productStock">Stok</Label>
                          <Input
                            id="productStock"
                            type="number"
                            value={newProduct.stock}
                            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                            placeholder="Jumlah stok"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="productDescription">Deskripsi</Label>
                          <Textarea
                            id="productDescription"
                            value={newProduct.description}
                            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                            placeholder="Deskripsi produk"
                            rows={3}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="productImage">Foto Produk</Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              id="productImage"
                              value={newProduct.image}
                              onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                              placeholder="URL gambar atau upload foto"
                            />
                            <Button variant="outline" size="sm">
                              <Camera className="h-4 w-4 mr-1" />
                              Upload
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button onClick={handleAddProduct} className="bg-green-600 hover:bg-green-700">
                          <Plus className="h-4 w-4 mr-1" />
                          Simpan Produk
                        </Button>
                        <Button variant="outline" onClick={() => setShowAddProduct(false)}>
                          Batal
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Products List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <Card key={product.id} className="overflow-hidden">
                      <div className="relative">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <Switch
                            checked={product.isAvailable}
                            onCheckedChange={() => toggleProductAvailability(product.id)}
                            size="sm"
                          />
                        </div>
                        <div className="absolute bottom-2 left-2">
                          <Badge className={product.isAvailable ? "bg-green-500" : "bg-red-500"}>
                            {product.isAvailable ? "Tersedia" : "Habis"}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-base mb-1">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-bold text-lg text-purple-600">Rp {product.price.toLocaleString()}</p>
                          <Badge variant="outline">{product.category}</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                          <span>Stok: {product.stock}</span>
                          <span>Terjual: {product.sold}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Eye className="h-4 w-4 mr-1" />
                            Detail
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ringkasan Penjualan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg">
                      <p className="text-sm opacity-90">Hari Ini</p>
                      <p className="text-3xl font-bold">Rp {todayRevenue.toLocaleString()}</p>
                      <p className="text-xs opacity-75">12 pesanan</p>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg">
                      <p className="text-sm opacity-90">Minggu Ini</p>
                      <p className="text-3xl font-bold">Rp 2.150.000</p>
                      <p className="text-xs opacity-75">67 pesanan</p>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg">
                      <p className="text-sm opacity-90">Bulan Ini</p>
                      <p className="text-3xl font-bold">Rp 8.750.000</p>
                      <p className="text-xs opacity-75">234 pesanan</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Produk Terlaris</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {products
                            .sort((a, b) => b.sold - a.sold)
                            .slice(0, 5)
                            .map((product, index) => (
                              <div
                                key={product.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                              >
                                <div className="flex items-center space-x-3">
                                  <span className="font-bold text-lg text-purple-600">#{index + 1}</span>
                                  <div>
                                    <p className="font-medium">{product.name}</p>
                                    <p className="text-sm text-gray-600">Rp {product.price.toLocaleString()}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold">{product.sold} terjual</p>
                                  <p className="text-sm text-gray-600">
                                    Rp {(product.sold * product.price).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Performance Metrics</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Rating Toko</span>
                            <span>{rating}/5.0</span>
                          </div>
                          <Progress value={(rating / 5) * 100} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Order Completion Rate</span>
                            <span>96%</span>
                          </div>
                          <Progress value={96} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Response Time</span>
                            <span>2.3 min</span>
                          </div>
                          <Progress value={85} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Customer Satisfaction</span>
                            <span>4.6/5.0</span>
                          </div>
                          <Progress value={92} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pengaturan Toko</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="storeName">Nama Toko</Label>
                      <Input id="storeName" defaultValue="Toko Sari" />
                    </div>
                    <div>
                      <Label htmlFor="storePhone">Nomor Telepon</Label>
                      <Input id="storePhone" defaultValue="081234567890" />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="storeAddress">Alamat Toko</Label>
                      <Textarea id="storeAddress" defaultValue="Jl. Merdeka No. 123, Tasikmalaya" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Jam Operasional</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="openTime">Jam Buka</Label>
                        <Input id="openTime" type="time" defaultValue="08:00" />
                      </div>
                      <div>
                        <Label htmlFor="closeTime">Jam Tutup</Label>
                        <Input id="closeTime" type="time" defaultValue="22:00" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Pengaturan Pengiriman</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="deliveryFee">Ongkos Kirim</Label>
                        <Input id="deliveryFee" type="number" defaultValue="3000" />
                      </div>
                      <div>
                        <Label htmlFor="minOrder">Minimum Order</Label>
                        <Input id="minOrder" type="number" defaultValue="15000" />
                      </div>
                    </div>
                  </div>

                  <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
                    Simpan Pengaturan
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
