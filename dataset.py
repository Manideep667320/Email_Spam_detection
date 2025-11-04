import re
import pandas as pd
from pathlib import Path

# --------- USER CONFIG (set to your columns) ---------
CSV_PATH = "enron_spam_data.csv"          # path to your CSV
ID_COL = "Message ID"            # unique identifier column
SUBJECT_COL = "Subject"          # subject column
BODY_COL = "Message"             # body/content column
LABEL_COL = "Spam/Ham"           # label column ("spam"/"ham" or 1/0)
DATE_COL = "Date"                # date column
OUTPUT_ROOT = Path(r"C:\Users\manid\Documents\spam_detection\dataset")    # output directory
ENCODING = "utf-8"               # CSV file encoding
# -----------------------------------------------------

def normalize_label(val):
    if pd.isna(val):
        return None
    s = str(val).strip().lower()
    if s in {"spam", "1", "true", "yes"}:
        return "spam"
    if s in {"ham", "0", "false", "no", "not spam", "legit"}:
        return "ham"
    return None

def clean_text(text):
    if pd.isna(text):
        return ""
    t = str(text).replace("\r\n", "\n").replace("\r", "\n")
    t = re.sub(r"[^\S\n]+", " ", t)             # collapse spaces (keep newlines)
    t = re.sub(r"\u200b|\u200c|\u200d", "", t)  # remove zero-width chars
    return t.strip()

def sanitize_filename(name):
    return re.sub(r"[^A-Za-z0-9_.-]", "_", name)

def main():
    OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)
    (OUTPUT_ROOT / "ham").mkdir(exist_ok=True)
    (OUTPUT_ROOT / "spam").mkdir(exist_ok=True)

    # Read CSV
    df = pd.read_csv(CSV_PATH, encoding=ENCODING)

    # Validate columns
    for col in [SUBJECT_COL, BODY_COL, LABEL_COL]:
        if col not in df.columns:
            raise ValueError(f"Missing required column: {col}")
    # Optional columns
    has_id = ID_COL in df.columns
    has_date = DATE_COL in df.columns

    # Normalize and clean
    df["__label__"] = df[LABEL_COL].apply(normalize_label)
    df["__subject__"] = df[SUBJECT_COL].apply(clean_text)
    df["__body__"] = df[BODY_COL].apply(clean_text)
    if has_id:
        df["__msgid__"] = df[ID_COL].astype(str).fillna("").map(str).map(str.strip)
    if has_date:
        df["__date__"] = df[DATE_COL].astype(str).fillna("").map(str).map(str.strip)

    # Filter
    df = df[df["__label__"].isin({"spam", "ham"})].copy()
    df = df[(df["__subject__"].str.len() > 0) | (df["__body__"].str.len() > 0)].copy()

    # Counters for fallback names
    counters = {"ham": 0, "spam": 0}

    for _, row in df.iterrows():
        label = row["__label__"]
        subject = row["__subject__"]
        body = row["__body__"]
        msg_id = row["__msgid__"] if has_id else ""
        date_str = row["__date__"] if has_date else ""

        # Filename: prefer Message ID if present; fallback to counter
        if has_id and msg_id:
            fname = sanitize_filename(f"{label}_{msg_id}.txt")
        else:
            counters[label] += 1
            fname = f"{label}_{counters[label]:06d}.txt"

        out_path = OUTPUT_ROOT / label / fname

        # Compose file content with simple headers then body
        lines = []
        lines.append(f"Subject: {subject}")
        lines.append(f"Label: {label}")
        if has_date:
            lines.append(f"Date: {date_str}")
        if has_id:
            lines.append(f"Message-ID: {msg_id}")
        lines.append("")  # blank line
        lines.append(body)

        with open(out_path, "w", encoding="utf-8") as f:
            f.write("\n".join(lines))

    print("Conversion complete.")
    print(f"Ham files: {len(list((OUTPUT_ROOT / 'ham').glob('*.txt')))}")
    print(f"Spam files: {len(list((OUTPUT_ROOT / 'spam').glob('*.txt')))}")

if __name__ == "__main__":
    main()
