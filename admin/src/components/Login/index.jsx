import { useState } from "react";
import "./login.css";
import axios from "axios";
import { getBaseApiUrl, saveAuthToken } from "../../misc";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    if (!email) {
      setError("Please provide admin email to login");
      return;
    }
    if (!password) {
      setError("Please provide admin password to login");
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
        onLogin(true);
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
    <div className="login">
      {error && <div class="error">{error}</div>}
      <form className="login-container">
        <div className="login-title">
          <h2>Admin Login</h2>
        </div>
        <div className="login-inputs">
          <input
            type="email"
            placeholder="Your email"
            value={email}
            required
            onChange={(evt) => setEmail(evt.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(evt) => setPassword(evt.target.value)}
          />
        </div>
        <button type="button" onClick={handleLogin}>
          {loading ? "Submitting..." : "Login"}
        </button>
      </form>
    </div>
  );
};
export default Login;
