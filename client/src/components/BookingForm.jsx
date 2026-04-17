import { useMemo, useState, useEffect, useRef } from "react";
import { getImage } from "../utils/roomImages";

function GuestCounter({ label, value, onChange, min = 0, max = 10 }) {
  return (
    <div className="rb-guest-row">
      <span>{label}</span>
      <div className="rb-guest-controls">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
        >
          −
        </button>
        <span>{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
        >
          +
        </button>
      </div>
    </div>
  );
}

function BookingForm({ room, allRooms = [], onRoomChange }) {
  const today = new Date().toISOString().split("T")[0];
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const switcherRef = useRef(null);

  const otherRooms = allRooms.filter((r) => r._id !== room?._id);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (switcherRef.current && !switcherRef.current.contains(e.target)) {
        setSwitcherOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.round((end.getTime() - start.getTime()) / 86400000);
    return diff > 0 ? diff : 0;
  }, [checkIn, checkOut]);

  function handleSubmit(event) {
    event.preventDefault();
    const roomName = room ? room.title : "selected room";
    setMessage(`Booking confirmed for ${name}. Your stay in ${roomName} has been saved on the frontend.`);
  }

  function handleRoomSwitch(newRoom) {
    setSwitcherOpen(false);
    if (onRoomChange) onRoomChange(newRoom);
  }

  return (
    <form className="rb-booking-form" onSubmit={handleSubmit}>
      {room && (
        <div className="rb-room-switcher" ref={switcherRef}>
          {/* Summary card — clickable */}
          <div
            className="rb-selected-room-box rb-selected-room-box--clickable"
            onClick={() => setSwitcherOpen((o) => !o)}
            role="button"
            aria-expanded={switcherOpen}
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setSwitcherOpen((o) => !o)}
          >
            <img src={getImage(room.images?.[0])} alt={room.title} />
            <div className="rb-selected-room-info">
              <p className="rb-selected-room-title">{room.title}</p>
              <p className="rb-selected-room-price">${room.price} / night</p>
            </div>
            <span className={`rb-switcher-chevron${switcherOpen ? " rb-switcher-chevron--open" : ""}`}>
              ▾
            </span>
          </div>

          {/* Dropdown */}
          {switcherOpen && (
            <div className="rb-switcher-dropdown">
              <p className="rb-switcher-label">Switch room</p>
              {otherRooms.map((r) => (
                <div
                  key={r._id}
                  className="rb-switcher-option"
                  onClick={() => handleRoomSwitch(r)}
                >
                  <img src={getImage(r.images?.[0])} alt={r.title} />
                  <div className="rb-switcher-option-info">
                    <p className="rb-switcher-option-title">{r.title}</p>
                    <p className="rb-switcher-option-price">${r.price} / night</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="rb-form-grid rb-two-col">
        <label>
          <span>Check-in</span>
          <input
            type="date"
            min={today}
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            required
          />
        </label>

        <label>
          <span>Check-out</span>
          <input
            type="date"
            min={checkIn || today}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            required
          />
        </label>
      </div>

      <div className="rb-form-section">
        <p className="rb-section-label">Guests</p>
        <GuestCounter label="Adults" value={adults} onChange={setAdults} min={1} max={6} />
        <GuestCounter label="Children" value={children} onChange={setChildren} min={0} max={4} />
      </div>

      <div className="rb-form-grid">
        <label>
          <span>Full Name</span>
          <input
            type="text"
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label>
          <span>Email</span>
          <input
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          <span>Phone Number</span>
          <input
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </label>
      </div>

      <label>
        <span>Special Request</span>
        <textarea
          placeholder="Airport transfer, anniversary setup, late check-in..."
          rows="4"
          value={message.startsWith("Booking confirmed") ? "" : message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </label>

      <div className="rb-fee-breakdown">
        <p className="rb-section-label">Total Fee</p>
        <div className="rb-fee-rows">
          <div className="rb-fee-row">
            <span>Room rate</span>
            <span>{room ? `$${room.price} / night` : "—"}</span>
          </div>
          <div className="rb-fee-row">
            <span>Nights</span>
            <span>{nights > 0 ? nights : "—"}</span>
          </div>
          <div className="rb-fee-divider" />
          <div className="rb-fee-row rb-fee-total">
            <span>Total</span>
            <span>{nights > 0 && room ? `$${(room.price * nights).toLocaleString()}` : "—"}</span>
          </div>
        </div>
        {nights === 0 && (
          <p className="rb-fee-hint">Select check-in and check-out dates to see your total.</p>
        )}
      </div>

      <button type="submit" className="rb-primary-button rb-full-width">
        Checkout
      </button>

      {message.startsWith("Booking confirmed") && (
        <div className="rb-success-box">{message}</div>
      )}
    </form>
  );
}

export default BookingForm;