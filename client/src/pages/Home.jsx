import "./Home.css";

function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="hero">
        <h1>Welcome to Lovender</h1>
        <p>Your peaceful escape in a lavender island paradise</p>

        <div className="search-box">
          <input type="text" placeholder="Where are you going?" />
          <input type="date" />
          <input type="date" />
          <button>Explore</button>
        </div>
      </section>

      {/* ABOUT */}
      <section className="about">
        <h2>The Lovender Experience</h2>
        <p>
          Stay on a heart-shaped island surrounded by lavender forests and
          breathtaking ocean views. Relax, breathe, and reconnect with nature.
        </p>
      </section>

      {/* ROOMS */}
      <section className="featured">
        <h2>Featured Stays</h2>
        <div className="cards">
          <div className="card">
            <h3>Ocean View Suite</h3>
            <p>$220 / night</p>
          </div>
          <div className="card">
            <h3>Lavender Forest Cabin</h3>
            <p>$150 / night</p>
          </div>
          <div className="card">
            <h3>Island Deluxe Room</h3>
            <p>$110 / night</p>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="categories">
        <h2>Explore by Style</h2>
        <div className="cards">
          <div className="card">Romantic</div>
          <div className="card">Nature</div>
          <div className="card">Luxury</div>
          <div className="card">Beachfront</div>
        </div>
      </section>
    </div>
  );
}

export default Home;