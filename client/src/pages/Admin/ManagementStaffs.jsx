import { useEffect, useState } from "react";
import api from "../../services/api";
import "./ManagementStaffs.css";

const ManagementStaffs = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const [addData, setAddData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    role: "Manager",
  });

  const [editingId, setEditingId] = useState(null);

  const [editData, setEditData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    role: "Manager",
  });

  const userRole = localStorage.getItem("role");

  useEffect(() => {
    if (userRole !== "Chief Manager") {
      setLoading(false);
      return;
    }

    const fetchStaff = async () => {
      try {
        const response = await api.get("/management-staff");
        setStaff(response.data.data);
      } catch (error) {
        console.error("Error fetching management staff", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [userRole]);

  const handleAddChange = (field, value) => {
    setAddData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddSubmit = async (event) => {
    event.preventDefault();

    if (!/^\d{10}$/.test(addData.phone.trim())) {
      alert("Enter a 10 digit phone number.");
      return;
    }

    try {
      const response = await api.post("/management-staff", addData);

      setStaff((prev) => [response.data.data, ...prev]);
      setShowAddForm(false);

      setAddData({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        role: "Manager",
      });
    } catch (error) {
      console.error("Could not add management staff", error);
      alert("Unable to add new management staff member.");
    }
  };

  const handleEditClick = (member) => {
    setEditingId(member._id);

    setEditData({
      fullName: member.fullName || "",
      email: member.email || "",
      password: "",
      phone: member.phone || "",
      role: member.role || "Manager",
    });
  };

  const handleEditChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveEdit = async (id) => {
    if (!/^\d{10}$/.test(editData.phone.trim())) {
      alert("Enter a 10 digit phone number.");
      return;
    }

    try {
      const response = await api.put(`/management-staff/${id}`, editData);

      setStaff((prev) =>
        prev.map((member) =>
          member._id === id ? response.data.data : member
        )
      );

      setEditingId(null);

      setEditData({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        role: "Manager",
      });
    } catch (error) {
      console.error("Could not update management staff", error);
      alert("Unable to save management staff updates.");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);

    setEditData({
      fullName: "",
      email: "",
      password: "",
      phone: "",
      role: "Manager",
    });
  };

  const handleDelete = (id) => {
    setPendingDeleteId(id);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/management-staff/${pendingDeleteId}`);

      setStaff((prev) =>
        prev.filter((member) => member._id !== pendingDeleteId)
      );
    } catch (error) {
      console.error("Could not delete management staff", error);
      alert("Unable to delete this management staff member.");
    } finally {
      setPendingDeleteId(null);
    }
  };

  if (userRole !== "Chief Manager") {
    return (
      <div className="admin-page">
        <div className="admin-content">
          <h1>Management Staffs</h1>

          <p className="unauthorized">
            Only the Chief Manager can access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-content">
        <h1>Management Staffs</h1>

        <div className="page-actions">
          <button
            type="button"
            className="add-staff-button"
            onClick={() => setShowAddForm((prev) => !prev)}
          >
            {showAddForm ? "Close Form" : "Add New Staff"}
          </button>
        </div>

        {showAddForm && (
          <form className="staff-form" onSubmit={handleAddSubmit}>
            <div className="form-grid">
              <label className="input-group">
                <span>Full Name</span>
                <input
                  type="text"
                  value={addData.fullName}
                  onChange={(e) =>
                    handleAddChange("fullName", e.target.value)
                  }
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
                <span>Password</span>
                <input
                  type="password"
                  value={addData.password}
                  onChange={(e) =>
                    handleAddChange("password", e.target.value)
                  }
                  required
                />
              </label>

              <label className="input-group">
                <span>Phone</span>
                <input
                  type="tel"
                  value={addData.phone}
                  onChange={(e) => handleAddChange("phone", e.target.value)}
                  required
                />
              </label>

              <label className="input-group">
                <span>Role</span>
                <select
                  value={addData.role}
                  onChange={(e) => handleAddChange("role", e.target.value)}
                  required
                >
                  <option value="Chief Manager">Chief Manager</option>
                  <option value="Manager">Manager</option>
                  <option value="User support">User support</option>
                  <option value="Receptionist">Receptionist</option>
                </select>
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="save-btn">
                Add Staff
              </button>

              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <p>Loading management staff...</p>
        ) : (
          <div className="staff-table-wrapper">
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Password</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th className="action-column">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {staff.length > 0 ? (
                    staff.map((member) => (
                      <tr key={member._id}>
                        <td>
                          {editingId === member._id ? (
                            <input
                              type="text"
                              value={editData.fullName}
                              onChange={(e) =>
                                handleEditChange("fullName", e.target.value)
                              }
                              required
                            />
                          ) : (
                            member.fullName
                          )}
                        </td>

                        <td>
                          {editingId === member._id ? (
                            <input
                              type="email"
                              value={editData.email}
                              onChange={(e) =>
                                handleEditChange("email", e.target.value)
                              }
                              required
                            />
                          ) : (
                            member.email
                          )}
                        </td>

                        <td>
                          {editingId === member._id ? (
                            <input
                              type="password"
                              value={editData.password}
                              onChange={(e) =>
                                handleEditChange("password", e.target.value)
                              }
                              placeholder="Enter new password"
                            />
                          ) : (
                            "********"
                          )}
                        </td>

                        <td>
                          {editingId === member._id ? (
                            <input
                              type="tel"
                              value={editData.phone}
                              onChange={(e) =>
                                handleEditChange("phone", e.target.value)
                              }
                              required
                            />
                          ) : (
                            member.phone
                          )}
                        </td>

                        <td>
                          {editingId === member._id ? (
                            <select
                              value={editData.role}
                              onChange={(e) =>
                                handleEditChange("role", e.target.value)
                              }
                              required
                            >
                              <option value="Chief Manager">
                                Chief Manager
                              </option>
                              <option value="Manager">Manager</option>
                              <option value="User support">User support</option>
                              <option value="Receptionist">Receptionist</option>
                            </select>
                          ) : (
                            member.role
                          )}
                        </td>

                        <td className="action-column">
                          <div className="action-buttons">
                            {editingId === member._id ? (
                              <>
                                <button
                                  type="button"
                                  className="save-btn"
                                  onClick={() => handleSaveEdit(member._id)}
                                >
                                  Save
                                </button>

                                <button
                                  type="button"
                                  className="cancel-btn"
                                  onClick={handleCancelEdit}
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  className="edit-btn"
                                  onClick={() => handleEditClick(member)}
                                >
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  className="delete-btn"
                                  onClick={() => handleDelete(member._id)}
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6">No management staff records found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {pendingDeleteId && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal">
            <p>Are you sure you want to delete this staff member?</p>

            <div className="confirm-modal-actions">
              <button
                className="confirm-modal-cancel"
                onClick={() => setPendingDeleteId(null)}
              >
                Cancel
              </button>

              <button
                className="confirm-modal-delete"
                onClick={confirmDelete}
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

export default ManagementStaffs;