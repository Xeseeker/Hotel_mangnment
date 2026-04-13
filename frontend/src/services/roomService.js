import api from "./api.js";

const buildRoomFormData = (roomData) => {
  const formData = new FormData();

  formData.append("room_number", roomData.room_number);
  formData.append("type", roomData.type);
  formData.append("price", roomData.price);
  formData.append("status", roomData.status);

  if (roomData.image) {
    formData.append("image", roomData.image);
  }

  return formData;
};

export const roomService = {
  // Get all rooms
  getAllRooms: async () => {
    const response = await api.get("/rooms");
    return response.data;
  },

  // Get single room by ID
  getRoomById: async (id) => {
    const response = await api.get(`/rooms/${id}`);
    return response.data;
  },

  // Create new room (admin only)
  createRoom: async (roomData) => {
    const response = await api.post("/rooms", buildRoomFormData(roomData), {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Update room (admin only)
  updateRoom: async (id, roomData) => {
    const response = await api.put(`/rooms/${id}`, buildRoomFormData(roomData), {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Delete room (admin only)
  deleteRoom: async (id) => {
    const response = await api.delete(`/rooms/${id}`);
    return response.data;
  },
};
