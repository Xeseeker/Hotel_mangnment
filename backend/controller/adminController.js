import { asyncHandler } from "../utils/asyncHandler.js";
import {
  registerAdminUser,
  registerReceptionistUser,
} from "../service/userService.js";

export const registerAdmin = asyncHandler(async (req, res) => {
  const result = await registerAdminUser(req.body);

  res.status(201).json({
    success: true,
    message: "Admin registered successfully",
    data: result,
  });
});

export const registerReceptionist = asyncHandler(async (req, res) => {
  const result = await registerReceptionistUser(req.body);

  res.status(201).json({
    success: true,
    message: "Receptionist registered successfully",
    data: result,
  });
});
