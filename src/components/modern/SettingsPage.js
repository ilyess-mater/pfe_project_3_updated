import React, { useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../../App';
import '../../styles/modern/SettingsPage.css';

const SettingsPage = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Mock user data
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    bio: 'Student at the Institute of Technology',
    notifyMessages: true,
    notifyLogin: true,
    darkMode: true,
    fontSize: 'medium',
    language: 'english'
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would send the data to your backend
    console.log('Form submitted:', formData);
    alert('Settings saved successfully!');
  };

  const renderProfileTab = () => (
    <form onSubmit={handleSubmit} className="settings-form">
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          className="form-control"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="form-control"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="bio">Bio</label>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleInputChange}
          className="form-control"
          rows="3"
        ></textarea>
      </div>
      
      <button type="submit" className="save-button">Save Changes</button>
    </form>
  );

  const renderSecurityTab = () => (
    <form onSubmit={handleSubmit} className="settings-form">
      <div className="form-group">
        <label htmlFor="oldPassword">Current Password</label>
        <input
          type="password"
          id="oldPassword"
          name="oldPassword"
          value={formData.oldPassword}
          onChange={handleInputChange}
          className="form-control"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="newPassword">New Password</label>
        <input
          type="password"
          id="newPassword"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleInputChange}
          className="form-control"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm New Password</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          className="form-control"
        />
      </div>
      
      <div className="password-requirements">
        <h4>Password Requirements:</h4>
        <ul>
          <li>At least 8 characters long</li>
          <li>Contain at least one uppercase letter</li>
          <li>Contain at least one number</li>
          <li>Contain at least one special character</li>
        </ul>
      </div>
      
      <button type="submit" className="save-button">Update Password</button>
    </form>
  );

  const renderNotificationsTab = () => (
    <form onSubmit={handleSubmit} className="settings-form">
      <div className="form-group checkbox-group">
        <input
          type="checkbox"
          id="notifyMessages"
          name="notifyMessages"
          checked={formData.notifyMessages}
          onChange={handleInputChange}
          className="form-checkbox"
        />
        <label htmlFor="notifyMessages">New message notifications</label>
      </div>
      
      <div className="form-group checkbox-group">
        <input
          type="checkbox"
          id="notifyLogin"
          name="notifyLogin"
          checked={formData.notifyLogin}
          onChange={handleInputChange}
          className="form-checkbox"
        />
        <label htmlFor="notifyLogin">Login activity notifications</label>
      </div>
      
      <button type="submit" className="save-button">Save Preferences</button>
    </form>
  );

  const renderAppearanceTab = () => (
    <form onSubmit={handleSubmit} className="settings-form">
      <div className="form-group checkbox-group">
        <input
          type="checkbox"
          id="darkMode"
          name="darkMode"
          checked={formData.darkMode}
          onChange={handleInputChange}
          className="form-checkbox"
        />
        <label htmlFor="darkMode">Dark Mode</label>
      </div>
      
      <div className="form-group">
        <label htmlFor="fontSize">Font Size</label>
        <select
          id="fontSize"
          name="fontSize"
          value={formData.fontSize}
          onChange={handleInputChange}
          className="form-select"
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="language">Language</label>
        <select
          id="language"
          name="language"
          value={formData.language}
          onChange={handleInputChange}
          className="form-select"
        >
          <option value="english">English</option>
          <option value="french">French</option>
          <option value="arabic">Arabic</option>
        </select>
      </div>
      
      <button type="submit" className="save-button">Save Preferences</button>
    </form>
  );

  return (
    <div className="page-container settings-page">
      <h2 className="section-heading">Settings</h2>
      
      <div className="settings-container">
        <div className="settings-tabs">
          <button 
            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button 
            className={`tab-button ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            Security
          </button>
          <button 
            className={`tab-button ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            Notifications
          </button>
          <button 
            className={`tab-button ${activeTab === 'appearance' ? 'active' : ''}`}
            onClick={() => setActiveTab('appearance')}
          >
            Appearance
          </button>
        </div>
        
        <div className="settings-content modern-card">
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'security' && renderSecurityTab()}
          {activeTab === 'notifications' && renderNotificationsTab()}
          {activeTab === 'appearance' && renderAppearanceTab()}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
