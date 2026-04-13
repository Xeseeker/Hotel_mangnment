import { asyncHandler } from "../utils/asyncHandler.js";
import {
  cancelReservationRecord,
  checkInReservation,
  checkOutReservation,
  createReservationRecord,
  getReservation,
  listReservations,
} from "../service/reservationService.js";

export const getReservations = asyncHandler(async (req, res) => {
  const reservations = await listReservations(req.user);

  res.json({
    success: true,
    message: "Reservations fetched successfully",
    data: reservations,
  });
});

export const getSingleReservation = asyncHandler(async (req, res) => {
  const reservation = await getReservation(Number(req.params.id), req.user);

  res.json({
    success: true,
    message: "Reservation fetched successfully",
    data: reservation,
  });
});

export const createReservationEntry = asyncHandler(async (req, res) => {
  const userId =
    req.user.role === "customer" ? req.user.id : Number(req.body.user_id || req.user.id);

  const reservation = await createReservationRecord({
    userId,
    roomId: Number(req.body.room_id),
    checkIn: req.body.check_in,
    checkOut: req.body.check_out,
  });

  res.status(201).json({
    success: true,
    message: "Reservation created successfully",
    data: reservation,
  });
});

export const cancelReservationEntry = asyncHandler(async (req, res) => {
  const reservation = await cancelReservationRecord(Number(req.params.id), req.user);

  res.json({
    success: true,
    message: "Reservation cancelled successfully",
    data: reservation,
  });
});

export const checkInReservationEntry = asyncHandler(async (req, res) => {
  const reservation = await checkInReservation(Number(req.params.id));

  res.json({
    success: true,
    message: "Guest checked in successfully",
    data: reservation,
  });
});

export const checkOutReservationEntry = asyncHandler(async (req, res) => {
  const reservation = await checkOutReservation(Number(req.params.id));

  res.json({
    success: true,
    message: "Guest checked out successfully",
    data: reservation,
  });
});
