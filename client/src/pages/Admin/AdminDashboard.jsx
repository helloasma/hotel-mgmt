import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import accountIcon from "../../assets/accountIcon.png";
import BookingStats from "../../components/Admin/BookingStats";
import RoomCharts from "../../components/Admin/RoomCharts";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalUsers: 0,
    totalRooms: 0,
  });
  const [adminUser, setAdminUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    responsibility: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [statsResponse, userResponse, bookingsResponse, roomsResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/admin/dashboard", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get("http://localhost:5000/api/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get("http://localhost:5000/api/bookings/all", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get("http://localhost:5000/api/rooms"),
        ]);

        setStats(statsResponse.data.data);
        setAdminUser(userResponse.data.data);
        setBookings(bookingsResponse.data.data || []);
        setRooms(roomsResponse.data.data || []);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/admin/login");
  };

  const handleEditClick = () => {
    if (!adminUser) return;

    setEditForm({
      name: adminUser.name || "",
      phone: adminUser.phone || "",
      responsibility: adminUser.responsibility || "New Staff",
    });
    setIsEditing(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/users/${adminUser._id}`,
        {
          name: editForm.name,
          phone: editForm.phone,
          responsibility: editForm.responsibility,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAdminUser(response.data.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Unable to update profile", error);
      alert("Unable to save profile changes");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const getJoinedDate = () => {
    if (!adminUser || !adminUser.createdAt) return "N/A";
    return new Date(adminUser.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="admin-page">
      <div className="admin-content">
        <div className="dashboard-header">
          <h1>Welcome back {adminUser?.name || "Admin"}</h1>
        </div>

        <div className="dashboard-layout">
          {/* Left Side - Stats and Analytics */}
          <div className="dashboard-left">
            <div className="dashboard-stats">
              <div className="stat-card">
                <h3>Total Bookings</h3>
                <p className="stat-value">{stats.totalBookings}</p>
              </div>
              <div className="stat-card">
                <h3>Total Users</h3>
                <p className="stat-value">{stats.totalUsers}</p>
              </div>
              <div className="stat-card">
                <h3>Total Rooms</h3>
                <p className="stat-value">{stats.totalRooms}</p>
              </div>
            </div>

            <BookingStats bookings={bookings} />
            <RoomCharts rooms={rooms} />
          </div>

          {/* Right Side - User Info Card */}
          {adminUser && (
            <div className="dashboard-right">
              <div className="user-info-card">
                <div className="user-icon">
                  <img src={accountIcon} alt="User" />
                </div>
                <div className="user-details">
                  <div className="detail-group">
                    <label>Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                      />
                    ) : (
                      <p>{adminUser.name}</p>
                    )}
                  </div>
                  <div className="detail-group">
                    <label>Responsibility</label>
                    {isEditing ? (
                      <select
                        name="responsibility"
                        value={editForm.responsibility}
                        onChange={handleEditChange}
                      >
                        <option value="Manager">Manager</option>
                        <option value="Receptionist">Receptionist</option>
                        <option value="Housekeeper">Housekeeper</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="New Staff">New Staff</option>
                      </select>
                    ) : (
                      <p>{adminUser.responsibility || "N/A"}</p>
                    )}
                  </div>
                  <div className="detail-group">
                    <label>Email</label>
                    <p>{adminUser.email}</p>
                  </div>
                  <div className="detail-group">
                    <label>Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={editForm.phone}
                        onChange={handleEditChange}
                      />
                    ) : (
                      <p>{adminUser.phone}</p>
                    )}
                  </div>
                  <div className="detail-group">
                    <label>Joined Lovender</label>
                    <p>{getJoinedDate()}</p>
                  </div>
                </div>

                <div className="dashboard-actions">
                  {isEditing ? (
                    <>
                      <button className="save-btn" onClick={handleSaveProfile}>
                        Save
                      </button>
                      <button className="cancel-btn" onClick={handleCancelEdit}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="edit-profile-btn" onClick={handleEditClick}>
                        Edit Profile
                      </button>
                      <button className="logout-btn" onClick={handleLogout}>
                        Logout
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;