import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home/Home";
import Account from "../pages/Account/Account";
import Rooms from "../pages/Rooms/Rooms";
import Contact from "../pages/Contact/Contact";
import About from "../pages/About/About";
import RoomDetails from "../pages/Rooms/RoomDetails";
import Login from "../pages/Account/Login";
import Signup from "../pages/Account/Signup";
import Validation from "../pages/Account/Validation";
import Booking from "../pages/Rooms/Booking";
import Journey from "../pages/Journey/Journey";
import AdminLogin from "../pages/Account/AdminLogin";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import BookingManagement from "../pages/Admin/BookingManagement";
import RoomManagement from "../pages/Admin/RoomManagement";
import UserManagement from "../pages/Admin/UserManagement";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedAdminRoute from "./ProtectedAdminRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* Regular Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/account" element={<Account />} />
      <Route path="/rooms" element={<Rooms />} />
      <Route path="/rooms/:id" element={<RoomDetails />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/booking/:roomId" element={<Booking />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Signup" element={<Signup />} />
      <Route path="/Validation" element={<Validation />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<About />} />
      <Route path="/journey" element={<Journey />} />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      
      {/* Protected Admin Routes */}
      <Route element={<ProtectedAdminRoute />}>
        <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/admin/bookings" element={<AdminLayout><BookingManagement /></AdminLayout>} />
        <Route path="/admin/rooms" element={<AdminLayout><RoomManagement /></AdminLayout>} />
        <Route path="/admin/users" element={<AdminLayout><UserManagement /></AdminLayout>} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;