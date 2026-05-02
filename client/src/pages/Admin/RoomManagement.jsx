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
        <h1>Room Management</h1>
        <RoomCharts
          rooms={rooms}
          editingId={editingId}
          editData={editData}
          onEditClick={handleEditClick}
          onEditChange={handleEditChange}
          onSaveEdit={handleSaveEdit}
          onCancelEdit={handleCancelEdit}
          onDeleteRoom={handleDeleteRoom}
        />
      
    </div>
  );
};

export default RoomManagement;