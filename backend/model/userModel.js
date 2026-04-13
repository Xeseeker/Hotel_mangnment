import { query } from "../config/db.js";

export const createUser = async ({ name, email, password, role }) => {
  const result = await query(
    `INSERT INTO users (name, email, password, role)
     VALUES (?, ?, ?, ?)`,
    [name, email, password, role],
  );

  return findUserById(result.insertId);
};

export const findUserByEmail = async (email) => {
  const rows = await query("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
  return rows[0] || null;
};

export const findUserById = async (id) => {
  const rows = await query(
    `SELECT id, name, email, role, created_at
     FROM users
     WHERE id = ?
     LIMIT 1`,
    [id],
  );

  return rows[0] || null;
};

export const getAllUsers = async () =>
  query(
    `SELECT id, name, email, role, created_at
     FROM users
     ORDER BY created_at DESC`,
  );

export const updateUserRole = async (id, role) => {
  await query("UPDATE users SET role = ? WHERE id = ?", [role, id]);
  return findUserById(id);
};
