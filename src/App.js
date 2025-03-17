import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import MessagingLayout from "./components/MessagingLayout";
import { AuthService } from "./services/api";
import "./App.css";

// Create authentication context that will be used throughout the app
export const AuthContext = createContext();

function App() {
  // Set up authentication state
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in when app loads
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      try {
        // Verify the token with the server
        const response = await AuthService.verifyToken();
        setUser(response.user);
        setIsAuthenticated(true);
      } catch (error) {
        // If token is invalid, remove it
        localStorage.removeItem("authToken");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkLoginStatus();
  }, []);

  // Authentication functions
  const login = async (credentials) => {
    const response = await AuthService.login(credentials);
    localStorage.setItem("authToken", response.token);
    setUser(response.user);
    setIsAuthenticated(true);
    return response;
  };
  
  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    setIsAuthenticated(false);
  };

  // Show loading screen while checking authentication
  if (isLoading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/signup" />} />
          
          {/* Protected route - only accessible when logged in */}
          <Route 
            path="/chat/*" 
            element={
              isAuthenticated ? 
                <MessagingLayout /> : 
                <Navigate to="/login" />
            } 
          />
          
          {/* Redirect any other routes */}
          <Route
            path="*"
            element={
              <Navigate to={isAuthenticated ? "/chat" : "/login"} />
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;