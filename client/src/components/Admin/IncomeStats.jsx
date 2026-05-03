import { useMemo } from "react";
import "../../pages/Admin/VisualSummary.css";

const IncomeStats = ({ bookings = [] }) => {
  const formatMoney = (amount) => {
    return `$${Number(amount || 0).toFixed(2)}`;
  };

  const getBookingPrice = (booking) => {
    return Number(
      booking.totalPrice ||
        booking.price ||
        booking.amount ||
        booking.totalAmount ||
        0
    );
  };

  const stats = useMemo(() => {
    const confirmedBookings = bookings.filter(
      (booking) => booking.status?.toLowerCase() === "confirmed"
    );

    const confirmedTotalPrice = confirmedBookings.reduce((total, booking) => {
      return total + getBookingPrice(booking);
    }, 0);

    const allBookingsTotalPrice = bookings.reduce((total, booking) => {
      return total + getBookingPrice(booking);
    }, 0);

    const averageBookingPrice =
      bookings.length > 0 ? allBookingsTotalPrice / bookings.length : 0;

    return {
      confirmedTotalPrice,
      averageBookingPrice,
      confirmedCount: confirmedBookings.length,
      totalBookingsCount: bookings.length,
    };
  }, [bookings]);

  return (
    <section className="income-stats">
      <div className="income-stats-header">
        <p className="income-stats-eyebrow">Income Overview</p>
        <h2>Booking Income Stats</h2>
      </div>

      <div className="income-stats-grid">
        <article className="income-card income-card-total">
          <div className="income-card-icon">$</div>

          <div className="income-card-content">
            <p className="income-card-label">Confirmed Bookings Income</p>
            <h3>{formatMoney(stats.confirmedTotalPrice)}</h3>
            <p className="income-card-note">
              From {stats.confirmedCount} confirmed booking
              {stats.confirmedCount === 1 ? "" : "s"}
            </p>
          </div>
        </article>

        <article className="income-card income-card-average">
          <div className="income-card-icon">Ø</div>

          <div className="income-card-content">
            <p className="income-card-label">Average Booking Price</p>
            <h3>{formatMoney(stats.averageBookingPrice)}</h3>
            <p className="income-card-note">
              Based on {stats.totalBookingsCount} total booking
              {stats.totalBookingsCount === 1 ? "" : "s"}
            </p>
          </div>
        </article>
      </div>
    </section>
  );
};

export default IncomeStats;