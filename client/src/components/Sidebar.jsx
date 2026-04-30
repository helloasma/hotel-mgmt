import "./Sidebar.css";
import { Link } from "react-router-dom";

function Sidebar({ isOpen, setIsOpen }) {
  if (!isOpen) return null;

  const handleAdminLogin = () => {
    window.open("/admin/login", "_blank");
  };

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
            <li><Link to="/Account">My Account</Link></li>
            <li><Link to="/Rooms">Rooms</Link></li>
            <li><Link to="/journey">Journey</Link></li>
            <li><Link to="/Contact">Contact</Link></li>
            <li><Link to="/About">About Us</Link></li>
          </ul>
          <div className="sidebar-footer">
            <button className="staff-btn" onClick={handleAdminLogin}>
              Lovender staff?
            </button>
          </div>
      </div>
    </>
  );
}

export default Sidebar;