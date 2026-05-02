import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import accountIcon from "../../assets/accountIcon.png";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [adminUser, setAdminUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    responsibility: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAdminUser(response.data.data);
      } catch (error) {
        console.error("Error loading profile", error);
      }
    };

    loadUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/admin/login");
  };

  const handleEditClick = () => {
    if (!adminUser) return;

    setEditForm({
      name: adminUser.name || adminUser.fullName || "",
      phone: adminUser.phone || "",
      responsibility: adminUser.responsibility || "",
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
        "http://localhost:5000/api/auth/me",
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

  return (
    <div className="admin-page">
      <div className="admin-content">
        <div className="dashboard-header">
          <h1>My Account</h1>
        </div>

        {adminUser ? (
          <div className="user-info-card">
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
                  <p>{adminUser.name || adminUser.fullName}</p>
                )}
              </div>
              <div className="detail-group">
                <label>Role</label>
                <p>{adminUser.role}</p>
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
        ) : (
          <p>Loading profile...</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
