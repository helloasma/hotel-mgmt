import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BookingForm from "../../components/BookingForm";
import api from "../../services/api";
import { getImage } from "../../utils/roomImages";
import "./rooms-booking.css";

function Booking() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [allRooms, setAllRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [roomRes, allRoomsRes] = await Promise.all([
          api.get(`/rooms/${roomId}`),
          api.get("/rooms"),
        ]);
        setSelectedRoom(roomRes.data.data);
        setAllRooms(allRoomsRes.data.data);
      } catch {
        setError("Failed to load room data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [roomId]);

  if (loading) {
    return (
      <section className="rb-section">
        <div className="rb-container">
          <p style={{ textAlign: "center", padding: "2rem" }}>Loading...</p>
        </div>
      </section>
    );
  }

  if (error || !selectedRoom) {
    return (
      <section className="rb-section">
        <div className="rb-container">
          <p style={{ textAlign: "center", padding: "2rem", color: "red" }}>
            {error || "Room not found."}
          </p>
        </div>
      </section>
    );
  }

  const browseRooms = (() => {
    const others = allRooms.filter((r) => r._id !== selectedRoom._id);
    const shuffled = [...others];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, 6);
  })();

  return (
    <section className="rb-section">
      <div className="rb-container">
        <h1 className="rb-reservation-title">Room Reservation Form</h1>

        <div className="rb-centered-form">
          <div className="rb-booking-panel">
            <h3>Booking form</h3>
            <BookingForm
              room={selectedRoom}
              allRooms={allRooms}
              onRoomChange={(newRoom) => {
                setSelectedRoom(newRoom);
                navigate(`/booking/${newRoom._id}`);
              }}
            />
          </div>
        </div>

        <div className="rb-browse-section">
          <h2 className="rb-browse-title">Explore Other Rooms</h2>
          <div className="rb-browse-grid">
            {browseRooms.map((room) => (
              <div
                key={room._id}
                className="rb-browse-card"
                onClick={() => navigate(`/rooms/${room._id}`)}
              >
                <div className="rb-browse-image-wrap">
                  <img src={getImage(room.images[0])} alt={room.title} />
                  <div className="rb-browse-overlay">
                    <span className="rb-browse-name">{room.title}</span>
                    <span className="rb-browse-price">${room.price} / night</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Booking;
