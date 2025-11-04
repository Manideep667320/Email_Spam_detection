# Real-Time Spam Detection using Perceptron

A modern full-stack web application that uses a trained Perceptron machine learning model to classify emails as Spam or Ham (not spam) in real-time. Built with React, Flask, and scikit-learn.

![Project Banner](https://img.shields.io/badge/ML-Perceptron-blue) ![React](https://img.shields.io/badge/React-19.1-61dafb) ![Flask](https://img.shields.io/badge/Flask-3.1-black) ![Python](https://img.shields.io/badge/Python-3.x-yellow)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [How It Works](#how-it-works)
- [Model Training](#model-training)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

---

## 🎯 Overview

This project implements a **Perceptron-based spam detection system** trained on the Enron email dataset. Users can paste email content into a modern web interface and receive instant predictions with confidence scores. The system combines:

- **Machine Learning**: Perceptron classifier with TF-IDF and link-based features
- **Backend**: Flask REST API serving predictions
- **Frontend**: React + Vite with Tailwind CSS and Framer Motion animations
- **Real-time Analysis**: Auto-detection with debouncing and manual trigger

---

## ✨ Features

### 🔍 Spam Detection
- **Real-time classification** of email content as Spam or Ham
- **Confidence scores** showing prediction certainty
- **Auto-detection** after 1-2 seconds of typing
- **Manual trigger** via "Check Email" button

### 📊 Model Analytics
- **Confusion matrix** visualization
- **Precision, Recall, F1-Score** metrics for both classes
- **Overall accuracy** display
- **Training pipeline** diagram showing data flow

### 🎨 Modern UI/UX
- **Gradient hero section** with animated elements
- **Interactive cards** with hover effects
- **Responsive design** for all screen sizes
- **Custom scrollbar** matching brand colors
- **Loading states** and error handling
- **Smooth animations** using Framer Motion

### 🧠 Training Pipeline Visualization
- **5-step training flow** from dataset to model
- **Perceptron architecture diagram** with input/output layers
- **Weight update formula** explanation
- **Dataset access details** and file structure

---

## 🛠️ Tech Stack

### Frontend
- **React 19.1** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animation library
- **Axios** - HTTP client
- **Lucide React** - Icon library

### Backend
- **Flask 3.1** - Python web framework
- **Flask-CORS** - Cross-origin resource sharing
- **scikit-learn** - Machine learning library
- **NLTK** - Natural language processing
- **BeautifulSoup4** - HTML parsing
- **NumPy & SciPy** - Numerical computing

### Machine Learning
- **Perceptron** - Linear classifier
- **TF-IDF Vectorizer** - Text feature extraction (1-2 grams, max 10k features)
- **StandardScaler** - Feature normalization
- **Custom link features** - URL count, IP URLs, suspicious TLDs, shorteners, verify/urgent patterns

---

## 📁 Project Structure

```
spam_detection/
├── backend/
│   └── app.py                    # Flask API server
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SpamAnalyzer.jsx      # Main email input & prediction UI
│   │   │   ├── InfoCard.jsx          # Project information card
│   │   │   ├── MetricsPanel.jsx      # Model analytics display
│   │   │   ├── TrainingPipeline.jsx  # Training flow visualization
│   │   │   └── Footer.jsx            # Footer with social links
│   │   ├── lib/
│   │   │   └── api.js                # Axios API helpers
│   │   ├── App.jsx                   # Main app component
│   │   ├── index.css                 # Global styles + Tailwind
│   │   └── main.jsx                  # React entry point
│   ├── public/                       # Static assets
│   ├── package.json                  # Node dependencies
│   ├── tailwind.config.js            # Tailwind configuration
│   ├── postcss.config.js             # PostCSS configuration
│   └── vite.config.js                # Vite configuration (with proxy)
├── dataset/
│   ├── ham/                          # Ham (legitimate) emails
│   └── spam/                         # Spam emails
├── models/
│   └── perceptron_model.joblib       # Trained model artifacts
├── enron_perceptron_train.py         # Training script
├── results.json                      # Training metrics & confusion matrix
├── requirements.txt                  # Python dependencies
└── README.md                         # This file
```

---

## 🚀 Installation

### Prerequisites
- **Python 3.8+** with pip
- **Node.js 16+** with npm
- **Git** (optional)

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd spam_detection
```

### Step 2: Set Up Python Virtual Environment
```bash
# Create virtual environment
python -m venv venv

# Activate (Windows)
.\venv\Scripts\Activate.ps1

# Activate (Linux/Mac)
source venv/bin/activate
```

### Step 3: Install Python Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

### Step 5: Train the Model (First Time Only)
```bash
# Ensure dataset is in dataset/ham/ and dataset/spam/
python enron_perceptron_train.py
```
This generates:
- `models/perceptron_model.joblib` - Trained model
- `results.json` - Training metrics

---

## 💻 Usage

### Option 1: Run Both Servers Together (Recommended)
```bash
cd frontend
npm run dev
```
This starts:
- **Frontend**: http://localhost:5173 (Vite dev server)
- **Backend**: http://127.0.0.1:5000 (Flask API)

### Option 2: Run Servers Separately

**Terminal 1 - Backend:**
```bash
.\venv\Scripts\Activate.ps1
python backend/app.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Access the Application
Open your browser and navigate to: **http://localhost:5173**

---

## 🧪 How It Works

### 1. **Dataset Preparation**
- Enron email dataset with labeled Ham and Spam emails
- Emails stored as `.txt` files in `dataset/ham/` and `dataset/spam/`
- Parsed using Python's `email` library to extract headers and body

### 2. **Preprocessing Pipeline**
```
Raw Email → HTML Removal → Lowercase → Remove Punctuation 
→ Tokenization → Stopword Removal → Porter Stemming → Clean Text
```

### 3. **Feature Extraction**
- **TF-IDF Features**: Text converted to 10,000-dimensional vector (1-2 grams)
- **Link Features** (5 numeric):
  - URL count
  - IP-based URL count
  - Suspicious TLD count (.ru, .cn, .tk, .biz, .info)
  - URL shortener count (bit.ly, tinyurl, goo.gl)
  - Verify/urgent pattern count

### 4. **Perceptron Training**
```python
# Weight update rule
w_new = w_old + η × (y_true - y_pred) × x

# Parameters
- Max iterations: 50
- Learning rate (η): 1.0
- Penalty: None
- Shuffle: True
```

### 5. **Prediction Flow**
```
User Input → Clean Text → TF-IDF Transform → Extract Link Features 
→ Scale Features → Perceptron Predict → Return Label + Confidence
```

---

## 🎓 Model Training

### Training Script: `enron_perceptron_train.py`

**Steps:**
1. Load emails from `dataset/ham/` and `dataset/spam/`
2. Parse and clean text (remove HTML, stopwords, stem)
3. Extract TF-IDF features (1-2 grams, max 10k)
4. Extract 5 link-based features
5. Combine and scale features
6. Split 80/20 train/test
7. Train Perceptron (50 iterations, η=1.0)
8. Evaluate on test set
9. Save model to `models/perceptron_model.joblib`
10. Save metrics to `results.json`

### Re-train the Model
```bash
python enron_perceptron_train.py
```

### Model Artifacts
- **Vectorizer**: TF-IDF fitted on training data
- **Scaler**: StandardScaler for link features
- **Classifier**: Trained Perceptron weights
- **Link Feature Names**: ['url_count', 'ip_url_count', 'suspicious_tld', 'shortener', 'verify_urgent']

---

## 🔌 API Endpoints

### Base URL
- **Development**: `http://127.0.0.1:5000`
- **Frontend Proxy**: `/api` (via Vite proxy)

### `POST /predict`
Classify an email as Spam or Ham.

**Request:**
```json
{
  "email": "Congratulations! You've won a free prize. Click here to claim now!"
}
```

**Response:**
```json
{
  "prediction": "Spam",
  "confidence": 0.892
}
```

**Errors:**
- `400` - Missing email field
- `500` - Model not loaded

### `GET /metrics`
Retrieve training metrics and confusion matrix.

**Response:**
```json
{
  "confusion_matrix": [[3280, 29], [63, 3361]],
  "classification_report": {
    "Ham": {
      "precision": 0.981,
      "recall": 0.991,
      "f1-score": 0.986,
      "support": 3309
    },
    "Spam": {
      "precision": 0.991,
      "recall": 0.982,
      "f1-score": 0.986,
      "support": 3424
    },
    "accuracy": 0.986
  }
}
```

**Errors:**
- `404` - `results.json` not found (run training first)

---

## 📸 Screenshots

### Hero Section
Modern gradient header with project title and description.

### Email Analyzer
Large text area with real-time spam detection and confidence display.

### Model Analytics
Confusion matrix, accuracy, and per-class metrics visualization.

### Training Pipeline
Interactive diagram showing dataset flow and perceptron architecture.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open-source and available under the MIT License.

---

## 👨‍💻 Author

**Masna Manideep**

- GitHub: [Your GitHub Profile](https://github.com/)
- LinkedIn: [Your LinkedIn Profile](https://www.linkedin.com/)

---

## 🙏 Acknowledgments

- **Enron Email Dataset** - For providing labeled spam/ham emails
- **scikit-learn** - For machine learning tools
- **React & Vite** - For modern frontend development
- **Tailwind CSS** - For beautiful styling
- **Framer Motion** - For smooth animations

---

## 📝 Notes

- Ensure the dataset is properly structured in `dataset/ham/` and `dataset/spam/` before training
- The model requires NLTK stopwords; they will be auto-downloaded on first run
- For production deployment, consider using a production WSGI server (e.g., Gunicorn) instead of Flask's dev server
- Update social links in `frontend/src/components/Footer.jsx` with your actual GitHub/LinkedIn URLs

---

**Made with ❤️ using Machine Learning & Modern Web Technologies**
