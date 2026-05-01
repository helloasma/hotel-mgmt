import React from 'react';
import { Link } from 'react-router-dom';
import './AdminNavbar.css';

const AdminNavbar = () => {
  return (
    <div className="admin-navbar">
      <ul>
        <li><Link to="/admin/dashboard">My Dashboard</Link></li>
        <li><Link to="/admin/bookings">Bookings</Link></li>
        <li><Link to="/admin/rooms">Rooms</Link></li>
        <li><Link to="/admin/users">Users</Link></li>
      </ul>
    </div>
  );
};

export default AdminNavbar;