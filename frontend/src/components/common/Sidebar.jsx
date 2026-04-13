import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Icon = ({ children }) => (
  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-xs font-semibold tracking-wide text-gold-200 shadow-soft backdrop-blur-sm">
    {children}
  </span>
);

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();
  const panelTitle = user?.role === "admin" ? "Admin Suite" : "Front Desk";

  const menuItems = {
    admin: [
      { name: "Dashboard", path: "/admin", icon: "DS" },
      { name: "Manage Rooms", path: "/admin/rooms", icon: "RM" },
      { name: "Reservations", path: "/admin/reservations", icon: "RS" },
      { name: "Manage Users", path: "/admin/users", icon: "US" },
    ],
    receptionist: [
      { name: "Dashboard", path: "/receptionist", icon: "DS" },
      {
        name: "Create Reservation",
        path: "/receptionist/new-reservation",
        icon: "CR",
      },
      {
        name: "Check-in / Check-out",
        path: "/receptionist/check-in",
        icon: "IO",
      },
      {
        name: "View Reservations",
        path: "/receptionist/reservations",
        icon: "VR",
      },
    ],
  };

  const currentMenu = menuItems[user?.role] || [];
  const isVisible = user?.role === "admin" || user?.role === "receptionist";

  if (!isVisible) return null;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-elysium-ink/55 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <div
        className={`fixed left-0 z-50 w-72 transform border-r border-gold-900/30 bg-gradient-to-b from-[#1c1915] via-[#252018] to-[#3d2e1c] shadow-panel transition-transform duration-500 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } top-0 h-full md:translate-x-0 md:top-[4.5rem] md:h-[calc(100vh-4.5rem)]`}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(193,154,95,0.12),transparent_50%)]" />

        <div className="relative flex h-full min-h-0 flex-col">
          <div className="border-b border-white/10 px-6 pb-6 pt-20 md:pt-6">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-gold-400/90">
              Elysium Grand · Operations
            </p>
            <h2 className="mt-4 font-serif text-2xl font-bold text-white">{panelTitle}</h2>
            <p className="mt-2 text-sm text-white/65">{user?.name}</p>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-6">
            {currentMenu.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`mb-2 flex items-center gap-3 rounded-[22px] px-4 py-3.5 text-sm font-medium transition-all duration-500 ${
                  location.pathname === item.path
                    ? "bg-white/14 text-white shadow-glow-sm ring-1 ring-gold-500/25"
                    : "text-white/72 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon>{item.icon}</Icon>
                <div>
                  <span className="block">{item.name}</span>
                  <span className="text-[0.65rem] uppercase tracking-[0.2em] text-white/45">
                    {user?.role === "admin" ? "Control" : "Reception"}
                  </span>
                </div>
              </Link>
            ))}
          </nav>

          <div className="px-6 pb-6">
            <div className="rounded-[24px] border border-white/12 bg-white/6 p-4 text-white/78 backdrop-blur-sm">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-gold-400/80">
                Concierge note
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                Arrivals, departures, and availability — one calm workspace.
              </p>
            </div>
          </div>

          <div className="border-t border-white/10 p-4">
            <Link
              to="/"
              onClick={onClose}
              className="btn-secondary flex w-full justify-center border-gold-300/50 bg-white/95 text-sm text-elysium-ink hover:bg-white"
            >
              Return to website
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
