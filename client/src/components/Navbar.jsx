import { Link } from "react-router-dom";


function Navbar() {
  return (
    <nav style={{ padding: "15px", background: "#12284b", color: "#bfb6ce" }}>

      <Link to="/Home" style={{ color: "#bfb6ce", marginRight: "15px" }}>
        Home
      </Link>
      <Link to="/Rooms" style={{ color: "#bfb6ce", marginRight: "15px" }}>
        Rooms
      </Link>
      <Link to="/Login" style={{ color: "#bfb6ce", marginRight: "15px" }}>
        Login
      </Link>
      <Link to="/Signup" style={{ color: "#bfb6ce" }}>
        Signup
      </Link>
    </nav>
  );
}

export default Navbar;