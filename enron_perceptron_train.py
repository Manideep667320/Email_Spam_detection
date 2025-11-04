"""
Enron Spam Classification Pipeline
"""

import re
import numpy as np
from pathlib import Path
from email import policy
from email.parser import BytesParser
from bs4 import BeautifulSoup
import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split

# Download required NLTK data
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    print("Downloading NLTK stopwords...")
    nltk.download('stopwords')
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import Perceptron
from sklearn.metrics import classification_report, confusion_matrix
from scipy.sparse import hstack, csr_matrix
import json
import joblib

# -------------------------------------------------------------
# CONFIG
# -------------------------------------------------------------
DATA_DIR = Path(r"C:\Users\manid\Documents\spam_detection\dataset")  # Replace with your actual Enron dataset folder
STOPWORDS = set(stopwords.words('english'))

# -------------------------------------------------------------
# STEP 1: EMAIL PARSING
# -------------------------------------------------------------
def parse_email(file_path: Path) -> str:
    """Safely parse .txt email and return combined Subject + Body."""
    with open(file_path, 'rb') as f:
        msg = BytesParser(policy=policy.default).parse(f)

    subject = msg['subject'] or ''
    body = ''

    if msg.is_multipart():
        for part in msg.walk():
            ctype = part.get_content_type()
            if ctype == 'text/plain':
                body += part.get_content()
            elif ctype == 'text/html' and not body:
                html = part.get_content()
                body += BeautifulSoup(html, 'html.parser').get_text()
    else:
        content_type = msg.get_content_type()
        if content_type == 'text/html':
            body = BeautifulSoup(msg.get_content(), 'html.parser').get_text()
        else:
            body = msg.get_content()

    return f"{subject}\n{body}"

# -------------------------------------------------------------
# STEP 2: CLEAN & NORMALIZE TEXT
# -------------------------------------------------------------
def clean_text(text: str) -> str:
    """Lowercase, strip HTML, remove punctuation, and stem tokens."""
    text = text.lower()
    text = re.sub(r'<[^>]+>', '', text)  # remove HTML tags
    text = re.sub(r'[^a-z0-9\s]', ' ', text)  # keep only alphanumeric
    tokens = text.split()
    ps = PorterStemmer()
    tokens = [ps.stem(w) for w in tokens if w not in STOPWORDS]
    return ' '.join(tokens)

# -------------------------------------------------------------
# STEP 3: LINK / SUSPICIOUS FEATURE EXTRACTION
# -------------------------------------------------------------
def extract_link_features(text: str):
    """Extract numeric link-based features."""
    urls = re.findall(r'https?://\S+', text)
    url_count = len(urls)
    ip_url_count = sum(bool(re.match(r'https?://\d+\.\d+\.\d+\.\d+', u)) for u in urls)
    suspicious_tld_count = sum(u.endswith(('.ru', '.cn', '.tk', '.biz', '.info')) for u in urls)
    shortener_count = sum(any(s in u for s in ['bit.ly', 'tinyurl', 'goo.gl']) for u in urls)
    verify_urgent_count = len(re.findall(r'(verify|urgent).*https?://', text))
    return [url_count, ip_url_count, suspicious_tld_count, shortener_count, verify_urgent_count]

# -------------------------------------------------------------
# STEP 4: LOAD & PROCESS ALL EMAILS
# -------------------------------------------------------------
def load_dataset(base_path: Path):
    texts, link_feats, labels = [], [], []
    for label, folder in enumerate(["ham", "spam"]):
        folder_path = base_path / folder
        for file in folder_path.glob("*.txt"):
            try:
                raw_email = parse_email(file)
                cleaned_text = clean_text(raw_email)
                link_features = extract_link_features(raw_email)
                texts.append(cleaned_text)
                link_feats.append(link_features)
                labels.append(label)
            except Exception as e:
                print(f"Error parsing {file}: {e}")
    return texts, np.array(link_feats), np.array(labels)

