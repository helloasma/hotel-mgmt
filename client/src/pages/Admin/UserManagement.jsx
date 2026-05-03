import { useEffect, useState } from "react";
import api from "../../services/api";
import "./UserManagement.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [addData, setAddData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
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
        const response = await api.get("/users");
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
      await api.delete(`/users/${pendingDeleteId}`);
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

    setEditingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditingData({
      name: "",
      email: "",
      password: "",
      phone: "",
    });
  };

  const handleUpdateUser = async (id) => {
    if (!/^\d{10}$/.test(editingData.phone.trim())) {
      alert("Enter a 10 digit phone number.");
      return;
    }

    try {
      const payload = {
        name: editingData.name,
        email: editingData.email,
        phone: editingData.phone,
      };

      if (editingData.password) {
        payload.password = editingData.password;
      }

      const response = await api.put(`/users/${id}`, payload);

      setUsers(
        users.map((user) => (user._id === id ? response.data.data : user))
      );

      setEditingUserId(null);
      setEditingData({
        name: "",
        email: "",
        password: "",
        phone: "",
      });
    } catch (error) {
      console.error("Failed to update user", error);
      alert("Failed to update user");
    }
  };

  const handleAddChange = (field, value) => {
    setAddData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    if (!/^\d{10}$/.test(addData.phone.trim())) {
      alert("Enter a 10 digit phone number.");
      return;
    }

    try {
      const response = await api.post("/users", addData);

      setUsers([...users, response.data.data]);
      setShowUserForm(false);
      setAddData({
        name: "",
        email: "",
        phone: "",
        password: "",
      });
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
                Add User
              </button>

              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowUserForm(false)}
              >
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
      </div>

      {pendingDeleteId && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal">
            <p>Are you sure you want to delete this user?</p>

            <div className="confirm-modal-actions">
              <button
                className="confirm-modal-cancel"
                onClick={() => setPendingDeleteId(null)}
              >
                Cancel
              </button>

              <button
                className="confirm-modal-delete"
                onClick={confirmDeleteUser}
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

export default UserManagement;