import { useEffect, useState } from "react";
import axios from "axios";
import "./OverallStats.css";

const OverallStats = () => {
  const [stats, setStats] = useState({
    totalManagementStaff: 0,
    totalOperationStaff: 0,
    totalUsers: 0,
    totalBookings: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/admin/dashboard",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setStats(response.data.data || {});
      } catch (error) {
        console.error("Error fetching stats", error);
      }
    };

    fetchStats();
  }, []);

  const lavenderStaff =
    Number(stats.totalManagementStaff || 0) +
    Number(stats.totalOperationStaff || 0);

  return (
    <section className="overall-stats">
      <div className="overall-stats-header">
        <div>
          <h2>Overall Statistics</h2>
        </div>

        <p className="overall-subtitle">
          Quick insights into staff, website activity, and bookings.
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card staff-card">
          <div className="stat-glow"></div>

          <div className="stat-icon">LS</div>

          <h3>Lavender Staff</h3>
          <p className="stat-number">{lavenderStaff}</p>

          <div className="sub-stats">
            <p>Management Staff: {stats.totalManagementStaff || 0}</p>
            <p>Operation Staff: {stats.totalOperationStaff || 0}</p>
          </div>
        </div>

        <div className="stat-card users-card">
          <div className="stat-glow"></div>

          <div className="stat-icon">WU</div>

          <h3>Website Users</h3>
          <p className="stat-number">{stats.totalUsers || 0}</p>

          <div className="sub-stats">
            <p>Total registered users</p>
          </div>
        </div>

        <div className="stat-card bookings-card">
          <div className="stat-glow"></div>

          <div className="stat-icon">BK</div>

          <h3>Bookings</h3>
          <p className="stat-number">{stats.totalBookings || 0}</p>

          <div className="sub-stats">
            <p>Total booking records</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OverallStats;