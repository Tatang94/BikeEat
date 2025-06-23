"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function TestAuthPage() {
  const [result, setResult] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const testConnection = async () => {
    setIsLoading(true)
    setResult("")

    try {
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "test@test.com",
          password: "test123",
          role: "user",
        }),
      })

      const data = await response.json()
      setResult(`Status: ${response.status}\nResponse: ${JSON.stringify(data, null, 2)}`)
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testRegister = async () => {
    setIsLoading(true)
    setResult("")

    try {
      const response = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Test User",
          email: `test${Date.now()}@test.com`,
          phone: "081234567890",
          password: "test123",
          role: "user",
        }),
      })

      const data = await response.json()
      setResult(`Status: ${response.status}\nResponse: ${JSON.stringify(data, null, 2)}`)
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Test Authentication</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-4">
              <Button onClick={testConnection} disabled={isLoading}>
                Test Login
              </Button>
              <Button onClick={testRegister} disabled={isLoading}>
                Test Register
              </Button>
            </div>

            {result && (
              <Alert>
                <AlertDescription>
                  <pre className="whitespace-pre-wrap text-sm">{result}</pre>
                </AlertDescription>
              </Alert>
            )}

            <div className="mt-8">
              <h3 className="font-semibold mb-4">Setup Instructions:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Make sure MySQL is running</li>
                <li>
                  Run: <code className="bg-gray-100 px-2 py-1 rounded">node scripts/database-init.js</code>
                </li>
                <li>
                  Run: <code className="bg-gray-100 px-2 py-1 rounded">node scripts/api-server.js</code>
                </li>
                <li>Test the endpoints above</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
