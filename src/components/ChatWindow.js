import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useChatContext } from "../context/ChatContext";
import "../styles/ChatWindow.css";

const ChatWindow = () => {
  const { contactId } = useParams();
  const { contacts, messages, activeContact, sendMessage, setActiveChat } =
    useChatContext();

  const [messageText, setMessageText] = useState("");
  const [activeTab, setActiveTab] = useState("messages");
  const messagesEndRef = useRef(null);

  // Find the selected contact
  const selectedContact = contacts.find(
    (contact) => contact.id === parseInt(contactId)
  );

  // Set active contact when contactId changes
  useEffect(() => {
    if (contactId) {
      setActiveChat(parseInt(contactId));
    }
  }, [contactId, setActiveChat]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeContact]);

  // Handle send message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageText.trim() && contactId) {
      sendMessage(parseInt(contactId), messageText);
      setMessageText("");
    }
  };

  // Format timestamp
  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // If no contact is selected
  if (!selectedContact) {
    return (
      <div className="empty-chat">Select a conversation to start messaging</div>
    );
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="contact-info">
          <div className="contact-avatar large">{selectedContact.avatar}</div>
          <h2>{selectedContact.name}</h2>
        </div>
        <div className="chat-options">
          <span className="icon-more-options"></span>
        </div>
      </div>

      <div className="chat-tabs">
        <div
          className={`tab ${activeTab === "messages" ? "active" : ""}`}
          onClick={() => setActiveTab("messages")}
        >
          <i>💬</i> Messages
        </div>
        <div
          className={`tab ${activeTab === "tasks" ? "active" : ""}`}
          onClick={() => setActiveTab("tasks")}
        >
          <i className="icon-tasks"></i> Tasks
        </div>
      </div>

      <div className="chat-content">
        {activeTab === "messages" ? (
          messages[parseInt(contactId)] &&
          messages[parseInt(contactId)].length > 0 ? (
            <div className="messages-list">
              {messages[parseInt(contactId)].map((message) => (
                <div
                  key={message.id}
                  className={`message ${
                    message.senderId !== selectedContact.id
                      ? "sent"
                      : "received"
                  }`}
                >
                  <div className="message-bubble">
                    <div className="message-text">{message.text}</div>
                    <div className="message-time">
                      {formatMessageTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="empty-message">
              No messages yet. Start the conversation!
            </div>
          )
        ) : (
          <div className="tasks-tab-content">
            <div className="empty-message">No tasks yet.</div>
          </div>
        )}
      </div>

      <form className="message-input-container" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Type a message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />
        <button type="button" className="attachment-btn">
          <span className="icon-plus"></span>
        </button>
        <button type="button" className="mic-btn">
          <span className="icon-mic"></span>
        </button>
        <button type="submit" className="send-button">
          <span className="icon-send"></span>
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
