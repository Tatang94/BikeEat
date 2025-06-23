// Database initialization script
const mysql = require("mysql2/promise")
const fs = require("fs")
const path = require("path")

async function initializeDatabase() {
  try {
    // Connect to MySQL without specifying database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
    })

    // Create database if it doesn't exist
    await connection.execute("CREATE DATABASE IF NOT EXISTS bikeeats")
    console.log('Database "bikeeats" created or already exists')

    // Close connection
    await connection.end()

    // Now connect to the bikeeats database
    const dbConnection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: "bikeeats",
    })

    // Read and execute schema
    const schemaPath = path.join(__dirname, "database-schema.sql")
    const schema = fs.readFileSync(schemaPath, "utf8")

    // Split by semicolon and execute each statement
    const statements = schema.split(";").filter((stmt) => stmt.trim())

    for (const statement of statements) {
      if (statement.trim()) {
        await dbConnection.execute(statement)
      }
    }

    console.log("Database schema created successfully")

    // Seed data
    const { seedDatabase } = require("./seed-data")
    await seedDatabase(dbConnection)

    await dbConnection.end()
    console.log("Database initialization completed!")
  } catch (error) {
    console.error("Database initialization failed:", error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  initializeDatabase()
}

module.exports = { initializeDatabase }
