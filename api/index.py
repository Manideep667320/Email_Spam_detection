# This file serves as the entry point for Vercel serverless functions
# It imports your Flask app from the backend directory

import sys
import os
from flask import Flask, jsonify, request
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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

# Initialize NLTK data only once when the module loads
try:
    import nltk
    nltk_data_path = '/tmp/nltk_data'
    os.makedirs(nltk_data_path, exist_ok=True)
    nltk.data.path.append(nltk_data_path)
    
    # Download NLTK data if not present
    try:
        nltk.data.find('corpora/stopwords')
        logger.info("NLTK stopwords already downloaded")
    except LookupError:
        logger.info("Downloading NLTK stopwords...")
        nltk.download('stopwords', download_dir=nltk_data_path)
        logger.info("NLTK stopwords downloaded successfully")
    
except Exception as e:
    logger.error(f"Error initializing NLTK: {str(e)}")
    try:
        nltk.download('stopwords')
        logger.info("Falling back to default NLTK data path")
    except Exception as e:
        logger.error(f"Failed to download NLTK data: {str(e)}")

# Health check endpoint
@application.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "ok",
        "message": "API is running",
        "python_version": sys.version,
        "nltk_data_path": nltk.data.path if 'nltk' in globals() else 'nltk not available'
    }), 200

# Add a simple request logger
@application.before_request
def log_request_info():
    logger.info(f"Request: {request.method} {request.path}")
    if request.method == 'POST':
        logger.info(f"Request body: {request.get_json(silent=True) or {}}")

# Ensure all routes are prefixed with /api
@application.route('/')
def api_redirect():
    return jsonify({
        "status": "ok",
        "message": "Please use /api/ endpoints",
        "endpoints": [
            "GET /api/health",
            "POST /api/predict",
            "GET /api/metrics"
        ]
    }), 200

# This is needed for Vercel
app = application
