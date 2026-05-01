import { useState, useEffect } from "react";
import axios from "axios";
import "./BookingStats.css";

const BookingStats = ({ bookings }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [stats, setStats] = useState({
    totalPrice: 0,
    totalAdults: 0,
    totalChildren: 0,
    totalGuests: 0,
  });

  useEffect(() => {
    calculateStats();
  }, [selectedMonth, bookings]);

  const calculateStats = () => {
    const confirmedBookings = bookings.filter((booking) => {
      const bookingMonth = new Date(booking.checkIn).toISOString().slice(0, 7);
      return booking.status === "confirmed" && bookingMonth === selectedMonth;
    });

    let totalPrice = 0;
    let totalAdults = 0;
    let totalChildren = 0;

    confirmedBookings.forEach((booking) => {
      totalPrice += booking.totalPrice || 0;
      totalAdults += booking.adults || 0;
      totalChildren += booking.children || 0;
    });

    setStats({
      totalPrice,
      totalAdults,
      totalChildren,
      totalGuests: totalAdults + totalChildren,
    });
  };

  const currentMonth = new Date().toISOString().slice(0, 7);

  return (
    <div className="booking-stats-container">
      <div className="price-card">
        <h3>Total Price - Confirmed Bookings</h3>
        <div className="price-value">${stats.totalPrice.toFixed(2)}</div>
        <p className="price-month">{selectedMonth}</p>
      </div>

      <div className="guests-card">
        <h3>Guest Statistics</h3>
        <div className="month-selector">
          <label>Select Month:</label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            max={currentMonth}
          />
        </div>

        <div className="stat-rows">
          <div className="stat-row">
            <span className="stat-label">Adult Guests</span>
            <span className="stat-number">{stats.totalAdults}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Child Guests</span>
            <span className="stat-number">{stats.totalChildren}</span>
          </div>
          <div className="stat-row highlight">
            <span className="stat-label">Total Guests</span>
            <span className="stat-number">{stats.totalGuests}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingStats;
