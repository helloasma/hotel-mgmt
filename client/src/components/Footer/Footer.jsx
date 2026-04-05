import "./Footer.css";
import textlogo from "../../assets/HomeGallery/hover/logoWhite.png"; 
import logo from "../../assets/lovenderWhite.png";
import img1 from "../../assets/footerGallery/img1.png";
import img2 from "../../assets/footerGallery/img2.png";
import img3 from "../../assets/footerGallery/img3.png";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        
        <div className="footer-gallery">
        <a href="https://github.com/helloasma/hotel-mgmt.git" target="_blank" rel="noopener noreferrer">
            <img src={img1} alt="GitHub Project" />
        </a>

        <a href="http://localhost:5173/">
            <img src={img2} alt="Local Site" />
        </a>

        <a href="https://www.cud.ac.ae/" target="_blank" rel="noopener noreferrer">
            <img src={img3} alt="CUD Website" />
        </a>
        </div>

        {/* CENTER - LOGO */}
        <div className="footer-center">
        <img src={textlogo} alt="Logo" className="footer-logo" />

        <img
            src={logo}
            alt="center decoration"
            className="footer-center-img"
        />
        </div>

        {/* RIGHT - TAGLINE */}
        <div className="footer-right">
          <h2>
            WHERE <br />
            NATURE <br />
            MEETS <br />
            MODERN <br />
            LUXURY
          </h2>
        </div>
      </div>

    {/* BOTTOM BAR */}
    <div className="footer-bottom">
    <div className="footer-links">
        <Link to="/journey">Journey</Link>
        <Link to="/about">About Us</Link>
        <Link to="/contact">Contact</Link>
    </div>

    <p className="footer-credit">Site by Lova Group</p>
    </div>
    </footer>
  );
}

export default Footer;