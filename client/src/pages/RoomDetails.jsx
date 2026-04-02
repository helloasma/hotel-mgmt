import { Link, useParams } from "react-router-dom";
import BookingForm from "../components/BookingForm";
import { getRoomById } from "../data/rooms";
import "./rooms-booking.css";

function RoomDetails() {
  const { id } = useParams();
  const room = getRoomById(id);

  if (!room) {
    return (
      <section className="rb-section">
        <div className="rb-container">
          <div className="rb-empty-state">
            <h1>Room not found</h1>
            <p>The room you requested does not exist.</p>
            <Link to="/rooms" className="rb-primary-button">
              Back to Rooms
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="rb-room-hero">
        <img src={room.image} alt={room.title} className="rb-room-hero-image" />
        <div className="rb-room-hero-overlay">
          <div className="rb-container">
            <p className="rb-eyebrow">
              {room.size} · Up to {room.maxGuests} guests
            </p>
            <h1>{room.title}</h1>
            <p className="rb-hero-copy rb-max-copy">{room.shortDescription}</p>
          </div>
        </div>
      </section>

      <section className="rb-section">
        <div className="rb-container rb-details-grid">
          <div className="rb-details-copy">
            <h2>About this room</h2>
            <p>{room.description}</p>

            <div className="rb-meta-row">
              <div className="rb-meta-box">
                <span>Rate</span>
                <strong>${room.price} / night</strong>
              </div>
              <div className="rb-meta-box">
                <span>Guests</span>
                <strong>{room.maxGuests} max</strong>
              </div>
              <div className="rb-meta-box">
                <span>Size</span>
                <strong>{room.size}</strong>
              </div>
            </div>

            <h3>Amenities</h3>
            <ul className="rb-amenities-list">
              {room.amenities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="rb-booking-panel">
            <h3>Reserve this room</h3>
            <BookingForm room={room} />
          </div>
        </div>
      </section>
    </>
  );
}

export default RoomDetails;