"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { getStoredUser, isAuthenticated } from "@/lib/auth"

export default function LandingPage() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    if (isAuthenticated()) {
      setUser(getStoredUser())
      // If user is already logged in, redirect to dashboard
      window.location.href = "/dashboard"
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 flex flex-col items-center justify-center px-6 py-8">
      {/* Status Bar Simulation */}
      <div className="w-full max-w-sm mb-8">
        <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
          <span>16:42</span>
          <div className="flex items-center space-x-1">
            <span>🔔</span>
            <span>⏰</span>
            <span>📶</span>
            <span>📶</span>
            <span className="bg-green-500 text-white px-1 rounded text-xs">100</span>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="w-full max-w-sm flex flex-col items-center">
        {/* Delivery Illustration */}
        <div className="relative mb-16">
          {/* Background Circle */}
          <div className="w-80 h-80 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full opacity-30 absolute -top-10 -left-10"></div>

          {/* Scooter Illustration */}
          <div className="relative z-10 flex items-center justify-center">
            <div className="relative">
              {/* Delivery Person */}
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mb-4">
                <div className="w-8 h-8 bg-yellow-600 rounded-full"></div>
              </div>

              {/* Scooter */}
              <div className="flex items-center">
                <div className="w-20 h-12 bg-yellow-500 rounded-lg relative">
                  <div className="w-6 h-6 bg-gray-800 rounded-full absolute -bottom-2 left-2"></div>
                  <div className="w-6 h-6 bg-gray-800 rounded-full absolute -bottom-2 right-2"></div>
                </div>

                {/* Package */}
                <div className="w-8 h-8 bg-orange-400 ml-2 rounded transform rotate-12">
                  <div className="w-full h-1 bg-orange-600 mt-2"></div>
                  <div className="w-1 h-full bg-orange-600 ml-3 -mt-4"></div>
                </div>
              </div>

              {/* Motion Lines */}
              <div className="absolute -left-8 top-8">
                <div className="flex space-x-1">
                  <div className="w-3 h-0.5 bg-orange-400 rounded"></div>
                  <div className="w-2 h-0.5 bg-orange-300 rounded"></div>
                  <div className="w-1 h-0.5 bg-orange-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 leading-tight">
            Pengantaran Makanan
            <br />
            Tercepat
          </h1>
          <h2 className="text-3xl font-bold text-purple-600 mb-6">di Tasikmalaya</h2>

          <p className="text-gray-600 text-base leading-relaxed px-4">
            Nikmati makanan favorit dari restoran terbaik dengan layanan pengantaran super cepat. Pesan sekarang dan
            rasakan kemudahan berbelanja makanan!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-4">
          <Button
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 rounded-2xl text-lg shadow-lg"
            onClick={() => (window.location.href = "/auth/register")}
          >
            Sign Up
          </Button>

          <Button
            variant="outline"
            className="w-full border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold py-4 rounded-2xl text-lg"
            onClick={() => (window.location.href = "/auth/login")}
          >
            Sign In
          </Button>
        </div>
      </div>

      {/* Bottom Navigation Simulation */}
      <div className="w-full max-w-sm mt-12">
        <div className="flex justify-center items-center space-x-8 text-gray-400">
          <div className="w-6 h-6 border-2 border-gray-400 rounded"></div>
          <div className="w-6 h-6 border-2 border-gray-400 rounded-full"></div>
          <div className="w-6 h-6">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
          </div>
          <div className="w-6 h-6">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
