import api from "./api";

export const availabilityService = {
  // Check if a room is available for a given date range
  checkRoomAvailability: async (roomId, checkIn, checkOut) => {
    const response = await api.get(`/rooms/${roomId}/availability`, {
      params: { check_in: checkIn, check_out: checkOut },
    });
    return response.data;
  },
};
