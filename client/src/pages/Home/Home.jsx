import "./Home.css";
import logo from "../../assets/HomeGallery/logoWhite.png";
import sec1_img1 from "../../assets/HomeGallery/sec1_img1.png";
import sec1_img2 from "../../assets/HomeGallery/sec1_img2.png";
import sec1_img3 from "../../assets/HomeGallery/sec1_img3.png";
import sec1_img4 from "../../assets/HomeGallery/sec1_img4.png";
import islandVideo from "../../assets/HomeGallery/islandVideo.mp4";
import { useEffect } from "react";
import { Link } from "react-router-dom";

function Home() {

  useEffect(() => {
  const reveals = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    },
    {
      threshold: 0.2,
    }
  );

  reveals.forEach((el) => observer.observe(el));

  return () => observer.disconnect();
  }, []);

  return (
    <div className="home-container">
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

        <div className="review-bar hero-review">
          <div className="review-item">
            <h3>4.78<span>/5</span></h3>
            <p>Excellent<br />based on 369 reviews</p>
          </div>

          <div className="divider"></div>

          <div className="review-item">
            <p>Atmosphere</p>
            <h3>4.8<span>/5</span></h3>
          </div>

          <div className="review-item">
            <p>Comfort</p>
            <h3>4.7<span>/5</span></h3>
          </div>

          <div className="review-item">
            <p>Amenities</p>
            <h3>4.7<span>/5</span></h3>
          </div>

          <div className="review-item">
            <p>Service</p>
            <h3>4.9<span>/5</span></h3>
          </div>
        </div>
        
      </section>



      {/* ABOUT */}
      <section className="sectione-one">
        <div className="sectione-one-container">

          {/* LEFT SIDE (TEXT) */}
          <div className="sectione-one-text">
            <h2>Where Nature Shapes Every Experience</h2>

            <p>
              Step into a world where time slows and every moment is designed to be
              felt. Lovender Island Resort is a secluded sanctuary shaped by nature
              and inspired by the harmony of forest, lavender fields, and endless
              ocean views.
            </p>

            <p>
              From peaceful walks through fragrant landscapes to intimate evenings
              beneath open skies, every experience is crafted to bring a sense of
              calm, connection, and quiet luxury. Whether you seek stillness,
              celebration, or something in between, Lovender invites you to discover
              a stay that feels both effortless and unforgettable.
            </p>

            <a href="/about" className="sectione-one-link">ABOUT US</a>
          </div>

          {/* FIRST IMAGE */}
          <div className="image-one reveal">
            <img src={sec1_img1} alt="Lovender interior" />
          </div>

        </div>


        {/* SECOND IMAGE */}
        <div className="image-two reveal">
          <img src={sec1_img2} alt="Interior detail" />

          {/* THIRD IMAGE */}
          <div className="image-three reveal">
            <img src={sec1_img3} alt="Resort view" />

            {/* Fourth IMAGE */}
            <div className="image-four reveal">
              <img src={sec1_img4} alt="Resort detail" />
            </div>
          </div>
        </div>


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