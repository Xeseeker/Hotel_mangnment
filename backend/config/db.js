import dotenv from "dotenv";
dotenv.config();

import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "HotelDB",
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
  queueLimit: 0,
});

export const query = async (sql, params = []) => {
  const [rows] = await pool.execute(sql, params);
  return rows;
};

export const getConnection = async () => pool.getConnection();

// Test connection once at startup
pool.getConnection()
  .then((conn) => {
    console.log("✅ MySQL pool connected!");
    conn.release(); // release connection back to pool
  })
  .catch((err) => {
    console.error("❌ MySQL pool connection error:", err.message);
  });

export default pool;
