import { useMemo, useState, useEffect } from "react";
import { getImage } from "../routes/utils/roomImages";
import api from "../services/api";
import applePayImg from "../assets/apple.png";
import paypalImg from "../assets/paypal.png";
import lockImg from "../assets/lock.png";

// ─────────────────────────────────────────────────────────────
// Guest Counter
// ─────────────────────────────────────────────────────────────
function GuestCounter({ label, value, onChange, min = 0, max = 10 }) {
  return (
    <div className="ck-guest-row">
      <span className="ck-guest-label">{label}</span>
      <div className="ck-guest-controls">
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min}>−</button>
        <span>{value}</span>
        <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max}>+</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SVG Logos
// ─────────────────────────────────────────────────────────────
function CardIcon({ active }) {
  return (
    <svg className="pp-tab-logo" viewBox="0 0 28 28" fill="none" style={{ width: "auto" }}>
      <rect x="2" y="6" width="24" height="16" rx="3" stroke={active ? "#1677ff" : "#888"} strokeWidth="2" fill="none"/>
      <rect x="2" y="11" width="24" height="4" fill={active ? "#1677ff" : "#888"} opacity=".25"/>
      <rect x="5" y="17" width="6" height="2" rx="1" fill={active ? "#1677ff" : "#888"}/>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Payment Page (shown after booking details submitted)
// ─────────────────────────────────────────────────────────────
function PaymentPage({ total, bookingData, room, onSuccess, onBack }) {
  const [payTab,     setPayTab]     = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv,    setCardCvv]    = useState("");
  const [billing,    setBilling]    = useState(true);
  const [paypalEmail, setPaypalEmail] = useState("");
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");

  function formatCardNumber(v) {
    return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  }
  function formatExpiry(v) {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length >= 3 ? d.slice(0, 2) + "/" + d.slice(2) : d;
  }

  function buildMockBooking(paymentMethod) {
    const code = "BK-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    return { confirmationCode: code, ...bookingData, paymentMethod, totalPrice: total, status: "confirmed" };
  }

  async function handlePay(e) {
    e.preventDefault();
    setError("");

    if (payTab === "card") {
      const digits = cardNumber.replace(/\s/g, "");
      if (!digits || !/^\d+$/.test(digits)) {
        setError("Please enter a valid card number.");
        return;
      }
      const expiryParts = cardExpiry.split("/");
      const expMonth = parseInt(expiryParts[0], 10);
      const expYear = 2000 + parseInt(expiryParts[1] ?? "", 10);
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      if (expiryParts.length !== 2 || isNaN(expMonth) || isNaN(expYear) || expMonth < 1 || expMonth > 12) {
        setError("Please enter a valid expiry date (MM/YY).");
        return;
      }
      if (expYear < currentYear || (expYear === currentYear && expMonth <= currentMonth)) {
        setError("Your card has expired. Please use a card with a future expiry date.");
        return;
      }
    }

    if (payTab === "paypal") {
      if (!paypalEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paypalEmail)) {
        setError("Please enter a valid PayPal email address.");
        return;
      }
    }

    setLoading(true);
    const paymentMethod = payTab === "card" ? "card" : payTab === "apple" ? "apple_pay" : "paypal";
    try {
      const res = await api.post("/bookings/create", { ...bookingData, paymentMethod });
      onSuccess(res.data.data);
    } catch {
      onSuccess(buildMockBooking(paymentMethod));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pp-overlay">
      <div className="pp-modal">

        {/* Header */}
        <div className="pp-header">
          <button type="button" className="pp-back" onClick={onBack}>← Back</button>
          <div className="pp-header-center">
            <img src={lockImg} alt="" className="pp-lock-img" />
            <span className="pp-header-title">Secure Payment</span>
          </div>
          <div className="pp-amount-badge">${total.toLocaleString()}</div>
        </div>

        <form className="pp-body" onSubmit={handlePay}>

          {/* Room summary strip */}
          {room && (
            <div className="pp-room-strip">
              <img src={getImage(room.images?.[0])} alt={room.title} className="pp-room-thumb" />
              <div>
                <p className="pp-room-name">{getBookingDisplayName(room)}</p>
                <p className="pp-room-sub">
                  {bookingData.adults} guest{bookingData.adults !== 1 ? "s" : ""}
                  {bookingData.children > 0 ? ` · ${bookingData.children} child${bookingData.children !== 1 ? "ren" : ""}` : ""}
                  {" · "}
                  {new Date(bookingData.checkIn).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  {" – "}
                  {new Date(bookingData.checkOut).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
              <span className="pp-room-price">${total.toLocaleString()}</span>
            </div>
          )}

          {/* Payment tabs */}
          <div className="pp-tabs">
            <button
              type="button"
              className={`pp-tab${payTab === "card" ? " pp-tab--active" : ""}`}
              onClick={() => setPayTab("card")}
            >
              <CardIcon active={payTab === "card"} />
              <span>Credit Card</span>
            </button>
            <button
              type="button"
              className={`pp-tab${payTab === "apple" ? " pp-tab--active" : ""}`}
              onClick={() => setPayTab("apple")}
            >
              <img src={applePayImg} alt="" className="pp-tab-logo" />
              <span>Apple Pay</span>
            </button>
            <button
              type="button"
              className={`pp-tab${payTab === "paypal" ? " pp-tab--active" : ""}`}
              onClick={() => setPayTab("paypal")}
            >
              <img src={paypalImg} alt="" className="pp-tab-logo" />
              <span>PayPal</span>
            </button>
          </div>

          {/* ── Card fields ── */}
          {payTab === "card" && (
            <div className="pp-fields">
              <div className="pp-field">
                <label>Card number</label>
                <div className="pp-card-wrap">
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={19}
                    required
                  />
                  <span className="pp-card-brands">
                    <span className="pp-visa">VISA</span>
                    <span className="pp-mc-wrap">
                      <span className="pp-mc-o pp-mc-r">●</span><span className="pp-mc-o pp-mc-y">●</span>
                    </span>
                    <span className="pp-stripe">stripe</span>
                  </span>
                </div>
              </div>
              <div className="pp-two-col">
                <div className="pp-field">
                  <label>Expiry</label>
                  <input
                    type="text"
                    placeholder="MM / YY"
                    value={cardExpiry}
                    onChange={e => setCardExpiry(formatExpiry(e.target.value))}
                    maxLength={5}
                    required
                  />
                </div>
                <div className="pp-field">
                  <label>CVC</label>
                  <div className="pp-cvc-wrap">
                    <input
                      type="text"
                      placeholder="CVC"
                      value={cardCvv}
                      onChange={e => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      maxLength={4}
                      required
                    />
                    <span className="pp-cvc-icon">⊡</span>
                  </div>
                </div>
              </div>
              <label className="pp-checkbox-row">
                <input type="checkbox" checked={billing} onChange={e => setBilling(e.target.checked)} />
                <span>Billing is same as booking information</span>
              </label>
              <p className="pp-legal">
                By providing your card information, you confirm this is a demo booking and no real payment will be charged.
              </p>
            </div>
          )}

          {/* ── Apple Pay ── */}
          {payTab === "apple" && (
            <div className="pp-wallet-screen">
              <img src={applePayImg} alt="Apple Pay" className="pp-wallet-logo-img" />
              <p className="pp-wallet-desc">
                You&rsquo;ll be charged <strong>${total.toLocaleString()}</strong> via Apple Pay.
              </p>
              <p className="pp-demo-note">Demo only — no real payment is processed.</p>
            </div>
          )}

          {/* ── PayPal ── */}
          {payTab === "paypal" && (
            <div className="pp-wallet-screen">
              <img src={paypalImg} alt="PayPal" className="pp-wallet-logo-img" />
              <div className="pp-field" style={{ width: "100%", maxWidth: 340 }}>
                <label>PayPal Email</label>
                <input
                  type="email"
                  placeholder="your-paypal@email.com"
                  value={paypalEmail}
                  onChange={e => setPaypalEmail(e.target.value)}
                />
              </div>
              <p className="pp-wallet-desc">
                You&rsquo;ll be redirected to PayPal to pay <strong>${total.toLocaleString()}</strong>.
              </p>
              <p className="pp-demo-note">Demo only — no real payment is processed.</p>
            </div>
          )}

          {error && <div className="pp-error">{error}</div>}

          {/* Actions */}
          <div className="pp-actions">
            <button type="button" className="pp-btn-cancel" onClick={onBack}>Cancel</button>
            <button type="submit" className="pp-btn-pay" disabled={loading}>
              {loading ? "Processing…" : `Pay $${total.toLocaleString()}`}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Confirmation Screen
// ─────────────────────────────────────────────────────────────
function ConfirmationScreen({ booking, room }) {
  const checkIn  = new Date(booking.checkIn);
  const checkOut = new Date(booking.checkOut);
  const nights   = Math.round((checkOut - checkIn) / 86400000);
  const fmt      = d => d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="ck-confirmation">
      <div className="ck-confirm-icon">✓</div>
      <h2>Booking Confirmed!</h2>
      <p className="ck-confirm-sub">Your reservation is all set. See you soon!</p>
      <div className="ck-confirm-code">
        Confirmation Code: <strong>{booking.confirmationCode}</strong>
      </div>
      <div className="ck-confirm-details">
        <div className="ck-conf-row"><span>Room</span><span>{getBookingDisplayName(room)}</span></div>
        <div className="ck-conf-row"><span>Guest</span><span>{booking.firstName} {booking.lastName}</span></div>
        <div className="ck-conf-row"><span>Check-in</span><span>{fmt(checkIn)}</span></div>
        <div className="ck-conf-row"><span>Check-out</span><span>{fmt(checkOut)}</span></div>
        <div className="ck-conf-row"><span>Duration</span><span>{nights} night{nights !== 1 ? "s" : ""}</span></div>
        <div className="ck-conf-row"><span>Guests</span>
          <span>{booking.adults} adult{booking.adults !== 1 ? "s" : ""}
            {booking.children > 0 ? `, ${booking.children} child${booking.children !== 1 ? "ren" : ""}` : ""}
          </span>
        </div>
        <div className="ck-conf-row"><span>Payment Method</span><span className="ck-payment-method">{booking.paymentMethod === "apple_pay" ? "Apple Pay" : booking.paymentMethod === "paypal" ? "PayPal" : "Card"}</span></div>
        <div className="ck-conf-divider" />
        <div className="ck-conf-row ck-conf-total"><span>Total Paid</span><span>${booking.totalPrice.toLocaleString()}</span></div>
      </div>
      <p className="ck-confirm-email">A confirmation email has been sent to <strong>{booking.email}</strong></p>
      <div className="ck-confirm-actions">
        <a href="/Account" className="ck-confirm-btn-secondary">
          View My Bookings
        </a>
        <a href="/Rooms" className="ck-confirm-btn-primary">
          Book Another Room
        </a>
      </div>
    </div>
  );
}

const bookingDisplayNames = { "honeymoon": "Honeymoon Retreat" };
const getBookingDisplayName = (room) => bookingDisplayNames[room?.type] ?? room?.title ?? "";

// ─────────────────────────────────────────────────────────────
// Main BookingForm
// ─────────────────────────────────────────────────────────────
function BookingForm({ room }) {
  const today = new Date().toISOString().split("T")[0];

  // Steps: "booking" → "payment" → "confirmed"
  const [step,             setStep]             = useState("booking");
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [pendingBookingData, setPendingBookingData] = useState(null);

  // Dates & guests
  const [checkIn,  setCheckIn]  = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults,   setAdults]   = useState(2);
  const [children, setChildren] = useState(0);

  // Guest info
  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [email,     setEmail]     = useState("");
  const [phone,     setPhone]     = useState("");
  const [phoneCode, setPhoneCode] = useState("+1");
  const [alerts,    setAlerts]    = useState(false);

  // Special request
  const [specialRequest, setSpecialRequest] = useState("");

  // UI
  const [availError,  setAvailError]  = useState("");
  const [submitError, setSubmitError] = useState("");

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const diff = Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000);
    return diff > 0 ? diff : 0;
  }, [checkIn, checkOut]);

  const nightsError = useMemo(() => {
    if (nights === 0) return "";
    if (nights < 2) return "Minimum stay is 2 nights.";
    if (nights > 7) return "Maximum stay is 7 nights.";
    return "";
  }, [nights]);

  const total = room && nights > 0 ? room.price * nights : 0;

  const maxAdults   = room ? Math.max(1, room.capacity - children) : 6;
  const maxChildren = room ? Math.max(0, room.capacity - adults)   : 4;
  const capacityError = room && adults + children > room.capacity
    ? `This room fits a maximum of ${room.capacity} guest${room.capacity !== 1 ? "s" : ""}.`
    : "";

  // Live availability check
  useEffect(() => {
    const t = setTimeout(async () => {
      if (!checkIn || !checkOut || !room?._id || nights <= 0) {
        setAvailError("");
        return;
      }
      try {
        const res = await api.get("/bookings/availability", {
          params: { roomId: room._id, checkIn, checkOut },
        });
        setAvailError(res.data.available ? "" : "Please select another date. This room is fully booked for the selected dates.");
      } catch { /* silent */ }
    }, 600);
    return () => clearTimeout(t);
  }, [checkIn, checkOut, room?._id, nights]);

  function handleBookingSubmit(e) {
    e.preventDefault();
    if (availError || nightsError) return;
    setSubmitError("");
    setPendingBookingData({
      roomId: room._id, checkIn, checkOut,
      adults, children, firstName, lastName,
      email, phone: `${phoneCode} ${phone}`,
      specialRequest: specialRequest || null,
    });
    setStep("payment");
  }

  function handlePaymentSuccess(booking) {
    setConfirmedBooking(booking);
    setStep("confirmed");
  }

  if (step === "confirmed") {
    return <ConfirmationScreen booking={confirmedBooking} room={room} />;
  }

  return (
    <>
      {/* Payment overlay (portal-style, rendered on top) */}
      {step === "payment" && (
        <PaymentPage
          total={total}
          bookingData={pendingBookingData}
          room={room}
          onSuccess={handlePaymentSuccess}
          onBack={() => setStep("booking")}
        />
      )}

      {/* ── Two-column booking form — flat grid for precise row alignment ── */}
      <form className="ck-form" onSubmit={handleBookingSubmit}>

        {/* ── LEFT COLUMN ── */}
        <div className="ck-left-col">

          {/* Dates */}
          <section className="ck-section">
            <h2 className="ck-section-title">Select Your Dates</h2>
            <div className="ck-two-col">
              <div className="ck-field">
                <label>Check-in <span className="ck-req">*</span></label>
                <input type="date" min={today} value={checkIn}
                  onChange={e => setCheckIn(e.target.value)} required />
              </div>
              <div className="ck-field">
                <label>Check-out <span className="ck-req">*</span></label>
                <input type="date" min={checkIn || today} value={checkOut}
                  onChange={e => setCheckOut(e.target.value)} required />
              </div>
            </div>
            <div className="ck-dates-feedback">
              {nightsError && <div className="ck-error-msg">{nightsError}</div>}
              {!nightsError && availError && <div className="ck-error-msg">{availError}</div>}
              {!nightsError && !availError && nights === 0 && (
                <p className="ck-stay-hint">Stay must be between 2 and 7 nights.</p>
              )}
            </div>
          </section>

          {/* Guests */}
          <section className="ck-section">
            <h2 className="ck-section-title">Number of Guests</h2>
            <GuestCounter label="Adults"   value={adults}   onChange={setAdults}   min={1} max={maxAdults} />
            <GuestCounter label="Children" value={children} onChange={setChildren} min={0} max={maxChildren} />
            {capacityError && <div className="ck-error-msg">{capacityError}</div>}
          </section>

          {/* Who's checking in */}
          <section className="ck-section">
            <h2 className="ck-section-title">Who&rsquo;s checking in?</h2>
            <div className="ck-two-col">
              <div className="ck-field">
                <label>First Name <span className="ck-req">*</span></label>
                <input type="text" placeholder="Enter your first name"
                  value={firstName} onChange={e => setFirstName(e.target.value)} required />
              </div>
              <div className="ck-field">
                <label>Last Name <span className="ck-req">*</span></label>
                <input type="text" placeholder="Enter your last name"
                  value={lastName} onChange={e => setLastName(e.target.value)} required />
              </div>
            </div>
            <div className="ck-field">
              <label>Email <span className="ck-req">*</span></label>
              <input type="email" placeholder="Enter your email"
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="ck-field">
              <label>Mobile Number</label>
              <div className="ck-phone-row">
                <select className="ck-phone-code" value={phoneCode} onChange={e => setPhoneCode(e.target.value)}>
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                  <option value="+971">+971</option>
                  <option value="+62">+62</option>
                  <option value="+91">+91</option>
                  <option value="+61">+61</option>
                </select>
                <input
                  type="tel"
                  className="ck-phone-input"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, ""))}
                />
              </div>
            </div>
            <label className="ck-checkbox-row">
              <input type="checkbox" checked={alerts} onChange={e => setAlerts(e.target.checked)} />
              <span>Receive text alerts about this trip</span>
            </label>
          </section>

        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="ck-right-col">

        {/* Price Details */}
        <div className="ck-sidebar-card ck-price-card">
          <h3 className="ck-sidebar-heading">Price Details</h3>
