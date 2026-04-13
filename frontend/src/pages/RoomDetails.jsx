import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { roomService } from "../services/roomService";
import { reservationService } from "../services/reservationService";
import { useAuth } from "../context/AuthContext";
import Skeleton from "../components/ui/Skeleton";
import Modal from "../components/ui/Modal";
import { useToaster } from "../components/ui/Toaster";
import StatusPill from "../components/luxury/StatusPill";
import { USE_MOCK_DATA } from "../data/demoMode";
import { getMockRoomById } from "../data/mockData";

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToast } = useToaster();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingModal, setBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    check_in: "",
    check_out: "",
    guests: 1,
  });
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    if (USE_MOCK_DATA) {
      const mock = getMockRoomById(id);
      setRoom(mock);
      setLoading(false);
      return;
    }

    const fetchRoom = async () => {
      try {
        const response = await roomService.getRoomById(id);
        setRoom(response.data);
      } catch (error) {
        console.error("Error fetching room:", error);
        addToast("Failed to load room details", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  const handleBookingChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      addToast("Please login to make a reservation", "warning");
      navigate("/login");
      return;
    }

    setBookingLoading(true);
    if (USE_MOCK_DATA) {
      addToast("Demo: booking completed — connect reservationService when ready.", "success");
      setBookingModal(false);
      navigate("/reservations");
      setBookingLoading(false);
      return;
    }
    try {
      await reservationService.createReservation({
        room_id: parseInt(id),
        ...bookingData,
      });
      addToast("Reservation created successfully!", "success");
      setBookingModal(false);
      navigate("/reservations");
    } catch (error) {
      addToast(
        error.response?.data?.message || "Failed to create reservation",
        "error",
      );
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pb-20 pt-8">
        <div className="mx-auto w-full max-w-5xl px-3 sm:px-5 lg:px-6">
          <Skeleton className="mb-8 h-[min(50vh,420px)] w-full rounded-luxury-lg" />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Skeleton className="mb-4 h-10 w-3/4" />
              <Skeleton className="mb-2 h-6 w-full" />
              <Skeleton className="h-6 w-2/3" />
            </div>
            <div>
              <Skeleton className="h-72 w-full rounded-luxury-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="panel-muted max-w-md text-center">
          <h2 className="heading-md text-elysium-ink">Room not found</h2>
          <p className="mt-3 text-dark-600">This suite may no longer be listed.</p>
          <Link to="/rooms" className="btn-primary mt-8 inline-flex">
            View all rooms
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full pb-24 pt-8 sm:pt-10">
      <div className="mx-auto w-full max-w-5xl px-3 sm:px-5 lg:px-6">
        {USE_MOCK_DATA && (
          <p className="mb-6 rounded-luxury border border-gold-200/80 bg-gold-50/90 px-4 py-3 text-center text-xs text-gold-900">
            Demo room detail — API disabled while <code className="rounded bg-white/80 px-1">USE_MOCK_DATA</code> is true.
          </p>
        )}
        <div className="relative mb-10 overflow-hidden rounded-luxury-lg shadow-panel sm:mb-12">
          <div className="aspect-[21/9] min-h-[280px] sm:min-h-[360px]">
            <img
              src={
                room.image_url ||
                "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200"
              }
              alt={room.type || `Room ${room.room_number}`}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-elysium-ink/75 via-transparent to-elysium-ink/25" />
          <div className="absolute inset-x-0 bottom-0 px-5 pb-8 pt-6 sm:px-10 sm:pb-10 sm:pt-8">
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-300/95">Elysium Grand</p>
                <h1 className="heading-lg mt-2 text-white">{room.type || "Standard Room"}</h1>
                <p className="mt-2 text-white/80">Room {room.room_number}</p>
              </div>
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
                <StatusPill status={room.status} domain="room" className="!bg-white/95 !text-elysium-ink !ring-white/40" />
                <div className="text-center text-white sm:text-right">
                  <p className="font-serif text-3xl font-bold text-gold-200">${room.price}</p>
                  <p className="text-sm text-white/70">per night</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2">
            <div className="panel rounded-luxury-lg px-7 py-8 text-center sm:px-10 sm:py-10 lg:text-left">
              <div className="border-b border-gold-100/80 pb-8">
                <h2 className="font-serif text-2xl font-semibold text-elysium-ink">Residence details</h2>
                <p className="mx-auto mt-2 max-w-xl text-dark-600 lg:mx-0">
                  Thoughtfully composed for rest, work, and slow mornings.
                </p>
              </div>

              <div className="mt-8">
                <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-700">Amenities</h3>
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {[
                    { t: "Signature bed", d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" },
                    { t: "High-speed Wi‑Fi", d: "M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" },
                    { t: "Climate control", d: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" },
                    { t: "In-room dining", d: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
                    { t: "Entertainment", d: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" },
                    { t: "Evening ritual", d: "M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" },
                  ].map((item) => (
                    <div key={item.t} className="flex items-center gap-3 rounded-2xl border border-gold-100/60 bg-cream-50/50 px-4 py-3 text-sm text-dark-700">
                      <svg className="h-5 w-5 shrink-0 text-gold-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.d} />
                      </svg>
                      {item.t}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-10 border-t border-gold-100/80 pt-8">
                <h3 className="font-serif text-xl text-elysium-ink">About this space</h3>
                <p className="mt-4 leading-relaxed text-dark-600">
                  Experience quiet luxury in a room layered with natural textures, bespoke furnishings, and light that
                  shifts gently through the day. Premium bedding, a generous bath, and intuitive technology complete a
                  stay that feels personal — never generic.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="panel-muted sticky top-28 rounded-luxury-lg px-7 py-8 text-center shadow-panel sm:px-9 sm:py-10 lg:text-left">
              <h2 className="font-serif text-xl font-semibold text-elysium-ink">Reserve</h2>
              <p className="mx-auto mt-2 max-w-xs text-sm text-dark-600 lg:mx-0">
                Select dates to continue. You&apos;ll confirm on the next step.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setBookingModal(true);
                }}
                className="mt-8 space-y-5"
              >
                <div>
                  <label className="input-label">Check-in</label>
                  <input
                    type="date"
                    name="check_in"
                    value={bookingData.check_in}
                    onChange={handleBookingChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="input-label">Check-out</label>
                  <input
                    type="date"
                    name="check_out"
                    value={bookingData.check_out}
                    onChange={handleBookingChange}
                    min={bookingData.check_in || new Date().toISOString().split("T")[0]}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="input-label">Guests</label>
                  <select
                    name="guests"
                    value={bookingData.guests}
                    onChange={handleBookingChange}
                    className="input-field"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num} Guest{num > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={room.status !== "available"}
                  className={`btn-primary mt-4 w-full justify-center py-3.5 ${room.status !== "available" ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  {room.status === "available" ? "Book now" : "Currently unavailable"}
                </button>
              </form>

              <div className="mt-8 space-y-3 border-t border-gold-200/60 pt-8 text-sm">
                <div className="flex justify-between text-dark-600">
                  <span>Room rate</span>
                  <span className="font-medium text-elysium-ink">${room.price}/night</span>
                </div>
                <div className="flex justify-between text-dark-600">
                  <span>Service fee</span>
                  <span className="font-medium text-elysium-ink">$25</span>
                </div>
                <div className="flex justify-between border-t border-gold-100/80 pt-4 font-serif text-lg font-semibold text-gold-700">
                  <span>From</span>
                  <span>${room.price + 25}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={bookingModal}
        onClose={() => setBookingModal(false)}
        title="Confirm reservation"
        size="md"
      >
        <form onSubmit={handleBookingSubmit} className="space-y-5">
          <div className="rounded-2xl border border-gold-200/60 bg-cream-50/80 p-5">
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-gold-800">Summary</h3>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-dark-600">Room</span>
                <span className="font-medium text-elysium-ink">{room.type || "Standard Room"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-600">Check-in</span>
                <span className="font-medium">{bookingData.check_in}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-600">Check-out</span>
                <span className="font-medium">{bookingData.check_out}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-600">Guests</span>
                <span className="font-medium">{bookingData.guests}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button type="button" onClick={() => setBookingModal(false)} className="btn-secondary flex-1">
              Cancel
            </button>
            <button
              type="submit"
              disabled={bookingLoading}
              className="btn-primary flex flex-1 items-center justify-center"
            >
              {bookingLoading ? (
                <svg className="h-5 w-5 animate-spin text-white" viewBox="0 0 24 24" aria-hidden>
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                "Confirm booking"
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RoomDetails;
