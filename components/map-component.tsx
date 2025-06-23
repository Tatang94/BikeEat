"use client"

import { useEffect, useRef, useState } from "react"
import { Navigation } from "lucide-react"

interface MapComponentProps {
  userLocation: { lat: number; lng: number } | null
  destination?: { lat: number; lng: number } | null
  showRoute?: boolean
}

declare global {
  interface Window {
    google: any
    initMap: () => void
  }
}

export default function MapComponent({ userLocation, destination, showRoute = false }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load Google Maps API
    if (!window.google) {
      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyByZ97PypAe4w96W2YZHYoChbQSUtXuQxQ&libraries=places`
      script.async = true
      script.defer = true
      script.onload = initializeMap
      document.head.appendChild(script)
    } else {
      initializeMap()
    }
  }, [])

  useEffect(() => {
    if (map && userLocation) {
      // Update map center when user location changes
      map.setCenter(userLocation)

      // Add user location marker
      new window.google.maps.Marker({
        position: userLocation,
        map: map,
        title: "Lokasi Anda",
        icon: {
          url:
            "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="#8B5CF6" stroke="white" strokeWidth="4"/>
              <circle cx="20" cy="20" r="6" fill="white"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: new window.google.maps.Point(20, 20),
        },
      })
    }
  }, [map, userLocation])

  useEffect(() => {
    if (map && destination) {
      // Add destination marker
      new window.google.maps.Marker({
        position: destination,
        map: map,
        title: "Tujuan",
        icon: {
          url:
            "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 2C13.383 2 8 7.383 8 14c0 10.5 12 22 12 22s12-11.5 12-22c0-6.617-5.383-12-12-12z" fill="#EF4444" stroke="white" strokeWidth="2"/>
              <circle cx="20" cy="14" r="4" fill="white"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: new window.google.maps.Point(20, 38),
        },
      })

      // Show route if requested
      if (showRoute && userLocation) {
        const directionsService = new window.google.maps.DirectionsService()
        const directionsRenderer = new window.google.maps.DirectionsRenderer({
          polylineOptions: {
            strokeColor: "#8B5CF6",
            strokeWeight: 4,
          },
        })

        directionsRenderer.setMap(map)

        directionsService.route(
          {
            origin: userLocation,
            destination: destination,
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (result: any, status: any) => {
            if (status === "OK") {
              directionsRenderer.setDirections(result)
            }
          },
        )
      }
    }
  }, [map, destination, showRoute, userLocation])

  const initializeMap = () => {
    if (mapRef.current && userLocation) {
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: userLocation,
        zoom: 15,
        styles: [
          {
            featureType: "all",
            elementType: "geometry.fill",
            stylers: [{ color: "#f5f5f5" }],
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#e9e9e9" }, { lightness: 17 }],
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#ffffff" }, { lightness: 17 }],
          },
        ],
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      })

      setMap(mapInstance)
      setIsLoading(false)
    }
  }

  if (!userLocation) {
    return (
      <div className="h-full flex items-center justify-center bg-purple-50 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
          <p className="text-purple-600 text-sm">Mengambil lokasi...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full relative">
      {isLoading && (
        <div className="absolute inset-0 bg-purple-50 rounded-lg flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
            <p className="text-purple-600 text-sm">Memuat peta...</p>
          </div>
        </div>
      )}

      <div ref={mapRef} className="h-full w-full rounded-lg" />

      {/* Map Controls */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-2">
        <button
          className="p-2 hover:bg-gray-100 rounded"
          onClick={() => {
            if (map && userLocation) {
              map.setCenter(userLocation)
              map.setZoom(15)
            }
          }}
        >
          <Navigation className="h-4 w-4 text-purple-600" />
        </button>
      </div>

      {/* Location Info */}
      <div className="absolute top-4 left-4 bg-white bg-opacity-95 p-3 rounded-lg shadow-lg">
        <div className="text-sm">
          <p className="font-medium text-purple-800">Koordinat:</p>
          <p className="text-gray-600 text-xs">
            {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
          </p>
        </div>
      </div>
    </div>
  )
}
