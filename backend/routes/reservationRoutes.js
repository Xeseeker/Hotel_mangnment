import express from "express";
import {
  cancelReservationEntry,
  checkInReservationEntry,
  checkOutReservationEntry,
  createReservationEntry,
  getReservations,
  getSingleReservation,
} from "../controller/reservationController.js";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/role.js";
import { validate } from "../middleware/validate.js";
import { validateReservation } from "../utils/validators.js";

const router = express.Router();

router.use(authenticate);

router.get("/", getReservations);
router.get("/:id", getSingleReservation);
router.post(
  "/",
  authorize("admin", "receptionist", "customer"),
  validate(validateReservation),
  createReservationEntry,
);
router.patch(
  "/:id/cancel",
  authorize("admin", "receptionist", "customer"),
  cancelReservationEntry,
);
router.patch(
  "/:id/check-in",
  authorize("admin", "receptionist"),
  checkInReservationEntry,
);
router.patch(
  "/:id/check-out",
  authorize("admin", "receptionist"),
  checkOutReservationEntry,
);

export default router;
