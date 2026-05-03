import { useEffect, useState } from "react";
import axios from "axios";
import UserForm from "../../components/Admin/UserForm";
import "./UserManagement.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showUserForm, setShowUserForm] = useState(false);
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

  const handleUserAdded = (newUser) => {
    setUsers([...users, newUser]);
    setShowUserForm(false);
  };

  return (
    <div className="admin-page">
      <div className="admin-content">
        <h1>Website Users</h1>

        <div className="add-user-row">
          <button
            className="add-btn"
            onClick={() => setShowUserForm(!showUserForm)}
          >
            Add New User
          </button>
        </div>

        {showUserForm && (
          <div className="user-form-wrapper">
            <UserForm
              onUserAdded={handleUserAdded}
              onClose={() => setShowUserForm(false)}
            />
          </div>
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
    </div>
  );
};

export default UserManagement;