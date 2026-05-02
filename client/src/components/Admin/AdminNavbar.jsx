import React from 'react';
import { Link } from 'react-router-dom';
import './AdminNavbar.css';

const AdminNavbar = () => {
  const role = localStorage.getItem("role");
  const allowedBooking = ["Receptionist", "Chief Manager"].includes(role);
  const allowedRoom = ["Manager", "Chief Manager"].includes(role);
  const allowedStaff = ["Manager", "Chief Manager"].includes(role);
  const allowedMgmt = role === "Chief Manager";

  return (
    <div className="admin-navbar">
      <ul>
        <li><Link to="/admin/dashboard">My Account</Link></li>
        {allowedBooking && <li><Link to="/admin/bookings">Booking Management</Link></li>}
        {allowedRoom && <li><Link to="/admin/rooms">Room Management</Link></li>}
        {allowedStaff && <li><Link to="/admin/operation-staffs">Operation Staffs</Link></li>}
        {allowedMgmt && <li><Link to="/admin/management-staffs">Management Staffs</Link></li>}
      </ul>
    </div>
  );
};

export default AdminNavbar;