import { useEffect, useState } from "react";
import axios from "axios";
import "./OperationStaffs.css";

const OperationStaffs = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const [addData, setAddData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "Housekeeper",
  });

  const [editingId, setEditingId] = useState(null);

  const [editData, setEditData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "Housekeeper",
  });

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/operation-staff",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setStaff(response.data.data);
      } catch (error) {
        console.error("Error fetching operation staff", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  const handleAddChange = (field, value) => {
    setAddData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/operation-staff",
        addData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setStaff((prev) => [response.data.data, ...prev]);

      setShowAddForm(false);

      setAddData({
        fullName: "",
        email: "",
        phone: "",
        role: "Housekeeper",
      });
    } catch (error) {
      console.error("Could not add operation staff", error);
      alert("Unable to add new staff member.");
    }
  };

  const handleEditClick = (member) => {
    setEditingId(member._id);

    setEditData({
      fullName: member.fullName || "",
      email: member.email || "",
      phone: member.phone || "",
      role: member.role || "Housekeeper",
    });
  };

  const handleEditChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveEdit = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/operation-staff/${id}`,
        editData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setStaff((prev) =>
        prev.map((member) => (member._id === id ? response.data.data : member))
      );

      setEditingId(null);

      setEditData({
        fullName: "",
        email: "",
        phone: "",
        role: "Housekeeper",
      });
    } catch (error) {
      console.error("Could not update operation staff", error);
      alert("Unable to save staff updates.");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);

    setEditData({
      fullName: "",
      email: "",
      phone: "",
      role: "Housekeeper",
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this staff member?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/operation-staff/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setStaff((prev) => prev.filter((member) => member._id !== id));
    } catch (error) {
      console.error("Could not delete staff", error);
      alert("Unable to delete staff member.");
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-content">
        <h1>Operation Staffs</h1>

        <div className="page-actions">
          <button
            type="button"
            className="add-staff-button"
            onClick={() => setShowAddForm((prev) => !prev)}
          >
            {showAddForm ? "Hide Add Form" : "Add New Staff"}
          </button>
        </div>

        {showAddForm && (
          <form className="add-staff-form" onSubmit={handleAddSubmit}>
            <div className="form-grid">
              <label className="input-group">
                <span>Full Name</span>
                <input
                  type="text"
                  value={addData.fullName}
                  onChange={(e) => handleAddChange("fullName", e.target.value)}
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
                  <option value="Housekeeper">Housekeeper</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Guest Service">Guest Service</option>
                  <option value="Groundskeeper">Groundskeeper</option>
                  <option value="Activities Coordinator">
                    Activities Coordinator
                  </option>
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
          <p>Loading operation staff...</p>
        ) : (
          <div className="operation-staff-table-container">
            <table className="operation-staff-table">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Action</th>
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
                            <option value="Housekeeper">Housekeeper</option>
                            <option value="Maintenance">Maintenance</option>
                            <option value="Guest Service">Guest Service</option>
                            <option value="Groundskeeper">Groundskeeper</option>
                            <option value="Activities Coordinator">
                              Activities Coordinator
                            </option>
                          </select>
                        ) : (
                          member.role
                        )}
                      </td>

                      <td>
                        <div className="operation-staff-actions">
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
                                DELETE
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="empty-table-message">
                      No operation staff records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OperationStaffs;