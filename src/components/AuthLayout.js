import React from "react";
import "../styles/AuthLayout.css";

const AuthLayout = ({ children, reverse, sideContent }) => {
  return (
    <div className={`auth-container ${reverse ? "reverse" : ""}`}>
      <div className="auth-form-container">{children}</div>
      <div className="auth-side-container">{sideContent}</div>
    </div>
  );
};

export default AuthLayout;
