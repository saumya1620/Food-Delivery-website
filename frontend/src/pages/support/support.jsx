"use client";
import { useState } from "react";
import ChatSupport from "../../components/support/ChatSupport";
import FAQ from "../../components/support/faq";
import ContactUs from "../../components/support/ContactUs";

import { MessageSquare, Phone, Mail, HelpCircle } from "react-feather";
import "./support.css";

const Support = () => {
  const [activeTab, setActiveTab] = useState("chat");

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-10">Support Center</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT SIDE - Tabs & Content */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="flex border-b mb-6">
            {[
              {
                label: "Live Chat",
                icon: <MessageSquare className="h-4 w-4 mr-2" />,
                key: "chat",
              },
              {
                label: "FAQs",
                icon: <HelpCircle className="h-4 w-4 mr-2" />,
                key: "faq",
              },
              {
                label: "Contact Us",
                icon: <Mail className="h-4 w-4 mr-2" />,
                key: "contact",
              },
            ].map(({ label, icon, key }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`py-2 px-4 font-medium flex items-center transition duration-200 ${
                  activeTab === key
                    ? "text-orange-500 border-b-2 border-orange-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                aria-current={activeTab === key}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>

          {/* Conditional Content */}
          <div className="fade-in">
            {activeTab === "chat" && <ChatSupport />}
            {activeTab === "faq" && <FAQ />}
            {activeTab === "contact" && <ContactUs />} {/* FIXED */}
          </div>
        </div>

        {/* RIGHT SIDE INFO OR SUPPORT DETAILS (Optional) */}
        {/* You can keep your static contact cards or FAQ summary here */}
      </div>
    </div>
  );
};

export default Support;
