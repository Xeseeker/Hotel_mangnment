import { v2 as cloudinary } from "cloudinary";
import { AppError } from "../utils/AppError.js";

const cloudName = process.env.CLOUDINARY_NAME || process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export const assertCloudinaryConfig = () => {
  if (!cloudName || !apiKey || !apiSecret) {
    throw new AppError("Cloudinary credentials are missing in the backend environment", 500);
  }

  if (!/^\d+$/.test(apiKey)) {
    throw new AppError(
      "Cloudinary API key is invalid. Update CLOUDINARY_API_KEY in backend/.env.local",
      500,
    );
  }
};

export default cloudinary;
