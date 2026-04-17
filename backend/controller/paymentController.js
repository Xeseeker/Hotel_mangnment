import { asyncHandler } from "../utils/asyncHandler.js";
import {
  createPaymentRecord,
  initiateChapaPaymentAndReservation,
  listPayments,
  verifyAndFinalizeChapaPayment,
} from "../service/paymentService.js";
const getChapaTxRef = (req) =>
  req.body?.tx_ref ||
  req.body?.trx_ref ||
  req.query?.tx_ref ||
  req.query?.trx_ref;

export const initiateChapaPayment = asyncHandler(async (req, res) => {
  console.log("[initiateChapaPayment] body:", req.body, "user:", req.user);
  const { roomId, checkIn, checkOut } = req.body;
  const userId = req.user.id;
  const result = await initiateChapaPaymentAndReservation({
    userId,
    roomId,
    checkIn,
    checkOut,
  });
  console.log("[initiateChapaPayment] result:", result);
  res.json({ success: true, ...result });
});

// POST /api/payments/chapa/confirm (webhook/callback)
export const confirmChapaPayment = asyncHandler(async (req, res) => {
  console.log("[confirmChapaPayment] webhook body:", req.body);
  const tx_ref = getChapaTxRef(req);
  console.log("🔥 CALLBACK HIT");
  console.log("[confirmChapaPayment] query:", req.query);

  if (!tx_ref) {
    return res.status(400).json({
      success: false,
      message: "Missing tx_ref from Chapa callback",
    });
  }

  const result = await verifyAndFinalizeChapaPayment({ tx_ref });
  console.log("[confirmChapaPayment] Reservation created:", result.reservation);

  res.json({ success: true, ...result });
});
export const verifyChapaPayment = asyncHandler(async (req, res) => {
  const tx_ref = getChapaTxRef(req);
  if (!tx_ref) {
    return res.status(400).json({
      success: false,
      message: "Missing tx_ref for payment verification",
    });
  }

  const result = await verifyAndFinalizeChapaPayment({ tx_ref });

  res.json({
    success: true,
    message: "Payment verified and reservation confirmed",
    ...result,
  });
});

export const getPayments = asyncHandler(async (req, res) => {
  const payments = await listPayments(req.user);

  res.json({
    success: true,
    message: "Payments fetched successfully",
    data: payments,
  });
});

export const createPaymentEntry = asyncHandler(async (req, res) => {
  const payment = await createPaymentRecord({
    reservationId: Number(req.body.reservation_id),
    amount: Number(req.body.amount),
    method: req.body.method,
    status: req.body.status || "completed",
    user: req.user,
  });

  res.status(201).json({
    success: true,
    message: "Payment recorded successfully",
    data: payment,
  });
});
