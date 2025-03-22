// API base URL
const API_URL = "http://localhost:5000/api";

// Helper function for making API requests
const apiRequest = async (endpoint, method = "GET", data = null) => {
  const token = localStorage.getItem("authToken");
  
  // Prepare request headers
  const headers = {
    "Content-Type": "application/json",
  };
  
  // Add authorization token if available
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  // Configure the request
  const config = {
    method,
    headers,
  };
  
  // Add request body for POST requests
  if (data) {
    config.body = JSON.stringify(data);
  }
  
  try {
    // Make the API request
    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    // Handle error responses
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Something went wrong");
    }
    
    // Parse and return successful response
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error(`Error with ${endpoint}:`, error);
    throw error;
  }
};

// Auth services
const AuthService = {
  // Test API connection
  testConnection: async () => {
    try {
      const response = await fetch(`${API_URL}/test`);
      return response.json();
    } catch (error) {
      throw new Error("Cannot connect to the server");
    }
  },

  // Register a new user
  signup: async (userData) => {
    return apiRequest("/signup", "POST", userData);
  },

  // Login a user
  login: async (credentials) => {
    return apiRequest("/login", "POST", credentials);
  },

  // Verify token
  verifyToken: async () => {
    try {
      // If no token exists in localStorage, don't even try to verify
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }
      return apiRequest("/verify-token");
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem("authToken");
      throw error;
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem("authToken");
  },
};

export { AuthService };