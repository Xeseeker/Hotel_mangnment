import React, { useState, useEffect } from "react";
import { roomService } from "../../services/roomService";
import Modal from "../../components/ui/Modal";
import Skeleton from "../../components/ui/Skeleton";
import { useToaster } from "../../components/ui/Toaster";
import StatusPill from "../../components/luxury/StatusPill";

const ManageRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    room_number: "",
    type: "",
    price: "",
    status: "available",
    image: null,
  });
  const [selectedFileName, setSelectedFileName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useToaster();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await roomService.getAllRooms();
      setRooms(response.data || []);
    } catch (error) {
      addToast("Failed to load rooms", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (room = null) => {
    if (room) {
      setEditingRoom(room);
      setFormData({
        room_number: room.room_number,
        type: room.type,
        price: room.price,
        status: room.status,
        image: null,
      });
      setSelectedFileName("");
    } else {
      setEditingRoom(null);
      setFormData({
        room_number: "",
        type: "",
        price: "",
        status: "available",
        image: null,
      });
      setSelectedFileName("");
    }
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const imageFile = files?.[0] || null;
      setFormData({ ...formData, image: imageFile });
      setSelectedFileName(imageFile?.name || "");
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingRoom) {
        await roomService.updateRoom(editingRoom.id, formData);
        addToast("Room updated successfully", "success");
      } else {
        await roomService.createRoom(formData);
        addToast("Room created successfully", "success");
      }
      setModalOpen(false);
      fetchRooms();
    } catch (error) {
      addToast(error.response?.data?.message || "Operation failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    try {
      await roomService.deleteRoom(id);
      addToast("Room deleted successfully", "success");
      fetchRooms();
    } catch (error) {
      addToast("Failed to delete room", "error");
    }
  };

  if (loading) {
    return (
      <div className="page-wrap">
        <Skeleton className="mb-8 h-12 w-56 rounded-luxury" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-luxury-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrap">
      <div className="page-hero mb-10">
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="section-kicker">Inventory</p>
            <h1 className="heading-lg mt-4 text-white">Manage rooms</h1>
            <p className="mt-3 max-w-xl text-white/75">
              Add, edit, or remove rooms from Elysium Grand.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleOpenModal()}
            className="btn-primary shrink-0 px-8"
          >
            + Add room
          </button>
        </div>
      </div>

      {rooms.length === 0 ? (
        <div className="panel-muted py-16 text-center">
          <h3 className="heading-sm text-elysium-ink">No rooms yet</h3>
          <p className="mt-2 text-dark-600">Start by adding your first room.</p>
          <button
            type="button"
            onClick={() => handleOpenModal()}
            className="btn-primary mt-8"
          >
            Add room
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="overflow-hidden rounded-luxury-lg border border-gold-100/80 bg-white/95 shadow-panel transition duration-500 hover:shadow-panel-hover"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={
                    room.image_url ||
                    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400"
                  }
                  alt={room.type}
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                />
                <div className="absolute right-3 top-3">
                  <StatusPill status={room.status} domain="room" />
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-serif text-lg font-semibold text-elysium-ink">
                  {room.type || "Standard Room"}
                </h3>
                <p className="mt-1 text-sm text-gold-800/80">
                  Room {room.room_number}
                </p>
                <p className="mt-4 font-serif text-xl font-bold text-gold-600">
                  ${room.price}/night
                </p>
                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleOpenModal(room)}
                    className="btn-secondary flex-1 py-2.5 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(room.id)}
                    className="flex-1 rounded-full border border-rose-200 bg-rose-50 py-2.5 text-sm font-semibold text-rose-800 transition hover:bg-rose-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingRoom ? "Edit Room" : "Add New Room"}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-2">
              Room Number
            </label>
            <input
              type="text"
              name="room_number"
              value={formData.room_number}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-2">
              Room Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="">Select Type</option>
              <option value="single">Single</option>
              <option value="double">Double</option>
              <option value="suite">Suite</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-2">
              Price per Night ($)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="input-field"
              required
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="input-field"
            >
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-2">
              Room Image
            </label>
            <input
              type="file"
              name="image"
              accept=".png,.jpg,.jpeg,image/png,image/jpeg"
              onChange={handleChange}
              className="input-field"
            />
            <p className="text-xs text-dark-500 mt-2">
              Upload a PNG or JPG image up to 5MB.
            </p>
            {selectedFileName ? (
              <p className="text-sm text-dark-600 mt-2">{selectedFileName}</p>
            ) : editingRoom?.image_url ? (
              <p className="text-sm text-dark-600 mt-2">
                Current image will be kept if you do not upload a new one.
              </p>
            ) : null}
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 btn-primary"
            >
              {submitting ? "Saving..." : editingRoom ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageRooms;
