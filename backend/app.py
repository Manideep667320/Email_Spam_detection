from flask import Flask, request, jsonify
from flask_cors import CORS
import re
import joblib
from pathlib import Path
from scipy.sparse import csr_matrix, hstack
import numpy as np
import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer

app = Flask(__name__)
CORS(app)

# Load trained artifacts
MODELS_DIR = Path(__file__).resolve().parents[1] / 'models'
ARTIFACT_PATH = MODELS_DIR / 'perceptron_model.joblib'
artifacts = None
vectorizer = None
scaler = None
classifier = None
link_feature_names = None

if ARTIFACT_PATH.exists():
    artifacts = joblib.load(ARTIFACT_PATH)
    vectorizer = artifacts.get('vectorizer')
    scaler = artifacts.get('scaler')
    classifier = artifacts.get('classifier')
    link_feature_names = artifacts.get('link_feature_names') or ['url_count', 'ip_url_count', 'suspicious_tld', 'shortener', 'verify_urgent']

# Prepare NLTK resources (stopwords)
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    try:
        nltk.download('stopwords')
    except Exception:
        pass
try:
    STOPWORDS = set(stopwords.words('english'))
except Exception:
    STOPWORDS = set()
PS = PorterStemmer()

def clean_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r'<[^>]+>', '', text)
    text = re.sub(r'[^a-z0-9\s]', ' ', text)
    tokens = text.split()
    tokens = [PS.stem(w) for w in tokens if w not in STOPWORDS]
    return ' '.join(tokens)

def extract_link_features(text: str):
    urls = re.findall(r'https?://\S+', text)
    url_count = len(urls)
    ip_url_count = sum(bool(re.match(r'https?://\d+\.\d+\.\d+\.\d+', u)) for u in urls)
    suspicious_tld_count = sum(u.endswith(('.ru', '.cn', '.tk', '.biz', '.info')) for u in urls)
    shortener_count = sum(any(s in u for s in ['bit.ly', 'tinyurl', 'goo.gl']) for u in urls)
    verify_urgent_count = len(re.findall(r'(verify|urgent).*https?://', text))
    return [url_count, ip_url_count, suspicious_tld_count, shortener_count, verify_urgent_count]

@app.route('/predict', methods=['POST'])
def predict():
    if classifier is None or vectorizer is None or scaler is None:
        return jsonify({"error": "Model not loaded. Train and save artifacts to models/perceptron_model.joblib"}), 500

    data = request.get_json(silent=True) or {}
    email_text = (data.get('email') or '').strip()
    if not email_text:
        return jsonify({"error": "Missing 'email'"}), 400

    cleaned = clean_text(email_text)
    X_text = vectorizer.transform([cleaned])
    link_feats = np.array(extract_link_features(email_text), dtype=float).reshape(1, -1)
    link_sparse = csr_matrix(link_feats)
    link_scaled = scaler.transform(link_sparse)
    X = hstack([X_text, link_scaled])

    pred = classifier.predict(X)[0]
    # confidence via decision function margin
    try:
        margin = float(classifier.decision_function(X)[0])
        confidence = 1 / (1 + np.exp(-abs(margin)))  # 0.5..~1
        confidence = float(max(0.5, min(1.0, confidence)))
    except Exception:
        confidence = 0.75

    label = 'Spam' if int(pred) == 1 else 'Ham'
    return jsonify({
        "prediction": label,
        "confidence": round(confidence, 3)
    })

@app.get('/metrics')
def metrics():
    root_dir = Path(__file__).resolve().parents[1]
    results_path = root_dir / 'results.json'
    if not results_path.exists():
        return jsonify({"error": "results.json not found. Run training to generate metrics."}), 404
    try:
        import json
        with open(results_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": f"Failed to read metrics: {e}"}), 500

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)
