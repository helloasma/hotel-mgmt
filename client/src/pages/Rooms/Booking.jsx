import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BookingForm from "../../components/BookingForm";
import { rooms, getRoomById } from "../../data/rooms";
import "./rooms-booking.css";

function Booking() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const initialRoom = getRoomById(roomId) || rooms[0];
  const [selectedRoom, setSelectedRoom] = useState(initialRoom);

  // Random 6 rooms excluding current, computed once per room change
  const getBrowseRooms = (excludeId) => {
    const others = rooms.filter((r) => r.id !== excludeId);
    const shuffled = [...others];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, 6);
  };

  const [browseRooms, setBrowseRooms] = useState(() => getBrowseRooms(initialRoom.id));

  return (
    <section className="rb-section">
      <div className="rb-container">
        <h1 className="rb-reservation-title">Room Reservation Form</h1>

        {/* CENTERED BOOKING FORM */}
        <div className="rb-centered-form">
          <div className="rb-booking-panel">
            <h3>Booking form</h3>
            <BookingForm
              room={selectedRoom}
              onRoomChange={(newRoom) => {
                setSelectedRoom(newRoom);
                setBrowseRooms(getBrowseRooms(newRoom.id));
                navigate(`/booking/${newRoom.id}`);
              }}
            />
          </div>
        </div>

        {/* ROOM BROWSING SECTION */}
        <div className="rb-browse-section">
          <h2 className="rb-browse-title">Explore Other Rooms</h2>
          <div className="rb-browse-grid">
            {browseRooms.map((room) => (
              <div
                key={room.id}
                className="rb-browse-card"
                onClick={() => {
                  navigate(`/rooms/${room.id}`);
                }}
              >
                <div className="rb-browse-image-wrap">
                  <img src={room.image} alt={room.title} />
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