import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// This component checks if the user is logged in and has a management role
const ProtectedAdminRoute = () => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  const allowedRoles = ["Chief Manager", "Manager", "Receptionist", "User support"];

  if (!token || !allowedRoles.includes(userRole)) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedAdminRoute;
