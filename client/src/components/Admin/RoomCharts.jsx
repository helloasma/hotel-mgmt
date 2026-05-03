import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "../../pages/Admin/VisualSummary.css";

const calculatePercentageFull = (room) => {
  const totalRooms = room.totalRooms || 0;
  const availableRooms = room.availableRooms || 0;

  if (!room || totalRooms === 0) return 0;

  return ((totalRooms - availableRooms) / totalRooms) * 100;
};

const PieChart = ({ percentage, roomName, category }) => {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="pie-chart-container">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke="#e0e0e0"
          strokeWidth="8"
        />

        <circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke="#2f5148"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 60 60)"
        />

        <text
          x="60"
          y="70"
          textAnchor="middle"
          fontSize="24"
          fontWeight="bold"
          fill="#0e081f"
        >
          {Math.round(percentage)}%
        </text>
      </svg>

      <div className="chart-label">
        <p className="room-name">{roomName}</p>
        <p className="category">{category}</p>
      </div>
    </div>
  );
};

const BarChart = ({ rooms }) => {
  const categoryStats = useMemo(() => {
    const stats = {};

    rooms.forEach((room) => {
      const category = room.category || "Uncategorized";
      const totalRooms = room.totalRooms || 0;
      const availableRooms = room.availableRooms || 0;
      const bookedRooms = totalRooms - availableRooms;

      if (!stats[category]) {
        stats[category] = {
          total: 0,
          booked: 0,
        };
      }

      stats[category].total += totalRooms;
      stats[category].booked += bookedRooms;
    });

    return stats;
  }, [rooms]);

  const maxBookings = Math.max(
    0,
    ...Object.values(categoryStats).map((stat) => stat.booked)
  );

  return (
    <div className="bar-chart">
      <h3>Room Popularity by Category</h3>

      <div className="bars">
        {Object.entries(categoryStats).map(([category, stat]) => {
          const height = (stat.booked / (maxBookings || 1)) * 200;

          return (
            <div key={category} className="bar-item">
              <div className="bar-wrapper">
                <div
                  className="bar"
                  style={{
                    height: `${height}px`,
                  }}
                />

                <span className="bar-value">{stat.booked}</span>
              </div>

              <span className="bar-label">{category}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const RoomCharts = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/rooms", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setRooms(response.data.data || []);
      } catch (error) {
        console.error("Error fetching room chart data", error);
        setError("Failed to load room chart data.");
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, []);

  if (loading) {
    return (
      <div className="room-charts-container">
        <p>Loading room charts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="room-charts-container">
        <p className="chart-error">{error}</p>
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="room-charts-container">
        <p>No room data available for charts.</p>
      </div>
    );
  }

  return (
    <div className="room-charts-container">
      <BarChart rooms={rooms} />

      <div className="pie-charts-section">
        <h3>Room Occupancy by Type</h3>

        <div className="pie-charts-grid">
          {rooms.map((room) => (
            <PieChart
              key={room._id}
              percentage={calculatePercentageFull(room)}
              roomName={room.title}
              category={room.category}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomCharts;