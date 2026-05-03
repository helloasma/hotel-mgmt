import React from 'react';
import { Link } from 'react-router-dom';
import './AdminNavbar.css';

const AdminNavbar = () => {
  const role = localStorage.getItem("role");
  const allowedBooking = ["Receptionist", "Chief Manager"].includes(role);
  const allowedRoom = ["Manager", "Chief Manager"].includes(role);
  const allowedStaff = ["Manager", "Chief Manager"].includes(role);
  const allowedMgmt = role === "Chief Manager";
  const allowedUsers = ["Chief Manager", "User support"].includes(role);

  return (
    <div className="admin-navbar">
      <ul>
        <li><Link to="/admin/dashboard">My Account</Link></li>
        {allowedBooking && <li><Link to="/admin/bookings">Booking Management</Link></li>}
        {allowedRoom && <li><Link to="/admin/rooms">Room Management</Link></li>}
        {allowedStaff && <li><Link to="/admin/operation-staffs">Opration Staffs</Link></li>}
        {allowedMgmt && <li><Link to="/admin/management-staffs">Managment Staffs</Link></li>}
        {allowedUsers && <li><Link to="/admin/users">Website Users</Link></li>}
        {allowedUsers && <li><Link to="/admin/contact-messages">Website Messages</Link></li>}
        {allowedMgmt && <li><Link to="/admin/visual-summary">Visual Summary</Link></li>}
      </ul>
    </div>
  );
};

export default AdminNavbar;