import { useMemo, useState, useEffect } from "react";
import { getImage } from "../utils/roomImages";
import api from "../services/api";

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
function ApplePayLogo({ size = 38 }) {
  return (
    <svg height={size} viewBox="0 0 165 105" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="165" height="105" rx="10" fill="black"/>
      {/* Apple icon */}
      <path d="M72.5 32.8c1.8-2.3 3-5.4 2.7-8.5-2.6.1-5.8 1.7-7.6 4-1.7 1.9-3.1 5.1-2.7 8.1 2.8.2 5.8-1.4 7.6-3.6z" fill="white"/>
      <path d="M75.1 37.2c-4.2-.2-7.8 2.4-9.8 2.4-2 0-5.1-2.2-8.5-2.2-4.4.1-8.4 2.6-10.7 6.5-4.5 7.9-1.2 19.5 3.2 25.9 2.1 3.1 4.7 6.6 8 6.5 3.2-.1 4.4-2.1 8.3-2.1 3.9 0 5 2.1 8.4 2 3.5-.1 5.7-3.2 7.8-6.3 2.5-3.6 3.5-7.1 3.5-7.3-.1 0-6.7-2.6-6.7-10.3-.1-6.5 5.3-9.6 5.5-9.8-3-4.4-7.7-4.8-9-4.9l-.3-.4z" fill="white"/>
      {/* "Pay" text */}
      <text x="92" y="68" fontFamily="system-ui,-apple-system,sans-serif" fontWeight="600" fontSize="30" fill="white">Pay</text>
    </svg>
  );
}

function PayPalLogo({ size = 38 }) {
  return (
    <svg height={size} viewBox="0 0 165 105" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="165" height="105" rx="10" fill="white" stroke="#e0e0e0" strokeWidth="1.5"/>
      {/* PayPal P shapes */}
      <path d="M55 28h14c7 0 11 3.5 10 10-1.2 8-7 12-14 12H59l-2 12H47L55 28z" fill="#003087"/>
      <path d="M62 34h8c4 0 6 2 5.5 5.5C75 44 71 47 66 47h-6l1.5-8.5L62 34z" fill="#003087"/>
      <path d="M70 35h14c7 0 11 3.5 10 10-1.2 8-7 12-14 12H74l-2 12H62L70 35z" fill="#009cde"/>
      <path d="M77 41h8c4 0 6 2 5.5 5.5C90 51 86 54 81 54h-6l1.5-8.5L77 41z" fill="#009cde"/>
      {/* "PayPal" text */}
      <text x="50" y="84" fontFamily="system-ui,-apple-system,sans-serif" fontWeight="700" fontSize="16" fill="#003087">Pay</text>
      <text x="77" y="84" fontFamily="system-ui,-apple-system,sans-serif" fontWeight="700" fontSize="16" fill="#009cde">Pal</text>
    </svg>
  );
}

