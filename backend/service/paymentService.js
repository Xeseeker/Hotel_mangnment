import {
  hasOverlappingReservation,
  createReservation,
} from "../model/reservationModel.js";
import { findRoomById } from "../model/roomModel.js";
import axios from "axios";
import {
  createPaymentIntent,
  findPaymentIntentByTxRef,
  deletePaymentIntentByTxRef,
} from "../model/paymentIntentModel.js";
import { randomUUID } from "crypto";
import { getConnection } from "../config/db.js";
import {
  findPaymentByReservationId,
  createPayment,
  getPayments,
  getPaymentsByUserId,
  findPaymentByTransactionId,
} from "../model/paymentModel.js";
import { updateRoomStatus } from "../model/roomModel.js";
import {
  findReservationById,
  updateReservationStatus,
} from "../model/reservationModel.js";
import { AppError } from "../utils/AppError.js";
// Chapa payment + reservation atomic flow
export const initiateChapaPaymentAndReservation = async ({
  userId,
  roomId,
  checkIn,
  checkOut,
}) => {
  // 1. Check room availability (again, to avoid race condition)
  const conflict = await hasOverlappingReservation(roomId, checkIn, checkOut);
  if (conflict) {
    throw new AppError("Room is not available for selected dates", 409);
  }
  // 2. Calculate total price
  // (Assume findRoomById and calculateNights are available)
  const room = await findRoomById(roomId);
  if (!room) throw new AppError("Room not found", 404);
  const nights = Math.ceil(
    (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24),
  );
  if (nights <= 0)
    throw new AppError("Reservation must be at least one night", 400);
  const totalPrice = Number(room.price) * nights;
  // 3. Initiate Chapa payment (real integration)
  // See: https://developer.chapa.co/docs/collect/api-reference/create-payment/
  const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY;
  if (!CHAPA_SECRET_KEY)
    throw new AppError("Chapa secret key not configured", 500);
  const callbackUrl =
    process.env.CHAPA_CALLBACK_URL ||
    "http://localhost:5000/api/payments/chapa/confirm";
  const txRef = `hotel_${userId}_${Date.now()}`;
  const baseReturnUrl =
    process.env.CHAPA_RETURN_URL || "http://localhost:3000/reservations";
  const returnUrl = baseReturnUrl.includes("?") 
    ? `${baseReturnUrl}&tx_ref=${txRef}`
    : `${baseReturnUrl}?tx_ref=${txRef}`;

  // Store payment intent
  await createPaymentIntent({
    tx_ref: txRef,
    user_id: userId,
    room_id: roomId,
    check_in: checkIn,
    check_out: checkOut,
    amount: totalPrice,
  });
  let chapaData;
  try {
    const chapaRes = await axios.post(
      "https://api.chapa.co/v1/transaction/initialize",
      {
        amount: totalPrice,
        currency: "ETB",
        email: `user${userId}@hotel.com`,
        first_name: "Hotel",
        last_name: "Guest",
        tx_ref: txRef,
        callback_url: callbackUrl,
        return_url: returnUrl,
        customization: {
          title: "Hotel Booking",
          description: `Booking for room ${roomId}`,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );
    chapaData = chapaRes.data;
  } catch (err) {
    throw new AppError(
      err.response?.data?.message || "Failed to initiate Chapa payment",
      500,
    );
  }
  if (!chapaData.status || chapaData.status !== "success") {
    throw new AppError(
      chapaData.message || "Failed to initiate Chapa payment",
      500,
    );
  }
  return { paymentUrl: chapaData.data.checkout_url, totalPrice };
};

const verifyChapaTransaction = async (tx_ref) => {
  const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY;
  if (!CHAPA_SECRET_KEY) {
    throw new AppError("Chapa secret key not configured", 500);
  }

  let chapaData;
  try {
    const chapaRes = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
      {
        headers: {
          Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
        },
      },
    );
    chapaData = chapaRes.data;
  } catch (err) {
    throw new AppError(
      err.response?.data?.message || "Failed to verify Chapa payment",
      500,
    );
  }

  if (chapaData?.status !== "success") {
    throw new AppError(
      chapaData?.message || "Failed to verify Chapa payment",
      400,
    );
  }

  if (chapaData?.data?.status !== "success") {
    throw new AppError("Payment has not been completed successfully", 400);
  }

  return chapaData.data;
};

export const finalizeReservationAfterChapaPayment = async ({
  tx_ref,
  chapaReference,
}) => {
  const intent = await findPaymentIntentByTxRef(tx_ref);

  if (!intent) {
    const existingPayment = await findPaymentByTransactionId(
      chapaReference || tx_ref,
    );
    if (!existingPayment) {
      throw new AppError("Payment intent not found", 404);
    }

    const existingReservation = await findReservationById(
      existingPayment.reservation_id,
    );
    if (!existingReservation) {
      throw new AppError("Reservation not found for verified payment", 404);
    }

    return existingReservation;
  }

  const conflict = await hasOverlappingReservation(
    intent.room_id,
    intent.check_in,
    intent.check_out,
  );
  if (conflict) {
    throw new AppError("Room is not available for selected dates", 409);
  }
  const connection = await getConnection();
  try {
    await connection.beginTransaction();
    
    // Atomically delete the intent to prevent concurrent duplicate processing
    const [deleteResult] = await connection.execute(
      `DELETE FROM payment_intents WHERE tx_ref = ?`,
      [tx_ref]
    );

    if (deleteResult.affectedRows === 0) {
      // Expected if webhook or another thread processed it already
      await connection.rollback();
      const existingPayment = await findPaymentByTransactionId(chapaReference || tx_ref);
      if (existingPayment) {
        const existingReservation = await findReservationById(existingPayment.reservation_id);
        return existingReservation;
      }
      throw new AppError("Payment intent already processed but missing payment record", 409);
    }

    const reservation = await createReservation(
      {
        user_id: intent.user_id,
        room_id: intent.room_id,
        check_in: intent.check_in,
        check_out: intent.check_out,
        total_price: intent.amount,
        status: "confirmed",
      },
      connection,
    );

    await createPayment(
      {
        reservation_id: reservation.id,
        amount: intent.amount,
        method: "chapa",
        status: "completed",
        transaction_id: chapaReference || tx_ref,
      },
      connection,
    );

    await updateRoomStatus(intent.room_id, "booked", connection);
    await connection.commit();
    return reservation;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const verifyAndFinalizeChapaPayment = async ({ tx_ref }) => {
  const chapaTransaction = await verifyChapaTransaction(tx_ref);
  const chapaTxRef = chapaTransaction.tx_ref || tx_ref;
  const chapaReference = chapaTransaction.reference || chapaTxRef;
  const reservation = await finalizeReservationAfterChapaPayment({
    tx_ref: chapaTxRef,
    chapaReference,
  });

  return {
    reservation,
    payment: chapaTransaction,
  };
};

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
    throw new AppError(
      "Payment amount must match reservation total price",
      400,
    );
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
