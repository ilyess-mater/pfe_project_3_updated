import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import { checkUserExists } from '../../services/userService';
import '../../styles/modern/ContactsPage.css';

const ContactsPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', email: '' });
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  // Load contacts from localStorage or initialize empty
  useEffect(() => {
    const savedContacts = localStorage.getItem('contacts');
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    }
  }, []);

  // Save contacts to localStorage whenever they change
  useEffect(() => {
    if (contacts.length > 0) {
      localStorage.setItem('contacts', JSON.stringify(contacts));
    }
  }, [contacts]);

  // Helper to get initials for avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('');
  };

  // Filter and search contacts
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'online') return matchesSearch && contact.online;
    if (filter === 'favorites') return matchesSearch && contact.favorite;
    
    return matchesSearch;
  });

  // Toggle favorite status
  const toggleFavorite = (id) => {
    setContacts(contacts.map(contact => 
      contact.id === id ? { ...contact, favorite: !contact.favorite } : contact
    ));
  };

  // Handle adding a new contact
  const handleAddContact = async (e) => {
    e.preventDefault();
    setError('');
    setIsChecking(true);

    // Validate inputs
    if (!newContact.name.trim() || !newContact.email.trim()) {
      setError('Name and email are required');
      setIsChecking(false);
      return;
    }

    // Check if email already exists in our contacts
    if (contacts.some(c => c.email.toLowerCase() === newContact.email.toLowerCase())) {
      setError('A contact with this email already exists in your contacts');
      setIsChecking(false);
      return;
    }

    try {
      // Check if user exists in the database
      const existingUser = await checkUserExists(newContact.email);
      
      if (!existingUser) {
        setError('This email is not registered in our system. The user must sign up first.');
        setIsChecking(false);
        return;
      }
      
      // Add new contact using data from the database
      const newId = contacts.length > 0 ? Math.max(...contacts.map(c => c.id)) + 1 : 1;
      
      const newContactData = { 
        id: newId, 
        name: existingUser.name || newContact.name, // Use name from DB if available
        email: newContact.email, 
        online: existingUser.online || false, 
        favorite: false 
      };
      
      setContacts([...contacts, newContactData]);
      
      // Reset form and close modal
      setNewContact({ name: '', email: '' });
      setShowAddModal(false);
      
      // Automatically navigate to message with this contact
      navigate('/messages', { state: { contact: newContactData } });
    } catch (error) {
      console.error('Error checking user:', error);
      setError('Could not verify email. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  // Handle deleting a contact
  const handleDeleteContact = (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      setContacts(contacts.filter(contact => contact.id !== id));
    }
  };

  return (
    <div className="page-container contacts-page">
      <div className="contacts-header-container">
        <h2 className="section-heading">Contacts</h2>
        <div className="contacts-controls">
          <div className="search-box">
            <input 
              type="text" 
              placeholder="Search contacts..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-controls">
            <button 
              className={`filter-button ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={`filter-button ${filter === 'online' ? 'active' : ''}`}
              onClick={() => setFilter('online')}
            >
              Online
            </button>
            <button 
              className={`filter-button ${filter === 'favorites' ? 'active' : ''}`}
              onClick={() => setFilter('favorites')}
            >
              Favorites
            </button>
          </div>
        </div>
      </div>
      
      <div className="contacts-grid">
        {filteredContacts.length > 0 ? (
          filteredContacts.map(contact => (
            <div key={contact.id} className="contact-card modern-card">
              <div className="contact-card-header">
                <div className={`contact-avatar ${contact.online ? 'online' : ''}`}>
                  {getInitials(contact.name)}
                </div>
                <button 
                  className={`favorite-button ${contact.favorite ? 'favorite' : ''}`}
                  onClick={() => toggleFavorite(contact.id)}
                >
                  ★
                </button>
              </div>
              
              <div className="contact-details">
                <h3 className="contact-name">{contact.name}</h3>
                <p className="contact-email">{contact.email}</p>
                <p className="contact-status">
                  {contact.online ? 'Online' : 'Offline'}
                </p>
              </div>
              
              <div className="contact-actions">
                <button 
                  className="action-button primary"
                  onClick={() => navigate('/messages', { state: { contact } })}
                >
                  Message
                </button>
                <button 
                  className="action-button secondary"
                  onClick={() => handleDeleteContact(contact.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-contacts">
            <div className="empty-contacts-message">
              <div className="empty-icon">👥</div>
              <h3>No contacts found</h3>
              <p>Add your first contact to start messaging</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="add-contact">
        <button 
          className="add-contact-button"
          onClick={() => setShowAddModal(true)}
        >
          <span className="plus-icon">+</span> Add New Contact
        </button>
      </div>

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Add New Contact</h3>
              <button 
                className="close-button"
                onClick={() => {
                  setShowAddModal(false);
                  setError('');
                  setNewContact({ name: '', email: '' });
                }}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleAddContact}>
              {error && <div className="error-message">{error}</div>}
              
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={newContact.name}
                  onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                  placeholder="Contact name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={newContact.email}
                  onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                  placeholder="Contact email"
                  required
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" className="submit-button" disabled={isChecking}>
                  {isChecking ? 'Checking...' : 'Add Contact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactsPage;
