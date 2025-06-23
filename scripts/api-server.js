// Backend API Server menggunakan Node.js + Express + MySQL
const express = require("express")
const cors = require("cors")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const mysql = require("mysql2/promise")
const { v4: uuidv4 } = require("uuid")

const app = express()
const PORT = process.env.PORT || 3001
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

const corsOptions = require("./cors-fix")

// Middleware
app.use(cors(corsOptions))
app.use(express.json())

// Add preflight handling
app.options("*", cors(corsOptions))

// Database connection
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "bikeeats",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}

const pool = mysql.createPool(dbConfig)

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ error: "Access token required" })
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" })
    }
    req.user = user
    next()
  })
}

// Helper function untuk menghitung jarak (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371 // Radius bumi dalam km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Helper function untuk estimasi waktu pengantaran sepeda
function estimateDeliveryTime(distance) {
  // Asumsi kecepatan sepeda 15 km/jam + waktu persiapan
  const bikeSpeed = 15 // km/jam
  const preparationTime = 10 // menit
  const travelTime = (distance / bikeSpeed) * 60 // menit
  return Math.round(preparationTime + travelTime)
}

// ==================== AUTH ENDPOINTS ====================

// Register User
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, phone, password, role = "user" } = req.body

    // Validasi input
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: "All fields are required" })
    }

    // Validasi email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" })
    }

    // Validasi phone format
    if (phone.length < 10) {
      return res.status(400).json({ error: "Phone number must be at least 10 digits" })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)
    const userId = uuidv4()

    // Tentukan tabel berdasarkan role
    let table = "users"
    let insertQuery = "INSERT INTO users (id, name, email, phone, password_hash) VALUES (?, ?, ?, ?, ?)"
    let insertValues = [userId, name, email, phone, passwordHash]

    if (role === "merchant") {
      table = "merchants"
      const { businessName, businessType, address, city } = req.body

      if (!businessName || !businessType || !address || !city) {
        return res.status(400).json({ error: "Business information is required for merchants" })
      }

      insertQuery = `INSERT INTO merchants (id, name, email, phone, password_hash, business_name, business_type, address, city) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      insertValues = [userId, name, email, phone, passwordHash, businessName, businessType, address, city]
    } else if (role === "driver") {
      table = "drivers"
      const { vehicleType = "bicycle", vehicleNumber, licenseNumber } = req.body

      if (!vehicleNumber || !licenseNumber) {
        return res.status(400).json({ error: "Vehicle information is required for drivers" })
      }

      insertQuery = `INSERT INTO drivers (id, name, email, phone, password_hash, vehicle_type, vehicle_number, license_number) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      insertValues = [userId, name, email, phone, passwordHash, vehicleType, vehicleNumber, licenseNumber]
    }

    await pool.execute(insertQuery, insertValues)

    // Generate JWT token
    const token = jwt.sign({ userId, email, role }, JWT_SECRET, { expiresIn: "24h" })

    res.status(201).json({
      message: "Registration successful",
      token,
      user: { id: userId, name, email, phone, role },
    })
  } catch (error) {
    console.error("Registration error:", error)
    if (error.code === "ER_DUP_ENTRY") {
      res.status(400).json({ error: "Email or phone already exists" })
    } else {
      res.status(500).json({ error: "Registration failed" })
    }
  }
})

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password, role = "user" } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" })
    }

    // Tentukan tabel berdasarkan role
    let table = "users"
    if (role === "merchant") table = "merchants"
    else if (role === "driver") table = "drivers"
    else if (role === "admin") table = "admin_users"

    const [rows] = await pool.execute(`SELECT id, name, email, phone, password_hash FROM ${table} WHERE email = ?`, [
      email,
    ])

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" })
    }

    const user = rows[0]
    const isValidPassword = await bcrypt.compare(password, user.password_hash)

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid email or password" })
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, email: user.email, role }, JWT_SECRET, { expiresIn: "24h" })

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ error: "Login failed" })
  }
})

// ==================== MERCHANT ENDPOINTS ====================

