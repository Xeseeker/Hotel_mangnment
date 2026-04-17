import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToasterProvider } from "./components/ui/Toaster";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/common/Layout";
import Sidebar from "./components/common/Sidebar";
import ProtectedRoute from "./components/common/ProtectedRoute";

import Home from "./pages/Home";
import Rooms from "./pages/Rooms";
import RoomDetails from "./pages/RoomDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyReservations from "./pages/MyReservations";
import MeetingRoom from "./pages/MeetingRoom";
import PaymentSuccess from "./pages/PaymentSuccess";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageRooms from "./pages/admin/ManageRooms";
import ManageReservations from "./pages/admin/ManageReservations";
import ManageUsers from "./pages/admin/ManageUsers";

import ReceptionistDashboard from "./pages/receptionist/ReceptionistDashboard";
import CreateReservation from "./pages/receptionist/CreateReservation";
import CheckInOut from "./pages/receptionist/CheckInOut";
import ReceptionistReservations from "./pages/receptionist/ReceptionistReservations";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/rooms" element={<Rooms />} />
      <Route path="/rooms/:id" element={<RoomDetails />} />
      <Route path="/meeting-room" element={<MeetingRoom />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/reservations"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <MyReservations />
          </ProtectedRoute>
        }
      />
      <Route path="/payment-success" element={<PaymentSuccess />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/rooms"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ManageRooms />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reservations"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ManageReservations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ManageUsers />
          </ProtectedRoute>
        }
      />

      <Route
        path="/receptionist"
        element={
          <ProtectedRoute allowedRoles={["receptionist"]}>
            <ReceptionistDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/receptionist/new-reservation"
        element={
          <ProtectedRoute allowedRoles={["receptionist"]}>
            <CreateReservation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/receptionist/check-in"
        element={
          <ProtectedRoute allowedRoles={["receptionist"]}>
            <CheckInOut />
          </ProtectedRoute>
        }
      />
      <Route
        path="/receptionist/check-out"
        element={
          <ProtectedRoute allowedRoles={["receptionist"]}>
            <CheckInOut />
          </ProtectedRoute>
        }
      />
      <Route
        path="/receptionist/reservations"
        element={
          <ProtectedRoute allowedRoles={["receptionist"]}>
            <ReceptionistReservations />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const isStaff = user?.role === "admin" || user?.role === "receptionist";

  const mainStaff =
    "min-h-0 min-w-0 flex-1 overflow-x-hidden px-4 pb-10 pt-0 sm:px-6 lg:px-8";
  const mainPublic =
    "min-w-0 flex-1 px-4 pb-8 pt-0 transition-all duration-500 sm:px-6 lg:px-8";

  return (
    <Router>
      <div className="app-shell flex min-h-screen flex-col">
        <Layout onMenuClick={() => setSidebarOpen(!sidebarOpen)}>
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          {isStaff ? (
            <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col md:flex-row">
              <div
                className="hidden shrink-0 md:block md:w-72"
                aria-hidden="true"
              />
              <main className={mainStaff}>
                <AppRoutes />
              </main>
            </div>
          ) : (
            <main className={mainPublic}>
              <AppRoutes />
            </main>
          )}
        </Layout>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToasterProvider>
        <AppLayout />
      </ToasterProvider>
    </AuthProvider>
  );
}

export default App;
