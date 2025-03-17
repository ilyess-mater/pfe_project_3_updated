import React from "react";
import { NavLink } from "react-router-dom";
import { useChatContext } from "../context/ChatContext";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const { contacts } = useChatContext();

  // Calculate total unread messages
  const totalUnreadMessages = contacts.reduce(
    (total, contact) => total + (contact.unreadCount || 0),
    0
  );

  return (
    <div className="sidebar">
      <div className="nav-links">
        <NavLink to="/chat" className="nav-item" end>
          <div className="nav-icon">🏠</div>
        </NavLink>

        <NavLink to="/chat" className="nav-item">
          <div className="nav-icon">💬</div>
          {totalUnreadMessages > 0 && (
            <div className="notification-badge">{totalUnreadMessages}</div>
          )}
        </NavLink>

        <NavLink to="/chat" className="nav-item">
          <div className="nav-icon">👥</div>
        </NavLink>

        <NavLink to="/chat" className="nav-item">
          <div className="nav-icon">📄</div>
        </NavLink>

        <NavLink to="/chat" className="nav-item">
          <div className="nav-icon">🔔</div>
        </NavLink>

        <div className="nav-spacer"></div>

        <NavLink to="/chat" className="nav-item">
          <div className="nav-icon">⚙️</div>
        </NavLink>

        <button className="nav-item profile-item">
          <div className="nav-icon profile-icon">👤</div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
