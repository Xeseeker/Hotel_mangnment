import api from "./api";

export const userService = {
  // Get all users
  getAllUsers: async () => {
    const response = await api.get("/users");
    return response.data;
  },
  // (Optional) Add more user-related API calls here
};
