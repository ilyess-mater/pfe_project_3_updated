import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useChatContext } from "../context/ChatContext";
import "../styles/DirectMessagesSidebar.css";

const DirectMessagesSidebar = () => {
  const { contacts, activeContact, setActiveChat } = useChatContext();
  const [dmEnabled, setDmEnabled] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Filter contacts based on search query
  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle contact selection
  const handleContactClick = (contactId) => {
    setActiveChat(contactId);
    navigate(`/chat/${contactId}`);
  };

  return (
    <div className="dm-sidebar">
      <div className="dm-header">
        <h2>Direct Messages</h2>
        <div className="dm-header-actions">
          <div className="toggle-switch">
            <input
              type="checkbox"
              id="dmToggle"
              checked={dmEnabled}
              onChange={() => setDmEnabled(!dmEnabled)}
            />
            <label htmlFor="dmToggle"></label>
          </div>
          <button className="new-message-btn">
            <span className="icon-new-message"></span>
          </button>
        </div>
      </div>

      <div className="dm-search">
        <span className="icon-search"></span>
        <input
          type="text"
          placeholder="Find a DM..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="dm-contacts">
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            className={`contact-item ${
              activeContact === contact.id ? "active" : ""
            }`}
            onClick={() => handleContactClick(contact.id)}
          >
            <div className="contact-avatar">{contact.avatar}</div>
            <div className="contact-name">{contact.name}</div>
            {contact.unreadCount > 0 && (
              <div className="unread-count">{contact.unreadCount}</div>
            )}
            <div className="contact-options">
              <span className="icon-more"></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DirectMessagesSidebar;
