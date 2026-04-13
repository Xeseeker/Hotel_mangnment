import React, { useState, useEffect } from "react";
import { reservationService } from "../../services/reservationService";
import { roomService } from "../../services/roomService";
import Skeleton from "../../components/ui/Skeleton";
import Modal from "../../components/ui/Modal";
import { useToaster } from "../../components/ui/Toaster";
import StatusPill from "../../components/luxury/StatusPill";

const CheckInOut = () => {
  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const [processing, setProcessing] = useState(false);
  const { addToast } = useToaster();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resRes, roomRes] = await Promise.all([
        reservationService.getAllReservations(),
        roomService.getAllRooms(),
      ]);
      setReservations(resRes.data || []);
      const map = {};
      (roomRes.data || []).forEach((r) => {
        map[r.id] = r;
      });
      setRooms(map);
    } catch (error) {
      addToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    if (!selectedReservation) return;
    setProcessing(true);
    try {
      if (actionType === "check-in") {
        await reservationService.checkInReservation(selectedReservation.id);
        addToast("Guest checked in successfully", "success");
      } else if (actionType === "check-out") {
        await reservationService.checkOutReservation(selectedReservation.id);
        addToast("Guest checked out successfully", "success");
      }
      setModalOpen(false);
      fetchData();
    } catch (error) {
      addToast("Operation failed", "error");
    } finally {
      setProcessing(false);
    }
  };

  const openModal = (reservation, type) => {
    setSelectedReservation(reservation);
    setActionType(type);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="page-wrap">
        <Skeleton className="mb-8 h-56 rounded-[32px]" />
        <div className="grid gap-8 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-96 rounded-[28px]" />
          ))}
        </div>
      </div>
    );
  }

  const pendingCheckIn = reservations.filter((r) => r.status === "confirmed");
  const pendingCheckOut = reservations.filter((r) => r.status === "checked_in");

  const renderReservationCard = (res, type) => {
    const room = rooms[res.room_id];
    const isCheckIn = type === "check-in";

    return (
      <div
        key={res.id}
        className="panel-muted transition duration-200 hover:-translate-y-1"
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-dark-500">
              Room {room?.room_number || "N/A"}
            </p>
            <h3 className="mt-2 text-xl font-semibold text-dark-950">
              {room?.type || "Room details unavailable"}
            </h3>
            <div className="mt-4 space-y-3 text-sm text-dark-600">
              <p>
                {isCheckIn ? "Arrival" : "Departure"}: {new Date(isCheckIn ? res.check_in : res.check_out).toLocaleDateString()}
              </p>
              <p>Guests: {res.guests}</p>
              <StatusPill status={res.status} domain="reservation" />
            </div>
          </div>
          <button
            onClick={() => openModal(res, type)}
            className={isCheckIn ? "btn-primary" : "btn-secondary"}
          >
            {isCheckIn ? "Check-in Guest" : "Check-out Guest"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="page-wrap">
      <div className="page-hero">
        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="section-kicker">Guest Movement</p>
            <h1 className="heading-lg mt-5 max-w-2xl text-white">
              Handle arrivals and departures from one calm, professional check-in desk.
            </h1>
            <p className="mt-4 max-w-2xl text-white/75">
              Every queue is surfaced clearly so your reception team can prioritize the next guest without losing room context.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="panel border-white/10 bg-white/10 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/55">
                Pending arrivals
              </p>
              <p className="mt-3 text-4xl font-semibold text-white">
                {pendingCheckIn.length}
              </p>
            </div>
            <div className="panel border-white/10 bg-white/10 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/55">
                Pending departures
              </p>
              <p className="mt-3 text-4xl font-semibold text-white">
                {pendingCheckOut.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-2">
        <div className="panel">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="luxury-badge">Arrivals</p>
              <h2 className="heading-sm mt-3">Pending check-ins</h2>
            </div>
            <span className="text-sm text-dark-600">{pendingCheckIn.length} guests waiting</span>
          </div>
          {pendingCheckIn.length === 0 ? (
            <div className="panel-muted text-sm text-dark-600">
              No pending check-ins right now.
            </div>
          ) : (
            <div className="space-y-4">
              {pendingCheckIn.map((res) => renderReservationCard(res, "check-in"))}
            </div>
          )}
        </div>

        <div className="panel">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="luxury-badge">Departures</p>
              <h2 className="heading-sm mt-3">Pending check-outs</h2>
            </div>
            <span className="text-sm text-dark-600">{pendingCheckOut.length} guests leaving</span>
          </div>
          {pendingCheckOut.length === 0 ? (
            <div className="panel-muted text-sm text-dark-600">
              No pending check-outs right now.
            </div>
          ) : (
            <div className="space-y-4">
              {pendingCheckOut.map((res) => renderReservationCard(res, "check-out"))}
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Confirm ${actionType === "check-in" ? "Check-in" : "Check-out"}`}
        size="sm"
      >
        <p className="text-dark-700">
          Are you sure you want to {actionType === "check-in" ? "check in" : "check out"} this guest?
        </p>
        <div className="mt-6 flex gap-4">
          <button
            onClick={() => setModalOpen(false)}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
          <button
            onClick={handleAction}
            disabled={processing}
            className="btn-primary flex-1"
          >
            {processing ? "Processing..." : "Confirm"}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CheckInOut;
