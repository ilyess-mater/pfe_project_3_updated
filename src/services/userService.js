/**
 * User Service - Handles user-related API calls
 * 
 * This is currently mocked but would connect to your MongoDB in production
 */

// Simulated database of users
// In a real implementation, this would be fetched from MongoDB
const mockUsers = [
  { id: 1, email: 'john@example.com', name: 'John Doe', online: true },
  { id: 2, email: 'sarah@example.com', name: 'Sarah Miller', online: false },
  { id: 3, email: 'dev@example.com', name: 'Dev Singh', online: true },
  { id: 4, email: 'alex@example.com', name: 'Alex Johnson', online: false },
  { id: 5, email: 'maria@example.com', name: 'Maria Garcia', online: true },
];

/**
 * Check if a user exists by email
 * 
 * @param {string} email - The email to check
 * @returns {Promise<Object|null>} - The user object if found, null otherwise
 */
export const checkUserExists = async (email) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real implementation, this would be a call to MongoDB
  // e.g., return db.collection('users').findOne({ email });
  const user = mockUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
  return user || null;
};

/**
 * Get all users
 * 
 * @returns {Promise<Array>} - Array of users
 */
export const getAllUsers = async () => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real implementation, this would be a call to MongoDB
  // e.g., return db.collection('users').find({}).toArray();
  return [...mockUsers];
};

/**
 * Find users by name or email (search functionality)
 * 
 * @param {string} query - The search query
 * @returns {Promise<Array>} - Array of matching users
 */
export const findUsers = async (query) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real implementation, this would be a call to MongoDB with $regex
  // e.g., return db.collection('users').find({ $or: [{ name: { $regex: query, $options: 'i' }}, { email: { $regex: query, $options: 'i' }}]}).toArray();
  return mockUsers.filter(user => 
    user.name.toLowerCase().includes(query.toLowerCase()) ||
    user.email.toLowerCase().includes(query.toLowerCase())
  );
};

/**
 * Get MongoDB implementation instructions
 * 
 * @returns {string} - Instructions for MongoDB implementation
 */
export const getMongoDBImplementationInstructions = () => {
  return `To implement this with a real MongoDB database:

    1. Install MongoDB dependencies: 
       npm install mongoose express

    2. Create a MongoDB Atlas account or set up MongoDB locally
    3. Create a server.js file with MongoDB connection: 

    const express = require('express');
    const mongoose = require('mongoose');
    const cors = require('cors');
    
    const app = express();
    app.use(cors());
    app.use(express.json());
    
    // Connect to MongoDB
    mongoose.connect('mongodb+srv://your_connection_string', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    // Create User schema and model
    const userSchema = new mongoose.Schema({
      name: String,
      email: { type: String, unique: true },
      online: Boolean
    });
    
    const User = mongoose.model('User', userSchema);
    
    // API Routes
    app.get('/api/users', async (req, res) => {
      try {
        const users = await User.find();
        res.json(users);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
    
    app.get('/api/users/search', async (req, res) => {
      try {
        const query = req.query.q;
        const users = await User.find({
          $or: [
            { name: { $regex: query, $options: 'i' }},
            { email: { $regex: query, $options: 'i' }}
          ]
        });
        res.json(users);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
    
    app.get('/api/users/check-email', async (req, res) => {
      try {
        const email = req.query.email;
        const user = await User.findOne({ email });
        res.json({ exists: !!user, user });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log('Server running on port ' + PORT));`;
};
