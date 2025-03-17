import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { AuthService } from "../services/api";
import "../styles/SignUp.css";

const SignUp = () => {
  const navigate = useNavigate();
  
  // Form state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Password validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      // Create user account
      await AuthService.signup({
        username,
        email,
        password
      });

      // Show success message
      setSuccessMessage("Account created successfully! Redirecting to login page...");

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      // Handle errors
      if (error.message === "Failed to fetch") {
        setError("Cannot connect to the server. Please check if the backend is running.");
      } else {
        setError(error.message || "Error creating account. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Side content with login CTA
  const SideContent = () => (
    <div className="side-content">
      <h2>One of us?</h2>
      <p>
        Log in to your <span className="highlight">secure workspace</span> and
        continue where you left off.
      </p>
      <Link to="/login" className="cta-button">
        SIGN IN
      </Link>
      <div className="illustration">
        <img
          src="/business.png"
          alt="Collaboration illustration"
          className="illustration-img"
        />
      </div>
    </div>
  );

  return (
    <AuthLayout sideContent={<SideContent />}>
      <div className="signup-form-wrapper">
        <h1>Sign Up</h1>
        
        {/* Error and success messages */}
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        
        {/* Signup form */}
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <span className="icon">👤</span>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

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

          <div className="form-group">
            <span className="icon">🔒</span>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? "CREATING ACCOUNT..." : "SIGN UP"}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;