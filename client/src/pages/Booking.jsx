import BookingForm from "../components/BookingForm";
import { rooms } from "../data/rooms";
import "./rooms-booking.css";

function Booking() {
  return (
    <>
      <section className="rb-page-banner">
        <div className="rb-container">
          <p className="rb-eyebrow">Booking</p>
          <h1>Complete your stay request.</h1>
          <p className="rb-muted-copy rb-max-copy">
            This is a frontend booking page. Pick a room, choose your dates, and test the flow directly inside VS Code.
          </p>
        </div>
      </section>

      <section className="rb-section">
        <div className="rb-container rb-details-grid">
          <div className="rb-details-copy">
            <h2>Choose your room</h2>

            <div className="rb-room-choices">
              {rooms.map((room) => (
                <div className="rb-choice-card" key={room.id}>
                  <img src={room.image} alt={room.title} />
                  <div>
                    <h3>{room.title}</h3>
                    <p>{room.shortDescription}</p>
                    <strong>${room.price} / night</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rb-booking-panel">
            <h3>Booking form</h3>
            <BookingForm room={rooms[0]} />
          </div>
        </div>
      </section>
    </>
  );
}

export default Booking;