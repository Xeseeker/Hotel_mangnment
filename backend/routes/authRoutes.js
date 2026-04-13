import express from "express";
import { login, register } from "../controller/authController.js";
import { validate } from "../middleware/validate.js";
import { validateLogin, validateRegister } from "../utils/validators.js";

const router = express.Router();

router.post("/register", validate(validateRegister), register);
router.post("/login", validate(validateLogin), login);

export default router;
