from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import bcrypt
import jwt
import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# MongoDB Connection
mongo_uri = os.getenv('MONGO_URI', 'mongodb://localhost:27017/pfe_project')
client = MongoClient(mongo_uri)
db = client.get_database()
users_collection = db.users

# JWT Configuration
jwt_secret = os.getenv('JWT_SECRET_KEY', 'fallback_secret_key')

# Helper Functions
def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

def check_password(password, hashed_password):
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password)

def generate_token(user_id):
    payload = {
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1),
        'iat': datetime.datetime.utcnow(),
        'sub': str(user_id)
    }
    return jwt.encode(payload, jwt_secret, algorithm='HS256')

# Test route
@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({'message': 'API is running'}), 200

# Signup route
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    
    # Check if all required fields are present
    if not all(key in data for key in ['username', 'email', 'password']):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Check if email already exists
    if users_collection.find_one({'email': data['email']}):
        return jsonify({'error': 'Email already registered'}), 409
    
    # Create new user
    hashed_password = hash_password(data['password'])
    user = {
        'username': data['username'],
        'email': data['email'],
        'password': hashed_password,
        'created_at': datetime.datetime.utcnow()
    }
    
    # Save user to database
    result = users_collection.insert_one(user)
    
    # Generate token
    token = generate_token(result.inserted_id)
    
    return jsonify({
        'message': 'User registered successfully',
        'token': token,
        'user': {
            'id': str(result.inserted_id),
            'username': data['username'],
            'email': data['email']
        }
    }), 201

# Login route
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    
    # Check if email and password are provided
    if 'email' not in data or 'password' not in data:
        return jsonify({'error': 'Email and password are required'}), 400
    
    # Find user by email
    user = users_collection.find_one({'email': data['email']})
    
    # Check if user exists and password is correct
    if not user or not check_password(data['password'], user['password']):
        return jsonify({'error': 'Invalid email or password'}), 401
    
    # Generate token
    token = generate_token(user['_id'])
    
    return jsonify({
        'message': 'Login successful',
        'token': token,
        'user': {
            'id': str(user['_id']),
            'username': user['username'],
            'email': user['email']
        }
    }), 200

# Token verification route
@app.route('/api/verify-token', methods=['GET'])
def verify_token():
    auth_header = request.headers.get('Authorization')
    
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Invalid or missing token'}), 401
    
    token = auth_header.split(' ')[1]
    
    try:
        # Verify token
        payload = jwt.decode(token, jwt_secret, algorithms=['HS256'])
        user_id = payload['sub']
        
        # Find user by id
        user = users_collection.find_one({'_id': user_id})
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'valid': True,
            'user': {
                'id': str(user['_id']),
                'username': user['username'],
                'email': user['email']
            }
        }), 200
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)