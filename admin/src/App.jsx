
// export default App
import React, { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home/home";
import Cart from "./pages/cart/cart";
import Placeorder from "./pages/placeorder/placeorder";
import Footer from "./components/footer/Footer";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import Myorders from "./pages/myorders/Myorders";
import Verify from "./pages/verify/Verify";

// Import Chatbot Components
import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import config from "./chatbot/config";
import MessageParser from "./chatbot/MessageParser";
import ActionProvider from "./chatbot/ActionProvider";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showChat, setShowChat] = useState(false);

  return (
    <>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : null}
      <div className="app">
        <Navbar setShowLogin={setShowLogin} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<Placeorder />} />
          <Route path="/Verify" element={<Verify />} />
          <Route path="/Myorders" element={<Myorders />} />
        </Routes>

        {/* Floating Chatbot Button */}
        <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 1000 }}>
          <button
            style={{
              padding: "10px",
              background: "#F28C28",
              color: "white",
              cursor: "pointer",
              border: "none"
            }}
            onClick={() => setShowChat(!showChat)}
          >
            {showChat ? "Close Chat" : "Chat with Us"}
          </button>
          {showChat && <Chatbot config={config} messageParser={MessageParser} actionProvider={ActionProvider} />}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default App;
