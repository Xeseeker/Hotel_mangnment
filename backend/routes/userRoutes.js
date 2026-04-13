import express from "express";
import { getMe, getUsers, updateUserRoleEntry } from "../controller/userController.js";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/role.js";

const router = express.Router();

router.get("/me", authenticate, getMe);
router.get("/", authenticate, authorize("admin"), getUsers);
router.patch("/:id/role", authenticate, authorize("admin"), updateUserRoleEntry);

export default router;
