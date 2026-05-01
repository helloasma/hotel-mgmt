// src/routes/ProtectRoute.jsx
import React from 'react';
import { Route, Navigate } from 'react-router-dom';

// This component checks if the user is logged in and is an admin
const ProtectRoute = ({ element: Element, ...rest }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');  // Assuming you store the role after login
  
  if (!token || userRole !== 'admin') {
    // Redirect to login page if no token or not an admin
    return <Navigate to="/admin-login" replace />;
  }

  return <Route {...rest} element={Element} />;
};

export default ProtectRoute;