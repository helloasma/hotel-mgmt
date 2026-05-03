import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import "./RoomManagement.css";

const EditIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const DeleteIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

const SaveIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const CancelIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("relevance");

  const [showAddForm, setShowAddForm] = useState(false);
  const [newRoomData, setNewRoomData] = useState({
    title: "",
    type: "",
    category: "",
    price: "",
    capacity: "",
    totalRooms: "",
  });

  const [message, setMessage] = useState({ text: "", type: "", location: "" });
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const showMessage = (text, type = "success", location = "global") => {
    setMessage({ text, type, location });
    setTimeout(() => setMessage({ text: "", type: "", location: "" }), 3500);
  };

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const response = await api.get("/rooms");
        setRooms(response.data.data || []);
      } catch (error) {
        console.error("Error fetching rooms", error);
        showMessage("Failed to load rooms.", "error", "global");
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, []);

  const sortedRooms = useMemo(() => {
    const roomsCopy = [...rooms];
    if (sortOption === "priceLowToHigh") return roomsCopy.sort((a, b) => Number(a.price) - Number(b.price));
    if (sortOption === "priceHighToLow") return roomsCopy.sort((a, b) => Number(b.price) - Number(a.price));
    return roomsCopy;
  }, [rooms, sortOption]);

  const handleEditClick = (room) => {
    setEditingId(room._id);
    setDeleteConfirmId(null);
    setEditData({
      title: room.title || "",
      type: room.type || "",
      category: room.category || "",
      price: room.price || 0,
      capacity: room.capacity || 0,
      totalRooms: room.totalRooms || 0,
    });
  };

  const handleEditChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const validateEditData = () => {
    const { title, type, category, price, capacity, totalRooms } = editData;

    if (!title || !type || !category || price === "" || capacity === "" || totalRooms === "") {
      showMessage("Please fill in all edit fields.", "error", "edit");
      return false;
    }
    if (Number(price) < 0 || Number.isNaN(Number(price))) {
      showMessage("Price must be a valid number.", "error", "edit");
      return false;
    }
    if (Number(capacity) < 1 || Number(capacity) > 6 || Number.isNaN(Number(capacity))) {
      showMessage("Capacity must be a number between 1 and 6.", "error", "edit");
      return false;
    }
    if (Number(totalRooms) < 1 || Number.isNaN(Number(totalRooms))) {
      showMessage("Units must be at least 1.", "error", "edit");
      return false;
    }
    return true;
  };

  const handleSaveEdit = async (roomId) => {
    if (!validateEditData()) return;

    try {
      const payload = {
        ...editData,
        title: editData.title.trim(),
        price: Number(editData.price),
        capacity: Number(editData.capacity),
        totalRooms: Number(editData.totalRooms),
      };

      const response = await api.put(`/rooms/${roomId}`, payload);

      setRooms((prevRooms) =>
        prevRooms.map((room) => (room._id === roomId ? { ...room, ...response.data.data } : room))
      );
      setEditingId(null);
      setEditData({});
      showMessage("Room updated successfully.", "success", "global");
    } catch (error) {
      console.error("Error saving room", error);
      showMessage("Failed to save room details.", "error", "edit");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleDeleteClick = (roomId) => {
    setDeleteConfirmId(roomId);
    setEditingId(null);
  };

  const handleConfirmDeleteRoom = async () => {
    try {
      await api.delete(`/rooms/${deleteConfirmId}`);
      setRooms((prevRooms) => prevRooms.filter((room) => room._id !== deleteConfirmId));
      showMessage("Room deleted successfully.", "success", "global");
    } catch (error) {
      console.error("Error deleting room", error);
      showMessage("Failed to delete room.", "error", "global");
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const handleNewRoomChange = (field, value) => {
    setNewRoomData((prev) => ({ ...prev, [field]: value }));
  };

  const validateNewRoomData = () => {
    const { title, type, category, price, capacity, totalRooms } = newRoomData;

    if (!title || !type || !category || price === "" || capacity === "" || totalRooms === "") {
      showMessage("Please fill in all fields before adding a room.", "error", "add");
      return false;
    }
    if (Number(price) < 0 || Number.isNaN(Number(price))) {
      showMessage("Price must be a valid number.", "error", "add");
      return false;
    }
    if (Number(capacity) < 1 || Number(capacity) > 6 || Number.isNaN(Number(capacity))) {
      showMessage("Capacity must be a number between 1 and 6.", "error", "add");
      return false;
    }
    if (Number(totalRooms) < 1 || Number.isNaN(Number(totalRooms))) {
      showMessage("Units must be at least 1.", "error", "add");
      return false;
    }
    return true;
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    if (!validateNewRoomData()) return;

    const { title, type, category, price, capacity, totalRooms } = newRoomData;

    try {
      const payload = {
        title: title.trim(),
        type,
        category,
        price: Number(price),
        capacity: Number(capacity),
        totalRooms: Number(totalRooms),
        availableRooms: Number(totalRooms),
        description: `${title.trim()} - ${type} ${category}`,
        amenities: [],
        images: [],
        available: true,
      };

      const response = await api.post("/rooms", payload);

      setRooms((prevRooms) => [...prevRooms, response.data.data]);
      setNewRoomData({ title: "", type: "", category: "", price: "", capacity: "", totalRooms: "" });
      setShowAddForm(false);
      showMessage("New room added successfully.", "success", "global");
    } catch (error) {
      console.error("Error adding room", error);
      showMessage("Failed to add new room.", "error", "add");
    }
  };

  const handleCancelAddRoom = () => {
    setNewRoomData({ title: "", type: "", category: "", price: "", capacity: "", totalRooms: "" });
    setShowAddForm(false);
  };

  const renderMessage = (location) => {
    if (!message.text || message.location !== location) return null;
    return (
      <p className={`ui-message ${message.type === "success" ? "success" : "error"}`}>
        {message.text}
      </p>
    );
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-content">
          <h1>Rooms Management</h1>
          <p>Loading rooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-content">
        <h1>Rooms Management</h1>

        <div className="table-toolbar">
          <div className="sort-control">
            <label htmlFor="room-sort">Sort By</label>
            <select
              id="room-sort"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="relevance">Relevance</option>
              <option value="priceLowToHigh">Price Low to High</option>
              <option value="priceHighToLow">Price High to Low</option>
            </select>
          </div>

          <div className="add-room-area">
            <button
              className="add-room-btn"
              onClick={() => {
                setShowAddForm((prev) => !prev);
                setDeleteConfirmId(null);
                setEditingId(null);
              }}
            >
              <PlusIcon />
              {showAddForm ? "Close Form" : "Add New Room"}
            </button>
          </div>
        </div>

        {renderMessage("global")}

        {showAddForm && (
          <form className="add-room-form" onSubmit={handleAddRoom}>
            <div className="add-room-grid">
              <div className="form-group">
                <label>Room Name</label>
                <input
                  type="text"
                  value={newRoomData.title}
                  onChange={(e) => handleNewRoomChange("title", e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Type</label>
                <select
                  value={newRoomData.type}
                  onChange={(e) => handleNewRoomChange("type", e.target.value)}
                  required
                >
                  <option value="">Select type</option>
                  <option value="Suite">Suite</option>
                  <option value="Standard">Standard</option>
                </select>
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  value={newRoomData.category}
                  onChange={(e) => handleNewRoomChange("category", e.target.value)}
                  required
                >
                  <option value="">Select category</option>
                  <option value="Bungalow">Bungalow</option>
                  <option value="Cabin">Cabin</option>
                  <option value="Hotel">Hotel</option>
                </select>
              </div>

              <div className="form-group">
                <label>Price</label>
                <input
                  type="number"
                  min="0"
                  value={newRoomData.price}
                  onChange={(e) => handleNewRoomChange("price", e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Capacity</label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={newRoomData.capacity}
                  onChange={(e) => handleNewRoomChange("capacity", e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Units</label>
                <input
                  type="number"
                  min="1"
                  value={newRoomData.totalRooms}
                  onChange={(e) => handleNewRoomChange("totalRooms", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="add-form-actions">
              <button type="submit" className="create-room-btn">
                <SaveIcon />
                Save Room
              </button>

              <button type="button" className="cancel-add-room-btn" onClick={handleCancelAddRoom}>
                <CancelIcon />
                Cancel
              </button>
            </div>

            {renderMessage("add")}
          </form>
        )}

        {renderMessage("edit")}

        <table>
          <thead>
            <tr>
              <th>Room Name</th>
              <th>Type</th>
              <th>Category</th>
              <th>Price</th>
              <th>Capacity</th>
              <th>Units</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {sortedRooms.length > 0 ? (
              sortedRooms.map((room) => (
                <tr key={room._id}>
                  <td>
                    {editingId === room._id ? (
                      <input
                        type="text"
                        value={editData.title}
                        onChange={(e) => handleEditChange("title", e.target.value)}
                        className="edit-input"
                      />
                    ) : (
                      <span className="cell-content">{room.title}</span>
                    )}
                  </td>

                  <td>
                    {editingId === room._id ? (
                      <select
                        value={editData.type}
                        onChange={(e) => handleEditChange("type", e.target.value)}
                        className="edit-input"
                      >
                        <option value="Suite">Suite</option>
                        <option value="Standard">Standard</option>
                      </select>
                    ) : (
                      <span className="cell-content">{room.type}</span>
                    )}
                  </td>

                  <td>
                    {editingId === room._id ? (
                      <select
                        value={editData.category}
                        onChange={(e) => handleEditChange("category", e.target.value)}
                        className="edit-input"
                      >
                        <option value="Bungalow">Bungalow</option>
                        <option value="Cabin">Cabin</option>
                        <option value="Hotel">Hotel</option>
                      </select>
                    ) : (
                      <span className="cell-content">{room.category}</span>
                    )}
                  </td>

                  <td>
                    {editingId === room._id ? (
                      <input
                        type="number"
                        min="0"
                        value={editData.price}
                        onChange={(e) => handleEditChange("price", e.target.value)}
                        className="edit-input"
                      />
                    ) : (
                      <span className="cell-content">${room.price}</span>
                    )}
                  </td>

                  <td>
                    {editingId === room._id ? (
                      <input
                        type="number"
                        min="1"
                        max="6"
                        value={editData.capacity}
                        onChange={(e) => handleEditChange("capacity", e.target.value)}
                        className="edit-input"
                      />
                    ) : (
                      <span className="cell-content">{room.capacity}</span>
                    )}
                  </td>

                  <td>
                    {editingId === room._id ? (
                      <input
                        type="number"
                        min="1"
                        value={editData.totalRooms}
                        onChange={(e) => handleEditChange("totalRooms", e.target.value)}
                        className="edit-input"
                      />
                    ) : (
                      <span className="cell-content">{room.totalRooms}</span>
                    )}
                  </td>

                  <td>
                    <div className="action-buttons">
                      {editingId === room._id ? (
                        <>
                          <button className="save-btn" onClick={() => handleSaveEdit(room._id)}>
                            <SaveIcon />
                            Save
                          </button>

                          <button className="cancel-btn" onClick={handleCancelEdit}>
                            <CancelIcon />
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="edit-btn" onClick={() => handleEditClick(room)}>
                            <EditIcon />
                            Edit
                          </button>

                          <button className="delete-btn" onClick={() => handleDeleteClick(room._id)}>
                            <DeleteIcon />
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No rooms found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {deleteConfirmId && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal">
            <p>Are you sure you want to delete this room?</p>
            <div className="confirm-modal-actions">
              <button className="confirm-modal-cancel" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </button>
              <button className="confirm-modal-delete" onClick={handleConfirmDeleteRoom}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomManagement;
