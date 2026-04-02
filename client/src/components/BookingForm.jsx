import { useMemo, useState } from "react";

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

function BookingForm({ room }) {
  const today = new Date().toISOString().split("T")[0];
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.round((end.getTime() - start.getTime()) / 86400000);
    return diff > 0 ? diff : 0;
  }, [checkIn, checkOut]);

  const total = room && nights ? room.price * nights : 0;

  function handleSubmit(event) {
    event.preventDefault();
    const roomName = room ? room.title : "selected room";
    setMessage(`Booking confirmed for ${name}. Your stay in ${roomName} has been saved on the frontend.`);
  }

  return (
    <form className="rb-booking-form" onSubmit={handleSubmit}>
      {room && (
        <div className="rb-selected-room-box">
          <img src={room.image} alt={room.title} />
          <div>
            <p className="rb-selected-room-title">{room.title}</p>
            <p className="rb-selected-room-price">${room.price} / night</p>
          </div>
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

      {room && nights > 0 && (
        <div className="rb-summary-box">
          <div>
            <span>
              ${room.price} × {nights} night{nights > 1 ? "s" : ""}
            </span>
            <strong>${total}</strong>
          </div>
          <small>Total shown for frontend preview only.</small>
        </div>
      )}

      <button type="submit" className="rb-primary-button rb-full-width">
        Book Now
      </button>

      {message.startsWith("Booking confirmed") && (
        <div className="rb-success-box">{message}</div>
      )}
    </form>
  );
}

export default BookingForm;