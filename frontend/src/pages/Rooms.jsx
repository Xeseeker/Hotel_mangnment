import React, { useState, useEffect } from "react";
import { roomService } from "../services/roomService";
import RoomCard from "../components/common/RoomCard";
import Skeleton from "../components/ui/Skeleton";
import RevealSection from "../components/luxury/RevealSection";
import { USE_MOCK_DATA } from "../data/demoMode";
import { MOCK_ROOMS } from "../data/mockData";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    if (USE_MOCK_DATA) {
      setRooms(MOCK_ROOMS);
      setLoading(false);
      return;
    }

    const fetchRooms = async () => {
      try {
        const response = await roomService.getAllRooms();
        setRooms(response.data || []);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const filteredRooms = rooms.filter((room) => {
    if (filter === "all") return true;
    return room.status === filter;
  });

  const sortedRooms = [...filteredRooms].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "room-number":
        return a.room_number - b.room_number;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen w-full pb-20 pt-10 sm:pt-14">
      <div className="mx-auto w-full max-w-[100%] px-3 sm:px-5 lg:px-6">
        {/* max-w-6xl */}
        <RevealSection className="mx-auto max-w-6xl text-center">
          <p className="section-kicker-dark">Suites &amp; rooms</p>
          <h1 className="heading-lg mt-5 text-elysium-ink">
            Curated spaces for every rhythm of travel
          </h1>
          <p className="mx-auto mt-4 max-w-7xl text-lg leading-relaxed text-dark-600">
            Filter by availability, sort by preference, and step into rooms
            dressed in natural light and quiet luxury.
          </p>
          {USE_MOCK_DATA && (
            <p className="mx-auto mt-4 max-w-xl rounded-full border border-gold-200/80 bg-gold-50/90 px-4 py-2 text-xs font-medium text-gold-800">
              Demo mode: showing mock inventory — set{" "}
              <code className="rounded bg-white/80 px-1">USE_MOCK_DATA</code> to{" "}
              <code className="rounded bg-white/80 px-1">false</code> in{" "}
              <code className="rounded bg-white/80 px-1">
                src/data/demoMode.js
              </code>{" "}
              to use the API.
            </p>
          )}
        </RevealSection>

        <div className="mx-auto mt-12 w-full ">
          {/* max-w-3xl */}
          <div className="flex flex-col items-center gap-6 rounded-luxury-lg border border-gold-200/50 bg-white/85 px-6 py-9 text-center shadow-soft backdrop-blur-sm sm:px-10 sm:py-10">
            <div className="flex w-full max-w-md flex-col items-center gap-6 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center">
              <div className="w-full max-w-[220px] text-left sm:w-auto">
                <label className="mb-2 block text-center text-xs font-semibold uppercase tracking-[0.16em] text-dark-500 sm:text-left">
                  Status
                </label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="input-field w-full py-2.5 text-center sm:text-left"
                >
                  <option value="all">All rooms</option>
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              <div className="w-full max-w-[220px] text-left sm:w-auto">
                <label className="mb-2 block text-center text-xs font-semibold uppercase tracking-[0.16em] text-dark-500 sm:text-left">
                  Sort
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-field w-full py-2.5 text-center sm:text-left"
                >
                  <option value="default">Featured</option>
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                  <option value="room-number">Room number</option>
                </select>
              </div>
            </div>
            <p className="text-sm font-medium text-gold-800">
              Showing{" "}
              <span className="font-serif text-lg text-elysium-ink">
                {sortedRooms.length}
              </span>{" "}
              of {rooms.length}
            </p>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid justify-items-center grid-cols-1 gap-8 md:grid-cols-2 md:gap-x-8 md:gap-y-10 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="card m-3 w-full max-w-md overflow-hidden rounded-luxury"
                >
                  <Skeleton className="aspect-[4/3] w-full" />
                  <div className="space-y-4 p-5">
                    <Skeleton className="mx-auto h-6 w-3/4" />
                    <Skeleton className="mx-auto h-4 w-1/2" />
                    <div className="flex justify-center gap-4">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-10 w-28" />
                    </div>
                  </div>
                </div>
              ))
            : sortedRooms.map((room) => (
                <div
                  key={room.id}
                  className="m-3 flex w-full max-w-md justify-center"
                >
                  <RoomCard room={room} />
                </div>
              ))}
          </div>
        </div>

        {!loading && sortedRooms.length === 0 && (
          <div className="panel-muted mx-auto mt-16 max-w-lg text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gold-100">
              <svg
                className="h-8 w-8 text-gold-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h3 className="heading-sm text-elysium-ink">No rooms match</h3>
            <p className="mt-2 text-dark-600">
              Try another filter to see more of our collection.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rooms;
