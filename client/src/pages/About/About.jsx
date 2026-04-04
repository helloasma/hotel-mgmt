import "./About.css";
import img1 from "../../assets/about/frontView.png";
import img2 from "../../assets/about/philosophy.png";
import img3 from "../../assets/about/suite.png";
import sunsetImg from "../../assets/about/sunset.jpg";

const About = () => {
  return (
    <div className="about-root">

      {/* HERO */}
      <header className="about-hero">

        <div className="about-hero-content">
          <h1 className="about-hero-title">ABOUT LOVENDER</h1>
          <p className="about-hero-text">Our Story</p>
        </div>
      </header>


      {/* OUR CONCEPT */}
      <section className="about-section about-grid">
        <div>
          <h2>The Beginning</h2>
          <p>
            Lovender Island Resort was envisioned as a place where nature and design exist in harmony. Inspired by the
             idea of creating a destination that feels both unique and timeless, the concept began with a simple vision:
              to build an experience that is calm, intentional, and deeply connected to its surroundings.
           </p>
           <p className="about-extra-text">
            Set on a heart-shaped island, Lovender was designed to reflect balance — between forest and sea, openness 
            and privacy, simplicity and comfort.
          </p>
        </div>
        <img src={img1} className="about-img-card" />
      </section>




      {/* ISLAND EXPERIENCE */}
      <section className="about-section about-grid">
        <img src={img2} className="about-img-card" />

        <div>
          <h2>The Philosophy</h2>

          <p>
            At the core of Lovender is the belief that true luxury lies in clarity and purpose. 
            Every element of the island is carefully considered, from the placement of forest cabins 
            among lavender fields to the positioning of rooms along the mountain and over the water.
           </p>

          <p className="about-extra-text">
            Rather than offering excess, Lovender focuses on what matters most — space, atmosphere, 
            and meaningful experiences. Guests are invited to explore the island at their own pace, 
            enjoying both shared moments and private escapes designed to feel effortless and natural.
          </p>
        </div>
      </section>




      {/* WHAT MAKES DIFFERENT */}
      <section className="about-section about-grid">
        <div>
          <h2>The Experience Today</h2>

          <p>
            Today, Lovender offers a collection of stays and experiences that reflect its original vision. 
            Whether staying in a forest cabin, a mountain suite, or an overwater bungalow, each guest experiences 
            a different perspective of the island.
           </p>
           <p className="about-extra-text">
            From arrival at Mahé Island to every detail of the stay, the journey is designed to be 
            smooth and considered. With a focus on comfort, service, and atmosphere, Lovender continues 
            to offer a place where every visit feels balanced, personal, and memorable.
          </p>

        </div>
        <img src={img3} className="about-img-card" />
      </section>


      {/* SUNSET */}
      <section className="about-sunset">
        <img src={sunsetImg} />
      </section>

    </div>
  );
};

export default About;