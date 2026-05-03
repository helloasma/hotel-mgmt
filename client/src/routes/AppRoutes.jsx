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
import ForgotPassword from "../pages/Account/ForgotPassword";
import ResetPassword from "../pages/Account/ResetPassword";

import AdminLogin from "../pages/Account/AdminLogin";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import BookingManagement from "../pages/Admin/BookingManagement";
import RoomManagement from "../pages/Admin/RoomManagement.jsx";
import UserManagement from "../pages/Admin/UserManagement.jsx";
import OperationStaffs from "../pages/Admin/OperationStaffs.jsx";
import ManagementStaffs from "../pages/Admin/ManagementStaffs.jsx";
import ContactMessages from "../pages/Admin/ContactMessages.jsx";
import VisualSummary from "../pages/Admin/VisualSummary.jsx";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedAdminRoute from "./ProtectedAdminRoute";

import PrivateRoute from "../components/PrivateRoute";

function AppRoutes() {
  return (
    <Routes>

      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/rooms" element={<PrivateRoute showPrompt pageName="the Rooms page" pageDesc="explore our rooms"><Rooms /></PrivateRoute>} />
      <Route path="/rooms/:id" element={<PrivateRoute showPrompt pageName="the Rooms page" pageDesc="explore our rooms"><RoomDetails /></PrivateRoute>} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<About />} />
      <Route path="/journey" element={<Journey />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      
      {/* Protected Admin Routes */}
      <Route element={<ProtectedAdminRoute />}>
        <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/admin/bookings" element={<AdminLayout><BookingManagement /></AdminLayout>} />
        <Route path="/admin/rooms" element={<AdminLayout><RoomManagement /></AdminLayout>} />
        <Route path="/admin/users" element={<AdminLayout><UserManagement /></AdminLayout>} />
        <Route path="/admin/operation-staffs" element={<AdminLayout><OperationStaffs /></AdminLayout>} />
        <Route path="/admin/management-staffs" element={<AdminLayout><ManagementStaffs /></AdminLayout>} />
        <Route path="/admin/contact-messages" element={<AdminLayout><ContactMessages /></AdminLayout>} />
        <Route path="/admin/visual-summary" element={<AdminLayout><VisualSummary /></AdminLayout>} />
      </Route>

      <Route path="/Login" element={<Login />} />
      <Route path="/Signup" element={<Signup />} />
      <Route path="/Validation" element={<Validation />} />

      {/* Protected: logged-in users only */}
      <Route
        path="/account"
        element={
          <PrivateRoute>
            <Account />
          </PrivateRoute>
        }
      />
      <Route
        path="/booking"
        element={
          <PrivateRoute>
            <Booking />
          </PrivateRoute>
        }
      />
      <Route
        path="/booking/:roomId"
        element={
          <PrivateRoute>
            <Booking />
          </PrivateRoute>
        }
      />
    </Routes>
  );

}

export default AppRoutes;
