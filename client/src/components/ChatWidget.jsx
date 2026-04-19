import { useState, useEffect, useRef } from "react";
import "./ChatWidget.css";
import lovenderWhite from "../assets/lovenderWhite.png";
import lovenderBlack from "../assets/LovenderCrop.jpg";

const QUICK_REPLIES = ["Our rooms", "Pricing", "Book a stay", "Packages"];
const WELCOME_MSG =
  "Welcome to Lovender. I am Lova, your personal island assistant. How may I assist you today?";
const WELCOME_DELAY = 1800;
const CLOSE_DELAY = 220;

function getTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
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

  const [chatHistory, setChatHistory] = useState([]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const closeTimerRef = useRef(null);
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

      if (welcomeTimerRef.current) clearTimeout(welcomeTimerRef.current);

      welcomeTimerRef.current = setTimeout(() => {
        setIsTyping(false);
        setMessages([{ from: "bot", text: WELCOME_MSG, time: getTime() }]);
        setQuickReplies(QUICK_REPLIES);
      }, WELCOME_DELAY);
    }
  }

  function closeWidget() {
    setClosing(true);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, CLOSE_DELAY);
  }

  async function sendMessage(text) {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    const userMsg = { from: "user", text: trimmedText, time: getTime() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setQuickReplies([]);
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmedText,
          history: chatHistory,
        }),
      });

      const data = await res.json();
      const reply = data.reply || "I'm sorry, I couldn't get a response. Please try again.";

      setChatHistory((prev) => [
        ...prev,
        { role: "user", content: trimmedText },
        { role: "assistant", content: reply },
      ]);

      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: reply, time: getTime() },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "I'm having trouble connecting right now. Please try again in a moment.",
          time: getTime(),
        },
      ]);
    }
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