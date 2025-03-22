import React from 'react';
import Header from './Header';
import '../../styles/modern/ModernLayout.css';

const ModernLayout = ({ children }) => {
  return (
    <div className="modern-layout">
      <Header />
      <main className="modern-main-content">
        {children}
      </main>
      <footer className="modern-footer">
        <div className="footer-content">
          <p> {new Date().getFullYear()} Secure Messaging Platform</p>
          <p>Student Project - Third Year</p>
        </div>
      </footer>
    </div>
  );
};

export default ModernLayout;
