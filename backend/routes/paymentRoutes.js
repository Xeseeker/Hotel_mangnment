import express from "express";
import {
  initiateChapaPayment,
  confirmChapaPayment,
  verifyChapaPayment,
} from "../controller/paymentController.js";

import {
  createPaymentEntry,
  getPayments,
} from "../controller/paymentController.js";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/role.js";
import { validate } from "../middleware/validate.js";
import { validatePayment } from "../utils/validators.js";

const router = express.Router();

//router.use(authenticate);
router.post("/chapa/initiate", authenticate, initiateChapaPayment);
router.post("/chapa/confirm", confirmChapaPayment);
router.get("/chapa/verify", verifyChapaPayment);

router.get(
  "/",
  authenticate,
  authorize("admin", "receptionist", "customer"),
  getPayments,
);
router.post(
  "/",
  authenticate,
  authorize("admin", "receptionist", "customer"),
  validate(validatePayment),
  createPaymentEntry,
);

export default router;
