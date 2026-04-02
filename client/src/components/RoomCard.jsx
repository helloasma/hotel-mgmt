import { Link } from "react-router-dom";

function RoomCard({ room }) {
  return (
    <Link
      to={`/rooms/${room.id}`}
      className="rb-room-card"
      style={{
        display: "block",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div
        className="rb-room-card-image-wrap"
        style={{ pointerEvents: "none" }}
      >
        <img
          src={room.image}
          alt={room.title}
          className="rb-room-card-image"
          loading="lazy"
        />
      </div>

      <div className="rb-room-card-body">
        <h3>{room.title}</h3>
        <p className="rb-room-card-text">{room.shortDescription}</p>

        <div className="rb-room-card-footer">
          <p className="rb-room-price">
            ${room.price}
            <span> / night</span>
          </p>

          <span className="rb-view-details">
            View Room →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default RoomCard;