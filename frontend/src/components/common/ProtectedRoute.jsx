import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect to appropriate dashboard based on role
    switch (user?.role) {
      case "admin":
        return <Navigate to="/admin" replace />;
      case "receptionist":
        return <Navigate to="/receptionist" replace />;
      case "customer":
        return <Navigate to="/" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
