import { AppError } from "../utils/AppError.js";
import { uploadImageBuffer } from "../utils/uploadToCloudinary.js";
import {
  createRoom,
  deleteRoom,
  findRoomById,
  findRoomByNumber,
  getAllRooms,
  updateRoom,
} from "../model/roomModel.js";

export const listRooms = async () => getAllRooms();

export const getRoom = async (id) => {
  const room = await findRoomById(id);

  if (!room) {
    throw new AppError("Room not found", 404);
  }

  return room;
};

const buildRoomPayload = async (payload, file, existingRoom = null) => {
  let image_url = existingRoom?.image_url || null;

  if (file) {
    const uploadedImage = await uploadImageBuffer(file.buffer);
    image_url = uploadedImage.secure_url;
  } else if (payload.image_url !== undefined) {
    image_url = payload.image_url || null;
  }

  return {
    room_number: payload.room_number,
    type: payload.type,
    price: payload.price,
    status: payload.status || "available",
    image_url,
  };
};

export const addRoom = async (payload, file) => {
  const existingRoom = await findRoomByNumber(payload.room_number);

  if (existingRoom) {
    throw new AppError("Room number already exists", 409);
  }

  const roomPayload = await buildRoomPayload(payload, file);
  return createRoom(roomPayload);
};

export const editRoom = async (id, payload, file) => {
  const room = await findRoomById(id);

  if (!room) {
    throw new AppError("Room not found", 404);
  }

  const duplicateRoom = await findRoomByNumber(payload.room_number);

  if (duplicateRoom && duplicateRoom.id !== Number(id)) {
    throw new AppError("Room number already exists", 409);
  }

  const roomPayload = await buildRoomPayload(payload, file, room);
  return updateRoom(id, roomPayload);
};

export const removeRoom = async (id) => {
  const room = await findRoomById(id);

  if (!room) {
    throw new AppError("Room not found", 404);
  }

  await deleteRoom(id);
};
