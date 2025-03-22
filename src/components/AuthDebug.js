import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../App';

const AuthDebug = () => {
  const { user, isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    console.log('AuthDebug mounted');
    return () => console.log('AuthDebug unmounted');
  }, []);

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '10px', 
      right: '10px', 
      padding: '10px', 
      background: '#333', 
      color: 'white',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999
    }}>
      <h4>Auth Debug</h4>
      <p>isAuthenticated: {isAuthenticated ? 'true' : 'false'}</p>
      <p>User: {user ? JSON.stringify(user) : 'null'}</p>
      <p>Token: {localStorage.getItem('authToken') ? 'exists' : 'none'}</p>
    </div>
  );
};

export default AuthDebug;
