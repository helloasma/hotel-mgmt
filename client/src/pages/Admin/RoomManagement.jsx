import { useEffect, useState } from "react";
import axios from "axios";
import RoomCharts from "../../components/Admin/RoomCharts";
import "./RoomManagement.css";

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/rooms", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setRooms(response.data.data);
      } catch (error) {
        console.error("Error fetching rooms", error);
      }
    };

    loadRooms();
  }, []);

  const handleEditClick = (room) => {
    setEditingId(room._id);
    setEditData({
      description: room.description || "",
      amenities: Array.isArray(room.amenities) ? room.amenities.join(", ") : room.amenities || "",
      view: room.view || "",
      bed: room.bed || "",
      price: room.price || 0,
      capacity: room.capacity || 0,
    });
  };

  const handleEditChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveEdit = async (roomId) => {
    try {
      const amenities = typeof editData.amenities === "string"
        ? editData.amenities
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item)
        : editData.amenities;

      const payload = {
        ...editData,
        price: Number(editData.price),
        capacity: Number(editData.capacity),
        amenities,
      };

      const response = await axios.put(
        `http://localhost:5000/api/rooms/${roomId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setRooms(
        rooms.map((room) =>
          room._id === roomId ? { ...room, ...response.data.data } : room
        )
      );
      setEditingId(null);
      setEditData({});
    } catch (error) {
      console.error("Error saving room", error);
      alert("Failed to save room details");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleDeleteRoom = async (roomId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this room?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/rooms/${roomId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setRooms(rooms.filter((room) => room._id !== roomId));
    } catch (error) {
      console.error("Error deleting room", error);
      alert("Failed to delete room");
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-content">
        <h1>Rooms Management</h1>
        <table>
          <thead>
            <tr>
              <th>Room Name</th>
              <th>Category</th>
              <th>Type</th>
              <th>Price</th>
              <th>Units</th>
              <th>Description</th>
              <th>Amenities</th>
              <th>View</th>
              <th>Bed</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room._id}>
                <td>{room.title}</td>
                <td>{room.category}</td>
                <td>{room.type}</td>
                <td>${room.price}</td>
                <td>{room.totalRooms}</td>
                <td>
                  {editingId === room._id ? (
                    <textarea
                      value={editData.description}
                      onChange={(e) =>
                        handleEditChange("description", e.target.value)
                      }
                      className="edit-input"
                      rows="2"
                    />
                  ) : (
                    <span className="cell-content">
                      {room.description || "-"}
                    </span>
                  )}
                </td>
                <td>
                  {editingId === room._id ? (
                    <textarea
                      value={editData.amenities}
                      onChange={(e) =>
                        handleEditChange("amenities", e.target.value)
                      }
                      className="edit-input"
                      rows="2"
                    />
                  ) : (
                    <span className="cell-content">{room.amenities || "-"}</span>
                  )}
                </td>
                <td>
                  {editingId === room._id ? (
                    <input
                      type="text"
                      value={editData.view}
                      onChange={(e) => handleEditChange("view", e.target.value)}
                      className="edit-input"
                    />
                  ) : (
                    <span className="cell-content">{room.view || "-"}</span>
                  )}
                </td>
                <td>
                  {editingId === room._id ? (
                    <input
                      type="text"
                      value={editData.bed}
                      onChange={(e) => handleEditChange("bed", e.target.value)}
                      className="edit-input"
                    />
                  ) : (
                    <span className="cell-content">{room.bed || "-"}</span>
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
                      <button
                        className="edit-btn"
                        onClick={() => handleEditClick(room)}
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <RoomCharts rooms={rooms} />
      </div>
    </div>
  );
};

export default RoomManagement;