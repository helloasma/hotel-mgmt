import "./RoomCharts.css";

const calculatePercentageFull = (room) => {
  if (!room || room.totalRooms === 0) return 0;
  return ((room.totalRooms - room.availableRooms) / room.totalRooms) * 100;
};

const PieChart = ({ percentage, roomName, category }) => {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="pie-chart-container">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="45" fill="none" stroke="#e0e0e0" strokeWidth="8" />
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
        <text x="60" y="70" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#0e081f">
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
  const categoryStats = {};

  rooms.forEach((room) => {
    if (!categoryStats[room.category]) {
      categoryStats[room.category] = { total: 0, booked: 0 };
    }
    categoryStats[room.category].total += room.totalRooms || 0;
    categoryStats[room.category].booked += (room.totalRooms || 0) - (room.availableRooms || 0);
  });

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

const RoomCharts = ({ rooms }) => {
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
