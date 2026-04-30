import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import "./Account.css";
import Sprig from "./Sprig";

/* ── Color palette (matches Login/Signup) ── */
const colors = {
  lova:       "#0e081f",
  white:      "#ffffff",
  navy:       "#12284B",
  lav:        "#BFB6CE",
  lavLight:   "#D4CEDF",
  lavSofter:  "#F3F0F8",
  sage:       "#406D61",
  sageDark:   "#34574d",
  sageLight:  "#6B9B8E",
  cream:      "#FAF7F2",
  text:       "#2c2840",
  muted:      "#7a7090",
  error:      "#b5443a",
  errorBorder:"#c0392b",
  errorBg:    "#fdf5f5",
};

/* ── Heart icon (reused across pages) ── */
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

/* ── Status badge ── */
function StatusBadge({ status }) {
  const styles = {
    confirmed: { background: "#e8f5f1", color: colors.sage,    border: `1px solid ${colors.sageLight}` },
    pending:   { background: "#fef9ec", color: "#b08000",       border: "1px solid #e6c84c" },
    cancelled: { background: colors.errorBg, color: colors.error, border: `1px solid ${colors.errorBorder}` },
  };
  const s = styles[status] || styles.pending;
  return (
    <span style={{
      display: "inline-block",
      padding: "3px 10px",
      borderRadius: 20,
      fontSize: 10,
      fontWeight: 500,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      ...s,
    }}>
      {status}
    </span>
  );
}

/* ── Format date nicely ── */
function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

