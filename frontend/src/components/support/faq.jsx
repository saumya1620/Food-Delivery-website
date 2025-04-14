import { useState } from "react";
import "./faq.css";

const tabs = [
  { label: "Ordering", icon: "📦" },
  { label: "Delivery", icon: "❓" },
  { label: "Payment", icon: "💳" },
  { label: "Account", icon: "👤" },
];

const faqData = {
  Ordering: [
    {
      question: "How do I place an order?",
      answer:
        "You can place an order by browsing our menu, adding items to your cart, and proceeding to checkout. Follow the prompts to complete your order.",
    },
    {
      question: "Can I modify my order after placing it?",
      answer:
        "You can modify your order within the first 5 minutes after placing it. After that, modifications may not be possible as we've likely started preparing your food.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept credit/debit cards, UPI payments, and cash on delivery.",
    },
  ],
  Delivery: [
    {
      question: "How long will my delivery take?",
      answer:
        "Delivery times typically range from 30–45 minutes, depending on your location and current order volume.",
    },
    {
      question: "Do you deliver to my area?",
      answer:
        "We deliver within a 5 km radius of our restaurant. You can check if your location is within our delivery zone during checkout.",
    },
    {
      question: "Is there a minimum order value for delivery?",
      answer: "Yes, the minimum order value for delivery is ₹200.",
    },
  ],
  Payment: [
    {
      question: "What payment options do you support?",
      answer:
        "We support credit/debit cards, net banking, UPI, and cash on delivery.",
    },
  ],
  Account: [
    {
      question: "How do I reset my password?",
      answer:
        "You can reset your password by clicking on 'Forgot Password' on the login screen. We'll send a password reset link to your registered email address.",
    },
    {
      question: "How do I update my profile information?",
      answer:
        "Log in to your account, go to 'My Profile', and update your personal details as needed.",
    },
    {
      question: "Can I delete my account?",
      answer:
        "Yes, please contact our support team to initiate the account deletion process.",
    },
  ],
};

const FAQ = () => {
  const [activeTab, setActiveTab] = useState("Ordering");
  const [openIndex, setOpenIndex] = useState(null);

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
      <p className="text-gray-600 mb-6">
        Find answers to common questions about our service
      </p>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 md:gap-4 mb-6">
        {tabs.map(({ label, icon }) => (
          <button
            key={label}
            className={`faq-tab ${activeTab === label ? "faq-tab-active" : ""}`}
            onClick={() => {
              setActiveTab(label);
              setOpenIndex(null);
            }}
          >
            <span className="mr-1">{icon}</span>
            {label}
          </button>
        ))}
      </div>

      {/* FAQ Content */}
      <div className="space-y-4">
        {faqData[activeTab].map((item, index) => (
          <div key={index} className="faq-question">
            <button
              className="w-full text-left font-semibold flex justify-between items-center"
              onClick={() => toggleQuestion(index)}
              aria-expanded={openIndex === index}
            >
              {item.question}
              <span className={`arrow ${openIndex === index ? "open" : ""}`}>
                {openIndex === index ? "▲" : "▼"}
              </span>
            </button>
            <div className={`faq-answer ${openIndex === index ? "open" : ""}`}>
              <div className="faq-answer-content">{item.answer}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
