import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ padding: "10px", background: "#eee" }}>
      <Link to="/">Home</Link> |{" "}
      <Link to="/login">Login</Link> |{" "}
      <Link to="/signup">Signup</Link>
    </nav>
  );
}

export default Navbar;