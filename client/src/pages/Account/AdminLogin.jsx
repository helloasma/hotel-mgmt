import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import lovenderLogo from "../../assets/lovenderBlack.png";
import "./AdminLogin.css";


const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Lovender Operation Portal";
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log("Sending login:", {
      email: email.trim().toLowerCase(),
      password,
    });

    try {
      const res = await axios.post("http://localhost:5000/api/auth/management-login", {
        email: email.trim().toLowerCase(),
        password,
      });

      console.log("LOGIN SUCCESS:", res.data);

      const user = res.data.data;
      localStorage.setItem("token", user.token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("name", user.fullName || user.name || "");
      navigate("/admin/dashboard");
    } catch (err) {
      console.log("FULL ERROR:", err);
      console.log("STATUS:", err.response?.status);
      console.log("BACKEND RESPONSE:", err.response?.data);

      setErrorMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <main className="admin-login-page">
      <section className="admin-login-container">
        <div className="admin-login-box">

          <img src={lovenderLogo} alt="Lovender" className="admin-login-logo"/>

          <h2>Lovender Operation Portal</h2>


          {errorMessage && <div className="error-message">{errorMessage}</div>}

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">Login</button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default AdminLogin;