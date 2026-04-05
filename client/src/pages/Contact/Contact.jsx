import React from "react";
import "./Contact.css";
import contactImage1 from "../../assets/contactGallery/contact1.png";
import contactImage2 from "../../assets/contactGallery/contact2.png";
import contactImage3 from "../../assets/contactGallery/contact3.png";
import contactImage4 from "../../assets/contactGallery/contact4.png";

const Contact = () => {
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
                  <td><img src={contactImage1} alt="address" /></td>
                  <td className="label">Address:</td>
                  <td>Lovender Island, Off Mahé, Seychelles</td>
                </tr>
                <tr>
                  <td><img src={contactImage2} alt="phone" /></td>
                  <td className="label">Phone No.:</td>
                  <td>+248 2729494</td>
                </tr>
                <tr>
                  <td><img src={contactImage3} alt="email" /></td>
                  <td className="label">Email:</td>
                  <td>heyLovender@gmail.com</td>
                </tr>
                <tr>
                  <td><img src={contactImage4} alt="website" /></td>
                  <td className="label">Website:</td>
                  <td>Lovender.com</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="footer-text">Please free to contact us</p>
        </div>

        {/* RIGHT SIDE */}
        <div className="contact-right">
          <h2>Contact Us</h2>

          <form>
            <div className="row">
              <input type="text" placeholder="Name" />
              <input type="email" placeholder="Email" />
            </div>

            <textarea placeholder="Type here"></textarea>

            <input type="file" className="file-input" />

            <button type="submit">Send Message</button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Contact;