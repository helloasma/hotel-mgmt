import "./Sidebar.css";
import { Link } from "react-router-dom";

function Sidebar({ isOpen, setIsOpen }) {
  if (!isOpen) return null;



  return (
    <>
      {/* OVERLAY (optional dim background) */}
      <div className="overlay show" />

      <div
        className="sidebar open"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <h2>MENU</h2>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/account">My Account</Link></li>
            <li><Link to="/rooms">Rooms</Link></li>
            <li><Link to="/journey">Journey</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/about">About Us</Link></li>
          </ul>
          <div className="sidebar-footer">
            <p className="sidebar-credit">Site by Lovender Island Resort</p>
          </div>
      </div>
    </>
  );
}

export default Sidebar;