import { useState } from "react";
import { Phone, Mail, HelpCircle } from "react-feather"; // Import icons from react-feather
import "./ContactUs.css";

const ContactUs = () => {
  const [activeTab, setActiveTab] = useState("contact");

  return (
    <div className="contact-container">
      {activeTab === "contact" && (
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-6">Contact Us</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="contact-info-item">
              <div className="icon-container">
                <Phone className="icon" />
              </div>
              <div>
                <h3 className="font-medium">Phone Support</h3>
                <p className="text-gray-600">+91 1234567890</p>
                <p className="text-sm text-gray-500">Available 10 AM - 10 PM</p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="icon-container">
                <Mail className="icon" />
              </div>
              <div>
                <h3 className="font-medium">Email Support</h3>
                <p className="text-gray-600">support@tastyeats.com</p>
                <p className="text-sm text-gray-500">
                  We'll respond within 24 hours
                </p>
              </div>
            </div>
          </div>

          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input type="text" id="name" className="form-input" />
            </div>

            <div>
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input type="email" id="email" className="form-input" />
            </div>

            <div>
              <label htmlFor="subject" className="form-label">
                Subject
              </label>
              <input type="text" id="subject" className="form-input" />
            </div>

            <div>
              <label htmlFor="message" className="form-label">
                Message
              </label>
              <textarea id="message" rows={4} className="form-input"></textarea>
            </div>

            <button type="submit" className="btn btn-primary">
              Send Message
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ContactUs;