function CardIcon({ active }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
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

  async function handlePay(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/bookings/create", {
        ...bookingData,
        paymentMethod: payTab === "card" ? "card" : payTab === "apple" ? "apple_pay" : "paypal",
      });
      onSuccess(res.data.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong. Please try again.");
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
            <span className="pp-lock">🔒</span>
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
                <p className="pp-room-name">{room.title}</p>
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
              <span>Card</span>
            </button>
            <button
              type="button"
              className={`pp-tab${payTab === "apple" ? " pp-tab--active" : ""}`}
              onClick={() => setPayTab("apple")}
            >
              <ApplePayLogo size={32} />
              <span>Apple Pay</span>
            </button>
            <button
              type="button"
              className={`pp-tab${payTab === "paypal" ? " pp-tab--active" : ""}`}
              onClick={() => setPayTab("paypal")}
            >
              <PayPalLogo size={32} />
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
              <div className="pp-wallet-logo"><ApplePayLogo size={64} /></div>
              <p className="pp-wallet-desc">
                You&rsquo;ll be charged <strong>${total.toLocaleString()}</strong> via Apple Pay.
              </p>
              <p className="pp-demo-note">🔒 Demo only — no real payment is processed.</p>
            </div>
          )}

          {/* ── PayPal ── */}
          {payTab === "paypal" && (
            <div className="pp-wallet-screen">
              <div className="pp-wallet-logo"><PayPalLogo size={64} /></div>
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
              <p className="pp-demo-note">🔒 Demo only — no real payment is processed.</p>
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
        <div className="ck-conf-row"><span>Room</span><span>{room?.title || booking.room?.title}</span></div>
        <div className="ck-conf-row"><span>Guest</span><span>{booking.firstName} {booking.lastName}</span></div>
        <div className="ck-conf-row"><span>Check-in</span><span>{fmt(checkIn)}</span></div>
        <div className="ck-conf-row"><span>Check-out</span><span>{fmt(checkOut)}</span></div>
        <div className="ck-conf-row"><span>Duration</span><span>{nights} night{nights !== 1 ? "s" : ""}</span></div>
        <div className="ck-conf-row"><span>Guests</span>
          <span>{booking.adults} adult{booking.adults !== 1 ? "s" : ""}
            {booking.children > 0 ? `, ${booking.children} child${booking.children !== 1 ? "ren" : ""}` : ""}
          </span>
        </div>
        <div className="ck-conf-divider" />
        <div className="ck-conf-row ck-conf-total"><span>Total Paid</span><span>${booking.totalPrice.toLocaleString()}</span></div>
      </div>
      <p className="ck-confirm-email">A confirmation has been sent to <strong>{booking.email}</strong></p>
    </div>
  );
}

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

  // UI
  const [availError,  setAvailError]  = useState("");
  const [submitError, setSubmitError] = useState("");

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const diff = Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000);
    return diff > 0 ? diff : 0;
  }, [checkIn, checkOut]);

  const total = room && nights > 0 ? room.price * nights : 0;

  // Live availability check
  useEffect(() => {
    setAvailError("");
    if (!checkIn || !checkOut || !room?._id || nights <= 0) return;
    const t = setTimeout(async () => {
      try {
        const res = await api.get("/bookings/availability", {
          params: { roomId: room._id, checkIn, checkOut },
        });
        if (!res.data.available)
          setAvailError("These dates are already booked. Please choose different dates.");
      } catch { /* silent */ }
    }, 600);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkIn, checkOut, room?._id, nights]); // setAvailError is a stable setter - intentionally omitted

  function handleBookingSubmit(e) {
    e.preventDefault();
    if (availError) return;
    setSubmitError("");
    setPendingBookingData({
      roomId: room._id, checkIn, checkOut,
      adults, children, firstName, lastName,
      email, phone: `${phoneCode} ${phone}`,
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
            {availError && <div className="ck-error-msg">{availError}</div>}
          </section>

          {/* Guests */}
          <section className="ck-section">
            <h2 className="ck-section-title">Number of Guests</h2>
            <GuestCounter label="Adults"   value={adults}   onChange={setAdults}   min={1} max={6} />
            <GuestCounter label="Children" value={children} onChange={setChildren} min={0} max={4} />
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
                  onChange={e => setPhone(e.target.value)}
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
          <div className="ck-coupon-row">
            <input type="text" placeholder="Use Coupon Code" className="ck-coupon-input" />
          </div>
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
          <button type="submit" className="ck-confirm-btn" disabled={!!availError || !checkIn || !checkOut}>
            {`CONFIRM & PAY${total > 0 ? ` $${total.toLocaleString()}` : ""}`}
          </button>
        </div>


        {/* Hotel Summary Card */}
        {room && (
          <div className="ck-sidebar-card ck-room-card">
            <img src={getImage(room.images?.[0])} alt={room.title} className="ck-room-img" />
            <h3 className="ck-sidebar-heading" style={{ marginTop: 16 }}>Hotel Summary Card</h3>
            <div className="ck-summary-rows">
              <div className="ck-summary-row"><span>🏨 Room Type</span><span>{room.title.replace("Bungalows ", "")}</span></div>
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
              {room.view && <div className="ck-summary-row"><span>🪟 View</span><span>{room.view}</span></div>}
            </div>
          </div>
        )}

        </div> {/* end .ck-right-col */}

      </form>
    </>
  );
}

export default BookingForm;