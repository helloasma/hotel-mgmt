import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getRoomById } from "../data/rooms";
import "./RoomDetails.css";

function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const room = getRoomById(id);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!room) {
    return (
      <main className="room-detail-page">
        <div className="room-detail-container room-detail-not-found">
          <h2>Room not found</h2>
          <p>The room you selected does not exist.</p>
          <Link to="/rooms" className="room-detail-back">
            ← Back to Rooms
          </Link>
        </div>
      </main>
    );
  }

  const images = room.images || [room.image];

  // ✅ SAFE FIX (no useEffect needed)
  const safeIndex = Math.min(currentImageIndex, images.length - 1);
  const currentImage = images[safeIndex];

  const hasMultipleImages = images.length > 1;

  const goToPrevious = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const handleBookNow = () => {
    navigate("/booking");
  };

  return (
    <main className="room-detail-page">
      <div className="room-detail-container">
        <Link to="/rooms" className="room-detail-back">
          ← Back to Rooms
        </Link>

        <section className="room-detail-layout">
          {/* LEFT SIDE - IMAGE */}
          <div className="room-detail-gallery">
            <div className="room-detail-image-wrap">
              <img
                src={currentImage}
                alt={room.title}
                className="room-detail-image"
              />

              {hasMultipleImages && (
                <>
                  <button
                    type="button"
                    className="room-detail-arrow room-detail-arrow--prev"
                    onClick={goToPrevious}
                  >
                    ‹
                  </button>

                  <button
                    type="button"
                    className="room-detail-arrow room-detail-arrow--next"
                    onClick={goToNext}
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {hasMultipleImages && (
              <div className="room-detail-dots">
                {images.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`room-detail-dot ${
                      safeIndex === index ? "active" : ""
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT SIDE - DETAILS */}
          <div className="room-detail-content">
            <h1 className="room-detail-title">{room.title}</h1>

            <p className="room-detail-occupancy">{room.occupancy}</p>

            <p className="room-detail-description">{room.description}</p>

            <div className="room-detail-facts">
              <div className="room-detail-fact">
                <strong>Guests</strong>
                {room.guests}
              </div>

              <div className="room-detail-fact">
                <strong>Bed</strong>
                {room.bed}
              </div>

              <div className="room-detail-fact">
                <strong>Room Size</strong>
                {room.size}
              </div>

              <div className="room-detail-fact">
                <strong>View</strong>
                {room.view}
              </div>
            </div>

            <h2 className="room-detail-section-title">Room Amenities</h2>

            <ul className="room-detail-amenities">
              {room.amenities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <button
              type="button"
              className="room-detail-book-btn"
              onClick={handleBookNow}
            >
              Book Now
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

export default RoomDetails;