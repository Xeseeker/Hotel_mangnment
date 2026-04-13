import React, { useState, useEffect } from "react";
import { reservationService } from "../../services/reservationService";
import { roomService } from "../../services/roomService";
import Skeleton from "../../components/ui/Skeleton";
import Modal from "../../components/ui/Modal";
import { useToaster } from "../../components/ui/Toaster";
import StatusPill from "../../components/luxury/StatusPill";

const ManageReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [actionModal, setActionModal] = useState({ type: null, open: false });
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

  const handleAction = async (action) => {
    if (!selectedReservation) return;
    setProcessing(true);
    try {
      if (action === "cancel") {
        await reservationService.cancelReservation(selectedReservation.id);
      } else if (action === "check-in") {
        await reservationService.checkInReservation(selectedReservation.id);
      } else if (action === "check-out") {
        await reservationService.checkOutReservation(selectedReservation.id);
      }
      addToast(`Reservation ${action} successful`, "success");
      setActionModal({ type: null, open: false });
      fetchData();
    } catch (error) {
      addToast("Operation failed", "error");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="page-wrap">
        <Skeleton className="mb-8 h-48 rounded-luxury-lg" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-luxury" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrap">
      <div className="page-hero mb-10">
        <div className="relative z-10 max-w-3xl">
          <p className="section-kicker">Bookings</p>
          <h1 className="heading-lg mt-4 text-white">Manage reservations</h1>
          <p className="mt-3 text-white/75">View and manage all guest reservations.</p>
        </div>
      </div>

      {reservations.length === 0 ? (
        <div className="panel-muted py-16 text-center">
          <h3 className="heading-sm text-elysium-ink">No reservations</h3>
          <p className="mt-2 text-dark-600">There are no reservations yet.</p>
        </div>
      ) : (
        <div className="table-shell">
          <div className="overflow-x-auto px-2 pb-2 sm:px-4 sm:pb-3">
            <table className="w-full min-w-[760px]">
              <thead className="bg-gradient-to-r from-cream-100 to-cream-50">
                <tr>
                  <th className="table-header-cell">Room</th>
                  <th className="table-header-cell">Guest</th>
                  <th className="table-header-cell">Check-in</th>
                  <th className="table-header-cell">Check-out</th>
                  <th className="table-header-cell">Status</th>
                  <th className="table-header-cell">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-100/80">
                {reservations.map((res) => {
                  const room = rooms[res.room_id];
                  return (
                    <tr key={res.id} className="transition-colors duration-300 hover:bg-cream-50/80">
                      <td className="table-body-cell whitespace-nowrap">
                        {room ? `${room.type} — ${room.room_number}` : "N/A"}
                      </td>
                      <td className="table-body-cell whitespace-nowrap">{res.guests} guest(s)</td>
                      <td className="table-body-cell whitespace-nowrap">
                        {new Date(res.check_in).toLocaleDateString()}
                      </td>
                      <td className="table-body-cell whitespace-nowrap">
                        {new Date(res.check_out).toLocaleDateString()}
                      </td>
                      <td className="table-body-cell whitespace-nowrap">
                        <StatusPill status={res.status} domain="reservation" />
                      </td>
                      <td className="table-body-cell whitespace-nowrap text-sm">
                        <div className="flex flex-wrap gap-2">
                          {res.status === "pending" && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedReservation(res);
                                setActionModal({ type: "cancel", open: true });
                              }}
                              className="font-medium text-rose-700 transition hover:text-rose-800"
                            >
                              Cancel
                            </button>
                          )}
                          {res.status === "confirmed" && (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedReservation(res);
                                  setActionModal({
                                    type: "check-in",
                                    open: true,
                                  });
                                }}
                                className="font-medium text-sky-800 transition hover:text-sky-900"
                              >
                                Check-in
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedReservation(res);
                                  setActionModal({
                                    type: "cancel",
                                    open: true,
                                  });
                                }}
                                className="font-medium text-rose-700 transition hover:text-rose-800"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          {res.status === "checked_in" && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedReservation(res);
                                setActionModal({
                                  type: "check-out",
                                  open: true,
                                });
                              }}
                              className="font-medium text-emerald-800 transition hover:text-emerald-900"
                            >
                              Check-out
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        isOpen={actionModal.open}
        onClose={() => setActionModal({ type: null, open: false })}
        title={`Confirm ${actionModal.type}`}
        size="sm"
      >
        <p className="text-dark-700 mb-4">
          Are you sure you want to {actionModal.type} this reservation?
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => setActionModal({ type: null, open: false })}
            className="flex-1 btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={() => handleAction(actionModal.type)}
            disabled={processing}
            className="flex-1 btn-primary"
          >
            {processing ? "Processing..." : "Confirm"}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ManageReservations;
