import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Booking from "../pages/Booking";
import Account from "../pages/Account";
import Search from "../pages/Search";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Booking" element={<Booking />} />
      <Route path="/Account" element={<Account />} />
      <Route path="/Search" element={<Search />} />
    </Routes>
  );
}

export default AppRoutes;