// Get all merchants
app.get("/api/merchants", async (req, res) => {
  try {
    const { lat, lng, category, search } = req.query

    let query = `
      SELECT id, business_name as name, address, city, latitude, longitude, 
             profile_image as image, rating, delivery_fee, estimated_delivery_time as deliveryTime,
             business_type as category, is_open, description
      FROM merchants 
      WHERE is_verified = true
    `
    const queryParams = []

    if (category && category !== "all") {
      query += " AND business_type = ?"
      queryParams.push(category)
    }

    if (search) {
      query += " AND business_name LIKE ?"
      queryParams.push(`%${search}%`)
    }

    const [merchants] = await pool.execute(query, queryParams)

    // Hitung jarak jika koordinat user tersedia
    if (lat && lng) {
      merchants.forEach((merchant) => {
        if (merchant.latitude && merchant.longitude) {
          merchant.distance = calculateDistance(
            Number.parseFloat(lat),
            Number.parseFloat(lng),
            merchant.latitude,
            merchant.longitude,
          )
          merchant.estimatedDeliveryTime = estimateDeliveryTime(merchant.distance)
        }
      })

      // Sort berdasarkan jarak
      merchants.sort((a, b) => (a.distance || 999) - (b.distance || 999))
    }

    res.json(merchants)
  } catch (error) {
    console.error("Error fetching merchants:", error)
    res.status(500).json({ error: "Failed to fetch merchants" })
  }
})

// Get merchant by ID
app.get("/api/merchants/:id", async (req, res) => {
  try {
    const { id } = req.params

    const [merchants] = await pool.execute(
      `
      SELECT id, business_name as name, address, city, phone, 
             profile_image as image, rating, delivery_fee, estimated_delivery_time as deliveryTime,
             business_type as category, is_open, description
      FROM merchants 
      WHERE id = ? AND is_verified = true
    `,
      [id],
    )

    if (merchants.length === 0) {
      return res.status(404).json({ error: "Merchant not found" })
    }

    res.json(merchants[0])
  } catch (error) {
    console.error("Error fetching merchant:", error)
    res.status(500).json({ error: "Failed to fetch merchant" })
  }
})

// Get merchant menu
app.get("/api/merchants/:id/menu", async (req, res) => {
  try {
    const { id } = req.params
    const { category } = req.query

    let query = `
      SELECT mi.id, mi.name, mi.description, mi.price, mi.image, 
             mc.name as category, mi.is_available
      FROM menu_items mi
      LEFT JOIN menu_categories mc ON mi.category_id = mc.id
      WHERE mi.merchant_id = ?
    `
    const queryParams = [id]

    if (category && category !== "all") {
      query += " AND mc.name = ?"
      queryParams.push(category)
    }

    query += " ORDER BY mc.display_order, mi.name"

    const [menuItems] = await pool.execute(query, queryParams)
    res.json(menuItems)
  } catch (error) {
    console.error("Error fetching menu:", error)
    res.status(500).json({ error: "Failed to fetch menu" })
  }
})

// ==================== ORDER ENDPOINTS ====================