# -------------------------------------------------------------
# STEP 5: BUILD FEATURE SPACE (TF-IDF + LINK FEATURES)
# -------------------------------------------------------------
print("Loading and processing emails...")
texts, X_links, y = load_dataset(DATA_DIR)

print("Vectorizing text (TF-IDF)...")
vectorizer = TfidfVectorizer(ngram_range=(1,2), min_df=2, max_features=10000)
X_text = vectorizer.fit_transform(texts)

# Combine TF-IDF (sparse) + Link Features (dense)
X_links_sparse = csr_matrix(X_links)
X = hstack([X_text, X_links_sparse])

print(f"Final feature shape: {X.shape}")

# -------------------------------------------------------------
# STEP 6: SPLIT AND SCALE
# -------------------------------------------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)

# Standardize only numeric link features (last 5 columns)
scaler = StandardScaler(with_mean=False)
X_train_scaled = hstack([X_train[:, :-5], scaler.fit_transform(X_train[:, -5:])])
X_test_scaled = hstack([X_test[:, :-5], scaler.transform(X_test[:, -5:])])

# -------------------------------------------------------------
# STEP 7: TRAIN PERCEPTRON
# -------------------------------------------------------------
print("Training Perceptron model...")
clf = Perceptron(max_iter=50, eta0=1.0, penalty=None, shuffle=True, random_state=42)
clf.fit(X_train_scaled, y_train)

# -------------------------------------------------------------
# STEP 8: EVALUATION
# -------------------------------------------------------------
y_pred = clf.predict(X_test_scaled)

conf_matrix = confusion_matrix(y_test, y_pred)
class_report = classification_report(y_test, y_pred, target_names=['Ham', 'Spam'], output_dict=True)

print("\n=== Confusion Matrix ===")
print(conf_matrix)

print("\n=== Classification Report ===")
print(classification_report(y_test, y_pred, target_names=['Ham', 'Spam']))

# -------------------------------------------------------------
# STEP 9: FEATURE IMPORTANCE (TOP WEIGHTS)
# -------------------------------------------------------------
feature_importance = []
if hasattr(clf, "coef_"):
    feature_names = vectorizer.get_feature_names_out().tolist() + \
                    ['url_count', 'ip_url_count', 'suspicious_tld', 'shortener', 'verify_urgent']
    coefs = clf.coef_[0]
    top_spam = np.argsort(coefs)[-15:][::-1]
    top_ham = np.argsort(coefs)[:15]

    print("\nTop spam-weighted features:")
    for i in top_spam:
        print(f"{feature_names[i]:<20} {coefs[i]:.3f}")
        feature_importance.append({"feature": feature_names[i], "weight": float(coefs[i]), "type": "spam"})

    print("\nTop ham-weighted features:")
    for i in top_ham:
        print(f"{feature_names[i]:<20} {coefs[i]:.3f}")
        feature_importance.append({"feature": feature_names[i], "weight": float(coefs[i]), "type": "ham"})

# Save results to JSON for React frontend
results = {
    "confusion_matrix": conf_matrix.tolist(),
    "classification_report": class_report,
    "feature_importance": feature_importance
}
# Save in main directory
with open("results.json", "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2)

# -------------------------------------------------------------
# STEP 10: SAVE TRAINED ARTIFACTS (MODEL, VECTORIZER, SCALER)
# -------------------------------------------------------------
print("\nSaving trained artifacts to models/ ...")
from pathlib import Path as _Path

MODELS_DIR = _Path(__file__).parent / "models"
MODELS_DIR.mkdir(parents=True, exist_ok=True)

LINK_FEATURE_NAMES = ['url_count', 'ip_url_count', 'suspicious_tld', 'shortener', 'verify_urgent']

artifacts = {
    "vectorizer": vectorizer,
    "scaler": scaler,
    "classifier": clf,
    "link_feature_names": LINK_FEATURE_NAMES,
}

joblib.dump(artifacts, MODELS_DIR / "perceptron_model.joblib")
print(f"Artifacts saved to {MODELS_DIR / 'perceptron_model.joblib'}")
