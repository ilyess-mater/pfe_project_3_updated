# Secure Messaging Platform

A professional and secure messaging platform with authentication, dashboard, and real-time messaging capabilities.

## Features

- User authentication (signup, login, logout)
- MongoDB integration for user storage
- JWT token-based authentication
- Modern UI with React
- Dashboard with message previews
- Direct messaging capabilities

## Project Structure

The project is divided into two main parts:

1. **React Frontend** - Located in the root directory
2. **Flask Backend** - Located in the `server` directory

## Prerequisites

- Node.js (v14 or higher)
- Python (v3.7 or higher)
- MongoDB (local installation or MongoDB Atlas account)

## Setup and Installation

### 1. MongoDB Setup

Make sure MongoDB is running on your system or set up a MongoDB Atlas account and update the connection string in `server/.env`.

### 2. Backend Setup

```bash
# Navigate to the server directory
cd server

# Install dependencies
pip install -r requirements.txt

# Run the Flask server
python app.py
```

The backend server will start on port 5000.

### 3. Frontend Setup

```bash
# Install dependencies
npm install

# Start the React development server
npm start
```

The frontend will start on port 3000.

## API Endpoints

### Authentication

- **POST /api/signup** - Register a new user
  - Required fields: username, email, password
  
- **POST /api/login** - Log in an existing user
  - Required fields: email, password
  
- **GET /api/verify-token** - Verify a JWT token
  - Required header: Authorization: Bearer <token>

## Demo Credentials

For testing purposes, you can use these credentials:

- Email: test@example.com
- Password: password123

Note: These are only for development. In production, create your own account.

## Environment Variables

### Backend (.env file in server directory)

```
MONGO_URI=mongodb://localhost:27017/pfe_project
JWT_SECRET_KEY=your_super_secret_key_change_this_in_production
PORT=5000
```

## Future Improvements

- Add password reset functionality
- Implement user profile management
- Add real-time messaging using Socket.IO
- Implement file sharing and attachments
- Add end-to-end encryption for messages
