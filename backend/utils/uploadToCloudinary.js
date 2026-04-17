import cloudinary, { assertCloudinaryConfig } from "../config/cloudinary.js";
import { AppError } from "./AppError.js";

export const uploadImageBuffer = (buffer, folder = "hotel-management/rooms") =>
  new Promise((resolve, reject) => {
    assertCloudinaryConfig();

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          if (error?.http_code === 401 || error?.message?.includes("Invalid api_key")) {
            reject(
              new AppError(
                "Cloudinary credentials are invalid. Update CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in backend/.env.local",
                500,
              ),
            );
            return;
          }

          reject(error);
          return;
        }

        resolve(result);
      },
    );

    uploadStream.end(buffer);
  });
