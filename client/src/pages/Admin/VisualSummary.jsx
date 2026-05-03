import { useEffect, useState } from "react";
import axios from "axios";
import OverallStats from "../../components/Admin/OverallStats";
import RoomCharts from "../../components/Admin/RoomCharts";
import IncomeStats from "../../components/Admin/IncomeStats";
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

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [roomsResult, bookingsResult] = await Promise.allSettled([
          axios.get("http://localhost:5000/api/rooms/admin/all", { headers }),
          axios.get("http://localhost:5000/api/bookings/all", { headers }),
        ]);

        const messages = [];

        if (roomsResult.status === "fulfilled") {
          const roomsData =
            roomsResult.value.data.data ||
            roomsResult.value.data.rooms ||
            roomsResult.value.data ||
            [];

          setRooms(Array.isArray(roomsData) ? roomsData : []);
        } else {
          console.error("Failed to load rooms", roomsResult.reason);
          setRooms([]);
          messages.push("Unable to load rooms data.");
        }

        if (bookingsResult.status === "fulfilled") {
          const bookingsData =
            bookingsResult.value.data.data ||
            bookingsResult.value.data.bookings ||
            bookingsResult.value.data ||
            [];

          setBookings(Array.isArray(bookingsData) ? bookingsData : []);
        } else {
          console.error("Failed to load bookings", bookingsResult.reason);
          setBookings([]);
          messages.push(
            "Unable to load bookings data. Check booking admin access."
          );
        }

        setErrorMessage(messages.join(" "));
      } catch (error) {
        console.error("Failed to load visual summary data", error);
        setErrorMessage("Unable to load visual summary data.");
        setRooms([]);
        setBookings([]);
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
            A quick overview of staff, users, rooms, and booking activity.
          </p>
        </div>
      </div>

      {errorMessage && <div className="summary-alert">{errorMessage}</div>}

      {loading ? (
        <div className="summary-loading-card">Loading visual summary...</div>
      ) : (
        <div className="summary-dashboard-grid">
          <section className="summary-section summary-full-width">
            <OverallStats rooms={rooms} />
          </section>

          <section className="summary-section summary-full-width">
            <RoomCharts bookings={bookings} />
          </section>

          <section className="summary-section summary-full-width">
            <IncomeStats bookings={bookings} />
          </section>
        </div>
      )}
    </main>
  );
};

export default VisualSummary;