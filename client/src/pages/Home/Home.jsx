import "./Home.css";
import logo from "../../assets/HomeGallery/logoWhite.png";
import sec1_img1 from "../../assets/HomeGallery/sec1_img1.png";
import sec1_img2 from "../../assets/HomeGallery/sec1_img2.png";
import sec1_img3 from "../../assets/HomeGallery/sec1_img3.png";
import sec1_img4 from "../../assets/HomeGallery/sec1_img4.jpg";
import sec1_img5 from "../../assets/HomeGallery/sec1_img5.jpg";
import sec1_img6 from "../../assets/HomeGallery/sec1_img6.png";
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
          <img src={logo} alt="Lovender Logo" className="hero-logo" />
          <p className="hero-tagline">Escape to a lavender island paradise</p>
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
            <h2>WHERE NATURE SHAPES EVERY EXPERIENCE</h2>

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

            <p>
              Designed to offer both exploration and retreat, the island reveals 
              itself through a collection of distinct spaces, each shaped by its 
              surroundings. From forest paths and elevated viewpoints to quiet shores 
              and open waters, every setting offers a different perspective of Lovender. 
              Guided by simplicity and attention to detail, each moment is an invitation 
              to slow down, take in the landscape, and experience the island in a way that 
              feels natural, personal, and complete.
            </p>
            
            <a href="/about" className="sectione-one-link">ABOUT US</a>
          </div>

          {/* FIRST IMAGE */}
          <div className="image-one reveal">
            <img src={sec1_img1} alt="Lovender interior" />
          </div>

        </div>


        <div className="image-layout">

          <div className="row1-column1">
            <div className="image-two reveal">
              <img src={sec1_img2} alt="" />
            </div>

            <div className="stay-text">
              <h2>STAY AT LOVENDER</h2>
              <p>
                Featuring a collection of forest cabins, mountain-view rooms, and overwater
                bungalows, each space is thoughtfully placed to offer privacy, comfort, and
                a unique connection to the island’s natural surroundings. From quiet moments
                among lavender fields to expansive views across the sea, every stay invites
                you to experience Lovender in your own way.
              </p>

              <a href="/rooms" className="sectione-one-link">VIEW ROOMS</a>
            </div>

          </div>


          {/* 👇 NEW WRAPPER */}
          <div className="row1-column2">
            <div className="small-img reveal"><img src={sec1_img3} /></div>
            <div className="small-img reveal"><img src={sec1_img4} /></div>
            <div className="small-img reveal"><img src={sec1_img5} /></div>
          </div>

          <div className="image-six reveal">
            <img src={sec1_img6} alt="" />
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