// src/components/BookingsList.jsx
import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const BookingsList = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Fetch bookings from API
    const fetchBookings = async () => {
      try {
        const response = await api.get("/bookings/all");
        setBookings(response.data.data);  // assuming response structure has 'data'
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []); // Empty array ensures it runs once after the first render

  return (
    <div>
      <h2>All Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Guest Name</th>
              <th>Room Type</th>
              <th>Status</th>
              <th>Check-In</th>
              <th>Check-Out</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td>{booking.firstName} {booking.lastName}</td>
                <td>{booking.room.title}</td>
                <td>{booking.status}</td>
                <td>{new Date(booking.checkIn).toLocaleDateString()}</td>
                <td>{new Date(booking.checkOut).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BookingsList;