import { useMemo } from "react";
import "./RoomCharts.css";

const groupBookingsByRoomField = (bookings, fieldName) => {
  const grouped = {};

  bookings.forEach((booking) => {
    const label = booking?.room?.[fieldName] || "Unknown";

    if (!grouped[label]) {
      grouped[label] = {
        label,
        count: 0,
      };
    }

    grouped[label].count += 1;
  });

  return Object.values(grouped).sort((a, b) => b.count - a.count);
};

const CategoryPopularityChart = ({ data }) => {
  const totalBookings = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <section className="rch-card">
      <div className="rch-card-header">
        <p>Based on booking records</p>
        <h3>Popular Rooms by Category</h3>
      </div>

      {data.length === 0 ? (
        <div className="rch-empty-mini">No booking category data available.</div>
      ) : (
        <div className="rch-bars-list">
          {data.map((item) => {
            const percentage =
              totalBookings > 0
                ? Math.round((item.count / totalBookings) * 100)
                : 0;

            return (
              <div className="rch-bar-item" key={item.label}>
                <div className="rch-bar-top">
                  <span>{item.label}</span>
                  <strong>{item.count} bookings</strong>
                </div>

                <div className="rch-bar-track">
                  <div
                    className="rch-bar-fill"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <div className="rch-bar-bottom">
                  <small>{percentage}% of bookings</small>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

const TypePopularityChart = ({ data }) => {
  const totalBookings = data.reduce((sum, item) => sum + item.count, 0);
  const maxCount = Math.max(1, ...data.map((item) => item.count));

  return (
    <section className="rch-card">
      <div className="rch-card-header">
        <p>Based on booking records</p>
        <h3>Popular Rooms by Type</h3>
      </div>

      {data.length === 0 ? (
        <div className="rch-empty-mini">No booking type data available.</div>
      ) : (
        <div className="rch-vertical-chart">
          {data.map((item) => {
            const barHeight = Math.max((item.count / maxCount) * 220, 18);
            const percentage =
              totalBookings > 0
                ? Math.round((item.count / totalBookings) * 100)
                : 0;

            return (
              <div className="rch-vertical-bar-item" key={item.label}>
                <div className="rch-vertical-value">
                  <strong>{item.count}</strong>
                  <span>{percentage}%</span>
                </div>

                <div className="rch-vertical-bar-track">
                  <div
                    className="rch-vertical-bar-fill"
                    style={{ height: `${barHeight}px` }}
                  />
                </div>

                <div className="rch-vertical-label">
                  <strong>{item.label}</strong>
                  <span>{item.count} bookings</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

const CancellationRateCard = ({ bookings }) => {
  const totalBookings = bookings.length;

  const cancelledBookings = bookings.filter(
    (booking) => booking.status === "cancelled"
  ).length;

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "confirmed"
  ).length;

  const cancellationRate =
    totalBookings > 0
      ? Math.round((cancelledBookings / totalBookings) * 100)
      : 0;

  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (cancellationRate / 100) * circumference;

  return (
    <section className="rch-card rch-square-card">
      <div className="rch-card-header">
        <p>Booking status</p>
        <h3>Cancellation Rate</h3>
      </div>

      {totalBookings === 0 ? (
        <div className="rch-empty-mini">No booking data available.</div>
      ) : (
        <div className="rch-metric-layout">
          <div className="rch-ring">
            <svg viewBox="0 0 120 120">
              <circle className="rch-ring-bg" cx="60" cy="60" r={radius} />

              <circle
                className="rch-ring-progress"
                cx="60"
                cy="60"
                r={radius}
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
              />

              <text
                x="60"
                y="56"
                textAnchor="middle"
                className="rch-ring-number"
              >
                {cancellationRate}%
              </text>

              <text
                x="60"
                y="74"
                textAnchor="middle"
                className="rch-ring-text"
              >
                cancelled
              </text>
            </svg>
          </div>

          <div className="rch-metric-stats">
            <div className="rch-metric-chip">
              <span>Total</span>
              <strong>{totalBookings}</strong>
            </div>

            <div className="rch-metric-chip">
              <span>Cancelled</span>
              <strong>{cancelledBookings}</strong>
            </div>

            <div className="rch-metric-chip">
              <span>Confirmed</span>
              <strong>{confirmedBookings}</strong>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const GuestCompositionCard = ({ bookings }) => {
  const adultsTotal = bookings.reduce(
    (sum, booking) => sum + (Number(booking.adults) || 0),
    0
  );

  const childrenTotal = bookings.reduce(
    (sum, booking) => sum + (Number(booking.children) || 0),
    0
  );

  const totalGuests = adultsTotal + childrenTotal;

  const adultsPercentage =
    totalGuests > 0 ? Math.round((adultsTotal / totalGuests) * 100) : 0;

  const childrenPercentage = totalGuests > 0 ? 100 - adultsPercentage : 0;

  const pieStyle = {
    background:
      totalGuests > 0
        ? `conic-gradient(#2f5148 0% ${adultsPercentage}%, #7b61ff ${adultsPercentage}% 100%)`
        : "#e8e3f0",
  };

  return (
    <section className="rch-card rch-square-card">
      <div className="rch-card-header">
        <p>Guest composition</p>
        <h3>Adults vs Children</h3>
      </div>

      {totalGuests === 0 ? (
        <div className="rch-empty-mini">No guest data available.</div>
      ) : (
        <div className="rch-guest-layout">
          <div className="rch-pie-wrap">
            <div className="rch-pie-chart" style={pieStyle}>
              <div className="rch-pie-center">
                <strong>{totalGuests}</strong>
                <span>guests</span>
              </div>
            </div>
          </div>

          <div className="rch-legend">
            <div className="rch-legend-item">
              <span className="rch-legend-dot rch-adults-dot" />

              <div>
                <strong>Adults</strong>
                <small>
                  {adultsTotal} guests • {adultsPercentage}%
                </small>
              </div>
            </div>

            <div className="rch-legend-item">
              <span className="rch-legend-dot rch-children-dot" />

              <div>
                <strong>Children</strong>
                <small>
                  {childrenTotal} guests • {childrenPercentage}%
                </small>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const RoomCharts = ({ bookings = [] }) => {
  const categoryData = useMemo(
    () => groupBookingsByRoomField(bookings, "category"),
    [bookings]
  );

  const typeData = useMemo(
    () => groupBookingsByRoomField(bookings, "type"),
    [bookings]
  );

  return (
    <div className="rch-wrapper">
      <div className="rch-grid">
        <CategoryPopularityChart data={categoryData} />

        <TypePopularityChart data={typeData} />

        <CancellationRateCard bookings={bookings} />

        <GuestCompositionCard bookings={bookings} />
      </div>
    </div>
  );
};

export default RoomCharts;