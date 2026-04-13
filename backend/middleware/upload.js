import multer from "multer";
import { AppError } from "../utils/AppError.js";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg"];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    cb(new AppError("Only PNG and JPG images are allowed", 400));
    return;
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export const uploadRoomImage = upload.single("image");
