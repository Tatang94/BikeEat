// Seed data untuk development dan testing
const { v4: uuidv4 } = require("uuid")
const bcrypt = require("bcryptjs")

// Sample data untuk seeding database
const seedData = {
  // Admin users
  adminUsers: [
    {
      id: uuidv4(),
      name: "Super Admin",
      email: "admin@bikeeats.com",
      password_hash: bcrypt.hashSync("admin123", 10),
      role: "super_admin",
      is_active: true,
    },
  ],

  // Sample users
  users: [
    {
      id: uuidv4(),
      name: "John Doe",
      email: "john@example.com",
      phone: "081234567890",
      password_hash: bcrypt.hashSync("password123", 10),
      is_verified: true,
    },
    {
      id: uuidv4(),
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "081234567891",
      password_hash: bcrypt.hashSync("password123", 10),
      is_verified: true,
    },
  ],

  // Sample merchants
  merchants: [
    {
      id: uuidv4(),
      name: "Ahmad Merchant",
      email: "warung@padang.com",
      phone: "081234567892",
      password_hash: bcrypt.hashSync("merchant123", 10),
      business_name: "Warung Padang Sederhana",
      business_type: "restaurant",
      address: "Jl. Sudirman No. 123, Jakarta Selatan",
      city: "Jakarta",
      latitude: -6.2088,
      longitude: 106.8456,
      description: "Warung Padang dengan cita rasa autentik",
      is_open: true,
      is_verified: true,
      rating: 4.5,
      total_reviews: 150,
      delivery_fee: 3000,
      min_order_amount: 15000,
      estimated_delivery_time: "15-25 min",
    },
    {
      id: uuidv4(),
      name: "McDonald Manager",
      email: "manager@mcdonalds.com",
      phone: "081234567893",
      password_hash: bcrypt.hashSync("merchant123", 10),
      business_name: "McDonald's Thamrin",
      business_type: "fast_food",
      address: "Jl. Thamrin No. 456, Jakarta Pusat",
      city: "Jakarta",
      latitude: -6.1944,
      longitude: 106.8229,
      description: "Fast food restaurant dengan menu internasional",
      is_open: true,
      is_verified: true,
      rating: 4.2,
      total_reviews: 300,
      delivery_fee: 5000,
      min_order_amount: 25000,
      estimated_delivery_time: "20-30 min",
    },
  ],

  // Sample drivers
  drivers: [
    {
      id: uuidv4(),
      name: "Ahmad Rizki",
      email: "ahmad@driver.com",
      phone: "081234567894",
      password_hash: bcrypt.hashSync("driver123", 10),
      vehicle_type: "bicycle",
      vehicle_number: "B 1234 XYZ",
      license_number: "DRV001",
      is_online: true,
      is_verified: true,
      rating: 4.8,
      total_reviews: 200,
      current_latitude: -6.2088,
      current_longitude: 106.8456,
      total_earnings: 2500000,
      total_deliveries: 150,
    },
    {
      id: uuidv4(),
      name: "Budi Santoso",
      email: "budi@driver.com",
      phone: "081234567895",
      password_hash: bcrypt.hashSync("driver123", 10),
      vehicle_type: "bicycle",
      vehicle_number: "B 5678 ABC",
      license_number: "DRV002",
      is_online: false,
      is_verified: true,
      rating: 4.6,
      total_reviews: 180,
      current_latitude: -6.1944,
      current_longitude: 106.8229,
      total_earnings: 2200000,
      total_deliveries: 130,
    },
  ],
}

// Function untuk insert seed data
async function seedDatabase(db) {
  try {
    console.log("Starting database seeding...")

    // Insert admin users
    for (const admin of seedData.adminUsers) {
      await db.query(
        "INSERT INTO admin_users (id, name, email, password_hash, role, is_active) VALUES (?, ?, ?, ?, ?, ?)",
        [admin.id, admin.name, admin.email, admin.password_hash, admin.role, admin.is_active],
      )
    }

    // Insert users
    for (const user of seedData.users) {
      await db.query(
        "INSERT INTO users (id, name, email, phone, password_hash, is_verified) VALUES (?, ?, ?, ?, ?, ?)",
        [user.id, user.name, user.email, user.phone, user.password_hash, user.is_verified],
      )
    }

    // Insert merchants
    for (const merchant of seedData.merchants) {
      await db.query(
        `
        INSERT INTO merchants (
          id, name, email, phone, password_hash, business_name, business_type, 
          address, city, latitude, longitude, description, is_open, is_verified, 
          rating, total_reviews, delivery_fee, min_order_amount, estimated_delivery_time
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          merchant.id,
          merchant.name,
          merchant.email,
          merchant.phone,
          merchant.password_hash,
          merchant.business_name,
          merchant.business_type,
          merchant.address,
          merchant.city,
          merchant.latitude,
          merchant.longitude,
          merchant.description,
          merchant.is_open,
          merchant.is_verified,
          merchant.rating,
          merchant.total_reviews,
          merchant.delivery_fee,
          merchant.min_order_amount,
          merchant.estimated_delivery_time,
        ],
      )
    }

    // Insert drivers
    for (const driver of seedData.drivers) {
      await db.query(
        `
        INSERT INTO drivers (
          id, name, email, phone, password_hash, vehicle_type, vehicle_number,
          license_number, is_online, is_verified, rating, total_reviews,
          current_latitude, current_longitude, total_earnings, total_deliveries
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          driver.id,
          driver.name,
          driver.email,
          driver.phone,
          driver.password_hash,
          driver.vehicle_type,
          driver.vehicle_number,
          driver.license_number,
          driver.is_online,
          driver.is_verified,
          driver.rating,
          driver.total_reviews,
          driver.current_latitude,
          driver.current_longitude,
          driver.total_earnings,
          driver.total_deliveries,
        ],
      )
    }

    console.log("Database seeding completed successfully!")
  } catch (error) {
    console.error("Error seeding database:", error)
    throw error
  }
}

module.exports = { seedData, seedDatabase }
