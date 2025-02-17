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
import { useEffect } from "react";
import { getAuthToken } from "./misc";

const App = () => {
  const [isSignin, setIsSignin] = useState(false);
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      setIsSignin(true);
    }
  }, []);
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
              <Route path="/add" element={<Add />} />
              <Route path="/list" element={<List />} />
              <Route path="/orders" element={<Orders />} />
            </Routes>
          </div>
        </>
      ) : (
        <Login onLogin={setIsSignin} />
      )}
    </div>
  );
};

export default App;
