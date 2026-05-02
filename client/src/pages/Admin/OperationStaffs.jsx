import { useEffect, useState } from "react";
import axios from "axios";
import "./OperationStaffs.css";

const OperationStaffs = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/operation-staffs", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setStaff(response.data.data);
      } catch (error) {
        console.error("Error fetching operation staff", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this operation staff member?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/operation-staffs/${id}`, {
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
        <p className="section-description">Manage the operations staff team that keeps day-to-day hotel operations running.</p>

        {loading ? (
          <p>Loading operation staff...</p>
        ) : (
          <div className="staff-table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Position</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {staff.length > 0 ? (
                  staff.map((member) => (
                    <tr key={member._id}>
                      <td>{member.name}</td>
                      <td>{member.email}</td>
                      <td>{member.phone}</td>
                      <td>{member.position || "Operations"}</td>
                      <td>{member.status || "Active"}</td>
                      <td>
                        <button className="delete-btn" onClick={() => handleDelete(member._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No operation staff records found.</td>
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
