import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { roomService } from "../../services/roomService";
import { reservationService } from "../../services/reservationService";
import Skeleton from "../../components/ui/Skeleton";
import { useToaster } from "../../components/ui/Toaster";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    occupiedRooms: 0,
    totalReservations: 0,
    pendingReservations: 0,
    confirmedReservations: 0,
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

      setStats({
        totalRooms: rooms.length,
        availableRooms: rooms.filter((room) => room.status === "available")
          .length,
        occupiedRooms: rooms.filter((room) => room.status === "occupied")
          .length,
        totalReservations: reservations.length,
        pendingReservations: reservations.filter(
          (reservation) => reservation.status === "pending",
        ).length,
        confirmedReservations: reservations.filter((reservation) =>
          ["confirmed", "checked_in"].includes(reservation.status),
        ).length,
      });
    } catch (error) {
      addToast("Failed to load dashboard data", "error");
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Rooms",
      value: stats.totalRooms,
      sub: "Inventory across the property",
      accent: "from-gold-600 to-gold-400",
      link: "/admin/rooms",
    },
    {
      title: "Available Rooms",
      value: stats.availableRooms,
      sub: "Ready for incoming guests",
      accent: "from-emerald-600 to-emerald-400",
      link: "/admin/rooms",
    },
    {
      title: "Occupied Rooms",
      value: stats.occupiedRooms,
      sub: "Currently hosting guests",
      accent: "from-rose-600 to-rose-400",
      link: "/admin/rooms",
    },
    {
      title: "Reservations",
      value: stats.totalReservations,
      sub: "All booking activity",
      accent: "from-sky-600 to-primary-500",
      link: "/admin/reservations",
    },
    {
      title: "Pending",
      value: stats.pendingReservations,
      sub: "Waiting for action",
      accent: "from-amber-600 to-gold-400",
      link: "/admin/reservations",
    },
    {
      title: "Confirmed",
      value: stats.confirmedReservations,
      sub: "Confirmed + in-house",
      accent: "from-primary-700 to-gold-500",
      link: "/admin/reservations",
    },
  ];

  if (loading) {
    return (
      <div className="page-wrap">
        <Skeleton className="mb-8 h-48 rounded-luxury-lg" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-luxury" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrap m-8">
      <div className="page-hero">
        <div className="relative z-10 max-w-3xl">
          <p className="section-kicker px-2">Elysium Grand Admin</p>
          <h1 className="heading-lg mt-5 px-2 text-white">
            Property overview
          </h1>
          <p className="mt-4 px-2 text-base text-white/75">
            A composed snapshot of rooms and reservations aligned with the same
            calm visual language as front desk operations.
          </p>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <Link
            key={stat.title}
            to={stat.link}
            className="stat-card group border-gold-100/80"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="px-2 text-xs font-semibold uppercase tracking-[0.2em] text-dark-500">
                  {stat.title}
                </p>
                <p className="mt-3 px-2 font-serif text-4xl font-semibold text-elysium-ink">
                  {stat.value}
                </p>
                <p className="mt-2 px-2 text-sm text-dark-600">{stat.sub}</p>
              </div>
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.accent} text-sm font-bold text-white shadow-glow-sm`}
              >
                {String(stat.value).padStart(2, "0")}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="panel rounded-luxury-lg">
          <p className="luxury-badge px-2">Quick actions</p>
          <h2 className="heading-sm mt-4 px-2 text-elysium-ink">
            Control center
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <Link
              to="/admin/rooms"
              className="panel-muted rounded-2xl border-gold-200/60 p-5 text-center transition duration-300 hover:-translate-y-1 hover:border-gold-400 hover:shadow-soft"
            >
              <span className="block px-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-700">
                Rooms
              </span>
              <span className="mt-2 block px-2 font-serif text-lg text-elysium-ink">
                Manage inventory
              </span>
            </Link>
            <Link
              to="/admin/reservations"
              className="panel-muted rounded-2xl border-gold-200/60 p-5 text-center transition duration-300 hover:-translate-y-1 hover:border-gold-400 hover:shadow-soft"
            >
              <span className="block px-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-700">
                Bookings
              </span>
              <span className="mt-2 block px-2 font-serif text-lg text-elysium-ink">
                Reservations
              </span>
            </Link>
            <Link
              to="/admin/users"
              className="panel-muted rounded-2xl border-gold-200/60 p-5 text-center transition duration-300 hover:-translate-y-1 hover:border-gold-400 hover:shadow-soft"
            >
              <span className="block px-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-700">
                People
              </span>
              <span className="mt-2 block px-2 font-serif text-lg text-elysium-ink">
                User directory
              </span>
            </Link>
            <Link
              to="/"
              className="panel-muted rounded-2xl border-gold-200/60 p-5 text-center transition duration-300 hover:-translate-y-1 hover:border-gold-400 hover:shadow-soft"
            >
              <span className="block px-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-700">
                Guest site
              </span>
              <span className="mt-2 block px-2 font-serif text-lg text-elysium-ink">
                View website
              </span>
            </Link>
          </div>
        </div>

        <div className="panel rounded-luxury-lg">
          <p className="luxury-badge px-2">Occupancy</p>
          <h2 className="heading-sm mt-4 px-2 text-elysium-ink">Room mix</h2>
          <div className="mt-8 space-y-6">
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="px-2 text-dark-700">Available</span>
                <span className="px-2 font-semibold text-elysium-ink">
                  {stats.availableRooms} / {stats.totalRooms}
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-gold-100">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-500"
                  style={{
                    width: `${stats.totalRooms > 0 ? (stats.availableRooms / stats.totalRooms) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="px-2 text-dark-700">Occupied</span>
                <span className="px-2 font-semibold text-elysium-ink">
                  {stats.occupiedRooms} / {stats.totalRooms}
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-gold-100">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-rose-600 to-rose-400 transition-all duration-500"
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

export default AdminDashboard;
