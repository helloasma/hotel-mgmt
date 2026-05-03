import { useEffect, useState } from "react";
import axios from "axios";
import "./UserManagement.css";

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

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [addData, setAddData] = useState({ name: "", email: "", phone: "", password: "" });
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingData, setEditingData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
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

  const handleDeleteUser = (id) => {
    setPendingDeleteId(id);
  };

  const confirmDeleteUser = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${pendingDeleteId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setUsers(users.filter((user) => user._id !== pendingDeleteId));
    } catch (error) {
      console.error("Failed to delete user", error);
      alert("Failed to delete user");
    } finally {
      setPendingDeleteId(null);
    }
  };

  const handleEditUser = (user) => {
    setEditingUserId(user._id);
    setEditingData({
      name: user.name || "",
      email: user.email || "",
      password: "",
      phone: user.phone || "",
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditingData({ name: "", email: "", password: "", phone: "" });
  };

  const handleUpdateUser = async (id) => {
    try {
      const payload = {
        name: editingData.name,
        email: editingData.email,
        phone: editingData.phone,
      };

      if (editingData.password) {
        payload.password = editingData.password;
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
      setEditingData({ name: "", email: "", password: "", phone: "" });
    } catch (error) {
      console.error("Failed to update user", error);
      alert("Failed to update user");
    }
  };

  const handleAddChange = (field, value) => {
    setAddData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/users", addData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers([...users, response.data.data]);
      setShowUserForm(false);
      setAddData({ name: "", email: "", phone: "", password: "" });
    } catch (error) {
      console.error("Failed to add user", error);
      alert(error.response?.data?.message || "Failed to add user");
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-content">
        <h1>Website Users</h1>

        <div className="add-user-row">
          <button
            className="add-btn"
            onClick={() => setShowUserForm((prev) => !prev)}
          >
            <PlusIcon />
            {showUserForm ? "Close Form" : "Add New User"}
          </button>
        </div>

        {showUserForm && (
          <form className="add-staff-form" onSubmit={handleAddSubmit}>
            <div className="form-grid">
              <label className="input-group">
                <span>Full Name</span>
                <input
                  type="text"
                  value={addData.name}
                  onChange={(e) => handleAddChange("name", e.target.value)}
                  required
                />
              </label>

              <label className="input-group">
                <span>Email</span>
                <input
                  type="email"
                  value={addData.email}
                  onChange={(e) => handleAddChange("email", e.target.value)}
                  required
                />
              </label>

              <label className="input-group">
                <span>Phone Number</span>
                <input
                  type="tel"
                  value={addData.phone}
                  onChange={(e) => handleAddChange("phone", e.target.value)}
                  required
                />
              </label>

              <label className="input-group">
                <span>Password</span>
                <input
                  type="password"
                  value={addData.password}
                  onChange={(e) => handleAddChange("password", e.target.value)}
                  required
                />
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="save-btn">
                <SaveIcon />
                Add User
              </button>

              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowUserForm(false)}
              >
                <CancelIcon />
                Cancel
              </button>
            </div>
          </form>
        )}

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Password</th>
              <th>Phone</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
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
                      type="password"
                      name="password"
                      value={editingData.password}
                      onChange={handleEditChange}
                      placeholder="Enter new password"
                    />
                  ) : (
                    "********"
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
                        <button
                          className="edit-btn"
                          onClick={() => handleEditUser(user)}
                        >
                          <EditIcon />
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          <DeleteIcon />
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
      </div>

      {pendingDeleteId && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal">
            <p>Are you sure you want to delete this user?</p>
            <div className="confirm-modal-actions">
              <button className="confirm-modal-cancel" onClick={() => setPendingDeleteId(null)}>
                Cancel
              </button>
              <button className="confirm-modal-delete" onClick={confirmDeleteUser}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
