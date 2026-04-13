import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { roomService } from "../../services/roomService";
import { reservationService } from "../../services/reservationService";
import Skeleton from "../../components/ui/Skeleton";
import { useToaster } from "../../components/ui/Toaster";

const statConfig = [
  {
    key: "availableRooms",
    label: "Available Rooms",
    accent: "from-emerald-500 to-emerald-600",
    note: "Ready for new arrivals",
  },
  {
    key: "occupiedRooms",
    label: "Occupied Rooms",
    accent: "from-rose-500 to-red-600",
    note: "Currently hosting guests",
  },
  {
    key: "checkInsToday",
    label: "Check-ins Today",
    accent: "from-sky-500 to-primary-600",
    note: "Confirmed arrivals queued",
  },
];

const ReceptionistDashboard = () => {
  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    occupiedRooms: 0,
    checkInsToday: 0,
    checkOutsToday: 0,
  });
  const [loading, setLoading] = useState(true);
  const { addToast } = useToaster();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [roomsRes, reservationsRes] = await Promise.all([
        roomService.getAllRooms(),
        reservationService.getAllReservations(),
      ]);

      const rooms = roomsRes.data || [];
      const reservations = reservationsRes.data || [];
      const today = new Date().toISOString().split("T")[0];

      setStats({
        totalRooms: rooms.length,
        availableRooms: rooms.filter((r) => r.status === "available").length,
        occupiedRooms: rooms.filter((r) => r.status === "occupied").length,
        checkInsToday: reservations.filter(
          (r) => r.check_in.startsWith(today) && r.status === "confirmed",
        ).length,
        checkOutsToday: reservations.filter(
          (r) => r.check_out.startsWith(today) && r.status === "checked_in",
        ).length,
      });
    } catch (error) {
      addToast("Failed to load dashboard data", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-wrap">
        <Skeleton className="mb-8 h-56 rounded-[32px]" />
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-[28px]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrap m-8">
      <div className="page-hero">
        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="section-kicker px-2">Front Desk Overview</p>
            <h1 className="heading-lg mt-5 max-w-2xl text-white px-2">
              A polished reception workspace for every arrival, stay, and
              departure.
            </h1>
            <p className="mt-4 max-w-2xl text-base text-white/75 px-2">
              Track room readiness, prioritize guest movement, and keep the
              hotel floor running smoothly from one premium dashboard.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/receptionist/new-reservation"
                className="btn-primary px-2"
              >
                New Reservation
              </Link>
              <Link to="/receptionist/check-in" className="btn-secondary px-2">
                Open Check-in Desk
              </Link>
            </div>
          </div>

          <div className="panel border-white/10 bg-white/10 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/55 px-2">
              Today at a glance
            </p>
            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between rounded-[20px] border border-white/10 bg-white/8 px-4 py-4">
                <span className="text-white/70 px-2">Check-outs Today</span>
                <span className="text-3xl font-semibold text-white px-2">
                  {stats.checkOutsToday}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-[20px] border border-white/10 bg-white/8 px-4 py-4">
                <span className="text-white/70 px-2">Inventory Coverage</span>
                <span className="text-3xl font-semibold text-white px-2">
                  {stats.totalRooms > 0
                    ? Math.round(
                        (stats.availableRooms / stats.totalRooms) * 100,
                      )
                    : 0}
                  %
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {statConfig.map((item) => (
          <div key={item.key} className="stat-card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-dark-500 px-2">
                  {item.label}
                </p>
                <p className="mt-4 text-4xl font-semibold text-dark-950 px-2">
                  {stats[item.key]}
                </p>
                <p className="mt-2 text-sm text-dark-600 px-2">{item.note}</p>
              </div>
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-[20px] bg-gradient-to-br ${item.accent} text-lg font-semibold text-white shadow-soft-lg`}
              >
                {String(stats[item.key]).padStart(2, "0")}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="panel">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="luxury-badge px-2">Service Actions</p>
              <h2 className="heading-sm mt-3 px-2">
                Move guests through the day
              </h2>
            </div>
            <p className="text-sm text-dark-600 px-2">
              Fast access for the front office team
            </p>
          </div>
          <div className="space-y-4">
            <Link
              to="/receptionist/new-reservation"
              className="panel-muted block transition duration-200 hover:-translate-y-1 hover:border-primary-300"
            >
              <span className="text-lg font-semibold text-dark-950 px-2">
                Create New Reservation
              </span>
              <p className="mt-2 text-sm text-dark-600 px-2">
                Book a room for a guest
              </p>
            </Link>
            <Link
              to="/receptionist/check-in"
              className="panel-muted block transition duration-200 hover:-translate-y-1 hover:border-primary-300"
            >
              <span className="text-lg font-semibold text-dark-950 px-2">
                Process Check-in
              </span>
              <p className="mt-2 text-sm text-dark-600 px-2">
                Check in guests with confirmed reservations
              </p>
            </Link>
            <Link
              to="/receptionist/check-out"
              className="panel-muted block transition duration-200 hover:-translate-y-1 hover:border-primary-300"
            >
              <span className="text-lg font-semibold text-dark-950 px-2">
                Process Check-out
              </span>
              <p className="mt-2 text-sm text-dark-600 px-2">
                Check out guests and finalize billing
              </p>
            </Link>
          </div>
        </div>

        <div className="panel">
          <div className="mb-6">
            <p className="luxury-badge px-2">Occupancy</p>
            <h2 className="heading-sm mt-3 px-2">Room overview</h2>
          </div>
          <div className="space-y-5">
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-dark-700 px-2">Available</span>
                <span className="font-semibold text-dark-900 px-2">
                  {stats.availableRooms} / {stats.totalRooms}
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-[#eadfce]">
                <div
                  className="h-3 rounded-full bg-[linear-gradient(90deg,#2f7d68,#6db09d)] transition-all"
                  style={{
                    width: `${stats.totalRooms > 0 ? (stats.availableRooms / stats.totalRooms) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-dark-700 px-2">Occupied</span>
                <span className="font-semibold text-dark-900 px-2">
                  {stats.occupiedRooms} / {stats.totalRooms}
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-[#eadfce]">
                <div
                  className="h-3 rounded-full bg-[linear-gradient(90deg,#b95b51,#d88980)] transition-all"
                  style={{
                    width: `${stats.totalRooms > 0 ? (stats.occupiedRooms / stats.totalRooms) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;
