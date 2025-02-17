import React, { useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { getBaseApiUrl, saveAuthToken } from "../../misc";
import { toast } from "react-toastify";
import axios from "axios";

const Login = ({ onSuccess, setCurrState }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    if (!email) {
      setError("Please provide email to login");
      return;
    }
    if (!password) {
      setError("Please provide password to login");
      return;
    }
    try {
      const result = await axios.post(getBaseApiUrl() + "/signin", {
        email,
        password,
      });
      console.log("Login result", result);
      const resp = result.data || {};
      if (resp.success) {
        saveAuthToken(resp.data.token);
        toast.success(resp.message);
        onSuccess(false);
        setEmail("");
        setPassword("");
      } else {
        setError(resp.message);
        saveAuthToken(null);
      }
    } catch (e) {
      console.log("Login failed", e);
      setError("Login failed!");
      saveAuthToken(null);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {error && <div class="error">{error}</div>}
      <input
        type="email"
        placeholder="Your email"
        required
        value={email}
        onChange={(evt) => setEmail(evt.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        required
        value={password}
        onChange={(evt) => setPassword(evt.target.value)}
      />
      <button type="button" onClick={handleLogin}>
        {loading ? "Please wait..." : "Login"}
      </button>
      <p>
        Create a new account?{" "}
        <span onClick={() => setCurrState("Sign Up")}>Click here</span>
      </p>
    </>
  );
};

const Register = ({ onSuccess, setCurrState }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    setError("");
    if (!firstName) {
      setError("Please provide first name");
      return;
    }
    if (!lastName) {
      setError("Please provide last name");
      return;
    }
    if (!email) {
      setError("Please provide email");
      return;
    }
    if (!password) {
      setError("Please provide password");
      return;
    }
    if (!confirmPassword) {
      setError("Please provide confirm password");
      return;
    }
    try {
      const result = await axios.post(getBaseApiUrl() + "/signup", {
        fname: firstName,
        lname: lastName,
        email,
        password,
        confirmPassword,
      });
      console.log("Register result", result);
      const resp = result.data || {};
      if (resp.success) {
        toast.success(resp.message);
        onSuccess(false, true);
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      } else {
        setError(resp.message);
      }
    } catch (e) {
      console.log("Registration failed", e);
      setError("Registration failed!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <input
        type="text"
        placeholder="Your first name"
        required
        value={firstName}
        onChange={(evt) => setFirstName(evt.target.value)}
      />
      <input
        type="text"
        placeholder="Your last name"
        required
        value={lastName}
        onChange={(evt) => setLastName(evt.target.value)}
      />
      <input
        type="email"
        placeholder="Your email"
        required
        value={email}
        onChange={(evt) => setEmail(evt.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        required
        value={password}
        onChange={(evt) => setPassword(evt.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm Password"
        required
        value={confirmPassword}
        onChange={(evt) => setConfirmPassword(evt.target.value)}
      />
      <div className="login-popup-condition">
        <input type="checkbox" required />
        <p>By continuing, I agree to the terms of use & privacy policy.</p>
      </div>
      <button type="button" onClick={handleRegister}>
        Create account
      </button>

      <p>
        Already have an account?{" "}
        <span onClick={() => setCurrState("Login")}>Login here</span>
      </p>
    </>
  );
};

const LoginPopup = ({ onSuccess, setShowLogin }) => {
  const [currState, setCurrState] = useState("Login");

  return (
    <div className="login-popup">
      <form className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt=""
          />
        </div>
        <div className="login-popup-inputs">
          {currState === "Login" ? (
            <Login
              setCurrState={setCurrState}
              onSuccess={(status, isSignIn) => {
                setShowLogin(status);
                onSuccess(isSignIn);
              }}
            />
          ) : (
            <Register
              setCurrState={setCurrState}
              onSuccess={(status) => setShowLogin(status)}
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPopup;
