import { useNavigate } from "react-router-dom";
import "./Account.css";
import Sprig from "./Sprig";

function HeartIcon({ size = 24, fill = "#12284B", opacity = 0.85 }) {
  return (
    <svg
      className="heart-icon"
      viewBox="0 0 32 32"
      style={{ "--size": `${size}px`, "--fill": fill, "--opacity": opacity }}
    >
      <path d="M16 27C16 27 4 19 4 11c0-4.2 3.6-7.5 8-7.5 1.8 0 3.4.7 4 1.6.6-.9 2.2-1.6 4-1.6C24.4 3.5 28 6.8 28 11c0 8-12 16-12 16z" />
    </svg>
  );
}

export default function Account() {
  const navigate = useNavigate();

  return (
    <div className="account-page">

      {/* Background sprigs */}
      <Sprig className="account-sprig account-sprig--tl" variant="full" />
      <Sprig className="account-sprig account-sprig--br" variant="simple" />

      {/* Card */}
      <div className="account-card">

        {/* Logo */}
        <div className="account-logo">
          <HeartIcon size={26} />
          <span className="account-logo__name">LOVENDER</span>
        </div>

        {/* Lock icon */}
        <div className="account-lock">
          <svg className="lock-icon" viewBox="0 0 24 24">
            <rect x="5" y="11" width="14" height="10" rx="2" className="lock-stroke"/>
            <path d="M8 11V7a4 4 0 0 1 8 0v4" className="lock-stroke"/>
            <circle cx="12" cy="16" r="1.5" className="lock-fill"/>
          </svg>
        </div>

        <h1 className="account-heading">
          You are not <em>logged in</em>
        </h1>

        <p className="account-subtext">
          Sign in to access your island account, manage bookings, and enjoy your Lovender membership.
        </p>

        <button className="account-btn-primary" onClick={() => navigate("/Login")}>
          <HeartIcon size={15} fill="white" opacity={0.85} />
          Sign In to My Account
        </button>

        <div className="account-divider">
          <div className="account-divider__line" />
          <svg className="divider-icon" viewBox="0 0 18 28">
            <line x1="9" y1="28" x2="9" y2="10" className="divider-line"/>
            <ellipse cx="9" cy="6" rx="5" ry="8" className="divider-ellipse"/>
          </svg>
          <div className="account-divider__line" />
        </div>

        <p className="account-signup-prompt">
          Don't have an account? Join the island.
        </p>

        <button className="account-btn-secondary" onClick={() => navigate("/Signup")}>
          Create an Account
        </button>

      </div>
    </div>
  );
}