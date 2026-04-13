import express from "express";
import { createPaymentEntry, getPayments } from "../controller/paymentController.js";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/role.js";
import { validate } from "../middleware/validate.js";
import { validatePayment } from "../utils/validators.js";

const router = express.Router();

router.use(authenticate);

router.get("/", authorize("admin", "receptionist", "customer"), getPayments);
router.post(
  "/",
  authorize("admin", "receptionist", "customer"),
  validate(validatePayment),
  createPaymentEntry,
);

export default router;
