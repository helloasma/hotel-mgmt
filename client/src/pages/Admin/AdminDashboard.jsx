import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [adminUser, setAdminUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [pageMessage, setPageMessage] = useState({
    text: "",
    type: "",
  });

  const navigate = useNavigate();

  const showMessage = (text, type = "success") => {
    setPageMessage({ text, type });

    setTimeout(() => {
      setPageMessage({ text: "", type: "" });
    }, 3500);
  };

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

        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/admin/login");
      }
    };

    loadUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/admin/login");
  };

  const handleEditClick = () => {
    if (!adminUser) return;

    setEditForm({
      name: adminUser.fullName || "",
      email: adminUser.email || "",
      phone: adminUser.phone || "",
    });

    setIsEditing(true);
    setIsChangingPassword(false);
    setPageMessage({ text: "", type: "" });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    if (!editForm.name.trim()) {
      showMessage("Full name is required.", "error");
      return;
    }

    if (!editForm.email.trim()) {
      showMessage("Email is required.", "error");
      return;
    }

    if (!editForm.phone.trim()) {
      showMessage("Phone number is required.", "error");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        "http://localhost:5000/api/auth/me",
        {
          name: editForm.name,
          email: editForm.email,
          phone: editForm.phone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAdminUser(response.data.data);
      setIsEditing(false);

      showMessage(
        response.data.message || "Profile updated successfully.",
        "success"
      );
    } catch (error) {
      console.error("Unable to update profile", error);

      const errorMessage =
        error.response?.data?.message || "Unable to save profile changes.";

      showMessage(errorMessage, "error");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setPageMessage({ text: "", type: "" });
  };

  const handlePasswordFormChange = (e) => {
    const { name, value } = e.target;

    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangePassword = async () => {
    if (!passwordForm.newPassword || !passwordForm.confirmPassword) {
      showMessage("Please fill in both password fields.", "error");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showMessage(
        "Passwords do not match. Please type the same password twice.",
        "error"
      );
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      showMessage("Password must be at least 8 characters.", "error");
      return;
    }

    if (!/(?=.*\d)(?=.*[\W_])/.test(passwordForm.newPassword)) {
      showMessage(
        "Password must contain at least one number and one special character.",
        "error"
      );
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        "http://localhost:5000/api/auth/me",
        {
          password: passwordForm.newPassword,
          confirmPassword: passwordForm.confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAdminUser(response.data.data);
      setPasswordForm({
        newPassword: "",
        confirmPassword: "",
      });
      setIsChangingPassword(false);

      showMessage(
        response.data.message || "Password successfully changed.",
        "success"
      );
    } catch (error) {
      console.error("Unable to update password", error);

      const errorMessage =
        error.response?.data?.message || "Password change failed.";

      showMessage(errorMessage, "error");
    }
  };

  const handleCancelPasswordChange = () => {
    setIsChangingPassword(false);
    setPasswordForm({
      newPassword: "",
      confirmPassword: "",
    });
    setPageMessage({ text: "", type: "" });
  };

  const handleShowPasswordForm = () => {
    setIsChangingPassword(true);
    setIsEditing(false);
    setPageMessage({ text: "", type: "" });
  };

  return (
    <div className="account-page">
      <div className="account-content">
        <div className="dashboard-header">
          <h1>My Account</h1>
        </div>

        {pageMessage.text && (
          <div className={`dashboard-message ${pageMessage.type}`}>
            {pageMessage.text}
          </div>
        )}

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
                    autoFocus
                  />
                ) : (
                  <p>{adminUser.fullName}</p>
                )}
              </div>

              <div className="detail-group">
                <label>Role</label>
                <p>{adminUser.role}</p>
              </div>

              <div className="detail-group">
                <label>Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                  />
                ) : (
                  <p>{adminUser.email}</p>
                )}
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

                  {!isChangingPassword && (
                    <button
                      className="change-password-btn"
                      onClick={handleShowPasswordForm}
                    >
                      Change My Password
                    </button>
                  )}

                  <button className="logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              )}
            </div>

            {isChangingPassword && (
              <div className="password-card">
                <div className="detail-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordFormChange}
                  />
                </div>

                <div className="detail-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordFormChange}
                  />
                </div>

                <div className="dashboard-actions">
                  <button className="save-btn" onClick={handleChangePassword}>
                    Save Password
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={handleCancelPasswordChange}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="loading-profile">Loading profile...</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;