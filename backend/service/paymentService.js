import { randomUUID } from "crypto";
import { getConnection } from "../config/db.js";
import { findPaymentByReservationId, createPayment, getPayments, getPaymentsByUserId } from "../model/paymentModel.js";
import { updateRoomStatus } from "../model/roomModel.js";
import { findReservationById, updateReservationStatus } from "../model/reservationModel.js";
import { AppError } from "../utils/AppError.js";

export const listPayments = async (user) => {
  if (user.role === "admin" || user.role === "receptionist") {
    return getPayments();
  }

  return getPaymentsByUserId(user.id);
};

export const createPaymentRecord = async ({
  reservationId,
  amount,
  method,
  status = "completed",
  user,
}) => {
  const reservation = await findReservationById(reservationId);

  if (!reservation) {
    throw new AppError("Reservation not found", 404);
  }

  if (user.role === "customer" && reservation.user_id !== user.id) {
    throw new AppError("You can only pay for your own reservation", 403);
  }

  if (reservation.status === "cancelled") {
    throw new AppError("Cannot pay for a cancelled reservation", 400);
  }

  const existingPayment = await findPaymentByReservationId(reservationId);

  if (existingPayment && existingPayment.status === "completed") {
    throw new AppError("Reservation has already been paid", 409);
  }

  if (Number(amount) !== Number(reservation.total_price)) {
    throw new AppError("Payment amount must match reservation total price", 400);
  }

  const connection = await getConnection();

  try {
    await connection.beginTransaction();
    const payment = await createPayment(
      {
        reservation_id: reservationId,
        amount,
        method,
        status,
        transaction_id: `TXN-${randomUUID()}`,
      },
      connection,
    );

    if (status === "completed") {
      await updateReservationStatus(reservationId, "confirmed", connection);
      await updateRoomStatus(reservation.room_id, "booked", connection);
    }

    await connection.commit();
    return payment;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
