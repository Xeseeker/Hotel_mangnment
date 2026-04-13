import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { reservationService } from "../services/reservationService";
import { roomService } from "../services/roomService";
import Skeleton from "../components/ui/Skeleton";
import Modal from "../components/ui/Modal";
import { useToaster } from "../components/ui/Toaster";
import StatusPill from "../components/luxury/StatusPill";
import RevealSection from "../components/luxury/RevealSection";
import { USE_MOCK_DATA } from "../data/demoMode";
import { MOCK_CUSTOMER_RESERVATIONS, MOCK_ROOMS, roomsArrayToMap } from "../data/mockData";

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState({});
  const [loading, setLoading] = useState(true);
  const [cancelModal, setCancelModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const { addToast } = useToaster();

  useEffect(() => {
    if (USE_MOCK_DATA) {
      setReservations(MOCK_CUSTOMER_RESERVATIONS);
      setRooms(roomsArrayToMap(MOCK_ROOMS));
      setLoading(false);
      return;
    }

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [reservationsRes, roomsRes] = await Promise.all([
        reservationService.getAllReservations(),
        roomService.getAllRooms(),
      ]);

      setReservations(reservationsRes.data || []);

      const roomsMap = {};
      (roomsRes.data || []).forEach((room) => {
        roomsMap[room.id] = room;
      });
      setRooms(roomsMap);
    } catch (error) {
      console.error("Error fetching data:", error);
      addToast("Failed to load reservations", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async () => {
    if (!selectedReservation) return;

    if (USE_MOCK_DATA) {
      setCancelling(true);
      setReservations((prev) => prev.filter((r) => r.id !== selectedReservation.id));
      addToast("Reservation removed (demo mode).", "success");
      setCancelModal(false);
      setSelectedReservation(null);
      setCancelling(false);
      return;
    }

    setCancelling(true);
    try {
      await reservationService.cancelReservation(selectedReservation.id);
      addToast("Reservation cancelled successfully", "success");
      setCancelModal(false);
      fetchData();
    } catch (error) {
      addToast(
        error.response?.data?.message || "Failed to cancel reservation",
        "error",
      );
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pb-20 pt-10">
        <div className="mx-auto w-full max-w-3xl px-3 sm:px-5 lg:px-6">
          <Skeleton className="mx-auto mb-8 h-12 w-56 rounded-luxury" />
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="mx-auto h-40 w-full max-w-2xl rounded-luxury-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full pb-24 pt-10 sm:pt-14">
      <div className="mx-auto w-full max-w-3xl px-3 sm:px-5 lg:px-6">
        <RevealSection className="flex flex-col items-center gap-6 text-center">
          <div>
            <p className="section-kicker-dark">Your stays</p>
            <h1 className="heading-lg mt-4 text-elysium-ink">My reservations</h1>
            <p className="mx-auto mt-3 max-w-lg text-dark-600">
              Every upcoming and past visit, gathered in one calm view.
            </p>
            {USE_MOCK_DATA && (
              <p className="mx-auto mt-4 max-w-md rounded-full border border-gold-200/80 bg-gold-50/90 px-3 py-2 text-xs text-gold-900">
                Demo reservations — disable mock in <code className="rounded bg-white/80 px-1">demoMode.js</code> for live
                data.
              </p>
            )}
          </div>
          <Link to="/rooms" className="btn-primary px-8 py-3">
            Book a room
          </Link>
        </RevealSection>

        {reservations.length === 0 ? (
          <div className="panel-muted mx-auto mt-16 max-w-lg text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gold-100">
              <svg className="h-8 w-8 text-gold-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="heading-sm text-elysium-ink">No reservations yet</h3>
            <p className="mt-2 text-dark-600">Discover a suite that feels like it was waiting for you.</p>
            <Link to="/rooms" className="btn-primary mx-auto mt-8 inline-flex">
              Browse rooms
            </Link>
          </div>
        ) : (
          <div className="mx-auto mt-14 w-full max-w-2xl space-y-8">
            {reservations.map((reservation) => {
              const room = rooms[reservation.room_id];
              return (
                <article
                  key={reservation.id}
                  className="overflow-hidden rounded-luxury-lg border border-gold-100/80 bg-white/95 text-center shadow-panel transition duration-500 hover:shadow-panel-hover md:text-left"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="relative mx-auto h-48 w-full max-w-md shrink-0 md:mx-0 md:h-auto md:w-56 md:max-w-none lg:w-64">
                      <img
                        src={
                          room?.image_url ||
                          "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400"
                        }
                        alt={room?.type || "Room"}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-elysium-ink/40 to-transparent md:bg-gradient-to-r" />
                    </div>
                    <div className="flex flex-1 flex-col justify-center px-6 py-7 sm:px-8 sm:py-9">
                      <div className="flex flex-col items-center gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="text-center md:text-left">
                          <h3 className="font-serif text-xl font-semibold text-elysium-ink">
                            {room?.type || "Standard Room"}
                            <span className="mt-1 block text-base font-normal text-gold-700 md:inline md:ml-2">
                              · Room {room?.room_number}
                            </span>
                          </h3>
                          <div className="mt-4 flex flex-col items-center gap-2 text-sm text-dark-600 sm:flex-row sm:flex-wrap sm:justify-center md:justify-start md:gap-x-6">
                            <span className="inline-flex items-center gap-1.5">
                              <svg className="h-4 w-4 shrink-0 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              In {new Date(reservation.check_in).toLocaleDateString()}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <svg className="h-4 w-4 shrink-0 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                                />
                              </svg>
                              Out {new Date(reservation.check_out).toLocaleDateString()}
                            </span>
                            <span>
                              {reservation.guests} guest{reservation.guests > 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-center gap-3 md:items-end">
                          <StatusPill status={reservation.status} domain="reservation" />
                          <p className="font-serif text-xl font-semibold text-gold-700">${room?.price || 0}/night</p>
                          {reservation.status === "pending" || reservation.status === "confirmed" ? (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedReservation(reservation);
                                setCancelModal(true);
                              }}
                              className="text-sm font-medium text-rose-700 underline decoration-rose-300/80 underline-offset-4 transition hover:text-rose-800"
                            >
                              Cancel reservation
                            </button>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <Modal isOpen={cancelModal} onClose={() => setCancelModal(false)} title="Cancel reservation" size="sm">
        <div className="space-y-6 text-center sm:text-left">
          <p className="leading-relaxed text-dark-700">
            Cancel this reservation? This action cannot be undone.
            {USE_MOCK_DATA && (
              <span className="mt-2 block text-xs text-dark-500">Demo mode: no API call will be made.</span>
            )}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <button type="button" onClick={() => setCancelModal(false)} className="btn-secondary flex-1">
              Keep reservation
            </button>
            <button
              type="button"
              onClick={handleCancelReservation}
              disabled={cancelling}
              className="flex flex-1 items-center justify-center rounded-full bg-gradient-to-r from-rose-700 to-rose-600 px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:brightness-105 disabled:opacity-60"
            >
              {cancelling ? (
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" aria-hidden>
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                "Cancel"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyReservations;
