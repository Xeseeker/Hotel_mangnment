import dotenv from "dotenv";

dotenv.config({
  path: process.env.NODE_ENV === "docker" ? ".env" : ".env.local",
});

export const env = process.env;