<div className="ck-price-rows">
            <div className="ck-price-row">
              <span>
                1 Room × {nights > 0 ? nights : "—"} Night{nights !== 1 ? "s" : ""}
                {room && nights > 0 && <span className="ck-per-night">${room.price.toLocaleString()} / Night</span>}
              </span>
              <span>{total > 0 ? `$${total.toLocaleString()}` : "—"}</span>
            </div>
            <div className="ck-price-row">
              <span>Tax and fees</span>
              <span>{nights > 0 ? "$0" : "—"}</span>
            </div>
          </div>
          <div className="ck-price-divider" />
          <div className="ck-price-total-row">
            <span>Total Prices</span>
            <span>{total > 0 ? `$${total.toLocaleString()}` : "—"}</span>
          </div>
          {nights === 0 && <p className="ck-date-hint">Select dates to see your total.</p>}
          <p className="ck-terms">
            By clicking the button below, I confirm that I have read and understood the Privacy Policy and User Agreement.
          </p>
          {submitError && <div className="ck-error-msg">{submitError}</div>}
          <button type="submit" className="ck-confirm-btn" disabled={!!availError || !!nightsError || !!capacityError || !checkIn || !checkOut}>
            {`CONFIRM & PAY${total > 0 ? ` $${total.toLocaleString()}` : ""}`}
          </button>
        </div>


        {/* Special Request */}
        <div className="ck-sidebar-card ck-sr-card">
          <div className="ck-sr-header">
            <h3 className="ck-sidebar-heading" style={{ margin: 0 }}>Special Request</h3>
            <span className="ck-sr-badge">Optional</span>
          </div>
          <div className="ck-sr-scroll">
            {["Early check-in", "Late check-out"].map(opt => (
              <button
                key={opt}
                type="button"
                className={`ck-sr-option${specialRequest === opt ? " ck-sr-option--active" : ""}`}
                onClick={() => setSpecialRequest(prev => prev === opt ? "" : opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Hotel Summary Card */}
        {room && (
          <div className="ck-sidebar-card ck-room-card">
            <img src={getImage(room.images?.[0])} alt={room.title} className="ck-room-img" />
            <h3 className="ck-sidebar-heading" style={{ marginTop: 16 }}>Hotel Summary Card</h3>
            <div className="ck-summary-rows">
              <div className="ck-summary-row"><span>🏨 Room Type</span><span>{getBookingDisplayName(room)}</span></div>
              <div className="ck-summary-row"><span>🛏 Bed</span><span>{room.bed || "King Bed"}</span></div>
              <div className="ck-summary-row"><span>👤 Guests</span>
                <span>{adults} Adult{adults !== 1 ? "s" : ""}{children > 0 ? `, ${children} Child${children !== 1 ? "ren" : ""}` : ""}</span>
              </div>
              <div className="ck-summary-row">
                <span>📅 Check in / Out</span>
                <span>
                  {checkIn && checkOut
                    ? `${new Date(checkIn).toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${new Date(checkOut).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                    : "—"}
                </span>
              </div>
              <div className="ck-summary-row">
                <span>🕐 Duration</span>
                <span>{nights > 0 ? `${nights} Night${nights !== 1 ? "s" : ""}` : "—"}</span>
              </div>
            </div>
          </div>
        )}

        </div> {/* end .ck-right-col */}

      </form>

      {/* ── Booking Policy ── */}
      <div className="ck-policy-section">
        <h2 className="ck-policy-title">Booking Policy</h2>
        <p className="ck-policy-text">
          Bookings must be for at least 2 nights and cannot be longer than 1 week. By proceeding with your reservation, you confirm that you have read and understood our Privacy Policy and User Agreement.
        </p>
        <div className="ck-policy-details">
          <p className="ck-policy-detail-item">
            <strong>Privacy & Data Protection:</strong> Your guest information is collected solely to manage your reservation. Contact details may be used to send confirmations and updates. Payment information is processed through secure, encrypted channels and is never stored on our servers. Your personal details will never be sold or shared with third parties.
          </p>
          <p className="ck-policy-detail-item">
            <strong>Guest Responsibilities:</strong> You are responsible for providing accurate booking information. All reservations are subject to room availability and confirmed only upon receiving a booking reference. You agree to comply with our duration policy and that any cancellations, date changes, or early departures are subject to our current cancellation policy.
          </p>
        </div>
      </div>
    </>
  );
}

export default BookingForm;