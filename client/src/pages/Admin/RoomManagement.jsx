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
      amenities: room.amenities || "",
      view: room.view || "",
      bed: room.bed || "",
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
      await axios.put(
        `http://localhost:5000/api/rooms/${roomId}`,
        editData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setRooms(
        rooms.map((room) =>
          room._id === roomId ? { ...room, ...editData } : room
        )
      );
      setEditingId(null);
    } catch (error) {
      console.error("Error saving room", error);
      alert("Failed to save room details");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
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
              <th>Price</th>
              <th>Available Rooms</th>
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
                <td>${room.price}</td>
                <td>
                  {room.availableRooms} / {room.totalRooms}
                </td>
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