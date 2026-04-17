import mysql from "mysql2/promise";
import { env } from "./env.js";

const pool = mysql.createPool({
  host: env.DB_HOST,
  port: Number(env.DB_PORT || 3306),
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  waitForConnections: true,
  connectionLimit: Number(env.DB_CONNECTION_LIMIT || 10),
  queueLimit: 0,
});

export const query = async (sql, params = []) => {
  const [rows] = await pool.execute(sql, params);
  return rows;
};

export const getConnection = async () => pool.getConnection();

// Test connection once at startup
pool
  .getConnection()
  .then((conn) => {
    console.log("✅ MySQL pool connected!");
    conn.release(); // release connection back to pool
  })
  .catch((err) => {
    console.error("❌ MySQL pool connection error:", err.message);
  });

export default pool;
