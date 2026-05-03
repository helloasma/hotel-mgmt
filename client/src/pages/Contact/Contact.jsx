import React, { useState } from "react";
import api from "../../services/api";
import "./Contact.css";
import contactImage1 from "../../assets/contactGallery/contact1.png";
import contactImage2 from "../../assets/contactGallery/contact2.png";
import contactImage3 from "../../assets/contactGallery/contact3.png";
import contactImage4 from "../../assets/contactGallery/contact4.png";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setStatus("");
    setError("");

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in your name, email, and message.");
      return;
    }

    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      };

      await api.post("/contact-messages", payload);

      setStatus("Message sent successfully. We will get back to you soon.");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to send message. Please try again."
      );
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-card">
        {/* LEFT SIDE */}
        <div className="contact-left">
          <h2>Get in Touch</h2>
          <p>We are open to any suggestion or query</p>

          <div className="contact-info">
            <table>
              <tbody>
                <tr>
                  <td>
                    <img src={contactImage1} alt="address" />
                  </td>
                  <td className="label">Address:</td>
                  <td>Lovender Island, Off Mahé, Seychelles</td>
                </tr>

                <tr>
                  <td>
                    <img src={contactImage2} alt="phone" />
                  </td>
                  <td className="label">Phone No.:</td>
                  <td>+248 2729494</td>
                </tr>

                <tr>
                  <td>
                    <img src={contactImage3} alt="email" />
                  </td>
                  <td className="label">Email:</td>
                  <td>concierge@lovender.com</td>
                </tr>

                <tr>
                  <td>
                    <img src={contactImage4} alt="website" />
                  </td>
                  <td className="label">Website:</td>
                  <td>
                    <a
                      href="https://resortlovender.onrender.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="website-link"
                    >
                      resortlovender.onrender.com
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="footer-text">Please feel free to contact us</p>
        </div>

        {/* RIGHT SIDE */}
        <div className="contact-right">
          <h2>Contact Us</h2>

          <form onSubmit={handleSubmit}>
            <div className="row">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <textarea
              placeholder="Type here"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            {status && <p className="contact-success">{status}</p>}
            {error && <p className="contact-error">{error}</p>}

            <button type="submit">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;