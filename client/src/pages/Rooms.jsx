import RoomCard from "../components/RoomCard";
import { rooms } from "../data/rooms";
import "./rooms-booking.css";

function Rooms() {
  return (
    <>
      <section className="rb-page-banner">
        <div className="rb-container">
          <p className="rb-eyebrow">Rooms & Suites</p>
          <h1>Choose the stay that matches your mood.</h1>
          <p className="rb-muted-copy rb-max-copy">
            From panoramic penthouses to romantic sunset suites, every room card below links to a detailed page with amenities, pricing, and a booking section.
          </p>
        </div>
      </section>

      <section className="rb-section">
        <div className="rb-container rb-room-grid">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </section>
    </>
  );
}

export default Rooms;