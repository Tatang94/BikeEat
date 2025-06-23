// Notification Service untuk mengirim notifikasi
const WebSocketServer = require("./websocket-server")

class NotificationService {
  constructor(wsServer) {
    this.wsServer = wsServer
    this.templates = {
      order_confirmed: {
        title: "Pesanan Dikonfirmasi",
        message: "Pesanan #{orderNumber} telah dikonfirmasi oleh restoran",
      },
      order_preparing: {
        title: "Pesanan Sedang Disiapkan",
        message: "Restoran sedang menyiapkan pesanan #{orderNumber}",
      },
      order_ready: {
        title: "Pesanan Siap Diambil",
        message: "Pesanan #{orderNumber} siap diambil oleh driver",
      },
      order_picked_up: {
        title: "Pesanan Diambil Driver",
        message: "Driver {driverName} telah mengambil pesanan #{orderNumber}",
      },
      order_on_the_way: {
        title: "Driver Dalam Perjalanan",
        message: "{driverName} sedang dalam perjalanan mengantar pesanan Anda",
      },
      order_delivered: {
        title: "Pesanan Berhasil Diantar",
        message: "Pesanan #{orderNumber} telah berhasil diantar. Jangan lupa beri rating!",
      },
      order_cancelled: {
        title: "Pesanan Dibatalkan",
        message: "Pesanan #{orderNumber} telah dibatalkan. {reason}",
      },
      new_order: {
        title: "Pesanan Baru",
        message: "Ada pesanan baru #{orderNumber} dari {customerName}",
      },
      delivery_request: {
        title: "Permintaan Pengantaran",
        message: "Ada permintaan pengantaran baru dari {merchantName}",
      },
      promotion: {
        title: "Promo Spesial!",
        message: "{promoMessage}",
      },
    }
  }

  // Send notification to specific user
  async sendToUser(userId, type, data) {
    const template = this.templates[type]
    if (!template) {
      console.error(`Unknown notification type: ${type}`)
      return
    }

    const notification = {
      type: "notification",
      notificationType: type,
      title: this.interpolateTemplate(template.title, data),
      message: this.interpolateTemplate(template.message, data),
      data,
    }

    // Send via WebSocket if user is online
    if (this.wsServer) {
      this.wsServer.sendNotificationToUser(userId, notification)
    }

    // Here you would also save to database and send push notification
    await this.saveNotificationToDatabase(userId, notification)
    await this.sendPushNotification(userId, notification)
  }

  // Send notification to all users with specific role
  async sendToRole(role, type, data) {
    const template = this.templates[type]
    if (!template) {
      console.error(`Unknown notification type: ${type}`)
      return
    }

    const notification = {
      type: "notification",
      notificationType: type,
      title: this.interpolateTemplate(template.title, data),
      message: this.interpolateTemplate(template.message, data),
      data,
    }

    // Send via WebSocket to all users with the role
    if (this.wsServer) {
      this.wsServer.broadcastToRole(role, notification)
    }
  }

  // Send order status update notifications
  async sendOrderStatusUpdate(orderId, status, orderData) {
    const { userId, merchantId, driverId, orderNumber, customerName, driverName, merchantName } = orderData

    switch (status) {
      case "confirmed":
        await this.sendToUser(userId, "order_confirmed", { orderNumber })
        break

      case "preparing":
        await this.sendToUser(userId, "order_preparing", { orderNumber })
        if (driverId) {
          await this.sendToUser(driverId, "delivery_request", { merchantName, orderNumber })
        }
        break

      case "ready":
        await this.sendToUser(userId, "order_ready", { orderNumber })
        if (driverId) {
          await this.sendToUser(driverId, "delivery_request", { merchantName, orderNumber })
        }
        break

      case "picked_up":
        await this.sendToUser(userId, "order_picked_up", { orderNumber, driverName })
        break

      case "on_the_way":
        await this.sendToUser(userId, "order_on_the_way", { orderNumber, driverName })
        break

      case "delivered":
        await this.sendToUser(userId, "order_delivered", { orderNumber })
        break

      case "cancelled":
        await this.sendToUser(userId, "order_cancelled", {
          orderNumber,
          reason: orderData.cancelReason || "Tidak ada alasan yang diberikan",
        })
        break
    }

    // Notify merchant about new orders
    if (status === "pending") {
      await this.sendToUser(merchantId, "new_order", { orderNumber, customerName })
    }
  }

  // Send promotional notifications
  async sendPromotion(userIds, promoData) {
    const { title, message, merchantName, discount } = promoData

    for (const userId of userIds) {
      await this.sendToUser(userId, "promotion", {
        promoMessage: message || `Dapatkan diskon ${discount}% di ${merchantName}!`,
      })
    }
  }

  // Helper method to replace placeholders in templates
  interpolateTemplate(template, data) {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
      return data[key] || match
    })
  }

  // Save notification to database (mock implementation)
  async saveNotificationToDatabase(userId, notification) {
    // In real implementation, save to database
    console.log(`Saving notification to database for user ${userId}:`, notification.title)
  }

  // Send push notification (mock implementation)
  async sendPushNotification(userId, notification) {
    // In real implementation, integrate with FCM, APNs, etc.
    console.log(`Sending push notification to user ${userId}:`, notification.title)
  }
}

module.exports = NotificationService
