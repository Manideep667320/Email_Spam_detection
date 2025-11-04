# This file serves as the entry point for Vercel serverless functions
# It imports your Flask app from the backend directory

import sys
import os
from flask import Flask, jsonify

# Add the parent directory to the path so we can import from backend
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import the Flask app from your backend
from backend.app import app as application

# Enable CORS for all routes
@application.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    return response

# This is needed for Vercel to properly import your Flask app
# The actual app is imported from backend/app.py

# If you need to initialize anything specific for the Vercel environment,
# you can do it here.
# For example, you might want to ensure NLTK data is downloaded:
try:
    import nltk
    nltk_data_path = '/tmp/nltk_data'
    os.makedirs(nltk_data_path, exist_ok=True)
    nltk.data.path.append(nltk_data_path)
    
    # Download NLTK data if not present
    try:
        nltk.data.find('corpora/stopwords')
    except LookupError:
        print("Downloading NLTK stopwords...")
        nltk.download('stopwords', download_dir=nltk_data_path)
        print("NLTK stopwords downloaded successfully")
    
except Exception as e:
    print(f"Error initializing NLTK: {str(e)}")
    # Fallback to default NLTK data path if there's an issue
    try:
        nltk.download('stopwords')
        print("Falling back to default NLTK data path")
    except Exception as e:
        print(f"Failed to download NLTK data: {str(e)}")

# Add a simple health check endpoint
@application.route('/api/health')
def health_check():
    return jsonify({"status": "ok", "message": "API is running"}), 200
