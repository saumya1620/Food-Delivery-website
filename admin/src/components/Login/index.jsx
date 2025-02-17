import "./login.css";
const Login = ({}) => {
  return (
    <div className="login-popup">
      <form className="login-popup-container">
        <div className="login-popup-title">
          <h2>Admin Login</h2>
        </div>
        <div className="login-popup-inputs">
          <input type="email" placeholder="Your email" required />
          <input type="password" placeholder="Password" required />
        </div>
        <button>Login</button>
      </form>
    </div>
  );
};
export default Login;
