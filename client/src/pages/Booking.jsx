import { useState } from "react";
import BookingForm from "../components/BookingForm";
import { rooms } from "../data/rooms";
import "./rooms-booking.css";

function Booking() {
  const [selectedRoom, setSelectedRoom] = useState(rooms[0]);

  return (
    <>
      <section className="rb-section">
        <div className="rb-container">
          <h1 className="rb-reservation-title">Hotel Reservation Form</h1>
        </div>
        <div className="rb-container rb-details-grid">
          <div className="rb-details-copy">
            <h2>Choose your room</h2>

            <div className="rb-room-choices">
              {rooms.map((room) => (
                <div
                  className={`rb-choice-card${selectedRoom?.id === room.id ? " rb-card-selected" : ""}`}
                  key={room.id}
                  onClick={() => setSelectedRoom(room)}
                >
                  <img src={room.image} alt={room.title} />
                  <div>
                    <h3>{room.title}</h3>
                    <strong>${room.price} / night</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rb-booking-panel">
            <h3>Booking form</h3>
            <BookingForm room={selectedRoom} />
          </div>
        </div>
      </section>
    </>
  );
}

export default Booking;