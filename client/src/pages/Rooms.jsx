import "./Rooms.css";

import heroVideo from "../assets/Room.mp4";
import roomOceanSuite from "../assets/room-ocean-suite.jpg";
import roomGardenDeluxe from "../assets/room-garden-deluxe.jpg";
import roomPenthouse from "../assets/room-penthouse.jpg";
import roomFamilySuite from "../assets/room-family-suite.jpg";
import roomHoneymoon from "../assets/room-honeymoon.jpg";
import roomStandard from "../assets/room-standard.jpg";

function Rooms() {
  const rooms = [
    {
      id: 1,
      title: "Ocean View Suite",
      image: roomOceanSuite,
      description:
        "Wake up to endless blue horizons and a private balcony, designed for guests who want light, calm, and uninterrupted views.",
      size: "58 m²",
      bed: "King Bed",
      bath: "Ocean View Bath",
    },
    {
      id: 2,
      title: "Garden Deluxe Room",
      image: roomGardenDeluxe,
      description:
        "A peaceful retreat wrapped in greenery and filtered sunlight, with warm finishes and a quiet luxury feel throughout.",
      size: "42 m²",
      bed: "Queen Bed",
      bath: "Rain Shower",
    },
    {
      id: 3,
      title: "Skyline Penthouse",
      image: roomPenthouse,
      description:
        "Top-floor indulgence with panoramic city views, expansive lounge space, and a statement atmosphere from day to night.",
      size: "96 m²",
      bed: "King Bed",
      bath: "Luxury Bath",
    },
    {
      id: 4,
      title: "Family Suite",
      image: roomFamilySuite,
      description:
        "Spacious comfort designed for unforgettable group stays, with room to relax together without losing the boutique feel.",
      size: "72 m²",
      bed: "King + Twin Beds",
      bath: "Rain Shower",
    },
    {
      id: 5,
      title: "Sunset Honeymoon Retreat",
      image: roomHoneymoon,
      description:
        "Romance and golden sunsets from your private terrace, styled to feel intimate, warm, and quietly cinematic.",
      size: "60 m²",
      bed: "Four-Poster Bed",
      bath: "Couples Bath",
    },
    {
      id: 6,
      title: "Classic Standard Room",
      image: roomStandard,
      description:
        "Clean, calm comfort with warm wood finishes and elegant simplicity for guests who want a refined and restful stay.",
      size: "35 m²",
      bed: "Queen Bed",
      bath: "Rain Shower",
    },
  ];

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
                    {room.bath}
                  </span>
                </div>

                <div className="room-card-luxury__actions">
                  <a href="#rooms-list" className="room-card-luxury__button">
                    View Room
                  </a>
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