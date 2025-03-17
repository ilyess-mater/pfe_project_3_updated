import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { AuthContext } from "../App";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handle login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Login using the AuthContext
      await login({ email, password });
      navigate("/chat");
    } catch (error) {
      // Handle different error scenarios
      if (error.message === "Failed to fetch") {
        setError("Cannot connect to the server. Please check if the backend is running.");
      } else if (error.message === "Invalid email or password") {
        setError("Invalid email or password. Please check your credentials.");
      } else {
        setError(error.message || "Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Side content component with signup CTA
  const SideContent = () => (
    <div className="side-content">
      <h2>New here?</h2>
      <p>
        Join our <span className="highlight">secure</span> and{" "}
        <span className="highlight">professional</span> messaging platform.
      </p>
      <Link to="/signup" className="cta-button">
        SIGN UP
      </Link>
      <div className="illustration">
        <img
          src="/security.png"
          alt="Security illustration"
          className="illustration-img"
        />
      </div>
    </div>
  );

  return (
    <AuthLayout sideContent={<SideContent />} reverse={true}>
      <div className="login-form-wrapper">
        <h1>Sign In</h1>
        
        {/* Error message display */}
        {error && <div className="error-message">{error}</div>}
        
        {/* Login form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <span className="icon">✉️</span>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <span className="icon">🔒</span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="forgot-password">
            <Link to="/forgot-password">Forgot Your Password?</Link>
          </div>

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? "LOGGING IN..." : "LOGIN"}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;