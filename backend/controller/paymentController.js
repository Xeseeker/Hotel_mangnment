import { asyncHandler } from "../utils/asyncHandler.js";
import { createPaymentRecord, listPayments } from "../service/paymentService.js";

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
