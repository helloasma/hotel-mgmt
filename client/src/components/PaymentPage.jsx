import { useState } from "react";
import "./PaymentPage.css";

function formatCardNumber(value) {
  return value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

const PaymentPage = ({ total = 0, onResult, onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardNumberError, setCardNumberError] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [error, setError] = useState("");

  const validateCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, "");
    if (cleaned.length === 0) return "";
    if (!/^\d+$/.test(cleaned)) return "Card number must contain digits only.";
    if (cleaned.length !== 16) return `Card number must be 16 digits (${cleaned.length} entered).`;
    return "";
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (paymentMethod === "card") {
      const cleaned = cardNumber.replace(/\s/g, "");
      if (cleaned.length !== 16 || !/^\d+$/.test(cleaned)) {
        setError("Enter a valid 16-digit card number.");
        return;
      }
      if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        setError("Enter a valid expiry date in MM/YY format.");
        return;
      }
      const [month] = cardExpiry.split("/");
      if (Number(month) < 1 || Number(month) > 12) {
        setError("Enter a valid expiry month between 01 and 12.");
        return;
      }
      if (!/^\d{3,4}$/.test(cardCvc)) {
        setError("Enter a valid CVC.");
        return;
      }
    }

    if (paymentMethod === "paypal") {
      if (!validateEmail(paypalEmail)) {
        setError("Enter a valid PayPal email address.");
        return;
      }
    }

    if (typeof onResult === "function") {
      onResult({ paymentMethod, success: true });
    }
  };

  return (
    <div className="payment-overlay">
      <div className="payment-modal">
        <div className="payment-header">
          <button type="button" className="payment-back" onClick={onClose}>
            Back
          </button>
          <h2>Secure Payment</h2>
          <div className="payment-total">${Number(total).toFixed(2)}</div>
        </div>

        <form className="payment-form" onSubmit={handleSubmit} autoComplete="off" noValidate>
          <div className="payment-methods">
            <button
              type="button"
              className={paymentMethod === "card" ? "payment-method payment-method--active" : "payment-method"}
              onClick={() => { setPaymentMethod("card"); setError(""); }}
            >
              Card
            </button>
            <button
              type="button"
              className={paymentMethod === "apple_pay" ? "payment-method payment-method--active" : "payment-method"}
              onClick={() => { setPaymentMethod("apple_pay"); setError(""); setCardNumberError(""); }}
            >
              Apple Pay
            </button>
            <button
              type="button"
              className={paymentMethod === "paypal" ? "payment-method payment-method--active" : "payment-method"}
              onClick={() => { setPaymentMethod("paypal"); setError(""); setCardNumberError(""); }}
            >
              PayPal
            </button>
          </div>

          {paymentMethod === "card" && (
            <div className="payment-fields">
              <label className="payment-field">
                Card number
                <div className="payment-card-wrap">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => {
                      const formatted = formatCardNumber(e.target.value);
                      setCardNumber(formatted);
                      setCardNumberError(validateCardNumber(formatted));
                    }}
                    onBlur={() => setCardNumberError(validateCardNumber(cardNumber))}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className={cardNumberError ? "payment-input-error" : ""}
                    autoComplete="off"
                  />
                </div>
                {cardNumberError && <span className="payment-field-error">{cardNumberError}</span>}
              </label>
              <div className="payment-two-col">
                <label className="payment-field">
                  Expiry
                  <input
                    type="text"
                    value={formatExpiry(cardExpiry)}
                    onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                    placeholder="MM/YY"
                    autoComplete="off"
                    maxLength={5}
                  />
                </label>
                <label className="payment-field">
                  CVC
                  <div className="payment-cvc-wrap">
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      placeholder="123"
                      autoComplete="off"
                      maxLength={4}
                    />
                    <span className="payment-cvc-icon">⊡</span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {paymentMethod === "apple_pay" && (
            <div className="payment-wallet-screen">
              <p className="payment-wallet-brand">Apple Pay</p>
              <p className="payment-wallet-desc">
                You&rsquo;ll be charged <strong>${Number(total).toFixed(2)}</strong> via Apple Pay.
              </p>
            </div>
          )}

          {paymentMethod === "paypal" && (
            <div className="payment-wallet-screen">
              <label className="payment-field payment-field-full">
                PayPal email
                <input
                  type="email"
                  value={paypalEmail}
                  autoComplete="off"
                  onChange={(e) => setPaypalEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </label>
              <p className="payment-wallet-desc">
                You&rsquo;ll be redirected to PayPal to pay <strong>${Number(total).toFixed(2)}</strong>.
              </p>
            </div>
          )}

          {error && <p className="payment-error">{error}</p>}

          <div className="payment-actions">
            <button type="button" className="payment-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="payment-submit">
              Pay ${Number(total).toFixed(2)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
