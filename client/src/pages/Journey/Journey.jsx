import React from "react";
import "./Journey.css";
import img1 from "../../assets/journeyGallery/img1.jpg";
import img2 from "../../assets/journeyGallery/img2.jpg";
import img3 from "../../assets/journeyGallery/img3.jpg";

const Journey = () => {
  return (
    <div className="journey-page">
        <div className="page">
        {/* TOP TITLE */}
        <h1 className="main-title">LOVENDER JOURNEY</h1>

        {/* HERO SECTION */}
        <section className="hero">
            <div className="hero-text">
                <h2>WHERE IT ALL BEGINS</h2>
                <p>
                    Every unforgettable escape begins with a first step — yours begins on the shores of Mahé Island.
                </p>
                <p>
                    Here, where emerald mountains meet the endless Indian Ocean, the rhythm of everyday life gently fades. 
                    You are welcomed not as a traveler, but as a guest of something rare. From this moment, every detail is quietly 
                    taken care of — every movement thoughtfully arranged.
                </p>
                <p>
                    Mahé is not just a starting point. It is the threshold between the world you know… and the secluded sanctuary
                    waiting beyond the horizon.
                </p>
            </div>

            <div className="hero-image">
            <img src={img1} alt="Journey start" />
            </div>

            {/* Decorative circles */}
            <div className="circle small bottom-right"></div>
        </section>

        {/* SECOND SECTION */}
        <section className="info">
            <div className="info-image">
            <img src={img2} alt="Boat journey" />
            <div className="circle small inner-circle"></div>
            </div>

            <div className="info-text">
                <h2>ACROSS THE WATER TO LOVENDER</h2>
                <p>The ocean calls you forward.</p>
                <p>
                    A sleek speedboat awaits, ready to carry you across shimmering turquoise waters — your path to 
                    Lovender Island unfolding with every passing moment. This is more than a transfer; it is the gentle 
                    unfolding of your escape.
                </p>
                <p>
                    The breeze, the scent of salt in the air, the endless blues stretching in every direction — time 
                    begins to slow, senses awaken, and anticipation builds.
                </p>
                <p>
                    For every guest, this signature journey is seamlessly included, a defining part of the Lovender 
                    experience. For those in our standard accommodations, it remains the exclusive passage — intimate, 
                    effortless, and deeply connected to the sea.
                </p>
            </div>
        </section>


        {/* BOTTOM HERO SECTION */}
        <section className="hero hero-bottom">

        <div className="hero-image">
            <img src={img3} alt="Helicopter arrival" />
        </div>

        <div className="hero-text">
            <h2>THE SKY RESERVED FOR YOU</h2>

            <p>For a select few, the journey rises beyond the horizon.</p>

            <p>
            Guests of our most exclusive villas are invited to experience a private
            helicopter transfer, offered as a complimentary expression of elevated
            luxury. As you ascend, the islands of Seychelles reveal themselves like
            scattered jewels — vivid greens surrounded by endless, luminous blue.
            </p>

            <p>
            From above, Lovender Island appears not as a destination, but as a secret
            — yours to discover.
            </p>

            <p>
            Touching down directly on the island, your arrival becomes a moment
            suspended in time: quiet, breathtaking, unforgettable.
            </p>

            <p>
            And yet, the choice remains yours. Whether by sea or by sky, every path
            leads to the same place — a world apart, waiting only for you.
            </p>
        </div>


        <div className="circle small bottom-right"></div>
        </section>


        </div>
    </div>
  );
};

export default Journey;