import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const menuIcon = (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

const closeIcon = (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const Navbar = ({ onMenuClick }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isStaff = user?.role === "admin" || user?.role === "receptionist";

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMobileOpen(false);
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <nav className="sticky top-0 z-40 border-b border-gold-200/40 bg-cream-50/75 backdrop-blur-xl transition-all duration-500">
      <div
        className={`mx-auto flex h-[4.5rem] items-center justify-between px-4 sm:px-6 lg:px-8 ${
          isStaff ? "w-full max-w-none md:pl-[calc(18rem+1.5rem)] lg:pl-[calc(18rem+2rem)]" : "max-w-7xl"
        }`}
      >
        <div className="flex items-center gap-3">
          {isStaff && (
            <button
              type="button"
              onClick={onMenuClick}
              className="btn-ghost md:hidden"
              aria-label="Open sidebar menu"
            >
              {menuIcon}
            </button>
          )}

          <Link to="/" className="group flex items-center gap-3" onClick={closeMobile}>
            <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-gold-300/70 bg-white shadow-soft transition duration-500 group-hover:border-gold-500 group-hover:shadow-glow-sm">
              <span className="font-serif text-lg font-bold text-gold-700">EG</span>
            </div>
            <div>
              <p className="font-serif text-xl font-semibold tracking-tight text-elysium-ink sm:text-2xl">
                Elysium <span className="text-gold-600">Grand</span>
              </p>
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-gold-700/85">
                Hotel
              </p>
            </div>
          </Link>
        </div>

        <div className="hidden items-center gap-8 md:flex">
          {!isStaff && (
            <>
              <Link
                to="/"
                className="text-sm font-medium text-dark-700 transition-all duration-300 hover:text-gold-600"
              >
                Home
              </Link>
              <Link
                to="/rooms"
                className="text-sm font-medium text-dark-700 transition-all duration-300 hover:text-gold-600"
              >
                Rooms
              </Link>
              <Link
                to="/meeting-room"
                className="text-sm font-medium text-dark-700 transition-all duration-300 hover:text-gold-600"
              >
                Meeting room
              </Link>
            </>
          )}

          {isAuthenticated ? (
            <>
              {user.role === "customer" && (
                <Link
                  to="/reservations"
                  className="text-sm font-medium text-dark-700 transition-all duration-300 hover:text-gold-600"
                >
                  My Reservations
                </Link>
              )}
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="luxury-badge border-gold-300/80 transition duration-300 hover:border-gold-500 hover:shadow-glow-sm"
                >
                  Admin Suite
                </Link>
              )}
              {user.role === "receptionist" && (
                <Link
                  to="/receptionist"
                  className="luxury-badge border-gold-300/80 transition duration-300 hover:border-gold-500 hover:shadow-glow-sm"
                >
                  Front Desk
                </Link>
              )}

              <div className="flex items-center gap-3 rounded-full border border-gold-200/60 bg-white/90 px-3 py-2 shadow-soft">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gold-700 to-gold-400 text-sm font-semibold text-white shadow-glow-sm">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="hidden leading-tight sm:block">
                  <p className="text-sm font-semibold text-elysium-ink">{user.name}</p>
                  <p className="text-[0.65rem] uppercase tracking-[0.18em] text-dark-500">{user.role}</p>
                </div>
                <button type="button" onClick={handleLogout} className="btn-ghost text-sm">
                  Logout
                </button>
              </div>
            </>
          ) : (
            !isStaff && (
              <div className="flex items-center gap-3">
                <Link to="/login" className="btn-ghost text-sm">
                  Login
                </Link>
                <Link to="/register" className="btn-primary px-6 py-2.5 text-sm">
                  Register
                </Link>
              </div>
            )
          )}
        </div>

        {!isStaff && (
          <button
            type="button"
            className="btn-ghost md:hidden"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? closeIcon : menuIcon}
          </button>
        )}
      </div>

      {!isStaff && mobileOpen && (
        <>
          <div
            className="fixed inset-0 top-[4.5rem] z-30 bg-elysium-ink/40 backdrop-blur-sm md:hidden"
            aria-hidden
            onClick={closeMobile}
          />
          <div className="absolute inset-x-0 top-full z-40 border-b border-gold-200/50 bg-cream-50/98 shadow-panel backdrop-blur-xl animate-slide-down md:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-6 sm:px-6">
              <Link
                to="/"
                className="rounded-2xl px-4 py-3 text-sm font-medium text-dark-800 transition hover:bg-gold-100/50"
                onClick={closeMobile}
              >
                Home
              </Link>
              <Link
                to="/rooms"
                className="rounded-2xl px-4 py-3 text-sm font-medium text-dark-800 transition hover:bg-gold-100/50"
                onClick={closeMobile}
              >
                Rooms
              </Link>
              <Link
                to="/meeting-room"
                className="rounded-2xl px-4 py-3 text-sm font-medium text-dark-800 transition hover:bg-gold-100/50"
                onClick={closeMobile}
              >
                Meeting room
              </Link>
              {isAuthenticated && user.role === "customer" && (
                <Link
                  to="/reservations"
                  className="rounded-2xl px-4 py-3 text-sm font-medium text-dark-800 transition hover:bg-gold-100/50"
                  onClick={closeMobile}
                >
                  My Reservations
                </Link>
              )}
              <div className="mt-4 flex flex-col gap-2 border-t border-gold-200/50 pt-4">
                {isAuthenticated ? (
                  <button type="button" onClick={handleLogout} className="btn-secondary w-full justify-center">
                    Logout
                  </button>
                ) : (
                  <>
                    <Link to="/login" className="btn-secondary w-full justify-center" onClick={closeMobile}>
                      Login
                    </Link>
                    <Link to="/register" className="btn-primary w-full justify-center" onClick={closeMobile}>
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
