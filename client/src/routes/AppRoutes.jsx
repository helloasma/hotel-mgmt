import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Account from "../pages/Account";
import Rooms from "../pages/Rooms";
import Contact from "../pages/Contact";
import About from "../pages/About";
import Packages from "../pages/Packages";
import Booking from "../pages/Booking";
import RoomDetails from "../pages/RoomDetails";


function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Account" element={<Account />} />
      <Route path="/rooms" element={<Rooms />} />
      <Route path="/rooms/:id" element={<RoomDetails />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/Packages" element={<Packages />} />
      <Route path="/Contact" element={<Contact />} />
      <Route path="/About" element={<About />} />
    </Routes>
  );
}

export default AppRoutes;