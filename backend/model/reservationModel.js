import { query } from "../config/db.js";

const createExecutor = (connection) =>
  connection || {
    execute: async (statement, params) => {
      const rows = await query(statement, params);
      return [rows];
    },
  };

export const createReservation = async (
  { user_id, room_id, check_in, check_out, total_price, status = "pending" },
  connection,
) => {
  const [result] = await connection.execute(
    `INSERT INTO reservations (user_id, room_id, check_in, check_out, status, total_price)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [user_id, room_id, check_in, check_out, status, total_price],
  );

  return findReservationById(result.insertId, connection);
};

export const findReservationById = async (id, connection = null) => {
  const executor = createExecutor(connection);
  const [rows] = await executor.execute(
    `SELECT r.id, r.user_id, r.room_id, r.check_in, r.check_out, r.status, r.total_price,
            u.name AS user_name, u.email AS user_email,
            rm.room_number, rm.type AS room_type, rm.price AS room_price
     FROM reservations r
     JOIN users u ON u.id = r.user_id
     JOIN rooms rm ON rm.id = r.room_id
     WHERE r.id = ?
     LIMIT 1`,
    [id],
  );

  return rows[0] || null;
};

export const getAllReservations = async () =>
  query(
    `SELECT r.id, r.user_id, r.room_id, r.check_in, r.check_out, r.status, r.total_price,
            u.name AS user_name, u.email AS user_email,
            rm.room_number, rm.type AS room_type
     FROM reservations r
     JOIN users u ON u.id = r.user_id
     JOIN rooms rm ON rm.id = r.room_id
     ORDER BY r.id DESC`,
  );

export const getReservationsByUserId = async (userId) =>
  query(
    `SELECT r.id, r.user_id, r.room_id, r.check_in, r.check_out, r.status, r.total_price,
            rm.room_number, rm.type AS room_type, rm.image_url, rm.price AS room_price
     FROM reservations r
     JOIN rooms rm ON rm.id = r.room_id
     WHERE r.user_id = ?
     ORDER BY r.id DESC`,
    [userId],
  );

export const hasOverlappingReservation = async (
  roomId,
  checkIn,
  checkOut,
  excludedReservationId = null,
  connection = null,
) => {
  const executor = createExecutor(connection);
  const sql = `
    SELECT id
    FROM reservations
    WHERE room_id = ?
      AND status IN ('pending', 'confirmed')
      AND check_in < ?
      AND check_out > ?
      ${excludedReservationId ? "AND id != ?" : ""}
    LIMIT 1
  `;
  const params = excludedReservationId
    ? [roomId, checkOut, checkIn, excludedReservationId]
    : [roomId, checkOut, checkIn];
  const [rows] = await executor.execute(sql, params);

  return Boolean(rows[0]);
};

export const updateReservationStatus = async (id, status, connection = null) => {
  const executor = createExecutor(connection);
  await executor.execute("UPDATE reservations SET status = ? WHERE id = ?", [status, id]);
};
