import { Routes, Route } from "react-router-dom";

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


function AppRoutes() {
  return (
    <Routes>
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
    </Routes>
  );
}

export default AppRoutes;