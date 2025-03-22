import React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../../App';
import '../../styles/modern/HomePage.css';

const HomePage = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="page-container home-page">
      <section className="welcome-section">
        <div className="modern-card welcome-card">
          <h2 className="section-heading">Welcome back, {user?.username}!</h2>
          <p className="welcome-message">
            Your secure messaging platform is ready to use. Start chatting with your contacts securely.
          </p>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-heading">Platform Features</h2>
        
        <div className="features-grid">
          <div className="modern-card feature-card">
            <div className="feature-icon messages-icon"></div>
            <h3>Secure Messaging</h3>
            <p>Send private messages with end-to-end encryption. Your conversations stay between you and your contacts.</p>
          </div>
          
          <div className="modern-card feature-card">
            <div className="feature-icon contacts-icon"></div>
            <h3>Contact Management</h3>
            <p>Organize your contacts and create groups for seamless communication.</p>
          </div>
          
          <div className="modern-card feature-card">
            <div className="feature-icon settings-icon"></div>
            <h3>Personalized Settings</h3>
            <p>Customize your experience with theme options and notification preferences.</p>
          </div>
          
          <div className="modern-card feature-card">
            <div className="feature-icon security-icon"></div>
            <h3>Enhanced Security</h3>
            <p>Your data is protected with the latest security measures.</p>
          </div>
        </div>
      </section>

      <section className="getting-started">
        <div className="modern-card">
          <h2 className="section-heading">Getting Started</h2>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Update Your Profile</h3>
                <p>Visit the settings page to complete your profile information.</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Add Contacts</h3>
                <p>Start building your network by adding contacts.</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Send Messages</h3>
                <p>Begin conversations with your contacts securely.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
