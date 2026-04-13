import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { roomService } from "../../services/roomService";
import { reservationService } from "../../services/reservationService";
import { useToaster } from "../../components/ui/Toaster";

const CreateReservation = () => {
  const navigate = useNavigate();
  const { addToast } = useToaster();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    room_id: "",
    guest_name: "",
    guest_email: "",
    guest_phone: "",
    check_in: "",
    check_out: "",
    guests: 1,
  });

  useEffect(() => {
    roomService.getAllRooms().then((res) => {
      setRooms(res.data?.filter((r) => r.status === "available") || []);
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const selectedRoom = rooms.find((room) => String(room.id) === formData.room_id);
  const totalNights =
    formData.check_in && formData.check_out
      ? Math.max(
          1,
          Math.ceil(
            (new Date(formData.check_out) - new Date(formData.check_in)) /
              (1000 * 60 * 60 * 24),
          ),
        )
      : 0;
  const estimatedTotal = selectedRoom ? selectedRoom.price * totalNights : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await reservationService.createReservation({
        room_id: parseInt(formData.room_id),
        check_in: formData.check_in,
        check_out: formData.check_out,
        guests: parseInt(formData.guests),
      });
      addToast("Reservation created successfully!", "success");
      navigate("/receptionist");
    } catch (error) {
      addToast("Failed to create reservation", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrap">
      <div className="page-hero">
        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="section-kicker">Guest Booking Desk</p>
            <h1 className="heading-lg mt-5 max-w-2xl text-white">
              Create a reservation with the warmth and polish of a luxury front
              office.
            </h1>
            <p className="mt-4 max-w-2xl text-white/75">
              Capture the stay details, assign the best available room, and move
              the guest smoothly into the arrival pipeline.
            </p>
          </div>

          <div className="panel border-white/10 bg-white/10 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/55">
              Booking summary
            </p>
            <div className="mt-5 space-y-4 text-sm text-white/80">
              <div className="flex items-center justify-between rounded-[18px] border border-white/10 bg-white/8 px-4 py-3">
                <span>Available rooms</span>
                <span className="text-xl font-semibold text-white">
                  {rooms.length}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-[18px] border border-white/10 bg-white/8 px-4 py-3">
                <span>Selected stay</span>
                <span className="font-semibold text-white">
                  {totalNights > 0 ? `${totalNights} night${totalNights > 1 ? "s" : ""}` : "Not set"}
                </span>
              </div>
              <div className="rounded-[18px] border border-white/10 bg-white/8 px-4 py-4">
                <p className="text-white/65">Estimated total</p>
                <p className="mt-2 text-3xl font-semibold text-white">
                  {estimatedTotal > 0 ? `$${estimatedTotal}` : "Awaiting dates"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="panel">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="luxury-badge">Reservation Form</p>
              <h2 className="heading-sm mt-3">Guest and stay details</h2>
            </div>
            <p className="text-sm text-dark-600">Current functionality preserved</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="input-label">Guest Name</label>
                <input
                  type="text"
                  name="guest_name"
                  value={formData.guest_name}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter full guest name"
                  required
                />
              </div>
              <div>
                <label className="input-label">Guest Email</label>
                <input
                  type="email"
                  name="guest_email"
                  value={formData.guest_email}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="guest@example.com"
                  required
                />
              </div>
              <div>
                <label className="input-label">Guest Phone</label>
                <input
                  type="tel"
                  name="guest_phone"
                  value={formData.guest_phone}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Phone number"
                  required
                />
              </div>
              <div>
                <label className="input-label">Number of Guests</label>
                <select
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  className="input-field"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {n} Guest{n > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="input-label">Check-in Date</label>
                <input
                  type="date"
                  name="check_in"
                  value={formData.check_in}
                  onChange={handleChange}
                  className="input-field"
                  required
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div>
                <label className="input-label">Check-out Date</label>
                <input
                  type="date"
                  name="check_out"
                  value={formData.check_out}
                  onChange={handleChange}
                  className="input-field"
                  required
                  min={formData.check_in || new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="md:col-span-2">
                <label className="input-label">Select Room</label>
                <select
                  name="room_id"
                  value={formData.room_id}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Choose a room</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      Room {room.room_number} - {room.type} (${room.price}/night)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-4 border-t border-[#ebdfcf] pt-6 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate("/receptionist")}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1"
              >
                {loading ? "Creating..." : "Create Reservation"}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="panel">
            <p className="luxury-badge">Selected Room</p>
            <div className="mt-4 rounded-[24px] border border-[#eadac3] bg-[linear-gradient(180deg,#fffdf9_0%,#f8f0e5_100%)] p-5">
              {selectedRoom ? (
                <>
                  <p className="text-sm uppercase tracking-[0.22em] text-dark-500">
                    Room {selectedRoom.room_number}
                  </p>
                  <h3 className="mt-3 font-serif text-3xl text-dark-950">
                    {selectedRoom.type}
                  </h3>
                  <p className="mt-3 text-dark-600">
                    ${selectedRoom.price} per night for a refined guest experience.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="font-serif text-2xl text-dark-950">
                    No room selected yet
                  </h3>
                  <p className="mt-3 text-dark-600">
                    Choose from the available inventory to preview pricing and stay value.
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="panel-muted">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-dark-500">
              Front desk tip
            </p>
            <p className="mt-3 text-sm leading-7 text-dark-700">
              Contact details are shown in the booking flow for staff convenience, while the submit payload still follows your existing backend contract.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateReservation;
