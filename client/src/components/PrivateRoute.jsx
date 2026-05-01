import { useState, useEffect } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const colors = {
  lova:      "#0e081f",
  lav:       "#BFB6CE",
  lavSofter: "#F3F0F8",
  sage:      "#406D61",
  muted:     "#7a7090",
  navy:      "#12284B",
};

const DELAY = 2800;

function AccessDenied({ location, pageName = "this page", pageDesc = "explore our content" }) {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.max(0, 100 - (elapsed / DELAY) * 100);
      setProgress(pct);
      if (elapsed >= DELAY) {
        clearInterval(interval);
        navigate("/Login", { replace: true, state: { from: location } });
      }
    }, 16);
    return () => clearInterval(interval);
  }, [navigate, location]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:none; } }
      `}</style>

      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: colors.lavSofter,
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <div style={{
          textAlign: "center",
          animation: "fadeUp .65s ease both",
          maxWidth: 400,
          padding: "0 28px",
        }}>

          {/* Lavender sprig */}
          <svg width="44" height="88" viewBox="0 0 100 180" xmlns="http://www.w3.org/2000/svg"
            style={{ marginBottom: 28, opacity: 0.85 }}>
            <line x1="50" y1="180" x2="50" y2="52" stroke={colors.lova} strokeWidth="1.5" />
            <line x1="32" y1="180" x2="32" y2="72" stroke={colors.lova} strokeWidth="1.2" />
            <line x1="68" y1="180" x2="68" y2="68" stroke={colors.lova} strokeWidth="1.2" />
            <ellipse cx="50" cy="42" rx="9" ry="18" fill={colors.lav} />
            <ellipse cx="32" cy="60" rx="7" ry="14" fill={colors.lav} />
            <ellipse cx="68" cy="56" rx="7" ry="14" fill={colors.lav} />
            <ellipse cx="40" cy="98"  rx="9" ry="3.5" fill={colors.sage} opacity="0.7" transform="rotate(-28 40 98)" />
            <ellipse cx="60" cy="98"  rx="9" ry="3.5" fill={colors.sage} opacity="0.7" transform="rotate(28 60 98)" />
            <ellipse cx="40" cy="120" rx="9" ry="3.5" fill={colors.sage} opacity="0.6" transform="rotate(-28 40 120)" />
            <ellipse cx="60" cy="120" rx="9" ry="3.5" fill={colors.sage} opacity="0.6" transform="rotate(28 60 120)" />
          </svg>

          <p style={{
            fontSize: 9.5, fontWeight: 500, letterSpacing: "0.28em",
            textTransform: "uppercase", color: colors.muted, marginBottom: 14,
          }}>
            Members Only
          </p>

          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 400, fontSize: 28, lineHeight: 1.3,
            color: colors.lova, marginBottom: 16,
          }}>
            Please log in first to<br />
            <em style={{ fontStyle: "italic" }}>access {pageName}</em>
          </h2>

          <p style={{
            fontSize: 13.5, fontWeight: 300, color: colors.muted,
            lineHeight: 1.75, marginBottom: 36,
          }}>
            This area is reserved for our members.<br />
            Sign in or create a free account to {pageDesc}.
          </p>

          {/* Progress bar */}
          <div style={{
            width: "100%", height: 2,
            background: "rgba(191,182,206,0.3)",
            borderRadius: 2, overflow: "hidden", marginBottom: 14,
          }}>
            <div style={{
              height: "100%",
              width: `${progress}%`,
              background: colors.lav,
              borderRadius: 2,
              transition: "width 0.05s linear",
            }} />
          </div>

          <p style={{
            fontSize: 11, fontWeight: 300,
            color: colors.muted, letterSpacing: "0.06em",
          }}>
            Redirecting you to login…
          </p>

        </div>
      </div>
    </>
  );
}

function PrivateRoute({ children, adminOnly = false, showPrompt = false, pageName, pageDesc }) {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    if (showPrompt) return <AccessDenied location={location} pageName={pageName} pageDesc={pageDesc} />;
    return <Navigate to="/Login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PrivateRoute;
