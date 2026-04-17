import { getConnection } from "../config/db.js";
import { findRoomById, updateRoomStatus } from "../model/roomModel.js";
import {
  createReservation,
  findReservationById,
  getAllReservations,
  getReservationsByUserId,
  hasOverlappingReservation,
  updateReservationStatus,
} from "../model/reservationModel.js";
import { AppError } from "../utils/AppError.js";

const calculateNights = (checkIn, checkOut) => {
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const difference = new Date(checkOut) - new Date(checkIn);
  return Math.ceil(difference / millisecondsPerDay);
};

const ensureReservationAccess = (reservation, user) => {
  if (
    user.role === "admin" ||
    user.role === "receptionist" ||
    reservation.user_id === user.id
  ) {
    return;
  }

  throw new AppError(
    "You do not have permission to access this reservation",
    403,
  );
};

export const listReservations = async (user) => {
  if (user.role === "admin" || user.role === "receptionist") {
    return getAllReservations();
  }

  return getReservationsByUserId(user.id);
};

export const getReservation = async (id, user) => {
  const reservation = await findReservationById(id);

  if (!reservation) {
    throw new AppError("Reservation not found", 404);
  }

  ensureReservationAccess(reservation, user);
  return reservation;
};

// Reservation creation is now atomic with payment (see paymentService.js)
// This function is deprecated and should not be used for direct reservation creation before payment.
export const createReservationRecord = async () => {
  throw new AppError(
    "Direct reservation creation is not allowed. Use payment flow.",
    400,
  );
};

export const cancelReservationRecord = async (id, user) => {
  const reservation = await findReservationById(id);

  if (!reservation) {
    throw new AppError("Reservation not found", 404);
  }

  ensureReservationAccess(reservation, user);

  if (reservation.status === "cancelled") {
    throw new AppError("Reservation is already cancelled", 400);
  }

  const connection = await getConnection();

  try {
    await connection.beginTransaction();
    await updateReservationStatus(id, "cancelled", connection);
    await updateRoomStatus(reservation.room_id, "available", connection);
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  return findReservationById(id);
};

export const checkInReservation = async (id) => {
  const reservation = await findReservationById(id);

  if (!reservation) {
    throw new AppError("Reservation not found", 404);
  }

  if (reservation.status === "cancelled") {
    throw new AppError("Cancelled reservations cannot be checked in", 400);
  }

  const connection = await getConnection();

  try {
    await connection.beginTransaction();
    await updateReservationStatus(id, "confirmed", connection);
    await updateRoomStatus(reservation.room_id, "booked", connection);
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  return findReservationById(id);
};

export const checkOutReservation = async (id) => {
  const reservation = await findReservationById(id);

  if (!reservation) {
    throw new AppError("Reservation not found", 404);
  }

  if (reservation.status !== "confirmed") {
    throw new AppError("Only confirmed reservations can be checked out", 400);
  }

  const connection = await getConnection();

  try {
    await connection.beginTransaction();
    await updateRoomStatus(reservation.room_id, "available", connection);
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  return findReservationById(id);
};
