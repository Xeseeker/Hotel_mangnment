import React from "react";

const roomStyles = {
  available: "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200/80",
  occupied: "bg-rose-50 text-rose-800 ring-1 ring-rose-200/80",
  maintenance: "bg-amber-50 text-amber-900 ring-1 ring-amber-200/80",
  default: "bg-dark-100 text-dark-700 ring-1 ring-dark-200/80",
};

const reservationStyles = {
  pending: "bg-amber-50 text-amber-900 ring-1 ring-amber-200/70",
  confirmed: "bg-sky-50 text-sky-900 ring-1 ring-sky-200/80",
  checked_in: "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200/80",
  checked_out: "bg-dark-100 text-dark-600 ring-1 ring-dark-200/70",
  cancelled: "bg-rose-50 text-rose-800 ring-1 ring-rose-200/70",
  default: "bg-gold-50 text-gold-900 ring-1 ring-gold-200/80",
};

const roleStyles = {
  admin: "bg-gold-100 text-gold-900 ring-1 ring-gold-300/80",
  receptionist: "bg-sky-50 text-sky-900 ring-1 ring-sky-200/70",
  customer: "bg-cream-200 text-dark-700 ring-1 ring-gold-200/60",
  default: "bg-dark-100 text-dark-700 ring-1 ring-dark-200/70",
};

/**
 * @param {"room" | "reservation" | "role"} domain — which palette to use
 */
const StatusPill = ({ status, domain = "room", className = "" }) => {
  const raw = (status || "").toString().toLowerCase().replace(/\s+/g, "_");
  const map =
    domain === "reservation" ? reservationStyles : domain === "role" ? roleStyles : roomStyles;
  const style = map[raw] || map.default;
  const label = (status || "unknown").toString().replace(/_/g, " ");

  return (
    <span className={`status-pill ${style} ${className}`.trim()}>{label}</span>
  );
};

export default StatusPill;
