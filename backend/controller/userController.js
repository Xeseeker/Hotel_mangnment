import { asyncHandler } from "../utils/asyncHandler.js";
import { changeUserRole, getProfile, listUsers } from "../service/userService.js";

export const getMe = asyncHandler(async (req, res) => {
  const user = await getProfile(req.user.id);

  res.json({
    success: true,
    message: "Profile fetched successfully",
    data: user,
  });
});

export const getUsers = asyncHandler(async (req, res) => {
  const users = await listUsers();

  res.json({
    success: true,
    message: "Users fetched successfully",
    data: users,
  });
});

export const updateUserRoleEntry = asyncHandler(async (req, res) => {
  const user = await changeUserRole(Number(req.params.id), req.body.role);

  res.json({
    success: true,
    message: "User role updated successfully",
    data: user,
  });
});
