import { useEffect, useState } from "react";
import axios from "axios";
import OverallStats from "../../components/Admin/OverallStats";
import RoomCharts from "../../components/Admin/RoomCharts";
import BookingStats from "../../components/Admin/BookingStats";
import "./VisualSummary.css";

const VisualSummary = () => {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [roomsResponse, bookingsResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/rooms", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get("http://localhost:5000/api/bookings", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const roomsData =
          roomsResponse.data.data ||
          roomsResponse.data.rooms ||
          roomsResponse.data ||
          [];

        const bookingsData =
          bookingsResponse.data.data ||
          bookingsResponse.data.bookings ||
          bookingsResponse.data ||
          [];

        setRooms(Array.isArray(roomsData) ? roomsData : []);
        setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      } catch (error) {
        console.error("Failed to load visual summary data", error);
        setErrorMessage("Unable to load visual summary data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="visual-summary-page">
      <div className="visual-summary-header">
        <div>
          <p className="page-eyebrow">Admin Dashboard</p>
          <h1>Visual Summary</h1>
          <p className="page-subtitle">
            A quick overview of staff, users, bookings, rooms, and guest activity.
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="summary-alert">
          {errorMessage}
        </div>
      )}

      {loading ? (
        <div className="summary-loading-card">
          Loading visual summary...
        </div>
      ) : (
        <div className="summary-dashboard-grid">
          <section className="summary-section summary-full-width">
            <OverallStats />
          </section>

          <section className="summary-section summary-full-width">
            <RoomCharts rooms={rooms} />
          </section>

          <section className="summary-section summary-full-width">
            <BookingStats bookings={bookings} />
          </section>
        </div>
      )}
    </main>
  );
};

export default VisualSummary;