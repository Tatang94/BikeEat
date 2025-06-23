// Payment Service untuk simulasi pembayaran
const crypto = require("crypto")

class PaymentService {
  constructor() {
    this.transactions = new Map()
  }

  // Simulasi pembayaran tunai
  async processCashPayment(orderId, amount) {
    const transactionId = this.generateTransactionId()

    const transaction = {
      id: transactionId,
      orderId,
      amount,
      method: "cash",
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    this.transactions.set(transactionId, transaction)

    // Simulasi delay pembayaran tunai (langsung berhasil)
    setTimeout(() => {
      transaction.status = "completed"
      transaction.completedAt = new Date().toISOString()
    }, 1000)

    return {
      success: true,
      transactionId,
      message: "Cash payment initiated",
    }
  }

  // Simulasi pembayaran e-wallet
  async processEWalletPayment(orderId, amount, walletType) {
    const transactionId = this.generateTransactionId()

    const transaction = {
      id: transactionId,
      orderId,
      amount,
      method: "ewallet",
      walletType,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    this.transactions.set(transactionId, transaction)

    // Simulasi proses pembayaran e-wallet
    return new Promise((resolve) => {
      setTimeout(() => {
        // 90% success rate untuk simulasi
        const isSuccess = Math.random() > 0.1

        if (isSuccess) {
          transaction.status = "completed"
          transaction.completedAt = new Date().toISOString()
          resolve({
            success: true,
            transactionId,
            message: `${walletType} payment successful`,
          })
        } else {
          transaction.status = "failed"
          transaction.failedAt = new Date().toISOString()
          transaction.failureReason = "Insufficient balance"
          resolve({
            success: false,
            transactionId,
            message: "Payment failed: Insufficient balance",
          })
        }
      }, 3000) // 3 detik delay untuk simulasi
    })
  }

  // Simulasi pembayaran kartu kredit
  async processCardPayment(orderId, amount, cardDetails) {
    const transactionId = this.generateTransactionId()

    const transaction = {
      id: transactionId,
      orderId,
      amount,
      method: "card",
      cardLast4: cardDetails.number.slice(-4),
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    this.transactions.set(transactionId, transaction)

    // Simulasi proses pembayaran kartu
    return new Promise((resolve) => {
      setTimeout(() => {
        // 95% success rate untuk kartu kredit
        const isSuccess = Math.random() > 0.05

        if (isSuccess) {
          transaction.status = "completed"
          transaction.completedAt = new Date().toISOString()
          resolve({
            success: true,
            transactionId,
            message: "Card payment successful",
          })
        } else {
          transaction.status = "failed"
          transaction.failedAt = new Date().toISOString()
          transaction.failureReason = "Card declined"
          resolve({
            success: false,
            transactionId,
            message: "Payment failed: Card declined",
          })
        }
      }, 5000) // 5 detik delay untuk simulasi
    })
  }

  // Get transaction status
  getTransactionStatus(transactionId) {
    const transaction = this.transactions.get(transactionId)
    if (!transaction) {
      return { error: "Transaction not found" }
    }
    return transaction
  }

  // Generate unique transaction ID
  generateTransactionId() {
    return "TXN" + crypto.randomBytes(8).toString("hex").toUpperCase()
  }

  // Refund payment (untuk pembatalan pesanan)
  async processRefund(transactionId, amount, reason) {
    const transaction = this.transactions.get(transactionId)

    if (!transaction) {
      return { success: false, message: "Transaction not found" }
    }

    if (transaction.status !== "completed") {
      return { success: false, message: "Cannot refund incomplete transaction" }
    }

    const refundId = this.generateTransactionId()
    const refund = {
      id: refundId,
      originalTransactionId: transactionId,
      amount,
      reason,
      status: "processing",
      createdAt: new Date().toISOString(),
    }

    // Simulasi proses refund
    setTimeout(() => {
      refund.status = "completed"
      refund.completedAt = new Date().toISOString()
      transaction.refunded = true
      transaction.refundId = refundId
    }, 2000)

    return {
      success: true,
      refundId,
      message: "Refund initiated",
    }
  }
}

module.exports = PaymentService
