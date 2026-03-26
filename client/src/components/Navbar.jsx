import { Link } from "react-router-dom";
import logo from "../assets/LovenderWhite.png";
import searchIcon from "../assets/searchIcon.png";
import accountIcon from "../assets/accountIcon.png";
import "./Navbar.css";

function Navbar() {
  return (
    <header className="site-header">
      <div className="nav-inner">

        {/* LEFT SIDE */}
        <div className="nav-left">
          <button className="icon-btn">☰</button>
          
          <Link to="/search">
            <button className="icon-btn">
              <img src={searchIcon} alt="search" className="icon-img" />
            </button>
          </Link>
        </div>

        {/* CENTER LOGO */}
        <div className="nav-center">
          <Link to="/">
            <img src={logo} alt="logo" className="logo" />
          </Link>
        </div>

        {/* RIGHT SIDE */}
        <div className="nav-right">
          <Link to="/Booking" className="book-btn">Book Now</Link>

          <Link to="/Account" className="icon-btn">
            <img src={accountIcon} alt="account" className="icon-img" />
          </Link>
        </div>

      </div>
    </header>
  );
}

export default Navbar;