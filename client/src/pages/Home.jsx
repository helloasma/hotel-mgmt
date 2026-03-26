import "./Home.css";
import logo from "../assets/logoWhite.png";
import islandVideo from "../assets/islandVideo.mp4";

function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="hero">
        <video autoPlay loop muted playsInline className="hero-video">
          <source src={islandVideo} type="video/mp4" />
        </video>

        <div className="overlay">
          <img
            src={logo}
            alt="Lovender Logo"
            style={{ height: "160px", marginRight: "20px" }}
          />
          <p>Escape to a lavender island paradise</p>
        </div>
      </section>

      {/* REVIEW BAR */}
      <section className="review-bar">
        <div className="review-item">
          <h3>4.7<span>/5</span></h3>
          <p>Excellent<br />based on 369 reviews</p>
        </div>

        <div className="divider"></div>

        <div className="review-item">
          <p>Trip Advisor</p>
          <h3>4.8<span>/5</span></h3>
        </div>

        <div className="review-item">
          <p>Booking.com</p>
          <h3>9.0<span>/10</span></h3>
        </div>

        <div className="review-item">
          <p>Hotels.com</p>
          <h3>9.6<span>/10</span></h3>
        </div>

        <div className="review-item">
          <p>Expedia</p>
          <h3>9.6<span>/10</span></h3>
        </div>
      </section>

      {/* ABOUT */}
      <section className="about">
        <h2>A Romantic Island Experience</h2>
        <p>
          Discover a heart-shaped island filled with lavender forests and
          stunning ocean views. Lovender offers peace, beauty, and luxury.
        </p>
      </section>

      {/* ROOMS */}
      <section className="featured">
        <h2>Featured Stays</h2>
        <div className="cards">
          <div className="card">
            <img src="https://source.unsplash.com/300x200/?hotel,sea" />
            <h3>Forest Cabins</h3>
          </div>

          <div className="card">
            <img src="https://source.unsplash.com/300x200/?cabin,nature" />
            <h3>Mountain Hotel Rooms</h3>
          </div>

          <div className="card">
            <img src="https://source.unsplash.com/300x200/?luxury,room" />
            <h3>Overwater Bungalows</h3>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="categories">
        <h2>Explore Packages</h2>
        <div className="cards">
          <div className="card">Lovender Romantic Escape</div>
          <div className="card">Lovender Elite Experience</div>
        </div>
      </section>
    </div>
  );
}

export default Home;