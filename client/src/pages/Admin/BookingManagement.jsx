import { useEffect, useState } from "react";
import axios from "axios";
import BookingStats from "../../components/Admin/BookingStats";
import "./BookingManagement.css";

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/bookings/all",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setBookings(response.data.data);
      } catch (error) {
        console.error("Error fetching bookings", error);
      }
    };

    fetchBookings();
  }, []);

  const handleDeleteBooking = async (id) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        await axios.delete(`http://localhost:5000/api/bookings/admin/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setBookings(bookings.filter((booking) => booking._id !== id));
      } catch (error) {
        console.error("Failed to delete booking", error);
        alert("Failed to delete booking");
      }
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-content-with-sidebar">
        <div className="booking-table-wrapper">
          <h1>Bookings Management</h1>
          <table>
            <thead>
              <tr>
                <th>Guest Name</th>
                <th>Room Type</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Adult Guests</th>
                <th>Child Guests</th>
                <th>Total Guests</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking.firstName} {booking.lastName}</td>
                  <td>{booking.room.title}</td>
                  <td>{new Date(booking.checkIn).toLocaleDateString()}</td>
                  <td>{new Date(booking.checkOut).toLocaleDateString()}</td>
                  <td>{booking.adultsCount || 0}</td>
                  <td>{booking.childrenCount || 0}</td>
                  <td>{(booking.adultsCount || 0) + (booking.childrenCount || 0)}</td>
                  <td>
                    <span className={`status-badge status-${booking.status}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    {booking.status === "cancelled" && (
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteBooking(booking._id)}
                      >
                        Delete
                      </button>
                    )}
                    {booking.status !== "cancelled" && (
                      <span className="no-action">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="booking-stats-wrapper">
          <BookingStats bookings={bookings} />
        </div>
      </div>
    </div>
  );
};

export default BookingManagement;