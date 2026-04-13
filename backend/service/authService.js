import bcrypt from "bcryptjs";
import { AppError } from "../utils/AppError.js";
import { createUser, findUserByEmail } from "../model/userModel.js";
import { generateToken } from "../utils/token.js";

export const registerUser = async ({ name, email, password, role = "customer" }) => {
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new AppError("User with this email already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await createUser({
    name,
    email,
    password: hashedPassword,
    role,
  });

  return {
    user,
    token: generateToken(user),
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    },
    token: generateToken(user),
  };
};
