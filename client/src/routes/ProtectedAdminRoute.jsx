import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// This component checks if the user is logged in and is an admin
const ProtectedAdminRoute = () => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');  // Assuming you store the role after login
  
  if (!token || userRole !== 'admin') {
    // Redirect to admin login page if no token or not an admin
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedAdminRoute;
