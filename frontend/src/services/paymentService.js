import api from "./api";

export const paymentService = {
  // Initiate Chapa payment (to be implemented)
  initiateChapaPayment: async (paymentData) => {
    // This should call your backend endpoint that starts a Chapa payment session
    const response = await api.post("/payments/chapa/initiate", paymentData);
    return response.data;
  },
  verifyChapaPayment: async (txRef) => {
    const response = await api.get("/payments/chapa/verify", {
      params: { tx_ref: txRef },
    });
    return response.data;
  },
};
