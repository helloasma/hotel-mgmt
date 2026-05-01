import { useEffect, useState } from "react";
import axios from "axios";
import UserForm from "../../components/Admin/UserForm";
import AdminForm from "../../components/Admin/AdminForm";
import "./UserManagement.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [showUserForm, setShowUserForm] = useState(false);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingData, setEditingData] = useState({
    name: "",
    email: "",
    phone: "",
    responsibility: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUsers(response.data.data);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUsers(users.filter((user) => user._id !== id));
      } catch (error) {
        console.error("Failed to delete user", error);
        alert("Failed to delete user");
      }
    }
  };

  const handleEditUser = (user) => {
    setEditingUserId(user._id);
    setEditingData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      responsibility: user.responsibility || "New Staff",
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
  };

  const handleUpdateUser = async (id) => {
    try {
      const userToUpdate = users.find((user) => user._id === id);
      const payload = {
        name: editingData.name,
        email: editingData.email,
        phone: editingData.phone,
      };

      if (userToUpdate?.role === "admin") {
        payload.responsibility = editingData.responsibility;
      }

      const response = await axios.put(
        `http://localhost:5000/api/users/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setUsers(users.map((user) => (user._id === id ? response.data.data : user)));
      setEditingUserId(null);
    } catch (error) {
      console.error("Failed to update user", error);
      alert("Failed to update user");
    }
  };

  const handleUserAdded = (newUser) => {
    setUsers([...users, newUser]);
  };

  const regularUsers = users.filter((user) => user.role === "user");
  const staffUsers = users.filter((user) => user.role === "admin");

  return (
    <div className="admin-page">
      <div className="admin-content">
        <h1>Users Management</h1>

        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            Regular Users
          </button>
          <button
            className={`tab-btn ${activeTab === "staff" ? "active" : ""}`}
            onClick={() => setActiveTab("staff")}
          >
            Staff
          </button>
        </div>

        {/* Regular Users Tab */}
        {activeTab === "users" && (
          <div className="tab-content">
            <table>
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {regularUsers.map((user) => (
                  <tr key={user._id}>
                    <td>
                      {editingUserId === user._id ? (
                        <input
                          type="text"
                          name="name"
                          value={editingData.name}
                          onChange={handleEditChange}
                        />
                      ) : (
                        user.name
                      )}
                    </td>
                    <td>
                      {editingUserId === user._id ? (
                        <input
                          type="email"
                          name="email"
                          value={editingData.email}
                          onChange={handleEditChange}
                        />
                      ) : (
                        user.email
                      )}
                    </td>
                    <td>
                      {editingUserId === user._id ? (
                        <input
                          type="tel"
                          name="phone"
                          value={editingData.phone}
                          onChange={handleEditChange}
                        />
                      ) : (
                        user.phone
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        {editingUserId === user._id ? (
                          <>
                            <button
                              className="save-btn"
                              onClick={() => handleUpdateUser(user._id)}
                            >
                              Save
                            </button>
                            <button className="cancel-btn" onClick={handleCancelEdit}>
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="edit-btn"
                              onClick={() => handleEditUser(user)}
                            >
                              Edit
                            </button>
                            <button
                              className="delete-btn"
                              onClick={() => handleDeleteUser(user._id)}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              className="add-btn"
              onClick={() => setShowUserForm(true)}
            >
              + Add New User
            </button>
          </div>
        )}

        {/* Staff Tab */}
        {activeTab === "staff" && (
          <div className="tab-content">
            <table>
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Responsibility</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {staffUsers.map((user) => (
                  <tr key={user._id}>
                    <td>
                      {editingUserId === user._id ? (
                        <input
                          type="text"
                          name="name"
                          value={editingData.name}
                          onChange={handleEditChange}
                        />
                      ) : (
                        user.name
                      )}
                    </td>
                    <td>
                      {editingUserId === user._id ? (
                        <input
                          type="email"
                          name="email"
                          value={editingData.email}
                          onChange={handleEditChange}
                        />
                      ) : (
                        user.email
                      )}
                    </td>
                    <td>
                      {editingUserId === user._id ? (
                        <select
                          name="responsibility"
                          value={editingData.responsibility}
                          onChange={handleEditChange}
                        >
                          <option value="Manager">Manager</option>
                          <option value="Receptionist">Receptionist</option>
                          <option value="Housekeeper">Housekeeper</option>
                          <option value="Maintenance">Maintenance</option>
                          <option value="New Staff">New Staff</option>
                        </select>
                      ) : (
                        user.responsibility
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        {editingUserId === user._id ? (
                          <>
                            <button
                              className="save-btn"
                              onClick={() => handleUpdateUser(user._id)}
                            >
                              Save
                            </button>
                            <button className="cancel-btn" onClick={handleCancelEdit}>
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="edit-btn"
                              onClick={() => handleEditUser(user)}
                            >
                              Edit
                            </button>
                            <button
                              className="delete-btn"
                              onClick={() => handleDeleteUser(user._id)}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              className="add-btn"
              onClick={() => setShowAdminForm(true)}
            >
              + Add New Admin
            </button>
          </div>
        )}

        {showUserForm && (
          <UserForm
            onUserAdded={handleUserAdded}
            onClose={() => setShowUserForm(false)}
          />
        )}

        {showAdminForm && (
          <AdminForm
            onAdminAdded={handleUserAdded}
            onClose={() => setShowAdminForm(false)}
          />
        )}
      </div>
    </div>
  );
};

export default UserManagement;