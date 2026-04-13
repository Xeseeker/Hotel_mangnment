import { query } from "../config/db.js";

export const createRoom = async ({
  room_number,
  type,
  image_url,
  price,
  status,
}) => {
  const result = await query(
    `INSERT INTO rooms (room_number, type, image_url, price, status)
     VALUES (?, ?, ?, ?, ?)`,
    [room_number, type, image_url || null, price, status || "available"],
  );

  return findRoomById(result.insertId);
};

export const getAllRooms = async () =>
  query(
    `SELECT id, room_number, type, image_url, price, status
     FROM rooms
     ORDER BY room_number ASC`,
  );

export const findRoomById = async (id) => {
  const rows = await query(
    `SELECT id, room_number, type, image_url, price, status
     FROM rooms
     WHERE id = ?
     LIMIT 1`,
    [id],
  );

  return rows[0] || null;
};

export const findRoomByNumber = async (roomNumber) => {
  const rows = await query(
    `SELECT id, room_number, type, image_url, price, status
     FROM rooms
     WHERE room_number = ?
     LIMIT 1`,
    [roomNumber],
  );

  return rows[0] || null;
};

export const updateRoom = async (id, payload) => {
  await query(
    `UPDATE rooms
     SET room_number = ?, type = ?, image_url = ?, price = ?, status = ?
     WHERE id = ?`,
    [
      payload.room_number,
      payload.type,
      payload.image_url || null,
      payload.price,
      payload.status || "available",
      id,
    ],
  );

  return findRoomById(id);
};

export const deleteRoom = async (id) => {
  const result = await query("DELETE FROM rooms WHERE id = ?", [id]);
  return result.affectedRows > 0;
};

export const updateRoomStatus = async (id, status, connection = null) => {
  if (connection) {
    await connection.execute("UPDATE rooms SET status = ? WHERE id = ?", [status, id]);
    return;
  }

  await query("UPDATE rooms SET status = ? WHERE id = ?", [status, id]);
};
