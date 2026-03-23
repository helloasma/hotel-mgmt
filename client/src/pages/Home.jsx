import "./Home.css";
import logo from "../assets/logoWhite.png";

function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="hero">
        <div className="overlay">
          <img
            src={logo}
            alt="Lovender Logo"
            style={{ height: "160px", marginRight: "20px" }}
          />
          <p>Escape to a lavender island paradise</p>

          <div className="search-box">
            <input type="text" placeholder="Location" />
            <input type="date" />
            <input type="date" />
            <button>Explore</button>
          </div>
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