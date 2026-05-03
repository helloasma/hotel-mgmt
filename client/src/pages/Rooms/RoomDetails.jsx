import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import { getImage, getRoomsPageDisplayName } from "../../utils/roomImages";
import "./RoomDetails.css";

function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchRoom = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/rooms/${id}`);
        setRoom(res.data.data);
        setCurrentImageIndex(0);
      } catch {
        setError("Room not found.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  if (loading) {
    return (
      <main className="room-detail-page">
        <div className="room-detail-container">
          <p style={{ textAlign: "center", padding: "2rem" }}>Loading...</p>
        </div>
      </main>
    );
  }

  if (error || !room) {
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

  const images = room.images?.length ? room.images.map(getImage) : [];
  const safeIndex = currentImageIndex >= images.length ? 0 : currentImageIndex;
  const currentImage = images[safeIndex];
  const hasMultipleImages = images.length > 1;

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <main className="room-detail-page">
      <div className="room-detail-container" key={id}>
        <Link to="/rooms" className="room-detail-back">
          ← Back to Rooms
        </Link>

        <section className="room-detail-layout">
          {/* LEFT SIDE - IMAGE */}
          <div className="room-detail-gallery">
            <div className="room-detail-image-wrap">
              <img
                key={safeIndex}
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
                    aria-label="Previous image"
                  >
                    ‹
                  </button>

                  <button
                    type="button"
                    className="room-detail-arrow room-detail-arrow--next"
                    onClick={goToNext}
                    aria-label="Next image"
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
                    className={`room-detail-dot ${safeIndex === index ? "active" : ""}`}
                    onClick={() => setCurrentImageIndex(index)}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT SIDE - DETAILS */}
          <div className="room-detail-content">
            <div>
              <h1 className="room-detail-title">{getRoomsPageDisplayName(room)}</h1>

              <p className="room-detail-description">{room.description}</p>

              <div className="room-detail-facts">
                <div className="room-detail-fact">
                  <strong>Guests</strong>
                  {room.capacity}
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
            </div>

            <button
              type="button"
              className="room-detail-book-btn"
              onClick={() => navigate(`/booking/${room._id}`)}
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
