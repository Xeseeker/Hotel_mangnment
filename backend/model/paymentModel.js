import { query } from "../config/db.js";

const createExecutor = (connection) =>
  connection || {
    execute: async (statement, params) => {
      const rows = await query(statement, params);
      return [rows];
    },
  };

export const createPayment = async (
  { reservation_id, amount, method, status, transaction_id },
  connection,
) => {
  const [result] = await connection.execute(
    `INSERT INTO payments (reservation_id, amount, method, status, transaction_id)
     VALUES (?, ?, ?, ?, ?)`,
    [reservation_id, amount, method, status, transaction_id],
  );

  return findPaymentById(result.insertId, connection);
};

export const findPaymentById = async (id, connection = null) => {
  const executor = createExecutor(connection);
  const [rows] = await executor.execute(
    `SELECT id, reservation_id, amount, method, status, transaction_id
     FROM payments
     WHERE id = ?
     LIMIT 1`,
    [id],
  );

  return rows[0] || null;
};

export const getPayments = async () =>
  query(
    `SELECT p.id, p.reservation_id, p.amount, p.method, p.status, p.transaction_id,
            r.user_id, r.room_id
     FROM payments p
     JOIN reservations r ON r.id = p.reservation_id
     ORDER BY p.id DESC`,
  );

export const getPaymentsByUserId = async (userId) =>
  query(
    `SELECT p.id, p.reservation_id, p.amount, p.method, p.status, p.transaction_id
     FROM payments p
     JOIN reservations r ON r.id = p.reservation_id
     WHERE r.user_id = ?
     ORDER BY p.id DESC`,
    [userId],
  );

export const findPaymentByReservationId = async (reservationId) => {
  const rows = await query(
    `SELECT id, reservation_id, amount, method, status, transaction_id
     FROM payments
     WHERE reservation_id = ?
     ORDER BY id DESC
     LIMIT 1`,
    [reservationId],
  );

  return rows[0] || null;
};
