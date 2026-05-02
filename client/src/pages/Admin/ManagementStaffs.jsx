import { useEffect, useState } from "react";
import axios from "axios";
import "./ManagementStaffs.css";

const ManagementStaffs = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const userRole = localStorage.getItem("role");

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/management-staffs", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setStaff(response.data.data);
      } catch (error) {
        console.error("Error fetching management staff", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  const handleDelete = async (id) => {
    if (userRole !== "Chief Manager") {
      alert("Only the Chief Manager can remove management staff.");
      return;
    }

    if (!window.confirm("Delete this management staff member?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/management-staffs/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setStaff((prev) => prev.filter((member) => member._id !== id));
    } catch (error) {
      console.error("Could not delete management staff", error);
      alert("Unable to delete this management staff member.");
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-content">
        <h1>Management Staffs</h1>
        <p className="section-description">View and manage the hotel managers and support staff who run the portal.</p>

        {loading ? (
          <p>Loading management staff...</p>
        ) : (
          <div className="staff-table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {staff.length > 0 ? (
                  staff.map((member) => (
                    <tr key={member._id}>
                      <td>{member.fullName}</td>
                      <td>{member.email}</td>
                      <td>{member.phone}</td>
                      <td>{member.role}</td>
                      <td>{new Date(member.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(member._id)}
                        >
                          Delete
                        </button>
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
        )}
      </div>
    </div>
  );
};

export default ManagementStaffs;
