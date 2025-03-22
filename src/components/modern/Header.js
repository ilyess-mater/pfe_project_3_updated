import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../App';
import '../../styles/modern/Header.css';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="modern-header">
      <div className="header-container">
        <div className="logo-container">
          <Link to="/" className="logo">
            <span className="logo-text">SecureMsg</span>
          </Link>
        </div>
        
        <nav className="main-nav">
          <ul className="nav-links">
            <li>
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/messages" className="nav-link">
                Messages
              </Link>
            </li>
            <li>
              <Link to="/contacts" className="nav-link">
                Contacts
              </Link>
            </li>
            <li>
              <Link to="/settings" className="nav-link">
                Settings
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="user-controls">
          <div className="user-info">
            <span className="username">{user?.username}</span>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
