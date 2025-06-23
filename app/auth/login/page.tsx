"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Mail, Lock, User, Car, Store, Shield, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("user")

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError("")
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simple validation - in real app, this would be API call
      if (!formData.email || !formData.password) {
        throw new Error("Email dan password harus diisi")
      }

      if (formData.password.length < 6) {
        throw new Error("Password minimal 6 karakter")
      }

      // Create user session
      const token = "auth-token-" + Date.now()
      const user = {
        id: "user-" + Date.now(),
        name: formData.email.split("@")[0],
        email: formData.email,
        phone: "081234567890",
        role: activeTab,
      }

      // Save to localStorage
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))

      // Redirect based on role
      switch (activeTab) {
        case "admin":
          router.push("/admin/dashboard")
          break
        case "merchant":
          router.push("/merchant/dashboard")
          break
        case "driver":
          router.push("/driver/dashboard")
          break
        default:
          router.push("/dashboard")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError(error instanceof Error ? error.message : "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  const roleIcons = {
    user: <User className="h-5 w-5" />,
    driver: <Car className="h-5 w-5" />,
    merchant: <Store className="h-5 w-5" />,
    admin: <Shield className="h-5 w-5" />,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center relative">
          <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="absolute left-0 top-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl font-bold">M</span>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">MAXIM</CardTitle>
          <p className="text-gray-600">Masuk ke akun Anda</p>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="user" className="flex items-center space-x-1">
                {roleIcons.user}
                <span className="hidden sm:inline">User</span>
              </TabsTrigger>
              <TabsTrigger value="driver" className="flex items-center space-x-1">
                {roleIcons.driver}
                <span className="hidden sm:inline">Driver</span>
              </TabsTrigger>
              <TabsTrigger value="merchant" className="flex items-center space-x-1">
                {roleIcons.merchant}
                <span className="hidden sm:inline">Merchant</span>
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center space-x-1">
                {roleIcons.admin}
                <span className="hidden sm:inline">Admin</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="user" className="mt-6">
              <p className="text-sm text-gray-600 text-center mb-4">Masuk sebagai pelanggan</p>
            </TabsContent>
            <TabsContent value="driver" className="mt-6">
              <p className="text-sm text-gray-600 text-center mb-4">Masuk sebagai driver</p>
            </TabsContent>
            <TabsContent value="merchant" className="mt-6">
              <p className="text-sm text-gray-600 text-center mb-4">Masuk sebagai merchant</p>
            </TabsContent>
            <TabsContent value="admin" className="mt-6">
              <p className="text-sm text-gray-600 text-center mb-4">Masuk sebagai admin</p>
            </TabsContent>
          </Tabs>

          {error && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertDescription className="text-red-600">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Masukkan email Anda"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password Anda"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-4 rounded-2xl"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Memproses...
                </div>
              ) : (
                "Masuk"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Belum punya akun?{" "}
              <Link href="/auth/register" className="text-purple-600 hover:underline font-medium">
                Daftar sekarang
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
