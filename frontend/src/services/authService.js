import api from "./api.js";

export const authService = {
  // Register a new user
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  // Get current user profile
  getMe: async () => {
    const response = await api.get("/users/me");
    return response.data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  // Set auth token and user in storage
  setAuth: (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  },

  // Get stored user
  getStoredUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },
};
