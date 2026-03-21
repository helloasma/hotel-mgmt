import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ padding: "15px", background: "#12284b", color: "#bfb6ce" }}>
      <h2 style={{ display: "inline", marginRight: "20px" }}>
        Lovender 🌿
      </h2>

      <Link to="/" style={{ color: "#bfb6ce", marginRight: "15px" }}>
        Home
      </Link>
      <Link to="/login" style={{ color: "#bfb6ce", marginRight: "15px" }}>
        Login
      </Link>
      <Link to="/signup" style={{ color: "#bfb6ce" }}>
        Signup
      </Link>
    </nav>
  );
}

export default Navbar;