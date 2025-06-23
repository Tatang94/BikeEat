// Auth utility functions
export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: "user" | "merchant" | "driver" | "admin"
  isVerified?: boolean
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null

  try {
    const userStr = localStorage.getItem("user")
    return userStr ? JSON.parse(userStr) : null
  } catch {
    return null
  }
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null

  return localStorage.getItem("token")
}

export function clearAuth(): void {
  if (typeof window === "undefined") return

  localStorage.removeItem("token")
  localStorage.removeItem("user")
}

export function isAuthenticated(): boolean {
  return !!getStoredToken() && !!getStoredUser()
}

export async function makeAuthenticatedRequest(url: string, options: RequestInit = {}) {
  const token = getStoredToken()

  if (!token) {
    throw new Error("No authentication token found")
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (response.status === 401) {
    // Token expired or invalid
    clearAuth()
    window.location.href = "/auth/login"
    throw new Error("Authentication expired")
  }

  return response
}