// Create order
app.post("/api/orders", authenticateToken, async (req, res) => {
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    const { merchantId, items, deliveryAddress, deliveryLatitude, deliveryLongitude, deliveryNotes, paymentMethod } =
      req.body

    // Validasi input
    if (!merchantId || !items || items.length === 0 || !deliveryAddress) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    // Generate order number
    const orderNumber = "ORD" + Date.now().toString().slice(-6)
    const orderId = uuidv4()

    // Hitung subtotal
    let subtotal = 0
    for (const item of items) {
      const [menuItems] = await connection.execute("SELECT price FROM menu_items WHERE id = ? AND merchant_id = ?", [
        item.menuItemId,
        merchantId,
      ])

      if (menuItems.length === 0) {
        throw new Error(`Menu item ${item.menuItemId} not found`)
      }

      subtotal += menuItems[0].price * item.quantity
    }

    // Get merchant info untuk delivery fee
    const [merchants] = await connection.execute("SELECT delivery_fee FROM merchants WHERE id = ?", [merchantId])

    const deliveryFee = merchants[0]?.delivery_fee || 5000
    const serviceFee = Math.round(subtotal * 0.05) // 5% service fee
    const totalAmount = subtotal + deliveryFee + serviceFee

    // Create order
    await connection.execute(
      `
      INSERT INTO orders (
        id, order_number, user_id, merchant_id, status, subtotal, 
        delivery_fee, service_fee, total_amount, payment_method, payment_status,
        delivery_address, delivery_latitude, delivery_longitude, delivery_notes
      ) VALUES (?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?)
    `,
      [
        orderId,
        orderNumber,
        req.user.userId,
        merchantId,
        subtotal,
        deliveryFee,
        serviceFee,
        totalAmount,
        paymentMethod,
        deliveryAddress,
        deliveryLatitude,
        deliveryLongitude,
        deliveryNotes,
      ],
    )

    // Create order items
    for (const item of items) {
      const [menuItems] = await connection.execute("SELECT price FROM menu_items WHERE id = ?", [item.menuItemId])

      const unitPrice = menuItems[0].price
      const totalPrice = unitPrice * item.quantity

      await connection.execute(
        `
        INSERT INTO order_items (id, order_id, menu_item_id, quantity, unit_price, total_price, special_instructions)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
        [uuidv4(), orderId, item.menuItemId, item.quantity, unitPrice, totalPrice, item.specialInstructions || null],
      )
    }

    // Create status history
    await connection.execute(
      `
      INSERT INTO order_status_history (id, order_id, status, created_by)
      VALUES (?, ?, 'pending', ?)
    `,
      [uuidv4(), orderId, req.user.userId],
    )

    await connection.commit()

    res.status(201).json({
      message: "Order created successfully",
      orderId,
      orderNumber,
      totalAmount,
    })
  } catch (error) {
    await connection.rollback()
    console.error("Error creating order:", error)
    res.status(500).json({ error: "Failed to create order" })
  } finally {
    connection.release()
  }
})

// Get order by ID
app.get("/api/orders/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params

    const [orders] = await pool.execute(
      `
      SELECT o.*, m.business_name as merchant_name, d.name as driver_name, d.phone as driver_phone
      FROM orders o
      LEFT JOIN merchants m ON o.merchant_id = m.id
      LEFT JOIN drivers d ON o.driver_id = d.id
      WHERE o.id = ? AND o.user_id = ?
    `,
      [id, req.user.userId],
    )

    if (orders.length === 0) {
      return res.status(404).json({ error: "Order not found" })
    }

    const order = orders[0]

    // Get order items
    const [orderItems] = await pool.execute(
      `
      SELECT oi.*, mi.name as item_name
      FROM order_items oi
      JOIN menu_items mi ON oi.menu_item_id = mi.id
      WHERE oi.order_id = ?
    `,
      [id],
    )

    // Get status history
    const [statusHistory] = await pool.execute(
      `
      SELECT * FROM order_status_history
      WHERE order_id = ?
      ORDER BY created_at ASC
    `,
      [id],
    )

    order.items = orderItems
    order.statusHistory = statusHistory

    res.json(order)
  } catch (error) {
    console.error("Error fetching order:", error)
    res.status(500).json({ error: "Failed to fetch order" })
  }
})

// Get user orders
app.get("/api/orders", authenticateToken, async (req, res) => {
  try {
    const { status, limit = 20, offset = 0 } = req.query

    let query = `
      SELECT o.*, m.business_name as merchant_name
      FROM orders o
      JOIN merchants m ON o.merchant_id = m.id
      WHERE o.user_id = ?
    `
    const queryParams = [req.user.userId]

    if (status) {
      query += " AND o.status = ?"
      queryParams.push(status)
    }

    query += " ORDER BY o.created_at DESC LIMIT ? OFFSET ?"
    queryParams.push(Number.parseInt(limit))
    queryParams.push(Number.parseInt(offset))

    const [orders] = await pool.execute(query, queryParams)

    res.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    res.status(500).json({ error: "Failed to fetch orders" })
  }
})
