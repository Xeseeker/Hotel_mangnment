import express from "express";
import {
  registerAdmin,
  registerReceptionist,
} from "../controller/adminController.js";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/role.js";
import { validate } from "../middleware/validate.js";
import { validateRegister } from "../utils/validators.js";

const router = express.Router();

router.post(
  "/register-admin",
  // authenticate,
  //   authorize("admin"),
  validate(validateRegister),
  registerAdmin,
);

router.post(
  "/register-receptionist",
  authenticate,
  authorize("admin"),
  validate(validateRegister),
  registerReceptionist,
);

export default router;
