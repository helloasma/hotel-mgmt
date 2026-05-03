import { useEffect, useState } from "react";
import axios from "axios";
import "../../Pages/Admin/VisualSummary.css";

const OverallStats = ({ rooms = [] }) => {
  const [stats, setStats] = useState({
    totalManagementStaff: 0,
    totalOperationStaff: 0,
    totalUsers: 0,
    totalBookings: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin/dashboard", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setStats(response.data.data);
      } catch (error) {
        console.error("Error fetching stats", error);
      }
    };

    fetchStats();
  }, []);

  const lavenderStaff =
    Number(stats.totalManagementStaff || 0) +
    Number(stats.totalOperationStaff || 0);

  const totalRoomUnits = rooms.reduce((sum, room) => {
    return sum + Number(room.totalRooms || 0);
  }, 0);

  return (
    <section className="overall-stats">
      <h2>Overall Statistics</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Lavender Staff</h3>
          <p className="stat-number">{lavenderStaff}</p>

          <div className="sub-stats">
            <p>Management Staff: {stats.totalManagementStaff}</p>
            <p>Operation Staff: {stats.totalOperationStaff}</p>
          </div>
        </div>

        <div className="stat-card">
          <h3>Website Users</h3>
          <p className="stat-number">{stats.totalUsers}</p>
        </div>

        <div className="stat-card">
          <h3>Bookings</h3>
          <p className="stat-number">{stats.totalBookings}</p>
        </div>

        <div className="stat-card">
          <h3>Rooms</h3>
          <p className="stat-number">{totalRoomUnits}</p>
        </div>
      </div>
    </section>
  );
};

export default OverallStats;