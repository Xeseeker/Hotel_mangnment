import React from "react";
import { Link } from "react-router-dom";
import LuxuryCard from "../luxury/LuxuryCard";
import StatusPill from "../luxury/StatusPill";

const RoomCard = ({ room }) => {
  const { id, room_number, type, image_url, price, status } = room;

  return (
    <LuxuryCard className="group" hover>
      <Link to={`/rooms/${id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={
              image_url ||
              "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800"
            }
            alt={type || `Room ${room_number}`}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-elysium-ink/50 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="absolute right-4 top-4">
            <StatusPill status={status || "available"} domain="room" />
          </div>
        </div>

        <div className="space-y-4 px-6 py-6 sm:px-8 sm:py-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-serif text-xl font-semibold text-elysium-ink">
                {type || "Standard Room"}
              </h3>
              <p className="mt-1 text-sm font-medium tracking-wide text-gold-700/90">
                Room {room_number}
              </p>
            </div>
            <div className="text-right">
              <span className="block font-serif text-2xl font-bold text-gold-600">
                ${price}
              </span>
              <span className="text-xs font-medium uppercase tracking-wider text-dark-500">
                per night
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gold-100/80 pt-4">
            <span className="inline-flex items-center gap-2 text-sm text-dark-600">
              <svg
                className="h-4 w-4 text-gold-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
              Signature stay
            </span>
            <span className="btn-primary py-2.5 px-5 text-sm transition duration-500 group-hover:shadow-glow">
              View details
            </span>
          </div>
        </div>
      </Link>
    </LuxuryCard>
  );
};

export default RoomCard;
