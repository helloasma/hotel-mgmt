import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import "./RoomManagement.css";

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

  const [message, setMessage] = useState({
    text: "",
    type: "",
    location: "",
  });

  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const showMessage = (text, type = "success", location = "global") => {
    setMessage({ text, type, location });

    setTimeout(() => {
      setMessage({
        text: "",
        type: "",
        location: "",
      });
    }, 3500);
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

    if (sortOption === "priceLowToHigh") {
      return roomsCopy.sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (sortOption === "priceHighToLow") {
      return roomsCopy.sort((a, b) => Number(b.price) - Number(a.price));
    }

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
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateEditData = () => {
    const { title, type, category, price, capacity, totalRooms } = editData;

    if (
      !title ||
      !type ||
      !category ||
      price === "" ||
      capacity === "" ||
      totalRooms === ""
    ) {
      showMessage("Please fill in all edit fields.", "error", "edit");
      return false;
    }

    if (Number(price) < 0 || Number.isNaN(Number(price))) {
      showMessage("Price must be a valid number.", "error", "edit");
      return false;
    }

    if (
      Number(capacity) < 1 ||
      Number(capacity) > 6 ||
      Number.isNaN(Number(capacity))
    ) {
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
        prevRooms.map((room) =>
          room._id === roomId ? { ...room, ...response.data.data } : room
        )
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

      setRooms((prevRooms) =>
        prevRooms.filter((room) => room._id !== deleteConfirmId)
      );

      showMessage("Room deleted successfully.", "success", "global");
    } catch (error) {
      console.error("Error deleting room", error);
      showMessage("Failed to delete room.", "error", "global");
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const handleNewRoomChange = (field, value) => {
    setNewRoomData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateNewRoomData = () => {
    const { title, type, category, price, capacity, totalRooms } = newRoomData;

    if (
      !title ||
      !type ||
      !category ||
      price === "" ||
      capacity === "" ||
      totalRooms === ""
    ) {
      showMessage("Please fill in all fields before adding a room.", "error", "add");
      return false;
    }

    if (Number(price) < 0 || Number.isNaN(Number(price))) {
      showMessage("Price must be a valid number.", "error", "add");
      return false;
    }

    if (
      Number(capacity) < 1 ||
      Number(capacity) > 6 ||
      Number.isNaN(Number(capacity))
    ) {
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

      setNewRoomData({
        title: "",
        type: "",
        category: "",
        price: "",
        capacity: "",
        totalRooms: "",
      });

      setShowAddForm(false);
      showMessage("New room added successfully.", "success", "global");
    } catch (error) {
      console.error("Error adding room", error);
      showMessage("Failed to add new room.", "error", "add");
    }
  };

  const handleCancelAddRoom = () => {
    setNewRoomData({
      title: "",
      type: "",
      category: "",
      price: "",
      capacity: "",
      totalRooms: "",
    });

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
                  onChange={(e) =>
                    handleNewRoomChange("totalRooms", e.target.value)
                  }
                  required
                />
              </div>
            </div>

            <div className="add-form-actions">
              <button type="submit" className="create-room-btn">
                Save Room
              </button>

              <button
                type="button"
                className="cancel-add-room-btn"
                onClick={handleCancelAddRoom}
              >
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
                        onChange={(e) =>
                          handleEditChange("title", e.target.value)
                        }
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
                        onChange={(e) =>
                          handleEditChange("type", e.target.value)
                        }
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
                        onChange={(e) =>
                          handleEditChange("category", e.target.value)
                        }
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
                        onChange={(e) =>
                          handleEditChange("price", e.target.value)
                        }
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
                        onChange={(e) =>
                          handleEditChange("capacity", e.target.value)
                        }
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
                        onChange={(e) =>
                          handleEditChange("totalRooms", e.target.value)
                        }
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
                          <button
                            className="save-btn"
                            onClick={() => handleSaveEdit(room._id)}
                          >
                            Save
                          </button>

                          <button
                            className="cancel-btn"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="edit-btn"
                            onClick={() => handleEditClick(room)}
                          >
                            Edit
                          </button>

                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteClick(room._id)}
                          >
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
              <button
                className="confirm-modal-cancel"
                onClick={() => setDeleteConfirmId(null)}
              >
                Cancel
              </button>

              <button
                className="confirm-modal-delete"
                onClick={handleConfirmDeleteRoom}
              >
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