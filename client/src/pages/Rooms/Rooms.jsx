import "./Rooms.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../services/api";
import { getImage, getRoomsPageDisplayName } from "../../utils/roomImages";

import heroVideo from "../../assets/Rooms/RoomVideo.mp4";

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await api.get("/rooms");
        setRooms(response.data.data);
      } catch {
        setError("Failed to load rooms. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return (
    <main className="rooms-page">
      <section className="rooms-hero">
        <video
          className="rooms-hero__video"
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="rooms-hero__overlay" />

        <div className="rooms-hero__content">
          <div className="rooms-hero__inner">
            <h1 className="rooms-hero__title">Rooms & Suites</h1>
            <p className="rooms-hero__subtitle">
              Discover a more elevated stay through rooms designed with light,
              comfort, and quiet luxury in mind.
            </p>
          </div>
        </div>
      </section>

      <section className="rooms-intro">
        <h2 className="rooms-intro__heading">A Refined Collection of Stays</h2>
        <p className="rooms-intro__text">
          Where Every Room Tells a Story
          <br />
          Each space at Lovender is designed with intention — blending natural
          textures, curated detail, and unhurried calm. From overwater retreats
          to mountain sanctuaries, find the setting that speaks to you.
        </p>
      </section>

      <section className="rooms-listing" id="rooms-list">
        {loading && (
          <p style={{ textAlign: "center", padding: "2rem" }}>
            Loading rooms...
          </p>
        )}

        {error && (
          <p style={{ textAlign: "center", padding: "2rem", color: "red" }}>
            {error}
          </p>
        )}

        {!loading && !error && (
          <div className="rooms-grid">
            {rooms.map((room) => (
              <article className="room-card-luxury" key={room._id}>
                <div className="room-card-luxury__image-wrap">
                  <img
                    src={getImage(room.images[0])}
                    alt={room.title}
                    className="room-card-luxury__image"
                  />
                </div>

                <div className="room-card-luxury__content">
                  <h3 className="room-card-luxury__title">{getRoomsPageDisplayName(room)}</h3>

                  <p className="room-card-luxury__description">
                    {room.description}
                  </p>

                  <div className="room-card-luxury__meta">
                    <span className="room-card-luxury__meta-item">
                      {room.size}
                    </span>
                    <span className="room-card-luxury__meta-item">
                      {room.bed}
                    </span>
                    <span className="room-card-luxury__meta-item">
                      {room.view}
                    </span>
                  </div>

                  <div className="room-card-luxury__actions">
                    <Link
                      to={`/rooms/${room._id}`}
                      className="room-card-luxury__button"
                    >
                      View Room
                    </Link>

                    <p className="room-card-luxury__price">
                      ${room.price}
                      <span> / night</span>
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Rooms;