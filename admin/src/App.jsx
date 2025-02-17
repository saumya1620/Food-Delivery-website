import React from "react";
import Navbar from "./components/Navebar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import { Routes, Route } from "react-router-dom";
import Add from "./pages/Add/Add";
import List from "./pages/List/List";
import Orders from "./pages/Orders/Orders";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import Login from "./components/Login";

const App = () => {
  const [isSignin, setIsSignin] = useState(false);

  const url = "http://localhost:4000";
  return (
    <div>
      <ToastContainer />
      {isSignin ? (
        <>
          <Navbar />
          <hr />
          <div className="app-content">
            <Sidebar />
            <Routes>
              <Route path="/add" element={<Add url={url} />} />
              <Route path="/list" element={<List url={url} />} />
              <Route path="/orders" element={<Orders url={url} />} />
            </Routes>
          </div>
        </>
      ) : (
        <Login />
      )}
    </div>
  );
};

export default App;
