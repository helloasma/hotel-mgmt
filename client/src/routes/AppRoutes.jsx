import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Account from "../pages/Account";
import Rooms from "../pages/Rooms";
import Contact from "../pages/Contact";
import About from "../pages/About";
import Packages from "../pages/Packages";



function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Account" element={<Account />} />
      <Route path="/Rooms" element={<Rooms />} />
      <Route path="/Packages" element={<Packages />} />
      <Route path="/Contact" element={<Contact />} />
      <Route path="/About" element={<About />} />
    </Routes>
  );
}

export default AppRoutes;