import React, { useState, useEffect } from "react";
import { reservationService } from "../../services/reservationService";
import { roomService } from "../../services/roomService";
import Skeleton from "../../components/ui/Skeleton";
import { useToaster } from "../../components/ui/Toaster";
import StatusPill from "../../components/luxury/StatusPill";

const ReceptionistReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState({});
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return (
      <div className="page-wrap">
        <Skeleton className="mb-8 h-56 rounded-[32px]" />
        <Skeleton className="h-[460px] rounded-[28px]" />
      </div>
    );
  }

  return (
    <div className="page-wrap">
      <div className="page-hero">
        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="section-kicker">Reservation Ledger</p>
            <h1 className="heading-lg mt-5 max-w-2xl text-white">
              View every reservation in a cleaner table designed for hotel operations.
            </h1>
            <p className="mt-4 max-w-2xl text-white/75">
              Staff can scan room assignments, stay dates, and booking status quickly without losing the premium front-desk feel.
            </p>
          </div>
          <div className="panel border-white/10 bg-white/10 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/55">
              Reservation volume
            </p>
            <p className="mt-4 text-5xl font-semibold text-white">
              {reservations.length}
            </p>
            <p className="mt-3 text-sm text-white/70">
              Total reservations visible to the receptionist team.
            </p>
          </div>
        </div>
      </div>

      {reservations.length === 0 ? (
        <div className="panel mt-8 text-center">
          <h3 className="heading-sm">No Reservations</h3>
          <p className="mt-3 text-dark-600">There are no reservations yet.</p>
        </div>
      ) : (
        <div className="table-shell mt-8">
          <div className="overflow-x-auto px-2 pb-2 sm:px-4 sm:pb-3">
            <table className="w-full min-w-[760px]">
              <thead className="bg-gradient-to-r from-cream-100 to-cream-50">
                <tr>
                  <th className="table-header-cell">Room</th>
                  <th className="table-header-cell">Check-in</th>
                  <th className="table-header-cell">Check-out</th>
                  <th className="table-header-cell">Guests</th>
                  <th className="table-header-cell">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-100/80">
                {reservations.map((res) => {
                  const room = rooms[res.room_id];
                  return (
                    <tr key={res.id} className="transition duration-300 hover:bg-cream-50/80">
                      <td className="table-body-cell">
                        <div>
                          <p className="font-semibold text-dark-950">
                            {room ? room.type : "N/A"}
                          </p>
                          <p className="text-xs uppercase tracking-[0.18em] text-dark-500">
                            Room {room?.room_number || "--"}
                          </p>
                        </div>
                      </td>
                      <td className="table-body-cell">
                        {new Date(res.check_in).toLocaleDateString()}
                      </td>
                      <td className="table-body-cell">
                        {new Date(res.check_out).toLocaleDateString()}
                      </td>
                      <td className="table-body-cell">{res.guests}</td>
                      <td className="table-body-cell">
                        <StatusPill status={res.status} domain="reservation" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceptionistReservations;
