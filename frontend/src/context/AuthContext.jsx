import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService.js";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = authService.getStoredUser();
      if (storedUser && authService.isAuthenticated()) {
        setUser(storedUser);
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      setUser(response.data.user);
      authService.setAuth(response.data.token, response.data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      setUser(response.data.user);
      authService.setAuth(response.data.token, response.data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = () => {
    setUser(null);
    authService.logout();
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
