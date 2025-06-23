// Geolocation Service untuk menghitung jarak dan estimasi waktu
class GeolocationService {
  constructor() {
    // Kecepatan rata-rata sepeda dalam km/jam
    this.bikeSpeed = 15
    // Waktu persiapan default dalam menit
    this.preparationTime = 10
  }

  // Menghitung jarak menggunakan Haversine formula
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371 // Radius bumi dalam kilometer
    const dLat = this.toRadians(lat2 - lat1)
    const dLon = this.toRadians(lon2 - lon1)

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c

    return Math.round(distance * 100) / 100 // Round to 2 decimal places
  }

  // Convert degrees to radians
  toRadians(degrees) {
    return degrees * (Math.PI / 180)
  }

  // Menghitung estimasi waktu pengantaran dengan sepeda
  calculateDeliveryTime(distance, preparationTime = null) {
    const prepTime = preparationTime || this.preparationTime
    const travelTime = (distance / this.bikeSpeed) * 60 // Convert to minutes
    const totalTime = prepTime + travelTime

    return Math.round(totalTime)
  }

  // Menghitung ongkos kirim berdasarkan jarak
  calculateDeliveryFee(distance, baseFee = 3000) {
    // Base fee + additional fee per km
    const additionalFeePerKm = 1000
    const additionalFee = Math.max(0, (distance - 1) * additionalFeePerKm)

    return baseFee + Math.round(additionalFee)
  }

  // Mencari driver terdekat yang online
  findNearestDrivers(userLat, userLon, drivers, maxDistance = 5) {
    const nearbyDrivers = []

    for (const driver of drivers) {
      if (!driver.isOnline || !driver.currentLatitude || !driver.currentLongitude) {
        continue
      }

      const distance = this.calculateDistance(userLat, userLon, driver.currentLatitude, driver.currentLongitude)

      if (distance <= maxDistance) {
        nearbyDrivers.push({
          ...driver,
          distance,
          estimatedArrival: this.calculateDeliveryTime(distance, 0), // No prep time for driver arrival
        })
      }
    }

    // Sort by distance
    return nearbyDrivers.sort((a, b) => a.distance - b.distance)
  }

  // Mencari merchant terdekat
  findNearbyMerchants(userLat, userLon, merchants, maxDistance = 10) {
    const nearbyMerchants = []

    for (const merchant of merchants) {
      if (!merchant.isOpen || !merchant.latitude || !merchant.longitude) {
        continue
      }

      const distance = this.calculateDistance(userLat, userLon, merchant.latitude, merchant.longitude)

      if (distance <= maxDistance) {
        const deliveryTime = this.calculateDeliveryTime(distance)
        const deliveryFee = this.calculateDeliveryFee(distance, merchant.deliveryFee)

        nearbyMerchants.push({
          ...merchant,
          distance,
          deliveryTime,
          deliveryFee,
          estimatedDeliveryTime: `${deliveryTime - 5}-${deliveryTime + 5} min`,
        })
      }
    }

    // Sort by distance
    return nearbyMerchants.sort((a, b) => a.distance - b.distance)
  }

  // Generate route points untuk tracking (simulasi)
  generateRoutePoints(startLat, startLon, endLat, endLon, steps = 10) {
    const points = []

    for (let i = 0; i <= steps; i++) {
      const ratio = i / steps
      const lat = startLat + (endLat - startLat) * ratio
      const lon = startLon + (endLon - startLon) * ratio

      points.push({
        latitude: lat,
        longitude: lon,
        timestamp: new Date(Date.now() + i * 60000).toISOString(), // 1 minute intervals
      })
    }

    return points
  }

  // Validasi koordinat
  isValidCoordinate(lat, lon) {
    return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180
  }

  // Mendapatkan alamat dari koordinat (mock implementation)
  async reverseGeocode(lat, lon) {
    // In real implementation, use Google Maps API or similar
    return {
      address: `Jl. Example No. ${Math.floor(Math.random() * 999) + 1}`,
      city: "Jakarta",
      district: "Jakarta Selatan",
      postalCode: "12345",
    }
  }

  // Mendapatkan koordinat dari alamat (mock implementation)
  async geocode(address) {
    // In real implementation, use Google Maps API or similar
    // Return mock coordinates for Jakarta area
    const baseLat = -6.2088
    const baseLon = 106.8456
    const randomOffset = 0.05

    return {
      latitude: baseLat + (Math.random() - 0.5) * randomOffset,
      longitude: baseLon + (Math.random() - 0.5) * randomOffset,
    }
  }
}

module.exports = GeolocationService
