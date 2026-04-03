import "./Rooms.css";
import { Link } from "react-router-dom";

import heroVideo from "../assets/Room.mp4";
import { rooms } from "../data/rooms";

function Rooms() {
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
            <p className="rooms-hero__eyebrow">Rooms & Suites</p>
            <h1 className="rooms-hero__title">Rooms & Suites</h1>
            <p className="rooms-hero__subtitle">
              Discover a more elevated stay through rooms designed with light,
              comfort, and quiet luxury in mind.
            </p>
          </div>
        </div>
      </section>

      <section className="rooms-intro">
        <p className="rooms-intro__label">Accommodation</p>
        <h2 className="rooms-intro__heading">A refined collection of stays</h2>
        <p className="rooms-intro__text">
          Inspired by the visual language of luxury hotel websites, this layout
          gives each room more space, stronger imagery, and calmer typography.
          The goal is to make the page feel editorial, premium, and easy to
          browse.
        </p>
      </section>

      <section className="rooms-listing" id="rooms-list">
        <div className="rooms-grid">
          {rooms.map((room) => (
            <article className="room-card-luxury" key={room.id}>
              <div className="room-card-luxury__image-wrap">
                <img
                  src={room.image}
                  alt={room.title}
                  className="room-card-luxury__image"
                />
              </div>

              <div className="room-card-luxury__content">
                <h3 className="room-card-luxury__title">{room.title}</h3>

                <p className="room-card-luxury__description">
                  {room.shortDescription}
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

                {/* ✅ UPDATED ACTIONS (BUTTON + PRICE) */}
                <div className="room-card-luxury__actions">
                  <Link
                    to={`/rooms/${room.id}`}
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
      </section>
    </main>
  );
}

export default Rooms;