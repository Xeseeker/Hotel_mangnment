import express from "express";
import {
  createRoomRecord,
  deleteRoomRecord,
  getRooms,
  getSingleRoom,
  updateRoomRecord,
  checkRoomAvailability,
} from "../controller/roomController.js";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/role.js";
import { uploadRoomImage } from "../middleware/upload.js";
import { validate } from "../middleware/validate.js";
import { validateRoom } from "../utils/validators.js";

const router = express.Router();

router.get("/", getRooms);
router.get("/:id", getSingleRoom);
router.get("/:id/availability", checkRoomAvailability);
router.post(
  "/",
  authenticate,
  authorize("admin"),
  uploadRoomImage,
  validate(validateRoom),
  createRoomRecord,
);
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  uploadRoomImage,
  validate(validateRoom),
  updateRoomRecord,
);
router.delete("/:id", authenticate, authorize("admin"), deleteRoomRecord);

export default router;
