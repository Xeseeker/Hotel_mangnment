import api from "./api.js";

export const reservationService = {
  // Get all reservations (based on user role)
  getAllReservations: async () => {
    const response = await api.get("/reservations");
    return response.data;
  },

  // Get single reservation by ID
  getReservationById: async (id) => {
    const response = await api.get(`/reservations/${id}`);
    return response.data;
  },

  // Create new reservation
  createReservation: async (reservationData) => {
    const response = await api.post("/reservations", reservationData);
    return response.data;
  },

  // Cancel reservation
  cancelReservation: async (id) => {
    const response = await api.patch(`/reservations/${id}/cancel`);
    return response.data;
  },

  // Check-in reservation (admin/receptionist only)
  checkInReservation: async (id) => {
    const response = await api.patch(`/reservations/${id}/check-in`);
    return response.data;
  },

  // Check-out reservation (admin/receptionist only)
  checkOutReservation: async (id) => {
    const response = await api.patch(`/reservations/${id}/check-out`);
    return response.data;
  },
};
