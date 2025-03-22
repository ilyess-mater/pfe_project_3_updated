import React, { useState, useEffect, useRef, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../../App';
import '../../styles/modern/MessagesPage.css';

const MessagesPage = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);

  // Handle contact selected from ContactsPage if present
  useEffect(() => {
    if (location.state?.contact) {
      const incomingContact = location.state.contact;
      console.log('Contact received from navigation:', incomingContact);
      setSelectedContact(incomingContact.id);
    }
  }, [location]);

  // Load contacts and messages from localStorage
  useEffect(() => {
    const savedContacts = localStorage.getItem('contacts');
    if (savedContacts) {
      const contacts = JSON.parse(savedContacts);
      // Update contacts with last messages from messages state
      const updatedContacts = contacts.map(contact => {
        const contactMessages = messages[contact.id] || [];
        const lastMessage = contactMessages.length > 0 ? 
          contactMessages[contactMessages.length - 1].text || 'File attachment' : '';
        return {
          ...contact,
          lastMessage: lastMessage
        };
      });
      setContacts(updatedContacts);
    }
    
    const savedMessages = localStorage.getItem('messages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, [messages]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(messages).length > 0) {
      localStorage.setItem('messages', JSON.stringify(messages));
      
      // Also update contacts with last message
      setContacts(prevContacts => {
        return prevContacts.map(contact => {
          const contactMessages = messages[contact.id] || [];
          const lastMessage = contactMessages.length > 0 ? 
            contactMessages[contactMessages.length - 1].text || 'File attachment' : '';
          return {
            ...contact,
            lastMessage: lastMessage
          };
        });
      });
    }
  }, [messages]);
  
  // Update contacts in localStorage when they change
  useEffect(() => {
    if (contacts.length > 0) {
      localStorage.setItem('contacts', JSON.stringify(contacts));
    }
  }, [contacts]);

  // Scroll to bottom of messages when they change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, selectedContact]);

  // Helper to get initials for avatar
  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(part => part[0])
      .join('');
  };

  // Render different types of messages
  const renderMessage = (message) => {
    if (!message) return null;
    
    switch (message.type) {
      case 'image':
        return (
          <div className="media-message">
            <img src={message.src} alt={message.fileName} className="message-image" />
            <a href={message.src} download={message.fileName} className="download-link" title="Download">
              📥
            </a>
          </div>
        );
        
      case 'video':
        return (
          <div className="media-message">
            <video controls className="message-video">
              <source src={message.src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <a href={message.src} download={message.fileName} className="download-link" title="Download">
              📥
            </a>
          </div>
        );
        
      case 'file':
        return (
          <div className="file-message">
            <span className="file-icon">📎</span>
            <span className="file-name">{message.fileName}</span>
          </div>
        );
        
      default:
        return <div className="message-content">{message.text}</div>;
    }
  };

  const handleContactSelect = (contactId) => {
    console.log("Contact selected:", contactId, typeof contactId);
    // Ensure contactId is a number
    const numericId = Number(contactId);
    setSelectedContact(numericId);
    setShowAttachMenu(false);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    console.log('Submit triggered', { messageInput, selectedContact });
    
    // Check if we have a message and selected contact
    if (!messageInput.trim() || !selectedContact) {
      console.log('Cannot send message - empty input or no contact selected');
      return;
    }
    
    // Send the message
    sendMessage({ type: 'text', text: messageInput });
    messageInputRef.current.focus();
  };

  // Send message function with better error handling
  const sendMessage = (messageData) => {
    try {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      const newMessage = {
        id: Date.now(),
        time: timeString,
        sender: 'user',
        ...messageData
      };
      
      // Add message to the selected contact's message list
      // Convert ID to string for consistency with object keys
      const contactId = String(selectedContact);
      console.log('Sending message to contact ID:', contactId, 'Message:', newMessage);
      
      setMessages(prevMessages => {
        const contactMessages = prevMessages[contactId] || [];
        const updatedMessages = {
          ...prevMessages,
          [contactId]: [...contactMessages, newMessage]
        };
        console.log('Updated messages state:', updatedMessages);
        return updatedMessages;
      });
      
      // Clear input
      setMessageInput('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setShowAttachMenu(false);
      
      // Force save to localStorage immediately
      setTimeout(() => {
        const currentMessages = JSON.parse(localStorage.getItem('messages') || '{}');
        const updatedStorage = {
          ...currentMessages,
          [contactId]: [...(currentMessages[contactId] || []), newMessage]
        };
        localStorage.setItem('messages', JSON.stringify(updatedStorage));
        console.log('Saved to localStorage:', updatedStorage);
      }, 0);
      
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Could not send message. Please try again.');
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const fileType = file.type.split('/')[0];
      let messageType = 'file';
      let messageData = {};
      
      switch (fileType) {
        case 'image':
          messageType = 'image';
          messageData = {
            type: 'image',
            text: 'Photo',
            src: event.target.result,
            fileName: file.name
          };
          break;
          
        case 'video':
          messageType = 'video';
          messageData = {
            type: 'video',
            text: 'Video',
            src: event.target.result,
            fileName: file.name
          };
          break;
          
        default:
          messageData = {
            type: 'file',
            text: 'File: ' + file.name,
            fileName: file.name
          };
      }
      
      sendMessage(messageData);
    };
    
    if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }
  };

  // Trigger file input click
  const handleAttachClick = (type) => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('accept', type);
      fileInputRef.current.click();
    }
    setShowAttachMenu(false);
  };

  // Filter contacts by search term
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log("Selected contact:", selectedContact, typeof selectedContact);
  console.log("Filtered contacts:", filteredContacts.map(c => ({ id: c.id, type: typeof c.id, name: c.name })));
  console.log("Message keys:", Object.keys(messages));

  // Get messages for selected contact
  const selectedContactId = selectedContact ? String(selectedContact) : null;
  const selectedContactMessages = selectedContactId ? (messages[selectedContactId] || []) : [];
  const selectedContactInfo = contacts.find(c => c.id === selectedContact);
  
  console.log("Selected contact ID:", selectedContactId);
  console.log("Selected contact messages:", selectedContactMessages);
  console.log("Selected contact info:", selectedContactInfo);

  return (
    <div className="messages-page">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />
      
      <div className="contacts-sidebar">
        <div className="contacts-header">
          <h2>Messages</h2>
          <div className="search-container">
            <input 
              type="text" 
              placeholder="Search contacts..." 
              className="search-input" 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="contacts-list">
          {filteredContacts.length > 0 ? (
            filteredContacts.map(contact => (
              <div 
                key={contact.id} 
                className={`contact-item ${selectedContact === contact.id ? 'selected' : ''}`}
                onClick={() => handleContactSelect(contact.id)}
              >
                <div className={`contact-avatar ${contact.online ? 'online' : ''}`}>
                  {getInitials(contact.name)}
                </div>
                <div className="contact-info">
                  <div className="contact-name">{contact.name}</div>
                  <div className="contact-last-message">{contact.lastMessage}</div>
                </div>
                <div className="contact-meta">
                  <div className="contact-time">{contact.time || ''}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-contacts-message">
              <p>No contacts found. Add contacts in the Contacts page.</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="chat-container">
        {selectedContact ? (
          <>
            <div className="chat-header">
              <div className="chat-contact-info">
                {selectedContactInfo && (
                  <>
                    <div className={`contact-avatar small ${selectedContactInfo.online ? 'online' : ''}`}>
                      {getInitials(selectedContactInfo.name)}
                    </div>
                    <div className="contact-name">
                      {selectedContactInfo.name}
                    </div>
                  </>
                )}
              </div>
              <div className="chat-actions">
                <button className="action-button">Call</button>
                <button className="action-button">Info</button>
              </div>
            </div>
            
            <div className="messages-container">
              {selectedContactMessages.length > 0 ? (
                <>
                  {selectedContactMessages.map(message => (
                    <div key={message.id} className={`message ${message.sender === 'user' ? 'user-message' : 'contact-message'}`}>
                      {renderMessage(message)}
                      <div className="message-time">{message.time}</div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              ) : (
                <div className="empty-messages">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              )}
            </div>
            
            <form className="message-input-container" onSubmit={handleSendMessage}>
              <div className="input-with-attachments">
                <div className="attachment-button-container">
                  <button 
                    type="button" 
                    className="attachment-button"
                    onClick={() => setShowAttachMenu(!showAttachMenu)}
                  >
                    📎
                  </button>
                  
                  {showAttachMenu && (
                    <div className="attachment-menu">
                      <button 
                        type="button" 
                        className="attachment-option"
                        onClick={() => handleAttachClick('image/*')}
                      >
                        <span className="attachment-icon">📷</span> Photo
                      </button>
                      <button 
                        type="button" 
                        className="attachment-option"
                        onClick={() => handleAttachClick('video/*')}
                      >
                        <span className="attachment-icon">🎥</span> Video
                      </button>
                      <button 
                        type="button" 
                        className="attachment-option"
                        onClick={() => handleAttachClick('*/*')}
                      >
                        <span className="attachment-icon">📄</span> File
                      </button>
                    </div>
                  )}
                </div>
                
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  className="message-input"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  ref={messageInputRef}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                />
              </div>
              
              <button 
                type="submit" 
                className="send-button" 
                disabled={!messageInput.trim()}
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="empty-chat">
            <div className="empty-chat-message">
              <div className="empty-chat-icon">👋</div>
              <h3>Select a contact to start messaging</h3>
              <p>Your messages will be secure and encrypted</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
