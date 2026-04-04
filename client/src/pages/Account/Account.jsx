import { useNavigate } from "react-router-dom";
import "./Account.css";

function HeartIcon({ size = 24, fill = "#12284B", opacity = 0.85 }) {
  return (
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ width: size, fill, opacity }}>
      <path d="M16 27C16 27 4 19 4 11c0-4.2 3.6-7.5 8-7.5 1.8 0 3.4.7 4 1.6.6-.9 2.2-1.6 4-1.6C24.4 3.5 28 6.8 28 11c0 8-12 16-12 16z" />
    </svg>
  );
}

export default function Account() {
  const navigate = useNavigate();

  return (
    <div className="account-page">

      {/* Background sprig — top left */}
      <svg className="account-sprig account-sprig--tl" viewBox="0 0 200 400" xmlns="http://www.w3.org/2000/svg">
        <line x1="100" y1="400" x2="100" y2="40" stroke="#9b92b8" strokeWidth="2.5"/>
        <line x1="65"  y1="400" x2="65"  y2="80" stroke="#9b92b8" strokeWidth="1.8"/>
        <line x1="135" y1="400" x2="135" y2="72" stroke="#9b92b8" strokeWidth="1.8"/>
        <ellipse cx="100" cy="25"  rx="13" ry="28" fill="#BFB6CE"/>
        <ellipse cx="65"  cy="65"  rx="10" ry="22" fill="#C4BCE0"/>
        <ellipse cx="135" cy="58"  rx="10" ry="22" fill="#BFB6CE"/>
        <ellipse cx="82"  cy="180" rx="15" ry="5" fill="#406D61" opacity="0.5" transform="rotate(-30 82 180)"/>
        <ellipse cx="118" cy="180" rx="15" ry="5" fill="#406D61" opacity="0.5" transform="rotate(30 118 180)"/>
        <ellipse cx="82"  cy="240" rx="15" ry="5" fill="#406D61" opacity="0.45" transform="rotate(-30 82 240)"/>
        <ellipse cx="118" cy="240" rx="15" ry="5" fill="#406D61" opacity="0.45" transform="rotate(30 118 240)"/>
      </svg>

      {/* Background sprig — bottom right */}
      <svg className="account-sprig account-sprig--br" viewBox="0 0 200 400" xmlns="http://www.w3.org/2000/svg">
        <line x1="100" y1="400" x2="100" y2="40" stroke="#9b92b8" strokeWidth="2.5"/>
        <line x1="65"  y1="400" x2="65"  y2="80" stroke="#9b92b8" strokeWidth="1.8"/>
        <line x1="135" y1="400" x2="135" y2="72" stroke="#9b92b8" strokeWidth="1.8"/>
        <ellipse cx="100" cy="25"  rx="13" ry="28" fill="#BFB6CE"/>
        <ellipse cx="65"  cy="65"  rx="10" ry="22" fill="#C4BCE0"/>
        <ellipse cx="135" cy="58"  rx="10" ry="22" fill="#BFB6CE"/>
        <ellipse cx="82"  cy="180" rx="15" ry="5" fill="#406D61" opacity="0.5" transform="rotate(-30 82 180)"/>
        <ellipse cx="118" cy="180" rx="15" ry="5" fill="#406D61" opacity="0.5" transform="rotate(30 118 180)"/>
      </svg>

      {/* Card */}
      <div className="account-card">

        {/* Logo */}
        <div className="account-logo">
          <HeartIcon size={26} />
          <span className="account-logo__name">LOVENDER</span>
        </div>

        {/* Lock icon */}
        <div className="account-lock">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 22 }}>
            <rect x="5" y="11" width="14" height="10" rx="2" stroke="#BFB6CE" strokeWidth="1.5"/>
            <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="#BFB6CE" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="12" cy="16" r="1.5" fill="#BFB6CE"/>
          </svg>
        </div>

        {/* Heading */}
        <h1 className="account-heading">
          You are not <em>logged in</em>
        </h1>

        <p className="account-subtext">
          Sign in to access your island account, manage bookings, and enjoy your Lovender membership.
        </p>

        {/* Sign In button */}
        <button className="account-btn-primary" onClick={() => navigate("/Login")}>
          <HeartIcon size={15} fill="white" opacity={0.85} />
          Sign In to My Account
        </button>

        {/* Divider */}
        <div className="account-divider">
          <div className="account-divider__line" />
          <svg width="18" height="28" viewBox="0 0 18 28" xmlns="http://www.w3.org/2000/svg">
            <line x1="9" y1="28" x2="9" y2="10" stroke="#9b92b8" strokeWidth="1.2"/>
            <ellipse cx="9" cy="6" rx="5" ry="8" fill="#BFB6CE"/>
          </svg>
          <div className="account-divider__line" />
        </div>

        {/* Signup prompt */}
        <p className="account-signup-prompt">Don't have an account? Join the island.</p>

        {/* Create Account button */}
        <button className="account-btn-secondary" onClick={() => navigate("/Signup")}>
          Create an Account
        </button>

      </div>
    </div>
  );
}