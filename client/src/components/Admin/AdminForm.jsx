import { useState } from "react";
import api from "../../services/api";
import "./UserForm.css";

const AdminForm = ({ onAdminAdded, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    responsibility: "New Staff",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const responsibilities = ["Manager", "Receptionist", "Housekeeper", "Maintenance", "New Staff"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!/^\d{10}$/.test(formData.phone.trim())) {
      setError("Enter a 10 digit phone number.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/auth/register", {
        ...formData,
        role: "admin",
      });

      onAdminAdded(response.data.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-modal-overlay" onClick={onClose}>
      <div className="form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h2>Add New Admin</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter full name"
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter email"
            />
          </div>

          <div className="form-group">
            <label>Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Enter phone number"
            />
          </div>

          <div className="form-group">
            <label>Responsibility *</label>
            <select
              name="responsibility"
              value={formData.responsibility}
              onChange={handleChange}
              required
            >
              {responsibilities.map((resp) => (
                <option key={resp} value={resp}>
                  {resp}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter password"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Adding..." : "Add Admin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminForm;
