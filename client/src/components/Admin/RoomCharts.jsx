import "../../Pages/Admin/VisualSummary.css";

const RoomCharts = ({ rooms = [] }) => {
  const totalRooms = rooms.reduce((sum, room) => sum + Number(room.totalRooms || 0), 0);
  const totalAvailable = rooms.reduce((sum, room) => sum + Number(room.availableRooms || 0), 0);
  const totalBooked = Math.max(totalRooms - totalAvailable, 0);

  const availabilityPercentage =
    totalRooms > 0 ? Math.round((totalAvailable / totalRooms) * 100) : 0;

  const categoryCounts = rooms.reduce((acc, room) => {
    const category = room.category || "Uncategorized";
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const maxCategoryCount = Math.max(...Object.values(categoryCounts), 1);

  const maxPrice = Math.max(...rooms.map((room) => Number(room.price || 0)), 1);

  return (
    <section className="room-charts-container">
      <div className="section-header">
        <h2>Room Charts</h2>
        <p>Visual overview of room availability, categories, and prices.</p>
      </div>

      {rooms.length === 0 ? (
        <div className="empty-card">
          <p>No room data available.</p>
        </div>
      ) : (
        <div className="charts-grid">
          <div className="chart-card">
            <h3>Room Availability</h3>

            <div className="availability-summary">
              <div>
                <span className="summary-label">Available</span>
                <strong>{totalAvailable}</strong>
              </div>

              <div>
                <span className="summary-label">Booked</span>
                <strong>{totalBooked}</strong>
              </div>

              <div>
                <span className="summary-label">Total</span>
                <strong>{totalRooms}</strong>
              </div>
            </div>

            <div className="progress-chart">
              <div
                className="progress-fill"
                style={{ width: `${availabilityPercentage}%` }}
              ></div>
            </div>

            <p className="chart-note">{availabilityPercentage}% rooms available</p>
          </div>

          <div className="chart-card">
            <h3>Rooms by Category</h3>

            <div className="bar-chart">
              {Object.entries(categoryCounts).map(([category, count]) => {
                const width = Math.round((count / maxCategoryCount) * 100);

                return (
                  <div className="bar-row" key={category}>
                    <div className="bar-info">
                      <span>{category}</span>
                      <strong>{count}</strong>
                    </div>

                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${width}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="chart-card wide-chart-card">
            <h3>Room Prices</h3>

            <div className="price-chart">
              {rooms.map((room) => {
                const price = Number(room.price || 0);
                const width = Math.round((price / maxPrice) * 100);

                return (
                  <div className="bar-row" key={room._id}>
                    <div className="bar-info">
                      <span>{room.title || "Unnamed Room"}</span>
                      <strong>${price}</strong>
                    </div>

                    <div className="bar-track">
                      <div className="bar-fill price-fill" style={{ width: `${width}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default RoomCharts;