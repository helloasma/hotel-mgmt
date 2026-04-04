import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import accountIcon from "../assets/accountIcon.png";
import logo from "../assets/LovenderWhite.png";
import Sidebar from "./Sidebar";
import "./Navbar.css";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === "/";

  return (
    <>
      {/* ✅ ALWAYS FIXED MENU BUTTON */}
      <div className="menu-only">
        <button
          className="icon-btn"
          onMouseEnter={() => setIsOpen(true)}
        >
          ☰
        </button>
      </div>

      {/* ✅ ONLY ON HOME PAGE (NOT FIXED) */}
      {isHome && (
        <div className="hero-header">
          
          {/* CENTER LOGO */}
          <div className="nav-center">
            <Link to="/">
              <img src={logo} alt="logo" className="logo" />
            </Link>
          </div>

          {/* RIGHT SIDE */}
          <div className="nav-right">
            <Link to="/Account" className="icon-btn">
              <img src={accountIcon} alt="account" className="icon-img" />
            </Link>
          </div>

        </div>
      )}

      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}

export default Navbar;