import { query } from "../config/db.js";

const createExecutor = (connection) =>
  connection || {
    execute: async (statement, params) => {
      const rows = await query(statement, params);
      return [rows];
    },
  };

export const createPaymentIntent = async ({
  tx_ref,
  user_id,
  room_id,
  check_in,
  check_out,
  amount,
}) => {
  await query(
    `INSERT INTO payment_intents (tx_ref, user_id, room_id, check_in, check_out, amount) VALUES (?, ?, ?, ?, ?, ?)`,
    [tx_ref, user_id, room_id, check_in, check_out, amount],
  );
};

export const findPaymentIntentByTxRef = async (tx_ref) => {
  const rows = await query(
    `SELECT * FROM payment_intents WHERE tx_ref = ? LIMIT 1`,
    [tx_ref],
  );
  return rows[0] || null;
};

export const deletePaymentIntentByTxRef = async (tx_ref, connection = null) => {
  const executor = createExecutor(connection);
  await executor.execute(`DELETE FROM payment_intents WHERE tx_ref = ?`, [tx_ref]);
};
