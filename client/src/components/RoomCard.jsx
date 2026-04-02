import { Link } from "react-router-dom";

function RoomCard({ room }) {
  return (
    <Link to={`/rooms/${room.id}`} className="rb-room-card">
      <div className="rb-room-card-image-wrap">
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
          <span className="rb-view-details">View Details →</span>
        </div>
      </div>
    </Link>
  );
}

export default RoomCard;