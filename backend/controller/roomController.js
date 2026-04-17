import { hasOverlappingReservation } from "../model/reservationModel.js";
// GET /api/rooms/:id/availability?check_in=YYYY-MM-DD&check_out=YYYY-MM-DD
export const checkRoomAvailability = asyncHandler(async (req, res) => {
  const roomId = Number(req.params.id);
  const { check_in, check_out } = req.query;
  if (!check_in || !check_out) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Check-in and check-out dates are required",
      });
  }
  const conflict = await hasOverlappingReservation(roomId, check_in, check_out);
  res.json({ success: true, available: !conflict });
});
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  addRoom,
  editRoom,
  getRoom,
  listRooms,
  removeRoom,
} from "../service/roomService.js";

export const getRooms = asyncHandler(async (req, res) => {
  const rooms = await listRooms();

  res.json({
    success: true,
    message: "Rooms fetched successfully",
    data: rooms,
  });
});

export const getSingleRoom = asyncHandler(async (req, res) => {
  const room = await getRoom(Number(req.params.id));

  res.json({
    success: true,
    message: "Room fetched successfully",
    data: room,
  });
});

export const createRoomRecord = asyncHandler(async (req, res) => {
  const room = await addRoom(req.body, req.file);

  res.status(201).json({
    success: true,
    message: "Room created successfully",
    data: room,
  });
});

export const updateRoomRecord = asyncHandler(async (req, res) => {
  const room = await editRoom(Number(req.params.id), req.body, req.file);

  res.json({
    success: true,
    message: "Room updated successfully",
    data: room,
  });
});

export const deleteRoomRecord = asyncHandler(async (req, res) => {
  await removeRoom(Number(req.params.id));

  res.json({
    success: true,
    message: "Room deleted successfully",
  });
});
