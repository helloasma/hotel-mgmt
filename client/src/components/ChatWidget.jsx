import { useState, useEffect, useRef } from "react";
import "./ChatWidget.css";
import lovenderWhite from "../assets/lovenderWhite.png";
import lovenderBlack from "../assets/LovenderCrop.jpg";

/* ── Bot responses map ── */
const BOT_RESPONSES = {
  rooms:
    "We offer 8 unique stays — from our Overwater Bungalow Suites to the Sunset Honeymoon Retreat. Would you like me to help you find the perfect room?",
  book:
    "To make a reservation, head to our Rooms page and select your preferred suite. You can also visit the Booking page directly. Shall I guide you there?",
  booking:
    "To make a reservation, head to our Rooms page and select your preferred suite. You can also visit the Booking page directly. Shall I guide you there?",
  price:
    "Our rooms range from $180/night for the Classic Standard Room up to $720/night for the Overwater Bungalow Suite. Every stay includes ocean access and breakfast.",
  prices:
    "Our rooms range from $180/night for the Classic Standard Room up to $720/night for the Overwater Bungalow Suite. Every stay includes ocean access and breakfast.",
  packages:
    "Lovender offers curated packages including our Honeymoon Escape, Family Island Retreat, and the Full Lavender Experience. Visit the Packages page for details.",
  location:
    "Lovender is nestled on a private heart-shaped island surrounded by lavender fields and crystal-blue waters. We are accessible by private ferry or helicopter.",
  contact:
    "You can reach our concierge team through the Contact page. We are available 24/7 to assist with any enquiry.",
  checkin:
    "Check-in is from 3:00 PM and check-out is by 11:00 AM. Early arrivals and late departures can be arranged upon request.",
  "check-in":
    "Check-in is from 3:00 PM and check-out is by 11:00 AM. Early arrivals and late departures can be arranged upon request.",
  checkout:
    "Check-in is from 3:00 PM and check-out is by 11:00 AM. Early arrivals and late departures can be arranged upon request.",
  breakfast:
    "All stays at Lovender include a complimentary island breakfast served on your private terrace each morning.",
  wifi:
    "High-speed Wi-Fi is available throughout the resort, including all rooms and outdoor terraces.",
  pool:
    "Lovender features three infinity pools overlooking the ocean, open from sunrise to midnight.",
  spa:
    "Our Lavender Spa offers signature treatments including the Sea Stone Ritual and the Lavender Dream massage. Bookable upon arrival.",
  default:
    "I am Lova. I can help with room enquiries, bookings, pricing, packages, and resort information. What would you like to know?",
};

const QUICK_REPLIES = ["Our rooms", "Pricing", "Book a stay", "Packages"];
const WELCOME_MSG =
  "Welcome to Lovender. I am Lova, your personal island assistant. How may I assist you today?";
const BOT_REPLY_DELAY = 1200;
const WELCOME_DELAY = 1800;
const CLOSE_DELAY = 220;

function getTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getBotReply(text) {
  const lower = text.toLowerCase();

  for (const key of Object.keys(BOT_RESPONSES)) {
    if (lower.includes(key)) return BOT_RESPONSES[key];
  }

  return BOT_RESPONSES.default;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showUnread, setShowUnread] = useState(true);
  const [quickReplies, setQuickReplies] = useState([]);
  const [hasOpened, setHasOpened] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const closeTimerRef = useRef(null);
  const replyTimerRef = useRef(null);
  const welcomeTimerRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      if (replyTimerRef.current) clearTimeout(replyTimerRef.current);
      if (welcomeTimerRef.current) clearTimeout(welcomeTimerRef.current);
    };
  }, []);

  function openWidget() {
    setClosing(false);
    setIsOpen(true);

    if (!hasOpened) {
      setHasOpened(true);
      setShowUnread(false);
      setIsTyping(true);

      if (welcomeTimerRef.current) {
        clearTimeout(welcomeTimerRef.current);
      }

      welcomeTimerRef.current = setTimeout(() => {
        setIsTyping(false);
        setMessages([{ from: "bot", text: WELCOME_MSG, time: getTime() }]);
        setQuickReplies(QUICK_REPLIES);
      }, WELCOME_DELAY);
    }
  }

  function closeWidget() {
    setClosing(true);

    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }

    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, CLOSE_DELAY);
  }

  function sendMessage(text) {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    const userMsg = {
      from: "user",
      text: trimmedText,
      time: getTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setQuickReplies([]);
    setIsTyping(true);

    if (replyTimerRef.current) {
      clearTimeout(replyTimerRef.current);
    }

    replyTimerRef.current = setTimeout(() => {
      const reply = getBotReply(trimmedText);

      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: reply, time: getTime() },
      ]);
    }, BOT_REPLY_DELAY);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <>
      {isOpen && (
        <div className={`chat-widget${closing ? " chat-widget--closing" : ""}`}>
          <div className="chat-header">
            <div className="chat-header__avatar">
              <img
                src={lovenderBlack}
                alt="Lovender"
                className="chat-header__logo"
              />
            </div>

            <div className="chat-header__info">
              <p className="chat-header__name">Lova</p>
              <span className="chat-header__status">
                <span className="chat-header__dot" />
                Available now
              </span>
            </div>

            <span className="chat-header__decor">Lovender</span>
          </div>

          <div className="chat-messages">
            {isTyping && messages.length === 0 && (
              <div className="chat-typing">
                <span className="chat-typing__dot" />
                <span className="chat-typing__dot" />
                <span className="chat-typing__dot" />
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg chat-msg--${msg.from}`}>
                <div className="chat-msg__bubble">{msg.text}</div>
                <span className="chat-msg__time">{msg.time}</span>
              </div>
            ))}

            {isTyping && messages.length > 0 && (
              <div className="chat-typing">
                <span className="chat-typing__dot" />
                <span className="chat-typing__dot" />
                <span className="chat-typing__dot" />
              </div>
            )}

            {quickReplies.length > 0 && !isTyping && (
              <div className="chat-quick-replies">
                {quickReplies.map((q) => (
                  <button
                    key={q}
                    className="chat-quick-btn"
                    onClick={() => sendMessage(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-area">
            <input
              ref={inputRef}
              className="chat-input"
              placeholder="Ask Lova anything…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            <button className="chat-send-btn" onClick={() => sendMessage(input)}>
              <svg
                viewBox="0 0 24 24"
                width="16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="#ffffff"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      <button
        className={`chat-toggle${isOpen ? " chat-toggle--open" : ""}`}
        onClick={isOpen ? closeWidget : openWidget}
        aria-label="Toggle chat"
      >
        {showUnread && !isOpen && <span className="chat-unread" />}

        <img
          src={lovenderWhite}
          alt="Open chat"
          className="chat-toggle__logo"
          style={{
            opacity: isOpen ? 0 : 1,
            transform: isOpen ? "scale(0.6) rotate(20deg)" : "none",
          }}
        />

        <svg
          className="chat-toggle__icon chat-toggle__icon--close"
          style={{
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? "none" : "scale(0.6) rotate(-20deg)",
          }}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18 6L6 18M6 6l12 12"
            stroke="#ffffff"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </>
  );
}