/* ══════════════════════════════════════
   LOGGED-OUT CARD (original design)
══════════════════════════════════════ */
function LoggedOutView({ navigate }) {
  return (
    <div className="account-page">
      <Sprig className="account-sprig account-sprig--tl" variant="full" />
      <Sprig className="account-sprig account-sprig--br" variant="simple" />

      <div className="account-card">
        <div className="account-logo">
          <HeartIcon size={26} />
          <span className="account-logo__name">LOVENDER</span>
        </div>

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

/* ══════════════════════════════════════
   LOGGED-IN DASHBOARD
══════════════════════════════════════ */
function Dashboard({ user, bookings, loadingBookings, bookingError, onCancel, cancellingId, onLogout }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0e081f",
      fontFamily: "'DM Sans', sans-serif",
      padding: "60px 20px 80px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background botanical accents */}
      <svg style={{ position:"absolute", top:-20, left:-20, width:260, opacity:0.07, pointerEvents:"none" }}
        viewBox="0 0 200 400" xmlns="http://www.w3.org/2000/svg">
        <line x1="100" y1="400" x2="100" y2="40" stroke="#BFB6CE" strokeWidth="2.5"/>
        <line x1="65"  y1="400" x2="65"  y2="80" stroke="#BFB6CE" strokeWidth="1.8"/>
        <line x1="135" y1="400" x2="135" y2="72" stroke="#BFB6CE" strokeWidth="1.8"/>
        <ellipse cx="100" cy="25"  rx="13" ry="28" fill="#BFB6CE"/>
        <ellipse cx="65"  cy="65"  rx="10" ry="22" fill="#C4BCE0"/>
        <ellipse cx="135" cy="58"  rx="10" ry="22" fill="#BFB6CE"/>
      </svg>
      <svg style={{ position:"absolute", bottom:-20, right:-20, width:200, opacity:0.07, pointerEvents:"none", transform:"rotate(180deg)" }}
        viewBox="0 0 200 400" xmlns="http://www.w3.org/2000/svg">
        <line x1="100" y1="400" x2="100" y2="40" stroke="#BFB6CE" strokeWidth="2.5"/>
        <line x1="65"  y1="400" x2="65"  y2="80" stroke="#BFB6CE" strokeWidth="1.8"/>
        <ellipse cx="100" cy="25" rx="13" ry="28" fill="#BFB6CE"/>
        <ellipse cx="65"  cy="65" rx="10" ry="22" fill="#C4BCE0"/>
      </svg>

      <div style={{ maxWidth: 760, margin: "0 auto" }}>

        {/* ── Header ── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 40, flexWrap: "wrap", gap: 16,
        }}>
          <div>
            <p style={{ fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: colors.lav, marginBottom: 8, fontWeight: 500 }}>
              Heart Island · Lovender
            </p>
            <h1 style={{
              fontFamily: "'Playfair Display', serif", fontWeight: 400,
              fontSize: "clamp(26px,4vw,38px)", color: colors.white, lineHeight: 1.15,
            }}>
              Welcome back,{" "}
              <em style={{ fontStyle: "italic", color: colors.lav }}>
                {user?.name?.split(" ")[0] || "Guest"}
              </em>
            </h1>
            <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.5)", marginTop: 6, fontWeight: 300 }}>
              {user?.email}
            </p>
          </div>

          <button
            onClick={onLogout}
            style={{
              padding: "9px 20px", borderRadius: 8,
              background: "transparent", border: "1px solid rgba(191,182,206,0.4)",
              color: colors.lav, cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 400,
              letterSpacing: "0.06em", transition: "border-color .2s, color .2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = colors.lav; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(191,182,206,0.4)"; e.currentTarget.style.color = colors.lav; }}
          >
            Sign Out
          </button>
        </div>

        {/* ── Bookings section ── */}
        <div style={{
          background: colors.cream,
          borderRadius: 16,
          padding: "36px 36px 40px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
            <div>
              <h2 style={{
                fontFamily: "'Playfair Display', serif", fontWeight: 400,
                fontSize: 24, color: colors.lova, marginBottom: 4,
              }}>
                My Bookings
              </h2>
              <p style={{ fontSize: 12.5, color: colors.muted, fontWeight: 300 }}>
                {bookings.length > 0
                  ? `${bookings.length} booking${bookings.length !== 1 ? "s" : ""} found`
                  : "No bookings yet"}
              </p>
            </div>
            {/* Decorative sprig */}
            <svg width="36" height="60" viewBox="0 0 36 60" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.3 }}>
              <line x1="18" y1="60" x2="18" y2="14" stroke={colors.lova} strokeWidth="1.5"/>
              <ellipse cx="18" cy="10" rx="7" ry="12" fill={colors.lav}/>
            </svg>
          </div>

          {/* Loading state */}
          {loadingBookings && (
            <div style={{ textAlign: "center", padding: "40px 0", color: colors.muted, fontSize: 13 }}>
              <div style={{ marginBottom: 12, fontSize: 20 }}>✦</div>
              Loading your bookings…
            </div>
          )}

          {/* Error state */}
          {bookingError && !loadingBookings && (
            <div style={{
              background: colors.errorBg, border: `1px solid ${colors.errorBorder}`,
              borderRadius: 10, padding: "16px 20px", color: colors.error, fontSize: 13,
            }}>
              {bookingError}
            </div>
          )}

          {/* Empty state */}
          {!loadingBookings && !bookingError && bookings.length === 0 && (
            <div style={{
              textAlign: "center", padding: "50px 20px",
              border: "1.5px dashed rgba(191,182,206,0.6)", borderRadius: 12,
            }}>
              <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" style={{ margin: "0 auto 16px", display:"block", opacity:0.35 }}>
                <rect x="5" y="10" width="30" height="24" rx="3" stroke={colors.lova} strokeWidth="1.5" fill="none"/>
                <line x1="5" y1="17" x2="35" y2="17" stroke={colors.lova} strokeWidth="1.5"/>
                <line x1="13" y1="6" x2="13" y2="14" stroke={colors.lova} strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="27" y1="6" x2="27" y2="14" stroke={colors.lova} strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: colors.lova, marginBottom: 8 }}>
                No bookings yet
              </p>
              <p style={{ fontSize: 12.5, color: colors.muted, fontWeight: 300, lineHeight: 1.6 }}>
                Explore our rooms and plan your island escape.
              </p>
            </div>
          )}

          {/* Booking cards */}
          {!loadingBookings && !bookingError && bookings.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  style={{
                    background: colors.white,
                    border: `1px solid rgba(191,182,206,0.4)`,
                    borderRadius: 12,
                    padding: "22px 24px",
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: "12px 20px",
                    alignItems: "start",
                    opacity: booking.status === "cancelled" ? 0.7 : 1,
                    transition: "box-shadow .2s",
                  }}
                  onMouseEnter={(e) => { if (booking.status !== "cancelled") e.currentTarget.style.boxShadow = "0 4px 16px rgba(14,8,31,0.08)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
                >
                  {/* Left info */}
                  <div>
                    {/* Room name */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
                      <h3 style={{
                        fontFamily: "'Playfair Display', serif", fontWeight: 400,
                        fontSize: 17, color: colors.lova,
                      }}>
                        {booking.room?.title || "Room"}
                      </h3>
                      <StatusBadge status={booking.status} />
                    </div>

                    {/* Dates row */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 24px", marginBottom: 10 }}>
                      <div>
                        <p style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: colors.muted, fontWeight: 500, marginBottom: 2 }}>Check-in</p>
                        <p style={{ fontSize: 13, color: colors.text, fontWeight: 400 }}>{formatDate(booking.checkIn)}</p>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", paddingTop:14, color:"rgba(191,182,206,0.8)", fontSize:18 }}>→</div>
                      <div>
                        <p style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: colors.muted, fontWeight: 500, marginBottom: 2 }}>Check-out</p>
                        <p style={{ fontSize: 13, color: colors.text, fontWeight: 400 }}>{formatDate(booking.checkOut)}</p>
                      </div>
                    </div>

                    {/* Guests + price row */}
                    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                      <div>
                        <p style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: colors.muted, fontWeight: 500, marginBottom: 2 }}>Guests</p>
                        <p style={{ fontSize: 13, color: colors.text }}>
                          {booking.adults} adult{booking.adults !== 1 ? "s" : ""}
                          {booking.children > 0 ? `, ${booking.children} child${booking.children !== 1 ? "ren" : ""}` : ""}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: colors.muted, fontWeight: 500, marginBottom: 2 }}>Total</p>
                        <p style={{ fontSize: 13, color: colors.sage, fontWeight: 500 }}>
                          ${booking.totalPrice?.toLocaleString()}
                        </p>
                      </div>
                      {booking.confirmationCode && (
                        <div>
                          <p style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: colors.muted, fontWeight: 500, marginBottom: 2 }}>Confirmation</p>
                          <p style={{ fontSize: 11, color: colors.text, fontFamily: "monospace" }}>{booking.confirmationCode}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cancel button (right column) */}
                  <div style={{ paddingTop: 4 }}>
                    {booking.status !== "cancelled" && (
                      <button
                        onClick={() => onCancel(booking._id)}
                        disabled={cancellingId === booking._id}
                        style={{
                          padding: "7px 14px",
                          borderRadius: 7,
                          background: "transparent",
                          border: `1px solid ${colors.errorBorder}`,
                          color: colors.error,
                          cursor: cancellingId === booking._id ? "not-allowed" : "pointer",
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 11,
                          fontWeight: 500,
                          letterSpacing: "0.06em",
                          transition: "background .2s, color .2s",
                          opacity: cancellingId === booking._id ? 0.6 : 1,
                          whiteSpace: "nowrap",
                        }}
                        onMouseEnter={(e) => {
                          if (cancellingId !== booking._id) {
                            e.currentTarget.style.background = colors.errorBg;
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                        }}
                      >
                        {cancellingId === booking._id ? "Cancelling…" : "Cancel Booking"}
                      </button>
                    )}
                    {booking.status === "cancelled" && (
                      <span style={{ fontSize: 11, color: colors.muted, fontStyle: "italic" }}>Cancelled</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Footer note ── */}
        <p style={{ textAlign: "center", marginTop: 32, fontSize: 11.5, color: "rgba(255,255,255,0.3)", fontWeight: 300 }}>
          Need help? Contact us at{" "}
          <span style={{ color: colors.lav }}>concierge@lovender.com</span>
        </p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   MAIN ACCOUNT PAGE COMPONENT
══════════════════════════════════════ */
export default function Account() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const [bookings, setBookings]             = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [bookingError, setBookingError]     = useState("");
  const [cancellingId, setCancellingId]     = useState(null);

  /* Fetch user bookings when logged in */
  const fetchBookings = useCallback(async () => {
    setLoadingBookings(true);
    setBookingError("");
    try {
      const res = await api.get("/bookings/my");
      setBookings(res.data.data || []);
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to load bookings. Please try again.";
      setBookingError(msg);
    } finally {
      setLoadingBookings(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated, fetchBookings]);

  /* Cancel a booking */
  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    setCancellingId(bookingId);
    try {
      await api.put(`/bookings/${bookingId}/cancel`);
      // Update local state immediately so UI reflects the change
      setBookings((prev) =>
        prev.map((b) => b._id === bookingId ? { ...b, status: "cancelled" } : b)
      );
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to cancel booking. Please try again.";
      alert(msg);
    } finally {
      setCancellingId(null);
    }
  };

  /* Logout */
  const handleLogout = () => {
    logout();
    navigate("/Login");
  };

  /* Render logged-out or logged-in view */
  if (!isAuthenticated) {
    return <LoggedOutView navigate={navigate} />;
  }

  return (
    <Dashboard
      user={user}
      bookings={bookings}
      loadingBookings={loadingBookings}
      bookingError={bookingError}
      onCancel={handleCancel}
      cancellingId={cancellingId}
      onLogout={handleLogout}
    />
  );
}
