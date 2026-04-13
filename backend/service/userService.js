import { registerUser } from "./authService.js";
import { findUserById, getAllUsers, updateUserRole } from "../model/userModel.js";
import { AppError } from "../utils/AppError.js";

export const getProfile = async (id) => {
  const user = await findUserById(id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

export const listUsers = async () => getAllUsers();

export const changeUserRole = async (id, role) => {
  if (!["admin", "receptionist", "customer"].includes(role)) {
    throw new AppError("Invalid role provided", 400);
  }

  const user = await findUserById(id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return updateUserRole(id, role);
};

export const registerAdminUser = async (payload) =>
  registerUser({
    ...payload,
    role: "admin",
  });

export const registerReceptionistUser = async (payload) =>
  registerUser({
    ...payload,
    role: "receptionist",
  });
