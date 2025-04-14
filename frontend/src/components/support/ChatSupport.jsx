import { useState, useEffect, useRef } from "react";
import { Send } from "react-feather";
import "./ChatSupport.css"; // 👈 Add this for styles

const ChatSupport = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "system",
      text: "Welcome to Tomato Support! How can we help you today?",
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      sender: "user",
      text: newMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");

    setTimeout(() => {
      const agentMessage = {
        id: messages.length + 2,
        sender: "agent",
        text: getAutoResponse(newMessage),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, agentMessage]);
    }, 1000);
  };

  const getAutoResponse = (message) => {
    const lower = message.toLowerCase();

    if (lower.includes("delivery") || lower.includes("late")) {
      return "I understand your concern about the delivery. Let me check the status of your order and get back to you shortly.";
    } else if (lower.includes("refund") || lower.includes("cancel")) {
      return "For refund or cancellation requests, please provide your order number and we'll process it as soon as possible.";
    } else if (lower.includes("menu") || lower.includes("food")) {
      return "Our menu is regularly updated. Is there a specific dish you're looking for or do you have feedback about a meal?";
    } else if (lower.includes("hello") || lower.includes("hi")) {
      return "Hello! How can I assist you with your TastyEats order today?";
    } else {
      return "Thank you for your message. Our support team will review it and get back to you soon. Is there anything else I can help you with?";
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="chat-card">
      <div className="chat-header">
        <h2>Live Support</h2>
        <p>We typically reply within a few minutes</p>
      </div>

      <div className="chat-body">
        {messages.map((msg) => (
          <div key={msg.id} className={`chat-row ${msg.sender}`}>
            {msg.sender === "system" ? (
              <div className="system-message">{msg.text}</div>
            ) : (
              <div className={`message ${msg.sender}`}>
                <p>{msg.text}</p>
                <p className="timestamp">{formatTime(msg.timestamp)}</p>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="chat-footer">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="chat-input"
        />
        <button type="submit" className="chat-send-btn">
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default ChatSupport;
