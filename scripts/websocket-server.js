// WebSocket Server untuk Real-time Updates
const WebSocket = require("ws")
const jwt = require("jsonwebtoken")

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

class WebSocketServer {
  constructor(port = 8080) {
    this.wss = new WebSocket.Server({ port })
    this.clients = new Map() // Map untuk menyimpan client connections
    this.setupServer()
    console.log(`WebSocket server running on port ${port}`)
  }

  setupServer() {
    this.wss.on("connection", (ws, req) => {
      console.log("New WebSocket connection")

      ws.on("message", (message) => {
        try {
          const data = JSON.parse(message)
          this.handleMessage(ws, data)
        } catch (error) {
          console.error("Error parsing message:", error)
          ws.send(JSON.stringify({ error: "Invalid message format" }))
        }
      })

      ws.on("close", () => {
        // Remove client from map when disconnected
        for (const [clientId, client] of this.clients.entries()) {
          if (client.ws === ws) {
            this.clients.delete(clientId)
            console.log(`Client ${clientId} disconnected`)
            break
          }
        }
      })

      ws.on("error", (error) => {
        console.error("WebSocket error:", error)
      })
    })
  }

  handleMessage(ws, data) {
    switch (data.type) {
      case "auth":
        this.authenticateClient(ws, data.token)
        break
      case "subscribe":
        this.subscribeToUpdates(ws, data.channels)
        break
      case "order_update":
        this.broadcastOrderUpdate(data.orderId, data.status, data.message)
        break
      case "driver_location":
        this.updateDriverLocation(data.driverId, data.location)
        break
      default:
        ws.send(JSON.stringify({ error: "Unknown message type" }))
    }
  }

  authenticateClient(ws, token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      const clientId = decoded.userId

      this.clients.set(clientId, {
        ws,
        userId: decoded.userId,
        role: decoded.role,
        subscriptions: [],
      })

      ws.send(
        JSON.stringify({
          type: "auth_success",
          clientId,
          message: "Authentication successful",
        }),
      )

      console.log(`Client ${clientId} authenticated as ${decoded.role}`)
    } catch (error) {
      ws.send(
        JSON.stringify({
          type: "auth_error",
          message: "Invalid token",
        }),
      )
    }
  }

  subscribeToUpdates(ws, channels) {
    for (const [clientId, client] of this.clients.entries()) {
      if (client.ws === ws) {
        client.subscriptions = channels
        ws.send(
          JSON.stringify({
            type: "subscription_success",
            channels,
            message: "Subscribed to updates",
          }),
        )
        break
      }
    }
  }

  broadcastOrderUpdate(orderId, status, message) {
    const updateData = {
      type: "order_update",
      orderId,
      status,
      message,
      timestamp: new Date().toISOString(),
    }

    this.clients.forEach((client, clientId) => {
      if (client.subscriptions.includes("orders") || client.subscriptions.includes(`order_${orderId}`)) {
        if (client.ws.readyState === WebSocket.OPEN) {
          client.ws.send(JSON.stringify(updateData))
        }
      }
    })
  }

  updateDriverLocation(driverId, location) {
    const locationData = {
      type: "driver_location",
      driverId,
      location,
      timestamp: new Date().toISOString(),
    }

    this.clients.forEach((client, clientId) => {
      if (client.subscriptions.includes("driver_tracking") || client.subscriptions.includes(`driver_${driverId}`)) {
        if (client.ws.readyState === WebSocket.OPEN) {
          client.ws.send(JSON.stringify(locationData))
        }
      }
    })
  }

  // Method untuk mengirim notifikasi ke user tertentu
  sendNotificationToUser(userId, notification) {
    const client = this.clients.get(userId)
    if (client && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(
        JSON.stringify({
          type: "notification",
          ...notification,
          timestamp: new Date().toISOString(),
        }),
      )
    }
  }

  // Method untuk broadcast ke semua client dengan role tertentu
  broadcastToRole(role, data) {
    this.clients.forEach((client, clientId) => {
      if (client.role === role && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(
          JSON.stringify({
            ...data,
            timestamp: new Date().toISOString(),
          }),
        )
      }
    })
  }
}

// Start WebSocket server
const wsServer = new WebSocketServer(8080)

module.exports = WebSocketServer
