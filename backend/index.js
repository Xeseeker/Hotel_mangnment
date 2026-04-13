import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoute.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
  }),
);
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Hotel Management System API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
