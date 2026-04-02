import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/LovenderWhite.png";
import accountIcon from "../assets/accountIcon.png";
import Sidebar from "./Sidebar";
import "./Navbar.css";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="site-header">
        <div className="nav-inner">

          {/* LEFT SIDE */}
          <div className="nav-left">
            <button
              className="icon-btn"
              onMouseEnter={() => setIsOpen(true)}
            >
              ☰
            </button>
          </div>

          {/* CENTER LOGO */}
          <div className="nav-center">
            <Link to="/">
              <img src={logo} alt="logo" className="logo" />
            </Link>
          </div>

          {/* RIGHT SIDE */}
          <div className="nav-right">
            <Link to="/booking" className="book-btn">Book Now</Link>

            <Link to="/Account" className="icon-btn">
              <img src={accountIcon} alt="account" className="icon-img" />
            </Link>
          </div>

        </div>
      </header>

      <Sidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </>
  );
}

export default Navbar;